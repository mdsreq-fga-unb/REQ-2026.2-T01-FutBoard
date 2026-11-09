"""Testes da API de sessões."""

from django.apps import apps
from django.test import SimpleTestCase, TestCase
from rest_framework import status
from rest_framework.test import APITestCase

from apps.ciclos.models import Macrociclo, Mesociclo, Microciclo

from .models import Sessao
from .models import ComportamentoTatico

class TreinosInfraTests(SimpleTestCase):
    """Valida o registro da aplicação treinos na configuração do Django."""

    def test_app_treinos_registered(self):
        app_config = apps.get_app_config("treinos")
        self.assertEqual(app_config.name, "apps.treinos")


class SessaoApiTests(TestCase):
    list_url = "/api/treinos/sessoes/"

    def setUp(self):
        self.macrociclo = Macrociclo.objects.create(
            nome="Temporada 2026",
            data_inicio="2026-01-01",
            data_termino="2026-12-31",
        )
        self.mesociclo = Mesociclo.objects.create(
            macrociclo=self.macrociclo,
            nome="Preparação física",
            data_inicio="2026-02-01",
            data_termino="2026-06-30",
        )
        self.microciclo = Microciclo.objects.create(
            mesociclo=self.mesociclo,
            nome="Microciclo 1",
            data_inicio="2026-03-01",
            data_termino="2026-03-07",
        )

    def dados_validos(self):
        return {
            "microciclo": self.microciclo.id,
            "nome": "Sessão de preparação",
            "data": "2026-03-03",
        }

    def test_cadastra_sessao_com_sequencia_automatica(self):
        response = self.client.post(
            self.list_url,
            self.dados_validos(),
            content_type="application/json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.json()["sequencia"], 1)
        self.assertEqual(response.json()["mes"], "Março")
        self.assertEqual(Sessao.objects.count(), 1)

    def test_incrementa_sequencia_no_mesmo_microciclo(self):
        primeira = Sessao.objects.create(
            microciclo=self.microciclo,
            nome="Sessão 1",
            data="2026-03-02",
        )
        segunda = Sessao.objects.create(
            microciclo=self.microciclo,
            nome="Sessão 2",
            data="2026-03-04",
        )

        self.assertEqual(primeira.sequencia, 1)
        self.assertEqual(segunda.sequencia, 2)

    def test_edita_nome_e_data_mantendo_sequencia(self):
        sessao = Sessao.objects.create(
            microciclo=self.microciclo,
            nome="Sessão inicial",
            data="2026-03-03",
        )

        response = self.client.patch(
            f"{self.list_url}{sessao.id}/",
            {"nome": "Sessão atualizada", "data": "2026-03-05"},
            content_type="application/json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        sessao.refresh_from_db()
        self.assertEqual(sessao.nome, "Sessão atualizada")
        self.assertEqual(sessao.data.isoformat(), "2026-03-05")
        self.assertEqual(sessao.sequencia, 1)

    def test_rejeita_sessao_sem_microciclo(self):
        dados = self.dados_validos()
        del dados["microciclo"]

        response = self.client.post(
            self.list_url,
            dados,
            content_type="application/json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("microciclo", response.json())

    def test_rejeita_data_fora_do_microciclo(self):
        dados = self.dados_validos()
        dados["data"] = "2026-03-10"

        response = self.client.post(
            self.list_url,
            dados,
            content_type="application/json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("data", response.json())

class ComportamentoTaticoAPITest(APITestCase):

    url = "/api/treinos/comportamentos/"

    def test_listar_catalogo_vazio(self):
        response = self.client.get(self.url)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, [])

    def test_cadastrar_comportamento(self):
        response = self.client.post(
            self.url,
            {"nome": "Amplitude"},
            format="json",
        )

        self.assertEqual(response.status_code, 201)
        self.assertEqual(ComportamentoTatico.objects.count(), 1)

    def test_impedir_nome_vazio(self):
        response = self.client.post(
            self.url,
            {"nome": "   "},
            format="json",
        )

        self.assertEqual(response.status_code, 400)

    def test_impedir_nome_duplicado(self):
        ComportamentoTatico.objects.create(nome="Amplitude")

        response = self.client.post(
            self.url,
            {"nome": "Amplitude"},
            format="json",
        )

        self.assertEqual(response.status_code, 400)

    def test_impedir_duplicidade_com_acentos(self):
        ComportamentoTatico.objects.create(nome="Reação Pós-Perda")

        response = self.client.post(
            self.url,
            {"nome": "  REACAO   POS-PERDA  "},
            format="json",
        )

        self.assertEqual(response.status_code, 400)

    def test_editar_comportamento(self):
        comportamento = ComportamentoTatico.objects.create(
            nome="Amplitude"
        )

        response = self.client.patch(
            f"{self.url}{comportamento.id}/",
            {"nome": "Amplitude Ofensiva"},
            format="json",
        )

        self.assertEqual(response.status_code, 200)

        comportamento.refresh_from_db()

        self.assertEqual(comportamento.nome, "Amplitude Ofensiva")

    def test_impedir_duplicidade_na_edicao(self):
        ComportamentoTatico.objects.create(nome="Cobertura")

        comportamento = ComportamentoTatico.objects.create(
            nome="Amplitude"
        )

        response = self.client.patch(
            f"{self.url}{comportamento.id}/",
            {"nome": "cobertura"},
            format="json",
        )

        self.assertEqual(response.status_code, 400)