# How to Add Map Links to Properties 🗺️

This guide shows you how to add Google Maps links to your properties so they appear on the frontend.

## ✅ What You'll See on Frontend

Each property card now has a **"View on Map"** button:
- Red outlined button below the price
- Click to open Google Maps in a new tab
- Shows exact property location
- Works on both homepage and properties page

## 📍 Method 1: Using Django Admin (Easiest)

### Step 1: Login to Admin
1. Go to: http://localhost:8000/admin/
2. Username: `admin`
3. Password: `admin123`

### Step 2: Edit a Property
1. Click on **"Properties"** in the left menu
2. Click on any property to edit it
3. Scroll to the **"Location"** section

### Step 3: Get Coordinates from Google Maps
1. Open a new tab: https://maps.google.com/
2. Search for the property address or location
3. **Right-click** on the exact location on the map
4. Click on the **coordinates** (e.g., "5.704306, -0.014479")
5. Coordinates are now copied to your clipboard!

### Step 4: Add Coordinates to Property
1. Back in Django admin, in the Location section:
   - **Latitude**: Paste the first number (e.g., `5.704306`)
   - **Longitude**: Paste the second number (e.g., `-0.014479`)
2. Click **"Save"** at the bottom

### Step 5: View on Frontend
1. Go to: http://localhost:8080/properties
2. Find your property
3. You'll see the **"View on Map"** button!
4. Click it to open Google Maps

## 📍 Method 2: Quick Coordinate Examples

Here are coordinates for popular locations you can use:

### Ghana (Accra)
- **Accra Mall**: `5.604469, -0.168959`
- **Kotoka Airport**: `5.605186, -0.166786`
- **Labadi Beach**: `5.548611, -0.145833`
- **University of Ghana**: `5.651389, -0.186944`
- **Achimota**: `5.704306, -0.014479`

### USA
- **New York, Times Square**: `40.758896, -73.985130`
- **Los Angeles, Hollywood**: `34.092809, -118.328661`
- **Miami Beach**: `25.790654, -80.130045`
- **Chicago Downtown**: `41.878113, -87.629799`

### UK
- **London, Big Ben**: `51.500729, -0.124625`
- **Manchester City Centre**: `53.483959, -2.244644`

### Other
- **Paris, Eiffel Tower**: `48.858370, 2.294481`
- **Dubai, Burj Khalifa**: `25.197197, 55.274376`
- **Tokyo, Shibuya**: `35.661777, 139.704051`

## 📍 Method 3: Using API (For Developers)

### Update Property via API
```bash
# Update property with coordinates
curl -X PATCH http://localhost:8000/api/properties/1/ \
  -H "Content-Type: application/json" \
  -d '{
    "latitude": 5.704306,
    "longitude": -0.014479
  }'
```

### Create New Property with Coordinates
```bash
curl -X POST http://localhost:8000/api/properties/ \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Beautiful Villa in Accra",
    "description": "Stunning property with ocean views",
    "property_type": "house",
    "status": "sale",
    "price": "500000",
    "address": "123 Main Street",
    "city": "Accra",
    "state": "Greater Accra",
    "zip_code": "00233",
    "country": "Ghana",
    "latitude": 5.704306,
    "longitude": -0.014479,
    "bedrooms": 4,
    "bathrooms": 3,
    "square_feet": 2500
  }'
```

## 🎯 Understanding Coordinates

### Latitude (North/South)
- **Positive numbers**: North of equator (e.g., USA, Europe)
- **Negative numbers**: South of equator (e.g., Australia, South Africa)
- **Range**: -90 to +90

### Longitude (East/West)
- **Positive numbers**: East of Prime Meridian (e.g., Asia, Africa)
- **Negative numbers**: West of Prime Meridian (e.g., Americas)
- **Range**: -180 to +180

### Example
```
Accra, Ghana: 5.704306, -0.014479
         ↑           ↑
    Latitude    Longitude
    (North)     (West of Prime Meridian)
```

## 🔍 How to Find Coordinates for Any Location

### Method A: Google Maps (Desktop)
1. Go to https://maps.google.com/
2. Search for the address
3. Right-click on the location
4. Click the coordinates to copy them

### Method B: Google Maps (Mobile)
1. Open Google Maps app
2. Long-press on the location
3. Coordinates appear at the top
4. Tap to copy

### Method C: From Address Bar
1. Go to https://maps.google.com/
2. Search for the address
3. Look at the URL in the address bar
4. Coordinates are in the URL: `@5.704306,-0.014479`

## ✅ Verification

### Check if Coordinates are Saved
1. Go to: http://localhost:8000/api/properties/
2. Look for your property in the JSON response
3. Check for:
   ```json
   {
     "latitude": "5.704306",
     "longitude": "-0.014479",
     "google_maps_url": "https://maps.google.com/?q=5.704306,-0.014479"
   }
   ```

### Check Frontend Display
1. Go to: http://localhost:8080/properties
2. Find your property card
3. Look for the **"View on Map"** button
4. Click it - should open Google Maps

## 🎨 Button Appearance

The "View on Map" button:
- **Color**: Red outline (matches your brand)
- **Icon**: Map icon (📍)
- **Text**: "View on Map"
- **Hover**: Fills with red background, white text
- **Location**: Below the price on each property card
- **Action**: Opens Google Maps in new tab

## 📝 Bulk Update Script

If you want to update multiple properties at once, create a Python script:

```python
# bulk_update_coordinates.py
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from properties.models import Property
from decimal import Decimal

# Your properties with coordinates
properties_data = [
    {'id': 1, 'lat': Decimal('5.604469'), 'lng': Decimal('-0.168959')},
    {'id': 2, 'lat': Decimal('5.651389'), 'lng': Decimal('-0.186944')},
    # Add more...
]

for data in properties_data:
    prop = Property.objects.get(id=data['id'])
    prop.latitude = data['lat']
    prop.longitude = data['lng']
    prop.save()
    print(f"✅ Updated {prop.title}")
```

Run it:
```bash
cd back
.\venv\Scripts\activate
python bulk_update_coordinates.py
```

## 🚀 Pro Tips

### 1. Accurate Placement
- Zoom in close on Google Maps before getting coordinates
- Place the pin exactly on the building/property
- More accurate = better user experience

### 2. Test the Link
- After adding coordinates, click "View on Map" in admin
- Verify it opens the correct location
- Adjust if needed

### 3. Mobile Friendly
- The map links work great on mobile
- Opens Google Maps app if installed
- Provides navigation options

### 4. Privacy Considerations
- For exact addresses, use precise coordinates
- For general areas, use approximate coordinates
- Consider privacy for residential properties

## ❓ Troubleshooting

### Button Not Showing?
- Check if property has coordinates in database
- Visit: http://localhost:8000/api/properties/[ID]/
- Look for `google_maps_url` field

### Wrong Location?
- Verify latitude and longitude are correct
- Check you didn't swap them (latitude first, longitude second)
- Make sure decimal point is included

### Map Opens Wrong Location?
- Double-check the coordinates in admin
- Ensure no extra spaces or characters
- Use 6 decimal places for accuracy

## 🎉 You're Done!

Now you can:
1. ✅ Add coordinates to any property via Django admin
2. ✅ See "View on Map" button on frontend
3. ✅ Click to open Google Maps
4. ✅ Show exact property locations to users

**Admin Panel**: http://localhost:8000/admin/
**Frontend**: http://localhost:8080/properties

Happy mapping! 🗺️🏠
