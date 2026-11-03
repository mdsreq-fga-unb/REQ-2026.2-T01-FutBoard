from django.core.exceptions import ValidationError
from django.db import models
from django.db.models import F, Q


class Macrociclo(models.Model):
    nome = models.CharField(max_length=255)
    data_inicio = models.DateField()
    data_fim = models.DateField()

    class Meta:
        constraints = [
            models.CheckConstraint(
                condition=Q(data_fim__gte=F("data_inicio")),
                name="ck_macrociclo_datas_validas",
            )
        ]

    def __str__(self):
        return self.nome


class Mesociclo(models.Model):
    macrociclo = models.ForeignKey(
        Macrociclo,
        on_delete=models.PROTECT, #regra de negocio a confirmar
        related_name="mesociclos",
    )
    nome = models.CharField(max_length=255)
    data_inicio = models.DateField()
    data_fim = models.DateField()

    class Meta:
        constraints = [
            models.CheckConstraint(
                condition=Q(data_fim__gte=F("data_inicio")),
                name="ck_mesociclo_datas_validas",
            )
        ]

    def clean(self):
        super().clean()

        erros = {}

#REgras de negocio
        if self.macrociclo_id and self.data_inicio and self.data_fim:
            macrociclo = self.macrociclo

            if self.data_inicio < macrociclo.data_inicio:
                erros["data_inicio"] = (
                    "O mesociclo não pode começar antes do macrociclo."
                )

            if self.data_fim > macrociclo.data_fim:
                erros["data_fim"] = (
                    "O mesociclo não pode terminar depois do macrociclo."
                )

        if erros:
            raise ValidationError(erros)

    def __str__(self):
        return self.nome


class Microciclo(models.Model):
    mesociclo = models.ForeignKey(
        Mesociclo,
        on_delete=models.PROTECT, #regra de negocio a confirmar
        related_name="microciclos",
    )
    nome = models.CharField(max_length=255)
    data_inicio = models.DateField()
    data_fim = models.DateField()

    class Meta:
        constraints = [
            models.CheckConstraint(
                condition=Q(data_fim__gte=F("data_inicio")),
                name="ck_microciclo_datas_validas",
            )
        ]

    def __str__(self):
        return self.nome