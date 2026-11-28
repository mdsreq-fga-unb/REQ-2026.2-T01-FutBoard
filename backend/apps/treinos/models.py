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


def sincronizar_comportamentos_taticos(nomes):
    """Sincroniza princípios táticos usados em uma atividade com o catálogo ComportamentoTatico.

    - Reutiliza o nome canônico quando já existe um princípio equivalente (sem duplicar por acento/caixa).
    - Cadastra automaticamente no catálogo quando é um princípio tático novo informado direto na atividade.
    """
    if not nomes:
        return []

    resultado = []
    chaves_vistas = set()

    for item in nomes:
        texto = " ".join(str(item or "").split())
        if not texto:
            continue

        chave = normalizar_nome_comportamento(texto)
        if chave in chaves_vistas:
            continue
        chaves_vistas.add(chave)

        existente = ComportamentoTatico.objects.filter(nome_normalizado=chave).first()
        if existente:
            resultado.append(existente.nome)
        else:
            criado = ComportamentoTatico.objects.create(nome=texto)
            resultado.append(criado.nome)

    return resultado

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


MENSAGEM_ATIVIDADES_VAZIO = "Nenhuma atividade encontrada para os filtros aplicados."

NOMES_MESES_PT = (
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
)


def calcular_informacoes_atividades_treino(atividades_queryset):
    """RF24 (US24): Consolida informações e gráficos de atividades do treino aplicando RN03 e RN07."""
    if hasattr(atividades_queryset, "select_related"):
        atividades = list(
            atividades_queryset.select_related(
                "sessao__microciclo__mesociclo__macrociclo",
                "atividade_biblioteca",
            ).order_by("sessao__data", "sessao__sequencia", "ordem", "id")
        )
    else:
        atividades = list(atividades_queryset)

    total_registros = len(atividades)
    if total_registros == 0:
        return {
            "total_atividades_distintas": 0,
            "total_registros": 0,
            "minutos_totais_atividades": 0,
            "minutos_totais_liquidos": 0,
            "atividades": [],
            "por_tipologia": [],
            "por_tipo_ssp": [],
            "por_momento_jogo": [],
            "por_fase_jogo": [],
            "execucoes": [],
            "estado_vazio": True,
            "mensagem": MENSAGEM_ATIVIDADES_VAZIO,
        }

    minutos_totais_atividades = 0
    tempos_por_sessao_ordem = {}
    agrupado_atividades = {}
    agrupado_tipologias = {}
    agrupado_tipos_ssp = {}
    agrupado_momentos_jogo = {}
    agrupado_fases_jogo = {}
    execucoes_detalhadas = []

    for atv in atividades:
        tempo = atv.tempo
        minutos_totais_atividades += tempo

        chave_ordem = (atv.sessao_id, atv.ordem)
        if (
            chave_ordem not in tempos_por_sessao_ordem
            or tempo > tempos_por_sessao_ordem[chave_ordem]
        ):
            tempos_por_sessao_ordem[chave_ordem] = tempo

        chave_atv = identificador_atividade_distinta(atv)
        codigo_exibicao = (atv.codigo or "").strip().upper()
        if not codigo_exibicao and atv.atividade_biblioteca_id and atv.atividade_biblioteca:
            codigo_exibicao = (atv.atividade_biblioteca.codigo or "").strip().upper()

        if chave_atv not in agrupado_atividades:
            agrupado_atividades[chave_atv] = {
                "codigo": codigo_exibicao,
                "nome": atv.nome,
                "atividade_ssp": atv.atividade_ssp,
                "tipologia": atv.tipologia,
                "sigla_tipologia": atv.sigla_tipologia,
                "tipo_ssp": atv.tipo_ssp,
                "minutos": 0,
                "execucoes": 0,
                "sessoes_ids": set(),
            }

        item_atv = agrupado_atividades[chave_atv]
        item_atv["minutos"] += tempo
        item_atv["execucoes"] += 1
        item_atv["sessoes_ids"].add(atv.sessao_id)

        tipologia = atv.tipologia
        if tipologia not in agrupado_tipologias:
            agrupado_tipologias[tipologia] = {
                "tipologia": tipologia,
                "sigla_tipologia": atv.sigla_tipologia,
                "minutos": 0,
                "execucoes": 0,
                "chaves_atividades": set(),
            }
        item_tip = agrupado_tipologias[tipologia]
        item_tip["minutos"] += tempo
        item_tip["execucoes"] += 1
        item_tip["chaves_atividades"].add(chave_atv)

        tipo_ssp = atv.tipo_ssp
        if tipo_ssp not in agrupado_tipos_ssp:
            agrupado_tipos_ssp[tipo_ssp] = {
                "tipo_ssp": tipo_ssp,
                "minutos": 0,
                "execucoes": 0,
                "chaves_atividades": set(),
            }
        item_ssp = agrupado_tipos_ssp[tipo_ssp]
        item_ssp["minutos"] += tempo
        item_ssp["execucoes"] += 1
        item_ssp["chaves_atividades"].add(chave_atv)

        # US36: Agrupamento por momentos de jogo (RN05: opcional; cada momento da lista recebe o tempo da atividade)
        momentos = atv.momentos_jogo if isinstance(atv.momentos_jogo, list) else []
        for momento_item in momentos:
            nome_momento = str(momento_item or "").strip()
            if not nome_momento:
                continue
            if nome_momento not in agrupado_momentos_jogo:
                agrupado_momentos_jogo[nome_momento] = {
                    "id": f"momento-{nome_momento.lower().replace(' ', '-')}",
                    "codigo": nome_momento,
                    "nome": nome_momento,
                    "minutos": 0,
                    "execucoes": 0,
                    "chaves_atividades": set(),
                }
            item_mom = agrupado_momentos_jogo[nome_momento]
            item_mom["minutos"] += tempo
            item_mom["execucoes"] += 1
            item_mom["chaves_atividades"].add(chave_atv)

        # US37: Agrupamento por fases de jogo (RN05: opcional; cada fase da lista recebe o tempo da atividade)
        fases = atv.fases_jogo if isinstance(atv.fases_jogo, list) else []
        for fase_item in fases:
            nome_fase = str(fase_item or "").strip()
            if not nome_fase:
                continue
            if nome_fase not in agrupado_fases_jogo:
                agrupado_fases_jogo[nome_fase] = {
                    "id": f"fase-{nome_fase.lower().replace(' ', '-')}",
                    "codigo": nome_fase,
                    "nome": nome_fase,
                    "minutos": 0,
                    "execucoes": 0,
                    "chaves_atividades": set(),
                }
            item_fase = agrupado_fases_jogo[nome_fase]
            item_fase["minutos"] += tempo
            item_fase["execucoes"] += 1
            item_fase["chaves_atividades"].add(chave_atv)

        sessao = atv.sessao
        micro = sessao.microciclo if sessao else None
        meso = micro.mesociclo if micro else None
        macro = meso.macrociclo if meso else None
        mes_nome = NOMES_MESES_PT[sessao.data.month - 1] if sessao and sessao.data else ""

        execucoes_detalhadas.append(
            {
                "id": atv.id,
                "sessao": atv.sessao_id,
                "sessao_nome": sessao.nome if sessao else "",
                "sessao_sequencia": sessao.sequencia if sessao else None,
                "data": sessao.data.isoformat() if sessao and sessao.data else None,
                "mes": mes_nome,
                "microciclo": micro.id if micro else None,
                "microciclo_nome": micro.nome if micro else "",
                "mesociclo": meso.id if meso else None,
                "mesociclo_nome": meso.nome if meso else "",
                "macrociclo": macro.id if macro else None,
                "macrociclo_nome": macro.nome if macro else "",
                "ordem": atv.ordem,
                "codigo": codigo_exibicao,
                "nome": atv.nome,
                "atividade_ssp": atv.atividade_ssp,
                "tipologia": atv.tipologia,
                "sigla_tipologia": atv.sigla_tipologia,
                "tipo_ssp": atv.tipo_ssp,
                "orientacao": atv.orientacao,
                "tempo": atv.tempo,
                "dimensao_espaco": atv.dimensao_espaco,
                "momentos_jogo": atv.momentos_jogo or [],
                "fases_jogo": atv.fases_jogo or [],
            }
        )

    minutos_totais_liquidos = sum(tempos_por_sessao_ordem.values())

    lista_atividades = []
    for item in agrupado_atividades.values():
        minutos = item["minutos"]
        lista_atividades.append(
            {
                "codigo": item["codigo"],
                "nome": item["nome"],
                "atividade_ssp": item["atividade_ssp"],
                "tipologia": item["tipologia"],
                "sigla_tipologia": item["sigla_tipologia"],
                "tipo_ssp": item["tipo_ssp"],
                "minutos": minutos,
                "percentual_tempo": (
                    round((minutos / minutos_totais_atividades) * 100, 2)
                    if minutos_totais_atividades > 0
                    else 0.0
                ),
                "percentual_tempo_liquido": (
                    round((minutos / minutos_totais_liquidos) * 100, 2)
                    if minutos_totais_liquidos > 0
                    else 0.0
                ),
                "execucoes": item["execucoes"],
                "sessoes_distintas": len(item["sessoes_ids"]),
            }
        )
    lista_atividades.sort(
        key=lambda x: (-x["minutos"], -x["execucoes"], x["codigo"], x["nome"])
    )

    lista_tipologias = []
    for item in agrupado_tipologias.values():
        minutos = item["minutos"]
        lista_tipologias.append(
            {
                "tipologia": item["tipologia"],
                "sigla_tipologia": item["sigla_tipologia"],
                "minutos": minutos,
                "percentual_tempo": (
                    round((minutos / minutos_totais_atividades) * 100, 2)
                    if minutos_totais_atividades > 0
                    else 0.0
                ),
                "execucoes": item["execucoes"],
                "atividades_distintas": len(item["chaves_atividades"]),
            }
        )
    lista_tipologias.sort(
        key=lambda x: (-x["minutos"], -x["execucoes"], x["tipologia"])
    )

    lista_tipos_ssp = []
    for item in agrupado_tipos_ssp.values():
        minutos = item["minutos"]
        lista_tipos_ssp.append(
            {
                "tipo_ssp": item["tipo_ssp"],
                "minutos": minutos,
                "percentual_tempo": (
                    round((minutos / minutos_totais_atividades) * 100, 2)
                    if minutos_totais_atividades > 0
                    else 0.0
                ),
                "execucoes": item["execucoes"],
                "atividades_distintas": len(item["chaves_atividades"]),
            }
        )
    lista_tipos_ssp.sort(
        key=lambda x: (-x["minutos"], -x["execucoes"], x["tipo_ssp"])
    )

    lista_momentos_jogo = []
    for item in agrupado_momentos_jogo.values():
        minutos = item["minutos"]
        lista_momentos_jogo.append(
            {
                "id": item["id"],
                "codigo": item["codigo"],
                "nome": item["nome"],
                "momento_jogo": item["nome"],
                "minutos": minutos,
                "percentual_tempo": (
                    round((minutos / minutos_totais_atividades) * 100, 2)
                    if minutos_totais_atividades > 0
                    else 0.0
                ),
                "execucoes": item["execucoes"],
                "atividades_distintas": len(item["chaves_atividades"]),
            }
        )
    lista_momentos_jogo.sort(
        key=lambda x: (-x["minutos"], -x["execucoes"], x["nome"])
    )

    lista_fases_jogo = []
    for item in agrupado_fases_jogo.values():
        minutos = item["minutos"]
        lista_fases_jogo.append(
            {
                "id": item["id"],
                "codigo": item["codigo"],
                "nome": item["nome"],
                "fase_jogo": item["nome"],
                "minutos": minutos,
                "percentual_tempo": (
                    round((minutos / minutos_totais_atividades) * 100, 2)
                    if minutos_totais_atividades > 0
                    else 0.0
                ),
                "execucoes": item["execucoes"],
                "atividades_distintas": len(item["chaves_atividades"]),
            }
        )
    lista_fases_jogo.sort(
        key=lambda x: (-x["minutos"], -x["execucoes"], x["nome"])
    )

    return {
        "total_atividades_distintas": len(lista_atividades),
        "total_registros": total_registros,
        "minutos_totais_atividades": minutos_totais_atividades,
        "minutos_totais_liquidos": minutos_totais_liquidos,
        "atividades": lista_atividades,
        "por_tipologia": lista_tipologias,
        "por_tipo_ssp": lista_tipos_ssp,
        "por_momento_jogo": lista_momentos_jogo,
        "por_fase_jogo": lista_fases_jogo,
        "execucoes": execucoes_detalhadas,
        "estado_vazio": False,
        "mensagem": None,
    }


