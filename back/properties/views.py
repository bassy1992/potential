from rest_framework import viewsets, filters, status
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django_filters.rest_framework import DjangoFilterBackend
from decimal import Decimal
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



@api_view(['GET'])
def get_presigned_upload_url(request):
    """
    Generate a presigned URL for direct client-to-DO-Spaces upload
    GET /api/presigned-upload/?filename=image.jpg&property_id=1
    """
    from django.conf import settings
    import boto3
    import uuid

    filename = request.query_params.get('filename')
    property_id = request.query_params.get('property_id')

    if not filename or not property_id:
        return Response(
            {'error': 'filename and property_id are required'},
            status=status.HTTP_400_BAD_REQUEST
        )

    if not settings.USE_DO_SPACES:
        return Response(
            {'error': 'DO Spaces not configured'},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Generate unique filename
    ext = filename.rsplit('.', 1)[-1].lower()
    unique_filename = f"property_images/property_{property_id}_{uuid.uuid4().hex}.{ext}"

    # Create S3 client
    session = boto3.session.Session()
    client = session.client(
        's3',
        region_name=settings.AWS_S3_REGION_NAME,
        endpoint_url=settings.AWS_S3_ENDPOINT_URL,
        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
    )

    # Generate presigned POST URL
    presigned = client.generate_presigned_post(
        Bucket=settings.AWS_STORAGE_BUCKET_NAME,
        Key=f"media/{unique_filename}",
        Fields={
            'acl': 'public-read',
            'Content-Type': f'image/{ext}',
        },
        Conditions=[
            {'acl': 'public-read'},
            ['starts-with', '$Content-Type', 'image/'],
            ['content-length-range', 1, 10 * 1024 * 1024],  # max 10MB
        ],
        ExpiresIn=3600
    )

    # The final public URL of the uploaded file
    public_url = f"https://{settings.AWS_STORAGE_BUCKET_NAME}.{settings.AWS_S3_REGION_NAME}.digitaloceanspaces.com/media/{unique_filename}"

    return Response({
        'upload_url': presigned['url'],
        'fields': presigned['fields'],
        'public_url': public_url,
        'key': f"media/{unique_filename}",
    })


@api_view(['POST'])
def register_uploaded_image(request):
    """
    Register an image that was directly uploaded to DO Spaces
    POST /api/register-image/
    Body: { property_id, image_url, caption, is_primary }
    """
    property_id = request.data.get('property_id')
    image_url = request.data.get('image_url')
    caption = request.data.get('caption', '')
    is_primary = request.data.get('is_primary', False)

    if not property_id or not image_url:
        return Response(
            {'error': 'property_id and image_url are required'},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        property_obj = Property.objects.get(id=property_id)
    except Property.DoesNotExist:
        return Response({'error': 'Property not found'}, status=status.HTTP_404_NOT_FOUND)

    # If primary, unset others
    if is_primary:
        PropertyImage.objects.filter(property=property_obj, is_primary=True).update(is_primary=False)

    # If no images yet, make this primary
    if not PropertyImage.objects.filter(property=property_obj).exists():
        is_primary = True

    # Save the image URL directly (not as a file field)
    from django.db import connection
    with connection.cursor() as cursor:
        cursor.execute(
            "INSERT INTO properties_propertyimage (property_id, image, caption, is_primary, created_at) VALUES (%s, %s, %s, %s, NOW())",
            [property_id, f"property_images/{image_url.split('property_images/')[-1]}", caption, is_primary]
        )

    return Response({
        'message': 'Image registered successfully',
        'image_url': image_url,
        'is_primary': is_primary,
    }, status=status.HTTP_201_CREATED)


@api_view(['GET'])
def check_storage_config(request):
    """
    Check storage configuration
    GET /api/check-storage/
    """
    from django.conf import settings
    import os
    
    # Try to test boto3 connection
    boto3_test = "Not tested"
    try:
        import boto3
        from botocore.exceptions import ClientError
        
        client = boto3.client(
            's3',
            region_name=settings.AWS_S3_REGION_NAME if settings.USE_DO_SPACES else None,
            endpoint_url=settings.AWS_S3_ENDPOINT_URL if settings.USE_DO_SPACES else None,
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID if settings.USE_DO_SPACES else None,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY if settings.USE_DO_SPACES else None
        )
        
        if settings.USE_DO_SPACES:
            response = client.list_objects_v2(
                Bucket=settings.AWS_STORAGE_BUCKET_NAME,
                Prefix='media/property_images/',
                MaxKeys=1
            )
            boto3_test = f"✅ Connected - Found {len(response.get('Contents', []))} objects"
        else:
            boto3_test = "Skipped - USE_DO_SPACES is False"
    except Exception as e:
        boto3_test = f"❌ Error: {str(e)}"
    
    return Response({
        'USE_DO_SPACES': settings.USE_DO_SPACES,
        'USE_DO_SPACES_env': os.environ.get('USE_DO_SPACES'),
        'AWS_STORAGE_BUCKET_NAME': settings.AWS_STORAGE_BUCKET_NAME if settings.USE_DO_SPACES else None,
        'AWS_S3_REGION_NAME': settings.AWS_S3_REGION_NAME if settings.USE_DO_SPACES else None,
        'DEFAULT_FILE_STORAGE': settings.DEFAULT_FILE_STORAGE if settings.USE_DO_SPACES else 'default',
        'has_access_key': bool(getattr(settings, 'AWS_ACCESS_KEY_ID', None)),
        'boto3_connection_test': boto3_test,
    })


@api_view(['POST'])
def seed_properties(request):
    """
    Seed the database with sample properties
    POST /api/seed-properties/
    """
    properties_data = [
        {
            'title': 'Luxury Modern Villa',
            'description': 'Beautiful modern villa with stunning ocean views. Features high-end finishes, smart home technology, and a private infinity pool.',
            'property_type': 'house',
            'status': 'sale',
            'price': Decimal('2500000.00'),
            'address': '123 Ocean Drive',
            'city': 'Miami',
            'state': 'Florida',
            'zip_code': '33139',
            'bedrooms': 5,
            'bathrooms': Decimal('4.5'),
            'square_feet': 4500,
            'lot_size': 8000,
            'year_built': 2022,
            'parking_spaces': 3,
            'has_garage': True,
            'has_pool': True,
            'has_garden': True,
            'featured': True,
        },
        {
            'title': 'Downtown Luxury Apartment',
            'description': 'Spacious apartment in the heart of downtown with panoramic city views. Walking distance to restaurants, shops, and entertainment.',
            'property_type': 'apartment',
            'status': 'rent',
            'price': Decimal('3500.00'),
            'address': '456 Main Street, Unit 2501',
            'city': 'New York',
            'state': 'New York',
            'zip_code': '10001',
            'bedrooms': 2,
            'bathrooms': Decimal('2.0'),
            'square_feet': 1800,
            'year_built': 2020,
            'parking_spaces': 1,
            'has_garage': True,
            'has_pool': False,
            'has_garden': False,
            'featured': True,
        },
        {
            'title': 'Charming Suburban Home',
            'description': 'Perfect family home in a quiet neighborhood with excellent schools. Updated kitchen, hardwood floors, and large backyard.',
            'property_type': 'house',
            'status': 'sale',
            'price': Decimal('650000.00'),
            'address': '789 Maple Avenue',
            'city': 'Austin',
            'state': 'Texas',
            'zip_code': '78701',
            'bedrooms': 4,
            'bathrooms': Decimal('3.0'),
            'square_feet': 2800,
            'lot_size': 6500,
            'year_built': 2015,
            'parking_spaces': 2,
            'has_garage': True,
            'has_pool': False,
            'has_garden': True,
            'featured': False,
        },
        {
            'title': 'Modern Condo with City Views',
            'description': 'Stylish condo with floor-to-ceiling windows and modern amenities. Building features gym, rooftop terrace, and concierge service.',
            'property_type': 'condo',
            'status': 'sale',
            'price': Decimal('450000.00'),
            'address': '321 Park Boulevard, #1205',
            'city': 'Seattle',
            'state': 'Washington',
            'zip_code': '98101',
            'bedrooms': 2,
            'bathrooms': Decimal('2.0'),
            'square_feet': 1400,
            'year_built': 2019,
            'parking_spaces': 1,
            'has_garage': True,
            'has_pool': False,
            'has_garden': False,
            'featured': False,
        },
        {
            'title': 'Cozy Studio Apartment',
            'description': 'Affordable studio in a great location. Perfect for students or young professionals. Close to public transportation.',
            'property_type': 'apartment',
            'status': 'rent',
            'price': Decimal('1200.00'),
            'address': '555 College Street, Apt 3B',
            'city': 'Boston',
            'state': 'Massachusetts',
            'zip_code': '02115',
            'bedrooms': 0,
            'bathrooms': Decimal('1.0'),
            'square_feet': 550,
            'year_built': 2010,
            'parking_spaces': 0,
            'has_garage': False,
            'has_pool': False,
            'has_garden': False,
            'featured': False,
        },
        {
            'title': 'Spacious Townhouse',
            'description': 'Three-story townhouse with modern design and private patio. Great for entertaining with open floor plan.',
            'property_type': 'townhouse',
            'status': 'sale',
            'price': Decimal('725000.00'),
            'address': '888 Elm Street',
            'city': 'San Francisco',
            'state': 'California',
            'zip_code': '94102',
            'bedrooms': 3,
            'bathrooms': Decimal('2.5'),
            'square_feet': 2200,
            'lot_size': 1500,
            'year_built': 2018,
            'parking_spaces': 2,
            'has_garage': True,
            'has_pool': False,
            'has_garden': True,
            'featured': True,
        },
        {
            'title': 'Prime Commercial Space',
            'description': 'High-traffic commercial property perfect for retail or office use. Ample parking and excellent visibility.',
            'property_type': 'commercial',
            'status': 'rent',
            'price': Decimal('8500.00'),
            'address': '999 Business Boulevard',
            'city': 'Chicago',
            'state': 'Illinois',
            'zip_code': '60601',
            'bedrooms': 0,
            'bathrooms': Decimal('2.0'),
            'square_feet': 3500,
            'year_built': 2016,
            'parking_spaces': 10,
            'has_garage': False,
            'has_pool': False,
            'has_garden': False,
            'featured': False,
        },
        {
            'title': 'Waterfront Estate',
            'description': 'Magnificent waterfront estate with private dock and beach access. Gourmet kitchen, wine cellar, and home theater.',
            'property_type': 'house',
            'status': 'sale',
            'price': Decimal('4200000.00'),
            'address': '100 Lakeside Drive',
            'city': 'Lake Tahoe',
            'state': 'California',
            'zip_code': '96150',
            'bedrooms': 6,
            'bathrooms': Decimal('5.5'),
            'square_feet': 6800,
            'lot_size': 15000,
            'year_built': 2021,
            'parking_spaces': 4,
            'has_garage': True,
            'has_pool': True,
            'has_garden': True,
            'featured': True,
        },
    ]
    
    created_count = 0
    existing_count = 0
    
    for prop_data in properties_data:
        property_obj, created = Property.objects.get_or_create(
            title=prop_data['title'],
            defaults=prop_data
        )
        if created:
            created_count += 1
        else:
            existing_count += 1
    
    return Response({
        'message': f'Successfully seeded properties',
        'created': created_count,
        'already_existed': existing_count,
        'total_properties': Property.objects.count()
    }, status=status.HTTP_201_CREATED)
