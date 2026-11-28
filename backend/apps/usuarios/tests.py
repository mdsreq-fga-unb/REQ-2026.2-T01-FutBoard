"""Testes de infraestrutura, cadastro, autenticação e autorização de usuários."""

from concurrent.futures import ThreadPoolExecutor
from datetime import timedelta
from threading import Barrier
from unittest import skipUnless
from unittest.mock import patch

from django.apps import apps
from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import identify_hasher, make_password
from django.contrib.sessions.models import Session
from django.core.cache import cache
from django.db import IntegrityError, connection, connections
from django.test import Client, SimpleTestCase, TestCase, TransactionTestCase, override_settings
from django.urls import reverse
from rest_framework.exceptions import ValidationError
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken, OutstandingToken
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken

from apps.ciclos.urls import urlpatterns as rotas_ciclos
from apps.treinos.urls import urlpatterns as rotas_treinos

from .models import PerfilAcesso
from .serializers import CadastroSerializer


class UsuariosInfraTests(SimpleTestCase):
    """Valida o registro da aplicação usuarios e o uso de bcrypt como hasher padrão (RNF01)."""

    def test_app_usuarios_registered(self):
        app_config = apps.get_app_config("usuarios")
        self.assertEqual(app_config.name, "apps.usuarios")

    def test_bcrypt_password_hasher_configured(self):
        self.assertEqual(
            settings.PASSWORD_HASHERS[0],
            "django.contrib.auth.hashers.BCryptSHA256PasswordHasher",
        )
        hashed = make_password("senha-teste-futboard")
        self.assertTrue(hashed.startswith("bcrypt_sha256$"))


