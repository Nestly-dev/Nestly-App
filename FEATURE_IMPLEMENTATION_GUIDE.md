# Complete Feature Implementation Guide

## Overview
This guide covers the implementation of all requested features for the Nestly App.

## 1. Personal Details with Profile Picture Upload

### Current Status
- ✅ Basic form structure exists
- ✅ API endpoint identified: `PATCH /api/v1/profile/update/${user.id}`
- ⚠️ Needs: Image picker integration

### Implementation Steps

#### A. Install Required Packages
```bash
npm install expo-image-picker expo-document-picker
```

#### B. Update PersonalDetails.js
Key changes needed:
1. Add image picker functionality
2. Handle multipart/form-data for image upload
3. Load existing user data on mount
4. Add authentication headers

```javascript
// Add to imports
import * as ImagePicker from 'expo-image-picker';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';

// Add useEffect to load user data
useEffect(() => {
  if (user) {
    setFirstName(user.first_name || '');
    setLastName(user.last_name || '');
    setPhoneNumber(user.phone_number || '');
    setCurrency(user.preferred_currency || 'RWF');
    // ... load other fields
  }
}, [user]);

// Image picker function
const pickImage = async () => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (status !== 'granted') {
    Alert.alert('Permission needed', 'Please grant camera roll permissions');
    return;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
  });

  if (!result.canceled) {
    setAvatar(result.assets[0].uri);
  }
};

// Updated handleSubmit with proper headers and FormData
const handleSubmit = async () => {
  const formData = new FormData();

  if (avatar && avatar.startsWith('file://')) {
    formData.append('profilePicture', {
      uri: avatar,
      type: 'image/jpeg',
      name: 'profile.jpg',
    });
  }

  formData.append('first_name', firstName);
  formData.append('last_name', lastName);
  formData.append('phone_number', phoneNumber);
  formData.append('date_of_birth', birthDate.toISOString());
  formData.append('preferred_currency', currency);

  try {
    const response = await axios.patch(
      `http://${ip}:8000/api/v1/profile/update/${user.id}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${authToken}`
        }
      }
    );

    if (response.data.success) {
      Toast.show({
        type: "success",
        text1: "Profile Updated",
        text2: "Your changes have been saved",
      });
    }
  } catch (error) {
    Toast.show({
      type: "error",
      text1: "Update Failed",
      text2: error.response?.data?.message || "Please try again",
    });
  }
};
```

---

## 2. Currency Management System

### Architecture
Create a global currency context with real-time conversion.

### A. Create Currency Context

```javascript
// Frontend/context/CurrencyContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CurrencyContext = createContext();

// Exchange rates (update these from an API in production)
const EXCHANGE_RATES = {
  RWF: { USD: 0.00078, EUR: 0.00072, GBP: 0.00062, RWF: 1 },
  USD: { RWF: 1280, EUR: 0.92, GBP: 0.79, USD: 1 },
  EUR: { RWF: 1391, USD: 1.09, GBP: 0.86, EUR: 1 },
  GBP: { RWF: 1618, USD: 1.27, EUR: 1.16, GBP: 1 }
};

