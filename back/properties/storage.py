from storages.backends.s3boto3 import S3Boto3Storage


class PublicMediaStorage(S3Boto3Storage):
    """
    Custom storage backend for DigitalOcean Spaces that forces public-read ACL
    """
    location = 'media'
    default_acl = 'public-read'
    file_overwrite = False
    custom_domain = None
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Force public-read ACL
        self.default_acl = 'public-read'
        self.object_parameters = {
            'CacheControl': 'max-age=86400',
            'ACL': 'public-read',
        }
