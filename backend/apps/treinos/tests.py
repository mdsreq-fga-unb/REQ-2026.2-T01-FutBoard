"""Testes da API de sessões e biblioteca de treinos."""

from datetime import date

from django.apps import apps
from django.test import SimpleTestCase, TestCase
from rest_framework import status
from rest_framework.test import APITestCase

from apps.ciclos.models import Macrociclo, Mesociclo, Microciclo

from .models import (
    MENSAGEM_ATIVIDADES_VAZIO,
    AtividadeBiblioteca,
    AtividadeSessao,
    ComportamentoTatico,
    Sessao,
    calcular_informacoes_atividades_treino,
    identificador_atividade_distinta,
)
from .serializers import InformacoesAtividadesTreinoSerializer



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

    def test_edita_nome_e_dados_base_mantendo_codigo(self):
        """US20: Edita nome, tipologia e tipo_ssp de uma atividade mantendo seu código."""
        atividade = AtividadeBiblioteca.objects.create(
            nome="G2XG",
            tipologia="Confrontos",
            tipo_ssp="Especial",
        )

        response = self.client.patch(
            f"{self.list_url}{atividade.id}/",
            {
                "nome": "G2XG | Rodízio 30s",
                "tipo_ssp": "Competitivo",
            },
            content_type="application/json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        body = response.json()
        self.assertEqual(body["codigo"], "CF1")
        self.assertEqual(body["nome"], "G2XG | Rodízio 30s")
        self.assertEqual(body["atividade_ssp"], "CF | G2XG | Rodízio 30s")
        self.assertEqual(body["tipo_ssp"], "Competitivo")

    def test_edita_medidas_recalculando_area_e_dimensao_espaco(self):
        """US20: Recalcula área (RN01) e atualiza dimensão (RN02) ao editar medidas."""
        atividade = AtividadeBiblioteca.objects.create(
            nome="RecPosPerd",
            tipologia="Jogo de Posse",
            tipo_ssp="Especial",
            orientacao="Aquisição",
            comprimento=20,
            largura=20,
            numero_jogadores=7,
        )
        self.assertEqual(atividade.dimensao_espaco, "Pequeno")

        response = self.client.patch(
            f"{self.list_url}{atividade.id}/",
            {
                "comprimento": 52,
                "largura": 60,
                "numero_jogadores": 12,
            },
            content_type="application/json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        body = response.json()
        self.assertAlmostEqual(body["area_por_jogador"], 260.0)
        self.assertEqual(body["dimensao_espaco"], "Grande")

    def test_edita_orientacao_para_pdi_limpando_medidas(self):
        """US20: Ao mudar orientação para PDI, limpa medidas e define Não Definido."""
        atividade = AtividadeBiblioteca.objects.create(
            nome="DomOrien | Var1",
            tipologia="Dinâmica de Passe",
            tipo_ssp="Dirigido",
            orientacao="Aquisição",
            comprimento=24,
            largura=25,
            numero_jogadores=6,
        )
        self.assertEqual(atividade.dimensao_espaco, "Pequeno")

        response = self.client.patch(
            f"{self.list_url}{atividade.id}/",
            {"orientacao": "PDI"},
            content_type="application/json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        body = response.json()
        self.assertIsNone(body["comprimento"])
        self.assertIsNone(body["largura"])
        self.assertIsNone(body["numero_jogadores"])
        self.assertIsNone(body["area_por_jogador"])
        self.assertEqual(body["dimensao_espaco"], "Não Definido")

    def test_edita_listas_momentos_fases_comportamentos_e_atributos(self):
        """US20: Permite atualizar listas de momentos, fases, comportamentos e atributos."""
        atividade = AtividadeBiblioteca.objects.create(
            nome="Cont/Cob",
            tipologia="Rondo",
            tipo_ssp="Especial",
            momentos_jogo=["Ataque"],
            comportamentos=["Cobertura"],
        )

        response = self.client.patch(
            f"{self.list_url}{atividade.id}/",
            {
                "momentos_jogo": ["Ataque", "Defesa"],
                "fases_jogo": ["1ª Construção"],
                "comportamentos": ["Cobertura", "Contenção", "MantPoss"],
                "atributos_tecnicos": ["Passe Ruptura"],
            },
            content_type="application/json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        body = response.json()
        self.assertEqual(body["momentos_jogo"], ["Ataque", "Defesa"])
        self.assertEqual(body["fases_jogo"], ["1ª Construção"])
        self.assertEqual(body["comportamentos"], ["Cobertura", "Contenção", "MantPoss"])
        self.assertEqual(body["atributos_tecnicos"], ["Passe Ruptura"])

    def test_impede_edicao_com_codigo_duplicado(self):
        """US20: Rejeita edição caso tente usar o código de outra atividade existente."""
        AtividadeBiblioteca.objects.create(
            codigo="CF1",
            nome="G2XG",
            tipologia="Confrontos",
            tipo_ssp="Especial",
        )
        segunda = AtividadeBiblioteca.objects.create(
            codigo="JC1",
            nome="RecPosPerd",
            tipologia="Jogo Condicionante",
            tipo_ssp="Especial",
        )

        response = self.client.patch(
            f"{self.list_url}{segunda.id}/",
            {"codigo": "cf1"},
            content_type="application/json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("codigo", response.json())


class AtividadeSessaoApiTests(APITestCase):
    """Testes automatizados das US13, US14 e US23 baseados na planilha oficial."""

    list_url = "/api/treinos/atividades-sessao/"

    def setUp(self):
        self.macrociclo = Macrociclo.objects.create(
            nome="Temporada 2026",
            data_inicio="2026-01-01",
            data_termino="2026-12-31",
        )
        self.mesociclo = Mesociclo.objects.create(
            macrociclo=self.macrociclo,
            nome="Preparatório Geral",
            data_inicio="2026-02-01",
            data_termino="2026-06-30",
        )
        self.microciclo = Microciclo.objects.create(
            mesociclo=self.mesociclo,
            nome="Microciclo 01",
            data_inicio="2026-03-01",
            data_termino="2026-03-07",
        )
        self.sessao = Sessao.objects.create(
            microciclo=self.microciclo,
            nome="Sessão 1 - Aquisição",
            data="2026-03-02",
        )

        self.bib_cf1 = AtividadeBiblioteca.objects.create(
            nome="G2XG",
            tipologia="Confrontos",
            tipo_ssp="Especial",
            orientacao="Aquisição",
            comprimento=24,
            largura=25,
            numero_jogadores=6,
            momentos_jogo=["Ataque", "Defesa"],
            fases_jogo=["Finalização"],
            comportamentos=["Finalização", "Proteção Baliza"],
        )
        self.bib_jc1 = AtividadeBiblioteca.objects.create(
            nome="RecPosPerd",
            tipologia="Jogo Condicionante",
            tipo_ssp="Especial",
            orientacao="Aquisição",
            comprimento=50,
            largura=50,
            numero_jogadores=18,
            momentos_jogo=["Trans Of", "Trans Def"],
            fases_jogo=["1ª Construção", "Criação"],
            comportamentos=["Reação Pós-Perda", "Amplitude"],
        )
        self.bib_dp1 = AtividadeBiblioteca.objects.create(
            nome="DomOrien | Var1",
            tipologia="Dinâmica de Passe",
            tipo_ssp="Dirigido",
            orientacao="PDI",
            momentos_jogo=["Ataque"],
            fases_jogo=["1ª Construção"],
            atributos_tecnicos=["DomOrient", "Passe Curto"],
        )

    def test_us13_cadastra_atividade_manual_grande_js1(self):
        payload = {
            "sessao": self.sessao.id,
            "codigo": "JS1",
            "nome": "1ª/2ªConst",
            "tipologia": "JS",
            "tipo_ssp": "Especial",
            "orientacao": "Aquisição",
            "ordem": 1,
            "tempo": 25,
            "comprimento": 52,
            "largura": 60,
            "numero_jogadores": 12,
            "momentos_jogo": ["Ataque"],
            "fases_jogo": ["1ª Construção", "2ª Construção"],
            "comportamentos": ["Saída Sustentada"],
        }
        response = self.client.post(self.list_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        data = response.json()
        self.assertEqual(data["tipologia"], "Jogo Setorial")
        self.assertAlmostEqual(data["area_por_jogador"], 260.0)
        self.assertEqual(data["dimensao_espaco"], "Grande")

    def test_us13_permite_atividades_simultaneas_na_mesma_ordem_rn03(self):
        r1 = self.client.post(
            self.list_url,
            {
                "sessao": self.sessao.id,
                "nome": "DomOrien | Var1",
                "tipologia": "Dinâmica de Passe",
                "tipo_ssp": "Dirigido",
                "orientacao": "PDI",
                "ordem": 1,
                "tempo": 15,
                "atributos_tecnicos": ["DomOrient"],
            },
            format="json",
        )
        r2 = self.client.post(
            self.list_url,
            {
                "sessao": self.sessao.id,
                "nome": "Circ+CabRebFrontLat",
                "tipologia": "Dinâmica ProtDef",
                "tipo_ssp": "Dirigido",
                "orientacao": "PDI",
                "ordem": 1,
                "tempo": 15,
                "atributos_tecnicos": ["Cab/Reb Frontal", "Cab/Reb Lateral"],
            },
            format="json",
        )

        self.assertEqual(r1.status_code, status.HTTP_201_CREATED)
        self.assertEqual(r2.status_code, status.HTTP_201_CREATED)
        self.assertEqual(
            AtividadeSessao.objects.filter(sessao=self.sessao, ordem=1).count(), 2
        )

    def test_us13_rejeita_tempo_zero(self):
        response = self.client.post(
            self.list_url,
            {
                "sessao": self.sessao.id,
                "nome": "Atividade Tempo Zero",
                "tipologia": "Rondo",
                "tipo_ssp": "Especial",
                "ordem": 1,
                "tempo": 0,
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("tempo", response.json())

    def test_us13_rejeita_medidas_incompletas(self):
        response = self.client.post(
            self.list_url,
            {
                "sessao": self.sessao.id,
                "nome": "Atividade Medidas Incompletas",
                "tipologia": "Rondo",
                "tipo_ssp": "Especial",
                "ordem": 1,
                "tempo": 15,
                "comprimento": 20,
                "largura": 20,
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("dimensao_espaco", response.json())

    def test_us23_reutiliza_jc1_da_biblioteca_calculando_espaco_medio(self):
        payload = {
            "sessao": self.sessao.id,
            "atividade_biblioteca": self.bib_jc1.id,
            "ordem": 2,
            "tempo": 20,
        }
        response = self.client.post(self.list_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        data = response.json()
        self.assertEqual(data["codigo"], "JC1")
        self.assertEqual(data["nome"], "RecPosPerd")
        self.assertEqual(data["tipologia"], "Jogo Condicionante")
        self.assertAlmostEqual(data["area_por_jogador"], 50 * 50 / 18)
        self.assertEqual(data["dimensao_espaco"], "Médio")
        self.assertEqual(data["comportamentos"], ["Reação Pós-Perda", "Amplitude"])

    def test_us23_reutiliza_dp1_pdi_da_biblioteca(self):
        payload = {
            "sessao": self.sessao.id,
            "atividade_biblioteca": self.bib_dp1.id,
            "ordem": 1,
            "tempo": 12,
        }
        response = self.client.post(self.list_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        data = response.json()
        self.assertEqual(data["codigo"], "DP1")
        self.assertEqual(data["orientacao"], "PDI")
        self.assertIsNone(data["area_por_jogador"])
        self.assertEqual(data["dimensao_espaco"], "Não Definido")
        self.assertEqual(data["atributos_tecnicos"], ["DomOrient", "Passe Curto"])

    def test_us14_edita_copia_na_sessao_sem_alterar_cf1_na_biblioteca(self):
        post_resp = self.client.post(
            self.list_url,
            {
                "sessao": self.sessao.id,
                "atividade_biblioteca": self.bib_cf1.id,
                "ordem": 3,
                "tempo": 18,
            },
            format="json",
        )
        atividade_id = post_resp.json()["id"]

        patch_resp = self.client.patch(
            f"{self.list_url}{atividade_id}/",
            {
                "nome": "G2XG (Espaço Ampliado)",
                "tempo": 22,
                "comprimento": 30,
                "largura": 30,
                "numero_jogadores": 6,
            },
            format="json",
        )

        self.assertEqual(patch_resp.status_code, status.HTTP_200_OK)
        self.assertEqual(patch_resp.json()["dimensao_espaco"], "Médio")
        self.assertAlmostEqual(patch_resp.json()["area_por_jogador"], 150.0)

        self.bib_cf1.refresh_from_db()
        self.assertEqual(self.bib_cf1.nome, "G2XG")
        self.assertEqual(self.bib_cf1.comprimento, 24)
        self.assertEqual(self.bib_cf1.dimensao_espaco, "Pequeno")


class IndicadoresTreinoApiTests(APITestCase):
    """Testes automatizados da US22 / RF22 (Exibir indicador de treino — RN03, RN06 e RN07)."""

    url = "/api/treinos/indicadores/"

    def setUp(self):
        self.macrociclo = Macrociclo.objects.create(
            nome="Temporada 2026",
            data_inicio="2026-01-01",
            data_termino="2026-12-31",
        )
        self.mesociclo = Mesociclo.objects.create(
            macrociclo=self.macrociclo,
            nome="Preparatório Geral",
            data_inicio="2026-02-01",
            data_termino="2026-06-30",
        )
        self.microciclo_marco = Microciclo.objects.create(
            mesociclo=self.mesociclo,
            nome="Microciclo 01 - Março",
            data_inicio="2026-03-01",
            data_termino="2026-03-07",
        )
        self.microciclo_abril = Microciclo.objects.create(
            mesociclo=self.mesociclo,
            nome="Microciclo 02 - Abril",
            data_inicio="2026-04-01",
            data_termino="2026-04-07",
        )

        self.bib_cf1 = AtividadeBiblioteca.objects.create(
            nome="G2XG",
            tipologia="Confrontos",
            tipo_ssp="Especial",
            orientacao="Aquisição",
            comprimento=24,
            largura=25,
            numero_jogadores=6,
        )
        self.bib_jc1 = AtividadeBiblioteca.objects.create(
            nome="RecPosPerd",
            tipologia="Jogo Condicionante",
            tipo_ssp="Especial",
            orientacao="Aquisição",
            comprimento=50,
            largura=50,
            numero_jogadores=18,
        )
        self.bib_dp1 = AtividadeBiblioteca.objects.create(
            nome="DomOrien | Var1",
            tipologia="Dinâmica de Passe",
            tipo_ssp="Dirigido",
            orientacao="PDI",
        )

    def test_us22_retorna_estado_vazio_neutro_sem_sessoes_rn07(self):
        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        self.assertEqual(data["numero_sessoes"], 0)
        self.assertEqual(data["minutos_totais"], 0)
        self.assertEqual(data["numero_execucoes"], 0)
        self.assertEqual(data["atividades_distintas"], 0)
        self.assertEqual(data["variabilidade"], 0.0)
        self.assertEqual(data["minutos_por_sessao"], 0.0)
        self.assertEqual(data["minutos_por_execucao"], 0.0)
        self.assertTrue(data["estado_vazio"])
        self.assertEqual(data["mensagem"], "Nenhum treino registrado neste período.")

    def test_us22_calcula_tempo_liquido_desconsiderando_simultaneas_rn03(self):
        sessao = Sessao.objects.create(
            microciclo=self.microciclo_marco,
            nome="Sessão 1",
            data="2026-03-02",
        )
        # Duas atividades simultâneas na Ordem 1 (15 min cada -> conta 15 min e 1 execução)
        AtividadeSessao.objects.create(
            sessao=sessao,
            atividade_biblioteca=self.bib_dp1,
            codigo=self.bib_dp1.codigo,
            nome=self.bib_dp1.nome,
            tipologia=self.bib_dp1.tipologia,
            tipo_ssp=self.bib_dp1.tipo_ssp,
            orientacao="PDI",
            ordem=1,
            tempo=15,
        )
        AtividadeSessao.objects.create(
            sessao=sessao,
            codigo="DPD1",
            nome="Circ+CabRebFrontLat",
            tipologia="Dinâmica ProtDef",
            tipo_ssp="Dirigido",
            orientacao="PDI",
            ordem=1,
            tempo=15,
        )
        # Ordem 2 (20 min) e Ordem 3 (25 min)
        AtividadeSessao.objects.create(
            sessao=sessao,
            atividade_biblioteca=self.bib_jc1,
            codigo=self.bib_jc1.codigo,
            nome=self.bib_jc1.nome,
            tipologia=self.bib_jc1.tipologia,
            tipo_ssp=self.bib_jc1.tipo_ssp,
            orientacao="Aquisição",
            ordem=2,
            tempo=20,
        )
        AtividadeSessao.objects.create(
            sessao=sessao,
            atividade_biblioteca=self.bib_cf1,
            codigo=self.bib_cf1.codigo,
            nome=self.bib_cf1.nome,
            tipologia=self.bib_cf1.tipologia,
            tipo_ssp=self.bib_cf1.tipo_ssp,
            orientacao="Aquisição",
            ordem=3,
            tempo=25,
        )

        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        self.assertEqual(data["numero_sessoes"], 1)
        self.assertEqual(data["minutos_totais"], 60)
        self.assertEqual(data["numero_execucoes"], 3)
        self.assertEqual(data["atividades_distintas"], 4)
        self.assertAlmostEqual(data["minutos_por_sessao"], 60.0)
        self.assertAlmostEqual(data["minutos_por_execucao"], 20.0)
        self.assertFalse(data["estado_vazio"])
        self.assertIsNone(data["mensagem"])

    def test_us22_calcula_variabilidade_exercicios_distintos_por_execucoes_rn06(self):
        s1 = Sessao.objects.create(
            microciclo=self.microciclo_marco,
            nome="Sessão 1",
            data="2026-03-02",
        )
        s2 = Sessao.objects.create(
            microciclo=self.microciclo_marco,
            nome="Sessão 2",
            data="2026-03-04",
        )
        for sessao in (s1, s2):
            AtividadeSessao.objects.create(
                sessao=sessao,
                atividade_biblioteca=self.bib_cf1,
                codigo=self.bib_cf1.codigo,
                nome=self.bib_cf1.nome,
                tipologia=self.bib_cf1.tipologia,
                tipo_ssp=self.bib_cf1.tipo_ssp,
                ordem=1,
                tempo=20,
            )
            AtividadeSessao.objects.create(
                sessao=sessao,
                atividade_biblioteca=self.bib_jc1,
                codigo=self.bib_jc1.codigo,
                nome=self.bib_jc1.nome,
                tipologia=self.bib_jc1.tipologia,
                tipo_ssp=self.bib_jc1.tipo_ssp,
                ordem=2,
                tempo=20,
            )

        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        self.assertEqual(data["numero_sessoes"], 2)
        self.assertEqual(data["minutos_totais"], 80)
        self.assertEqual(data["numero_execucoes"], 4)
        self.assertEqual(data["atividades_distintas"], 2)
        self.assertAlmostEqual(data["variabilidade"], 50.0)

    def test_us22_filtra_indicadores_por_periodizacao_mes_e_sessao(self):
        s_marco = Sessao.objects.create(
            microciclo=self.microciclo_marco,
            nome="Sessão Março",
            data="2026-03-03",
        )
        AtividadeSessao.objects.create(
            sessao=s_marco,
            codigo="CF1",
            nome="G2XG",
            tipologia="Confrontos",
            tipo_ssp="Especial",
            ordem=1,
            tempo=40,
        )

        s_abril = Sessao.objects.create(
            microciclo=self.microciclo_abril,
            nome="Sessão Abril",
            data="2026-04-02",
        )
        AtividadeSessao.objects.create(
            sessao=s_abril,
            codigo="JC1",
            nome="RecPosPerd",
            tipologia="Jogo Condicionante",
            tipo_ssp="Especial",
            ordem=1,
            tempo=30,
        )

        # Filtro por microciclo de março
        r_micro = self.client.get(f"{self.url}?microciclo={self.microciclo_marco.id}")
        self.assertEqual(r_micro.json()["numero_sessoes"], 1)
        self.assertEqual(r_micro.json()["minutos_totais"], 40)

        # Filtro por nome do mês (com acento) e número do mês
        r_mes_nome = self.client.get(f"{self.url}?mes=Março")
        self.assertEqual(r_mes_nome.json()["minutos_totais"], 40)
        r_mes_num = self.client.get(f"{self.url}?mes=4")
        self.assertEqual(r_mes_num.json()["minutos_totais"], 30)

        # Filtro por sessão específica
        r_sessao = self.client.get(f"{self.url}?sessao={s_abril.id}")
        self.assertEqual(r_sessao.json()["numero_sessoes"], 1)
        self.assertEqual(r_sessao.json()["minutos_totais"], 30)

        # Filtro por mesociclo e macrociclo (soma ambas as sessões)
        r_meso = self.client.get(f"{self.url}?mesociclo={self.mesociclo.id}")
        self.assertEqual(r_meso.json()["numero_sessoes"], 2)
        self.assertEqual(r_meso.json()["minutos_totais"], 70)

        # Filtro sem correspondência -> estado vazio neutro (RN07)
        r_vazio = self.client.get(f"{self.url}?microciclo=99999")
        self.assertEqual(r_vazio.status_code, status.HTTP_200_OK)
        self.assertTrue(r_vazio.json()["estado_vazio"])
        self.assertEqual(r_vazio.json()["minutos_totais"], 0)

    def test_us22_sessao_sem_atividades_nao_causa_divisao_por_zero_rn07(self):
        Sessao.objects.create(
            microciclo=self.microciclo_marco,
            nome="Sessão Planejada Sem Atividades",
            data="2026-03-05",
        )

        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        self.assertEqual(data["numero_sessoes"], 1)
        self.assertEqual(data["minutos_totais"], 0)
        self.assertEqual(data["numero_execucoes"], 0)
        self.assertEqual(data["atividades_distintas"], 0)
        self.assertEqual(data["variabilidade"], 0.0)
        self.assertEqual(data["minutos_por_execucao"], 0.0)
        self.assertFalse(data["estado_vazio"])


class InformacoesAtividadesTreinoUnitTests(SimpleTestCase):
    """Testes unitários puros (em memória, sem banco de dados) da US24 / RF24."""

    def _criar_sessao_em_memoria(self, sessao_id, nome, sequencia, data_iso):
        macro = Macrociclo(
            id=1,
            codigo="MC-01",
            nome="2026",
            data_inicio=date(2026, 1, 1),
            data_termino=date(2026, 12, 31),
        )
        meso = Mesociclo(
            id=1,
            macrociclo=macro,
            nome="ME1",
            data_inicio=date(2026, 8, 1),
            data_termino=date(2026, 8, 15),
        )
        micro = Microciclo(
            id=1,
            mesociclo=meso,
            nome="MC1",
            data_inicio=date(2026, 8, 3),
            data_termino=date(2026, 8, 9),
        )
        return Sessao(
            id=sessao_id,
            microciclo=micro,
            sequencia=sequencia,
            nome=nome,
            data=date.fromisoformat(data_iso),
        )

    def test_us24_unitario_propriedades_sigla_tipologia_e_atividade_ssp(self):
        """Valida unitariamente a formatação de sigla_tipologia e atividade_ssp sem duplicar prefixo."""
        atv_sem_prefixo = AtividadeSessao(
            codigo="CF1",
            nome="G2XG",
            tipologia="Confrontos",
            tipo_ssp="Especial",
            ordem=1,
            tempo=29,
        )
        self.assertEqual(atv_sem_prefixo.sigla_tipologia, "CF")
        self.assertEqual(atv_sem_prefixo.atividade_ssp, "CF | G2XG")

        atv_com_prefixo = AtividadeSessao(
            codigo="EC1",
            nome="JC | 2Eq MeioCampo",
            tipologia="Jogo Condicionante",
            tipo_ssp="Competitivo",
            ordem=2,
            tempo=16,
        )
        self.assertEqual(atv_com_prefixo.sigla_tipologia, "JC")
        self.assertEqual(atv_com_prefixo.atividade_ssp, "JC | 2Eq MeioCampo")

    def test_us24_unitario_identificador_atividade_distinta(self):
        """Valida unitariamente a chave de identificação de atividade por código, biblioteca ou nome manual."""
        atv_por_codigo = AtividadeSessao(
            codigo="  rd1 ",
            nome="Cont/Cob",
            tipologia="Rondo",
            tipo_ssp="Especial",
            ordem=1,
            tempo=16,
        )
        self.assertEqual(identificador_atividade_distinta(atv_por_codigo), ("codigo", "RD1"))

        atv_por_biblioteca = AtividadeSessao(
            atividade_biblioteca_id=42,
            codigo="",
            nome="Cont/Cob",
            tipologia="Rondo",
            tipo_ssp="Especial",
            ordem=1,
            tempo=16,
        )
        self.assertEqual(
            identificador_atividade_distinta(atv_por_biblioteca),
            ("biblioteca", 42),
        )

        atv_manual = AtividadeSessao(
            codigo="",
            nome="  Posse   Rápida ",
            tipologia="Jogo de Posse",
            tipo_ssp="Especial",
            ordem=1,
            tempo=20,
        )
        self.assertEqual(
            identificador_atividade_distinta(atv_manual),
            ("manual", "jogo de posse", "posse rápida"),
        )

    def test_us24_unitario_calcular_informacoes_lista_vazia_rn07(self):
        """Valida unitariamente o retorno neutro e a mensagem padrão da RN07 quando a lista está vazia."""
        resultado = calcular_informacoes_atividades_treino([])

        self.assertTrue(resultado["estado_vazio"])
        self.assertEqual(resultado["mensagem"], MENSAGEM_ATIVIDADES_VAZIO)
        self.assertEqual(resultado["total_atividades_distintas"], 0)
        self.assertEqual(resultado["total_registros"], 0)
        self.assertEqual(resultado["minutos_totais_atividades"], 0)
        self.assertEqual(resultado["minutos_totais_liquidos"], 0)
        self.assertEqual(resultado["atividades"], [])
        self.assertEqual(resultado["por_tipologia"], [])
        self.assertEqual(resultado["por_tipo_ssp"], [])
        self.assertEqual(resultado["execucoes"], [])

    def test_us24_unitario_calcular_informacoes_agrega_tempo_bruto_e_liquido_rn03(self):
        """Valida unitariamente a agregação por atividade, tipologia, SSP e tempo líquido de simultâneas (RN03)."""
        s03 = self._criar_sessao_em_memoria(1, "S03", 3, "2026-08-05")
        s04 = self._criar_sessao_em_memoria(2, "S04", 4, "2026-08-06")

        atividades_em_memoria = [
            AtividadeSessao(
                id=1,
                sessao=s03,
                codigo="CD1",
                nome="5Corredores",
                tipologia="Coletivo Direcionado",
                tipo_ssp="Competitivo",
                orientacao="Aplicação",
                ordem=1,
                tempo=28,
            ),
            # Duas atividades simultâneas na S04 (Ordem 1, 18 min cada -> 36 brutos / 18 líquidos pela RN03)
            AtividadeSessao(
                id=2,
                sessao=s04,
                codigo="DF1",
                nome="FinCruz/Chap",
                tipologia="Dinâmica de Finalização",
                tipo_ssp="Dirigido",
                orientacao="PDI",
                ordem=1,
                tempo=18,
            ),
            AtividadeSessao(
                id=3,
                sessao=s04,
                codigo="DPD1",
                nome="Circ+CabRebFrontLat",
                tipologia="Dinâmica ProtDef",
                tipo_ssp="Dirigido",
                orientacao="PDI",
                ordem=1,
                tempo=18,
            ),
            # Repetição de CD1 na S04 (Ordem 2, 33 min) -> CD1 soma 28 + 33 = 61 min
            AtividadeSessao(
                id=4,
                sessao=s04,
                codigo="CD1",
                nome="5Corredores",
                tipologia="Coletivo Direcionado",
                tipo_ssp="Competitivo",
                orientacao="Aplicação",
                ordem=2,
                tempo=33,
            ),
        ]

        resultado = calcular_informacoes_atividades_treino(atividades_em_memoria)

        self.assertFalse(resultado["estado_vazio"])
        self.assertIsNone(resultado["mensagem"])
        self.assertEqual(resultado["total_atividades_distintas"], 3)
        self.assertEqual(resultado["total_registros"], 4)
        self.assertEqual(resultado["minutos_totais_atividades"], 97)  # 28 + 18 + 18 + 33
        self.assertEqual(resultado["minutos_totais_liquidos"], 79)  # 28 + 18 (simultânea) + 33

        # Ranking de atividades: CD1 em 1º lugar com 61 min e 2 execuções em 2 sessões
        lider = resultado["atividades"][0]
        self.assertEqual(lider["codigo"], "CD1")
        self.assertEqual(lider["atividade_ssp"], "CD | 5Corredores")
        self.assertEqual(lider["minutos"], 61)
        self.assertEqual(lider["execucoes"], 2)
        self.assertEqual(lider["sessoes_distintas"], 2)
        self.assertAlmostEqual(lider["percentual_tempo"], round((61 / 97) * 100, 2))
        self.assertAlmostEqual(lider["percentual_tempo_liquido"], round((61 / 79) * 100, 2))

        # Agrupamento por Tipo de SSP: Competitivo (61 min) e Dirigido (36 min)
        ssp_map = {item["tipo_ssp"]: item for item in resultado["por_tipo_ssp"]}
        self.assertEqual(ssp_map["Competitivo"]["minutos"], 61)
        self.assertEqual(ssp_map["Competitivo"]["atividades_distintas"], 1)
        self.assertEqual(ssp_map["Dirigido"]["minutos"], 36)
        self.assertEqual(ssp_map["Dirigido"]["atividades_distintas"], 2)

    def test_us24_unitario_serializador_saida_formata_campos_corretamente(self):
        """Valida unitariamente o InformacoesAtividadesTreinoSerializer sem acesso ao banco."""
        dados_dominio = calcular_informacoes_atividades_treino([])
        serializer = InformacoesAtividadesTreinoSerializer(dados_dominio)

        self.assertEqual(
            set(serializer.data.keys()),
            {
                "total_atividades_distintas",
                "total_registros",
                "minutos_totais_atividades",
                "minutos_totais_liquidos",
                "atividades",
                "por_tipologia",
                "por_tipo_ssp",
                "execucoes",
                "estado_vazio",
                "mensagem",
            },
        )
        self.assertTrue(serializer.data["estado_vazio"])
        self.assertEqual(serializer.data["mensagem"], MENSAGEM_ATIVIDADES_VAZIO)


class InformacoesAtividadesTreinoApiTests(APITestCase):
    """Testes automatizados da US24 / RF24 (Consultar informação de atividade do treino — RN03 e RN07)."""

    url = "/api/treinos/atividades-treino/"

    def setUp(self):
        self.macrociclo = Macrociclo.objects.create(
            nome="2026",
            data_inicio="2026-01-01",
            data_termino="2026-12-31",
        )
        self.me1 = Mesociclo.objects.create(
            macrociclo=self.macrociclo,
            nome="ME1",
            data_inicio="2026-08-01",
            data_termino="2026-08-15",
        )
        self.me2 = Mesociclo.objects.create(
            macrociclo=self.macrociclo,
            nome="ME2",
            data_inicio="2026-08-16",
            data_termino="2026-08-31",
        )
        self.mc1 = Microciclo.objects.create(
            mesociclo=self.me1,
            nome="MC1",
            data_inicio="2026-08-03",
            data_termino="2026-08-09",
        )
        self.mc2 = Microciclo.objects.create(
            mesociclo=self.me1,
            nome="MC2",
            data_inicio="2026-08-10",
            data_termino="2026-08-15",
        )
        self.mc3 = Microciclo.objects.create(
            mesociclo=self.me2,
            nome="MC3",
            data_inicio="2026-08-16",
            data_termino="2026-08-23",
        )

    def _popular_planilha_oficial(self):
        catalogo_biblioteca = {
            "CF1": ("G2XG", "Confrontos", "Especial"),
            "JC1": ("RecPosPerd", "Jogo Condicionante", "Especial"),
            "DP1": ("DomOrien | Var1", "Dinâmica de Passe", "Dirigido"),
            "JP1": ("RecPosPerd", "Jogo de Posse", "Especial"),
            "JC2": ("AlemRecPosPerd", "Jogo Condicionante", "Especial"),
            "RD1": ("Cont/Cob", "Rondo", "Especial"),
            "JS1": ("1ª/2ªConst", "Jogo Setorial", "Especial"),
            "CD1": ("5Corredores", "Coletivo Direcionado", "Competitivo"),
            "DF1": ("FinCruz/Chap", "Dinâmica de Finalização", "Dirigido"),
            "DPD1": ("Circ+CabRebFrontLat", "Dinâmica ProtDef", "Dirigido"),
            "JBP1": ("ColetivoBP", "Jogo de Bola Parada", "Competitivo"),
            "SIT1": ("JgAer/CaAtqRap", "Situacional", "Especial"),
            "JS2": ("Cri/Fin", "Jogo Setorial", "Especial"),
            "JBP2": ("Meio Campo", "Jogo de Bola Parada", "Competitivo"),
            "DP2": ("DomOrien | Var2", "Dinâmica de Passe", "Dirigido"),
            "EC1": ("JC | 2Eq MeioCampo", "Jogo Condicionante", "Competitivo"),
            "DF2": ("CruzZon1/Fin1ª", "Dinâmica de Finalização", "Dirigido"),
            "DPD2": ("BolDesc+ CabRebFrontLat", "Dinâmica ProtDef", "Dirigido"),
        }

        sessoes_planilha = [
            ("S01", self.mc1, "2026-08-03", [(1, "CF1", 29, "Aquisição"), (2, "JC1", 20, "Aquisição")]),
            (
                "S02",
                self.mc1,
                "2026-08-04",
                [(1, "DP1", 23, "PDI"), (2, "JP1", 23, "Aquisição"), (3, "JC2", 27, "Aquisição")],
            ),
            (
                "S03",
                self.mc1,
                "2026-08-05",
                [(1, "RD1", 16, "Aplicação"), (2, "JS1", 22, "Aquisição"), (3, "CD1", 28, "Aplicação")],
            ),
            (
                "S04",
                self.mc1,
                "2026-08-06",
                [(1, "DF1", 18, "PDI"), (1, "DPD1", 18, "PDI"), (2, "JBP1", 29, "Aplicação")],
            ),
            ("S05", self.mc1, "2026-08-07", [(1, "SIT1", 20, "Aquisição"), (2, "JS2", 45, "Aplicação")]),
            ("S08", self.mc2, "2026-08-11", [(1, "RD1", 14, "Aquisição"), (2, "JP1", 29, "Aquisição")]),
            (
                "S09",
                self.mc2,
                "2026-08-12",
                [(1, "DP2", 14, "PDI"), (2, "JS1", 28, "Aplicação"), (3, "CD1", 33, "Aplicação")],
            ),
            (
                "S10",
                self.mc2,
                "2026-08-13",
                [(1, "DF1", 21, "PDI"), (1, "DPD1", 21, "PDI"), (2, "SIT1", 24, "Aquisição")],
            ),
            ("S11", self.mc2, "2026-08-14", [(1, "JBP2", 39, "Aplicação"), (2, "EC1", 16, "Eq Carga")]),
            (
                "S12",
                self.mc3,
                "2026-08-17",
                [
                    (1, "DP1", 20, "PDI"),
                    (1, "DPD2", 20, "PDI"),
                    (1, "DF2", 20, "PDI"),
                    (2, "EC1", 20, "Eq Carga"),
                ],
            ),
        ]

        for nome_sessao, micro, data_str, itens in sessoes_planilha:
            sessao = Sessao.objects.create(microciclo=micro, nome=nome_sessao, data=data_str)
            for ordem, codigo, tempo, orientacao in itens:
                nome_atv, tipologia, tipo_ssp = catalogo_biblioteca[codigo]
                AtividadeSessao.objects.create(
                    sessao=sessao,
                    codigo=codigo,
                    nome=nome_atv,
                    tipologia=tipologia,
                    tipo_ssp=tipo_ssp,
                    orientacao=orientacao,
                    ordem=ordem,
                    tempo=tempo,
                )

    def test_us24_retorna_estado_vazio_neutro_sem_atividades_rn07(self):
        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        self.assertEqual(data["total_atividades_distintas"], 0)
        self.assertEqual(data["total_registros"], 0)
        self.assertEqual(data["minutos_totais_atividades"], 0)
        self.assertEqual(data["minutos_totais_liquidos"], 0)
        self.assertEqual(data["atividades"], [])
        self.assertEqual(data["por_tipologia"], [])
        self.assertEqual(data["por_tipo_ssp"], [])
        self.assertEqual(data["execucoes"], [])
        self.assertTrue(data["estado_vazio"])
        self.assertEqual(
            data["mensagem"],
            "Nenhuma atividade encontrada para os filtros aplicados.",
        )

    def test_us24_consolida_atividades_tipologias_e_ssp_conforme_planilha_oficial(self):
        self._popular_planilha_oficial()

        response = self.client.get(f"{self.url}?mes=Ago")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()

        self.assertFalse(data["estado_vazio"])
        self.assertIsNone(data["mensagem"])
        self.assertEqual(data["total_atividades_distintas"], 18)
        self.assertEqual(data["total_registros"], 27)
        self.assertEqual(data["minutos_totais_atividades"], 637)
        self.assertEqual(data["minutos_totais_liquidos"], 558)

        # Atividade com maior minutagem na planilha: CD1 (28 + 33 = 61 min)
        primeira_atv = data["atividades"][0]
        self.assertEqual(primeira_atv["codigo"], "CD1")
        self.assertEqual(primeira_atv["atividade_ssp"], "CD | 5Corredores")
        self.assertEqual(primeira_atv["minutos"], 61)
        self.assertEqual(primeira_atv["execucoes"], 2)
        self.assertEqual(primeira_atv["sessoes_distintas"], 2)

        # Distribuição por Tipo SSP (Especial = 297 min, Dirigido = 175 min, Competitivo = 165 min)
        ssp_por_nome = {item["tipo_ssp"]: item for item in data["por_tipo_ssp"]}
        self.assertEqual(ssp_por_nome["Especial"]["minutos"], 297)
        self.assertEqual(ssp_por_nome["Especial"]["execucoes"], 12)
        self.assertEqual(ssp_por_nome["Especial"]["atividades_distintas"], 8)

        self.assertEqual(ssp_por_nome["Dirigido"]["minutos"], 175)
        self.assertEqual(ssp_por_nome["Dirigido"]["execucoes"], 9)
        self.assertEqual(ssp_por_nome["Dirigido"]["atividades_distintas"], 6)

        self.assertEqual(ssp_por_nome["Competitivo"]["minutos"], 165)
        self.assertEqual(ssp_por_nome["Competitivo"]["execucoes"], 6)
        self.assertEqual(ssp_por_nome["Competitivo"]["atividades_distintas"], 4)

    def test_us24_filtra_por_periodizacao_tipologia_tipo_ssp_codigo_e_busca(self):
        self._popular_planilha_oficial()

        # Filtro por sigla de tipologia: JC -> JC1 (20), JC2 (27) e EC1 (16 + 20 = 36) = 83 min
        r_jc = self.client.get(f"{self.url}?tipologia=JC")
        self.assertEqual(r_jc.status_code, status.HTTP_200_OK)
        self.assertEqual(r_jc.json()["total_atividades_distintas"], 3)
        self.assertEqual(r_jc.json()["total_registros"], 4)
        self.assertEqual(r_jc.json()["minutos_totais_atividades"], 83)

        # Filtro por tipo_ssp=Competitivo
        r_comp = self.client.get(f"{self.url}?tipo_ssp=Competitivo")
        self.assertEqual(r_comp.json()["total_atividades_distintas"], 4)
        self.assertEqual(r_comp.json()["minutos_totais_atividades"], 165)

        # Filtro por código específico: RD1 (16 + 14 = 30 min)
        r_rd1 = self.client.get(f"{self.url}?codigo=RD1")
        self.assertEqual(r_rd1.json()["total_atividades_distintas"], 1)
        self.assertEqual(r_rd1.json()["minutos_totais_atividades"], 30)

        # Filtro por mesociclo ME2 (apenas S12: 3 simultâneas de 20 min + 1 de 20 min -> 80 brutos / 40 líquidos)
        r_me2 = self.client.get(f"{self.url}?mesociclo={self.me2.id}")
        self.assertEqual(r_me2.json()["total_atividades_distintas"], 4)
        self.assertEqual(r_me2.json()["minutos_totais_atividades"], 80)
        self.assertEqual(r_me2.json()["minutos_totais_liquidos"], 40)

        # Filtro por busca textual: "RecPosPerd" -> JC1, JP1 e JC2
        r_busca = self.client.get(f"{self.url}?busca=RecPosPerd")
        self.assertEqual(r_busca.json()["total_atividades_distintas"], 3)

        # Filtro sem correspondência -> estado vazio padronizado (RN07)
        r_vazio = self.client.get(f"{self.url}?codigo=INEXISTENTE")
        self.assertEqual(r_vazio.status_code, status.HTTP_200_OK)
        self.assertTrue(r_vazio.json()["estado_vazio"])
        self.assertEqual(
            r_vazio.json()["mensagem"],
            "Nenhuma atividade encontrada para os filtros aplicados.",
        )


class SincronizacaoPrincipiosTaticosAtividadeTests(APITestCase):
    """Testa a sincronização entre princípios táticos das atividades e o catálogo ComportamentoTatico."""

    def test_criacao_atividade_biblioteca_reutiliza_existente_e_cadastra_novo_principio(self):
        ComportamentoTatico.objects.create(nome="Reação Pós-Perda")

        response = self.client.post(
            "/api/treinos/biblioteca/",
            {
                "nome": "Circ+CabRebFrontLat",
                "tipologia": "Dinâmica ProtDef",
                "tipo_ssp": "Dirigido",
                "orientacao": "PDI",
                "comportamentos": ["reacao pos-perda", "CoordLinDef"],
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(
            response.json()["comportamentos"],
            ["Reação Pós-Perda", "CoordLinDef"],
        )

        catalogo = self.client.get("/api/treinos/comportamentos/").json()
        nomes_catalogo = [item["nome"] for item in catalogo]
        self.assertEqual(nomes_catalogo, ["CoordLinDef", "Reação Pós-Perda"])

    def test_edicao_atividade_biblioteca_cadastra_novo_principio_no_catalogo(self):
        atv = AtividadeBiblioteca.objects.create(
            nome="G2XG",
            tipologia="Confrontos",
            tipo_ssp="Especial",
            comportamentos=["Cobertura"],
        )

        response = self.client.patch(
            f"/api/treinos/biblioteca/{atv.id}/",
            {"comportamentos": ["Cobertura", "DefCruz"]},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(ComportamentoTatico.objects.filter(nome="DefCruz").exists())

    def test_criacao_atividade_sessao_cadastra_novo_principio_no_catalogo(self):
        macro = Macrociclo.objects.create(
            nome="2026",
            data_inicio="2026-01-01",
            data_termino="2026-12-31",
        )
        meso = Mesociclo.objects.create(
            macrociclo=macro,
            nome="ME1",
            data_inicio="2026-08-01",
            data_termino="2026-08-15",
        )
        micro = Microciclo.objects.create(
            mesociclo=meso,
            nome="MC1",
            data_inicio="2026-08-03",
            data_termino="2026-08-09",
        )
        sessao = Sessao.objects.create(
            microciclo=micro,
            nome="S01",
            data="2026-08-03",
        )

        response = self.client.post(
            "/api/treinos/atividades-sessao/",
            {
                "sessao": sessao.id,
                "nome": "5Corredores",
                "tipologia": "Coletivo Direcionado",
                "tipo_ssp": "Competitivo",
                "ordem": 1,
                "tempo": 28,
                "comportamentos": ["Amplitude", "Balanço Def"],
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(ComportamentoTatico.objects.filter(nome="Amplitude").exists())
        self.assertTrue(ComportamentoTatico.objects.filter(nome="Balanço Def").exists())


