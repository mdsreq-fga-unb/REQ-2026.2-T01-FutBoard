"""Serializers da API de sessões e biblioteca de treinos."""

from rest_framework import serializers

from .models import (
    FASES_JOGO_VALIDAS,
    MOMENTOS_JOGO_VALIDOS,
    ORIENTACOES_VALIDAS,
    SIGLAS_POR_TIPOLOGIA,
    TIPOLOGIAS_MAPA,
    TIPOS_SSP_VALIDOS,
    AtividadeBiblioteca,
    AtividadeSessao,
    ComportamentoTatico,
    Sessao,
    normalizar_nome_comportamento,
)


class SessaoSerializer(serializers.ModelSerializer):
    mes = serializers.SerializerMethodField()

    class Meta:
        model = Sessao
        fields = [
            "id",
            "microciclo",
            "sequencia",
            "nome",
            "data",
            "mes",
        ]
        read_only_fields = [
            "id",
            "sequencia",
            "mes",
        ]

    def get_mes(self, obj):
        meses = [
            "Janeiro",
            "Fevereiro",
            "Março",
            "Abril",
            "Maio",
            "Junho",
            "Julho",
            "Agosto",
            "Setembro",
            "Outubro",
            "Novembro",
            "Dezembro",
        ]
        return meses[obj.data.month - 1]

    def validate(self, attrs):
        instance = self.instance

        if instance and "microciclo" in attrs:
            if attrs["microciclo"].id != instance.microciclo_id:
                raise serializers.ValidationError(
                    {"microciclo": ("Não é permitido alterar o microciclo de uma sessão.")}
                )

        data = attrs.get(
            "data",
            getattr(instance, "data", None),
        )
        microciclo = attrs.get(
            "microciclo",
            getattr(instance, "microciclo", None),
        )

        if microciclo and data:
            if data < microciclo.data_inicio:
                raise serializers.ValidationError(
                    {"data": ("A sessão não pode ocorrer antes do início do microciclo.")}
                )

            if data > microciclo.data_termino:
                raise serializers.ValidationError(
                    {"data": ("A sessão não pode ocorrer depois do término do microciclo.")}
                )

        return attrs

class ComportamentoTaticoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ComportamentoTatico
        fields = ["id", "nome"]
        read_only_fields = ["id"]

    def validate_nome(self, value):
        nome = " ".join(value.split())

        if not nome:
            raise serializers.ValidationError(
                "O nome do comportamento é obrigatório."
            )

        nome_normalizado = normalizar_nome_comportamento(nome)

        comportamentos = ComportamentoTatico.objects.filter(
            nome_normalizado=nome_normalizado
        )

        if self.instance:
            comportamentos = comportamentos.exclude(
                pk=self.instance.pk
            )

        if comportamentos.exists():
            raise serializers.ValidationError(
                "Já existe um comportamento tático com esse nome."
            )

        return nome


def _normalizar_lista_textos(valor, nome_campo, opcoes_validas=None):
    if valor is None:
        return []
    if not isinstance(valor, list):
        raise serializers.ValidationError(f"O campo {nome_campo} deve ser uma lista.")

    resultado = []
    for item in valor:
        if not isinstance(item, str):
            raise serializers.ValidationError(
                f"Todos os itens de {nome_campo} devem ser textos."
            )
        texto = " ".join(item.split())
        if not texto:
            raise serializers.ValidationError(
                f"O campo {nome_campo} não pode conter valores vazios."
            )
        if opcoes_validas and texto not in opcoes_validas:
            opcoes_str = ", ".join(opcoes_validas)
            raise serializers.ValidationError(
                f"Valor inválido '{texto}' em {nome_campo}. Opções válidas: {opcoes_str}."
            )
        if texto not in resultado:
            resultado.append(texto)
    return resultado


