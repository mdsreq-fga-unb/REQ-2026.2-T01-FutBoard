"""Testes de verificação estrutural do módulo de Ciclos e da API base."""
from django.apps import apps
from django.test import TestCase
from django.urls import reverse
from rest_framework import status


class CiclosInfraTests(TestCase):
    """Valida o registro da aplicação ciclos e os endpoints de infraestrutura da API."""

    def test_app_ciclos_registered(self):
        app_config = apps.get_app_config("ciclos")
        self.assertEqual(app_config.name, "apps.ciclos")

    def test_api_root_endpoint(self):
        response = self.client.get(reverse("api-root"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("endpoints", response.json())

    def test_api_health_endpoint(self):
        response = self.client.get(reverse("api-health"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()["status"], "healthy")
