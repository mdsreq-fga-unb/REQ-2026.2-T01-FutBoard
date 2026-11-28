"""Roteamento de URLs do módulo de Treinos."""

from django.urls import path

from .views import (
    AtividadeBibliotecaDetailView,
    AtividadeBibliotecaListCreateView,
    AtividadeSessaoDetailView,
    AtividadeSessaoListCreateView,
    ComportamentoTaticoDetailView,
    ComportamentoTaticoListCreateView,
    IndicadoresTreinoView,
    InformacoesAtividadesTreinoView,
    InformacoesComportamentosTreinoView,
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
        "comportamentos/",
        ComportamentoTaticoListCreateView.as_view(),
        name="comportamento-list-create",
    ),
    path(
        "comportamentos/<int:pk>/",
        ComportamentoTaticoDetailView.as_view(),
        name="comportamento-detail",
    ),
    path(
        "biblioteca/",
        AtividadeBibliotecaListCreateView.as_view(),
        name="biblioteca-list-create",
    ),
    path(
        "biblioteca/<int:pk>/",
        AtividadeBibliotecaDetailView.as_view(),
        name="biblioteca-detail",
    ),
    path(
        "atividades-sessao/",
        AtividadeSessaoListCreateView.as_view(),
        name="atividade-sessao-list-create",
    ),
    path(
        "atividades-sessao/<int:pk>/",
        AtividadeSessaoDetailView.as_view(),
        name="atividade-sessao-detail",
    ),
    path(
        "indicadores/",
        IndicadoresTreinoView.as_view(),
        name="indicadores-treino",
    ),
    path(
        "atividades-treino/",
        InformacoesAtividadesTreinoView.as_view(),
        name="informacoes-atividades-treino",
    ),
    path(
        "comportamentos-treino/",
        InformacoesComportamentosTreinoView.as_view(),
        name="informacoes-comportamentos-treino",
    ),
]
