import 'react-native-gesture-handler'; // ⚠️ toujours en premier
import 'react-native-reanimated';

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';

import RootNavigator from './src/navigation/RootNavigator';

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" backgroundColor="#1e90ff" />
      <RootNavigator />
    </NavigationContainer>
  );
}