class AtividadeBibliotecaSerializer(serializers.ModelSerializer):
    codigo = serializers.CharField(max_length=20, required=False, allow_blank=True)
    tipologia = serializers.CharField(max_length=50)
    sigla_tipologia = serializers.ReadOnlyField()
    atividade_ssp = serializers.ReadOnlyField()

    class Meta:
        model = AtividadeBiblioteca
        fields = [
            "id",
            "codigo",
            "nome",
            "atividade_ssp",
            "tipologia",
            "sigla_tipologia",
            "tipo_ssp",
            "orientacao",
            "comprimento",
            "largura",
            "numero_jogadores",
            "area_por_jogador",
            "dimensao_espaco",
            "momentos_jogo",
            "fases_jogo",
            "comportamentos",
            "atributos_tecnicos",
            "criado_em",
            "atualizado_em",
        ]
        read_only_fields = [
            "id",
            "sigla_tipologia",
            "atividade_ssp",
            "area_por_jogador",
            "dimensao_espaco",
            "criado_em",
            "atualizado_em",
        ]

    def validate_nome(self, value):
        nome = " ".join((value or "").split())
        if not nome:
            raise serializers.ValidationError("O nome da atividade é obrigatório.")
        return nome

    def validate_codigo(self, value):
        codigo = (value or "").strip().upper()
        if not codigo:
            if self.instance:
                return self.instance.codigo
            return ""
        qs = AtividadeBiblioteca.objects.filter(codigo__iexact=codigo)
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise serializers.ValidationError(
                "Já existe uma atividade cadastrada na biblioteca com este código."
            )
        return codigo

    def validate_tipologia(self, value):
        texto = " ".join((value or "").split())
        sigla_upper = texto.upper()
        if sigla_upper in TIPOLOGIAS_MAPA:
            return TIPOLOGIAS_MAPA[sigla_upper]
        if texto in SIGLAS_POR_TIPOLOGIA:
            return texto
        opcoes = ", ".join(
            f"{sigla} ({nome})" for sigla, nome in TIPOLOGIAS_MAPA.items()
        )
        raise serializers.ValidationError(
            f"Tipologia inválida. Informe uma das opções válidas: {opcoes}."
        )

    def validate_tipo_ssp(self, value):
        texto = (value or "").strip()
        if texto not in TIPOS_SSP_VALIDOS:
            opcoes = ", ".join(TIPOS_SSP_VALIDOS)
            raise serializers.ValidationError(
                f"Tipo de SSP inválido. Opções válidas: {opcoes}."
            )
        return texto

    def validate_orientacao(self, value):
        texto = (value or "").strip()
        if texto and texto not in ORIENTACOES_VALIDAS:
            opcoes = ", ".join(ORIENTACOES_VALIDAS)
            raise serializers.ValidationError(
                f"Orientação inválida. Opções válidas: {opcoes}."
            )
        return texto

    def validate_momentos_jogo(self, value):
        return _normalizar_lista_textos(
            value,
            "momentos_jogo",
            opcoes_validas=MOMENTOS_JOGO_VALIDOS,
        )

    def validate_fases_jogo(self, value):
        return _normalizar_lista_textos(
            value,
            "fases_jogo",
            opcoes_validas=FASES_JOGO_VALIDAS,
        )

    def validate_comportamentos(self, value):
        return _normalizar_lista_textos(value, "comportamentos")

    def validate_atributos_tecnicos(self, value):
        return _normalizar_lista_textos(value, "atributos_tecnicos")

    def validate(self, attrs):
        instance = self.instance
        orientacao = attrs.get(
            "orientacao",
            getattr(instance, "orientacao", ""),
        )
        comprimento = attrs.get(
            "comprimento",
            getattr(instance, "comprimento", None),
        )
        largura = attrs.get(
            "largura",
            getattr(instance, "largura", None),
        )
        numero_jogadores = attrs.get(
            "numero_jogadores",
            getattr(instance, "numero_jogadores", None),
        )

        if orientacao == "PDI":
            attrs["comprimento"] = None
            attrs["largura"] = None
            attrs["numero_jogadores"] = None
            return attrs

        campos_espaco = (comprimento, largura, numero_jogadores)
        algum_preenchido = any(valor is not None for valor in campos_espaco)
        todos_preenchidos = all(valor is not None for valor in campos_espaco)

        if algum_preenchido and not todos_preenchidos:
            raise serializers.ValidationError(
                {
                    "dimensao_espaco": (
                        "Para calcular a área e a dimensão do espaço, informe comprimento, "
                        "largura e número de jogadores."
                    )
                }
            )

        erros = {}
        if comprimento is not None and comprimento <= 0:
            erros["comprimento"] = "O comprimento deve ser maior que zero."
        if largura is not None and largura <= 0:
            erros["largura"] = "A largura deve ser maior que zero."
        if numero_jogadores is not None and numero_jogadores <= 0:
            erros["numero_jogadores"] = "O número de jogadores deve ser maior que zero."

        if erros:
            raise serializers.ValidationError(erros)

        return attrs


