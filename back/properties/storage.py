from storages.backends.s3boto3 import S3Boto3Storage


class PublicMediaStorage(S3Boto3Storage):
    """
    Custom storage backend for DigitalOcean Spaces public media files
    """
    location = 'media'
    default_acl = 'public-read'
    file_overwrite = False
