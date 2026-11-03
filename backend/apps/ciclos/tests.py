"""Testes de verificação estrutural do módulo de Ciclos e da API base."""
from django.apps import apps
from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from apps.ciclos.models import Macrociclo, Mesociclo
from apps.ciclos.serializers import MesocicloSerializer


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

class MesocicloSerializerTest(TestCase):

    def setUp(self):
        self.macrociclo = Macrociclo.objects.create(
            nome="Temporada 2026",
            data_inicio="2026-01-01",
            data_fim="2026-12-31",
        )

        self.mesociclo = Mesociclo.objects.create(
            nome="Preparação Física",
            macrociclo=self.macrociclo,
            data_inicio="2026-02-01",
            data_fim="2026-03-31",
        )

    def test_cadastrar_mesociclo_valido(self):
        dados = {
            "nome": "Desenvolvimento Técnico",
            "macrociclo": self.macrociclo.id,
            "data_inicio": "2026-04-01",
            "data_fim": "2026-05-31",
        }

        serializer = MesocicloSerializer(data=dados)

        self.assertTrue(serializer.is_valid(), serializer.errors)

        mesociclo = serializer.save()

        self.assertEqual(
            mesociclo.nome,
            "Desenvolvimento Técnico"
        )

    def test_rejeitar_data_final_anterior_a_inicial(self):
        dados = {
            "nome": "Mesociclo Inválido",
            "macrociclo": self.macrociclo.id,
            "data_inicio": "2026-05-01",
            "data_fim": "2026-04-01",
        }

        serializer = MesocicloSerializer(data=dados)

        self.assertFalse(serializer.is_valid())
        self.assertIn("data_fim", serializer.errors)

    def test_rejeitar_inicio_fora_do_macrociclo(self):
        dados = {
            "nome": "Mesociclo Inválido",
            "macrociclo": self.macrociclo.id,
            "data_inicio": "2025-12-01",
            "data_fim": "2026-02-01",
        }

        serializer = MesocicloSerializer(data=dados)

        self.assertFalse(serializer.is_valid())
        self.assertIn("data_inicio", serializer.errors)

    def test_rejeitar_fim_fora_do_macrociclo(self):
        dados = {
            "nome": "Mesociclo Inválido",
            "macrociclo": self.macrociclo.id,
            "data_inicio": "2026-11-01",
            "data_fim": "2027-01-01",
        }

        serializer = MesocicloSerializer(data=dados)

        self.assertFalse(serializer.is_valid())
        self.assertIn("data_fim", serializer.errors)

    def test_rejeitar_troca_de_macrociclo(self):
        outro_macrociclo = Macrociclo.objects.create(
            nome="Temporada 2027",
            data_inicio="2027-01-01",
            data_fim="2027-12-31",
        )

        dados = {
            "macrociclo": outro_macrociclo.id,
        }

        serializer = MesocicloSerializer(
            instance=self.mesociclo,
            data=dados,
            partial=True,
        )

        self.assertFalse(serializer.is_valid())
        self.assertIn("macrociclo", serializer.errors)

    def test_editar_nome_sem_alterar_datas(self):
        dados = {
            "nome": "Preparação Física Atualizada",
        }

        serializer = MesocicloSerializer(
            instance=self.mesociclo,
            data=dados,
            partial=True,
        )

        self.assertTrue(serializer.is_valid(), serializer.errors)

        mesociclo = serializer.save()

        self.assertEqual(
            mesociclo.nome,
            "Preparação Física Atualizada"
        )

        self.assertEqual(
            mesociclo.data_inicio.isoformat(),
            "2026-02-01"
        )