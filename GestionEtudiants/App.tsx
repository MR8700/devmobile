import 'react-native-gesture-handler'; 
import 'react-native-reanimated';

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme, DarkTheme, Theme } from '@react-navigation/native';

import RootNavigator from './src/navigation/RootNavigator';
import { ThemeProvider, ThemeContext } from './src/context/ThemeContext';

export default function App() {
  return (
    <ThemeProvider>
      <ThemeContext.Consumer>
        {({ darkMode }) => {
          // Choix du thème avec fonts
          const theme: Theme = darkMode
            ? {
                ...DarkTheme,
                colors: {
                  ...DarkTheme.colors,
                  background: '#111827',
                  card: '#1f2937',
                  text: '#f3f4f6',
                  primary: '#4f46e5',
                  border: '#374151',
                  notification: '#14b8a6',
                },
              }
            : {
                ...DefaultTheme,
                colors: {
                  ...DefaultTheme.colors,
                  background: '#f7f9fc',
                  card: '#ffffff',
                  text: '#111827',
                  primary: '#4f46e5',
                  border: '#e5e7eb',
                  notification: '#14b8a6',
                },
              };

          return (
            <NavigationContainer theme={theme}>
              <StatusBar
                style={darkMode ? 'light' : 'dark'}
                backgroundColor={darkMode ? '#111827' : '#1e90ff'}
              />
              <RootNavigator />
            </NavigationContainer>
          );
        }}
      </ThemeContext.Consumer>
    </ThemeProvider>
  );
}
