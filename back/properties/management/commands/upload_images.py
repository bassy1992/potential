import os
from django.core.management.base import BaseCommand
from django.core.files import File
from properties.models import Property, PropertyImage
from pathlib import Path


class Command(BaseCommand):
    help = 'Upload property images from local directory to DigitalOcean Spaces'

    def add_arguments(self, parser):
        parser.add_argument(
            'image_dir',
            type=str,
            help='Path to directory containing property images'
        )
        parser.add_argument(
            '--property-id',
            type=int,
            help='Specific property ID to upload images for'
        )
        parser.add_argument(
            '--set-primary',
            action='store_true',
            help='Set the first image as primary'
        )

    def handle(self, *args, **options):
        image_dir = Path(options['image_dir'])
        property_id = options.get('property_id')
        set_primary = options.get('set_primary', False)

        if not image_dir.exists():
            self.stdout.write(self.style.ERROR(f'Directory not found: {image_dir}'))
            return

        # Get properties to upload images for
        if property_id:
            properties = Property.objects.filter(id=property_id)
            if not properties.exists():
                self.stdout.write(self.style.ERROR(f'Property with ID {property_id} not found'))
                return
        else:
            properties = Property.objects.all()

        if not properties.exists():
            self.stdout.write(self.style.ERROR('No properties found in database'))
            return

        # Supported image extensions
        image_extensions = {'.jpg', '.jpeg', '.png', '.gif', '.webp'}

        # Get all image files from directory
        image_files = [
            f for f in image_dir.iterdir()
            if f.is_file() and f.suffix.lower() in image_extensions
        ]

        if not image_files:
            self.stdout.write(self.style.ERROR(f'No image files found in {image_dir}'))
            return

        self.stdout.write(self.style.SUCCESS(f'Found {len(image_files)} images'))

        # If specific property, upload all images to that property
        if property_id:
            property_obj = properties.first()
            self.stdout.write(f'\nUploading images to: {property_obj.title}')
            
            for idx, image_file in enumerate(image_files):
                self._upload_image(property_obj, image_file, is_primary=(idx == 0 and set_primary))
        else:
            # Distribute images across properties
            self.stdout.write(f'\nDistributing {len(image_files)} images across {properties.count()} properties')
            
            for idx, image_file in enumerate(image_files):
                property_obj = properties[idx % properties.count()]
                is_primary = (PropertyImage.objects.filter(property=property_obj).count() == 0 and set_primary)
                self._upload_image(property_obj, image_file, is_primary=is_primary)

        self.stdout.write(self.style.SUCCESS('\n✅ Image upload complete!'))

    def _upload_image(self, property_obj, image_file, is_primary=False):
        """Upload a single image to a property"""
        try:
            with open(image_file, 'rb') as f:
                django_file = File(f, name=image_file.name)
                
                # Create PropertyImage
                property_image = PropertyImage.objects.create(
                    property=property_obj,
                    image=django_file,
                    caption=f'{property_obj.title} - {image_file.stem}',
                    is_primary=is_primary
                )
                
                status = '⭐ PRIMARY' if is_primary else '✓'
                self.stdout.write(
                    self.style.SUCCESS(
                        f'  {status} Uploaded: {image_file.name} → {property_obj.title}'
                    )
                )
                
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'  ✗ Failed to upload {image_file.name}: {str(e)}')
            )
