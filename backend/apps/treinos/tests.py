"""Testes da API de sessões e biblioteca de treinos."""

from django.apps import apps
from django.test import SimpleTestCase, TestCase
from rest_framework import status
from rest_framework.test import APITestCase

from apps.ciclos.models import Macrociclo, Mesociclo, Microciclo


from .models import Sessao
from .models import ComportamentoTatico

from .models import AtividadeBiblioteca, Sessao



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


class AtividadeBibliotecaApiTests(TestCase):
    """Testes automatizados da US19 (Cadastrar atividades na biblioteca de treinos)."""

    list_url = "/api/treinos/biblioteca/"

    def test_cadastra_atividade_apenas_dados_invariaveis_planilha(self):
        """Permite cadastrar apenas com dados invariáveis da aba 02_Biblioteca."""
        payload = {
            "nome": "G2XG",
            "tipologia": "Confrontos",
            "tipo_ssp": "Especial",
        }
        response = self.client.post(
            self.list_url,
            payload,
            content_type="application/json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        body = response.json()
        self.assertEqual(body["codigo"], "CF1")
        self.assertEqual(body["atividade_ssp"], "CF | G2XG")
        self.assertEqual(body["tipologia"], "Confrontos")
        self.assertEqual(body["sigla_tipologia"], "CF")
        self.assertEqual(body["tipo_ssp"], "Especial")
        self.assertIsNone(body["area_por_jogador"])
        self.assertEqual(body["dimensao_espaco"], "Não Definido")
        self.assertEqual(AtividadeBiblioteca.objects.count(), 1)

    def test_gera_codigo_sequencial_por_tipologia_e_aceita_sigla(self):
        """Incrementa o código por tipologia (JC1, JC2) e aceita sigla na entrada."""
        r1 = self.client.post(
            self.list_url,
            {
                "nome": "RecPosPerd",
                "tipologia": "JC",
                "tipo_ssp": "Especial",
            },
            content_type="application/json",
        )
        r2 = self.client.post(
            self.list_url,
            {
                "nome": "JC | AlemRecPosPerd",
                "tipologia": "Jogo Condicionante",
                "tipo_ssp": "Especial",
            },
            content_type="application/json",
        )

        self.assertEqual(r1.status_code, status.HTTP_201_CREATED)
        self.assertEqual(r2.status_code, status.HTTP_201_CREATED)
        self.assertEqual(r1.json()["codigo"], "JC1")
        self.assertEqual(r1.json()["atividade_ssp"], "JC | RecPosPerd")
        self.assertEqual(r2.json()["codigo"], "JC2")
        self.assertEqual(r2.json()["atividade_ssp"], "JC | AlemRecPosPerd")

    def test_permite_codigo_customizado_como_ec1_da_planilha(self):
        """Suporta o caso EC1 (Jogo Condicionante Competitivo com ID EC1 na planilha)."""
        response = self.client.post(
            self.list_url,
            {
                "codigo": "EC1",
                "nome": "JC | 2Eq MeioCampo",
                "tipologia": "Jogo Condicionante",
                "tipo_ssp": "Competitivo",
            },
            content_type="application/json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.json()["codigo"], "EC1")
        self.assertEqual(response.json()["atividade_ssp"], "JC | 2Eq MeioCampo")

    def test_calcula_area_e_classifica_espaco_pequeno_medio_grande(self):
        """Valida RN01 e RN02 com os valores exatos da planilha (CF1, JC1, JS1)."""
        # CF1: 24 x 25 / 6 = 100 -> Pequeno
        r_pequeno = self.client.post(
            self.list_url,
            {
                "nome": "G2XG",
                "tipologia": "Confrontos",
                "tipo_ssp": "Especial",
                "orientacao": "Aquisição",
                "comprimento": 24,
                "largura": 25,
                "numero_jogadores": 6,
            },
            content_type="application/json",
        )
        self.assertEqual(r_pequeno.status_code, status.HTTP_201_CREATED)
        self.assertAlmostEqual(r_pequeno.json()["area_por_jogador"], 100.0)
        self.assertEqual(r_pequeno.json()["dimensao_espaco"], "Pequeno")

        # JC1: 50 x 50 / 18 = 138.888... -> Médio
        r_medio = self.client.post(
            self.list_url,
            {
                "nome": "RecPosPerd",
                "tipologia": "Jogo Condicionante",
                "tipo_ssp": "Especial",
                "orientacao": "Aquisição",
                "comprimento": 50,
                "largura": 50,
                "numero_jogadores": 18,
            },
            content_type="application/json",
        )
        self.assertEqual(r_medio.status_code, status.HTTP_201_CREATED)
        self.assertAlmostEqual(r_medio.json()["area_por_jogador"], 50 * 50 / 18)
        self.assertEqual(r_medio.json()["dimensao_espaco"], "Médio")

        # JS1: 52 x 60 / 12 = 260 -> Grande
        r_grande = self.client.post(
            self.list_url,
            {
                "nome": "1ª/2ªConst",
                "tipologia": "Jogo Setorial",
                "tipo_ssp": "Especial",
                "orientacao": "Aquisição",
                "comprimento": 52,
                "largura": 60,
                "numero_jogadores": 12,
            },
            content_type="application/json",
        )
        self.assertEqual(r_grande.status_code, status.HTTP_201_CREATED)
        self.assertAlmostEqual(r_grande.json()["area_por_jogador"], 260.0)
        self.assertEqual(r_grande.json()["dimensao_espaco"], "Grande")

    def test_orientacao_pdi_dispensa_dimensoes_e_define_nao_definido(self):
        """Valida RN01/RN02 para PDI (ex.: DP1, DF1, DPD1 na planilha)."""
        response = self.client.post(
            self.list_url,
            {
                "nome": "DomOrien | Var1",
                "tipologia": "Dinâmica de Passe",
                "tipo_ssp": "Dirigido",
                "orientacao": "PDI",
                "momentos_jogo": ["Ataque"],
                "atributos_tecnicos": ["DomOrient"],
            },
            content_type="application/json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        body = response.json()
        self.assertEqual(body["codigo"], "DP1")
        self.assertIsNone(body["area_por_jogador"])
        self.assertEqual(body["dimensao_espaco"], "Não Definido")
        self.assertEqual(body["atributos_tecnicos"], ["DomOrient"])

    def test_suporta_multiplos_momentos_fases_comportamentos_e_atributos(self):
        """Garante suporte às listas N:N das abas 03 a 06 da planilha (ex.: RD1 e DPD1)."""
        response = self.client.post(
            self.list_url,
            {
                "nome": "Circ+CabRebFrontLat",
                "tipologia": "Dinâmica ProtDef",
                "tipo_ssp": "Dirigido",
                "orientacao": "PDI",
                "momentos_jogo": ["Defesa"],
                "fases_jogo": ["1ª Construção", "2ª Construção"],
                "comportamentos": ["CoordLinDef", "DefCruz"],
                "atributos_tecnicos": [
                    "Cab/Reb Frontal",
                    "Cab/Reb Lateral",
                    "Cruz | Zon2",
                ],
            },
            content_type="application/json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        body = response.json()
        self.assertEqual(body["codigo"], "DPD1")
        self.assertEqual(body["fases_jogo"], ["1ª Construção", "2ª Construção"])
        self.assertEqual(body["comportamentos"], ["CoordLinDef", "DefCruz"])
        self.assertEqual(len(body["atributos_tecnicos"]), 3)

    def test_rejeita_medidas_parciais_ou_invalidas(self):
        """Rejeita cadastro quando apenas parte das medidas de espaço é enviada."""
        response = self.client.post(
            self.list_url,
            {
                "nome": "RecPosPerd",
                "tipologia": "Jogo de Posse",
                "tipo_ssp": "Especial",
                "orientacao": "Aquisição",
                "comprimento": 20,
                "largura": 20,
            },
            content_type="application/json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("dimensao_espaco", response.json())

