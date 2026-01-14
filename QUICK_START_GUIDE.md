# 🚀 Nestly App - Quick Start Guide

## Admin Dashboard Backend Integration

This guide will help you quickly get started with the **fully integrated admin dashboard** that connects to your backend API.

---

## ✅ What's Been Done

### **Complete Integration Implemented:**

1. ✅ **Authentication System** - JWT token management, login/logout
2. ✅ **API Client Layer** - All backend endpoints integrated
3. ✅ **Hotel-Specific Dashboards** - Each hotel manager sees only their data
4. ✅ **Real-Time Analytics** - Live bookings, revenue, customers, media stats
5. ✅ **Interactive Charts** - Revenue trends, customer analytics
6. ✅ **Multi-Hotel Support** - Hotel selector for admins managing multiple properties
7. ✅ **Protected Routes** - Dashboard only accessible after login
8. ✅ **Loading & Error States** - Professional UX throughout

---

## 🎯 Quick Start (3 Steps)

### Step 1: Start the Backend
```bash
cd Backend
npm install  # If not already done
npm start
```
✅ Backend should be running on `http://localhost:8000`

### Step 2: Start the Admin Dashboard
```bash
cd admin-dashboard
npm install  # If not already done
npm run dev
```
✅ Dashboard should be running on `http://localhost:3000`

### Step 3: Login
1. Open browser to `http://localhost:3000`
2. Enter hotel manager credentials
3. View your personalized dashboard with real-time data!

---

## 🔑 Test Login

To test the dashboard, you need a hotel manager account in your database. If you don't have one:

### Option 1: Use Existing Account
Check your database for existing users with role `hotel-manager`

### Option 2: Create Test Account via Backend
Use your backend's registration endpoint or database directly

---

## 📊 What You'll See After Login

### **Dashboard Overview**
- **Total Bookings** - Real count from your database
- **Total Revenue** - Calculated from all bookings
- **Active Customers** - Unique customers
- **Media Views** - Total media view counts

### **Interactive Charts**
- **Revenue Chart** - Daily revenue and booking trends
- **Customer Analytics** - First-time vs returning vs loyalty customers

### **Live Widgets**
- **Recent Reviews** - Latest 5 customer reviews
- **Media Insights** - Top performing media items
- **Upcoming Bookings** - Next 5 reservations
- **Top Rooms** - Most booked room types

### **Header Features**
- **Hotel Selector** - Switch between hotels (if managing multiple)
- **User Profile** - Avatar, username, role
- **Logout** - Secure session termination

---

## 🗂️ Files Created/Modified

### **New Files:**
```
admin-dashboard/
├── .env.local                          # API configuration
├── lib/apiClient.js                    # Complete API client (620+ lines)
├── contexts/AuthContext.jsx            # Authentication state management
├── components/ProtectedRoute.jsx       # Route protection
└── INTEGRATION_README.md               # Detailed documentation
```

### **Updated Files:**
```
admin-dashboard/
├── app/
│   ├── layout.jsx                      # Added AuthProvider
│   ├── page.jsx                        # Real login API
│   └── dashboard/
│       ├── layout.jsx                  # Added ProtectedRoute
│       └── page.jsx                    # Real-time analytics
│
└── components/dashboard/
    ├── Header.jsx                      # Hotel selector + user menu
    ├── RevenueChart.jsx                # Real booking trends
    ├── CustomerChart.jsx               # Real customer analytics
    ├── RecentReviews.jsx               # Real reviews data
    └── MediaStats.jsx                  # Real media stats
```

---

## 🎨 Key Features

### **1. Authentication**
- Login with email/password
- JWT token storage
- Auto-logout on token expiry
- Remember me functionality
- Secure token management

### **2. Hotel Management**
- Each manager sees only their hotel(s)
- Multi-hotel selector for admins
- Real-time data filtering by hotel ID
- Hotel-specific analytics

### **3. Real-Time Dashboard**
- Live booking statistics
- Revenue tracking
- Customer segmentation
- Media performance metrics
- Review management

### **4. Professional UX**
- Loading spinners during API calls
- Error messages with retry options
- Empty states when no data exists
- Responsive design for all devices
- Smooth transitions and interactions

---

## 🔧 Configuration

The `.env.local` file has been created with:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

**Change this if your backend runs on a different port or domain.**

---

## 📱 Available Pages

### **✅ Fully Integrated:**
- `/` - Login page with real authentication
- `/dashboard` - Main dashboard with real-time analytics

### **🔄 Ready for Integration:**
These pages have UI but need API connection:
- `/dashboard/bookings` - Booking management
- `/dashboard/reviews` - Review management
- `/dashboard/gallery` - Media management
- `/dashboard/rooms` - Room management
- `/dashboard/support` - Support tickets

**API methods are already available in `apiClient.js`!**

---

## 🔗 API Client Usage Examples

All API methods are in `lib/apiClient.js`:

