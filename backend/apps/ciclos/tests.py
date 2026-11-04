"""Testes do módulo de Ciclos e da API de periodização."""

from django.apps import apps
from django.test import TestCase
from django.urls import reverse
from rest_framework import status

from .models import Macrociclo, Mesociclo, Microciclo


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


class MesocicloApiTests(TestCase):
    list_url = "/api/ciclos/mesociclos/"

    def setUp(self):
        self.macrociclo = Macrociclo.objects.create(
            nome="Temporada 2026",
            data_inicio="2026-01-01",
            data_termino="2026-12-31",
        )

    def dados_validos(self):
        return {
            "macrociclo": self.macrociclo.id,
            "nome": "Preparação física",
            "data_inicio": "2026-02-01",
            "data_termino": "2026-03-31",
        }

    def test_cadastra_mesociclo_associado_ao_macrociclo(self):
        response = self.client.post(
            self.list_url,
            self.dados_validos(),
            content_type="application/json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Mesociclo.objects.count(), 1)
        self.assertEqual(response.json()["macrociclo"], self.macrociclo.id)

    def test_edita_nome_sem_alterar_macrociclo(self):
        mesociclo = Mesociclo.objects.create(
            **{**self.dados_validos(), "macrociclo": self.macrociclo}
        )

        response = self.client.patch(
            f"{self.list_url}{mesociclo.id}/",
            {"nome": "Preparação física atualizada"},
            content_type="application/json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        mesociclo.refresh_from_db()
        self.assertEqual(mesociclo.nome, "Preparação física atualizada")
        self.assertEqual(mesociclo.macrociclo_id, self.macrociclo.id)

    def test_rejeita_mesociclo_fora_do_macrociclo(self):
        dados = self.dados_validos()
        dados["data_termino"] = "2027-01-01"

        response = self.client.post(
            self.list_url,
            dados,
            content_type="application/json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("data_termino", response.json())


class MicrocicloApiTests(TestCase):
    list_url = "/api/ciclos/microciclos/"

    def setUp(self):
        self.macrociclo = Macrociclo.objects.create(
            nome="Temporada 2026",
            data_inicio="2026-01-01",
            data_termino="2026-12-31",
        )
        self.mesociclo = Mesociclo.objects.create(
            macrociclo=self.macrociclo,
            nome="Preparação Geral",
            data_inicio="2026-02-01",
            data_termino="2026-03-31",
        )

    def dados_validos(self):
        return {
            "mesociclo": self.mesociclo.id,
            "nome": "Semana 1 - Aclimação",
            "data_inicio": "2026-02-02",
            "data_termino": "2026-02-08",
        }

    def test_cadastra_microciclo_associado_ao_mesociclo(self):
        response = self.client.post(
            self.list_url,
            self.dados_validos(),
            content_type="application/json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Microciclo.objects.count(), 1)
        self.assertEqual(response.json()["mesociclo"], self.mesociclo.id)
        self.assertEqual(response.json()["nome"], "Semana 1 - Aclimação")

    def test_lista_microciclos(self):
        Microciclo.objects.create(**{**self.dados_validos(), "mesociclo": self.mesociclo})

        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.json()), 1)

    def test_edita_microciclo_sem_alterar_mesociclo(self):
        microciclo = Microciclo.objects.create(
            **{**self.dados_validos(), "mesociclo": self.mesociclo}
        )

        response = self.client.patch(
            f"{self.list_url}{microciclo.id}/",
            {"nome": "Semana 1 - Carga Intensa"},
            content_type="application/json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        microciclo.refresh_from_db()
        self.assertEqual(microciclo.nome, "Semana 1 - Carga Intensa")
        self.assertEqual(microciclo.mesociclo_id, self.mesociclo.id)

    def test_rejeita_microciclo_fora_do_mesociclo(self):
        dados = self.dados_validos()
        dados["data_termino"] = "2026-04-05"  # Mesociclo termina em 2026-03-31

        response = self.client.post(
            self.list_url,
            dados,
            content_type="application/json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("data_termino", response.json())

    def test_rejeita_microciclo_com_data_termino_anterior_a_data_inicio(self):
        dados = self.dados_validos()
        dados["data_inicio"] = "2026-02-08"
        dados["data_termino"] = "2026-02-02"

        response = self.client.post(
            self.list_url,
            dados,
            content_type="application/json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("data_termino", response.json())

    def test_rejeita_alteracao_do_mesociclo_associado(self):
        outro_meso = Mesociclo.objects.create(
            macrociclo=self.macrociclo,
            nome="Outro Mesociclo",
            data_inicio="2026-04-01",
            data_termino="2026-04-30",
        )
        microciclo = Microciclo.objects.create(
            **{**self.dados_validos(), "mesociclo": self.mesociclo}
        )

        response = self.client.patch(
            f"{self.list_url}{microciclo.id}/",
            {"mesociclo": outro_meso.id},
            content_type="application/json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("mesociclo", response.json())
