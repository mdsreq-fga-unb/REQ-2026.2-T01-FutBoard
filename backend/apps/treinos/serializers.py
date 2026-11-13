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


