import React, { useState, useEffect } from "react";
import AuthContext from "./AuthContext";
import * as SecureStore from "expo-secure-store";

const UserContexProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [signedIn, setSignedIn] = useState(false);
  const [authStatus, setAuthStatus] = useState("notLoggedIn");
  const [showLogIn, setShowLogIn] = useState(true)
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [hotelData, setHotelData] = useState()
  const [currentID, setCurrentID] = useState()
  const [currentRoomId, setCurrentRoomId] = useState()
  const ip = "127.0.0.1"

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
      // load hotel data
      const storedHotelDetail = await SecureStore.getItemAsync("all-Hotels")
      if (storedHotelDetail){
        const hotelData = JSON.parse(storedHotelDetail)
        setHotelData(hotelData)
        console.log("Hotel Detail retreaved successfull 👍");
      }
    } catch (error) {
      console.error("Error initializing auth:", error);
    }
  };

useEffect(() =>{
    initializeAuth()
}, [])

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
        console.log("The user details saved are successfully loaded");
    } catch (error) {
        console.error("Error saving the user", error);
    }
  }

  const saveHotelData = async (key, value) =>{
    const valueToStore = typeof value == "string" ? value : JSON.stringify(value)
    try {
      await SecureStore.setItemAsync(key, valueToStore);
      console.log("The hotel details saved successfully")
    } catch (error) {
      console.log("There is an Error which has occured", error)
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
  const loadHotelData = async (key) =>{
    try {
        let result = await SecureStore.getItemAsync(key)
        // console.log("This is the hotels data that has been stored lately", result)
        if (result){
          // Reversing the JSON string back to an object
          const hotelData = JSON.parse(result)
          //console.log("The parsed hotel data", hotelData);
          setHotelData(hotelData)
        }
    } catch (error) {
      console.log("Error loading the hotel data", error);
    }
  }


  const value = {
    // User's Details
    user,
    setUser,
    setSignedIn,
    signedIn,
    authStatus,
    setAuthStatus,
    saveAuthStatus,
    loadAuthStatus,
    saveUserDetails,
    loadUserDetails,
    showConfirmation,
    setShowConfirmation,

    //Hotel's details
    hotelData,
    setHotelData,
    saveHotelData,
    loadHotelData,
    currentID, 
    setCurrentID,
    currentRoomId, 
    setCurrentRoomId,

    //IP address
    ip

  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default UserContexProvider;