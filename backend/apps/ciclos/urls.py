"""Roteamento de URLs do módulo de Ciclos de Periodização (CP02)."""

from django.urls import path

from .views import MacrocicloDetailView, MacrocicloListCreateView

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
]
