"""Roteamento de URLs do módulo de Usuários (CP05)."""

from django.urls import path

from .views import CadastroView, LoginView, LogoutView, MeView, csrf_token

app_name = "usuarios"

urlpatterns = [
    path("csrf/", csrf_token, name="csrf"),
    path("login/", LoginView.as_view(), name="login"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("me/", MeView.as_view(), name="me"),
    path(
        "cadastro/",
        CadastroView.as_view(),
        name="cadastro",
    ),
]