class AtividadeSessaoSerializer(serializers.ModelSerializer):
    codigo = serializers.CharField(max_length=20, required=False, allow_blank=True)
    nome = serializers.CharField(max_length=255, required=False, allow_blank=True)
    tipologia = serializers.CharField(max_length=50, required=False, allow_blank=True)
    tipo_ssp = serializers.CharField(max_length=20, required=False, allow_blank=True)
    sigla_tipologia = serializers.ReadOnlyField()
    atividade_ssp = serializers.ReadOnlyField()

    class Meta:
        model = AtividadeSessao
        fields = [
            "id",
            "sessao",
            "atividade_biblioteca",
            "codigo",
            "nome",
            "atividade_ssp",
            "tipologia",
            "sigla_tipologia",
            "tipo_ssp",
            "orientacao",
            "ordem",
            "tempo",
            "comprimento",
            "largura",
            "numero_jogadores",
            "area_por_jogador",
            "dimensao_espaco",
            "momentos_jogo",
            "fases_jogo",
            "comportamentos",
            "atributos_tecnicos",
            "criado_em",
            "atualizado_em",
        ]
        read_only_fields = [
            "id",
            "sigla_tipologia",
            "atividade_ssp",
            "area_por_jogador",
            "dimensao_espaco",
            "criado_em",
            "atualizado_em",
        ]

    def validate_nome(self, value):
        return " ".join((value or "").split())

    def validate_codigo(self, value):
        return (value or "").strip().upper()

    def validate_tipologia(self, value):
        texto = " ".join((value or "").split())
        if not texto:
            return ""
        sigla_upper = texto.upper()
        if sigla_upper in TIPOLOGIAS_MAPA:
            return TIPOLOGIAS_MAPA[sigla_upper]
        if texto in SIGLAS_POR_TIPOLOGIA:
            return texto
        opcoes = ", ".join(f"{sigla} ({nome})" for sigla, nome in TIPOLOGIAS_MAPA.items())
        raise serializers.ValidationError(
            f"Tipologia inválida. Informe uma das opções válidas: {opcoes}."
        )

    def validate_tipo_ssp(self, value):
        texto = (value or "").strip()
        if not texto:
            return ""
        if texto not in TIPOS_SSP_VALIDOS:
            opcoes = ", ".join(TIPOS_SSP_VALIDOS)
            raise serializers.ValidationError(
                f"Tipo de SSP inválido. Opções válidas: {opcoes}."
            )
        return texto

    def validate_momentos_jogo(self, value):
        return _normalizar_lista_textos(
            value, "momentos_jogo", opcoes_validas=MOMENTOS_JOGO_VALIDOS
        )

    def validate_fases_jogo(self, value):
        return _normalizar_lista_textos(
            value, "fases_jogo", opcoes_validas=FASES_JOGO_VALIDAS
        )

    def validate_comportamentos(self, value):
        return _normalizar_lista_textos(value, "comportamentos")

    def validate_atributos_tecnicos(self, value):
        return _normalizar_lista_textos(value, "atributos_tecnicos")

    def validate(self, attrs):
        instance = self.instance

        # 1. US23: Copia atributos da AtividadeBiblioteca se for criação a partir dela
        atividade_bib = attrs.get("atividade_biblioteca")
        if atividade_bib and not instance:
            campos_copiar = [
                "codigo",
                "nome",
                "tipologia",
                "tipo_ssp",
                "orientacao",
                "comprimento",
                "largura",
                "numero_jogadores",
                "momentos_jogo",
                "fases_jogo",
                "comportamentos",
                "atributos_tecnicos",
            ]
            for campo in campos_copiar:
                valor_atual = attrs.get(campo)
                if campo not in attrs or valor_atual in (None, "", []):
                    valor_bib = getattr(atividade_bib, campo)
                    attrs[campo] = list(valor_bib) if isinstance(valor_bib, list) else valor_bib

        # 2. Validação de campos obrigatórios após possível cópia da biblioteca
        erros_obrigatorios = {}
        nome_final = attrs.get("nome", getattr(instance, "nome", ""))
        tipologia_final = attrs.get("tipologia", getattr(instance, "tipologia", ""))
        tipo_ssp_final = attrs.get("tipo_ssp", getattr(instance, "tipo_ssp", ""))

        if not nome_final:
            erros_obrigatorios["nome"] = "O nome da atividade é obrigatório."
        if not tipologia_final:
            erros_obrigatorios["tipologia"] = "A tipologia é obrigatória."
        if not tipo_ssp_final:
            erros_obrigatorios["tipo_ssp"] = "O tipo de SSP é obrigatório."
        if erros_obrigatorios:
            raise serializers.ValidationError(erros_obrigatorios)

        # 3. Impede troca de sessão na edição (US14)
        if instance and "sessao" in attrs and attrs["sessao"].id != instance.sessao_id:
            raise serializers.ValidationError(
                {"sessao": "Não é permitido alterar a sessão de uma atividade."}
            )

        # 4. RN01 e RN02: Dimensões do espaço e regra de PDI
        orientacao = attrs.get("orientacao", getattr(instance, "orientacao", ""))
        comprimento = attrs.get("comprimento", getattr(instance, "comprimento", None))
        largura = attrs.get("largura", getattr(instance, "largura", None))
        numero_jogadores = attrs.get(
            "numero_jogadores", getattr(instance, "numero_jogadores", None)
        )

        if orientacao == "PDI":
            attrs["comprimento"] = None
            attrs["largura"] = None
            attrs["numero_jogadores"] = None
            return attrs

        campos_espaco = (comprimento, largura, numero_jogadores)
        algum_preenchido = any(v is not None for v in campos_espaco)
        todos_preenchidos = all(v is not None for v in campos_espaco)

        if algum_preenchido and not todos_preenchidos:
            raise serializers.ValidationError(
                {
                    "dimensao_espaco": (
                        "Para calcular a área e a dimensão do espaço, informe comprimento, "
                        "largura e número de jogadores."
                    )
                }
            )

        erros = {}
        if comprimento is not None and comprimento <= 0:
            erros["comprimento"] = "O comprimento deve ser maior que zero."
        if largura is not None and largura <= 0:
            erros["largura"] = "A largura deve ser maior que zero."
        if numero_jogadores is not None and numero_jogadores <= 0:
            erros["numero_jogadores"] = "O número de jogadores deve ser maior que zero."
        if erros:
            raise serializers.ValidationError(erros)

        return attrs


