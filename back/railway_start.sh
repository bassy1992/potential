#!/bin/bash

# Run migrations
python manage.py migrate --noinput

# Create superuser if environment variables are set
if [ ! -z "$DJANGO_SUPERUSER_USERNAME" ]; then
    echo "Creating superuser..."
    python create_superuser.py
fi

# Collect static files
python manage.py collectstatic --noinput

# Start the server
gunicorn config.wsgi:application --bind 0.0.0.0:$PORT
