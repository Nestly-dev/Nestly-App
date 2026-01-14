# 🔧 Troubleshooting Guide

## Error: "Internal server error" when logging in

### **Possible Causes & Solutions**

---

## **1. Email Not Verified (Most Common)**

The backend requires email verification before login.

### **Quick Fix:**
Run this SQL in your database:

```sql
-- Verify all emails (for testing)
UPDATE "userTable"
SET email_verified = true;
```

Or use the script:
```bash
cd Backend
psql YOUR_DATABASE_URL < scripts/verify-email-manual.sql
```

---

## **2. No User Exists in Database**

### **Check if user exists:**
```sql
SELECT * FROM "userTable" WHERE email = 'your-email@example.com';
```

### **Create test account using the quick setup script:**
```bash
cd Backend
node scripts/quick-setup.js
```

This creates:
- Admin: `admin@nestly.com` / `Admin123`
- Manager: `manager@grandtest.com` / `Manager123`

---

## **3. Backend Not Running**

### **Start the backend:**
```bash
cd Backend
npm start
```

### **Verify it's running:**
```bash
curl http://localhost:8000/health
```

Should return: `{"status":"ok"}`

---

## **4. Database Connection Issues**

### **Check your `.env` file:**
```bash
cd Backend
cat .env
```

Verify `NEON_DATABASE_URL` is set correctly.

### **Test database connection:**
```bash
cd Backend
npm start
```

Look for: `✅ Database connected` in the logs.

---

## **5. Missing Environment Variables**

### **Required variables in `Backend/.env`:**
```env
NEON_DATABASE_URL=postgresql://...
PORT=8000
SALT_ROUNDS=10
ACCESS_TOKEN_SECRET=your-secret-here
```

---

## **6. CORS Issues**

### **Check backend allows admin dashboard origin:**

In `Backend/index.ts` or wherever CORS is configured, ensure:
```typescript
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

---

## **Step-by-Step Login Test**

### **1. Test backend directly:**
```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "manager@grandtest.com",
    "password": "Manager123"
  }'
```

### **Expected responses:**

#### **Success:**
```json
{
  "success": true,
  "status": 200,
  "message": "Login successful",
  "data": {
    "token": "jwt-token-here",
    "user": {
      "id": "user-id",
      "email": "manager@grandtest.com",
      "username": "hotelmanager"
    }
  }
}
```

#### **Email not verified:**
```json
{
  "success": false,
  "status": 403,
  "message": "Please verify your email before logging in"
}
```

**Fix:** Run the SQL command above to verify email.

#### **Invalid credentials:**
```json
{
  "success": false,
  "status": 401,
  "message": "Invalid email or password"
}
```

**Fix:** Check email/password are correct, or create new account.

---

## **Complete Setup from Scratch**

If nothing works, here's a complete fresh setup:

### **1. Start Backend**
```bash
cd Backend
npm install
npm start
```

### **2. Run Quick Setup**
```bash
cd Backend
node scripts/quick-setup.js
```

### **3. Verify Emails in Database**
```sql
UPDATE "userTable" SET email_verified = true;
```

### **4. Link Manager to Hotel**
```sql
-- Get user and hotel IDs
SELECT id, email FROM "userTable" WHERE email = 'manager@grandtest.com';
SELECT id, name FROM hotels WHERE name = 'Grand Test Hotel';

-- Link them
INSERT INTO "hotelManagement" (user_id, hotel_id, created_at)
VALUES ('USER_ID_FROM_ABOVE', 'HOTEL_ID_FROM_ABOVE', NOW());
```

### **5. Start Admin Dashboard**
```bash
cd admin-dashboard
npm install
npm run dev
```

### **6. Login**
Go to `http://localhost:3000`
- Email: `manager@grandtest.com`
- Password: `Manager123`

---

## **Check Backend Logs**

When you try to login, check the **Backend terminal** for errors:

### **Common errors:**

#### **"User not found"**
- User doesn't exist → Create account
- Email typo → Check spelling

#### **"Invalid password"**
- Wrong password → Try again or reset
- Password not hashed → Recreate account

#### **"Email not verified"**
- Email verification required → Run SQL to verify

#### **"Database error"**
- Database connection lost → Restart backend
- Table doesn't exist → Run migrations

---

## **Database Schema Issues**

If tables are missing, you may need to run migrations:

```bash
cd Backend
npm run migrate  # If this command exists
```

Or create tables manually (check your schema.ts file).

---

## **Quick Test Checklist**

- [ ] Backend running on port 8000
- [ ] Database connected (check backend logs)
- [ ] User exists in database
- [ ] Email is verified (`email_verified = true`)
- [ ] User has role assigned in `userRolesTable`
- [ ] Manager is linked to hotel in `hotelManagement`
- [ ] Hotel exists in `hotels` table
- [ ] Admin dashboard running on port 3000
- [ ] `.env.local` has correct API URL
- [ ] No CORS errors in browser console

---

## **Still Not Working?**

### **1. Check Browser Console**
Open Developer Tools (F12) → Console tab
Look for detailed error messages

### **2. Check Network Tab**
Open Developer Tools (F12) → Network tab
Look at the `/auth/login` request:
- What's the response status?
- What's the response body?
- Are headers correct?

### **3. Check Backend Console**
Look for error logs when login is attempted

### **4. Try Different Browser**
Sometimes browser cache causes issues

### **5. Clear localStorage**
```javascript
// In browser console:
localStorage.clear();
```

Then try logging in again.

---

## **Get the exact error:**

### **In Backend:**
Check the console when login fails. You should see:
```
Login error: [error message]
```

### **In Frontend:**
Check browser console. You should see:
```
Login error: ApiError: [error message]
```

Share the exact error message for more specific help!

---

## **Contact & Support**

If you're still stuck:
1. Check the exact error message in backend console
2. Check the API response in browser Network tab
3. Verify database has the user and hotel
4. Check all environment variables are set

---

## **Common Solutions Summary**

| Error | Solution |
|-------|----------|
| "Email not verified" | Run: `UPDATE "userTable" SET email_verified = true;` |
| "Invalid credentials" | Check email/password, or create new account |
| "Internal server error" | Check backend console for details |
| "Network error" | Ensure backend is running on port 8000 |
| "No hotel data" | Link manager to hotel in `hotelManagement` table |
| "401 Unauthorized" | Token expired, logout and login again |

---

**Most common issue:** Email not verified. Run the SQL fix above! ✅
