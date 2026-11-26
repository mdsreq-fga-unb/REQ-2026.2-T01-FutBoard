"""Roteamento de URLs do módulo de Usuários (CP05)."""

from django.urls import path

from .views import CadastroView, csrf_token

app_name = "usuarios"

urlpatterns = [
    path("csrf/", csrf_token, name="csrf"),
    path(
        "cadastro/",
        CadastroView.as_view(),
        name="cadastro",
    ),
]
