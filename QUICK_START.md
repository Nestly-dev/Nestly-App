# 🚀 Quick Start - Testing Guide

## ⚡ 5-Minute Setup

### 1️⃣ Verify Mailjet Sender Email (REQUIRED!)

🔗 Go to: https://app.mailjet.com/account/sender

✅ Add and verify: `atnestly@gmail.com`

⚠️ **Without this step, emails will NOT work!**

---

### 2️⃣ Start Backend

```bash
cd Backend
npm run dev
```

Wait for: `✅ Server is running on port 8000`

---

### 3️⃣ Test Email (30 seconds)

```bash
curl -X POST http://localhost:8000/api/v1/auth/test-email \
  -H "Content-Type: application/json" \
  -d '{"email":"YOUR_EMAIL@gmail.com"}'
```

✅ Check your email inbox (or spam)

---

### 4️⃣ Test Registration Flow

**In the app:**
1. Click "Sign Up"
2. Enter details:
   - Name: Test User
   - Email: your-real-email@gmail.com
   - Password: Test123456
3. Submit ✅
4. Check email → Click verification link
5. Go back to app → Sign In
6. ✅ You're logged in!

---

### 5️⃣ Test Payment (In App)

When booking a hotel room:

1. App generates payment link
2. Opens in browser
3. Use **Test Card**:
   - Card: `5531886652142950`
   - CVV: `564`
   - Expiry: `09/32`
   - PIN: `3310`
4. Complete payment
5. ✅ Booking confirmed!

---

### 6️⃣ Test Logout

1. Go to Profile screen
2. Scroll down
3. Click "Log Out"
4. ✅ Redirected to Welcome screen

---

## 🎯 That's It!

All three systems should now work:
- ✅ Email verification
- ✅ Payment processing
- ✅ Logout functionality

---

## 📊 Check Logs

**Backend terminal shows:**
```
📧 Email sent successfully!
💳 Payment initiated successfully!
✅ Logout successful
```

**Frontend console shows:**
```
✅ User session restored
✅ Login successful
✅ Logout API call successful
```

---

## 🆘 Problems?

### Email not sending?
→ Did you verify sender email in Mailjet?

### Payment failing?
→ Are you using the test card numbers above?

### Logout not working?
→ Check if backend is running on port 8000

---

## 📖 More Info

- `FIXES_SUMMARY.md` - What was fixed
- `TESTING_GUIDE.md` - Detailed testing guide

---

**Happy Testing!** 🎉
