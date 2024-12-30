import { StyleSheet, Text, View } from 'react-native';
import AppNavigation from "./Navigation/AppNavigation"
import React, { useState } from "react";

export default function App() {
  const [showSplashScreen, setShowSplashScreen] = useState(true)

  return (
    
    <>
    <AppNavigation />
    </>
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
