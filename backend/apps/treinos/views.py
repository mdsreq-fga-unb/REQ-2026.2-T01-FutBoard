"""Views da API de sessões e biblioteca de treinos."""

from datetime import date

from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import (
    AtividadeBiblioteca,
    AtividadeSessao,
    ComportamentoTatico,
    Sessao,
    calcular_indicadores_treino,
    normalizar_nome_comportamento,
)
from .serializers import (
    AtividadeBibliotecaSerializer,
    AtividadeSessaoSerializer,
    ComportamentoTaticoSerializer,
    IndicadoresTreinoSerializer,
    SessaoSerializer,
)

MESES_POR_NOME = {
    "janeiro": 1,
    "fevereiro": 2,
    "marco": 3,
    "abril": 4,
    "maio": 5,
    "junho": 6,
    "julho": 7,
    "agosto": 8,
    "setembro": 9,
    "outubro": 10,
    "novembro": 11,
    "dezembro": 12,
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
        queryset = AtividadeSessao.objects.select_related("sessao", "atividade_biblioteca")

        sessao_id = self.request.query_params.get("sessao")
        if sessao_id is not None:
            if not sessao_id.isdigit():
                return queryset.none()
            queryset = queryset.filter(sessao_id=int(sessao_id))

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
