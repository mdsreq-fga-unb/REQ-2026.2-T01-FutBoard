"""Modelos de ciclos de periodização esportiva."""

from django.core.exceptions import ValidationError
from django.db import models
from django.db.models import F, Q


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


class Mesociclo(models.Model):
    macrociclo = models.ForeignKey(
        Macrociclo,
        on_delete=models.PROTECT,
        related_name="mesociclos",
    )
    nome = models.CharField(max_length=255)
    data_inicio = models.DateField()
    data_termino = models.DateField()

    class Meta:
        constraints = [
            models.CheckConstraint(
                condition=Q(data_termino__gte=F("data_inicio")),
                name="ck_mesociclo_datas_validas",
            )
        ]

    def clean(self):
        super().clean()
        erros = {}

        if self.macrociclo_id and self.data_inicio and self.data_termino:
            if self.data_inicio < self.macrociclo.data_inicio:
                erros["data_inicio"] = "O mesociclo não pode começar antes do macrociclo."
            if self.data_termino > self.macrociclo.data_termino:
                erros["data_termino"] = "O mesociclo não pode terminar depois do macrociclo."

        if erros:
            raise ValidationError(erros)

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)
