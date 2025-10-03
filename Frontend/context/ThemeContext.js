// Frontend/context/ThemeContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'react-native';

const ThemeContext = createContext();

const lightTheme = {
  mode: 'light',
  colors: {
    // Primary
    primary: '#1995AD',
    primaryLight: '#abe3ed',
    primaryDark: '#147a8d',

    // Backgrounds
    background: '#FFFFFF',
    backgroundSecondary: '#F8F9FA',
    card: '#FFFFFF',
    cardBorder: '#E5E5EA',

    // Text
    text: '#1C1C1E',
    textSecondary: '#8E8E93',
    textTertiary: '#C7C7CC',

    // UI Elements
    border: '#E5E5EA',
    divider: '#E5E5EA',
    shadow: 'rgba(0, 0, 0, 0.1)',

    // Status
    success: '#34C759',
    error: '#FF3B30',
    warning: '#FF9500',
    info: '#007AFF',

    // Interactive
    button: '#1995AD',
    buttonText: '#FFFFFF',
    link: '#007AFF',

    // Special
    overlay: 'rgba(0, 0, 0, 0.5)',
    disabled: '#C7C7CC',
  }
};

const darkTheme = {
  mode: 'dark',
  colors: {
    // Primary
    primary: '#1995AD',
    primaryLight: '#2da6bf',
    primaryDark: '#147a8d',

    // Backgrounds
    background: '#000000',
    backgroundSecondary: '#1C1C1E',
    card: '#2C2C2E',
    cardBorder: '#38383A',

    // Text
    text: '#FFFFFF',
    textSecondary: '#8E8E93',
    textTertiary: '#48484A',

    // UI Elements
    border: '#38383A',
    divider: '#38383A',
    shadow: 'rgba(255, 255, 255, 0.05)',

    // Status
    success: '#32D74B',
    error: '#FF453A',
    warning: '#FF9F0A',
    info: '#0A84FF',

    // Interactive
    button: '#1995AD',
    buttonText: '#FFFFFF',
    link: '#0A84FF',

    // Special
    overlay: 'rgba(0, 0, 0, 0.75)',
    disabled: '#48484A',
  }
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  const theme = isDark ? darkTheme : lightTheme;

  useEffect(() => {
    loadTheme();
  }, []);

  useEffect(() => {
    // Update StatusBar when theme changes
    StatusBar.setBarStyle(isDark ? 'light-content' : 'dark-content', true);
  }, [isDark]);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('appTheme');
      if (savedTheme === 'dark') {
        setIsDark(true);
        console.log('✅ Dark mode loaded');
      } else {
        console.log('✅ Light mode loaded');
      }
    } catch (error) {
      console.error('❌ Error loading theme:', error);
    }
  };

  const toggleTheme = async () => {
    try {
      const newTheme = !isDark;
      await AsyncStorage.setItem('appTheme', newTheme ? 'dark' : 'light');
      setIsDark(newTheme);
      console.log(`✅ Theme switched to: ${newTheme ? 'dark' : 'light'}`);
    } catch (error) {
      console.error('❌ Error saving theme:', error);
    }
  };

  const setTheme = async (mode) => {
    try {
      const darkMode = mode === 'dark';
      await AsyncStorage.setItem('appTheme', mode);
      setIsDark(darkMode);
      console.log(`✅ Theme set to: ${mode}`);
    } catch (error) {
      console.error('❌ Error setting theme:', error);
    }
  };

  return (
    <ThemeContext.Provider value={{
      theme,
      isDark,
      toggleTheme,
      setTheme,
      colors: theme.colors
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export default ThemeContext;
