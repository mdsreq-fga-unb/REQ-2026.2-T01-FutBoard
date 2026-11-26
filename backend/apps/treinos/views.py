"""Views da API de sessões e biblioteca de treinos."""

from datetime import date

from django.db.models import Q
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import (
    SIGLAS_POR_TIPOLOGIA,
    TIPOLOGIAS_MAPA,
    AtividadeBiblioteca,
    AtividadeSessao,
    ComportamentoTatico,
    Sessao,
    calcular_indicadores_treino,
    calcular_informacoes_atividades_treino,
    calcular_informacoes_espaco_treino,
    normalizar_dimensao_espaco,
    normalizar_nome_comportamento,
)
from .serializers import (
    AtividadeBibliotecaSerializer,
    AtividadeSessaoSerializer,
    ComportamentoTaticoSerializer,
    IndicadoresTreinoSerializer,
    InformacoesAtividadesTreinoSerializer,
    InformacoesEspacoTreinoSerializer,
    SessaoSerializer,
)

MESES_POR_NOME = {
    "janeiro": 1,
    "jan": 1,
    "fevereiro": 2,
    "fev": 2,
    "marco": 3,
    "mar": 3,
    "abril": 4,
    "abr": 4,
    "maio": 5,
    "mai": 5,
    "junho": 6,
    "jun": 6,
    "julho": 7,
    "jul": 7,
    "agosto": 8,
    "ago": 8,
    "setembro": 9,
    "set": 9,
    "outubro": 10,
    "out": 10,
    "novembro": 11,
    "nov": 11,
    "dezembro": 12,
    "dez": 12,
}


def filtrar_sessoes_por_parametros(queryset, query_params):
    """Aplica filtros de periodização (macro, meso, micro, mês, sessão e datas) com segurança (RN07)."""
    filtros_id = {
        "macrociclo": "microciclo__mesociclo__macrociclo_id",
        "mesociclo": "microciclo__mesociclo_id",
        "microciclo": "microciclo_id",
        "sessao": "id",
    }

    for param, lookup in filtros_id.items():
        valor = query_params.get(param)
        if valor not in (None, ""):
            if not str(valor).isdigit():
                return queryset.none()
            queryset = queryset.filter(**{lookup: int(valor)})

    mes = query_params.get("mes")
    if mes not in (None, ""):
        mes_str = str(mes).strip()
        if mes_str.isdigit():
            mes_num = int(mes_str)
            if not 1 <= mes_num <= 12:
                return queryset.none()
            queryset = queryset.filter(data__month=mes_num)
        else:
            mes_normalizado = normalizar_nome_comportamento(mes_str)
            mes_num = MESES_POR_NOME.get(mes_normalizado)
            if mes_num is None:
                return queryset.none()
            queryset = queryset.filter(data__month=mes_num)

    data_inicio = query_params.get("data_inicio")
    if data_inicio not in (None, ""):
        try:
            queryset = queryset.filter(data__gte=date.fromisoformat(str(data_inicio).strip()))
        except ValueError:
            return queryset.none()

    data_termino = query_params.get("data_termino")
    if data_termino not in (None, ""):
        try:
            queryset = queryset.filter(data__lte=date.fromisoformat(str(data_termino).strip()))
        except ValueError:
            return queryset.none()

    return queryset


class SessaoListCreateView(generics.ListCreateAPIView):
    """Lista sessões e permite cadastrar uma nova sessão."""

    queryset = Sessao.objects.select_related("microciclo__mesociclo__macrociclo").all()
    serializer_class = SessaoSerializer


class SessaoDetailView(generics.RetrieveUpdateAPIView):
    """Consulta e permite editar uma sessão existente."""

    queryset = Sessao.objects.select_related("microciclo__mesociclo__macrociclo").all()
    serializer_class = SessaoSerializer


class ComportamentoTaticoListCreateView(generics.ListCreateAPIView):
    """US10: listar e cadastrar comportamentos táticos."""

    queryset = ComportamentoTatico.objects.all()
    serializer_class = ComportamentoTaticoSerializer


class ComportamentoTaticoDetailView(generics.RetrieveUpdateAPIView):
    """US11: consultar e editar comportamentos táticos."""

    queryset = ComportamentoTatico.objects.all()
    serializer_class = ComportamentoTaticoSerializer


class AtividadeBibliotecaListCreateView(generics.ListCreateAPIView):
    """US19: Lista atividades da biblioteca e permite cadastrar uma nova atividade."""

    queryset = AtividadeBiblioteca.objects.all()
    serializer_class = AtividadeBibliotecaSerializer


class AtividadeSessaoListCreateView(generics.ListCreateAPIView):
    """US13: lista as atividades de sessões e cadastra uma nova atividade na sessão.

    Para listar só as atividades de uma sessão: GET /api/treinos/atividades-sessao/?sessao=<id>
    """

    serializer_class = AtividadeSessaoSerializer

    def get_queryset(self):
        queryset = AtividadeSessao.objects.select_related(
            "sessao__microciclo__mesociclo__macrociclo",
            "atividade_biblioteca",
        )
        return filtrar_atividades_sessao_por_parametros(queryset, self.request.query_params)


