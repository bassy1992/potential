from django.core.management.base import BaseCommand
from properties.models import Property, PropertyImage


class Command(BaseCommand):
    help = 'Check property images configuration'

    def handle(self, *args, **options):
        self.stdout.write("=" * 60)
        self.stdout.write("Property Images Diagnostic")
        self.stdout.write("=" * 60)
        
        properties = Property.objects.all()
        self.stdout.write(f"\n📊 Total Properties: {properties.count()}")
        
        total_images = PropertyImage.objects.count()
        self.stdout.write(f"📊 Total Images: {total_images}")
        
        if total_images == 0:
            self.stdout.write(self.style.WARNING("\n⚠️  No images found in database!"))
            self.stdout.write("   Upload images via Django Admin or use:")
            self.stdout.write("   python manage.py upload_images <folder_path>")
            return
        
        self.stdout.write("\n" + "-" * 60)
        
        for prop in properties:
            images = prop.images.all()
            if images.exists():
                self.stdout.write(f"\n📍 {prop.title} (ID: {prop.id})")
                self.stdout.write(f"   Total Images: {images.count()}")
                
                for img in images:
                    primary_mark = "⭐ PRIMARY" if img.is_primary else "  "
                    self.stdout.write(f"   {primary_mark}")
                    self.stdout.write(f"      File: {img.image.name}")
                    self.stdout.write(f"      URL: {img.image.url}")
        
        # Check for properties without images
        props_without_images = properties.filter(images__isnull=True)
        if props_without_images.exists():
            self.stdout.write(self.style.WARNING(f"\n⚠️  {props_without_images.count()} properties have no images:"))
            for prop in props_without_images:
                self.stdout.write(f"   - {prop.title} (ID: {prop.id})")
        
        self.stdout.write("\n" + "=" * 60)
