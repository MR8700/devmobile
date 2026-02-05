import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeContextType = {
  darkMode: boolean;
  toggleDarkMode: () => void;
};

export const ThemeContext = createContext<ThemeContextType>({
  darkMode: false,
  toggleDarkMode: () => {},
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const loadTheme = async () => {
      const stored = await AsyncStorage.getItem('darkMode');
      if (stored !== null) setDarkMode(JSON.parse(stored));
    };
    loadTheme();
  }, []);

  const toggleDarkMode = async () => {
    const newValue = !darkMode;
    setDarkMode(newValue);
    await AsyncStorage.setItem('darkMode', JSON.stringify(newValue));
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
