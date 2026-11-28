from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import AccessToken

from .models import PerfilAcesso


class UsuarioAprovadoMixin:
    @classmethod
    def setUpTestData(cls):
        super().setUpTestData()
        cls.usuario_aprovado = get_user_model().objects.create_user(username="comissao-tecnica")
        PerfilAcesso.objects.create(
            usuario=cls.usuario_aprovado,
            nome_completo="Comissão técnica",
            situacao=PerfilAcesso.Situacao.APROVADA,
        )

    def setUp(self):
        super().setUp()
        token = AccessToken.for_user(self.usuario_aprovado)
        self.client.defaults["HTTP_AUTHORIZATION"] = f"Bearer {token}"
