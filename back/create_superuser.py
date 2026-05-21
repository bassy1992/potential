import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth.models import User

# Create superuser with environment variables or defaults
username = os.environ.get('DJANGO_SUPERUSER_USERNAME', 'admin')
email = os.environ.get('DJANGO_SUPERUSER_EMAIL', 'admin@example.com')
password = os.environ.get('DJANGO_SUPERUSER_PASSWORD', 'admin123')

try:
    if User.objects.filter(username=username).exists():
        print(f"⚠️  User '{username}' already exists!")
        user = User.objects.get(username=username)
        user.set_password(password)
        user.save()
        print(f"✅ Password updated for user '{username}'")
    else:
        User.objects.create_superuser(username, email, password)
        print(f"✅ Superuser '{username}' created successfully!")
    
    print(f"\nCredentials:")
    print(f"Username: {username}")
    print(f"Email: {email}")
    print(f"Password: {password}")
    
except Exception as e:
    print(f"❌ Error: {e}")
