from storages.backends.s3boto3 import S3Boto3Storage
from django.conf import settings


class MediaStorage(S3Boto3Storage):
    """
    Custom storage backend for DigitalOcean Spaces
    """
    location = 'media'
    default_acl = 'public-read'
    file_overwrite = False
    custom_domain = False  # Will be set in __init__
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if hasattr(settings, 'AWS_S3_CUSTOM_DOMAIN'):
            self.custom_domain = settings.AWS_S3_CUSTOM_DOMAIN


class PublicMediaStorage(S3Boto3Storage):
    """
    Custom storage backend for DigitalOcean Spaces that forces public-read ACL
    """
    location = settings.AWS_LOCATION
    default_acl = 'public-read'
    file_overwrite = False
    custom_domain = settings.AWS_S3_CUSTOM_DOMAIN
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Force public-read ACL
        self.default_acl = 'public-read'
        self.object_parameters = {
            'CacheControl': 'max-age=86400',
            'ACL': 'public-read',
        }
