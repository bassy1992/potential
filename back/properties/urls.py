from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PropertyViewSet, seed_properties, check_storage_config

router = DefaultRouter()
router.register(r'properties', PropertyViewSet, basename='property')

urlpatterns = [
    path('', include(router.urls)),
    path('seed-properties/', seed_properties, name='seed-properties'),
    path('check-storage/', check_storage_config, name='check-storage'),
]
