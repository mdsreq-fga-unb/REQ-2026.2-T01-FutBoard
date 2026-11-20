"""Modelos de sessões e treinos."""

import re

from django.core.exceptions import ValidationError
from django.core.validators import MinValueValidator
from django.db import models
from django.db.models import Max
import unicodedata


from apps.ciclos.models import Microciclo

TIPOLOGIAS_MAPA = {
    "CF": "Confrontos",
    "JC": "Jogo Condicionante",
    "JP": "Jogo de Posse",
    "RD": "Rondo",
    "JS": "Jogo Setorial",
    "SIT": "Situacional",
    "DP": "Dinâmica de Passe",
    "DF": "Dinâmica de Finalização",
    "DPD": "Dinâmica ProtDef",
    "CD": "Coletivo Direcionado",
    "JBP": "Jogo de Bola Parada",
}

SIGLAS_POR_TIPOLOGIA = {nome: sigla for sigla, nome in TIPOLOGIAS_MAPA.items()}

TIPOS_SSP_VALIDOS = ("Especial", "Dirigido", "Competitivo")
ORIENTACOES_VALIDAS = ("Aquisição", "Aplicação", "PDI", "Eq Carga")
MOMENTOS_JOGO_VALIDOS = ("Ataque", "Defesa", "Trans Of", "Trans Def", "Bola Parada")
FASES_JOGO_VALIDAS = (
    "1ª Construção",
    "2ª Construção",
    "Criação",
    "Finalização",
    "Bola Parada",
)


class Sessao(models.Model):
    microciclo = models.ForeignKey(
        Microciclo,
        on_delete=models.PROTECT,
        related_name="sessoes",
    )
    sequencia = models.PositiveIntegerField(editable=False)
    nome = models.CharField(max_length=255)
    data = models.DateField()

    class Meta:
        ordering = ["data", "sequencia", "id"]
        constraints = [
            models.UniqueConstraint(
                fields=["microciclo", "sequencia"],
                name="unique_sessao_por_microciclo",
            ),
        ]

    def __str__(self):
        return f"Sessão {self.sequencia} - {self.nome}"

    def clean(self):
        super().clean()

        erros = {}

        if self.microciclo_id and self.data:
            if self.data < self.microciclo.data_inicio:
                erros["data"] = "A sessão não pode ocorrer antes do início do microciclo."

            if self.data > self.microciclo.data_termino:
                erros["data"] = "A sessão não pode ocorrer depois do término do microciclo."

        if erros:
            raise ValidationError(erros)

    def save(self, *args, **kwargs):
        if not self.sequencia:
            ultima_sequencia = (
                Sessao.objects.filter(microciclo=self.microciclo).aggregate(
                    maior_sequencia=Max("sequencia")
                )["maior_sequencia"]
                or 0
            )
            self.sequencia = ultima_sequencia + 1

        self.full_clean()
        super().save(*args, **kwargs)

    @property
    def tempo_liquido(self):
        """RN03: Duração líquida da sessão contabilizando atividades de mesma ordem uma única vez."""
        tempos_por_ordem = {}
        for atividade in self.atividades.all():
            ordem = atividade.ordem
            if ordem not in tempos_por_ordem or atividade.tempo > tempos_por_ordem[ordem]:
                tempos_por_ordem[ordem] = atividade.tempo
        return sum(tempos_por_ordem.values())

    @property
    def numero_execucoes(self):
        """RN03: Quantidade de execuções distintas (par Sessão + Ordem) na sessão."""
        return len({atividade.ordem for atividade in self.atividades.all()})



def normalizar_nome_comportamento(nome):
    nome = " ".join(nome.split())

    nome = unicodedata.normalize("NFD", nome)

    nome = "".join(
        caractere
        for caractere in nome
        if not unicodedata.combining(caractere)
    )

    return nome.casefold()

class ComportamentoTatico(models.Model):
    nome = models.CharField(max_length=200)

    nome_normalizado = models.CharField(
        max_length=200,
        unique=True,
        editable=False,
        blank=True,
    )

    class Meta:
        ordering = ["nome"]
        verbose_name = "comportamento tático"
        verbose_name_plural = "comportamentos táticos"

    def __str__(self):
        return self.nome

    def clean(self):
        super().clean()

        self.nome = " ".join((self.nome or "").split())

        if not self.nome:
            raise ValidationError({
                "nome": "O nome do comportamento é obrigatório."
            })

        self.nome_normalizado = normalizar_nome_comportamento(
            self.nome
        )

    def save(self, *args, **kwargs):
        self.full_clean()
        return super().save(*args, **kwargs)

