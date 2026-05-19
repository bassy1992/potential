import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from properties.models import Property
from decimal import Decimal

# Update properties with sample coordinates
coordinates = [
    # Miami, FL
    {'id': 1, 'lat': Decimal('25.761681'), 'lng': Decimal('-80.191788')},
    # New York, NY
    {'id': 2, 'lat': Decimal('40.712776'), 'lng': Decimal('-74.005974')},
    # Austin, TX
    {'id': 3, 'lat': Decimal('30.267153'), 'lng': Decimal('-97.743057')},
    # Seattle, WA
    {'id': 4, 'lat': Decimal('47.606209'), 'lng': Decimal('-122.332069')},
    # Boston, MA
    {'id': 5, 'lat': Decimal('42.360081'), 'lng': Decimal('-71.058884')},
    # San Francisco, CA
    {'id': 6, 'lat': Decimal('37.774929'), 'lng': Decimal('-122.419418')},
    # Chicago, IL
    {'id': 7, 'lat': Decimal('41.878113'), 'lng': Decimal('-87.629799')},
    # Lake Tahoe, CA
    {'id': 8, 'lat': Decimal('39.096848'), 'lng': Decimal('-120.032351')},
]

updated_count = 0
for coord in coordinates:
    try:
        prop = Property.objects.get(id=coord['id'])
        prop.latitude = coord['lat']
        prop.longitude = coord['lng']
        prop.save()
        print(f"✅ Updated {prop.title} with coordinates: {coord['lat']}, {coord['lng']}")
        print(f"   Google Maps: {prop.google_maps_url}")
        updated_count += 1
    except Property.DoesNotExist:
        print(f"❌ Property with ID {coord['id']} not found")

print(f"\n✅ Successfully updated {updated_count} properties with coordinates!")
print("\nYou can now:")
print("1. View properties with map links in the API")
print("2. Click 'View on Google Maps' in Django admin")
print("3. Use coordinates for map integration in the frontend")
