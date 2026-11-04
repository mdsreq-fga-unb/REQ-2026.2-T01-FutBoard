"""Views da API de ciclos de periodização."""
from rest_framework import generics

from .models import Macrociclo
from .serializers import MacrocicloSerializer


class MacrocicloListCreateView(generics.ListCreateAPIView):
    """Lista macrociclos e permite cadastrar um novo macrociclo."""

    queryset = Macrociclo.objects.all()
    serializer_class = MacrocicloSerializer


class MacrocicloDetailView(generics.RetrieveUpdateAPIView):
    """Consulta e permite editar um macrociclo existente."""

    queryset = Macrociclo.objects.all()
    serializer_class = MacrocicloSerializer