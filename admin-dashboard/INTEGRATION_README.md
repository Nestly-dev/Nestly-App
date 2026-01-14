# Admin Dashboard - Backend Integration Complete

## Overview
The admin dashboard has been fully integrated with the backend API, providing hotel managers with personalized dashboards featuring real-time analytics, booking management, and hotel-specific data.

---

## 🎯 What Has Been Implemented

### 1. **Authentication System** ✅
- **JWT Token Management**: Secure token storage in localStorage
- **Auth Context Provider**: Global authentication state management
- **Protected Routes**: Dashboard pages only accessible after login
- **Login Integration**: Real API calls to `http://localhost:8000/api/v1/auth/login`
- **Logout Functionality**: Token cleanup and redirect to login

**Files Created:**
- [`/lib/apiClient.js`](lib/apiClient.js) - Complete API client with token management
- [`/contexts/AuthContext.jsx`](contexts/AuthContext.jsx) - Authentication context provider
- [`/components/ProtectedRoute.jsx`](components/ProtectedRoute.jsx) - Route protection wrapper

**Files Updated:**
- [`/app/layout.jsx`](app/layout.jsx) - Added AuthProvider wrapper
- [`/app/page.jsx`](app/page.jsx) - Integrated real login API
- [`/app/dashboard/layout.jsx`](app/dashboard/layout.jsx) - Added protected route wrapper

---

### 2. **Hotel-Specific API Service Layer** ✅
Comprehensive API client with all backend endpoints:

#### **Authentication APIs**
```javascript
apiClient.auth.login(email, password)
apiClient.auth.logout()
apiClient.auth.forgotPassword(email)
apiClient.auth.resetPassword(token, password)
```

#### **Hotel Management APIs**
```javascript
apiClient.hotels.getAll()
apiClient.hotels.getProfile(hotelId)
apiClient.hotels.register(data)
apiClient.hotels.update(hotelId, data)
apiClient.hotels.delete(hotelId)
apiClient.hotels.getMyHotels() // Get hotels for logged-in manager
```

#### **Room Management APIs**
```javascript
apiClient.rooms.getAll(hotelId)
apiClient.rooms.getById(hotelId, roomTypeId)
apiClient.rooms.create(hotelId, data)
apiClient.rooms.update(hotelId, roomTypeId, data)
apiClient.rooms.delete(hotelId, roomTypeId)
```

#### **Booking Management APIs**
```javascript
apiClient.bookings.getAll(params)
apiClient.bookings.getByHotel(hotelId)
apiClient.bookings.getById(bookingId)
apiClient.bookings.create(hotelId, data)
apiClient.bookings.update(bookingId, data)
apiClient.bookings.cancel(bookingId)
apiClient.bookings.verifyPayment(bookingId)
```

#### **Reviews APIs**
```javascript
apiClient.reviews.getByHotel(hotelId, params)
apiClient.reviews.create(hotelId, data)
apiClient.reviews.update(hotelId, reviewId, data)
apiClient.reviews.delete(hotelId, reviewId)
```

#### **Media Management APIs**
```javascript
apiClient.media.getByHotel(hotelId)
apiClient.media.upload(hotelId, formData)
apiClient.media.delete(hotelId, mediaId)
```

#### **Analytics APIs** (Custom)
```javascript
apiClient.analytics.getHotelAnalytics(hotelId)
// Returns: totalBookings, totalRevenue, activeCustomers, mediaViews,
//          averageRating, bookings, reviews, media, rooms

apiClient.analytics.getBookingTrends(hotelId, days)
// Returns: Daily booking and revenue trends
```

---

### 3. **Dashboard Overview - Real-Time Analytics** ✅

The main dashboard now displays **live hotel data**:

#### **Key Metrics Cards**
- **Total Bookings**: Actual booking count from database
- **Total Revenue**: Calculated from all booking totals
- **Active Customers**: Unique customers who made bookings
- **Media Views**: Total view counts across all media

