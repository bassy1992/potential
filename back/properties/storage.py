from storages.backends.s3boto3 import S3Boto3Storage


class PublicMediaStorage(S3Boto3Storage):
    """
    Custom storage backend for DigitalOcean Spaces public media files.
    Uses virtual-hosted style URLs: https://bucket.region.digitaloceanspaces.com/
    """
    location = 'media'
    default_acl = 'public-read'
    file_overwrite = False

    @property
    def querystring_auth(self):
        return False
