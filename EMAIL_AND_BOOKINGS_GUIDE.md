# 📧🏨 Email & Bookings System Guide

## 🎉 What's New

### 1. ✅ **Email Verification Fixed**
- **Dual Email System**: Mailjet primary, Gmail fallback
- **Better Logging**: Detailed error messages
- **Debug Endpoints**: Test email functionality easily

### 2. 🏨 **Bookings Management System**
- View **upcoming** bookings
- View **completed** bookings
- View **all** bookings
- Generate **invoices** for any booking
- Beautiful UI with status indicators

---

## 📧 Email System

### How It Works Now

The system tries to send emails in this order:
1. **Mailjet** (Primary) - Professional email service
2. **Gmail SMTP** (Fallback) - If Mailjet fails

### Setup Gmail Fallback

Your `.env` already has Gmail configured:
```env
EMAIL_USER=ndahayokevin1@gmail.com
EMAIL_PASSWORD=dytz fuqv tghk pykg
```

✅ This is an **App Password** - it should work!

### Test Email System

**1. Check Configuration:**
```bash
curl http://localhost:8000/api/v1/auth/email-debug
```

**2. Send Test Email:**
```bash
curl -X POST http://localhost:8000/api/v1/auth/test-email \
  -H "Content-Type: application/json" \
  -d '{"email":"your-email@gmail.com"}'
```

**3. Register and Watch Logs:**
- Start backend: `cd Backend && npm run dev`
- Register a new user
- Watch terminal for email logs:
  ```
  📧 Attempting to send via Mailjet...
  ⚠️  Mailjet failed, trying Nodemailer (Gmail) fallback...
  ✅ Verification email sent successfully via Nodemailer
  ```

### Troubleshooting Emails

| Issue | Solution |
|-------|----------|
| No email received | Check spam folder |
| Mailjet fails | Gmail fallback should work automatically |
| Gmail fails too | Verify EMAIL_PASSWORD in `.env` |
| "Authentication failed" | Use App Password, not regular Gmail password |

---

## 🏨 Bookings & Invoices System

### Backend API Endpoints

All endpoints require authentication (`Authorization: Bearer {token}`)

#### 1. Get All Bookings
```
GET /api/v1/my-bookings
```

**Response:**
```json
{
  "success": true,
  "message": "Bookings retrieved successfully",
  "data": {
    "bookings": [
      {
        "id": "uuid",
        "hotel_name": "Grand Hotel",
        "hotel_city": "Kigali",
        "check_in_date": "2025-11-01T00:00:00.000Z",
        "check_out_date": "2025-11-03T00:00:00.000Z",
        "total_price": "50000",
        "currency": "RWF",
        "payment_status": "completed",
        "rooms": [
          {
            "room_type": "Deluxe Suite",
            "num_rooms": 1,
            "num_guests": 2
          }
        ]
      }
    ]
  }
}
```

#### 2. Get Upcoming Bookings
```
GET /api/v1/my-bookings/upcoming
```

Returns only bookings with check-in date in the future.

#### 3. Get Completed Bookings
```
GET /api/v1/my-bookings/completed
```

Returns only bookings with check-out date in the past.

#### 4. Get Specific Booking
```
GET /api/v1/my-bookings/:bookingId
```

#### 5. Get Invoice for Booking
```
GET /api/v1/my-bookings/:bookingId/invoice
```

**Response:**
```json
{
  "success": true,
  "message": "Invoice generated successfully",
  "data": {
    "invoice": {
      "invoice_number": "INV-A1B2C3D4-2025",
      "booking_id": "uuid",
      "issue_date": "2025-10-02T12:00:00.000Z",
      "hotel_name": "Grand Hotel",
      "hotel_address": "123 Main St",
      "hotel_city": "Kigali",
      "hotel_country": "Rwanda",
      "check_in_date": "2025-11-01",
      "check_out_date": "2025-11-03",
      "num_nights": 2,
      "rooms": [
        {
          "room_type": "Deluxe Suite",
          "num_rooms": 1,
          "num_guests": 2,
          "price_per_night": "25000.00",
          "subtotal": "50000.00"
        }
      ],
      "subtotal": "50000.00",
      "tax": "5000.00",
      "total": "55000.00",
      "currency": "RWF",
      "payment_status": "completed",
      "payment_date": "2025-10-01T10:00:00.000Z",
      "tx_ref": "rwpay_1234567890_abc123"
    }
  }
}
```

---

## 📱 Frontend: MyBookingsScreen

### Features

#### 1. **Three Tabs**
- **Upcoming**: Bookings with check-in in the future
- **Completed**: Past bookings
- **All**: Everything

#### 2. **Booking Cards**
- Hotel name and location
- Check-in/check-out dates
- Room details
- Total price
- Payment status badge (color-coded)

#### 3. **Invoice Modal**
- Complete invoice details
- Hotel information
- Stay details (check-in, check-out, nights)
- Room breakdown with prices
- Payment summary (subtotal, tax, total)
- Payment status and transaction reference

#### 4. **Pull to Refresh**
Swipe down to refresh bookings list

#### 5. **Empty States**
- Not logged in → Sign In button
- No bookings → Explore Hotels button

---

## 🚀 How to Use

### 1. Add to Navigation

In your navigation file (e.g., `App.js` or navigation stack):

```javascript
import MyBookingsScreen from './screens/MyBookingsScreen';

// In your stack navigator:
<Stack.Screen
  name="MyBookings"
  component={MyBookingsScreen}
  options={{ title: 'My Bookings' }}
/>
```

