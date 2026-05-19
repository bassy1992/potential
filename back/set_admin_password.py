import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth.models import User

# Get or create admin user
try:
    admin = User.objects.get(username='admin')
    admin.set_password('admin123')
    admin.save()
    print("✅ Admin password set successfully!")
    print("Username: admin")
    print("Password: admin123")
except User.DoesNotExist:
    admin = User.objects.create_superuser('admin', 'admin@example.com', 'admin123')
    print("✅ Admin superuser created successfully!")
    print("Username: admin")
    print("Password: admin123")
