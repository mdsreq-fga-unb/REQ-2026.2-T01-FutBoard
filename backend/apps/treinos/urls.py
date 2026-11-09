"""Roteamento de URLs do módulo de Treinos."""

from django.urls import path

from .views import (
    SessaoDetailView,
    SessaoListCreateView,
    ComportamentoTaticoListCreateView,
    ComportamentoTaticoDetailView,
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
        "comportamentos/",
        ComportamentoTaticoListCreateView.as_view(),
        name="comportamento-list-create",
    ),
    path(
        "comportamentos/<int:pk>/",
        ComportamentoTaticoDetailView.as_view(),
        name="comportamento-detail",
    ),
]