### 2. Add to Bottom Tab (Optional)

```javascript
<Tab.Screen
  name="MyBookings"
  component={MyBookingsScreen}
  options={{
    tabBarLabel: 'Bookings',
    tabBarIcon: ({ color, size }) => (
      <MaterialIcons name="event" size={size} color={color} />
    ),
  }}
/>
```

### 3. Navigate from Profile

In `ProfileScreen.js`, add a menu item:

```javascript
<MenuItem
  icon={<MaterialIcons name="event-note" size={22} color="#1995AD" />}
  title="My Bookings"
  onPress={() => navigation.navigate("MyBookings")}
/>
```

---

## 🎨 UI Features

### Status Colors

| Status | Color | Hex |
|--------|-------|-----|
| Completed | Green | #34C759 |
| Pending | Orange | #FF9500 |
| Failed | Red | #FF3B30 |
| Cancelled | Gray | #8E8E93 |

### Responsive Design

- Works on all screen sizes
- Scrollable content
- Touch-optimized buttons
- Loading states
- Error handling

---

## 🔧 Testing

### Test Complete Flow

1. **Start Backend**
   ```bash
   cd Backend
   npm run dev
   ```

2. **Register & Login**
   - Register a new user
   - Check email (or spam)
   - Click verification link
   - Login to app

3. **Create a Booking**
   - Browse hotels
   - Select a room
   - Complete booking
   - Pay with test card

4. **View Bookings**
   - Navigate to MyBookings screen
   - See your booking in "Upcoming" tab
   - Click "View Invoice"
   - See detailed invoice

5. **After Check-out Date**
   - Booking moves to "Completed" tab
   - Invoice still accessible

---

## 📊 Database Schema

The bookings system uses existing tables:

### `bookings` table
```sql
- id (uuid)
- user_id (uuid)
- hotel_id (uuid)
- check_in_date (timestamp)
- check_out_date (timestamp)
- total_price (decimal)
- currency (varchar)
- payment_status (enum: pending, completed, failed, cancelled)
- tx_ref (varchar)
- cancelled (boolean)
- created_at (timestamp)
```

### `booking_room_types` table
```sql
- id (uuid)
- booking_id (uuid)
- roomTypeId (uuid)
- num_rooms (integer)
- num_guests (integer)
```

---

## 🐛 Troubleshooting

### Email Issues

**Problem**: Email not sending via Mailjet
```
✅ Solution: Gmail fallback will automatically try
```

**Problem**: Gmail also fails
```
❌ Error: "Invalid login"
✅ Solution:
1. Go to Google Account → Security
2. Enable 2-Factor Authentication
3. Generate App Password
4. Update EMAIL_PASSWORD in .env
```

### Booking Issues

**Problem**: No bookings showing
```
✅ Solutions:
1. Check if user is authenticated
2. Verify authToken is valid
3. Check backend logs for errors
4. Ensure bookings exist in database
```

**Problem**: Invoice not loading
```
✅ Solutions:
1. Check booking ID is valid
2. Verify user owns the booking
3. Check backend logs
4. Ensure all room data exists
```

---

## 📝 API Authentication

All booking endpoints require JWT token:

```javascript
const response = await axios.get(url, {
  headers: {
    Authorization: `Bearer ${authToken}`
  }
});
```

The `authToken` comes from AuthContext after login.

---

## 🎯 Key Benefits

### For Users
✅ View all bookings in one place
✅ Separate upcoming and completed bookings
✅ Download/view invoices anytime
✅ Track payment status
✅ See detailed booking information

### For Developers
✅ Clean, reusable API endpoints
✅ Secure (requires authentication)
✅ Detailed error messages
✅ Beautiful, responsive UI
✅ Easy to extend

---

## 🚀 Next Steps

### Recommended Enhancements

1. **Download Invoice as PDF**
   ```javascript
   // Use react-native-pdf or similar
   ```

2. **Email Invoice to User**
   ```javascript
   // Add endpoint: POST /api/v1/my-bookings/:id/email-invoice
   ```

3. **Booking Cancellation**
   ```javascript
   // Add endpoint: POST /api/v1/my-bookings/:id/cancel
   ```

4. **Booking Modification**
   ```javascript
   // Add endpoint: PATCH /api/v1/my-bookings/:id
   ```

5. **Push Notifications**
   - Booking confirmed
   - Check-in reminder (1 day before)
   - Check-out reminder

---

## ✅ Summary

### Email System
- ✅ Dual service (Mailjet + Gmail)
- ✅ Automatic fallback
- ✅ Better error logging
- ✅ Test endpoints

### Bookings System
- ✅ Backend API complete
- ✅ Frontend UI built
- ✅ Invoice generation
- ✅ Status tracking
- ✅ Ready to use!

---

## 📞 Support

If you encounter issues:

1. **Check Backend Logs** - Most errors appear here
2. **Test Email System** - Use debug endpoints
3. **Verify Authentication** - Ensure user is logged in
4. **Check Database** - Ensure bookings exist

**Files Modified:**
- `Backend/src/repository/nodemailer.ts` (NEW)
- `Backend/src/repository/sendEmails.ts` (UPDATED)
- `Backend/src/repository/Booking.ts` (NEW)
- `Backend/src/services/bookingService.ts` (NEW)
- `Backend/src/routes/bookings.ts` (NEW)
- `Backend/index.ts` (UPDATED)
- `Frontend/screens/MyBookingsScreen.js` (NEW)

---

**Happy Booking! 🎉**
