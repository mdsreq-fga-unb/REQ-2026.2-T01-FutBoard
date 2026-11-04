"""Configuração da aplicação de Ciclos de Periodização Esportiva (CP02)."""
from django.apps import AppConfig


class CiclosConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.ciclos"
    verbose_name = "Ciclos de Periodização"
