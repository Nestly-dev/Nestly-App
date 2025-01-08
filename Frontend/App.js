import { StyleSheet, Text, View } from 'react-native';
import AppNavigation from "./Navigation/AppNavigation"
import React, { useState } from "react";
import UserContexProvider from './context/UserContextProvider';


export default function App() {
  const [showSplashScreen, setShowSplashScreen] = useState(true)

  return (
    
    <UserContexProvider>
      <AppNavigation />
    </UserContexProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