MENSAGEM_ESPACO_VAZIO = "Sem atividades com espaço no período."

DIMENSOES_ESPACO_ORDEM = (
    "Pequeno",
    "Médio",
    "Grande",
    "Não Definido",
)

METADADOS_DIMENSAO_ESPACO = {
    "Pequeno": ("PEQ", "Espaço Reduzido (Pequeno)", "≤ 100 m²"),
    "Médio": ("MED", "Espaço Médio", "101 a 200 m²"),
    "Grande": ("GRD", "Espaço Amplo (Grande)", "> 200 m²"),
    "Não Definido": ("ND", "Não Definido", "Sem dimensões delimitadas"),
}

SINONIMOS_DIMENSAO_ESPACO = {
    "pequeno": "Pequeno",
    "reduzido": "Pequeno",
    "espaco reduzido": "Pequeno",
    "peq": "Pequeno",
    "medio": "Médio",
    "espaco medio": "Médio",
    "med": "Médio",
    "grande": "Grande",
    "amplo": "Grande",
    "espaco amplo": "Grande",
    "grd": "Grande",
    "nao definido": "Não Definido",
    "nd": "Não Definido",
    "indefinido": "Não Definido",
}


def normalizar_dimensao_espaco(valor):
    """Normaliza o nome ou sinônimo de uma dimensão de espaço para o padrão RN02."""
    texto = " ".join(str(valor or "").split())
    if not texto:
        return ""
    if texto in METADADOS_DIMENSAO_ESPACO:
        return texto
    chave = normalizar_nome_comportamento(texto)
    return SINONIMOS_DIMENSAO_ESPACO.get(chave, "")


