# Media Gallery Testing Guide

## System Status ✅

- **Backend**: Running at http://localhost:8000
- **Frontend**: Running at http://localhost:3001
- **Authentication**: Hotel ID-based login working
- **Media Gallery**: Fully implemented with upload functionality

## Test Hotel Credentials

Use any of these hotel IDs to login:

```
Hotel ID: 6857fc86-efff-4c27-a0a0-9549dc9c3bb8
Password: Hotel2024
```

## Testing Steps

### 1. Login Test
1. Navigate to http://localhost:3001
2. Enter Hotel ID: `6857fc86-efff-4c27-a0a0-9549dc9c3bb8`
3. Enter Password: `Hotel2024`
4. Click "Sign In"
5. ✅ Should redirect to dashboard at `/dashboard`

### 2. Gallery Page Navigation
1. From dashboard, click "Gallery" in sidebar
2. ✅ Should see three tabs: Images, Videos, Posts
3. ✅ Should see statistics cards showing counts
4. ✅ Should see "Upload Media" button

### 3. Image Upload Test

**Endpoint**: `POST /hotels/Media/hotel/:hotelId`

**Required Fields**:
- `media`: Image file (JPEG, PNG, WebP)
- `media_type`: Image type (image/jpeg, image/png, image/webp)
- `media_category`: Category (rooms, exterior, amenities, dining, lobby, other)

**Steps**:
1. Click "Upload Media" button
2. Select "Gallery Image" as upload type
3. Click "Choose file" and select an image
4. Select media type (e.g., JPEG)
5. Select category (e.g., Rooms)
6. Click "Upload"
7. ✅ Should show success message
8. ✅ Image should appear in Images tab

### 4. Video Upload Test

**Endpoint**: `POST /content/videos/:hotelId`

**Required Fields**:
- `video`: Video file (MP4, MOV, etc.)
- `title`: Video title (required)
- `thumbnail`: Optional thumbnail image

**Steps**:
1. Click "Upload Media" button
2. Select "Video" as upload type
3. Enter video title
4. Click "Choose video file" and select a video
5. Optionally upload a thumbnail
6. Click "Upload"
7. ✅ Should show success message
8. ✅ Video should appear in Videos tab

### 5. Post Upload Test

**Endpoint**: `POST /hotels/posts/:hotelId`

**Required Fields**:
- `media`: Image or video file
- `caption`: Post caption (required)
- `postDescription`: Optional description

**Steps**:
1. Click "Upload Media" button
2. Select "Post" as upload type
3. Enter caption
4. Enter description (optional)
5. Click "Choose media" and select image/video
6. Click "Upload"
7. ✅ Should show success message
8. ✅ Post should appear in Posts tab

### 6. Media Display Test

**Image Preview Endpoint**: `GET /hotels/Media/hotel/:hotelId/:imageId`
**Video Streaming Endpoint**: `GET /content/videos/stream/:videoId`
**Posts Endpoint**: `GET /hotels/posts/:hotelId`

**Steps**:
1. Navigate to Images tab
2. ✅ Images should display with preview
3. Navigate to Videos tab
4. ✅ Videos should have play button and thumbnail
5. Navigate to Posts tab
6. ✅ Posts should show caption, description, and media

### 7. Empty State Test

**Steps**:
1. Login with hotel that has no media
2. Navigate to Gallery
3. ✅ Should see "No images yet" message in Images tab
4. ✅ Should see "Upload First Image" button
5. Same for Videos and Posts tabs

## API Endpoints Summary

### Images
- **Get all images**: `GET /hotels/Media/:hotelId`
- **Upload image**: `POST /hotels/Media/hotel/:hotelId`
  - Body: `FormData` with `media`, `media_type`, `media_category`
- **Preview image**: `GET /hotels/Media/hotel/:hotelId/:imageId`

### Videos
- **Get all videos**: `GET /content/videos/hotel/:hotelId`
- **Upload video**: `POST /content/videos/:hotelId`
  - Body: `FormData` with `video`, `title`, `thumbnail` (optional)
- **Stream video**: `GET /content/videos/stream/:videoId`

### Posts
- **Get all posts**: `GET /hotels/posts/:hotelId`
- **Create post**: `POST /hotels/posts/:hotelId`
  - Body: `FormData` with `media`, `caption`, `postDescription`

## Common Issues

### Issue: "Access denied" error
**Solution**: Make sure you're logged in and the JWT token is valid

### Issue: Upload fails with 401
**Solution**: Check that `auth_token` is stored in localStorage

### Issue: Images not displaying
**Solution**: Verify backend is running on port 8000 and image endpoint is correct

### Issue: Long loading times
**Solution**: Check network tab in DevTools for slow API calls

## Next Steps

Once media gallery testing is complete, remaining pages to implement:
1. **Reviews Page**: Display and manage hotel reviews
2. **Rooms Page**: Manage room inventory and availability
3. **Support Page**: Contact support and help center

## Notes

- All uploads include hotel ID automatically from login session
- Authorization header with Bearer token is included in all requests
- FormData is used for file uploads (not JSON)
- Hotel can only see/upload their own media
- Statistics cards update automatically after uploads
