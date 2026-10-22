#!/usr/bin/env python
import os
import sys


def main():
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "futboard_core.settings")
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Django não foi encontrado. Instale as dependências de backend."
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == "__main__":
    main()