class AtividadeBiblioteca(models.Model):
    """Atividade cadastrada na biblioteca de treinos para reutilização futura (US19 / RF19)."""

    TIPOLOGIA_CHOICES = [(nome, nome) for nome in TIPOLOGIAS_MAPA.values()]
    TIPO_SSP_CHOICES = [(tipo, tipo) for tipo in TIPOS_SSP_VALIDOS]
    ORIENTACAO_CHOICES = [(orientacao, orientacao) for orientacao in ORIENTACOES_VALIDAS]
    DIMENSAO_ESPACO_CHOICES = [
        ("Pequeno", "Pequeno"),
        ("Médio", "Médio"),
        ("Grande", "Grande"),
        ("Não Definido", "Não Definido"),
    ]

    codigo = models.CharField(max_length=20, unique=True, blank=True)
    nome = models.CharField(max_length=255)
    tipologia = models.CharField(max_length=50, choices=TIPOLOGIA_CHOICES)
    tipo_ssp = models.CharField(max_length=20, choices=TIPO_SSP_CHOICES)

    orientacao = models.CharField(
        max_length=20,
        choices=ORIENTACAO_CHOICES,
        blank=True,
        default="",
    )
    comprimento = models.FloatField(null=True, blank=True)
    largura = models.FloatField(null=True, blank=True)
    numero_jogadores = models.PositiveIntegerField(null=True, blank=True)
    area_por_jogador = models.FloatField(null=True, blank=True, editable=False)
    dimensao_espaco = models.CharField(
        max_length=20,
        choices=DIMENSAO_ESPACO_CHOICES,
        default="Não Definido",
        editable=False,
    )

    momentos_jogo = models.JSONField(default=list, blank=True)
    fases_jogo = models.JSONField(default=list, blank=True)
    comportamentos = models.JSONField(default=list, blank=True)
    atributos_tecnicos = models.JSONField(default=list, blank=True)

    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["id"]
        verbose_name = "atividade da biblioteca"
        verbose_name_plural = "atividades da biblioteca"

    def __str__(self):
        return f"{self.codigo} - {self.atividade_ssp}"

    @property
    def sigla_tipologia(self):
        return SIGLAS_POR_TIPOLOGIA.get(self.tipologia, "")

    @property
    def atividade_ssp(self):
        sigla = self.sigla_tipologia
        nome_limpo = (self.nome or "").strip()
        if not sigla:
            return nome_limpo
        padrao_prefixo = re.compile(rf"^{re.escape(sigla)}\s*\|\s*", re.IGNORECASE)
        if padrao_prefixo.match(nome_limpo):
            corpo = padrao_prefixo.sub("", nome_limpo).strip()
            return f"{sigla} | {corpo}"
        return f"{sigla} | {nome_limpo}"

    def _gerar_proximo_codigo(self):
        sigla = self.sigla_tipologia
        padrao = re.compile(rf"^{re.escape(sigla)}(\d+)$", re.IGNORECASE)
        existentes = AtividadeBiblioteca.objects.filter(
            codigo__istartswith=sigla
        ).values_list("codigo", flat=True)
        maior = 0
        for cod in existentes:
            match = padrao.match(cod)
            if match:
                maior = max(maior, int(match.group(1)))
        return f"{sigla}{maior + 1}"

    def clean(self):
        super().clean()
        erros = {}

        self.nome = " ".join((self.nome or "").split())
        if not self.nome:
            erros["nome"] = "O nome da atividade é obrigatório."

        if self.tipologia in TIPOLOGIAS_MAPA:
            self.tipologia = TIPOLOGIAS_MAPA[self.tipologia]

        if self.codigo:
            self.codigo = self.codigo.strip().upper()

        if self.orientacao == "PDI":
            self.comprimento = None
            self.largura = None
            self.numero_jogadores = None
            self.area_por_jogador = None
            self.dimensao_espaco = "Não Definido"
        else:
            campos_espaco = (self.comprimento, self.largura, self.numero_jogadores)
            algum_preenchido = any(valor is not None for valor in campos_espaco)
            todos_preenchidos = all(valor is not None for valor in campos_espaco)

            if algum_preenchido and not todos_preenchidos:
                erros["dimensao_espaco"] = (
                    "Para calcular a área e a dimensão do espaço, informe comprimento, "
                    "largura e número de jogadores."
                )
            elif todos_preenchidos:
                if self.comprimento <= 0:
                    erros["comprimento"] = "O comprimento deve ser maior que zero."
                if self.largura <= 0:
                    erros["largura"] = "A largura deve ser maior que zero."
                if self.numero_jogadores <= 0:
                    erros["numero_jogadores"] = "O número de jogadores deve ser maior que zero."

                if not erros:
                    self.area_por_jogador = (
                        self.comprimento * self.largura
                    ) / self.numero_jogadores
                    if self.area_por_jogador <= 100:
                        self.dimensao_espaco = "Pequeno"
                    elif self.area_por_jogador <= 200:
                        self.dimensao_espaco = "Médio"
                    else:
                        self.dimensao_espaco = "Grande"
            else:
                self.area_por_jogador = None
                self.dimensao_espaco = "Não Definido"

        if erros:
            raise ValidationError(erros)

    def save(self, *args, **kwargs):
        if self.tipologia in TIPOLOGIAS_MAPA:
            self.tipologia = TIPOLOGIAS_MAPA[self.tipologia]
        self.full_clean()
        if not self.codigo:
            self.codigo = self._gerar_proximo_codigo()
        super().save(*args, **kwargs)

