"""Views da API de ciclos de periodização."""

from rest_framework import generics

from .models import Macrociclo, Mesociclo, Microciclo
from .serializers import (
    MacrocicloSerializer,
    MesocicloSerializer,
    MicrocicloSerializer,
)


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


class MicrocicloListCreateView(generics.ListCreateAPIView):
    """Lista microciclos e permite cadastrar um novo microciclo."""

    queryset = Microciclo.objects.select_related("mesociclo__macrociclo").all()
    serializer_class = MicrocicloSerializer
