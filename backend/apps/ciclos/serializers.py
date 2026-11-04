"""Serializers da API de ciclos de periodização."""
from rest_framework import serializers

from .models import Macrociclo


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
                        "A data de término deve ser igual ou posterior "
                        "à data de início."
                    )
                }
            )

        return attrs