class IndicadoresTreinoSerializer(serializers.Serializer):
    """RF22 (US22): Serializador de saída dos indicadores quantitativos de treino."""

    numero_sessoes = serializers.IntegerField(read_only=True)
    minutos_totais = serializers.IntegerField(read_only=True)
    numero_execucoes = serializers.IntegerField(read_only=True)
    atividades_distintas = serializers.IntegerField(read_only=True)
    variabilidade = serializers.FloatField(read_only=True)
    minutos_por_sessao = serializers.FloatField(read_only=True)
    minutos_por_execucao = serializers.FloatField(read_only=True)
    estado_vazio = serializers.BooleanField(read_only=True)
    mensagem = serializers.CharField(read_only=True, allow_null=True)


class InformacaoAtividadeItemSerializer(serializers.Serializer):
    """Item consolidado por atividade distinta para gráfico da guia Atividades (US24 / RF24)."""

    codigo = serializers.CharField(read_only=True)
    nome = serializers.CharField(read_only=True)
    atividade_ssp = serializers.CharField(read_only=True)
    tipologia = serializers.CharField(read_only=True)
    sigla_tipologia = serializers.CharField(read_only=True)
    tipo_ssp = serializers.CharField(read_only=True)
    minutos = serializers.IntegerField(read_only=True)
    percentual_tempo = serializers.FloatField(read_only=True)
    percentual_tempo_liquido = serializers.FloatField(read_only=True)
    execucoes = serializers.IntegerField(read_only=True)
    sessoes_distintas = serializers.IntegerField(read_only=True)


