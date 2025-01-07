import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignInScreen from '../screens/SigninScreen';
import SignUpScreen from '../screens/SignUpScreen'
import Mainscreen from '../screens/Mainscreen';

const Stack = createNativeStackNavigator();

function RootStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="SignIn" component={SignInScreen} options={{headerShown: false}} />
      <Stack.Screen name="SignUp" component={SignUpScreen} options={{headerShown: false}} />
      <Stack.Screen name="Main Page" component={Mainscreen} options={{headerShown: false}} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <RootStack />
    </NavigationContainer>
  );
}