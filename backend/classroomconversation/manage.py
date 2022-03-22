#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys


def main():
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'classroomconversation.settings')

    from django.conf import settings

    if settings.DEBUG:
        if os.environ.get('RUN_MAIN') or os.environ.get('WERKZEUG_RUN_MAIN'):
            try:
                import debugpy
                debugpy.listen(("0.0.0.0", 5678))
                print('Attached!')
            except:
                print("Failed to enable remote debugger. Importing 'debugpy' failed")

    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    print(f"Launching with {sys.argv}")
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