class InformacaoTipologiaItemSerializer(serializers.Serializer):
    """Item consolidado por tipologia de atividade para gráfico (US24 / RF24)."""

    tipologia = serializers.CharField(read_only=True)
    sigla_tipologia = serializers.CharField(read_only=True)
    minutos = serializers.IntegerField(read_only=True)
    percentual_tempo = serializers.FloatField(read_only=True)
    execucoes = serializers.IntegerField(read_only=True)
    atividades_distintas = serializers.IntegerField(read_only=True)


class InformacaoTipoSspItemSerializer(serializers.Serializer):
    """Item consolidado por tipo de SSP (Especial, Dirigido, Competitivo) para gráfico (US24 / RF24)."""

    tipo_ssp = serializers.CharField(read_only=True)
    minutos = serializers.IntegerField(read_only=True)
    percentual_tempo = serializers.FloatField(read_only=True)
    execucoes = serializers.IntegerField(read_only=True)
    atividades_distintas = serializers.IntegerField(read_only=True)


class ExecucaoAtividadeItemSerializer(serializers.Serializer):
    """Item individual de execução de atividade em sessão filtrada (US24 / RF24)."""

    id = serializers.IntegerField(read_only=True)
    sessao = serializers.IntegerField(read_only=True)
    sessao_nome = serializers.CharField(read_only=True)
    sessao_sequencia = serializers.IntegerField(read_only=True, allow_null=True)
    data = serializers.CharField(read_only=True, allow_null=True)
    mes = serializers.CharField(read_only=True)
    microciclo = serializers.IntegerField(read_only=True, allow_null=True)
    microciclo_nome = serializers.CharField(read_only=True)
    mesociclo = serializers.IntegerField(read_only=True, allow_null=True)
    mesociclo_nome = serializers.CharField(read_only=True)
    macrociclo = serializers.IntegerField(read_only=True, allow_null=True)
    macrociclo_nome = serializers.CharField(read_only=True)
    ordem = serializers.IntegerField(read_only=True)
    codigo = serializers.CharField(read_only=True)
    nome = serializers.CharField(read_only=True)
    atividade_ssp = serializers.CharField(read_only=True)
    tipologia = serializers.CharField(read_only=True)
    sigla_tipologia = serializers.CharField(read_only=True)
    tipo_ssp = serializers.CharField(read_only=True)
    orientacao = serializers.CharField(read_only=True)
    tempo = serializers.IntegerField(read_only=True)
    dimensao_espaco = serializers.CharField(read_only=True)


