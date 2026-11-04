"""Testes de verificação estrutural do módulo de Treinos."""
from django.apps import apps
from django.test import SimpleTestCase


class TreinosInfraTests(SimpleTestCase):
    """Valida o registro da aplicação treinos na configuração do Django."""

    def test_app_treinos_registered(self):
        app_config = apps.get_app_config("treinos")
        self.assertEqual(app_config.name, "apps.treinos")
