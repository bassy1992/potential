"""
Script to make DigitalOcean Spaces bucket publicly accessible
Run this locally: python fix_do_spaces_permissions.py
"""

import boto3
from botocore.client import Config

# DigitalOcean Spaces credentials
DO_SPACES_ACCESS_KEY = 'DO00DGJKFWGXCD4TXXLV'
DO_SPACES_SECRET_KEY = 'L1ivEItSE0bzK17km77b4UhQw+52ukZcx7WI3Va2Dvs'
DO_SPACES_BUCKET = 'studymate'
DO_SPACES_REGION = 'sfo3'
DO_SPACES_ENDPOINT = f'https://{DO_SPACES_REGION}.digitaloceanspaces.com'

print("=" * 60)
print("DigitalOcean Spaces Permission Fixer")
print("=" * 60)

# Initialize S3 client
session = boto3.session.Session()
client = session.client(
    's3',
    region_name=DO_SPACES_REGION,
    endpoint_url=DO_SPACES_ENDPOINT,
    aws_access_key_id=DO_SPACES_ACCESS_KEY,
    aws_secret_access_key=DO_SPACES_SECRET_KEY
)

print(f"\n📦 Bucket: {DO_SPACES_BUCKET}")
print(f"🌍 Region: {DO_SPACES_REGION}")
print(f"🔗 Endpoint: {DO_SPACES_ENDPOINT}")

# List all objects in the media/property_images/ folder
print("\n🔍 Finding all objects in bucket...")
try:
    # List objects in media/property_images/
    response = client.list_objects_v2(
        Bucket=DO_SPACES_BUCKET,
        Prefix='media/property_images/'
    )
    
    if 'Contents' in response:
        property_images = response['Contents']
        print(f"✅ Found {len(property_images)} objects in media/property_images/")
        
        for obj in property_images:
            print(f"  - {obj['Key']}")
    else:
        print("❌ No objects found in media/property_images/")
        print("\n💡 You need to upload a NEW image via Django Admin")
        print("   The old images were uploaded when DO Spaces was disabled")
        
    # Also check for any property-related images anywhere
    print("\n🔍 Searching for any property images in entire bucket...")
    response_all = client.list_objects_v2(Bucket=DO_SPACES_BUCKET)
    
    if 'Contents' in response_all:
        all_images = [obj for obj in response_all['Contents'] 
                     if 'property' in obj['Key'].lower() or 'b2.png' in obj['Key']]
        if all_images:
            print(f"✅ Found {len(all_images)} property-related images:")
            for obj in all_images[:10]:
                print(f"  - {obj['Key']}")
        else:
            print("❌ No property images found anywhere in bucket")
    
    # Make each object public
    print("\n🔧 Setting public-read ACL on all images...")
    fixed_count = 0
    
    for obj in property_images:
        key = obj['Key']
        try:
            # Set ACL to public-read
            client.put_object_acl(
                Bucket=DO_SPACES_BUCKET,
                Key=key,
                ACL='public-read'
            )
            print(f"  ✓ {key}")
            fixed_count += 1
        except Exception as e:
            print(f"  ✗ {key}: {str(e)}")
    
    print(f"\n✅ Successfully made {fixed_count}/{len(property_images)} images public!")
    
    # Test one image
    if property_images:
        test_key = property_images[0]['Key']
        test_url = f"https://{DO_SPACES_BUCKET}.{DO_SPACES_REGION}.cdn.digitaloceanspaces.com/{test_key}"
        print(f"\n🧪 Test URL:")
        print(f"   {test_url}")
        print(f"\n   Open this URL in your browser to verify it works!")
    
except Exception as e:
    print(f"❌ Error: {str(e)}")
    print("\nPossible issues:")
    print("1. Check your access keys are correct")
    print("2. Verify the bucket name is 'studymate'")
    print("3. Ensure your access key has permission to modify ACLs")

print("\n" + "=" * 60)
