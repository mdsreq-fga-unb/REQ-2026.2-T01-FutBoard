"""Modelos de ciclos de periodização esportiva."""

from django.core.exceptions import ValidationError
from django.db import models


class Macrociclo(models.Model):
    """Planejamento geral de uma temporada de treinos."""

    codigo = models.CharField(max_length=20, unique=True, editable=False)
    nome = models.CharField(max_length=200)
    data_inicio = models.DateField()
    data_termino = models.DateField()
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-data_inicio", "-id"]
        verbose_name = "macrociclo"
        verbose_name_plural = "macrociclos"

    def __str__(self):
        return f"{self.codigo} - {self.nome}"

    def clean(self):
        if self.data_inicio and self.data_termino and self.data_termino < self.data_inicio:
            raise ValidationError(
                {"data_termino": "A data de término deve ser igual ou posterior à data de início."}
            )

    def save(self, *args, **kwargs):
        self.full_clean()
        if not self.codigo:
            ultimo_id = Macrociclo.objects.order_by("-id").values_list("id", flat=True).first() or 0
            self.codigo = f"MC-{ultimo_id + 1:02d}"
        super().save(*args, **kwargs)