def _montar_item_espaco(
    dimensao,
    minutos,
    minutos_brutos,
    execucoes,
    registros,
    atividades_distintas,
    area_media,
    minutos_totais_liquidos,
    minutos_totais_brutos,
):
    codigo, rotulo, faixa_area = METADADOS_DIMENSAO_ESPACO.get(
        dimensao,
        ("ND", dimensao, "Sem dimensões delimitadas"),
    )
    slug = normalizar_nome_comportamento(dimensao).replace(" ", "-")
    return {
        "id": f"espaco-{slug}",
        "codigo": codigo,
        "dimensao_espaco": dimensao,
        "nome": dimensao,
        "rotulo": rotulo,
        "faixa_area": faixa_area,
        "minutos": minutos,
        "minutos_brutos": minutos_brutos,
        "percentual_tempo": (
            round((minutos / minutos_totais_liquidos) * 100, 2)
            if minutos_totais_liquidos > 0
            else 0.0
        ),
        "percentual_tempo_bruto": (
            round((minutos_brutos / minutos_totais_brutos) * 100, 2)
            if minutos_totais_brutos > 0
            else 0.0
        ),
        "execucoes": execucoes,
        "registros": registros,
        "atividades_distintas": atividades_distintas,
        "area_media_por_jogador": area_media,
    }


