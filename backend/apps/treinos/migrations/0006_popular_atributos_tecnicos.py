import hashlib
import unicodedata

from django.db import migrations


def preparar_nome(valor):
    # Normalização congelada para que a migração independa de mudanças nos modelos.
    if not isinstance(valor, str):
        return None
    nome = " ".join(valor.split())
    decomposto = unicodedata.normalize("NFD", nome)
    normalizado = "".join(c for c in decomposto if not unicodedata.combining(c)).casefold()
    if not normalizado or "\0" in nome:
        return None
    try:
        chave = hashlib.sha256(normalizado.encode("utf-8")).hexdigest()
    except UnicodeEncodeError:
        return None
    return nome, chave


def popular_atributos_tecnicos(apps, schema_editor):
    alias = schema_editor.connection.alias
    catalogo = apps.get_model("treinos", "AtributoTecnico")
    atributos = catalogo.objects.using(alias)
    tamanho_lote = 500
    lote = {}

    for modelo in ("AtividadeBiblioteca", "AtividadeSessao"):
        atividade = apps.get_model("treinos", modelo)
        listas = (
            atividade.objects.using(alias)
            .order_by("pk")
            .values_list("atributos_tecnicos", flat=True)
            .iterator(chunk_size=tamanho_lote)
        )
        for valores in listas:
            if not isinstance(valores, list):
                continue
            for valor in valores:
                preparado = preparar_nome(valor)
                if preparado is None:
                    continue
                nome, chave = preparado
                lote.setdefault(chave, catalogo(nome=nome, chave_normalizada=chave))
                if len(lote) == tamanho_lote:
                    atributos.bulk_create(lote.values(), ignore_conflicts=True)
                    lote.clear()

    atributos.bulk_create(lote.values(), ignore_conflicts=True)


class Migration(migrations.Migration):
    dependencies = [("treinos", "0005_atributotecnico")]

    operations = [
        migrations.RunPython(popular_atributos_tecnicos, reverse_code=migrations.RunPython.noop),
    ]
