from unittest.mock import patch

from django.contrib.admin.helpers import ACTION_CHECKBOX_NAME
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Permission
from django.core.cache import cache
from django.db import IntegrityError
from django.db.models import QuerySet
from django.test import Client, TestCase, override_settings
from django.urls import reverse

from .models import PerfilAcesso

Situacao = PerfilAcesso.Situacao


@override_settings(
    CACHES={
        "default": {
            "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
            "LOCATION": "testes-admin-usuarios",
        },
    }
)
class PerfilAcessoAdminTests(TestCase):
    email = "analista@example.com"
    senha = "Senha!Preparacao42"

    @classmethod
    def setUpTestData(cls):
        cls.admin = get_user_model().objects.create_superuser(username="treinador")

    def setUp(self):
        cache.clear()
        self.usuarios = Client()
        resposta = self.usuarios.post(
            reverse("usuarios:cadastro"),
            {
                "nome_completo": "Membro da comissão",
                "email": self.email,
                "senha": self.senha,
                "confirmacao_senha": self.senha,
            },
            content_type="application/json",
        )
        self.assertEqual(resposta.status_code, 201)
        self.usuario = get_user_model().objects.get(email=self.email)
        self.perfil = self.usuario.perfil_acesso
        self.lista = reverse("admin:usuarios_perfilacesso_changelist")
        self.client.force_login(self.admin)

    def acao(self, nome, cliente=None):
        return (cliente or self.client).post(
            self.lista, {"action": nome, ACTION_CHECKBOX_NAME: [self.perfil.pk], "index": 0}
        )

    def login_api(self):
        return self.usuarios.post(
            reverse("usuarios:login"),
            {"email": self.email, "senha": self.senha},
            content_type="application/json",
        )

    def assert_estado(self, situacao, ativo):
        self.usuario.refresh_from_db()
        self.perfil.refresh_from_db()
        self.assertEqual(self.perfil.situacao, situacao)
        self.assertIs(self.usuario.is_active, ativo)

    def test_admin_encontra_perfil_pendente_e_inativo(self):
        self.assert_estado(Situacao.PENDENTE, False)
        resposta = self.client.get(self.lista, {"situacao__exact": Situacao.PENDENTE})

        self.assertContains(resposta, self.email)
        self.assertContains(resposta, "Conta ativa")
        self.assertEqual(self.login_api().status_code, 403)

    def test_admin_aprova_conta_e_libera_login(self):
        self.assertRedirects(self.acao("aprovar"), self.lista)

        self.assert_estado(Situacao.APROVADA, True)
        resposta = self.login_api()
        self.assertEqual(resposta.status_code, 200)
        self.assertIn("access", resposta.json())

    def test_admin_recusa_conta_e_pode_reconsiderar(self):
        self.assertRedirects(self.acao("recusar"), self.lista)

        self.assert_estado(Situacao.RECUSADA, False)
        self.assertEqual(self.login_api().status_code, 403)
        self.assertRedirects(self.acao("aprovar"), self.lista)
        self.assert_estado(Situacao.APROVADA, True)

    def test_admin_revoga_conta_e_bloqueia_jwt_ainda_valido(self):
        self.acao("aprovar")
        tokens = self.login_api().json()
        cabecalho = {"HTTP_AUTHORIZATION": f"Bearer {tokens['access']}"}
        protegido = reverse("ciclos:macrociclo-list-create")
        self.assertEqual(self.usuarios.get(protegido, **cabecalho).status_code, 200)

        self.assertRedirects(self.acao("revogar"), self.lista)

        self.assert_estado(Situacao.REVOGADA, False)
        negado = self.usuarios.get(protegido, **cabecalho)
        self.assertEqual(negado.status_code, 401)
        self.assertEqual(negado.json()["code"], "user_inactive")
        renovacao = self.usuarios.post(
            reverse("usuarios:token-refresh"),
            {"refresh": tokens["refresh"]},
            content_type="application/json",
        )
        self.assertEqual(renovacao.status_code, 401)
        self.assertEqual(self.login_api().status_code, 403)

    def test_acao_incompativel_preserva_situacao_e_conta(self):
        self.acao("revogar")
        self.assert_estado(Situacao.PENDENTE, False)
        self.acao("aprovar")
        self.acao("recusar")
        self.assert_estado(Situacao.APROVADA, True)

    def test_usuario_comum_e_staff_sem_superusuario_nao_podem_aprovar(self):
        for staff in (False, True):
            with self.subTest(staff=staff):
                usuario = get_user_model().objects.create_user(
                    username=f"membro-{staff}", is_staff=staff
                )
                usuario.user_permissions.set(
                    Permission.objects.filter(
                        content_type__app_label="usuarios",
                        codename__in=("change_perfilacesso", "view_perfilacesso"),
                    )
                )
                cliente = Client()
                cliente.force_login(usuario)
                self.assertEqual(self.acao("aprovar", cliente).status_code, 403 if staff else 302)

        self.assert_estado(Situacao.PENDENTE, False)

    def test_falha_na_atualizacao_do_usuario_reverte_a_alteracao_do_perfil(self):
        atualizar = QuerySet.update

        def atualizar_ou_falhar(queryset, **kwargs):
            if queryset.model is get_user_model():
                raise IntegrityError("falha simulada ao ativar a conta")
            return atualizar(queryset, **kwargs)

        with patch.object(QuerySet, "update", autospec=True, side_effect=atualizar_ou_falhar):
            with self.assertRaises(IntegrityError):
                self.acao("aprovar")

        self.assert_estado(Situacao.PENDENTE, False)
