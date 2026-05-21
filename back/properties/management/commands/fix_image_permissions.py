from django.core.management.base import BaseCommand
from properties.models import PropertyImage
import boto3
from django.conf import settings


class Command(BaseCommand):
    help = 'Fix permissions for existing images in DigitalOcean Spaces'

    def handle(self, *args, **options):
        if not settings.USE_DO_SPACES:
            self.stdout.write(self.style.ERROR('DO Spaces is not enabled'))
            return

        self.stdout.write("Fixing image permissions in DigitalOcean Spaces...")
        
        # Initialize S3 client
        s3_client = boto3.client(
            's3',
            region_name=settings.AWS_S3_REGION_NAME,
            endpoint_url=settings.AWS_S3_ENDPOINT_URL,
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY
        )
        
        images = PropertyImage.objects.all()
        self.stdout.write(f"Found {images.count()} images")
        
        fixed_count = 0
        for img in images:
            try:
                # Get the object key (file path in bucket)
                key = f"{settings.AWS_LOCATION}/{img.image.name}"
                
                # Copy object to itself with public-read ACL
                s3_client.copy_object(
                    Bucket=settings.AWS_STORAGE_BUCKET_NAME,
                    CopySource={'Bucket': settings.AWS_STORAGE_BUCKET_NAME, 'Key': key},
                    Key=key,
                    ACL='public-read',
                    MetadataDirective='COPY'
                )
                
                self.stdout.write(self.style.SUCCESS(f'✓ Fixed: {img.image.name}'))
                fixed_count += 1
                
            except Exception as e:
                self.stdout.write(self.style.ERROR(f'✗ Failed: {img.image.name} - {str(e)}'))
        
        self.stdout.write(self.style.SUCCESS(f'\n✅ Fixed {fixed_count}/{images.count()} images'))
