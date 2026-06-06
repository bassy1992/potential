from django.contrib import admin
from django.utils.html import format_html
from .models import Property, PropertyImage


class PropertyImageInline(admin.TabularInline):
    model = PropertyImage
    extra = 1


@admin.register(Property)
class PropertyAdmin(admin.ModelAdmin):
    list_display = ['title', 'property_type', 'status', 'price', 'city', 'state', 'bedrooms', 'bathrooms', 'featured', 'created_at']
    list_filter = ['property_type', 'status', 'featured', 'city', 'state']
    search_fields = ['title', 'description', 'address', 'city', 'state']
    list_editable = ['featured', 'status']
    inlines = [PropertyImageInline]

    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'description', 'property_type', 'status', 'price', 'featured')
        }),
        ('Location', {
            'fields': ('address', 'city', 'state', 'zip_code', 'country', 'latitude', 'longitude'),
            'description': 'Add latitude and longitude for Google Maps integration. Example: 5.704306, -0.014479'
        }),
        ('Land Size (for Land properties)', {
            'fields': ('land_size', 'land_size_unit'),
            'description': 'Fill in land size for land properties',
            'classes': ('collapse',),
        }),
        ('Property Details (for Houses/Apartments etc.)', {
            'fields': ('bedrooms', 'bathrooms', 'square_feet', 'lot_size', 'year_built'),
            'description': 'Bedrooms and bathrooms are optional for land properties',
        }),
        ('Features', {
            'fields': ('parking_spaces', 'has_garage', 'has_pool', 'has_garden')
        }),
    )

    readonly_fields = ['google_maps_url']

    def google_maps_url(self, obj):
        """Display Google Maps link in admin"""
        if obj.latitude and obj.longitude:
            url = f"https://maps.google.com/?q={obj.latitude},{obj.longitude}"
            return format_html('<a href="{}" target="_blank">View on Google Maps</a>', url)
        return "No coordinates set"
    google_maps_url.short_description = "Google Maps"

    def get_form(self, request, obj=None, **kwargs):
        form = super().get_form(request, obj, **kwargs)
        # Make bedrooms and bathrooms not required in the form
        if 'bedrooms' in form.base_fields:
            form.base_fields['bedrooms'].required = False
        if 'bathrooms' in form.base_fields:
            form.base_fields['bathrooms'].required = False
        return form


@admin.register(PropertyImage)
class PropertyImageAdmin(admin.ModelAdmin):
    list_display = ['property', 'caption', 'is_primary', 'created_at']
    list_filter = ['is_primary', 'created_at']
    search_fields = ['property__title', 'caption']
