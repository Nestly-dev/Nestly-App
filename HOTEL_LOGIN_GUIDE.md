# 🏨 Hotel Login Guide - Nestly Dashboard

## ✅ **SETUP COMPLETE!**

Your admin dashboard now uses **Hotel ID-based authentication** where each hotel logs in with their unique ID and sees only their own data.

---

## 🎯 **How It Works**

### **Hotel-Specific Login**
- Each hotel has a **unique Hotel ID** (UUID)
- Hotels login with their ID + password
- Each hotel sees **ONLY their own data:**
  - ✅ Their bookings only
  - ✅ Their reviews only
  - ✅ Their rooms only
  - ✅ Their media only
  - ✅ Their analytics only

### **No Cross-Hotel Data Access**
- Hotel A cannot see Hotel B's data
- Complete data isolation per hotel
- Secure and personalized dashboards

---

## 🔐 **Hotel Login Credentials**

### **All Hotels Password: `Hotel2024`**

Copy any Hotel ID below to login:

### **Rwanda Hotels:**

**1. Kigali Serena Hotel**
```
Hotel ID: 6857fc86-efff-4c27-a0a0-9549dc9c3bb8
Password: Hotel2024
Location: Kigali, Rwanda
```

**2. One&Only Gorilla's Nest**
```
Hotel ID: 7e094223-5807-4970-9399-b3d0b9a9e449
Password: Hotel2024
Location: Musanze, Rwanda
```

**3. Bisate Lodge**
```
Hotel ID: 5c376ad2-7900-47d3-9b02-ed6f708b4949
Password: Hotel2024
Location: Musanze, Rwanda
```

**4. Virunga Lodge**
```
Hotel ID: 4eb5ce25-f501-4903-8534-2f157595afcf
Password: Hotel2024
Location: Ruhengeri, Rwanda
```

**5. Lake Kivu Serenity Lodge**
```
Hotel ID: 8224ec85-62e7-4def-b549-16dd3d8430d4
Password: Hotel2024
Location: Gisenyi, Rwanda
Email: johndoe@gmail.com
Phone: 0783520488
```

**6. Muhazi Hotel Resort**
```
Hotel ID: 23d8995d-7011-4b37-a66e-9b217c8ea3e7
Password: Hotel2024
Location: Rwamagana City, Rwanda
```

**7. Muhazi Hotel**
```
Hotel ID: abbd6f05-466f-4b37-96ef-85b5c16afbbc
Password: Hotel2024
Location: Rwamagana, Rwanda
```

**8. Bugesera Hotel Resort**
```
Hotel ID: 66b34e9f-b561-49a2-9e89-bda96c51bdd2
Password: Hotel2024
Location: Bugesera City, Rwanda
```

**9. Bugesera Hotel Resort (2)**
```
Hotel ID: 1888d28a-0e1e-445b-aa92-44de86f24fa8
Password: Hotel2024
Location: Bugesera City, Rwanda
```

**10. Bugarama Resort Hotel**
```
Hotel ID: 0190bc0f-eccc-42a5-b1de-7ccbfca36bcd
Password: Hotel2024
Location: Rwamagana, Rwanda
Email: contact123@Bugaramahotel.rw
Phone: 0781234567
```

### **International Hotels:**

**11. The Ritz-Carlton, Tokyo**
```
Hotel ID: 2e6db557-8bd9-4765-b586-267d4bc29632
Password: Hotel2024
Location: Tokyo, Japan
```

**12. Marina Bay Sands**
```
Hotel ID: 3ee0e1ad-b8e9-4f06-ae23-8b37b97a8302
Password: Hotel2024
Location: Singapore
```

**13. The Plaza Hotel**
```
Hotel ID: 16114bd1-59c7-43db-bdfe-1c880bb9e8f4
Password: Hotel2024
Location: New York, United States
```

**14. The Peninsula Paris**
```
Hotel ID: 7bd5c6d3-3bd7-4b0c-8c8d-d6725ed3fede
Password: Hotel2024
Location: Paris, France
```

**15. Four Seasons Hotel George V, Paris**
```
Hotel ID: b00963cb-d5ba-4954-b198-4d9180b901c0
Password: Hotel2024
Location: Paris, France
```

---

## 🚀 **Quick Start**

### **Step 1: Start Backend**
```bash
cd Backend
npm start
```
Backend runs on: http://localhost:8000

### **Step 2: Start Admin Dashboard**
```bash
cd admin-dashboard
npm run dev
```
Dashboard runs on: http://localhost:3000

### **Step 3: Login**
1. Go to http://localhost:3000
2. **Copy any Hotel ID** from above (e.g., `6857fc86-efff-4c27-a0a0-9549dc9c3bb8`)
3. **Paste the Hotel ID** in the "Hotel ID" field
4. **Enter password:** `Hotel2024`
5. Click "Access Dashboard"

