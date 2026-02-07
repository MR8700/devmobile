import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import DrawerNavigator from './DrawerNavigator';
import EditStudentScreen from '../screens/EditStudentScreen';
import AddStudentScreen from '../screens/AddStudentScreen';
import StudentDetailScreenWrapper from '../screens/StudentDetailScreenWrapper';
import FilieresScreen from '../screens/FilieresScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SecurityScreen from '../screens/SecurityScreen';
import AboutScreen from '../screens/AboutScreen';
import SpecialEditStudentScreen from '../screens/SpecialEditStudentScreen';

import { RootStackParamList } from '../types/types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
 


  return (
    <>
      

      <Stack.Navigator
        screenOptions={{
         headerTitleStyle: { fontWeight: '700' as '700', fontSize: 18 },
         
        }}
      >
        <Stack.Screen
          name="Main"
          component={DrawerNavigator}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="StudentDetail"
          component={StudentDetailScreenWrapper}
          options={{ presentation: 'modal', title: 'Détails étudiant' }}
        />

        <Stack.Screen
          name="EditStudent"
          component={EditStudentScreen}
          options={{ presentation: 'modal', title: 'Modifier étudiant' }}
        />

        <Stack.Screen
          name="SpecialEditStudent"
          component={SpecialEditStudentScreen}
          options={{ presentation: 'modal', title: 'Modifier étudiant' }}
        />

        <Stack.Screen
          name="AddStudent"
          component={AddStudentScreen}
          options={{ title: 'Ajouter un étudiant' }}
        />

        <Stack.Screen
          name="Filieres"
          component={FilieresScreen}
          options={{ title: 'Les filières' }}
        />

        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ title: 'Mon profil' }}
        />

        <Stack.Screen
          name="Security"
          component={SecurityScreen}
          options={{ title: 'Sécurité' }}
        />

        <Stack.Screen
          name="About"
          component={AboutScreen}
          options={{ title: 'À propos' }}
        />
      </Stack.Navigator>
    </>
  );
}
