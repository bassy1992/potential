from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PropertyViewSet, seed_properties, check_storage_config, get_presigned_upload_url, register_uploaded_image

router = DefaultRouter()
router.register(r'properties', PropertyViewSet, basename='property')

urlpatterns = [
    path('', include(router.urls)),
    path('seed-properties/', seed_properties, name='seed-properties'),
    path('check-storage/', check_storage_config, name='check-storage'),
    path('presigned-upload/', get_presigned_upload_url, name='presigned-upload'),
    path('register-image/', register_uploaded_image, name='register-image'),
]
