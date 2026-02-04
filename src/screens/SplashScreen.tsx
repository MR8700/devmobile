import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Animated,
  StyleSheet,
  Easing,
  StatusBar,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';

const TOKEN_KEY = 'userToken';
const MIN_SPLASH_TIME = 2500;

const SplashScreen = ({ navigation }: any) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [dots, setDots] = useState('.');

  useEffect(() => {
    startAnimations();

    const dotsInterval = setInterval(() => {
      setDots(prev => (prev.length < 3 ? prev + '.' : '.'));
    }, 500);

    checkSession();

    return () => clearInterval(dotsInterval);
  }, []);

  const startAnimations = () => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 7000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  };

  const checkSession = async () => {
    try {
      const [token] = await Promise.all([
        AsyncStorage.getItem(TOKEN_KEY),
        new Promise(resolve => setTimeout(resolve, MIN_SPLASH_TIME)),
      ]);

      // ✅ Utilise replace pour naviguer correctement
      if (token) {
        navigation.replace('App');      // va directement au dashboard (Drawer → Tabs)
      } else {
        navigation.replace('Auth');     // va au login
      }
    } catch (error) {
      console.error('Erreur session:', error);
      navigation.replace('Auth');
    }
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f2f5f9" />
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <Animated.View
          style={[styles.logoWrapper, { transform: [{ rotate: spin }] }]}
        >
          <Image
            source={require('../../assets/images/logo.png')}
            style={styles.logo}
          />
        </Animated.View>

        <Text style={styles.appName}>Gestion Étudiants</Text>
        <Text style={styles.subtitle}>
          Plateforme moderne de gestion académique
        </Text>

        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Initialisation{dots}</Text>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f5f9' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  logoWrapper: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    marginBottom: 30,
  },
  logo: { width: 100, height: 100, resizeMode: 'contain' },
  appName: { fontSize: 28, fontWeight: 'bold', color: '#1a2a3a' },
  subtitle: { fontSize: 16, color: '#6b7280', marginTop: 8, textAlign: 'center', paddingHorizontal: 50 },
  loadingContainer: { position: 'absolute', bottom: 50 },
  loadingText: { fontSize: 16, fontWeight: '600', color: '#4a90e2' },
});
