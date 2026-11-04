"""Serializers da API de ciclos de periodização."""

from rest_framework import serializers

from .models import Macrociclo, Mesociclo, Microciclo


class MacrocicloSerializer(serializers.ModelSerializer):
    """Converte macrociclos entre objetos Django e JSON da API."""

    class Meta:
        model = Macrociclo
        fields = [
            "id",
            "codigo",
            "nome",
            "data_inicio",
            "data_termino",
            "criado_em",
            "atualizado_em",
        ]
        read_only_fields = [
            "id",
            "codigo",
            "criado_em",
            "atualizado_em",
        ]

    def validate(self, attrs):
        """Garante que a data final não seja anterior à data inicial."""
        data_inicio = attrs.get(
            "data_inicio",
            getattr(self.instance, "data_inicio", None),
        )
        data_termino = attrs.get(
            "data_termino",
            getattr(self.instance, "data_termino", None),
        )

        if data_inicio and data_termino and data_termino < data_inicio:
            raise serializers.ValidationError(
                {
                    "data_termino": (
                        "A data de término deve ser igual ou posterior à data de início."
                    )
                }
            )

        return attrs


class MesocicloSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mesociclo
        fields = [
            "id",
            "macrociclo",
            "nome",
            "data_inicio",
            "data_termino",
        ]
        read_only_fields = ["id"]

    def validate(self, attrs):
        instance = self.instance
        macrociclo = attrs.get(
            "macrociclo",
            getattr(instance, "macrociclo", None),
        )
        data_inicio = attrs.get(
            "data_inicio",
            getattr(instance, "data_inicio", None),
        )
        data_termino = attrs.get(
            "data_termino",
            getattr(instance, "data_termino", None),
        )

        if instance and "macrociclo" in attrs:
            if attrs["macrociclo"].id != instance.macrociclo_id:
                raise serializers.ValidationError(
                    {"macrociclo": "Não é permitido alterar o macrociclo associado."}
                )

        if data_inicio and data_termino and data_termino < data_inicio:
            raise serializers.ValidationError(
                {"data_termino": "A data de término não pode ser anterior à inicial."}
            )

        if macrociclo and data_inicio and data_inicio < macrociclo.data_inicio:
            raise serializers.ValidationError(
                {"data_inicio": "O mesociclo não pode começar antes do macrociclo."}
            )

        if macrociclo and data_termino and data_termino > macrociclo.data_termino:
            raise serializers.ValidationError(
                {"data_termino": "O mesociclo não pode terminar depois do macrociclo."}
            )

        return attrs


class MicrocicloSerializer(serializers.ModelSerializer):
    class Meta:
        model = Microciclo
        fields = [
            "id",
            "mesociclo",
            "nome",
            "data_inicio",
            "data_termino",
        ]
        read_only_fields = ["id"]

    def validate(self, attrs):
        instance = self.instance
        mesociclo = attrs.get(
            "mesociclo",
            getattr(instance, "mesociclo", None),
        )
        data_inicio = attrs.get(
            "data_inicio",
            getattr(instance, "data_inicio", None),
        )
        data_termino = attrs.get(
            "data_termino",
            getattr(instance, "data_termino", None),
        )

        if data_inicio and data_termino and data_termino < data_inicio:
            raise serializers.ValidationError(
                {"data_termino": "A data de término não pode ser anterior à inicial."}
            )

        if mesociclo and data_inicio and data_inicio < mesociclo.data_inicio:
            raise serializers.ValidationError(
                {"data_inicio": "O microciclo não pode começar antes do mesociclo."}
            )

        if mesociclo and data_termino and data_termino > mesociclo.data_termino:
            raise serializers.ValidationError(
                {"data_termino": "O microciclo não pode terminar depois do mesociclo."}
            )

        return attrs
