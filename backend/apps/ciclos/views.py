"""Views da API de ciclos de periodização."""

from rest_framework import generics

from .models import Macrociclo, Mesociclo
from .serializers import MacrocicloSerializer, MesocicloSerializer


class MacrocicloListCreateView(generics.ListCreateAPIView):
    """Lista macrociclos e permite cadastrar um novo macrociclo."""

    queryset = Macrociclo.objects.all()
    serializer_class = MacrocicloSerializer


class MacrocicloDetailView(generics.RetrieveUpdateAPIView):
    """Consulta e permite editar um macrociclo existente."""

    queryset = Macrociclo.objects.all()
    serializer_class = MacrocicloSerializer


class MesocicloListCreateView(generics.ListCreateAPIView):
    """Lista mesociclos e permite cadastrar um novo mesociclo."""

    queryset = Mesociclo.objects.select_related("macrociclo").all()
    serializer_class = MesocicloSerializer


class MesocicloDetailView(generics.RetrieveUpdateAPIView):
    """Consulta e permite editar um mesociclo existente."""

    queryset = Mesociclo.objects.select_related("macrociclo").all()
    serializer_class = MesocicloSerializer
