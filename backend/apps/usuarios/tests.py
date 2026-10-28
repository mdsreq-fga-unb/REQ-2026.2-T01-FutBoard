"""Testes de verificação estrutural do módulo de Usuários e configuração de segurança (RNF01)."""
from django.apps import apps
from django.conf import settings
from django.contrib.auth.hashers import make_password
from django.test import SimpleTestCase


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
