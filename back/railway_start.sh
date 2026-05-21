#!/bin/bash

# Run migrations
python manage.py migrate --noinput

# Create superuser using management command
python manage.py ensure_superuser

# Collect static files
python manage.py collectstatic --noinput

# Start the server
gunicorn config.wsgi:application --bind 0.0.0.0:$PORT