class CadastroTests(TestCase):
    dados_validos = {
        "nome_completo": "João da Silva",
        "email": "joao@example.com",
        "senha": "SenhaSegura#2026",
        "confirmacao_senha": "SenhaSegura#2026",
    }

    def setUp(self):
        self.url = reverse("usuarios:cadastro")
        self.Usuario = get_user_model()

    def cadastrar(self, **campos):
        return self.client.post(
            self.url, self.dados_validos | campos, content_type="application/json"
        )

    def test_cadastro_valido_normaliza_nome_e_email(self):
        resposta = self.cadastrar(
            nome_completo="  João \t da   Silva  ", email="  JOAO@EXAMPLE.COM  "
        )

        self.assertEqual(resposta.status_code, 201)
        usuario = self.Usuario.objects.get(username="joao@example.com")
        self.assertEqual(usuario.email, "joao@example.com")
        self.assertEqual(usuario.perfil_acesso.nome_completo, "João da Silva")
        self.assertEqual(usuario.perfil_acesso.situacao, PerfilAcesso.Situacao.PENDENTE)
        self.assertEqual(usuario.first_name, "João")
        self.assertEqual(usuario.last_name, "da Silva")

    def test_senha_armazenada_com_bcrypt_e_espacos_preservados(self):
        senha = "  SenhaSegura#2026  "
        resposta = self.cadastrar(senha=senha, confirmacao_senha=senha)

        self.assertEqual(resposta.status_code, 201)
        usuario = self.Usuario.objects.get(username=self.dados_validos["email"])
        self.assertNotEqual(usuario.password, senha)
        self.assertEqual(identify_hasher(usuario.password).algorithm, "bcrypt_sha256")
        self.assertTrue(usuario.check_password(senha))
        self.assertFalse(usuario.check_password(senha.strip()))

    def test_cadastro_ignora_campos_de_privilegio_e_nao_cria_sessao(self):
        resposta = self.cadastrar(
            is_staff=True, is_superuser=True, is_active=True, situacao="APROVADA"
        )

        self.assertEqual(resposta.status_code, 201)
        usuario = self.Usuario.objects.get(username=self.dados_validos["email"])
        self.assertFalse(usuario.is_staff)
        self.assertFalse(usuario.is_superuser)
        self.assertFalse(usuario.is_active)
        self.assertEqual(usuario.perfil_acesso.situacao, PerfilAcesso.Situacao.PENDENTE)
        self.assertNotIn(settings.SESSION_COOKIE_NAME, resposta.cookies)

    def test_resposta_de_sucesso_contem_apenas_mensagem_e_situacao(self):
        resposta = self.cadastrar()

        self.assertEqual(resposta.status_code, 201)
        self.assertEqual(resposta.json(), {
            "mensagem": "Cadastro realizado com sucesso. Aguarde a aprovação do treinador.",
            "situacao": "PENDENTE",
        })

    def test_email_duplicado_com_ou_sem_maiusculas(self):
        self.assertEqual(self.cadastrar().status_code, 201)

        for email in ("joao@example.com", "JOAO@example.com"):
            with self.subTest(email=email):
                resposta = self.cadastrar(email=email)
                self.assertEqual(resposta.status_code, 400)
                self.assertIn("email", resposta.json())
        self.assertEqual(self.Usuario.objects.count(), 1)
        self.assertEqual(PerfilAcesso.objects.count(), 1)

    def test_email_ja_utilizado_por_usuario_preexistente(self):
        self.Usuario.objects.create_user(username="treinador", email="JOAO@Example.com")

        resposta = self.cadastrar()

        self.assertEqual(resposta.status_code, 400)
        self.assertIn("email", resposta.json())
        self.assertFalse(PerfilAcesso.objects.exists())

    def test_email_normalizado_tambem_no_username(self):
        resposta = self.cadastrar(email="Ｊoao@example.com")

        self.assertEqual(resposta.status_code, 201)
        usuario = self.Usuario.objects.get(username="joao@example.com")
        self.assertEqual(usuario.email, usuario.username)
        self.assertEqual(self.cadastrar().status_code, 400)

    def test_campos_invalidos(self):
        casos = [
            ("email", "email-invalido"),
            ("email", "a" * 140 + "@example.com"),
            ("nome_completo", " \t "),
            ("nome_completo", "a" * 151),
            ("nome_completo", 123),
            ("senha", ""),
            ("senha", 1234567890),
            ("confirmacao_senha", ""),
            ("confirmacao_senha", 1234567890),
        ]
        for campo, valor in casos:
            with self.subTest(campo=campo, valor=valor):
                resposta = self.cadastrar(**{campo: valor})
                self.assertEqual(resposta.status_code, 400)
                self.assertIn(campo, resposta.json())
        self.assertFalse(self.Usuario.objects.exists())

    def test_limite_do_nome_e_aplicado_apos_normalizacao(self):
        nome = "a" * 100 + " " + "b" * 49
        resposta = self.cadastrar(nome_completo=nome.replace(" ", " " * 60))

        self.assertEqual(resposta.status_code, 201)
        self.assertEqual(PerfilAcesso.objects.get().nome_completo, nome)

    def test_senhas_diferentes_inclusive_quando_so_os_espacos_diferem(self):
        for confirmacao in ("OutraSenha#2026", self.dados_validos["senha"] + " "):
            with self.subTest(confirmacao=confirmacao):
                resposta = self.cadastrar(confirmacao_senha=confirmacao)
                self.assertEqual(resposta.status_code, 400)
                self.assertIn("confirmacao_senha", resposta.json())
        self.assertFalse(self.Usuario.objects.exists())

    def test_senha_rejeitada_pelos_validadores_do_django(self):
        for senha in ("123", "password", "1234567890", "joao@example.com", "Sobrenome"):
            with self.subTest(senha=senha):
                resposta = self.cadastrar(
                    nome_completo="João Sobrenome", senha=senha, confirmacao_senha=senha
                )
                self.assertEqual(resposta.status_code, 400)
                self.assertIn("senha", resposta.json())
        self.assertFalse(self.Usuario.objects.exists())

    def test_todos_os_campos_sao_obrigatorios(self):
        for campo in self.dados_validos:
            with self.subTest(campo=campo):
                dados = self.dados_validos.copy()
                del dados[campo]
                resposta = self.client.post(self.url, dados, content_type="application/json")
                self.assertEqual(resposta.status_code, 400)
                self.assertIn(campo, resposta.json())
        self.assertFalse(self.Usuario.objects.exists())

    def test_get_nao_realiza_cadastro(self):
        self.assertEqual(self.client.get(self.url).status_code, 405)
        self.assertFalse(self.Usuario.objects.exists())

    def test_falha_no_perfil_reverte_usuario_e_oculta_detalhe_do_banco(self):
        with patch.object(
            PerfilAcesso.objects, "create", side_effect=IntegrityError("detalhe interno")
        ):
            resposta = self.cadastrar()

        self.assertEqual(resposta.status_code, 500)
        self.assertEqual(resposta.json(), {"detail": "Não foi possível concluir o cadastro."})
        self.assertFalse(self.Usuario.objects.exists())
        self.assertFalse(PerfilAcesso.objects.exists())

    def test_restricao_de_username_trata_duas_validacoes_anteriores_a_gravacao(self):
        primeiro = CadastroSerializer(data=self.dados_validos)
        segundo = CadastroSerializer(data=self.dados_validos | {"email": "JOAO@EXAMPLE.COM"})
        primeiro.is_valid(raise_exception=True)
        segundo.is_valid(raise_exception=True)
        primeiro.save()

        with self.assertRaises(ValidationError) as erro:
            segundo.save()

        self.assertIn("email", erro.exception.detail)
        self.assertEqual(self.Usuario.objects.count(), 1)
        self.assertEqual(PerfilAcesso.objects.count(), 1)

    @override_settings(CORS_ALLOWED_ORIGINS=["https://frontend.example.com"])
    def test_cadastro_publico_funciona_sem_cookie_ou_csrf(self):
        cliente = Client(enforce_csrf_checks=True)
        resposta = cliente.post(
            self.url,
            self.dados_validos,
            content_type="application/json",
            HTTP_ORIGIN="https://frontend.example.com",
        )
        self.assertEqual(resposta.status_code, 201)
        self.assertEqual(resposta.headers["Access-Control-Allow-Origin"], "https://frontend.example.com")
        self.assertNotIn("Access-Control-Allow-Credentials", resposta.headers)
        self.assertFalse(resposta.cookies)


