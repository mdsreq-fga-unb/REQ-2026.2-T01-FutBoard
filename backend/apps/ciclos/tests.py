"""Testes do módulo de Ciclos e da API de macrociclos."""
from django.apps import apps
from django.test import TestCase
from django.urls import reverse
from rest_framework import status

from .models import Macrociclo


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


class MacrocicloApiTests(TestCase):
    """Valida o cadastro, a edição e as regras de macrociclos."""

    list_url = "/api/ciclos/macrociclos/"

    def dados_validos(self):
        return {
            "nome": "Temporada 2026.2 - Sub-17",
            "data_inicio": "2026-08-03",
            "data_termino": "2026-12-20",
        }

    def test_cadastra_macrociclo_com_dados_validos(self):
        response = self.client.post(
            self.list_url,
            self.dados_validos(),
            content_type="application/json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Macrociclo.objects.count(), 1)
        self.assertEqual(response.json()["codigo"], "MC-01")
        self.assertEqual(
            response.json()["nome"],
            "Temporada 2026.2 - Sub-17",
        )

    def test_edita_macrociclo_existente(self):
        macrociclo = Macrociclo.objects.create(**self.dados_validos())

        response = self.client.patch(
            f"{self.list_url}{macrociclo.id}/",
            {"nome": "Temporada 2026.2 atualizada"},
            content_type="application/json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        macrociclo.refresh_from_db()
        self.assertEqual(macrociclo.nome, "Temporada 2026.2 atualizada")
        self.assertEqual(response.json()["codigo"], macrociclo.codigo)

    def test_rejeita_data_de_termino_anterior_a_data_de_inicio(self):
        dados = self.dados_validos()
        dados["data_inicio"] = "2026-12-20"
        dados["data_termino"] = "2026-08-03"

        response = self.client.post(
            self.list_url,
            dados,
            content_type="application/json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("data_termino", response.json())
        self.assertEqual(Macrociclo.objects.count(), 0)
