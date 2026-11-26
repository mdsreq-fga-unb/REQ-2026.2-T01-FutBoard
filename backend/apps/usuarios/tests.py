"""Testes de infraestrutura e do cadastro público de usuários."""

from unittest.mock import patch

from django.apps import apps
from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import identify_hasher, make_password
from django.db import IntegrityError
from django.test import Client, SimpleTestCase, TestCase
from django.urls import reverse
from rest_framework.exceptions import ValidationError

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