@override_settings(CACHES={
    "default": {
        "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
        "LOCATION": "testes-us28",
    },
})
class LoginTests(TestCase):
    senha = "  SenhaSegura#2026  "
    email = "joao@example.com"

    @classmethod
    def setUpTestData(cls):
        cls.usuario = get_user_model().objects.create_user(
            username="Joao", email="Joao@Example.com", password=cls.senha
        )
        cls.perfil = PerfilAcesso.objects.create(
            usuario=cls.usuario, nome_completo="João da Silva", situacao="APROVADA"
        )

    def setUp(self):
        cache.clear()
        self.login_url = reverse("usuarios:login")
        self.refresh_url = reverse("usuarios:token-refresh")
        self.logout_url = reverse("usuarios:logout")
        self.me_url = reverse("usuarios:me")
        self.ciclos_url = reverse("ciclos:macrociclo-list-create")
        self.treinos_url = reverse("treinos:sessao-list-create")

    def login(self, cliente=None, email=None, senha=None, **headers):
        return (cliente or self.client).post(
            self.login_url,
            {"email": email or self.email, "senha": self.senha if senha is None else senha},
            content_type="application/json",
            **headers,
        )

    def alterar_situacao(self, situacao):
        PerfilAcesso.objects.filter(pk=self.perfil.pk).update(situacao=situacao)

    def autorizar(self, access, cliente=None):
        (cliente or self.client).defaults["HTTP_AUTHORIZATION"] = f"Bearer {access}"

    def enviar_refresh(self, url, token, cliente=None):
        return (cliente or self.client).post(
            url, {"refresh": token}, content_type="application/json"
        )

    def test_login_emite_jwt_e_me_retorna_os_mesmos_dados(self):
        resposta = self.login(email="  JOAO@EXAMPLE.COM  ")

        self.assertEqual(resposta.status_code, 200)
        dados = resposta.json().copy()
        access = AccessToken(dados.pop("access"))
        refresh = RefreshToken(dados.pop("refresh"))
        self.assertEqual(dados, {
            "mensagem": "Login realizado com sucesso.",
            "usuario": {
                "id": self.usuario.pk,
                "nome_completo": "João da Silva",
                "email": "Joao@example.com",
                "situacao": "APROVADA",
                "administrador": False,
            },
        })
        self.assertEqual(access["user_id"], str(self.usuario.pk))
        self.assertEqual(refresh["user_id"], str(self.usuario.pk))
        self.assertEqual(access["exp"] - access["iat"], 300)
        self.assertEqual(refresh["exp"] - refresh["iat"], 10800)
        self.assertFalse(resposta.cookies)
        self.assertFalse(Session.objects.exists())
        self.assertIn("no-store", resposta.headers["Cache-Control"])
        self.autorizar(resposta.json()["access"])
        me = self.client.get(self.me_url)
        self.assertEqual(me.status_code, 200)
        self.assertEqual(me.json(), dados["usuario"])
        self.assertIn("no-store", me.headers["Cache-Control"])

    def test_credenciais_invalidas_tem_a_mesma_resposta(self):
        for dados in ({"email": "inexistente@example.com"}, {"senha": self.senha.strip()}):
            with self.subTest(dados=list(dados)):
                resposta = self.login(**dados)
                self.assertEqual(resposta.status_code, 401)
                self.assertEqual(resposta.json(), {"erro": "E-mail ou senha inválidos."})
        self.assertFalse(OutstandingToken.objects.exists())

    def test_campos_invalidos_ou_ausentes(self):
        casos = (
            ({"senha": self.senha}, "email"),
            ({"email": self.email}, "senha"),
            ({"email": "email-invalido", "senha": self.senha}, "email"),
            ({"email": self.email, "senha": 123}, "senha"),
            ({"email": self.email, "senha": ""}, "senha"),
        )
        for dados, campo in casos:
            with self.subTest(campo=campo):
                resposta = self.client.post(self.login_url, dados, content_type="application/json")
                self.assertEqual(resposta.status_code, 400)
                self.assertIn(campo, resposta.json())

    def test_contas_bloqueadas_so_revelam_situacao_com_senha_correta(self):
        self.usuario.is_active = False
        self.usuario.save(update_fields=["is_active"])
        casos = {
            "PENDENTE": "Seu cadastro ainda está aguardando aprovação do treinador.",
            "RECUSADA": "Sua solicitação de acesso não foi aprovada.",
            "REVOGADA": "Seu acesso ao FutBoard foi revogado.",
        }
        for situacao, mensagem in casos.items():
            with self.subTest(situacao=situacao):
                self.alterar_situacao(situacao)
                self.assertEqual(self.login(senha="inválida").status_code, 401)
                resposta = self.login()
                self.assertEqual(resposta.status_code, 403)
                self.assertEqual(resposta.json(), {"erro": mensagem})
        self.assertFalse(OutstandingToken.objects.exists())

    def test_perfil_aprovado_com_conta_inativa_e_bloqueado(self):
        self.usuario.is_active = False
        self.usuario.save(update_fields=["is_active"])

        resposta = self.login()

        self.assertEqual(resposta.status_code, 403)
        self.assertEqual(resposta.json(), {"erro": "Sua conta está desativada."})
        self.assertFalse(OutstandingToken.objects.exists())

    def test_cadastro_publico_so_permite_login_apos_aprovacao_e_ativacao(self):
        dados = CadastroTests.dados_validos | {"email": "membro@example.com"}
        cadastro = self.client.post(
            reverse("usuarios:cadastro"), dados, content_type="application/json"
        )
        self.assertEqual(cadastro.status_code, 201)
        self.assertEqual(self.login(email=dados["email"], senha=dados["senha"]).status_code, 403)

        usuario = get_user_model().objects.get(email=dados["email"])
        PerfilAcesso.objects.filter(usuario=usuario).update(situacao="APROVADA")
        usuario.is_active = True
        usuario.save(update_fields=["is_active"])

        self.assertEqual(self.login(email=dados["email"], senha=dados["senha"]).status_code, 200)

    def test_apenas_superusuario_ativo_pode_entrar_sem_perfil(self):
        Usuario = get_user_model()
        Usuario.objects.create_user(
            username="staff", email="staff@example.com", password=self.senha, is_staff=True
        )
        treinador = Usuario.objects.create_superuser(
            username="treinador", email="TREINADOR@Example.com", password=self.senha
        )
        self.assertEqual(self.login(email="staff@example.com").status_code, 403)

        resposta = self.login(email="treinador@example.com")
        self.assertEqual(resposta.status_code, 200)
        self.assertEqual(resposta.json()["usuario"]["id"], treinador.pk)
        self.assertEqual(resposta.json()["usuario"]["situacao"], "APROVADA")
        self.assertIs(resposta.json()["usuario"]["administrador"], True)
        self.autorizar(resposta.json()["access"])
        self.assertEqual(self.client.get(self.treinos_url).status_code, 200)

        perfil = PerfilAcesso.objects.create(
            usuario=treinador, nome_completo="Treinador responsável", situacao="APROVADA"
        )
        self.assertEqual(self.client.get(self.me_url).json()["nome_completo"], perfil.nome_completo)

        perfil.situacao = "REVOGADA"
        perfil.save(update_fields=["situacao"])
        self.assertEqual(self.client.get(self.me_url).status_code, 403)
        self.assertEqual(self.login(email="treinador@example.com").status_code, 403)

    def test_email_ambiguo_nao_autentica_nenhuma_conta(self):
        get_user_model().objects.create_user(username="outro", email="JOAO@example.com")

        resposta = self.login()

        self.assertEqual(resposta.status_code, 401)
        self.assertEqual(resposta.json(), {"erro": "E-mail ou senha inválidos."})

    def test_todas_as_rotas_de_negocio_exigem_autorizacao_para_leitura_e_escrita(self):
        for namespace, rotas in (("ciclos", rotas_ciclos), ("treinos", rotas_treinos)):
            for rota in rotas:
                kwargs = {"pk": 1} if "pk" in rota.pattern.converters else {}
                url = reverse(f"{namespace}:{rota.name}", kwargs=kwargs)
                for metodo in ("get", "post", "put", "patch", "delete"):
                    if hasattr(rota.callback.cls, metodo):
                        with self.subTest(url=url, metodo=metodo):
                            resposta = getattr(self.client, metodo)(url)
                            self.assertEqual(resposta.status_code, 401)

    def test_aprovado_acessa_ciclos_e_treinos_e_pode_escrever(self):
        cliente = Client(enforce_csrf_checks=True)
        login = self.login(cliente)
        self.assertEqual(login.status_code, 200)
        self.autorizar(login.json()["access"], cliente)
        self.assertEqual(cliente.get(self.ciclos_url).status_code, 200)
        self.assertEqual(cliente.get(self.treinos_url).status_code, 200)
        resposta = cliente.post(self.ciclos_url, {
            "nome": "Temporada 2026", "data_inicio": "2026-01-01", "data_termino": "2026-12-31"
        }, content_type="application/json")
        self.assertEqual(resposta.status_code, 201)

    def test_me_rejeita_tokens_expirados_modificados_ou_do_tipo_errado(self):
        tokens = self.login().json()
        expirado = AccessToken.for_user(self.usuario)
        expirado.set_exp(lifetime=-timedelta(minutes=1))
        cabecalho, dados, assinatura = tokens["access"].split(".")
        primeira_letra = "a" if assinatura.startswith("b") else "b"
        modificado = f"{cabecalho}.{dados}.{primeira_letra}{assinatura[1:]}"

        for token in (str(expirado), modificado, tokens["refresh"]):
            self.autorizar(token)
            resposta = self.client.get(self.me_url)
            self.assertEqual(resposta.status_code, 401)
            self.assertTrue(resposta.headers["WWW-Authenticate"].startswith("Bearer"))

    def test_renovacao_rotaciona_refresh_e_rejeita_o_anterior(self):
        cliente = Client(enforce_csrf_checks=True)
        tokens = self.login(cliente).json()

        resposta = self.enviar_refresh(self.refresh_url, tokens["refresh"], cliente)

        self.assertEqual(resposta.status_code, 200)
        self.assertIn("no-store", resposta.headers["Cache-Control"])
        renovados = resposta.json()
        self.assertNotEqual(renovados["access"], tokens["access"])
        self.assertNotEqual(renovados["refresh"], tokens["refresh"])
        self.assertEqual(self.enviar_refresh(self.refresh_url, tokens["refresh"]).status_code, 401)
        refresh = RefreshToken(renovados["refresh"])
        self.assertEqual(refresh["exp"] - refresh["iat"], 10800)
        self.autorizar(renovados["access"], cliente)
        self.assertEqual(cliente.get(self.me_url).status_code, 200)

    def test_renovacao_rejeita_refresh_expirado_ou_invalido(self):
        expirado = RefreshToken.for_user(self.usuario)
        expirado.set_exp(lifetime=-timedelta(minutes=1))
        for token in (str(expirado), "token-invalido", str(AccessToken.for_user(self.usuario))):
            self.assertEqual(self.enviar_refresh(self.refresh_url, token).status_code, 401)
        self.assertEqual(self.client.post(self.refresh_url, {}).status_code, 400)

    def test_conta_perde_acesso_e_renovacao_quando_deixa_de_estar_aprovada(self):
        tokens = self.login().json()
        self.autorizar(tokens["access"])
        for situacao, url in (
            ("PENDENTE", self.treinos_url), ("RECUSADA", self.me_url), ("REVOGADA", self.ciclos_url)
        ):
            with self.subTest(situacao=situacao):
                self.alterar_situacao(situacao)

                acesso = self.client.get(url)
                renovacao = self.enviar_refresh(self.refresh_url, tokens["refresh"])

                for resposta in (acesso, renovacao):
                    self.assertEqual(resposta.status_code, 403)
                    self.assertEqual(resposta.json()["codigo"], "acesso_revogado")
        self.assertEqual(OutstandingToken.objects.count(), 1)

    def test_usuario_desativado_perde_acesso_e_renovacao(self):
        tokens = self.login().json()
        self.autorizar(tokens["access"])
        self.usuario.is_active = False
        self.usuario.save(update_fields=["is_active"])

        self.assertEqual(self.client.get(self.me_url).status_code, 401)
        self.assertEqual(self.enviar_refresh(self.refresh_url, tokens["refresh"]).status_code, 401)
        self.assertEqual(OutstandingToken.objects.count(), 1)

    def test_alteracao_de_senha_invalida_o_par_emitido(self):
        tokens = self.login().json()
        self.autorizar(tokens["access"])
        self.usuario.set_password("NovaSenha#2026")
        self.usuario.save(update_fields=["password"])

        self.assertEqual(self.client.get(self.me_url).status_code, 401)
        self.assertEqual(self.enviar_refresh(self.refresh_url, tokens["refresh"]).status_code, 401)

    def test_logout_revoga_refresh_sem_invalidar_o_access_ja_emitido(self):
        cliente = Client(enforce_csrf_checks=True)
        tokens = self.login(cliente).json()
        refresh = RefreshToken(tokens["refresh"])

        resposta = self.enviar_refresh(self.logout_url, tokens["refresh"], cliente)

        self.assertEqual(resposta.status_code, 200)
        self.assertEqual(resposta.json(), {})
        self.assertTrue(BlacklistedToken.objects.filter(token__jti=refresh["jti"]).exists())
        self.assertEqual(self.enviar_refresh(self.refresh_url, tokens["refresh"]).status_code, 401)
        self.assertEqual(self.enviar_refresh(self.logout_url, tokens["refresh"]).status_code, 401)
        self.assertEqual(self.enviar_refresh(self.logout_url, tokens["access"]).status_code, 401)
        self.assertEqual(self.client.post(self.logout_url, {}).status_code, 400)
        self.autorizar(tokens["access"], cliente)
        self.assertEqual(cliente.get(self.me_url).status_code, 200)

    def test_cookies_do_admin_nao_autenticam_api_e_admin_mantem_csrf(self):
        cliente = Client(enforce_csrf_checks=True)
        administrador = get_user_model().objects.create_superuser(username="treinador")
        cliente.force_login(administrador, backend="django.contrib.auth.backends.ModelBackend")

        self.assertEqual(cliente.get(reverse("admin:index")).status_code, 200)
        self.assertEqual(cliente.get(self.me_url).status_code, 401)
        self.assertEqual(cliente.post(reverse("admin:logout")).status_code, 403)

    @override_settings(CORS_ALLOWED_ORIGINS=["https://frontend.example.com"])
    def test_cors_permite_preflight_bearer_apenas_para_origem_configurada(self):
        origem = "https://frontend.example.com"
        for solicitante in (origem, "https://fora.example.com"):
            resposta = self.client.options(
                self.me_url,
                HTTP_ORIGIN=solicitante,
                HTTP_ACCESS_CONTROL_REQUEST_METHOD="GET",
                HTTP_ACCESS_CONTROL_REQUEST_HEADERS="authorization",
            )
            if solicitante == origem:
                self.assertEqual(resposta.headers["Access-Control-Allow-Origin"], origem)
                self.assertIn("authorization", resposta.headers["Access-Control-Allow-Headers"])
            else:
                self.assertNotIn("Access-Control-Allow-Origin", resposta.headers)

    def test_healthcheck_e_raiz_continuam_publicos(self):
        for nome in ("api-root", "api-health"):
            self.assertEqual(self.client.get(reverse(nome)).status_code, 200)
            self.assertEqual(
                self.client.get(reverse(nome), HTTP_AUTHORIZATION="Bearer invalido").status_code,
                200,
            )

    def test_limita_tentativas_por_ip_sem_bloqueio_permanente(self):
        with patch("apps.usuarios.throttles.LoginThrottle.timer", return_value=1000) as timer:
            for _ in range(10):
                self.assertEqual(self.login(senha="inválida").status_code, 401)
            resposta = self.login(HTTP_X_FORWARDED_FOR="192.0.2.10")
            self.assertEqual(resposta.status_code, 429)
            self.assertEqual(resposta.headers["Retry-After"], "60")
            self.assertEqual(self.login(REMOTE_ADDR="192.0.2.20").status_code, 200)
            timer.return_value = 1061
            self.assertEqual(self.login().status_code, 200)


@skipUnless(connection.vendor == "postgresql", "O teste exige bloqueio de linha do PostgreSQL.")
class RenovacaoConcorrenteTests(TransactionTestCase):
    def test_refresh_concorrente_so_emite_um_novo_par(self):
        usuario = get_user_model().objects.create_user(username="comissao")
        PerfilAcesso.objects.create(usuario=usuario, nome_completo="Comissão", situacao="APROVADA")
        refresh = str(RefreshToken.for_user(usuario))
        url = reverse("usuarios:token-refresh")
        inicio = Barrier(2)

        def renovar():
            try:
                inicio.wait(timeout=5)
                return Client().post(url, {"refresh": refresh}, content_type="application/json")
            finally:
                connections.close_all()

        with ThreadPoolExecutor(max_workers=2) as executor:
            pedidos = [executor.submit(renovar) for _ in range(2)]
            respostas = [pedido.result(timeout=10) for pedido in pedidos]

        self.assertCountEqual([resposta.status_code for resposta in respostas], [200, 401])
        self.assertEqual(OutstandingToken.objects.count(), 2)
        self.assertEqual(BlacklistedToken.objects.count(), 1)
