"""
Test script to check property images
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from properties.models import Property, PropertyImage

print("=" * 60)
print("Property Images Test")
print("=" * 60)

# Get all properties
properties = Property.objects.all()
print(f"\nTotal Properties: {properties.count()}")

for prop in properties:
    print(f"\n📍 Property: {prop.title} (ID: {prop.id})")
    images = prop.images.all()
    print(f"   Images: {images.count()}")
    
    for img in images:
        print(f"   {'⭐' if img.is_primary else '  '} {img.image.name}")
        print(f"      URL: {img.image.url}")
        print(f"      Primary: {img.is_primary}")

print("\n" + "=" * 60)
