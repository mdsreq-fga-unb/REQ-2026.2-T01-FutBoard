"""Serializers da API de sessões."""

from rest_framework import serializers

from .models import (
    Sessao,
    ComportamentoTatico,
    normalizar_nome_comportamento,
)


class SessaoSerializer(serializers.ModelSerializer):
    mes = serializers.SerializerMethodField()

    class Meta:
        model = Sessao
        fields = [
            "id",
            "microciclo",
            "sequencia",
            "nome",
            "data",
            "mes",
        ]
        read_only_fields = [
            "id",
            "sequencia",
            "mes",
        ]

    def get_mes(self, obj):
        meses = [
            "Janeiro",
            "Fevereiro",
            "Março",
            "Abril",
            "Maio",
            "Junho",
            "Julho",
            "Agosto",
            "Setembro",
            "Outubro",
            "Novembro",
            "Dezembro",
        ]
        return meses[obj.data.month - 1]

    def validate(self, attrs):
        instance = self.instance

        if instance and "microciclo" in attrs:
            if attrs["microciclo"].id != instance.microciclo_id:
                raise serializers.ValidationError(
                    {"microciclo": ("Não é permitido alterar o microciclo de uma sessão.")}
                )

        data = attrs.get(
            "data",
            getattr(instance, "data", None),
        )
        microciclo = attrs.get(
            "microciclo",
            getattr(instance, "microciclo", None),
        )

        if microciclo and data:
            if data < microciclo.data_inicio:
                raise serializers.ValidationError(
                    {"data": ("A sessão não pode ocorrer antes do início do microciclo.")}
                )

            if data > microciclo.data_termino:
                raise serializers.ValidationError(
                    {"data": ("A sessão não pode ocorrer depois do término do microciclo.")}
                )

        return attrs

class ComportamentoTaticoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ComportamentoTatico
        fields = ["id", "nome"]
        read_only_fields = ["id"]

    def validate_nome(self, value):
        nome = " ".join(value.split())

        if not nome:
            raise serializers.ValidationError(
                "O nome do comportamento é obrigatório."
            )

        nome_normalizado = normalizar_nome_comportamento(nome)

        comportamentos = ComportamentoTatico.objects.filter(
            nome_normalizado=nome_normalizado
        )

        if self.instance:
            comportamentos = comportamentos.exclude(
                pk=self.instance.pk
            )

        if comportamentos.exists():
            raise serializers.ValidationError(
                "Já existe um comportamento tático com esse nome."
            )

        return nome