# Property Image Upload Guide

This guide explains how to upload property images from your local PC to DigitalOcean Spaces.

## Method 1: Using Django Management Command (Recommended)

### Upload to All Properties (Distributed)
```bash
python manage.py upload_images "C:\Users\YourName\Pictures\Properties"
```

### Upload to Specific Property
```bash
python manage.py upload_images "C:\Users\YourName\Pictures\Properties" --property-id 1
```

### Set First Image as Primary
```bash
python manage.py upload_images "C:\Users\YourName\Pictures\Properties" --property-id 1 --set-primary
```

## Method 2: Using Simple Python Script

1. **Edit the script**: Open `upload_local_images.py`

2. **Configure your folder path**:
   ```python
   folder_path = r"C:\Users\Comme\Pictures\Properties"
   upload_images_from_folder(folder_path)
   ```

3. **Run the script**:
   ```bash
   python upload_local_images.py
   ```

## Method 3: Using Django Admin (Web Interface)

1. Go to: https://potential-production.up.railway.app/admin/
2. Login with your credentials
3. Click on "Properties"
4. Select a property
5. Scroll to "Property Images" section
6. Click "Add another Property Image"
7. Upload images directly from your browser

## Supported Image Formats

- JPG/JPEG
- PNG
- GIF
- WebP

## Image Organization Tips

### Option A: One Folder with All Images
```
Properties/
  ├── house1.jpg
  ├── house2.jpg
  ├── apartment1.jpg
  └── condo1.jpg
```
Images will be distributed across all properties.

### Option B: Separate Folders per Property
```
Properties/
  ├── Property1/
  │   ├── front.jpg
  │   ├── kitchen.jpg
  │   └── bedroom.jpg
  ├── Property2/
  │   ├── exterior.jpg
  │   └── interior.jpg
```
Upload each folder separately with `--property-id`.

## Examples

### Example 1: Upload 10 images to 5 properties
```bash
# Each property will get 2 images
python manage.py upload_images "C:\Images\RealEstate"
```

### Example 2: Upload all images to Property #3
```bash
python manage.py upload_images "C:\Images\Luxury_Villa" --property-id 3 --set-primary
```

### Example 3: Using the Python script
```python
# Edit upload_local_images.py
folder_path = r"C:\Users\Comme\Desktop\PropertyPhotos"
upload_images_from_folder(folder_path, property_id=5)
```

## Verification

After uploading, verify images are in DigitalOcean Spaces:
- URL format: `https://studymate.sfo3.digitaloceanspaces.com/media/property_images/filename.jpg`
- Check Django Admin to see uploaded images
- Visit your frontend: https://land-listing-portal-76d.vercel.app/properties

## Troubleshooting

### Images not uploading?
1. Check DO Spaces credentials in Railway environment variables
2. Verify `USE_DO_SPACES=true` is set
3. Check image file permissions

### Images not showing on frontend?
1. Verify images are marked as `is_primary=True` for at least one image per property
2. Check browser console for CORS errors
3. Verify DO Spaces bucket has public read access

## Need Help?

Run the management command with `--help`:
```bash
python manage.py upload_images --help
```
