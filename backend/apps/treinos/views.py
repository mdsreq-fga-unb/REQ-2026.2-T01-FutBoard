"""Views da API de sessões e biblioteca de treinos."""

from rest_framework import generics

from .models import (
    AtividadeBiblioteca,
    AtividadeSessao,
    ComportamentoTatico,
    Sessao,
)
from .serializers import (
    AtividadeBibliotecaSerializer,
    AtividadeSessaoSerializer,
    ComportamentoTaticoSerializer,
    SessaoSerializer,
)


class SessaoListCreateView(generics.ListCreateAPIView):
    """Lista sessões e permite cadastrar uma nova sessão."""

    queryset = Sessao.objects.select_related("microciclo__mesociclo__macrociclo").all()
    serializer_class = SessaoSerializer


class SessaoDetailView(generics.RetrieveUpdateAPIView):
    """Consulta e permite editar uma sessão existente."""

    queryset = Sessao.objects.select_related("microciclo__mesociclo__macrociclo").all()
    serializer_class = SessaoSerializer


class ComportamentoTaticoListCreateView(generics.ListCreateAPIView):
    """
    US10: listar e cadastrar comportamentos táticos.
    """

    queryset = ComportamentoTatico.objects.all()
    serializer_class = ComportamentoTaticoSerializer


class ComportamentoTaticoDetailView(generics.RetrieveUpdateAPIView):
    """
    US11: consultar e editar comportamentos táticos.
    """

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

