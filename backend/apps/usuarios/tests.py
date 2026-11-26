"""Testes de infraestrutura, cadastro, autenticação e autorização de usuários."""

from datetime import UTC, datetime, timedelta
from unittest.mock import patch

from django.apps import apps
from django.conf import settings
from django.contrib.auth import SESSION_KEY, get_user_model
from django.contrib.auth.hashers import identify_hasher, make_password
from django.contrib.sessions.models import Session
from django.core.cache import cache
from django.db import IntegrityError
from django.test import Client, SimpleTestCase, TestCase, override_settings
from django.urls import reverse
from rest_framework.exceptions import ValidationError

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

    def test_csrf_rejeita_token_ausente_ou_invalido(self):
        cliente = Client(enforce_csrf_checks=True)
        resposta = cliente.post(self.url, self.dados_validos, content_type="application/json")
        self.assertEqual(resposta.status_code, 403)

        cliente.get(reverse("usuarios:csrf"))
        for cabecalhos in ({}, {"HTTP_X_CSRFTOKEN": "token-invalido"}):
            with self.subTest(cabecalhos=cabecalhos):
                resposta = cliente.post(
                    self.url, self.dados_validos, content_type="application/json", **cabecalhos
                )
                self.assertEqual(resposta.status_code, 403)
        self.assertFalse(self.Usuario.objects.exists())

    def test_csrf_aceita_cookie_e_token_de_origem_permitida(self):
        cliente = Client(enforce_csrf_checks=True)
        origem = settings.CORS_ALLOWED_ORIGINS[0]
        csrf = cliente.get(reverse("usuarios:csrf"), HTTP_ORIGIN=origem)

        self.assertEqual(csrf.status_code, 200)
        self.assertIn(settings.CSRF_COOKIE_NAME, csrf.cookies)
        self.assertIn("no-store", csrf.headers["Cache-Control"])
        self.assertEqual(csrf.headers["Access-Control-Allow-Origin"], origem)
        self.assertEqual(csrf.headers["Access-Control-Allow-Credentials"], "true")
        token = csrf.json()["csrfToken"]

        resposta = cliente.post(
            self.url,
            self.dados_validos,
            content_type="application/json",
            HTTP_ORIGIN="https://fora-do-futboard.example",
            HTTP_X_CSRFTOKEN=token,
        )
        self.assertEqual(resposta.status_code, 403)
        self.assertFalse(self.Usuario.objects.exists())

        resposta = cliente.post(
            self.url,
            self.dados_validos,
            content_type="application/json",
            HTTP_ORIGIN=origem,
            HTTP_X_CSRFTOKEN=token,
        )
        self.assertEqual(resposta.status_code, 201)


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

    def test_login_cria_sessao_com_cookie_e_me_retorna_os_mesmos_dados(self):
        resposta = self.login(email="  JOAO@EXAMPLE.COM  ")

        self.assertEqual(resposta.status_code, 200)
        self.assertEqual(resposta.json(), {
            "mensagem": "Login realizado com sucesso.",
            "usuario": {
                "id": self.usuario.pk,
                "nome_completo": "João da Silva",
                "email": "Joao@example.com",
                "situacao": "APROVADA",
                "administrador": False,
            },
        })
        cookie = resposta.cookies[settings.SESSION_COOKIE_NAME]
        self.assertTrue(cookie["httponly"])
        self.assertEqual(cookie["samesite"], "Lax")
        self.assertEqual(bool(cookie["secure"]), settings.SESSION_COOKIE_SECURE)
        self.assertEqual(cookie["max-age"], 10800)
        self.assertNotIn(cookie.value, resposta.content.decode())
        self.assertEqual(self.client.session[SESSION_KEY], str(self.usuario.pk))
        me = self.client.get(self.me_url)
        self.assertEqual(me.status_code, 200)
        self.assertEqual(me.json(), resposta.json()["usuario"])
        self.assertIn("no-store", me.headers["Cache-Control"])

    def test_credenciais_invalidas_tem_a_mesma_resposta(self):
        for dados in ({"email": "inexistente@example.com"}, {"senha": self.senha.strip()}):
            with self.subTest(dados=list(dados)):
                resposta = self.login(**dados)
                self.assertEqual(resposta.status_code, 401)
                self.assertEqual(resposta.json(), {"erro": "E-mail ou senha inválidos."})
                self.assertNotIn(settings.SESSION_COOKIE_NAME, resposta.cookies)

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
                self.assertNotIn(settings.SESSION_COOKIE_NAME, resposta.cookies)

    def test_perfil_aprovado_com_conta_inativa_e_bloqueado(self):
        self.usuario.is_active = False
        self.usuario.save(update_fields=["is_active"])

        resposta = self.login()

        self.assertEqual(resposta.status_code, 403)
        self.assertEqual(resposta.json(), {"erro": "Sua conta está desativada."})
        self.assertNotIn(settings.SESSION_COOKIE_NAME, resposta.cookies)

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

    def test_login_troca_identificador_de_sessao_anonima(self):
        sessao = self.client.session
        sessao["preferencia"] = "valor"
        sessao.save()
        chave_antiga = sessao.session_key

        self.assertEqual(self.login().status_code, 200)
        self.assertNotEqual(self.client.session.session_key, chave_antiga)
        self.assertFalse(Session.objects.filter(session_key=chave_antiga).exists())

    def test_logout_invalida_cookie_anterior_e_pode_ser_repetido(self):
        self.assertEqual(self.login().status_code, 200)
        chave_antiga = self.client.cookies[settings.SESSION_COOKIE_NAME].value

        resposta = self.client.post(self.logout_url)

        self.assertEqual(resposta.status_code, 200)
        self.assertEqual(resposta.json(), {"mensagem": "Logout realizado com sucesso."})
        self.assertFalse(Session.objects.filter(session_key=chave_antiga).exists())
        self.client.cookies[settings.SESSION_COOKIE_NAME] = chave_antiga
        self.assertEqual(self.client.get(self.me_url).status_code, 403)
        self.assertEqual(self.client.post(self.logout_url).status_code, 200)
        self.perfil.refresh_from_db()
        self.assertEqual(self.perfil.situacao, "APROVADA")

    def test_me_nega_acesso_anonimo(self):
        self.assertEqual(self.client.get(self.me_url).status_code, 403)

    def test_sessao_expira_apos_tres_horas_sem_atividade(self):
        inicio = datetime(2026, 11, 26, 12, tzinfo=UTC)
        with patch("django.utils.timezone.now", return_value=inicio):
            self.assertEqual(self.login().status_code, 200)
        with patch("django.utils.timezone.now", return_value=inicio + timedelta(hours=3)):
            self.assertEqual(self.client.get(self.me_url).status_code, 403)
            self.assertEqual(self.client.get(self.ciclos_url).status_code, 403)

    def test_atividade_valida_renova_sessao_e_resposta_bloqueada_nao_renova(self):
        inicio = datetime(2026, 11, 26, 12, tzinfo=UTC)
        with patch("django.utils.timezone.now", return_value=inicio):
            self.assertEqual(self.login().status_code, 200)
        chave = self.client.cookies[settings.SESSION_COOKIE_NAME].value

        with patch("django.utils.timezone.now", return_value=inicio + timedelta(hours=2)):
            resposta = self.client.get(self.ciclos_url)
            self.assertEqual(resposta.status_code, 200)
            self.assertEqual(resposta.cookies[settings.SESSION_COOKIE_NAME]["max-age"], 10800)
        sessao = Session.objects.get(session_key=chave)
        self.assertEqual(sessao.expire_date, inicio + timedelta(hours=5))

        with patch("django.utils.timezone.now", return_value=inicio + timedelta(hours=4)):
            resposta = self.client.post(self.ciclos_url, {}, content_type="application/json")
            self.assertEqual(resposta.status_code, 400)
        sessao.refresh_from_db()
        self.assertEqual(sessao.expire_date, inicio + timedelta(hours=5))
        with patch("django.utils.timezone.now", return_value=inicio + timedelta(hours=5)):
            self.assertEqual(self.client.get(self.ciclos_url).status_code, 403)

    def test_todas_as_rotas_de_negocio_exigem_autorizacao_para_leitura_e_escrita(self):
        for namespace, rotas in (("ciclos", rotas_ciclos), ("treinos", rotas_treinos)):
            for rota in rotas:
                kwargs = {"pk": 1} if "pk" in rota.pattern.converters else {}
                url = reverse(f"{namespace}:{rota.name}", kwargs=kwargs)
                for metodo in ("get", "post", "put", "patch", "delete"):
                    if hasattr(rota.callback.cls, metodo):
                        with self.subTest(url=url, metodo=metodo):
                            resposta = getattr(self.client, metodo)(url)
                            self.assertEqual(resposta.status_code, 403)

    def test_aprovado_acessa_ciclos_e_treinos_e_pode_escrever(self):
        self.assertEqual(self.login().status_code, 200)
        self.assertEqual(self.client.get(self.ciclos_url).status_code, 200)
        self.assertEqual(self.client.get(self.treinos_url).status_code, 200)
        resposta = self.client.post(self.ciclos_url, {
            "nome": "Temporada 2026", "data_inicio": "2026-01-01", "data_termino": "2026-12-31"
        }, content_type="application/json")
        self.assertEqual(resposta.status_code, 201)

    def test_sessao_perde_acesso_quando_perfil_deixa_de_estar_aprovado(self):
        for situacao, url in (
            ("PENDENTE", self.treinos_url), ("RECUSADA", self.me_url), ("REVOGADA", self.ciclos_url)
        ):
            with self.subTest(situacao=situacao):
                self.alterar_situacao("APROVADA")
                self.assertEqual(self.login().status_code, 200)
                chave = self.client.cookies[settings.SESSION_COOKIE_NAME].value
                self.alterar_situacao(situacao)

                resposta = self.client.get(url)

                self.assertEqual(resposta.status_code, 403)
                self.assertEqual(resposta.json()["codigo"], "acesso_revogado")
                self.assertFalse(Session.objects.filter(session_key=chave).exists())
                self.client.cookies[settings.SESSION_COOKIE_NAME] = chave
                self.assertEqual(self.client.get(self.me_url).status_code, 403)

    def test_sessao_perde_acesso_quando_usuario_e_desativado(self):
        self.assertEqual(self.login().status_code, 200)
        chave = self.client.cookies[settings.SESSION_COOKIE_NAME].value
        self.usuario.is_active = False
        self.usuario.save(update_fields=["is_active"])

        resposta = self.client.get(self.me_url)

        self.assertEqual(resposta.status_code, 403)
        self.assertFalse(Session.objects.filter(session_key=chave).exists())

    def test_login_e_logout_exigem_csrf_e_login_rotaciona_o_token(self):
        cliente = Client(enforce_csrf_checks=True)
        origem = settings.CORS_ALLOWED_ORIGINS[0]
        self.assertEqual(self.login(cliente, HTTP_ORIGIN=origem).status_code, 403)

        csrf_url = reverse("usuarios:csrf")
        csrf = cliente.get(csrf_url, HTTP_ORIGIN=origem)
        token_antigo = csrf.json()["csrfToken"]
        resposta = self.login(cliente, HTTP_ORIGIN=origem, HTTP_X_CSRFTOKEN=token_antigo)
        self.assertEqual(resposta.status_code, 200)
        self.assertIn(settings.CSRF_COOKIE_NAME, resposta.cookies)
        self.assertEqual(resposta.headers["Access-Control-Allow-Credentials"], "true")

        self.assertEqual(cliente.post(self.logout_url, HTTP_ORIGIN=origem).status_code, 403)
        resposta = cliente.post(self.logout_url, HTTP_ORIGIN=origem, HTTP_X_CSRFTOKEN=token_antigo)
        self.assertEqual(resposta.status_code, 403)
        self.assertEqual(cliente.get(self.me_url).status_code, 200)

        token_atual = cliente.get(csrf_url, HTTP_ORIGIN=origem).json()["csrfToken"]
        resposta = cliente.post(self.logout_url, HTTP_ORIGIN=origem, HTTP_X_CSRFTOKEN=token_atual)
        self.assertEqual(resposta.status_code, 200)
        self.assertEqual(cliente.get(self.me_url).status_code, 403)

    def test_operacoes_de_escrita_com_sessao_exigem_csrf(self):
        cliente = Client(enforce_csrf_checks=True)
        cliente.force_login(self.usuario)

        self.assertEqual(cliente.post(self.ciclos_url, {}).status_code, 403)
        self.assertEqual(cliente.patch(reverse("treinos:sessao-detail", args=[1])).status_code, 403)
        token = cliente.get(reverse("usuarios:csrf")).json()["csrfToken"]
        resposta = cliente.post(self.ciclos_url, {
            "nome": "Temporada 2026", "data_inicio": "2026-01-01", "data_termino": "2026-12-31"
        }, content_type="application/json", HTTP_X_CSRFTOKEN=token)
        self.assertEqual(resposta.status_code, 201)

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