class InformacoesAtividadesTreinoSerializer(serializers.Serializer):
    """RF24 (US24): Serializador de saída da consulta e gráficos de atividades do treino."""

    total_atividades_distintas = serializers.IntegerField(read_only=True)
    total_registros = serializers.IntegerField(read_only=True)
    minutos_totais_atividades = serializers.IntegerField(read_only=True)
    minutos_totais_liquidos = serializers.IntegerField(read_only=True)
    atividades = InformacaoAtividadeItemSerializer(many=True, read_only=True)
    por_tipologia = InformacaoTipologiaItemSerializer(many=True, read_only=True)
    por_tipo_ssp = InformacaoTipoSspItemSerializer(many=True, read_only=True)
    execucoes = ExecucaoAtividadeItemSerializer(many=True, read_only=True)
    estado_vazio = serializers.BooleanField(read_only=True)
    mensagem = serializers.CharField(read_only=True, allow_null=True)


class CicloHierarquiaRelatorioSerializer(serializers.Serializer):
    """US25 (RF25): Dados de um ciclo na hierarquia da sessão."""

    id = serializers.IntegerField(read_only=True, allow_null=True)
    codigo = serializers.CharField(read_only=True, allow_blank=True, allow_null=True, required=False)
    nome = serializers.CharField(read_only=True, allow_blank=True)
    data_inicio = serializers.DateField(read_only=True, allow_null=True)
    data_termino = serializers.DateField(read_only=True, allow_null=True)

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret["dataInicio"] = ret.get("data_inicio")
        ret["dataTermino"] = ret.get("data_termino")
        return ret


class PeriodizacaoRelatorioSessaoSerializer(serializers.Serializer):
    """US25 (RF25): Hierarquia de periodização Macrociclo -> Mesociclo -> Microciclo."""

    macrociclo = CicloHierarquiaRelatorioSerializer(read_only=True)
    mesociclo = CicloHierarquiaRelatorioSerializer(read_only=True)
    microciclo = CicloHierarquiaRelatorioSerializer(read_only=True)


class ItemGraficoRelatorioSessaoSerializer(serializers.Serializer):
    """US25 (RF25): Item individual de um gráfico consolidado da sessão."""

    id = serializers.CharField(read_only=True)
    codigo = serializers.CharField(read_only=True, allow_blank=True, allow_null=True, required=False)
    nome = serializers.CharField(read_only=True)
    minutos = serializers.IntegerField(read_only=True)
    execucoes = serializers.IntegerField(read_only=True)
    percentual = serializers.FloatField(read_only=True)


class BlocoGraficoRelatorioSessaoSerializer(serializers.Serializer):
    """US25 (RF25): Bloco completo de gráfico com totais e estado vazio (RN07)."""

    titulo = serializers.CharField(read_only=True)
    subtitulo = serializers.CharField(read_only=True)
    unidade = serializers.CharField(read_only=True)
    total_minutos = serializers.IntegerField(read_only=True)
    total_execucoes = serializers.IntegerField(read_only=True)
    itens = ItemGraficoRelatorioSessaoSerializer(many=True, read_only=True)
    estado_vazio = serializers.BooleanField(read_only=True)
    mensagem_vazio = serializers.CharField(read_only=True, allow_null=True, allow_blank=True, required=False)

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret["totalMinutos"] = ret.get("total_minutos")
        ret["totalExecucoes"] = ret.get("total_execucoes")
        ret["estadoVazio"] = ret.get("estado_vazio")
        ret["mensagemVazio"] = ret.get("mensagem_vazio")
        return ret


