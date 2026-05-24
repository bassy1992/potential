from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django_filters.rest_framework import DjangoFilterBackend
from .models import Property, PropertyImage
from .serializers import PropertySerializer, PropertyListSerializer, PropertyImageSerializer


class PropertyViewSet(viewsets.ModelViewSet):
    queryset = Property.objects.all()
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['property_type', 'status', 'city', 'state', 'bedrooms', 'bathrooms']
    search_fields = ['title', 'description', 'address', 'city', 'state']
    ordering_fields = ['price', 'created_at', 'bedrooms', 'bathrooms', 'square_feet']
    ordering = ['-created_at']
    parser_classes = [MultiPartParser, FormParser]
    
    def get_serializer_class(self):
        if self.action == 'list':
            return PropertyListSerializer
        return PropertySerializer
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Get featured properties"""
        featured_properties = self.queryset.filter(featured=True)
        serializer = self.get_serializer(featured_properties, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def for_sale(self, request):
        """Get properties for sale"""
        for_sale = self.queryset.filter(status='sale')
        page = self.paginate_queryset(for_sale)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(for_sale, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def for_rent(self, request):
        """Get properties for rent"""
        for_rent = self.queryset.filter(status='rent')
        page = self.paginate_queryset(for_rent)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(for_rent, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'], parser_classes=[MultiPartParser, FormParser])
    def upload_image(self, request, pk=None):
        """
        Upload an image for a specific property
        POST /api/properties/{id}/upload_image/
        Body: multipart/form-data with 'image' file and optional 'caption' and 'is_primary'
        """
        property_obj = self.get_object()
        
        image_file = request.FILES.get('image')
        if not image_file:
            return Response(
                {'error': 'No image file provided'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get optional fields
        caption = request.data.get('caption', '')
        is_primary = request.data.get('is_primary', 'false').lower() == 'true'
        
        # If this is set as primary, unset other primary images
        if is_primary:
            PropertyImage.objects.filter(property=property_obj, is_primary=True).update(is_primary=False)
        
        # If no images exist yet, make this the primary image
        if not PropertyImage.objects.filter(property=property_obj).exists():
            is_primary = True
        
        # Create the property image
        property_image = PropertyImage.objects.create(
            property=property_obj,
            image=image_file,
            caption=caption,
            is_primary=is_primary
        )
        
        serializer = PropertyImageSerializer(property_image, context={'request': request})
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['post'], parser_classes=[MultiPartParser, FormParser])
    def upload_images(self, request, pk=None):
        """
        Upload multiple images for a specific property
        POST /api/properties/{id}/upload_images/
        Body: multipart/form-data with multiple 'images' files
        """
        property_obj = self.get_object()
        
        images = request.FILES.getlist('images')
        if not images:
            return Response(
                {'error': 'No image files provided'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        uploaded_images = []
        
        for idx, image_file in enumerate(images):
            # First image is primary if no images exist
            is_primary = idx == 0 and not PropertyImage.objects.filter(property=property_obj).exists()
            
            property_image = PropertyImage.objects.create(
                property=property_obj,
                image=image_file,
                caption=f'{property_obj.title} - Image {idx + 1}',
                is_primary=is_primary
            )
            uploaded_images.append(property_image)
        
        serializer = PropertyImageSerializer(uploaded_images, many=True, context={'request': request})
        return Response({
            'message': f'Successfully uploaded {len(uploaded_images)} images',
            'images': serializer.data
        }, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['delete'])
    def delete_image(self, request, pk=None):
        """
        Delete a specific image from a property
        DELETE /api/properties/{property_id}/delete_image/?image_id={image_id}
        """
        property_obj = self.get_object()
        image_id = request.query_params.get('image_id')
        
        if not image_id:
            return Response(
                {'error': 'image_id parameter is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            property_image = PropertyImage.objects.get(id=image_id, property=property_obj)
            property_image.delete()
            return Response(
                {'message': 'Image deleted successfully'},
                status=status.HTTP_200_OK
            )
        except PropertyImage.DoesNotExist:
            return Response(
                {'error': 'Image not found'},
                status=status.HTTP_404_NOT_FOUND
            )
