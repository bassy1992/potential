from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
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
