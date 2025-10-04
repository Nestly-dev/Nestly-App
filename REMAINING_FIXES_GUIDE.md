# Remaining Fixes Guide

## Status Summary

### ✅ COMPLETED
1. **Profile Update Error** - Fixed backend route to handle multipart/form-data
2. **Video Endpoints** - Created routes for like/unlike/save/unsave (see VIDEO_ENDPOINTS_IMPLEMENTATION.md)

### 🔧 TO FIX

## 3. Dark Mode Not Applying to All Screens

### Problem
Dark mode only affects ProfileScreen, not all screens.

### Solution
Each screen needs to import and use `useTheme()`:

```javascript
import { useTheme } from '../context/ThemeContext';

const MyScreen = () => {
  const { theme } = useTheme();

  return (
    <View style={{ backgroundColor: theme.colors.background }}>
      <Text style={{ color: theme.colors.text }}>Content</Text>
    </View>
  );
};
```

### Screens to Update (Priority Order)
1. **HomeScreen.js** - Main screen
2. **BookingScreen.js** - Booking flow
3. **PaymentScreen.js** - Payment
4. **HotelProfile.js** - Hotel details
5. **SearchScreen.js** - Search
6. **MyBookingsScreen.js** - Bookings list
7. **SigninScreen.js** & **SignUpScreen.js** - Auth screens

### Quick Pattern for Each Screen

```javascript
// 1. Import at top
import { useTheme } from '../context/ThemeContext';

// 2. Get theme in component
const { theme } = useTheme();

// 3. Apply to styles
<View style={[styles.container, { backgroundColor: theme.colors.background }]}>
  <Text style={[styles.text, { color: theme.colors.text }]}>Hello</Text>
</View>
```

### Theme Colors Available
```javascript
theme.colors.background       // Main background
theme.colors.backgroundSecondary // Cards, sections
theme.colors.text             // Primary text
theme.colors.textSecondary    // Secondary text
theme.colors.primary          // Brand color (#1995AD)
theme.colors.card             // Card backgrounds
theme.colors.border           // Borders
theme.colors.error            // Error messages
theme.colors.success          // Success messages
```

---

## 4. Currency Selector Not Displaying

### Problem
Currency options not showing in the selector.

### Debug Steps

1. **Check if CurrencyProvider is working**:
```javascript
// In ProfileScreen.js, add:
console.log('Available currencies:', availableCurrencies);
console.log('Selected currency:', selectedCurrency);
```

2. **Verify CurrencySelector is receiving props**:
```javascript
// In CurrencySelector.js line 24, add:
console.log('Modal visible:', visible);
console.log('Currencies:', availableCurrencies);
```

3. **Check if modal is opening**:
- Does the modal overlay appear when you click Currency?
- If yes but no currencies show, it's a rendering issue
- If no modal at all, check the `visible` state

### Potential Fix
The issue might be that `availableCurrencies` is undefined. Update CurrencyContext.js:

```javascript
// In CurrencyContext.js, check line 15:
export const CurrencyProvider = ({ children }) => {
  const [selectedCurrency, setSelectedCurrency] = useState('RWF');
  const [exchangeRates] = useState(EXCHANGE_RATES);

  // Add this line:
  const availableCurrencies = Object.keys(EXCHANGE_RATES); // ['RWF', 'USD', 'EUR', 'GBP']

  return (
    <CurrencyContext.Provider value={{
      selectedCurrency,
      changeCurrency,
      convertPrice,
      formatPrice,
      getCurrencySymbol,
      availableCurrencies, // Make sure this is here
      exchangeRates
    }}>
      {children}
    </CurrencyContext.Provider>
  );
};
```

---

## 5. Add Loading Screen to BookingScreen

### Implementation

