"""Roteamento de URLs do módulo de Usuários (CP05)."""

from django.urls import path

from .views import CadastroView, LoginView, LogoutView, MeView, RenovarTokenView

app_name = "usuarios"

urlpatterns = [
    path("login/", LoginView.as_view(), name="login"),
    path("token/refresh/", RenovarTokenView.as_view(), name="token-refresh"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("me/", MeView.as_view(), name="me"),
    path(
        "cadastro/",
        CadastroView.as_view(),
        name="cadastro",
    ),
]
