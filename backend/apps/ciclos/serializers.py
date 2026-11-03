from rest_framework import serializers
from apps.ciclos.models import Mesociclo


class MesocicloSerializer(serializers.ModelSerializer):

    class Meta:
        model = Mesociclo
        fields = [
            "id",
            "macrociclo",
            "nome",
            "data_inicio",
            "data_fim",
        ]
        read_only_fields = ["id"]

    def validate(self, attrs):
        instance = self.instance

        macrociclo = attrs.get(
            "macrociclo",
            instance.macrociclo if instance else None
        )

        data_inicio = attrs.get(
            "data_inicio",
            instance.data_inicio if instance else None
        )

        data_fim = attrs.get(
            "data_fim",
            instance.data_fim if instance else None
        )

        if instance and "macrociclo" in attrs:
            if attrs["macrociclo"].id != instance.macrociclo_id:
                raise serializers.ValidationError({
                    "macrociclo": "Não é permitido alterar o macrociclo associado."
                })

        if data_inicio and data_fim:
            if data_fim < data_inicio:
                raise serializers.ValidationError({
                    "data_fim": "A data final não pode ser anterior à data inicial."
                })

        if macrociclo and data_inicio:
            if data_inicio < macrociclo.data_inicio:
                raise serializers.ValidationError({
                    "data_inicio": "O mesociclo não pode começar antes do macrociclo." #regra de negocio a conferir
                })

        if macrociclo and data_fim:
            if data_fim > macrociclo.data_fim:
                raise serializers.ValidationError({
                    "data_fim": "O mesociclo não pode terminar depois do macrociclo." #regra de negocio a conferir
                })

        return attrs