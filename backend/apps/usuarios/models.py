from django.conf import settings
from django.db import models


class PerfilAcesso(models.Model):
    """Controla a autorização de acesso dos usuários ao FutBoard."""

    class Situacao(models.TextChoices):
        PENDENTE = "PENDENTE", "Pendente"
        APROVADA = "APROVADA", "Aprovada"
        RECUSADA = "RECUSADA", "Recusada"
        REVOGADA = "REVOGADA", "Revogada"

    usuario = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="perfil_acesso",
    )

    nome_completo = models.CharField(max_length=150)

    situacao = models.CharField(
        max_length=12,
        choices=Situacao.choices,
        default=Situacao.PENDENTE,
    )

    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Perfil de acesso"
        verbose_name_plural = "Perfis de acesso"

    def __str__(self):
        return f"{self.nome_completo} - {self.get_situacao_display()}"
