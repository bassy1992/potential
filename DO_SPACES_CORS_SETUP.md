# DigitalOcean Spaces CORS Configuration

Your images might not be showing because the DigitalOcean Spaces bucket needs CORS configuration.

## Steps to Fix:

### 1. Go to DigitalOcean Spaces Dashboard
https://cloud.digitalocean.com/spaces

### 2. Select your bucket: `studymate`

### 3. Click on "Settings" tab

### 4. Scroll to "CORS Configurations"

### 5. Add this CORS configuration:

```xml
<CORSConfiguration>
    <CORSRule>
        <AllowedOrigin>*</AllowedOrigin>
        <AllowedMethod>GET</AllowedMethod>
        <AllowedMethod>HEAD</AllowedMethod>
        <AllowedHeader>*</AllowedHeader>
        <MaxAgeSeconds>3000</MaxAgeSeconds>
    </CORSRule>
</CORSConfiguration>
```

Or use this JSON format if available:

```json
[
  {
    "AllowedOrigins": ["*"],
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedHeaders": ["*"],
    "MaxAgeSeconds": 3000
  }
]
```

### 6. Make Bucket Public (if not already)

In the bucket settings, ensure:
- **File Listing**: Restricted (recommended)
- **File Access**: Public (required for images to load)

### 7. Verify Image URL

After uploading an image, the URL should look like:
```
https://studymate.sfo3.digitaloceanspaces.com/media/property_images/filename.jpg
```

Test by opening this URL directly in your browser - it should show the image.

## Alternative: Use CDN Endpoint

DigitalOcean Spaces provides a CDN endpoint that might work better:

1. Go to your Space settings
2. Enable CDN
3. Use the CDN URL instead: `https://studymate.sfo3.cdn.digitaloceanspaces.com`

Then update Railway environment variable:
```bash
railway variables set DO_SPACES_CDN_DOMAIN=studymate.sfo3.cdn.digitaloceanspaces.com
```

## Quick Test

1. Upload an image via Django Admin
2. Copy the image URL from the admin panel
3. Open it in a new browser tab
4. If it loads → CORS is fine, issue is elsewhere
5. If it doesn't load → CORS needs to be configured

## Common Issues

### Issue 1: 403 Forbidden
- **Cause**: Bucket is not public or file ACL is wrong
- **Fix**: Make bucket public and ensure `AWS_DEFAULT_ACL = 'public-read'` in settings

### Issue 2: CORS Error in Browser Console
- **Cause**: CORS not configured
- **Fix**: Add CORS configuration above

### Issue 3: Image URL is wrong
- **Cause**: Wrong bucket name or region
- **Fix**: Verify environment variables match your actual Space

## Verify Environment Variables

Check these are correct in Railway:
```
DO_SPACES_BUCKET_NAME=studymate
DO_SPACES_REGION=sfo3
DO_SPACES_ACCESS_KEY_ID=DO00DGJKFWGXCD4TXXLV
USE_DO_SPACES=true
```
