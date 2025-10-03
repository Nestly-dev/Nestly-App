# Quick Start Checklist

Follow these steps in order to integrate all new features:

## Phase 1: Setup (15 minutes)

### ☐ 1. Install Packages
```bash
cd Frontend
npm install expo-image-picker expo-document-picker
```

### ☐ 2. Verify Context Files Exist
- [x] `Frontend/context/CurrencyContext.js`
- [x] `Frontend/context/ThemeContext.js`

### ☐ 3. Update App.js
Add providers (code in COMPLETE_IMPLEMENTATION_SUMMARY.md)

---

## Phase 2: Core Features (1 hour)

### ☐ 4. Add to ProfileScreen
- [ ] Import useTheme and useCurrency
- [ ] Add Dark Mode toggle
- [ ] Add Currency selector

### ☐ 5. Update PersonalDetails
- [ ] Add image picker (code in FEATURE_IMPLEMENTATION_GUIDE.md)
- [ ] Add authentication header
- [ ] Test profile update

### ☐ 6. Update SecurityScreen
- [ ] Connect password change API (line 72-90)
- [ ] Test password update

---

## Phase 3: UI Updates (2 hours)

### ☐ 7. Apply Theme to Screens
Priority order:
- [ ] HomeScreen.js
- [ ] ProfileScreen.js
- [ ] BookingScreen.js
- [ ] PaymentScreen.js
- [ ] SigninScreen.js
- [ ] SignUpScreen.js

### ☐ 8. Update All Price Displays
Replace `{currency} {price}` with `{formatPrice(price, 'RWF')}`
- [ ] BookingScreen.js (lines 348, 355, 364)
- [ ] PaymentScreen.js (line 274)
- [ ] MyBookingsScreen.js
- [ ] HotelProfile.js

---

## Phase 4: Video Features (30 minutes)

### ☐ 9. Update VideoScroll Component
- [ ] Replace username with hotel name
- [ ] Add Like button with counter
- [ ] Add Save button
- [ ] Replace Follow with Book button

---

## Phase 5: Testing (30 minutes)

### ☐ 10. Test Currency System
- [ ] Change currency in ProfileScreen
- [ ] Verify prices update across app
- [ ] Test persistence (close/reopen app)

### ☐ 11. Test Dark Mode
- [ ] Toggle dark mode in ProfileScreen
- [ ] Check all screens have proper colors
- [ ] Test persistence

### ☐ 12. Test Profile Features
- [ ] Upload profile picture
- [ ] Update profile info
- [ ] Change password

### ☐ 13. Test Video Features
- [ ] Like a video
- [ ] Save a video
- [ ] Book button navigation

---

## Quick Reference

### Import Statements
```javascript
// For currency
import { useCurrency } from '../context/CurrencyContext';

// For theme
import { useTheme } from '../context/ThemeContext';

// In component
const { formatPrice, selectedCurrency } = useCurrency();
const { theme, isDark, toggleTheme } = useTheme();
```

### Common Patterns
```javascript
// Price display
<Text>{formatPrice(price, 'RWF')}</Text>

// Theme background
<View style={{ backgroundColor: theme.colors.background }}>

// Theme text
<Text style={{ color: theme.colors.text }}>
```

---

## Files to Reference

1. **COMPLETE_IMPLEMENTATION_SUMMARY.md** - Overview and next steps
2. **FEATURE_IMPLEMENTATION_GUIDE.md** - Detailed code for each feature
3. **IMPLEMENTATION_PLAN.md** - Project planning

---

## Estimated Completion Time

- **Minimum viable**: 2 hours (core features only)
- **Full implementation**: 4 hours (all features)
- **With testing**: 5 hours (recommended)

---

## Need Help?

Each feature has complete, copy-paste ready code in:
`FEATURE_IMPLEMENTATION_GUIDE.md`

Start with Phase 1 and work through sequentially!
