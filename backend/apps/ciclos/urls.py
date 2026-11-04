"""Roteamento de URLs do módulo de Ciclos de Periodização (CP02)."""

from django.urls import path

from .views import (
    MacrocicloDetailView,
    MacrocicloListCreateView,
    MesocicloDetailView,
    MesocicloListCreateView,
    MicrocicloListCreateView,
)

app_name = "ciclos"

urlpatterns = [
    path(
        "macrociclos/",
        MacrocicloListCreateView.as_view(),
        name="macrociclo-list-create",
    ),
    path(
        "macrociclos/<int:pk>/",
        MacrocicloDetailView.as_view(),
        name="macrociclo-detail",
    ),
    path(
        "mesociclos/",
        MesocicloListCreateView.as_view(),
        name="mesociclo-list-create",
    ),
    path(
        "mesociclos/<int:pk>/",
        MesocicloDetailView.as_view(),
        name="mesociclo-detail",
    ),
    path(
        "microciclos/",
        MicrocicloListCreateView.as_view(),
        name="microciclo-list-create",
    ),
]
