"""Configuração da aplicação de Usuários e Autenticação (CP05)."""
from django.apps import AppConfig


class UsuariosConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.usuarios"
    verbose_name = "Usuários e Perfis de Acesso"
