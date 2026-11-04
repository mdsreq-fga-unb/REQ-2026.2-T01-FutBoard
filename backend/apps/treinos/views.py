"""Views da API de sessões."""

from rest_framework import generics

from .models import Sessao
from .serializers import SessaoSerializer


class SessaoListCreateView(generics.ListCreateAPIView):
    """Lista sessões e permite cadastrar uma nova sessão."""

    queryset = Sessao.objects.select_related("microciclo__mesociclo__macrociclo").all()
    serializer_class = SessaoSerializer


class SessaoDetailView(generics.RetrieveUpdateAPIView):
    """Consulta e permite editar uma sessão existente."""

    queryset = Sessao.objects.select_related("microciclo__mesociclo__macrociclo").all()
    serializer_class = SessaoSerializer