def calcular_informacoes_espaco_treino(atividades_queryset):
    """RF35 (US35): Consolida distribuição por espaço do treino (RN01, RN02, RN03 e RN07)."""
    if hasattr(atividades_queryset, "select_related"):
        atividades = list(
            atividades_queryset.select_related(
                "sessao__microciclo__mesociclo__macrociclo",
                "atividade_biblioteca",
            ).order_by("sessao__data", "sessao__sequencia", "ordem", "id")
        )
    else:
        atividades = list(atividades_queryset)

    total_registros = len(atividades)
    if total_registros == 0:
        categorias_neutras = [
            _montar_item_espaco(dim, 0, 0, 0, 0, 0, None, 0, 0)
            for dim in DIMENSOES_ESPACO_ORDEM
        ]
        return {
            "total_dimensoes_utilizadas": 0,
            "total_registros": 0,
            "total_execucoes": 0,
            "minutos_totais_liquidos": 0,
            "minutos_totais_brutos": 0,
            "espacos": [],
            "categorias": categorias_neutras,
            "estado_vazio": True,
            "mensagem": MENSAGEM_ESPACO_VAZIO,
        }

    tempos_globais_ordem = {}
    agrupado = {}
    minutos_totais_brutos = 0

    for atv in atividades:
        tempo = atv.tempo
        minutos_totais_brutos += tempo

        chave_ordem = (atv.sessao_id, atv.ordem)
        if (
            chave_ordem not in tempos_globais_ordem
            or tempo > tempos_globais_ordem[chave_ordem]
        ):
            tempos_globais_ordem[chave_ordem] = tempo

        dimensao = atv.dimensao_espaco or "Não Definido"
        area = atv.area_por_jogador
        if (
            atv.orientacao != "PDI"
            and atv.comprimento is not None
            and atv.largura is not None
            and atv.numero_jogadores
        ):
            if dimensao not in METADADOS_DIMENSAO_ESPACO or (
                dimensao == "Não Definido" and area is None
            ):
                area, dimensao = calcular_area_e_dimensao(
                    atv.comprimento, atv.largura, atv.numero_jogadores
                )
            elif area is None:
                area, _ = calcular_area_e_dimensao(
                    atv.comprimento, atv.largura, atv.numero_jogadores
                )
        elif dimensao not in METADADOS_DIMENSAO_ESPACO:
            dimensao = "Não Definido"

        if dimensao not in agrupado:
            agrupado[dimensao] = {
                "tempos_ordem": {},
                "minutos_brutos": 0,
                "registros": 0,
                "chaves_atividades": set(),
                "areas": [],
            }

        item = agrupado[dimensao]
        item["minutos_brutos"] += tempo
        item["registros"] += 1
        item["chaves_atividades"].add(identificador_atividade_distinta(atv))
        if (
            chave_ordem not in item["tempos_ordem"]
            or tempo > item["tempos_ordem"][chave_ordem]
        ):
            item["tempos_ordem"][chave_ordem] = tempo

        if area is not None:
            item["areas"].append(area)

    minutos_totais_liquidos = sum(tempos_globais_ordem.values())
    total_execucoes = len(tempos_globais_ordem)

    itens_por_dimensao = {}
    for dimensao, dados in agrupado.items():
        minutos_liq = sum(dados["tempos_ordem"].values())
        area_media = (
            round(sum(dados["areas"]) / len(dados["areas"]), 2)
            if dados["areas"]
            else None
        )
        itens_por_dimensao[dimensao] = _montar_item_espaco(
            dimensao=dimensao,
            minutos=minutos_liq,
            minutos_brutos=dados["minutos_brutos"],
            execucoes=len(dados["tempos_ordem"]),
            registros=dados["registros"],
            atividades_distintas=len(dados["chaves_atividades"]),
            area_media=area_media,
            minutos_totais_liquidos=minutos_totais_liquidos,
            minutos_totais_brutos=minutos_totais_brutos,
        )

    espacos_ordenados = sorted(
        itens_por_dimensao.values(),
        key=lambda x: (-x["minutos"], -x["execucoes"], x["dimensao_espaco"]),
    )

    categorias_completas = [
        itens_por_dimensao.get(
            dim,
            _montar_item_espaco(
                dim,
                0,
                0,
                0,
                0,
                0,
                None,
                minutos_totais_liquidos,
                minutos_totais_brutos,
            ),
        )
        for dim in DIMENSOES_ESPACO_ORDEM
    ]

    return {
        "total_dimensoes_utilizadas": len(espacos_ordenados),
        "total_registros": total_registros,
        "total_execucoes": total_execucoes,
        "minutos_totais_liquidos": minutos_totais_liquidos,
        "minutos_totais_brutos": minutos_totais_brutos,
        "espacos": espacos_ordenados,
        "categorias": categorias_completas,
        "estado_vazio": False,
        "mensagem": None,
    }


