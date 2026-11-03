"""Roteamento de URLs do módulo de Ciclos de Periodização (CP02)."""
from django.urls import path

from apps.ciclos.views import (
    MesocicloCreateView,
    MesocicloDetailView,
)

app_name = "ciclos"

urlpatterns = [
    #MESOCICLOS
    path(
        "mesociclos/",
        MesocicloCreateView.as_view(),
        name="mesociclo-create",
    ),
    path(
        "mesociclos/<int:pk>/",
        MesocicloDetailView.as_view(),
        name="mesociclo-detail",
    ),
]