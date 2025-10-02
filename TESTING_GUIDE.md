# 🧪 Nestly App - Testing & Configuration Guide

This guide will help you test and configure the email verification, payment system, and logout functionality.

---

## 📧 1. Email Verification System (Mailjet)

### Current Configuration
- **Service**: Mailjet
- **API Keys**: Already configured in `.env`
- **Sender Email**: `atnestly@gmail.com`

### ⚠️ Important: Verify Sender Email with Mailjet

Before emails will work, you **MUST** verify the sender email address with Mailjet:

1. **Login to Mailjet Dashboard**
   - Go to: https://app.mailjet.com/account/sender
   - Login with your Mailjet account

2. **Add/Verify Sender Email**
   - Click "Add a Sender Domain or Address"
   - Add: `atnestly@gmail.com`
   - Mailjet will send a verification email
   - Click the verification link in that email
   - ✅ Status should change to "Verified"

### Test Email Configuration

**Test Endpoint**: `POST http://localhost:8000/api/v1/auth/test-email`

**Request Body**:
```json
{
  "email": "your-email@example.com"
}
```

**Using curl**:
```bash
curl -X POST http://localhost:8000/api/v1/auth/test-email \
  -H "Content-Type: application/json" \
  -d '{"email":"your-email@example.com"}'
```

**Expected Response**:
```json
{
  "success": true,
  "message": "Test email sent successfully! Check your inbox."
}
```

### Check Backend Logs

When testing email, check your backend terminal for detailed logs:

```
📧 ============ EMAIL SENDING START ============
   From: atnestly@gmail.com
   To: user@example.com
   Subject: ✉️ Verify Your Nestly Email Address
📤 Sending request to Mailjet...
✅ Email sent successfully!
   Message ID: 123456789
   Status: success
============ EMAIL SENDING END ============
```

### Common Email Issues & Solutions

| Issue | Solution |
|-------|----------|
| `400 Bad Request` | Sender email not verified in Mailjet |
| `401 Unauthorized` | Check API keys in `.env` file |
| No email received | Check spam folder, verify recipient email |
| `FROM_EMAIL is not configured` | Add `FROM_EMAIL=atnestly@gmail.com` to `.env` |

---

## 💳 2. Flutterwave Payment System (Test Mode)

### Current Configuration
- **Mode**: Test Mode ✅
- **API Keys**: Already configured (FLWPUBK_TEST & FLWSECK_TEST)
- **Currency**: RWF (Rwandan Franc)

### Test Payment Flow

#### Step 1: Initiate Payment

The payment is usually triggered when a user books a hotel room. The backend will create a payment link.

**Test Card Numbers** (for Flutterwave Test Mode):

| Card Type | Card Number | CVV | Expiry | PIN |
|-----------|-------------|-----|--------|-----|
| Mastercard | `5531886652142950` | `564` | `09/32` | `3310` |
| Visa | `4187427415564246` | `828` | `09/32` | `3310` |

#### Step 2: Complete Test Payment

1. You'll receive a checkout link like: `https://checkout.flutterwave.com/v3/hosted/pay/xxx`
2. Open the link in a browser
3. Enter test card details above
4. Complete the payment flow
5. You'll be redirected back to the app

#### Step 3: Verify Payment

Backend will automatically verify the payment using the transaction reference.

### Backend Payment Logs

Look for these logs in your backend terminal:

```
💳 ============ PAYMENT INITIATION START ============
   Transaction Ref: rwpay_1696234567890_abc123
   Amount: 50000 RWF
   Customer: John Doe (john@example.com)
✅ Payment initiated successfully!
   Status: success
   Checkout Link: https://checkout.flutterwave.com/v3/hosted/pay/...
============ PAYMENT INITIATION END ============
```

### Test Payment Verification

```
🔍 ============ PAYMENT VERIFICATION START ============
   Transaction Ref: rwpay_1696234567890_abc123
   Verification Status: success
✅ Payment verified successfully!
   Amount: 50000 RWF
   Payment Status: successful
============ PAYMENT VERIFICATION END ============
```

### Common Payment Issues & Solutions

| Issue | Solution |
|-------|----------|
| Payment link not generated | Check FLW_SECRET_KEY in `.env` |
| Invalid API keys | Ensure you're using TEST keys (FLWPUBK_TEST...) |
| Payment verification fails | Check transaction reference is correct |
| 401 Unauthorized | Verify FLW_SECRET_KEY is set correctly |

---

## 🚪 3. Logout Functionality

### How It Works

