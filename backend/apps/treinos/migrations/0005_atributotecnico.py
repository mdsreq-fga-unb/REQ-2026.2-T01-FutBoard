from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [("treinos", "0004_atividadesessao")]

    operations = [
        migrations.CreateModel(
            name="AtributoTecnico",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True, primary_key=True, serialize=False, verbose_name="ID"
                    ),
                ),
                ("nome", models.TextField()),
                ("chave_normalizada", models.CharField(editable=False, max_length=64, unique=True)),
            ],
            options={
                "verbose_name": "atributo técnico",
                "verbose_name_plural": "atributos técnicos",
                "ordering": ["nome", "id"],
                "constraints": [
                    models.CheckConstraint(
                        condition=~models.Q(nome=""), name="atributo_tecnico_nome_valido"
                    ),
                ],
            },
        ),
    ]
