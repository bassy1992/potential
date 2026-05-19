"""
Simple script to test the API endpoints
Run this after starting the Django server
"""
import requests
import json

BASE_URL = 'http://localhost:8000/api'

def test_endpoints():
    print("Testing Real Estate API Endpoints\n")
    print("=" * 50)
    
    # Test 1: Get all properties
    print("\n1. GET /api/properties/")
    response = requests.get(f'{BASE_URL}/properties/')
    if response.status_code == 200:
        data = response.json()
        print(f"✓ Success! Found {data.get('count', 0)} properties")
        if data.get('results'):
            print(f"  First property: {data['results'][0]['title']}")
    else:
        print(f"✗ Failed with status {response.status_code}")
    
    # Test 2: Get featured properties
    print("\n2. GET /api/properties/featured/")
    response = requests.get(f'{BASE_URL}/properties/featured/')
    if response.status_code == 200:
        data = response.json()
        print(f"✓ Success! Found {len(data)} featured properties")
        for prop in data:
            print(f"  - {prop['title']}")
    else:
        print(f"✗ Failed with status {response.status_code}")
    
    # Test 3: Get properties for sale
    print("\n3. GET /api/properties/for_sale/")
    response = requests.get(f'{BASE_URL}/properties/for_sale/')
    if response.status_code == 200:
        data = response.json()
        print(f"✓ Success! Found {data.get('count', 0)} properties for sale")
    else:
        print(f"✗ Failed with status {response.status_code}")
    
    # Test 4: Get properties for rent
    print("\n4. GET /api/properties/for_rent/")
    response = requests.get(f'{BASE_URL}/properties/for_rent/')
    if response.status_code == 200:
        data = response.json()
        print(f"✓ Success! Found {data.get('count', 0)} properties for rent")
    else:
        print(f"✗ Failed with status {response.status_code}")
    
    # Test 5: Filter by property type
    print("\n5. GET /api/properties/?property_type=house")
    response = requests.get(f'{BASE_URL}/properties/?property_type=house')
    if response.status_code == 200:
        data = response.json()
        print(f"✓ Success! Found {data.get('count', 0)} houses")
    else:
        print(f"✗ Failed with status {response.status_code}")
    
    # Test 6: Search properties
    print("\n6. GET /api/properties/?search=luxury")
    response = requests.get(f'{BASE_URL}/properties/?search=luxury')
    if response.status_code == 200:
        data = response.json()
        print(f"✓ Success! Found {data.get('count', 0)} properties matching 'luxury'")
    else:
        print(f"✗ Failed with status {response.status_code}")
    
    # Test 7: Get single property
    print("\n7. GET /api/properties/1/")
    response = requests.get(f'{BASE_URL}/properties/1/')
    if response.status_code == 200:
        data = response.json()
        print(f"✓ Success! Property: {data['title']}")
        print(f"  Price: ${data['price']}")
        print(f"  Location: {data['city']}, {data['state']}")
        print(f"  Bedrooms: {data['bedrooms']}, Bathrooms: {data['bathrooms']}")
    else:
        print(f"✗ Failed with status {response.status_code}")
    
    print("\n" + "=" * 50)
    print("API Testing Complete!")

if __name__ == '__main__':
    try:
        test_endpoints()
    except requests.exceptions.ConnectionError:
        print("Error: Could not connect to the API.")
        print("Make sure the Django server is running on http://localhost:8000")
        print("Run: python manage.py runserver")