#### **Revenue Chart** (Real-Time)
- Displays booking trends and revenue over selected time period
- Options: 7 days, 30 days, 90 days, 365 days
- Dynamically loads data from backend based on hotel ID

#### **Customer Analytics Chart** (Real-Time)
- **Pie Chart**: Customer segmentation
  - First-time Visitors
  - Returning Customers (2-4 bookings)
  - Loyalty Members (5+ bookings)
- **Customer Stats**:
  - New customers in last 7 days
  - Retention rate percentage
  - Average stay duration

#### **Recent Reviews Widget**
- Shows latest 5 reviews for the hotel
- Displays reviewer name, rating, comment, and date
- Empty state when no reviews exist

#### **Media Insights Widget**
- Top 6 media items by view count
- Weekly view trends chart
- Media type categorization (photo/video)

#### **Upcoming Bookings**
- Next 5 upcoming reservations
- Shows booking ID, dates, total price, payment status
- Filtered to show only future bookings

#### **Top Rooms**
- Most booked room types
- Percentage-based ranking
- Visual progress bars

**Files Updated:**
- [`/app/dashboard/page.jsx`](app/dashboard/page.jsx) - Complete real-time analytics integration
- [`/components/dashboard/RevenueChart.jsx`](components/dashboard/RevenueChart.jsx) - Real booking trends
- [`/components/dashboard/CustomerChart.jsx`](components/dashboard/CustomerChart.jsx) - Real customer analytics
- [`/components/dashboard/RecentReviews.jsx`](components/dashboard/RecentReviews.jsx) - Real reviews data
- [`/components/dashboard/MediaStats.jsx`](components/dashboard/MediaStats.jsx) - Real media analytics

---

### 4. **Multi-Hotel Management** ✅

#### **Hotel Selector in Header**
- Dropdown to switch between hotels (for admins managing multiple properties)
- Displays single hotel name for managers with one property
- Stores selected hotel in localStorage
- All dashboard data updates when hotel is switched

#### **User Profile Display**
- User avatar/initials
- Username and role display
- Dropdown menu with:
  - Profile settings
  - Hotel settings
  - Logout option

**File Updated:**
- [`/components/dashboard/Header.jsx`](components/dashboard/Header.jsx) - Added hotel selector and user menu

---

### 5. **Loading States & Error Handling** ✅

All components include:
- **Loading spinners** during API calls
- **Error messages** with retry buttons
- **Empty states** when no data exists
- **Graceful fallbacks** for missing data

---

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file in the `admin-dashboard` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

This URL points to your backend server running on port 8000.

---

## 🚀 How to Use

### 1. Start the Backend Server
```bash
cd Backend
npm start
# Backend should be running on http://localhost:8000
```

### 2. Start the Admin Dashboard
```bash
cd admin-dashboard
npm run dev
# Dashboard will be available at http://localhost:3000
```

### 3. Login
- Navigate to `http://localhost:3000`
- Enter hotel manager credentials:
  - Email: Your hotel manager email from database
  - Password: Your hotel manager password
- Click "Sign in"

### 4. View Dashboard
After login, you'll see:
- **Real-time statistics** for your hotel
- **Live booking data**
- **Customer analytics**
- **Revenue trends**
- **Recent reviews**
- **Media performance**

---

## 🔑 Authentication Flow

```
1. User enters email/password on login page
   ↓
2. API call to POST /api/v1/auth/login
   ↓
3. Backend returns { token, user }
   ↓
4. Token stored in localStorage
   ↓
5. User data stored in localStorage
   ↓
6. Fetch user's hotels from backend
   ↓
7. Set active hotel (first one or from storage)
   ↓
8. Redirect to /dashboard
   ↓
9. Dashboard loads hotel-specific analytics
   ↓
10. All subsequent API calls include "Authorization: Bearer {token}" header
```

---

## 📊 Data Flow

