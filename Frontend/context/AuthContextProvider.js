import React, { useState, useEffect } from "react";
import AuthContext from "./AuthContext";
import * as SecureStore from "expo-secure-store";

const UserContexProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [signedIn, setSignedIn] = useState(false);
  const [authStatus, setAuthStatus] = useState("notLoggedIn");
  const [showLogIn, setShowLogIn] = useState(true)


// initialising the app

const initializeAuth = async () => {
    try {
      // Load auth status
      const storedAuthStatus = await SecureStore.getItemAsync("isLoggedIn");
      if (storedAuthStatus === "loggedIn") {
        setAuthStatus("loggedIn");
        setSignedIn(true);
        
        // Load user data
        const storedUserData = await SecureStore.getItemAsync("CurrentUser");
        if (storedUserData) {
          const userData = JSON.parse(storedUserData);
          setUser(userData);
        }
      }
    } catch (error) {
      console.error("Error initializing auth:", error);
    }
  };

useEffect(() =>{
    initializeAuth()
})


// all the savings

  const saveAuthStatus = async (key, value) => {
    const valueToStore = typeof value === 'string' ? value : JSON.stringify(value);
    try {
      await SecureStore.setItemAsync(key, valueToStore);
    } catch (error) {
      console.error("Error saving auth status:", error);
    }
  };


  const saveUserDetails = async (key, value) =>{
    const valueToStore = typeof value === "string" ? value : JSON.stringify(value)
    try {
        await SecureStore.setItemAsync(key, valueToStore);
        console.log("The user details saved are,", valueToStore);
    } catch (error) {
        console.error("Error saving the user", error);
    }
  }

  // all the loads and data retrieving

  const loadAuthStatus = async (key) => {
    try {
      let result = await SecureStore.getItemAsync(key);
      console.log("Loaded auth status:", result);
      if (result) {
        setAuthStatus(result);
      }
    } catch (error) {
      console.error("Error loading auth status:", error);
    }
  };

  const loadUserDetails = async (key) =>{
    try {
        let result = await SecureStore.getItemAsync(key)
        console.log("Raw stored user data:", result)
        if(result) {
          // Parse the JSON string back to an object
          const userData = JSON.parse(result)
          console.log("Parsed user data:", userData)
          setUser(userData)
        }
      } catch (error) {
        console.error("Error loading user details", error);
      }
  }


  const value = {
    user,
    setUser,
    setSignedIn,
    signedIn,
    authStatus,
    setAuthStatus,
    saveAuthStatus,
    loadAuthStatus,
    saveUserDetails,
    loadUserDetails
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default UserContexProvider;