```javascript
// Import the client
import { apiClient } from '@/lib/apiClient';

// Authentication
await apiClient.auth.login(email, password);
await apiClient.auth.logout();

// Get hotel data
const analytics = await apiClient.analytics.getHotelAnalytics(hotelId);
const bookings = await apiClient.bookings.getByHotel(hotelId);
const reviews = await apiClient.reviews.getByHotel(hotelId);
const rooms = await apiClient.rooms.getAll(hotelId);
const media = await apiClient.media.getByHotel(hotelId);

// Booking trends
const trends = await apiClient.analytics.getBookingTrends(hotelId, 30);
```

---

## 🐛 Troubleshooting

### **"Cannot connect to server"**
✅ Check backend is running on port 8000
✅ Verify `.env.local` has correct URL

### **"Invalid credentials"**
✅ Check database for user with `hotel-manager` role
✅ Verify password is correct
✅ Check backend console for errors

### **"No data showing"**
✅ Verify hotel has bookings/reviews/media in database
✅ Check browser console for API errors
✅ Verify user has hotel assigned in `hotelManagement` table

### **Dashboard shows loading forever**
✅ Check backend API is accessible
✅ Open browser DevTools → Network tab
✅ Look for failed API requests
✅ Check backend console for errors

---

## 📊 Data Requirements

For the dashboard to show data, your database needs:

1. **Hotel** record in `hotels` table
2. **User** record with role `hotel-manager`
3. **HotelManagement** record linking user to hotel
4. **Bookings** (optional but recommended for analytics)
5. **Reviews** (optional)
6. **Media** (optional)
7. **Rooms** (optional)

---

## 🎓 Understanding the Flow

### **Login Flow:**
```
User enters credentials
    ↓
POST /api/v1/auth/login
    ↓
Backend validates & returns {token, user}
    ↓
Token saved to localStorage
    ↓
Fetch user's hotels
    ↓
Redirect to /dashboard
    ↓
Load hotel analytics
```

### **Dashboard Data Flow:**
```
Dashboard page loads
    ↓
Get hotel ID from AuthContext
    ↓
Call apiClient.analytics.getHotelAnalytics(hotelId)
    ↓
API fetches bookings, reviews, media, rooms
    ↓
Calculate statistics
    ↓
Return aggregated data
    ↓
Components render with real data
```

---

## 🚀 Next Steps

### **Immediate (Already Done):**
✅ Authentication system
✅ Dashboard overview with real analytics
✅ All chart components connected
✅ Hotel selector for multi-hotel management
✅ Loading and error states

### **Optional Enhancements:**
These pages have UI but can be connected to API:

1. **Bookings Page** - Use `apiClient.bookings.*` methods
2. **Reviews Page** - Use `apiClient.reviews.*` methods
3. **Gallery Page** - Use `apiClient.media.*` methods
4. **Rooms Page** - Use `apiClient.rooms.*` methods

All API methods are ready to use!

---

## 📚 Documentation

For detailed documentation, see:
- [`admin-dashboard/INTEGRATION_README.md`](admin-dashboard/INTEGRATION_README.md) - Complete integration guide
- [`Backend/README.md`](Backend/README.md) - Backend API documentation (if exists)

---

## ✅ Checklist Before Testing

- [ ] Backend server running on port 8000
- [ ] Admin dashboard running on port 3000
- [ ] `.env.local` file exists with correct API URL
- [ ] Database has hotel manager user
- [ ] User is linked to a hotel in `hotelManagement` table
- [ ] Hotel exists in `hotels` table
- [ ] (Optional) Hotel has some bookings/reviews for data

---

## 🎉 Success Indicators

You've successfully integrated when you see:

✅ Login page accepts credentials
✅ Dashboard shows after login
✅ Real hotel name in header
✅ Real booking count (not mock data)
✅ Real revenue amount
✅ Charts showing actual data
✅ Reviews from your database
✅ Upcoming bookings (if any)
✅ Can logout and login again

---

## 💡 Pro Tips

1. **Check Browser Console** - All API calls are logged
2. **Check Network Tab** - See actual API requests
3. **Use React DevTools** - Inspect AuthContext state
4. **Check Backend Logs** - See incoming requests
5. **Test with Different Hotels** - If you have multiple

---

## 🆘 Need Help?

1. Check browser console for errors
2. Check backend console for errors
3. Review [`INTEGRATION_README.md`](admin-dashboard/INTEGRATION_README.md)
4. Verify database has required data
5. Check API responses in Network tab

---

## 🎊 You're All Set!

Your Nestly App admin dashboard is now **fully integrated** with the backend!

**Features Working:**
- ✅ Secure authentication
- ✅ Personalized dashboards
- ✅ Real-time analytics
- ✅ Live booking data
- ✅ Customer insights
- ✅ Revenue tracking
- ✅ Multi-hotel management

**Start managing your hotels now!** 🏨✨
