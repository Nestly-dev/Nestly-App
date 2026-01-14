"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { tokenManager } from '@/lib/apiClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = () => {
      try {
        const token = tokenManager.getToken();
        const userData = tokenManager.getUserData();
        const hotelData = tokenManager.getHotelData();

        console.log('Initializing auth:', { token: !!token, userData, hotelData });

        if (token && hotelData) {
          setUser(userData || { id: hotelData.id, username: hotelData.name, role: 'hotel' });
          setHotel(hotelData);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        // Clear invalid auth data
        tokenManager.removeToken();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const logout = () => {
    setUser(null);
    setHotel(null);
    setIsAuthenticated(false);
    tokenManager.removeToken();
    router.push('/');
  };

  const value = {
    user,
    hotel,
    loading,
    isAuthenticated,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
