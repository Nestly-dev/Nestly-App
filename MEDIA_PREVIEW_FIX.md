# Media Preview Fix Summary

## Issue
Photos, videos, and gallery media were not previewing in the admin dashboard.

## Root Causes Identified

### 1. Missing API_BASE_URL Export
**Problem**: The gallery page was trying to access `apiClient.API_BASE_URL`, but this constant wasn't exported from the apiClient module.

**Fix**: Added `API_BASE_URL` to the exports in [lib/apiClient.js](admin-dashboard/lib/apiClient.js:550-553)
```javascript
export const apiClient = {
  // ... all methods ...
  API_BASE_URL,
};

export { ApiError, API_BASE_URL };
```

### 2. Incorrect Image URL Construction
**Problem**: The code was trying to construct image URLs like `/hotels/Media/hotel/${hotelId}/${imageId}`, but the backend stores complete image URLs in the database.

**Fix**: Updated image display to use the `url` field directly from the media object
```javascript
// OLD (incorrect):
src={`${apiClient.API_BASE_URL}/hotels/Media/hotel/${hotel.id}/${item.id}`}

// NEW (correct):
src={item.url || 'https://via.placeholder.com/400?text=No+Image'}
```

### 3. Joined Data Structure Not Handled
**Problem**: The backend returns joined data with structure `{ hotel_media: {...}, hotels: {...} }`, but the frontend was expecting flat objects.

**Fix**: Added data transformation in [gallery/page.jsx](admin-dashboard/app/dashboard/gallery/page.jsx:87-98)
```javascript
let mediaData = [];
if (Array.isArray(mediaResponse.data)) {
  mediaData = mediaResponse.data.map(item => {
    // Check if it's a joined response
    if (item.hotel_media) {
      return { ...item.hotel_media, hotel: item.hotels };
    }
    return item;
  });
}
setImages(mediaData);
```

### 4. Wrong Upload Endpoint
**Problem**: Image upload was using `/hotels/Media/hotel/:hotelId` but the backend route is `/hotels/Media/upload/:hotelId`

**Fix**: Corrected the upload URL in [gallery/page.jsx](admin-dashboard/app/dashboard/gallery/page.jsx:160)
```javascript
// OLD:
fetch(`${apiClient.API_BASE_URL}/hotels/Media/hotel/${hotel.id}`, ...)

// NEW:
fetch(`${apiClient.API_BASE_URL}/hotels/Media/upload/${hotel.id}`, ...)
```

### 5. Video URL Handling
**Problem**: Videos were only using the streaming endpoint instead of checking for stored URLs first.

**Fix**: Updated video display to prefer `video_url` field
```javascript
src={video.video_url || `${apiClient.API_BASE_URL}/content/videos/stream/${video.id}`}
```

### 6. Post Media URL Missing
**Problem**: Posts weren't showing media because the URL field name wasn't being checked correctly.

**Fix**: Updated to check both `url` and `media_url` fields
```javascript
{(post.url || post.media_url) && (
  <img src={post.url || post.media_url} ... />
)}
```

## Files Modified

### 1. admin-dashboard/lib/apiClient.js
- **Lines 549-553**: Added `API_BASE_URL` to exports

### 2. admin-dashboard/app/dashboard/gallery/page.jsx
- **Lines 84-103**: Fixed media data loading and transformation
- **Line 160**: Fixed image upload endpoint
- **Lines 433-451**: Updated image display to use correct URL field
- **Line 482**: Updated video source to use `video_url` field
- **Lines 534-544**: Updated post image display

## Database Schema Reference

### Hotel Media Table
```sql
hotel_media:
  - id: UUID (primary key)
  - hotel_id: UUID (foreign key)
  - media_type: ENUM (media type)
  - media_category: ENUM (category)
  - url: VARCHAR (media_url) ← Used for display
  - created_at: TIMESTAMP
  - updated_at: TIMESTAMP
```

### Videos Table
```sql
videos:
  - id: UUID
  - hotel_id: UUID
  - title: VARCHAR
  - video_url: TEXT ← Used for playback
  - thumbnail_url: TEXT ← Used for poster
  - view_count: INTEGER
  - created_at: TIMESTAMP
  - updated_at: TIMESTAMP
```

### Hotel Posts Table
```sql
hotel_posts:
  - id: UUID
  - hotel_id: UUID
  - caption: VARCHAR
  - postDescription: VARCHAR
  - url: VARCHAR (media_url) ← Used for display
  - created_at: TIMESTAMP
  - updated_at: TIMESTAMP
```

## API Endpoints

### Media Endpoints
- **GET** `/api/v1/hotels/Media/hotel/:hotelId` - Get all media for hotel
- **POST** `/api/v1/hotels/Media/upload/:hotelId` - Upload new media
  - Body: FormData with `media`, `media_type`, `media_category`

### Video Endpoints
- **GET** `/api/v1/content/videos/hotel/:hotelId` - Get all videos for hotel
- **POST** `/api/v1/content/videos/:hotelId` - Upload new video
  - Body: FormData with `video`, `title`, `thumbnail` (optional)
- **GET** `/api/v1/content/videos/stream/:videoId` - Stream video

### Post Endpoints
- **GET** `/api/v1/hotels/posts/:hotelId` - Get all posts for hotel
- **POST** `/api/v1/hotels/posts/:hotelId` - Create new post
  - Body: FormData with `media`, `caption`, `postDescription`

## Testing Instructions

1. **Login to Dashboard**
   ```
   URL: http://localhost:3001
   Hotel ID: 6857fc86-efff-4c27-a0a0-9549dc9c3bb8
   Password: Hotel2024
   ```

2. **Navigate to Gallery**
   - Click "Gallery" in the sidebar
   - Should see three tabs: Images, Videos, Posts

3. **View Existing Media**
   - Images tab should show all uploaded hotel images
   - Videos tab should show all hotel videos with playback controls
   - Posts tab should show social media posts with images

4. **Upload New Media**
   - Click "Upload Media" button
   - Select type (Image, Video, or Post)
   - Fill in required fields
   - Upload and verify it appears in the correct tab

## Verification Checklist

✅ Images load and display correctly
✅ Videos load with correct URLs and thumbnails
✅ Posts display with media
✅ API_BASE_URL is accessible in components
✅ Upload endpoints use correct URLs
✅ Data transformation handles joined responses
✅ Error states show placeholder images
✅ Console shows media response for debugging

## Notes

- All media URLs are stored in the database and served directly
- The backend uses multer for file uploads
- Content-aware image middleware processes images before storage
- Videos can be streamed or served as direct URLs
- Hotel authentication is required for all media operations