class GraficosRelatorioSessaoSerializer(serializers.Serializer):
    """US25 (RF25): Agrupador dos 6 gráficos da sessão."""

    atividades = BlocoGraficoRelatorioSessaoSerializer(read_only=True)
    momentos_jogo = BlocoGraficoRelatorioSessaoSerializer(read_only=True)
    fases_jogo = BlocoGraficoRelatorioSessaoSerializer(read_only=True)
    atributos_tecnicos = BlocoGraficoRelatorioSessaoSerializer(read_only=True)
    espacos_treino = BlocoGraficoRelatorioSessaoSerializer(read_only=True)
    comportamentos_treino = BlocoGraficoRelatorioSessaoSerializer(read_only=True)

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret["momentosJogo"] = ret.get("momentos_jogo")
        ret["fasesJogo"] = ret.get("fases_jogo")
        ret["atributosTecnicos"] = ret.get("atributos_tecnicos")
        ret["espacosTreino"] = ret.get("espacos_treino")
        ret["comportamentosTreino"] = ret.get("comportamentos_treino")
        return ret


class AtividadeSessaoRelatorioItemSerializer(serializers.Serializer):
    """US25 (RF25): Detalhes de uma atividade dentro da sessão no relatório."""

    id = serializers.IntegerField(read_only=True, allow_null=True)
    sessao = serializers.IntegerField(read_only=True, allow_null=True, required=False)
    atividade_biblioteca = serializers.IntegerField(read_only=True, allow_null=True, required=False)
    codigo = serializers.CharField(read_only=True, allow_blank=True, required=False)
    nome = serializers.CharField(read_only=True, allow_blank=True)
    atividade_ssp = serializers.CharField(read_only=True, allow_blank=True, required=False)
    tipologia = serializers.CharField(read_only=True, allow_blank=True)
    sigla_tipologia = serializers.CharField(read_only=True, allow_blank=True, required=False)
    tipo_ssp = serializers.CharField(read_only=True, allow_blank=True)
    orientacao = serializers.CharField(read_only=True, allow_blank=True, required=False)
    ordem = serializers.IntegerField(read_only=True)
    tempo = serializers.IntegerField(read_only=True)
    comprimento = serializers.FloatField(read_only=True, allow_null=True, required=False)
    largura = serializers.FloatField(read_only=True, allow_null=True, required=False)
    numero_jogadores = serializers.IntegerField(read_only=True, allow_null=True, required=False)
    area_por_jogador = serializers.FloatField(read_only=True, allow_null=True, required=False)
    dimensao_espaco = serializers.CharField(read_only=True, allow_blank=True, required=False)
    momentos_jogo = serializers.ListField(read_only=True, required=False)
    fases_jogo = serializers.ListField(read_only=True, required=False)
    comportamentos = serializers.ListField(read_only=True, required=False)
    atributos_tecnicos = serializers.ListField(read_only=True, required=False)


class SessaoRelatorioItemSerializer(serializers.Serializer):
    """US25 (RF25): Detalhes consolidados da sessão selecionada."""

    id = serializers.IntegerField(read_only=True, allow_null=True)
    sequencia = serializers.IntegerField(read_only=True, allow_null=True)
    codigo = serializers.CharField(read_only=True)
    nome = serializers.CharField(read_only=True)
    data = serializers.DateField(read_only=True, allow_null=True)
    mes = serializers.CharField(read_only=True, allow_blank=True)
    total_atividades = serializers.IntegerField(read_only=True)
    numero_execucoes = serializers.IntegerField(read_only=True)
    tempo_total_bruto = serializers.IntegerField(read_only=True)
    tempo_liquido = serializers.IntegerField(read_only=True)
    atividades = AtividadeSessaoRelatorioItemSerializer(many=True, read_only=True)

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret["totalAtividades"] = ret.get("total_atividades")
        ret["numeroExecucoes"] = ret.get("numero_execucoes")
        ret["tempoTotalBruto"] = ret.get("tempo_total_bruto")
        ret["tempoLiquido"] = ret.get("tempo_liquido")
        return ret


class RelatorioSessaoSerializer(serializers.Serializer):
    """US25 (RF25): Contrato completo de saída do relatório de sessão."""

    sessao = SessaoRelatorioItemSerializer(read_only=True)
    periodizacao = PeriodizacaoRelatorioSessaoSerializer(read_only=True)
    graficos = GraficosRelatorioSessaoSerializer(read_only=True)