### **Step 4: View Your Hotel Dashboard**
You'll see:
- Real-time analytics for YOUR hotel only
- Bookings for YOUR hotel only
- Reviews for YOUR hotel only
- Rooms in YOUR hotel only
- Media for YOUR hotel only

---

## 🎨 **Dashboard Features**

Once logged in, you'll see:

### **📊 Analytics Dashboard**
- Total bookings for your hotel
- Total revenue generated
- Active customers
- Media view counts
- Booking trends chart
- Customer analytics

### **📅 Bookings Management**
- View all bookings for your hotel
- Filter by status (pending, confirmed, cancelled)
- See upcoming reservations
- Track booking details

### **⭐ Reviews Management**
- View all reviews for your hotel
- See average rating
- Read customer feedback
- Track review trends

### **🏠 Rooms Management**
- View all your room types
- See occupancy rates
- Manage room pricing
- Track availability

### **📸 Media Gallery**
- View all hotel photos and videos
- Track view counts
- Manage media categories
- Upload new media

---

## 🔒 **Security Features**

✅ **Data Isolation**: Each hotel sees ONLY their data
✅ **Secure Authentication**: JWT token-based auth
✅ **Unique IDs**: Each hotel has a unique identifier
✅ **Password Protected**: Secure password authentication
✅ **Session Management**: Auto-logout on token expiry

---

## 🛠️ **API Endpoints**

### **Hotel Login**
```
POST /api/v1/hotel-auth/login
Body: {
  "hotel_id": "UUID-HERE",
  "password": "Hotel2024"
}
```

### **Change Hotel Password**
```
POST /api/v1/hotel-auth/set-password
Headers: Authorization: Bearer TOKEN
Body: {
  "hotel_id": "UUID-HERE",
  "new_password": "NewSecurePassword123"
}
```

### **Get Hotel Data**
```
GET /api/v1/hotel-auth/me
Headers: Authorization: Bearer TOKEN
```

---

## 📝 **Change Password (Optional)**

To change a specific hotel's password:

### **Method 1: Using curl**
```bash
curl -X POST http://localhost:8000/api/v1/hotel-auth/set-password \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "hotel_id": "6857fc86-efff-4c27-a0a0-9549dc9c3bb8",
    "new_password": "MyNewPassword123"
  }'
```

### **Method 2: Using the script**
```bash
cd Backend
node scripts/set-hotel-password.js
```
Follow the prompts to set a new password.

---

## 🧪 **Testing**

### **Test Login for Kigali Serena Hotel:**
1. Hotel ID: `6857fc86-efff-4c27-a0a0-9549dc9c3bb8`
2. Password: `Hotel2024`
3. Go to http://localhost:3000
4. Login and see Kigali Serena Hotel dashboard

### **Test Login for Lake Kivu Serenity Lodge:**
1. Hotel ID: `8224ec85-62e7-4def-b549-16dd3d8430d4`
2. Password: `Hotel2024`
3. Go to http://localhost:3000
4. Login and see Lake Kivu dashboard

**Both hotels will see completely different data!**

---

## 🐛 **Troubleshooting**

### **"Invalid Hotel ID or password"**
- Check you copied the full UUID
- Verify password is exactly: `Hotel2024`
- Ensure backend is running

### **"Internal server error"**
- Check backend console for errors
- Verify database is connected
- Ensure hotel has access_password set

### **"No data showing"**
- Normal for hotels without bookings/reviews
- Add test bookings to see data
- Check hotel ID is correct

### **"Cannot access dashboard"**
- Ensure you're logged in
- Check token is valid
- Try logging in again

---

## 📚 **Scripts Available**

```bash
# Check all hotels in database
node Backend/scripts/check-hotels.js

# Set passwords for all hotels
node Backend/scripts/set-all-hotel-passwords.js

# Verify database schema
psql DATABASE_URL < Backend/migrations/add-hotel-password.sql
```

---

## ✨ **What's Different from Before**

### **Before (Email Login):**
- Users logged in with email/password
- Complex user-hotel relationships
- Required hotel manager accounts
- Email verification needed

### **Now (Hotel ID Login):**
- ✅ Hotels login directly with their ID
- ✅ No separate user accounts needed
- ✅ Simple and straightforward
- ✅ Each hotel = one login
- ✅ Immediate access to dashboard

---

## 🎉 **You're All Set!**

Your Nestly Hotel Dashboard is now ready with:

✅ **15 hotels** with passwords set
✅ **Hotel ID authentication** working
✅ **Data isolation** per hotel
✅ **Real-time analytics** dashboard
✅ **Complete booking management**
✅ **Review tracking**
✅ **Room management**
✅ **Media gallery**

**Pick any hotel from the list above and start managing!** 🚀

---

## 📞 **Need Help?**

- Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
- Check [QUICK_START_GUIDE.md](QUICK_START_GUIDE.md)
- Check [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)
- Review backend logs for errors
- Verify database connection

---

**Happy Hotel Managing!** 🏨✨
