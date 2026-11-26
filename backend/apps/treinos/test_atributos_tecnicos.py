from unittest.mock import patch

from django.apps import apps
from django.db import IntegrityError, connection
from django.db.migrations.executor import MigrationExecutor
from django.test import TransactionTestCase
from django.urls import reverse
from rest_framework.test import APITestCase

from .models import AtividadeBiblioteca, AtividadeSessao, AtributoTecnico


def criar_sessao(registro_apps):
    macro = registro_apps.get_model("ciclos", "Macrociclo").objects.create(
        codigo="MC-01", nome="Temporada", data_inicio="2026-01-01", data_termino="2026-12-31"
    )
    meso = registro_apps.get_model("ciclos", "Mesociclo").objects.create(
        nome="Preparação",
        macrociclo=macro,
        data_inicio="2026-02-01",
        data_termino="2026-02-28",
    )
    micro = registro_apps.get_model("ciclos", "Microciclo").objects.create(
        nome="Semana 1",
        mesociclo=meso,
        data_inicio="2026-02-01",
        data_termino="2026-02-07",
    )
    return registro_apps.get_model("treinos", "Sessao").objects.create(
        microciclo=micro, sequencia=1, nome="Sessão de treino", data="2026-02-02"
    )


class AtributoTecnicoApiTests(APITestCase):
    dados_atividade = {
        "nome": "Exercício de domínio",
        "tipologia": "Dinâmica de Passe",
        "tipo_ssp": "Dirigido",
    }

    @classmethod
    def setUpTestData(cls):
        cls.sessao = criar_sessao(apps)

    def setUp(self):
        self.catalogo = reverse("treinos:atributo-tecnico-list-create")
        self.biblioteca = reverse("treinos:biblioteca-list-create")
        self.atividades_sessao = reverse("treinos:atividade-sessao-list-create")
        self.dados_sessao = self.dados_atividade | self.dados_reutilizacao()

    def dados_reutilizacao(self):
        return {"sessao": self.sessao.pk, "ordem": 1, "tempo": 10}

    def nomes_catalogo(self):
        resposta = self.client.get(self.catalogo)
        self.assertEqual(resposta.status_code, 200)
        return [atributo["nome"] for atributo in resposta.json()]

    def test_cadastra_e_lista_atributos_com_nome_legivel(self):
        resposta = self.client.post(
            self.catalogo, {"nome": "  Domínio  orientado  "}, format="json"
        )

        self.assertEqual(resposta.status_code, 201)
        self.assertEqual(
            resposta.json(), {"id": AtributoTecnico.objects.get().pk, "nome": "Domínio orientado"}
        )
        self.assertEqual(self.nomes_catalogo(), ["Domínio orientado"])

    def test_rejeita_nome_ausente_vazio_ou_de_tipo_invalido(self):
        for dados in ({}, {"nome": ""}, {"nome": " \t "}, {"nome": 321}, {"nome": None}):
            with self.subTest(dados=dados):
                resposta = self.client.post(self.catalogo, dados, format="json")
                self.assertEqual(resposta.status_code, 400)
                self.assertIn("nome", resposta.json())
        self.assertFalse(AtributoTecnico.objects.exists())

    def test_rejeita_duplicatas_exatas_e_normalizadas(self):
        AtributoTecnico.objects.create(nome="Domínio orientado")

        for nome in (
            "Domínio orientado",
            "domínio orientado",
            "DOMÍNIO ORIENTADO",
            "Dominio Orientado",
        ):
            with self.subTest(nome=nome):
                resposta = self.client.post(self.catalogo, {"nome": nome}, format="json")
                self.assertEqual(resposta.status_code, 400)
                self.assertIn("nome", resposta.json())
        self.assertEqual(self.nomes_catalogo(), ["Domínio orientado"])

    def test_biblioteca_registra_multiplos_atributos_sem_alterar_o_formato(self):
        atributos = ["Domínio orientado", "Passe curto", "Finalização"]
        dados = self.dados_atividade | {"atributos_tecnicos": atributos}

        resposta = self.client.post(self.biblioteca, dados, format="json")

        self.assertEqual(resposta.status_code, 201)
        self.assertEqual(resposta.json()["atributos_tecnicos"], atributos)
        self.assertEqual(AtividadeBiblioteca.objects.get().atributos_tecnicos, atributos)
        self.assertCountEqual(self.nomes_catalogo(), atributos)

    def test_sessao_reutiliza_atributo_e_registra_novo_nome(self):
        AtributoTecnico.objects.create(nome="Domínio orientado")
        atributos = ["DOMINIO ORIENTADO", "Passe curto"]
        dados = self.dados_sessao | {"atributos_tecnicos": atributos}

        resposta = self.client.post(self.atividades_sessao, dados, format="json")

        self.assertEqual(resposta.status_code, 201)
        self.assertEqual(resposta.json()["atributos_tecnicos"], atributos)
        self.assertEqual(AtividadeSessao.objects.get().atributos_tecnicos, atributos)
        self.assertCountEqual(self.nomes_catalogo(), ["Domínio orientado", "Passe curto"])

    def test_atributos_sao_opcionais_e_comportamentos_ficam_fora_do_catalogo(self):
        dados = self.dados_atividade | {"comportamentos": ["Amplitude"]}
        biblioteca = self.client.post(self.biblioteca, dados, format="json")
        sessao = self.client.post(
            self.atividades_sessao, self.dados_sessao | {"atributos_tecnicos": []}, format="json"
        )

        self.assertEqual(biblioteca.status_code, 201)
        self.assertEqual(sessao.status_code, 201)
        self.assertEqual(biblioteca.json()["atributos_tecnicos"], [])
        self.assertEqual(sessao.json()["atributos_tecnicos"], [])
        self.assertEqual(self.nomes_catalogo(), [])

    def test_rejeita_atributos_vazios_e_valores_invalidos_nos_dois_endpoints(self):
        casos = (["Passe curto", ""], [" \t "], [21], [None], [{}], "Passe curto", {})
        for url, dados in (
            (self.biblioteca, self.dados_atividade),
            (self.atividades_sessao, self.dados_sessao),
        ):
            for atributos in casos:
                with self.subTest(url=url, atributos=atributos):
                    resposta = self.client.post(
                        url, dados | {"atributos_tecnicos": atributos}, format="json"
                    )
                    self.assertEqual(resposta.status_code, 400)
                    self.assertIn("atributos_tecnicos", resposta.json())
        self.assertFalse(AtividadeBiblioteca.objects.exists())
        self.assertFalse(AtividadeSessao.objects.exists())
        self.assertFalse(AtributoTecnico.objects.exists())

    def test_nomes_longos_continuam_aceitos(self):
        nome = "atributo técnico " * 200 + "final"
        dados = self.dados_atividade | {"atributos_tecnicos": [nome]}

        resposta = self.client.post(self.biblioteca, dados, format="json")

        self.assertEqual(resposta.status_code, 201)
        self.assertEqual(resposta.json()["atributos_tecnicos"], [nome])
        self.assertEqual(self.nomes_catalogo(), [nome])

    def test_patch_na_biblioteca_e_put_na_sessao_registram_novos_atributos(self):
        bib = self.client.post(self.biblioteca, self.dados_atividade, format="json").json()
        sessao = self.client.post(self.atividades_sessao, self.dados_sessao, format="json").json()

        biblioteca = self.client.patch(
            reverse("treinos:biblioteca-detail", args=[bib["id"]]),
            {"atributos_tecnicos": ["Passe curto"]},
            format="json",
        )
        atividade = self.client.put(
            reverse("treinos:atividade-sessao-detail", args=[sessao["id"]]),
            self.dados_sessao | {"atributos_tecnicos": ["Finalização"]},
            format="json",
        )

        self.assertEqual(biblioteca.status_code, 200)
        self.assertEqual(atividade.status_code, 200)
        self.assertEqual(AtividadeBiblioteca.objects.get().atributos_tecnicos, ["Passe curto"])
        self.assertEqual(AtividadeSessao.objects.get().atributos_tecnicos, ["Finalização"])
        self.assertCountEqual(self.nomes_catalogo(), ["Passe curto", "Finalização"])

    def test_copia_da_biblioteca_preserva_atributos_e_edicao_e_independente(self):
        atributos = ["Domínio orientado", "Passe curto"]
        biblioteca = AtividadeBiblioteca.objects.create(
            **self.dados_atividade, atributos_tecnicos=atributos
        )
        resposta = self.client.post(
            self.atividades_sessao,
            self.dados_reutilizacao() | {"atividade_biblioteca": biblioteca.pk},
            format="json",
        )
        self.assertEqual(resposta.status_code, 201)
        self.assertEqual(resposta.json()["atributos_tecnicos"], atributos)
        self.assertCountEqual(self.nomes_catalogo(), atributos)

        edicao = self.client.patch(
            reverse("treinos:atividade-sessao-detail", args=[resposta.json()["id"]]),
            {"atributos_tecnicos": ["Finalização"]},
            format="json",
        )
        self.assertEqual(edicao.status_code, 200)
        biblioteca.refresh_from_db()
        self.assertEqual(biblioteca.atributos_tecnicos, atributos)
        self.assertCountEqual(self.nomes_catalogo(), [*atributos, "Finalização"])

    def test_atividade_invalida_nao_pre_alimenta_o_catalogo(self):
        dados = self.dados_atividade | {"comprimento": 4, "atributos_tecnicos": ["Passe curto"]}

        resposta = self.client.post(self.biblioteca, dados, format="json")

        self.assertEqual(resposta.status_code, 400)
        self.assertFalse(AtividadeBiblioteca.objects.exists())
        self.assertFalse(AtributoTecnico.objects.exists())

    def test_falha_na_operacao_reverte_catalogo_e_atividade(self):
        registrar_nomes = AtributoTecnico.registrar_nomes

        def registrar_e_falhar(nomes):
            registrar_nomes(nomes)
            raise IntegrityError("Falha simulada após a inclusão no catálogo")

        dados = self.dados_atividade | {"atributos_tecnicos": ["Passe curto"]}
        with patch.object(AtributoTecnico, "registrar_nomes", side_effect=registrar_e_falhar):
            with self.assertRaises(IntegrityError):
                self.client.post(self.biblioteca, dados, format="json")

        self.assertFalse(AtividadeBiblioteca.objects.exists())
        self.assertFalse(AtributoTecnico.objects.exists())


