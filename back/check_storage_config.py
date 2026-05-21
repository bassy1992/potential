import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.conf import settings
from django.core.files.storage import default_storage

print("=" * 60)
print("Storage Configuration Check")
print("=" * 60)

print(f"\nUSE_DO_SPACES: {settings.USE_DO_SPACES}")
print(f"DEFAULT_FILE_STORAGE: {settings.DEFAULT_FILE_STORAGE}")
print(f"Storage class: {default_storage.__class__.__name__}")
print(f"Storage module: {default_storage.__class__.__module__}")

if settings.USE_DO_SPACES:
    print(f"\nDO Spaces Config:")
    print(f"  Bucket: {settings.AWS_STORAGE_BUCKET_NAME}")
    print(f"  Region: {settings.AWS_S3_REGION_NAME}")
    print(f"  Endpoint: {settings.AWS_S3_ENDPOINT_URL}")
    print(f"  CDN Domain: {settings.AWS_S3_CUSTOM_DOMAIN}")
    print(f"  Location: {settings.AWS_LOCATION}")
    print(f"  Default ACL: {settings.AWS_DEFAULT_ACL}")
    
    # Check storage attributes
    print(f"\nStorage Backend Attributes:")
    if hasattr(default_storage, 'location'):
        print(f"  location: {default_storage.location}")
    if hasattr(default_storage, 'default_acl'):
        print(f"  default_acl: {default_storage.default_acl}")
    if hasattr(default_storage, 'bucket_name'):
        print(f"  bucket_name: {default_storage.bucket_name}")

print("\n" + "=" * 60)
