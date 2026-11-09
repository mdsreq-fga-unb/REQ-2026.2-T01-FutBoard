"""Modelos de sessões e treinos."""

from django.core.exceptions import ValidationError
from django.db import models
from django.db.models import Max
import unicodedata

from apps.ciclos.models import Microciclo


class Sessao(models.Model):
    microciclo = models.ForeignKey(
        Microciclo,
        on_delete=models.PROTECT,
        related_name="sessoes",
    )
    sequencia = models.PositiveIntegerField(editable=False)
    nome = models.CharField(max_length=255)
    data = models.DateField()

    class Meta:
        ordering = ["data", "sequencia", "id"]
        constraints = [
            models.UniqueConstraint(
                fields=["microciclo", "sequencia"],
                name="unique_sessao_por_microciclo",
            ),
        ]

    def __str__(self):
        return f"Sessão {self.sequencia} - {self.nome}"

    def clean(self):
        super().clean()

        erros = {}

        if self.microciclo_id and self.data:
            if self.data < self.microciclo.data_inicio:
                erros["data"] = "A sessão não pode ocorrer antes do início do microciclo."

            if self.data > self.microciclo.data_termino:
                erros["data"] = "A sessão não pode ocorrer depois do término do microciclo."

        if erros:
            raise ValidationError(erros)

    def save(self, *args, **kwargs):
        if not self.sequencia:
            ultima_sequencia = (
                Sessao.objects.filter(microciclo=self.microciclo).aggregate(
                    maior_sequencia=Max("sequencia")
                )["maior_sequencia"]
                or 0
            )
            self.sequencia = ultima_sequencia + 1

        self.full_clean()
        super().save(*args, **kwargs)


def normalizar_nome_comportamento(nome):
    nome = " ".join(nome.split())

    nome = unicodedata.normalize("NFD", nome)

    nome = "".join(
        caractere
        for caractere in nome
        if not unicodedata.combining(caractere)
    )

    return nome.casefold()

class ComportamentoTatico(models.Model):
    nome = models.CharField(max_length=200)

    nome_normalizado = models.CharField(
        max_length=200,
        unique=True,
        editable=False,
    )

    class Meta:
        ordering = ["nome"]
        verbose_name = "comportamento tático"
        verbose_name_plural = "comportamentos táticos"

    def __str__(self):
        return self.nome

    def clean(self):
        super().clean()

        self.nome = " ".join((self.nome or "").split())

        if not self.nome:
            raise ValidationError({
                "nome": "O nome do comportamento é obrigatório."
            })

        self.nome_normalizado = normalizar_nome_comportamento(
            self.nome
        )

    def save(self, *args, **kwargs):
        self.full_clean()
        return super().save(*args, **kwargs)