MENSAGEM_GRAFICO_ATIVIDADES_VAZIO = "Nenhuma atividade registrada nesta sessão."
MENSAGEM_GRAFICO_MOMENTOS_VAZIO = "Nenhum momento de jogo registrado nesta sessão."
MENSAGEM_GRAFICO_FASES_VAZIO = "Nenhuma fase de jogo registrada nesta sessão."
MENSAGEM_GRAFICO_ATRIBUTOS_VAZIO = "Nenhum atributo técnico registrado nesta sessão."
MENSAGEM_GRAFICO_ESPACOS_VAZIO = "Nenhum espaço de treino dimensionado nesta sessão."
MENSAGEM_GRAFICO_COMPORTAMENTOS_VAZIO = "Nenhum comportamento de treino registrado nesta sessão."

MAPA_MOMENTOS_RELATORIO = {
    "Trans Def": "Transição Defensiva",
    "Trans Of": "Transição Ofensiva",
    "Transição Defensiva": "Transição Defensiva",
    "Transição Ofensiva": "Transição Ofensiva",
    "Ataque": "Ataque",
    "Defesa": "Defesa",
    "Bola Parada": "Bola Parada",
    "Bola parada": "Bola Parada",
}


def _montar_bloco_grafico_relatorio(titulo, subtitulo, mensagem_vazio, itens_lista):
    """Monta a estrutura de um bloco de gráfico para o relatório de sessão (RN07)."""
    total_minutos = sum(item["minutos"] for item in itens_lista)
    total_execucoes = sum(item["execucoes"] for item in itens_lista)

    if not itens_lista:
        return {
            "titulo": titulo,
            "subtitulo": subtitulo,
            "unidade": "min",
            "total_minutos": 0,
            "total_execucoes": 0,
            "itens": [],
            "estado_vazio": True,
            "mensagem_vazio": mensagem_vazio,
        }

    unidade = "min" if total_minutos > 0 else "exec"
    itens_formatados = []
    for item in itens_lista:
        minutos = item["minutos"]
        execucoes = item["execucoes"]
        if total_minutos > 0:
            percentual = round((minutos / total_minutos) * 100, 1)
        elif total_execucoes > 0:
            percentual = round((execucoes / total_execucoes) * 100, 1)
        else:
            percentual = 0.0

        itens_formatados.append(
            {
                "id": item["id"],
                "codigo": item.get("codigo", "") or "",
                "nome": item["nome"],
                "minutos": minutos,
                "execucoes": execucoes,
                "percentual": percentual,
            }
        )

    itens_formatados.sort(key=lambda x: (-x["minutos"], -x["execucoes"], x["nome"].lower()))

    return {
        "titulo": titulo,
        "subtitulo": subtitulo,
        "unidade": unidade,
        "total_minutos": total_minutos,
        "total_execucoes": total_execucoes,
        "itens": itens_formatados,
        "estado_vazio": False,
        "mensagem_vazio": "",
    }