### Dashboard Load Sequence:
```
1. ProtectedRoute checks authentication
   ↓
2. AuthContext provides user and hotel data
   ↓
3. Dashboard page receives hotel.id
   ↓
4. Parallel API calls:
   - apiClient.analytics.getHotelAnalytics(hotel.id)
   - apiClient.analytics.getBookingTrends(hotel.id, days)
   ↓
5. Components receive data as props:
   - RevenueChart receives hotelId + days
   - CustomerChart receives hotelId + days
   - RecentReviews receives reviews array
   - MediaStats receives media array
   ↓
6. Charts render with real data
   ↓
7. User interacts (e.g., changes time period)
   ↓
8. Components reload data with new parameters
```

---

## 🎨 Features by Page

### **Login Page** (`/`)
- ✅ Email/password form
- ✅ Real API authentication
- ✅ Error handling
- ✅ Loading states
- ✅ Remember me checkbox
- ✅ Forgot password link

### **Dashboard Overview** (`/dashboard`)
- ✅ 4 metric cards (bookings, revenue, customers, views)
- ✅ Revenue chart with time period selector
- ✅ Customer analytics pie chart
- ✅ Recent reviews list
- ✅ Media insights
- ✅ Upcoming bookings list
- ✅ Top rooms ranking

### **Header Component**
- ✅ Hotel selector (multi-hotel support)
- ✅ Search bar
- ✅ Theme toggle
- ✅ Notifications dropdown
- ✅ User profile menu
- ✅ Logout functionality

---

## 🔐 Security Features

1. **JWT Token Authentication**: All API requests include bearer token
2. **Token Expiration Handling**: Auto-logout on 401 responses
3. **Protected Routes**: Unauthenticated users redirected to login
4. **Secure Token Storage**: localStorage with automatic cleanup
5. **CORS Configuration**: Backend properly configured for frontend origin

---

## 📁 Project Structure

```
admin-dashboard/
├── app/
│   ├── layout.jsx                 # Root layout with AuthProvider
│   ├── page.jsx                   # Login page with real API
│   └── dashboard/
│       ├── layout.jsx             # Dashboard layout with ProtectedRoute
│       ├── page.jsx               # Main dashboard with real analytics
│       ├── bookings/              # Bookings page (ready for integration)
│       ├── reviews/               # Reviews page (ready for integration)
│       ├── gallery/               # Gallery page (ready for integration)
│       ├── rooms/                 # Rooms page (ready for integration)
│       └── support/               # Support page (ready for integration)
│
├── components/
│   ├── ProtectedRoute.jsx         # Route protection component
│   └── dashboard/
│       ├── Header.jsx             # Header with hotel selector & user menu
│       ├── Sidebar.jsx            # Navigation sidebar
│       ├── RevenueChart.jsx       # Real-time revenue chart
│       ├── CustomerChart.jsx      # Real-time customer analytics
│       ├── RecentReviews.jsx      # Real reviews display
│       └── MediaStats.jsx         # Real media analytics
│
├── contexts/
│   └── AuthContext.jsx            # Authentication context
│
├── lib/
│   ├── apiClient.js               # Complete API client layer
│   ├── api.js                     # Old API (kept for reference)
│   └── utils.js                   # Utility functions
│
├── .env.local                     # Environment configuration
└── package.json                   # Dependencies
```

---

## 🎯 Next Steps (Optional Enhancements)

The dashboard overview is **fully functional**, but additional pages can be enhanced:

### **Bookings Page** (Partially ready)
- Connect to `apiClient.bookings.getByHotel(hotelId)`
- Add booking filters (status, date range)
- Implement booking details modal
- Add export functionality

### **Reviews Page** (Partially ready)
- Connect to `apiClient.reviews.getByHotel(hotelId)`
- Add review filtering
- Implement review response functionality
- Add rating analytics

### **Gallery Page** (Partially ready)
- Connect to `apiClient.media.getByHotel(hotelId)`
- Implement `apiClient.media.upload(hotelId, formData)` for uploads
- Add media categorization filters
- Implement delete functionality

### **Rooms Page** (Partially ready)
- Connect to `apiClient.rooms.getAll(hotelId)`
- Implement CRUD operations using room APIs
- Add pricing management
- Add availability calendar

