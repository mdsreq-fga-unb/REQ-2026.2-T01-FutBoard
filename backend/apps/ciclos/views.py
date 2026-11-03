from rest_framework import generics

from apps.ciclos.models import Mesociclo
from apps.ciclos.serializers import MesocicloSerializer

#MESOCICLO
class MesocicloCreateView(generics.CreateAPIView):
    queryset = Mesociclo.objects.all()
    serializer_class = MesocicloSerializer


class MesocicloDetailView(generics.RetrieveUpdateAPIView):
    queryset = Mesociclo.objects.select_related("macrociclo").all()
    serializer_class = MesocicloSerializer