def filtrar_atividades_sessao_por_parametros(queryset, query_params):
    """US24 (RF24): Filtra atividades de sessão por periodização, mês, tipologia, SSP, orientação, código e busca (RN07)."""
    filtros_id = {
        "macrociclo": "sessao__microciclo__mesociclo__macrociclo_id",
        "mesociclo": "sessao__microciclo__mesociclo_id",
        "microciclo": "sessao__microciclo_id",
        "sessao": "sessao_id",
        "atividade_biblioteca": "atividade_biblioteca_id",
    }

    for param, lookup in filtros_id.items():
        valor = query_params.get(param)
        if valor not in (None, ""):
            if not str(valor).isdigit():
                return queryset.none()
            queryset = queryset.filter(**{lookup: int(valor)})

    mes = query_params.get("mes")
    if mes not in (None, ""):
        mes_str = str(mes).strip()
        if mes_str.isdigit():
            mes_num = int(mes_str)
            if not 1 <= mes_num <= 12:
                return queryset.none()
            queryset = queryset.filter(sessao__data__month=mes_num)
        else:
            mes_normalizado = normalizar_nome_comportamento(mes_str)
            mes_num = MESES_POR_NOME.get(mes_normalizado)
            if mes_num is None:
                return queryset.none()
            queryset = queryset.filter(sessao__data__month=mes_num)

    data_inicio = query_params.get("data_inicio")
    if data_inicio not in (None, ""):
        try:
            queryset = queryset.filter(
                sessao__data__gte=date.fromisoformat(str(data_inicio).strip())
            )
        except ValueError:
            return queryset.none()

    data_termino = query_params.get("data_termino")
    if data_termino not in (None, ""):
        try:
            queryset = queryset.filter(
                sessao__data__lte=date.fromisoformat(str(data_termino).strip())
            )
        except ValueError:
            return queryset.none()

    tipologia = query_params.get("tipologia")
    if tipologia not in (None, ""):
        texto_tip = " ".join(str(tipologia).split())
        sigla_upper = texto_tip.upper()
        if sigla_upper in TIPOLOGIAS_MAPA:
            queryset = queryset.filter(tipologia=TIPOLOGIAS_MAPA[sigla_upper])
        else:
            tipologia_norm = normalizar_nome_comportamento(texto_tip)
            correspondente = next(
                (
                    nome
                    for nome in SIGLAS_POR_TIPOLOGIA
                    if normalizar_nome_comportamento(nome) == tipologia_norm
                ),
                None,
            )
            if correspondente is None:
                return queryset.none()
            queryset = queryset.filter(tipologia=correspondente)

    tipo_ssp = query_params.get("tipo_ssp")
    if tipo_ssp not in (None, ""):
        queryset = queryset.filter(tipo_ssp__iexact=str(tipo_ssp).strip())

    orientacao = query_params.get("orientacao")
    if orientacao not in (None, ""):
        queryset = queryset.filter(orientacao__iexact=str(orientacao).strip())

    espaco = query_params.get("dimensao_espaco") or query_params.get("espaco")
    if espaco not in (None, ""):
        dimensao_norm = normalizar_dimensao_espaco(espaco)
        if not dimensao_norm:
            return queryset.none()
        queryset = queryset.filter(dimensao_espaco=dimensao_norm)

    codigo = query_params.get("codigo")
    if codigo not in (None, ""):
        queryset = queryset.filter(codigo__iexact=str(codigo).strip())

    busca = query_params.get("busca") or query_params.get("q")
    if busca not in (None, ""):
        termo = " ".join(str(busca).split())
        queryset = queryset.filter(
            Q(codigo__icontains=termo)
            | Q(nome__icontains=termo)
            | Q(tipologia__icontains=termo)
        )

    return queryset


class AtividadeSessaoDetailView(generics.RetrieveUpdateAPIView):
    """US14: consulta e edita uma atividade de sessão (sem alterar a biblioteca)."""

    queryset = AtividadeSessao.objects.select_related("sessao", "atividade_biblioteca")
    serializer_class = AtividadeSessaoSerializer


class AtividadeBibliotecaDetailView(generics.RetrieveUpdateAPIView):
    """US20: Consulta e permite editar uma atividade cadastrada na biblioteca."""

    queryset = AtividadeBiblioteca.objects.all()
    serializer_class = AtividadeBibliotecaSerializer


class IndicadoresTreinoView(APIView):
    """US22 (RF22): Retorna os indicadores de treino filtráveis por periodização, mês e sessão."""

    def get(self, request, *args, **kwargs):
        queryset = Sessao.objects.select_related("microciclo__mesociclo__macrociclo").all()
        queryset_filtrado = filtrar_sessoes_por_parametros(queryset, request.query_params)
        indicadores = calcular_indicadores_treino(queryset_filtrado)
        serializer = IndicadoresTreinoSerializer(indicadores)
        return Response(serializer.data)


class InformacoesAtividadesTreinoView(APIView):
    """US24 (RF24): Retorna informações consolidadas e gráficos de atividades do treino por filtro (RN07)."""

    def get(self, request, *args, **kwargs):
        queryset = AtividadeSessao.objects.select_related(
            "sessao__microciclo__mesociclo__macrociclo",
            "atividade_biblioteca",
        ).all()
        queryset_filtrado = filtrar_atividades_sessao_por_parametros(
            queryset, request.query_params
        )
        dados = calcular_informacoes_atividades_treino(queryset_filtrado)
        serializer = InformacoesAtividadesTreinoSerializer(dados)
        return Response(serializer.data)


class InformacoesEspacoTreinoView(APIView):
    """US35 (RF35): Retorna distribuição de tempo por dimensão de espaço do treino (RN01, RN02, RN07)."""

    def get(self, request, *args, **kwargs):
        queryset = AtividadeSessao.objects.select_related(
            "sessao__microciclo__mesociclo__macrociclo",
            "atividade_biblioteca",
        ).all()
        queryset_filtrado = filtrar_atividades_sessao_por_parametros(
            queryset, request.query_params
        )
        dados = calcular_informacoes_espaco_treino(queryset_filtrado)
        serializer = InformacoesEspacoTreinoSerializer(dados)
        return Response(serializer.data)