def calcular_area_e_dimensao(comprimento, largura, numero_jogadores):
    """RN01 e RN02: devolve (area_por_jogador, dimensao_espaco)."""
    area = (comprimento * largura) / numero_jogadores
    if area <= 100:
        return area, "Pequeno"
    if area <= 200:
        return area, "Médio"
    return area, "Grande"


class AtividadeSessao(models.Model):
    """Atividade registrada dentro de uma sessão de treino (US13 / RF13).

    Os dados são uma CÓPIA: editar aqui nunca altera a biblioteca (US14 / US23).
    """

    TIPOLOGIA_CHOICES = AtividadeBiblioteca.TIPOLOGIA_CHOICES
    TIPO_SSP_CHOICES = AtividadeBiblioteca.TIPO_SSP_CHOICES
    ORIENTACAO_CHOICES = AtividadeBiblioteca.ORIENTACAO_CHOICES
    DIMENSAO_ESPACO_CHOICES = AtividadeBiblioteca.DIMENSAO_ESPACO_CHOICES

    sessao = models.ForeignKey(
        Sessao,
        on_delete=models.PROTECT,
        related_name="atividades",
    )
    # US23: de qual atividade da biblioteca esta cópia veio (vazio se foi criada direto na sessão).
    atividade_biblioteca = models.ForeignKey(
        AtividadeBiblioteca,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="usos_em_sessoes",
    )

    codigo = models.CharField(max_length=20, blank=True)
    nome = models.CharField(max_length=255)
    tipologia = models.CharField(max_length=50, choices=TIPOLOGIA_CHOICES)
    tipo_ssp = models.CharField(max_length=20, choices=TIPO_SSP_CHOICES)
    orientacao = models.CharField(
        max_length=20, choices=ORIENTACAO_CHOICES, blank=True, default=""
    )

    # RN03: mesma ordem dentro da sessão = atividades simultâneas.
    ordem = models.PositiveIntegerField(validators=[MinValueValidator(1)])
    tempo = models.PositiveIntegerField(validators=[MinValueValidator(1)])  # minutos

    comprimento = models.FloatField(null=True, blank=True)
    largura = models.FloatField(null=True, blank=True)
    numero_jogadores = models.PositiveIntegerField(null=True, blank=True)
    # Calculados pelo sistema (RN01 e RN02): o usuário não digita.
    area_por_jogador = models.FloatField(null=True, blank=True, editable=False)
    dimensao_espaco = models.CharField(
        max_length=20,
        choices=DIMENSAO_ESPACO_CHOICES,
        default="Não Definido",
        editable=False,
    )

    # RN05: todos opcionais.
    momentos_jogo = models.JSONField(default=list, blank=True)
    fases_jogo = models.JSONField(default=list, blank=True)
    comportamentos = models.JSONField(default=list, blank=True)
    atributos_tecnicos = models.JSONField(default=list, blank=True)

    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["sessao", "ordem", "id"]
        verbose_name = "atividade da sessão"
        verbose_name_plural = "atividades da sessão"

    def __str__(self):
        return f"Sessão {self.sessao_id} - ordem {self.ordem} - {self.nome}"

    def clean(self):
        super().clean()
        erros = {}

        self.nome = " ".join((self.nome or "").split())
        if not self.nome:
            erros["nome"] = "O nome da atividade é obrigatório."

        if self.codigo:
            self.codigo = self.codigo.strip().upper()

        if self.orientacao == "PDI":
            # RN01: PDI dispensa dimensões.
            self.comprimento = None
            self.largura = None
            self.numero_jogadores = None
            self.area_por_jogador = None
            self.dimensao_espaco = "Não Definido"
        else:
            campos = (self.comprimento, self.largura, self.numero_jogadores)
            if any(v is not None for v in campos) and not all(v is not None for v in campos):
                erros["dimensao_espaco"] = (
                    "Para calcular a área e a dimensão do espaço, informe comprimento, "
                    "largura e número de jogadores."
                )
            elif all(v is not None for v in campos):
                if self.comprimento <= 0:
                    erros["comprimento"] = "O comprimento deve ser maior que zero."
                if self.largura <= 0:
                    erros["largura"] = "A largura deve ser maior que zero."
                if self.numero_jogadores <= 0:
                    erros["numero_jogadores"] = "O número de jogadores deve ser maior que zero."
                if not erros:
                    self.area_por_jogador, self.dimensao_espaco = calcular_area_e_dimensao(
                        self.comprimento, self.largura, self.numero_jogadores
                    )
            else:
                self.area_por_jogador = None
                self.dimensao_espaco = "Não Definido"

        if erros:
            raise ValidationError(erros)

    def save(self, *args, **kwargs):
        # A sigla (ex.: "CF") precisa virar nome ANTES do full_clean, que valida os choices.
        if self.tipologia in TIPOLOGIAS_MAPA:
            self.tipologia = TIPOLOGIAS_MAPA[self.tipologia]
        self.full_clean()
        super().save(*args, **kwargs)


