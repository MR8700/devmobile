import React, { useContext } from 'react';
import { Alert } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';

import { ThemeContext } from '../context/ThemeContext';

/* SCREENS */
import AddStudentScreen from '../screens/AddStudentScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';
import TabNavigator from './TabNavigator';
import StudentListScreen from '../screens/StudentListScreen';
import SpecialEditStudentScreen from '../screens/SpecialEditStudentScreen';
import { DrawerParamList } from '../types/types';

const Drawer = createDrawerNavigator<DrawerParamList>();
const TOKEN_KEY = 'userToken';

export default function DrawerNavigator({ navigation }: any) {
 

  /* =======================
     Fonction Déconnexion
  ======================== */
  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Voulez-vous vraiment vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Oui',
          onPress: async () => {
            await AsyncStorage.removeItem(TOKEN_KEY);
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: 'Auth' }],
              })
            );
          },
        },
      ]
    );
  };

  return (
    <Drawer.Navigator
      
    >
      {/* ===== Accueil ===== */}
      <Drawer.Screen
        name="HomeTabs"
        component={TabNavigator}
        options={{
          title: 'Accueil',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="grid-outline" size={size} color={color} />
          ),
        }}
      />

      {/* ===== Ajouter étudiant ===== */}
      <Drawer.Screen
        name="AddStudent"
        component={AddStudentScreen}
        options={{
          title: 'Ajouter étudiant',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="person-add-outline" size={size} color={color} />
          ),
        }}
      />

      {/* ===== Liste étudiants ===== */}
      <Drawer.Screen
        name="Students"
        component={StudentListScreen}
        options={{
          title: 'Liste des étudiants',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="people-outline" size={size} color={color} />
          ),
        }}
      />

      {/* ===== Modifier spécial ===== */}
      <Drawer.Screen
        name="SpecialEditStudent"
        component={SpecialEditStudentScreen}
        options={{
          title: 'Modifier un étudiant ou son INE',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="people-outline" size={size} color={color} />
          ),
        }}
      />

      {/* ===== Paramètres ===== */}
      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: 'Paramètres',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />

      {/* ===== Profil ===== */}
      <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profil',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="person-circle-outline" size={size} color={color} />
          ),
        }}
      />

      {/* ===== Déconnexion ===== */}
      <Drawer.Screen
        name="Logout"
        component={() => null}
        options={{
          title: 'Déconnexion',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="log-out-outline" size={size} color={color} />
          ),
        }}
        listeners={{
          drawerItemPress: (e) => {
            e.preventDefault();
            handleLogout();
          },
        }}
      />
    </Drawer.Navigator>
  );
}
