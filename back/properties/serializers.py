from rest_framework import serializers
from .models import Property, PropertyImage


class PropertyImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyImage
        fields = ['id', 'image', 'caption', 'is_primary', 'created_at']


class PropertySerializer(serializers.ModelSerializer):
    images = PropertyImageSerializer(many=True, read_only=True)
    google_maps_url = serializers.ReadOnlyField()
    
    class Meta:
        model = Property
        fields = [
            'id', 'title', 'description', 'property_type', 'status', 'price',
            'address', 'city', 'state', 'zip_code', 'country',
            'latitude', 'longitude', 'google_maps_url',
            'bedrooms', 'bathrooms', 'square_feet', 'lot_size', 'year_built',
            'parking_spaces', 'has_garage', 'has_pool', 'has_garden',
            'featured', 'created_at', 'updated_at', 'images'
        ]
        read_only_fields = ['created_at', 'updated_at', 'google_maps_url']


class PropertyListSerializer(serializers.ModelSerializer):
    """Lighter serializer for list views"""
    primary_image = serializers.SerializerMethodField()
    google_maps_url = serializers.ReadOnlyField()
    
    class Meta:
        model = Property
        fields = [
            'id', 'title', 'property_type', 'status', 'price',
            'city', 'state', 'bedrooms', 'bathrooms', 'square_feet',
            'latitude', 'longitude', 'google_maps_url',
            'featured', 'primary_image'
        ]
    
    def get_primary_image(self, obj):
        primary = obj.images.filter(is_primary=True).first()
        if primary:
            request = self.context.get('request')
            if request is not None:
                return request.build_absolute_uri(primary.image.url)
            return primary.image.url
        first_image = obj.images.first()
        if first_image:
            request = self.context.get('request')
            if request is not None:
                return request.build_absolute_uri(first_image.image.url)
            return first_image.image.url
        return None
