import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from '../screens/SplashScreen';
import AuthNavigator from './AuthNavigator';
import AppNavigator from './AppNavigator';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Auth" component={AuthNavigator} />
      <Stack.Screen name="App" component={AppNavigator} />
    </Stack.Navigator>
  );
}