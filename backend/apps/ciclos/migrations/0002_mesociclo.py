from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("ciclos", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="Mesociclo",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("nome", models.CharField(max_length=255)),
                ("data_inicio", models.DateField()),
                ("data_termino", models.DateField()),
                (
                    "macrociclo",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.PROTECT,
                        related_name="mesociclos",
                        to="ciclos.macrociclo",
                    ),
                ),
            ],
        ),
        migrations.AddConstraint(
            model_name="mesociclo",
            constraint=models.CheckConstraint(
                condition=models.Q(
                    ("data_termino__gte", models.F("data_inicio"))
                ),
                name="ck_mesociclo_datas_validas",
            ),
        ),
    ]
