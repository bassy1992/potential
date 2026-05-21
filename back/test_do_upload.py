"""
Test DO Spaces upload from Railway
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.core.files.base import ContentFile
from django.core.files.storage import default_storage
from django.conf import settings

print("=" * 60)
print("DigitalOcean Spaces Upload Test")
print("=" * 60)

print(f"\nUSE_DO_SPACES: {settings.USE_DO_SPACES}")
print(f"Storage Backend: {settings.DEFAULT_FILE_STORAGE}")

if settings.USE_DO_SPACES:
    print(f"Bucket: {settings.AWS_STORAGE_BUCKET_NAME}")
    print(f"Region: {settings.AWS_S3_REGION_NAME}")
    print(f"Endpoint: {settings.AWS_S3_ENDPOINT_URL}")
    print(f"CDN Domain: {settings.AWS_S3_CUSTOM_DOMAIN}")

print("\n🧪 Testing file upload...")

try:
    # Create a test file
    test_content = b"Test image content"
    test_file = ContentFile(test_content, name='test_upload.txt')
    
    # Upload to storage
    file_path = default_storage.save('property_images/test_upload.txt', test_file)
    
    print(f"✅ File uploaded successfully!")
    print(f"   Path: {file_path}")
    print(f"   URL: {default_storage.url(file_path)}")
    
    # Try to access the URL
    full_url = default_storage.url(file_path)
    print(f"\n🔗 Test this URL in your browser:")
    print(f"   {full_url}")
    
    # Clean up
    default_storage.delete(file_path)
    print(f"\n🗑️  Test file deleted")
    
except Exception as e:
    print(f"❌ Upload failed: {str(e)}")
    import traceback
    traceback.print_exc()

print("\n" + "=" * 60)