---

## 🐛 Troubleshooting

### **Login Fails**
- ✅ Check backend is running on port 8000
- ✅ Verify database has hotel manager user
- ✅ Check browser console for error details
- ✅ Verify `.env.local` has correct API URL

### **Dashboard Shows No Data**
- ✅ Check if hotel exists in database
- ✅ Verify hotel has bookings/reviews/media
- ✅ Check browser console for API errors
- ✅ Verify user has hotel assigned in `hotelManagement` table

### **Charts Not Loading**
- ✅ Check API endpoints return valid data
- ✅ Verify date formats in database
- ✅ Check browser console for errors
- ✅ Ensure recharts is installed

### **Token Expired**
- Simply logout and login again
- Token will automatically refresh

---

## 🔗 API Endpoint Reference

All endpoints are prefixed with `http://localhost:8000/api/v1`

### **Authentication**
- `POST /auth/login` - Login with email/password
- `POST /auth/logout` - Logout user
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/reset-password/:token` - Reset password

### **Hotels**
- `GET /hotels/all-hotels` - Get all hotels
- `GET /hotels/profile/:hotelId` - Get hotel details
- `POST /hotels/register` - Register new hotel
- `PATCH /hotels/update/:hotelId` - Update hotel
- `DELETE /hotels/delete/:hotelId` - Delete hotel

### **Rooms**
- `GET /hotels/rooms/:hotelId` - Get hotel rooms
- `GET /hotels/rooms/:hotelId/:roomTypeId` - Get specific room
- `POST /hotels/rooms/register/:hotelId` - Create room
- `PATCH /hotels/rooms/update/:hotelId/:roomTypeId` - Update room
- `DELETE /hotels/rooms/delete/:hotelId/:roomTypeId` - Delete room

### **Bookings**
- `GET /hotels/booking?hotel_id={hotelId}` - Get hotel bookings
- `GET /hotels/booking/:bookingId` - Get booking details
- `POST /hotels/booking/create/:hotelId` - Create booking
- `PATCH /hotels/booking/update/:bookingId` - Update booking
- `PATCH /hotels/booking/cancel/:bookingId` - Cancel booking

### **Reviews**
- `GET /hotels/reviews/:hotelId` - Get hotel reviews
- `POST /hotels/reviews/:hotelId` - Create review
- `PATCH /hotels/reviews/:hotelId/:reviewId` - Update review
- `DELETE /hotels/reviews/:hotelId/:reviewId` - Delete review

### **Media**
- `GET /hotels/Media/:hotelId` - Get hotel media
- `POST /hotels/Media/:hotelId` - Upload media (FormData)
- `DELETE /hotels/Media/:hotelId/:mediaId` - Delete media

---

## ✨ Key Features Summary

✅ **Complete Authentication System** - Secure JWT-based authentication
✅ **Multi-Hotel Support** - Manage multiple properties
✅ **Real-Time Analytics** - Live booking, revenue, and customer data
✅ **Interactive Charts** - Dynamic data visualization
✅ **Hotel-Specific Data** - All data filtered by selected hotel ID
✅ **Loading & Error States** - Professional UX with proper feedback
✅ **Responsive Design** - Works on desktop, tablet, and mobile
✅ **Role-Based Access** - Hotel managers see only their hotels
✅ **Token Management** - Automatic token storage and cleanup
✅ **API Integration** - Complete backend integration layer

---

## 📞 Support

For issues or questions:
1. Check browser console for errors
2. Verify backend is running and accessible
3. Check database has required data
4. Review this documentation
5. Check API responses in Network tab

---

## 🎉 Success!

Your admin dashboard is now **fully connected** to the backend with:
- ✅ Personalized hotel dashboards
- ✅ Real-time analytics and statistics
- ✅ Secure authentication
- ✅ Multi-hotel management
- ✅ Professional error handling
- ✅ Complete API integration

**Ready to login and start managing hotels!** 🚀
