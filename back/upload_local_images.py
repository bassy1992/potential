"""
Simple script to upload property images from local PC to DigitalOcean Spaces
Run this script from the back directory: python upload_local_images.py
"""

import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.core.files import File
from properties.models import Property, PropertyImage
from pathlib import Path


def upload_images_from_folder(folder_path, property_id=None):
    """
    Upload all images from a folder to properties
    
    Args:
        folder_path: Path to folder containing images
        property_id: Optional - specific property ID to upload to
    """
    folder = Path(folder_path)
    
    if not folder.exists():
        print(f"❌ Folder not found: {folder_path}")
        return
    
    # Get image files
    image_extensions = {'.jpg', '.jpeg', '.png', '.gif', '.webp'}
    image_files = [
        f for f in folder.iterdir()
        if f.is_file() and f.suffix.lower() in image_extensions
    ]
    
    if not image_files:
        print(f"❌ No images found in {folder_path}")
        return
    
    print(f"📁 Found {len(image_files)} images in {folder_path}")
    
    # Get properties
    if property_id:
        properties = Property.objects.filter(id=property_id)
        if not properties.exists():
            print(f"❌ Property with ID {property_id} not found")
            return
        print(f"📍 Uploading to property: {properties.first().title}")
    else:
        properties = Property.objects.all()
        if not properties.exists():
            print("❌ No properties found. Please create properties first.")
            return
        print(f"📍 Found {properties.count()} properties")
    
    # Upload images
    uploaded_count = 0
    for idx, image_file in enumerate(image_files):
        try:
            # Select property (round-robin if no specific property)
            if property_id:
                property_obj = properties.first()
            else:
                property_obj = properties[idx % properties.count()]
            
            # Check if this is the first image for this property
            is_primary = PropertyImage.objects.filter(property=property_obj).count() == 0
            
            # Upload image
            with open(image_file, 'rb') as f:
                django_file = File(f, name=image_file.name)
                
                property_image = PropertyImage.objects.create(
                    property=property_obj,
                    image=django_file,
                    caption=f'{property_obj.title}',
                    is_primary=is_primary
                )
                
                status = '⭐ PRIMARY' if is_primary else '✅'
                print(f"{status} Uploaded: {image_file.name} → {property_obj.title}")
                uploaded_count += 1
                
        except Exception as e:
            print(f"❌ Failed to upload {image_file.name}: {str(e)}")
    
    print(f"\n✅ Successfully uploaded {uploaded_count}/{len(image_files)} images!")
    print(f"🌐 Images are now stored in DigitalOcean Spaces")


if __name__ == "__main__":
    print("=" * 60)
    print("Property Image Uploader - DigitalOcean Spaces")
    print("=" * 60)
    
    # Example usage - modify these paths
    print("\nUsage Examples:")
    print("1. Upload all images from a folder (distributed across all properties):")
    print('   folder_path = r"C:\\Users\\YourName\\Pictures\\Properties"')
    print('   upload_images_from_folder(folder_path)')
    print("\n2. Upload images to a specific property:")
    print('   upload_images_from_folder(folder_path, property_id=1)')
    
    # CONFIGURE YOUR UPLOAD HERE:
    # Uncomment and modify the line below with your image folder path
    
    # folder_path = r"C:\Users\Comme\Pictures\Properties"
    # upload_images_from_folder(folder_path)
    
    # Or upload to specific property:
    # upload_images_from_folder(folder_path, property_id=1)
    
    print("\n⚠️  Please edit this script and uncomment the upload line above")
    print("=" * 60)
