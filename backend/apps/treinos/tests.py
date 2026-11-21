"""Testes da API de sessões e biblioteca de treinos."""

from django.apps import apps
from django.test import SimpleTestCase, TestCase
from rest_framework import status
from rest_framework.test import APITestCase

from apps.ciclos.models import Macrociclo, Mesociclo, Microciclo

from .models import AtividadeBiblioteca, AtividadeSessao, ComportamentoTatico, Sessao



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
