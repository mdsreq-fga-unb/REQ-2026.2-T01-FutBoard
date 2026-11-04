"""Configuração da aplicação de Treinos e Métricas Analíticas (CP01, CP03, CP04)."""
from django.apps import AppConfig


class TreinosConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.treinos"
    verbose_name = "Treinos e Atividades"
