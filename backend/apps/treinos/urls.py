"""Roteamento de URLs do módulo de Treinos."""

from django.urls import path

from .views import (
    AtividadeBibliotecaListCreateView,
    SessaoDetailView,
    SessaoListCreateView,
)

app_name = "treinos"

urlpatterns = [
    path(
        "sessoes/",
        SessaoListCreateView.as_view(),
        name="sessao-list-create",
    ),
    path(
        "sessoes/<int:pk>/",
        SessaoDetailView.as_view(),
        name="sessao-detail",
    ),
    path(
        "biblioteca/",
        AtividadeBibliotecaListCreateView.as_view(),
        name="biblioteca-list-create",
    ),
]

