# 🚀 Quick API Reference

## 📧 Email Endpoints

### Test Email
```bash
POST /api/v1/auth/test-email

Body:
{
  "email": "test@example.com"
}
```

### Check Email Configuration
```bash
GET /api/v1/auth/email-debug
```

---

## 🏨 Bookings Endpoints

**All require:** `Authorization: Bearer {token}`

### 1. Get All Bookings
```bash
GET /api/v1/my-bookings
```

### 2. Get Upcoming Bookings
```bash
GET /api/v1/my-bookings/upcoming
```

### 3. Get Completed Bookings
```bash
GET /api/v1/my-bookings/completed
```

### 4. Get Specific Booking
```bash
GET /api/v1/my-bookings/:bookingId
```

### 5. Get Invoice
```bash
GET /api/v1/my-bookings/:bookingId/invoice
```

---

## 🧪 Quick Test Commands

### Test Email
```bash
curl -X POST http://localhost:8000/api/v1/auth/test-email \
  -H "Content-Type: application/json" \
  -d '{"email":"your@email.com"}'
```

### Get Upcoming Bookings
```bash
curl -X GET http://localhost:8000/api/v1/my-bookings/upcoming \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Get Invoice
```bash
curl -X GET http://localhost:8000/api/v1/my-bookings/BOOKING_ID/invoice \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 📱 Frontend Usage

### Import Screen
```javascript
import MyBookingsScreen from './screens/MyBookingsScreen';
```

### Add to Navigation
```javascript
<Stack.Screen
  name="MyBookings"
  component={MyBookingsScreen}
/>
```

### Navigate
```javascript
navigation.navigate('MyBookings');
```

---

## 🎨 Status Colors

```javascript
const statusColors = {
  completed: '#34C759',  // Green
  pending: '#FF9500',    // Orange
  failed: '#FF3B30',     // Red
  cancelled: '#8E8E93'   // Gray
};
```

---

## ⚡ Quick Setup

```bash
# 1. Start backend
cd Backend && npm run dev

# 2. Test email
curl -X POST http://localhost:8000/api/v1/auth/test-email \
  -H "Content-Type: application/json" \
  -d '{"email":"test@gmail.com"}'

# 3. Done! ✅
```

---

## 📋 Environment Variables

```env
# Mailjet (Primary)
Node_MailJet_APIKEY_PUBLIC=your_key
Node_MailJet_APIKEY_PRIVATE=your_key
FROM_EMAIL=atnestly@gmail.com

# Gmail (Fallback)
EMAIL_USER=your@gmail.com
EMAIL_PASSWORD=your_app_password
```

---

## 🔑 Key Features

✅ Dual email system (Mailjet → Gmail)
✅ Booking management (upcoming/completed/all)
✅ Invoice generation
✅ Authentication required
✅ Pull to refresh
✅ Beautiful UI with status colors

---

**For detailed docs, see:** `EMAIL_AND_BOOKINGS_GUIDE.md`