```javascript
// In BookingScreen.js

import { ActivityIndicator } from 'react-native';

const BookingScreen = () => {
  const [isLoadingRooms, setIsLoadingRooms] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingRooms(true);
      try {
        // Your existing fetch logic
        await fetchHotelAndRoomInfo();
      } finally {
        setIsLoadingRooms(false);
      }
    };
    fetchData();
  }, []);

  // Add loading state UI
  if (isLoadingRooms) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1995AD" />
        <Text style={styles.loadingText}>Loading rooms...</Text>
      </View>
    );
  }

  // Rest of your component
  return (
    <ScrollView>
      {/* Your existing UI */}
    </ScrollView>
  );
};

// Add styles
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  // ... other styles
});
```

---

## 6. Integrate View Count in VideoScroll

### Current State
- Backend has view count endpoint: `PATCH /:videoId/views`
- Need to integrate in frontend

### Implementation

```javascript
// In VideoScroll.js

// Add this useEffect to track video views
useEffect(() => {
  if (activePostId && authToken) {
    // Increment view count after 3 seconds of viewing
    const viewTimer = setTimeout(() => {
      axios.patch(
        `http://${ip}:8000/api/v1/content/videos/${activePostId}/views`,
        {},
        { headers: { Authorization: `Bearer ${authToken}` }}
      ).catch(err => console.log('View count error:', err));
    }, 3000); // Count as view after 3 seconds

    return () => clearTimeout(viewTimer);
  }
}, [activePostId, authToken]);

// Display view count in VideoItem component
<View style={styles.videoStats}>
  <MaterialIcons name="visibility" size={14} color="white" />
  <Text style={styles.viewCount}>{item.view_count || 0} views</Text>
</View>
```

### Add Styles

```javascript
videoStats: {
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: 4,
},
viewCount: {
  color: 'white',
  fontSize: 12,
  marginLeft: 4,
  opacity: 0.8,
},
```

---

## Quick Implementation Checklist

### Immediate Priority (30 minutes)
- [ ] Fix Currency Display
  - [ ] Add debug logs
  - [ ] Verify availableCurrencies prop
  - [ ] Test modal opening

- [ ] Add Loading to BookingScreen
  - [ ] Add isLoadingRooms state
  - [ ] Add loading UI
  - [ ] Test with room fetching

### Medium Priority (1-2 hours)
- [ ] Apply Dark Mode to All Screens
  - [ ] HomeScreen
  - [ ] BookingScreen
  - [ ] PaymentScreen
  - [ ] HotelProfile
  - [ ] SearchScreen
  - [ ] Auth screens

### Low Priority (30 minutes)
- [ ] Integrate View Count
  - [ ] Add view tracking on video watch
  - [ ] Display view count in UI

### Backend (When Ready)
- [ ] Implement video like/save service methods
- [ ] Run SQL to create tables
- [ ] Test endpoints
- [ ] Uncomment frontend API calls

---

## Testing Guide

### Test Dark Mode
1. Go to Profile → Preferences
2. Toggle Dark Mode
3. Navigate to each screen
4. Verify colors change

### Test Currency
1. Go to Profile → Preferences
2. Click Currency
3. Modal should show 4 currencies with flags
4. Select USD
5. Check prices throughout app convert

### Test Booking Loading
1. Navigate to a hotel
2. Click "Book Now"
3. Should see loading spinner
4. Rooms appear after loading

---

## Files Reference

- **Dark Mode**: `Frontend/context/ThemeContext.js`
- **Currency**: `Frontend/context/CurrencyContext.js`
- **Currency Selector**: `Frontend/components/CurrencySelector.js`
- **Video Endpoints**: `Backend/VIDEO_ENDPOINTS_IMPLEMENTATION.md`
- **App Providers**: `Frontend/App.js` (already wrapped)

---

## Need Help?

1. **Currency not showing?** → Add console.logs in CurrencySelector
2. **Dark mode not working?** → Check if screen imports useTheme
3. **Loading not showing?** → Check isLoadingRooms state changes
4. **Backend errors?** → Check VIDEO_ENDPOINTS_IMPLEMENTATION.md

All core systems are in place, just need to apply them to individual screens!