export const CurrencyProvider = ({ children }) => {
  const [selectedCurrency, setSelectedCurrency] = useState('RWF');
  const [exchangeRates, setExchangeRates] = useState(EXCHANGE_RATES);

  useEffect(() => {
    loadCurrency();
  }, []);

  const loadCurrency = async () => {
    try {
      const saved = await AsyncStorage.getItem('selectedCurrency');
      if (saved) setSelectedCurrency(saved);
    } catch (error) {
      console.error('Error loading currency:', error);
    }
  };

  const changeCurrency = async (currency) => {
    try {
      await AsyncStorage.setItem('selectedCurrency', currency);
      setSelectedCurrency(currency);
    } catch (error) {
      console.error('Error saving currency:', error);
    }
  };

  const convertPrice = (amount, from Currency = 'RWF') => {
    if (fromCurrency === selectedCurrency) return amount;

    const rate = exchangeRates[fromCurrency][selectedCurrency];
    return (amount * rate).toFixed(2);
  };

  const formatPrice = (amount, fromCurrency = 'RWF') => {
    const converted = convertPrice(amount, fromCurrency);
    return `${selectedCurrency} ${parseFloat(converted).toLocaleString()}`;
  };

  return (
    <CurrencyContext.Provider value={{
      selectedCurrency,
      changeCurrency,
      convertPrice,
      formatPrice,
      availableCurrencies: Object.keys(EXCHANGE_RATES)
    }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
```

### B. Wrap App with Currency Provider

```javascript
// App.js
import { CurrencyProvider } from './context/CurrencyContext';

export default function App() {
  return (
    <GestureHandlerRootView>
      <UserContexProvider>
        <CurrencyProvider>
          <AppNavigation />
        </CurrencyProvider>
      </UserContexProvider>
    </GestureHandlerRootView>
  );
}
```

### C. Currency Selector Component

```javascript
// Frontend/components/CurrencySelector.js
import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { useCurrency } from '../context/CurrencyContext';

export const CurrencySelector = ({ visible, onClose }) => {
  const { selectedCurrency, changeCurrency, availableCurrencies } = useCurrency();

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Select Currency</Text>

          {availableCurrencies.map((currency) => (
            <TouchableOpacity
              key={currency}
              style={[
                styles.currencyItem,
                selectedCurrency === currency && styles.selectedItem
              ]}
              onPress={() => {
                changeCurrency(currency);
                onClose();
              }}
            >
              <Text style={[
                styles.currencyText,
                selectedCurrency === currency && styles.selectedText
              ]}>
                {currency}
              </Text>
              {selectedCurrency === currency && (
                <Text style={styles.checkmark}>✓</Text>
              )}
            </TouchableOpacity>
          ))}

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
```

### D. Usage in Components

```javascript
// In any component (BookingScreen, PaymentScreen, etc.)
import { useCurrency } from '../context/CurrencyContext';

const SomeComponent = () => {
  const { formatPrice } = useCurrency();

  return (
    <Text>{formatPrice(50000, 'RWF')}</Text>
    // Automatically shows converted price in user's currency
  );
};
```

---

## 3. Security Screen - Password Change Integration

### Update SecurityScreen.js

```javascript
import axios from 'axios';

const handlePasswordChange = async () => {
  // Validations...

  setIsLoading(true);

  try {
    const response = await axios.post(
      `http://${ip}:8000/api/v1/auth/update-password`,
      {
        email: user.email,
        newPassword: newPassword,
        confirmPassword: confirmPassword
      },
      {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      }
    );

    if (response.data.success) {
      Alert.alert("Success", "Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  } catch (error) {
    Alert.alert(
      "Error",
      error.response?.data?.message || "Failed to update password"
    );
  } finally {
    setIsLoading(false);
  }
};
```

---

## 4. Dark Mode System

### A. Create Theme Context

```javascript
// Frontend/context/ThemeContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();

const lightTheme = {
  mode: 'light',
  colors: {
    primary: '#1995AD',
    background: '#FFFFFF',
    card: '#F8F9FA',
    text: '#1C1C1E',
    textSecondary: '#8E8E93',
    border: '#E5E5EA',
    error: '#FF3B30',
    success: '#34C759',
  }
};

const darkTheme = {
  mode: 'dark',
  colors: {
    primary: '#1995AD',
    background: '#000000',
    card: '#1C1C1E',
    text: '#FFFFFF',
    textSecondary: '#8E8E93',
    border: '#38383A',
    error: '#FF453A',
    success: '#32D74B',
  }
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  const theme = isDark ? darkTheme : lightTheme;

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme === 'dark') setIsDark(true);
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  };

  const toggleTheme = async () => {
    try {
      const newTheme = !isDark;
      await AsyncStorage.setItem('theme', newTheme ? 'dark' : 'light');
      setIsDark(newTheme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
```

### B. Wrap App

```javascript
// App.js
import { ThemeProvider } from './context/ThemeContext';

export default function App() {
  return (
    <GestureHandlerRootView>
      <UserContexProvider>
        <CurrencyProvider>
          <ThemeProvider>
            <AppNavigation />
          </ThemeProvider>
        </CurrencyProvider>
      </UserContexProvider>
    </GestureHandlerRootView>
  );
}
```

### C. Add to ProfileScreen

```javascript
import { useTheme } from '../context/ThemeContext';

const ProfileScreen = () => {
  const { theme, isDark, toggleTheme } = useTheme();

  // In Preferences section:
  <MenuItem
    icon={<Ionicons name={isDark ? "moon" : "sunny"} size={22} color="#1995AD" />}
    title="Dark Mode"
    subtitle={isDark ? "Enabled" : "Disabled"}
    onPress={toggleTheme}
  />
};
```

### D. Apply Theme to Components

```javascript
const SomeScreen = () => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={{ color: theme.colors.text }}>Hello</Text>
    </View>
  );
};
```

---

## 5. Report Problem Integration

### API Endpoint
```
POST /api/v1/support/report-problem
Headers: Authorization: Bearer {token}
Body: {
  category: string,
  subject: string,
  description: string,
  urgency: string
}
```

### Update ReportProblemScreen

```javascript
const handleSubmit = async () => {
  try {
    setIsLoading(true);
    const response = await axios.post(
      `http://${ip}:8000/api/v1/support/report-problem`,
      {
        category: selectedCategory,
        subject: subject,
        description: description,
        urgency: selectedUrgency
      },
      {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      }
    );

    if (response.data.success) {
      Alert.alert(
        "Success",
        "Your problem has been reported. We'll get back to you soon.",
        [{ text: "OK", onPress: () => navigation.goBack() }]
      );
    }
  } catch (error) {
    Alert.alert("Error", "Failed to submit report. Please try again.");
  } finally {
    setIsLoading(false);
  }
};
```

---

## 6. Help & Support Integration

Similar structure to Report Problem but for general inquiries.

---

## 7. Video Features

### A. Show Hotel Names

```javascript
// In VideoScroll.js
const VideoItem = ({ item }) => {
  return (
    <View>
      <Text style={styles.hotelName}>{item.hotel?.name || 'Unknown Hotel'}</Text>
      {/* Rest of video UI */}
    </View>
  );
};
```

### B. Like & Save Functionality

```javascript
const [likedVideos, setLikedVideos] = useState(new Set());
const [savedVideos, setSavedVideos] = useState(new Set());

const handleLike = async (videoId) => {
  try {
    await axios.post(
      `http://${ip}:8000/api/v1/videos/${videoId}/like`,
      {},
      { headers: { Authorization: `Bearer ${authToken}` }}
    );

    setLikedVideos(prev => {
      const newSet = new Set(prev);
      if (newSet.has(videoId)) {
        newSet.delete(videoId);
      } else {
        newSet.add(videoId);
      }
      return newSet;
    });
  } catch (error) {
    console.error('Like error:', error);
  }
};
```

### C. Replace Follow with Book

```javascript
<TouchableOpacity
  style={styles.bookButton}
  onPress={() => {
    setCurrentID(item.hotel_id);
    navigation.navigate('Hotel Profile');
  }}
>
  <Text style={styles.bookButtonText}>Book Now</Text>
</TouchableOpacity>
```

---

## Implementation Priority

1. ✅ Currency System (30 min)
2. ✅ Dark Mode (45 min)
3. ✅ Password Change (15 min)
4. ✅ Profile Picture Upload (30 min)
5. ✅ Report Problem (20 min)
6. ✅ Video Features (40 min)

**Total Estimated Time: ~3 hours**

## Next Steps

1. Install required packages
2. Create context files
3. Update existing screens
4. Test each feature
5. Deploy

Would you like me to implement any specific feature in detail?