1. User clicks "Log Out" button in Profile screen
2. Shows loading state with "Logging Out..."
3. Calls backend `/api/v1/auth/logout` endpoint
4. Clears auth token from SecureStore
5. Clears user data from SecureStore
6. Redirects to Welcome screen

### Test Logout

1. Login to the app
2. Navigate to Profile screen
3. Scroll down to "Log Out" button
4. Click the button
5. You should see:
   - Loading indicator
   - "Logging Out..." text
   - Automatic redirect to Welcome screen

### Logout Logs

**Backend**:
```
✅ Successfully logged out
```

**Frontend Console**:
```
✅ Logout API call successful
✅ Logout successful
```

### Common Logout Issues & Solutions

| Issue | Solution |
|-------|----------|
| Stays on Profile screen | Check navigation setup, ensure "Welcome" route exists |
| Auth token not cleared | Check SecureStore permissions |
| App crashes | Check AuthContext is properly wrapped around app |

---

## 🔄 4. Complete Registration → Login → Logout Flow

### End-to-End Test

1. **Register New Account**
   ```
   POST http://localhost:8000/api/v1/auth/register
   {
     "username": "Test User",
     "email": "test@example.com",
     "password": "Test123456"
   }
   ```

2. **Check Email**
   - Open inbox for `test@example.com`
   - Click verification link
   - Should see: "Email verified successfully"

3. **Login**
   ```
   POST http://localhost:8000/api/v1/auth/login
   {
     "email": "test@example.com",
     "password": "Test123456"
   }
   ```
   - If email not verified: You'll get 403 error
   - If verified: You'll get token and user data

4. **Use the App**
   - Browse hotels
   - Make a booking
   - Process payment (use test card)

5. **Logout**
   - Go to Profile → Log Out
   - Should redirect to Welcome screen

---

## 🛠️ Development Environment Setup

### Backend (.env file)

Make sure these are set:

```env
# Mailjet
Node_MailJet_APIKEY_PUBLIC=632188d0976f992e7aadee6c8fba825d
Node_MailJet_APIKEY_PRIVATE=a9d49b4138d4eedc40e568d25333ec8b
FROM_EMAIL=atnestly@gmail.com

# Flutterwave (Test Mode)
FLW_PUBLIC_KEY=FLWPUBK_TEST-26949d50cc5fa54ddc36dc3f49a32e2a-X
FLW_SECRET_KEY=FLWSECK_TEST-373338ebd0930f18e844a93c7723cd3e-X
FLUTTERWAVE_API_URL=https://api.flutterwave.com/v3/payments
FLUTTERWAVE_PAYMENT_VERIFICATION_URL=https://api.flutterwave.com/v3/transactions/verify_by_reference
```

### Start Backend

```bash
cd Backend
npm run dev
```

### Start Frontend

```bash
cd Frontend
npm start
```

---

## 📊 Monitoring & Debugging

### Enable Detailed Logs

All three systems now have detailed logging:

- **Email**: Look for `📧`, `✅`, `❌` emojis in logs
- **Payment**: Look for `💳`, `🔍` emojis in logs
- **Logout**: Look for `✅ Logout` messages

### Check Logs

**Backend logs**:
```bash
cd Backend
npm run dev
# Watch terminal for colored logs
```

**Frontend logs**:
```bash
# In Expo dev tools, check Metro Bundler console
# Or use React Native Debugger
```

---

## ✅ Success Checklist

### Email System
- [ ] Sender email verified in Mailjet dashboard
- [ ] Test email sends successfully
- [ ] Registration sends verification email
- [ ] Verification link works

### Payment System
- [ ] Payment link generates successfully
- [ ] Test card payment completes
- [ ] Payment verification works
- [ ] Booking status updates after payment

### Logout System
- [ ] Logout button shows loading state
- [ ] Backend logout endpoint called
- [ ] Auth data cleared from SecureStore
- [ ] Redirects to Welcome screen
- [ ] Cannot access protected routes after logout

---

## 🆘 Get Help

If you encounter issues:

1. **Check logs** - Both backend and frontend
2. **Verify configuration** - All API keys and env vars
3. **Test individually** - Test each system separately
4. **Check network** - Ensure backend is running and accessible

### Key Files to Check

- Backend: `Backend/src/repository/mailjet.ts`
- Backend: `Backend/src/repository/FlutterwavePayment.ts`
- Frontend: `Frontend/context/AuthContextProvider.js`
- Frontend: `Frontend/screens/ProfileScreen.js`

---

## 🎉 Ready to Test!

You're all set! Start with the email test endpoint, then try the full registration flow.

**Pro Tip**: Keep both backend and frontend terminals visible while testing to see real-time logs.