MENSAGEM_INDICADORES_VAZIO = "Nenhum treino registrado neste período."


def identificador_atividade_distinta(atividade):
    """RN06: Identifica univocamente uma atividade para contagem de exercícios distintos no período."""
    codigo = (atividade.codigo or "").strip().upper()
    if codigo:
        return ("codigo", codigo)
    if atividade.atividade_biblioteca_id:
        return ("biblioteca", atividade.atividade_biblioteca_id)
    tipologia = (atividade.tipologia or "").strip().casefold()
    nome = " ".join((atividade.nome or "").split()).casefold()
    return ("manual", tipologia, nome)


def calcular_indicadores_treino(sessoes_queryset):
    """RF22 (US22): Calcula os indicadores de treino aplicando RN03, RN06 e RN07."""
    if hasattr(sessoes_queryset, "prefetch_related"):
        sessoes = list(sessoes_queryset.prefetch_related("atividades"))
    else:
        sessoes = list(sessoes_queryset)

    numero_sessoes = len(sessoes)
    if numero_sessoes == 0:
        return {
            "numero_sessoes": 0,
            "minutos_totais": 0,
            "numero_execucoes": 0,
            "atividades_distintas": 0,
            "variabilidade": 0.0,
            "minutos_por_sessao": 0.0,
            "minutos_por_execucao": 0.0,
            "estado_vazio": True,
            "mensagem": MENSAGEM_INDICADORES_VAZIO,
        }

    minutos_totais = 0
    numero_execucoes = 0
    chaves_atividades_distintas = set()

    for sessao in sessoes:
        tempos_por_ordem = {}
        for atividade in sessao.atividades.all():
            ordem = atividade.ordem
            if ordem not in tempos_por_ordem or atividade.tempo > tempos_por_ordem[ordem]:
                tempos_por_ordem[ordem] = atividade.tempo
            chaves_atividades_distintas.add(identificador_atividade_distinta(atividade))

        minutos_totais += sum(tempos_por_ordem.values())
        numero_execucoes += len(tempos_por_ordem)

    atividades_distintas = len(chaves_atividades_distintas)
    variabilidade = (
        round((atividades_distintas / numero_execucoes) * 100, 2)
        if numero_execucoes > 0
        else 0.0
    )
    minutos_por_sessao = round(minutos_totais / numero_sessoes, 2)
    minutos_por_execucao = (
        round(minutos_totais / numero_execucoes, 2) if numero_execucoes > 0 else 0.0
    )

    return {
        "numero_sessoes": numero_sessoes,
        "minutos_totais": minutos_totais,
        "numero_execucoes": numero_execucoes,
        "atividades_distintas": atividades_distintas,
        "variabilidade": variabilidade,
        "minutos_por_sessao": minutos_por_sessao,
        "minutos_por_execucao": minutos_por_execucao,
        "estado_vazio": False,
        "mensagem": None,
    }