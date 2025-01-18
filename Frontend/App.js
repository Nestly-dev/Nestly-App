import { StyleSheet, Text, View } from 'react-native';
import AppNavigation from "./Navigation/AppNavigation"
import React, { useState } from "react";
import UserContexProvider from './context/AuthContextProvider';
import { GestureHandlerRootView } from "react-native-gesture-handler"


export default function App() {
  const [showSplashScreen, setShowSplashScreen] = useState(true)

  return (
    <GestureHandlerRootView>
    <UserContexProvider>
      <AppNavigation />
    </UserContexProvider>
    </GestureHandlerRootView>
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