class PopularAtributosTecnicosMigrationTests(TransactionTestCase):
    anterior = [("treinos", "0005_atributotecnico")]
    atual = [("treinos", "0006_popular_atributos_tecnicos")]

    def test_migracao_popula_catalogo_sem_alterar_atividades(self):
        executor = MigrationExecutor(connection)
        self.addCleanup(lambda: MigrationExecutor(connection).migrate(self.atual))
        executor.migrate(self.anterior)
        apps_anteriores = executor.loader.project_state(self.anterior).apps
        sessao = criar_sessao(apps_anteriores)
        biblioteca = apps_anteriores.get_model("treinos", "AtividadeBiblioteca")
        atividade_sessao = apps_anteriores.get_model("treinos", "AtividadeSessao")
        dados = {
            "nome": "Exercício legado",
            "tipologia": "Dinâmica de Passe",
            "tipo_ssp": "Dirigido",
        }
        lista_biblioteca = ["  Domínio  orientado  ", "DOMINIO ORIENTADO", "", 5]
        lista_sessao = ["domínio orientado", "Passe curto", None, " \t "]
        bib = biblioteca.objects.create(codigo="DP01", atributos_tecnicos=lista_biblioteca, **dados)
        atividade = atividade_sessao.objects.create(
            sessao=sessao,
            atividade_biblioteca=bib,
            ordem=1,
            tempo=10,
            atributos_tecnicos=lista_sessao,
            **dados,
        )
        biblioteca.objects.create(codigo="DP02", atributos_tecnicos={"outro": "inválido"}, **dados)

        MigrationExecutor(connection).migrate(self.atual)

        self.assertCountEqual(
            AtributoTecnico.objects.values_list("nome", flat=True),
            ["Domínio orientado", "Passe curto"],
        )
        bib.refresh_from_db()
        atividade.refresh_from_db()
        self.assertEqual(bib.atributos_tecnicos, lista_biblioteca)
        self.assertEqual(atividade.atributos_tecnicos, lista_sessao)
        self.assertEqual(atividade.atividade_biblioteca_id, bib.pk)
