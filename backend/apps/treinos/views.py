"""Views da API de sessões e biblioteca de treinos."""

from rest_framework import generics

from .models import AtividadeBiblioteca, Sessao
from .serializers import AtividadeBibliotecaSerializer, SessaoSerializer


class SessaoListCreateView(generics.ListCreateAPIView):
    """Lista sessões e permite cadastrar uma nova sessão."""

    queryset = Sessao.objects.select_related("microciclo__mesociclo__macrociclo").all()
    serializer_class = SessaoSerializer


class SessaoDetailView(generics.RetrieveUpdateAPIView):
    """Consulta e permite editar uma sessão existente."""

    queryset = Sessao.objects.select_related("microciclo__mesociclo__macrociclo").all()
    serializer_class = SessaoSerializer


class AtividadeBibliotecaListCreateView(generics.ListCreateAPIView):
    """US19: Lista atividades da biblioteca e permite cadastrar uma nova atividade."""

    queryset = AtividadeBiblioteca.objects.all()
    serializer_class = AtividadeBibliotecaSerializer

