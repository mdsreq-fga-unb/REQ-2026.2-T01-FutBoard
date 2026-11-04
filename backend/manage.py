#!/usr/bin/env python
"""Utilitário de linha de comando do Django para tarefas administrativas do FutBoard."""
import os
import sys


def main() -> None:
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "futboard_core.settings")
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Django não foi encontrado. Certifique-se de que o ambiente virtual está ativo "
            "e que as dependências de backend foram instaladas."
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == "__main__":
    main()