def gerar_dados_relatorio_sessao(sessao):
    """RF25 (US25): Consolida os dados e os 6 gráficos exclusivos para o relatório individual de sessão."""
    if hasattr(sessao, "atividades") and hasattr(sessao.atividades, "all"):
        atividades = list(sessao.atividades.all())
    elif isinstance(getattr(sessao, "atividades", None), list):
        atividades = list(sessao.atividades)
    else:
        atividades = []

    atividades.sort(key=lambda a: (getattr(a, "ordem", 0) or 0, getattr(a, "id", 0) or 0))

    tempos_por_ordem = {}
    tempo_total_bruto = 0
    atividades_detalhadas = []

    agrupado_atividades = {}
    agrupado_momentos = {}
    agrupado_fases = {}
    agrupado_atributos = {}
    agrupado_espacos = {}
    agrupado_comportamentos = {}

    for atv in atividades:
        tempo = getattr(atv, "tempo", 0) or 0
        ordem = getattr(atv, "ordem", 1) or 1
        tempo_total_bruto += tempo

        if ordem not in tempos_por_ordem or tempo > tempos_por_ordem[ordem]:
            tempos_por_ordem[ordem] = tempo

        codigo_exibicao = (getattr(atv, "codigo", None) or "").strip().upper()
        if not codigo_exibicao and getattr(atv, "atividade_biblioteca", None):
            codigo_exibicao = (atv.atividade_biblioteca.codigo or "").strip().upper()

        nome_atv = getattr(atv, "nome", "")
        rotulo_atv = (
            getattr(atv, "atividade_ssp", "")
            or (f"{codigo_exibicao} | {nome_atv}" if codigo_exibicao and nome_atv else nome_atv)
            or f"Atividade {atv.id}"
        )

        atividades_detalhadas.append(
            {
                "id": getattr(atv, "id", None),
                "sessao": getattr(atv, "sessao_id", sessao.id if sessao else None),
                "atividade_biblioteca": getattr(atv, "atividade_biblioteca_id", None),
                "codigo": codigo_exibicao,
                "nome": nome_atv,
                "atividade_ssp": rotulo_atv,
                "tipologia": getattr(atv, "tipologia", ""),
                "sigla_tipologia": getattr(atv, "sigla_tipologia", ""),
                "tipo_ssp": getattr(atv, "tipo_ssp", ""),
                "orientacao": getattr(atv, "orientacao", "") or "",
                "ordem": ordem,
                "tempo": tempo,
                "comprimento": getattr(atv, "comprimento", None),
                "largura": getattr(atv, "largura", None),
                "numero_jogadores": getattr(atv, "numero_jogadores", None),
                "area_por_jogador": getattr(atv, "area_por_jogador", None),
                "dimensao_espaco": getattr(atv, "dimensao_espaco", "Não Definido") or "Não Definido",
                "momentos_jogo": getattr(atv, "momentos_jogo", None) or [],
                "fases_jogo": getattr(atv, "fases_jogo", None) or [],
                "comportamentos": getattr(atv, "comportamentos", None) or [],
                "atributos_tecnicos": getattr(atv, "atributos_tecnicos", None) or [],
                "criado_em": getattr(atv, "criado_em", None),
                "atualizado_em": getattr(atv, "atualizado_em", None),
            }
        )

        # 1. Gráfico de Atividades
        chave_atv = (codigo_exibicao or nome_atv or f"atv-{atv.id}").lower()
        if chave_atv not in agrupado_atividades:
            agrupado_atividades[chave_atv] = {
                "id": f"atv-{chave_atv}",
                "codigo": codigo_exibicao,
                "nome": rotulo_atv,
                "minutos": 0,
                "execucoes": 0,
            }
        agrupado_atividades[chave_atv]["minutos"] += tempo
        agrupado_atividades[chave_atv]["execucoes"] += 1

        # 2. Gráfico de Momentos de Jogo
        for m in (getattr(atv, "momentos_jogo", None) or []):
            nome_m = str(m.get("nome") or m.get("momento_jogo") if isinstance(m, dict) else m).strip()
            if not nome_m:
                continue
            nome_exib = MAPA_MOMENTOS_RELATORIO.get(nome_m, nome_m)
            chave_m = nome_exib.lower()
            if chave_m not in agrupado_momentos:
                agrupado_momentos[chave_m] = {
                    "id": f"momentos_jogo-{chave_m.replace(' ', '-')}",
                    "codigo": nome_m,
                    "nome": nome_exib,
                    "minutos": 0,
                    "execucoes": 0,
                }
            agrupado_momentos[chave_m]["minutos"] += tempo
            agrupado_momentos[chave_m]["execucoes"] += 1

        # 3. Gráfico de Fases de Jogo
        for f in (getattr(atv, "fases_jogo", None) or []):
            nome_f = str(f.get("nome") or f.get("fase_jogo") if isinstance(f, dict) else f).strip()
            if not nome_f:
                continue
            chave_f = nome_f.lower()
            if chave_f not in agrupado_fases:
                agrupado_fases[chave_f] = {
                    "id": f"fases_jogo-{chave_f.replace(' ', '-')}",
                    "codigo": nome_f,
                    "nome": nome_f,
                    "minutos": 0,
                    "execucoes": 0,
                }
            agrupado_fases[chave_f]["minutos"] += tempo
            agrupado_fases[chave_f]["execucoes"] += 1

        # 4. Gráfico de Atributos Técnicos
        for a in (getattr(atv, "atributos_tecnicos", None) or []):
            nome_a = str(a.get("nome") if isinstance(a, dict) else a).strip()
            if not nome_a:
                continue
            chave_a = nome_a.lower()
            if chave_a not in agrupado_atributos:
                agrupado_atributos[chave_a] = {
                    "id": f"atributos_tecnicos-{chave_a.replace(' ', '-')}",
                    "codigo": nome_a,
                    "nome": nome_a,
                    "minutos": 0,
                    "execucoes": 0,
                }
            agrupado_atributos[chave_a]["minutos"] += tempo
            agrupado_atributos[chave_a]["execucoes"] += 1

        # 5. Gráfico de Espaços de Treino (ignora "Não Definido")
        dimensao = getattr(atv, "dimensao_espaco", "") or ""
        if dimensao and dimensao != "Não Definido":
            chave_dim = dimensao.lower()
            if chave_dim not in agrupado_espacos:
                agrupado_espacos[chave_dim] = {
                    "id": f"espacos_treino-{chave_dim}",
                    "codigo": dimensao[:3].upper(),
                    "nome": f"Espaço {dimensao}",
                    "minutos": 0,
                    "execucoes": 0,
                }
            agrupado_espacos[chave_dim]["minutos"] += tempo
            agrupado_espacos[chave_dim]["execucoes"] += 1

        # 6. Gráfico de Comportamentos de Treino
        for c in (getattr(atv, "comportamentos", None) or []):
            nome_c = str(c.get("nome") if isinstance(c, dict) else c).strip()
            if not nome_c:
                continue
            chave_c = nome_c.lower()
            if chave_c not in agrupado_comportamentos:
                agrupado_comportamentos[chave_c] = {
                    "id": f"comportamentos_treino-{chave_c.replace(' ', '-')}",
                    "codigo": nome_c,
                    "nome": nome_c,
                    "minutos": 0,
                    "execucoes": 0,
                }
            agrupado_comportamentos[chave_c]["minutos"] += tempo
            agrupado_comportamentos[chave_c]["execucoes"] += 1

    tempo_liquido = sum(tempos_por_ordem.values())
    numero_execucoes = len(tempos_por_ordem)

    sequencia = getattr(sessao, "sequencia", None)
    if sequencia:
        codigo_sessao = f"SES-{sequencia:02d}"
    elif getattr(sessao, "id", None):
        codigo_sessao = f"SES-{sessao.id:02d}"
    else:
        codigo_sessao = "SES-01"

    data_sessao = getattr(sessao, "data", None)
    mes_sessao = ""
    if data_sessao and hasattr(data_sessao, "month"):
        mes_sessao = NOMES_MESES_PT[data_sessao.month - 1]

    dados_sessao = {
        "id": getattr(sessao, "id", None),
        "sequencia": sequencia,
        "codigo": codigo_sessao,
        "nome": getattr(sessao, "nome", "") or (f"Sessão {sequencia}" if sequencia else "Sessão"),
        "data": data_sessao,
        "mes": mes_sessao,
        "total_atividades": len(atividades),
        "numero_execucoes": numero_execucoes,
        "tempo_total_bruto": tempo_total_bruto,
        "tempo_liquido": tempo_liquido,
        "atividades": atividades_detalhadas,
    }

    # Hierarquia de periodização
    micro = getattr(sessao, "microciclo", None)
    meso = getattr(micro, "mesociclo", None) if micro else None
    macro = getattr(meso, "macrociclo", None) if meso else None

    periodizacao = {
        "microciclo": {
            "id": getattr(micro, "id", None),
            "codigo": None,
            "nome": getattr(micro, "nome", "") if micro else "",
            "data_inicio": getattr(micro, "data_inicio", None) if micro else None,
            "data_termino": getattr(micro, "data_termino", None) if micro else None,
        },
        "mesociclo": {
            "id": getattr(meso, "id", None),
            "codigo": None,
            "nome": getattr(meso, "nome", "") if meso else "",
            "data_inicio": getattr(meso, "data_inicio", None) if meso else None,
            "data_termino": getattr(meso, "data_termino", None) if meso else None,
        },
        "macrociclo": {
            "id": getattr(macro, "id", None),
            "codigo": getattr(macro, "codigo", "") if macro else "",
            "nome": getattr(macro, "nome", "") if macro else "",
            "data_inicio": getattr(macro, "data_inicio", None) if macro else None,
            "data_termino": getattr(macro, "data_termino", None) if macro else None,
        },
    }

    graficos = {
        "atividades": _montar_bloco_grafico_relatorio(
            "Atividades da Sessão",
            "Tempo e execuções por atividade realizada na sessão",
            MENSAGEM_GRAFICO_ATIVIDADES_VAZIO,
            list(agrupado_atividades.values()),
        ),
        "momentos_jogo": _montar_bloco_grafico_relatorio(
            "Momento de Jogo",
            "Tempo dedicado a cada momento de jogo na sessão",
            MENSAGEM_GRAFICO_MOMENTOS_VAZIO,
            list(agrupado_momentos.values()),
        ),
        "fases_jogo": _montar_bloco_grafico_relatorio(
            "Fases de Jogo",
            "Tempo em minutos dedicado a cada fase de jogo na sessão",
            MENSAGEM_GRAFICO_FASES_VAZIO,
            list(agrupado_fases.values()),
        ),
        "atributos_tecnicos": _montar_bloco_grafico_relatorio(
            "Atributo Técnico",
            "Atributos técnicos trabalhados nas atividades da sessão",
            MENSAGEM_GRAFICO_ATRIBUTOS_VAZIO,
            list(agrupado_atributos.values()),
        ),
        "espacos_treino": _montar_bloco_grafico_relatorio(
            "Espaço de Treino",
            "Dimensões de espaço utilizadas nas atividades da sessão",
            MENSAGEM_GRAFICO_ESPACOS_VAZIO,
            list(agrupado_espacos.values()),
        ),
        "comportamentos_treino": _montar_bloco_grafico_relatorio(
            "Comportamento de Treino",
            "Comportamentos e princípios táticos trabalhados na sessão",
            MENSAGEM_GRAFICO_COMPORTAMENTOS_VAZIO,
            list(agrupado_comportamentos.values()),
        ),
    }

    return {
        "sessao": dados_sessao,
        "periodizacao": periodizacao,
        "graficos": graficos,
    }