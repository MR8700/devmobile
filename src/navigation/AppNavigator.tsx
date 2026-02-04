import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DrawerNavigator from './DrawerNavigator';
import EditStudentScreen from '../screens/EditStudentScreen';
import AddStudentScreen from '../screens/AddStudentScreen';
import { RootStackParamList } from '../types/types';
import StudentDetailScreenWrapper from '../screens/StudentDetailScreenWrapper';
import FilieresScreen from '../screens/FilieresScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SecurityScreen from '../screens/SecurityScreen';
import AboutScreen from '../screens/AboutScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const SimpleStack = createNativeStackNavigator();
export default function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Main"
        component={DrawerNavigator}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="StudentDetail"
        component={StudentDetailScreenWrapper}
        options={{
          presentation: 'modal',
          title: 'Détails étudiant',
        }}
      />

      <Stack.Screen
        name="EditStudent"
        component={EditStudentScreen}
        options={{
          presentation: 'modal',
          title: 'Modifier étudiant',
        }}
      />

      <Stack.Screen
        name="AddStudent"
        component={AddStudentScreen}
        options={{
          title: 'Ajouter un étudiant',
        }}
      />

        <SimpleStack.Screen
        name="Filieres"
        component={FilieresScreen}
        options={{
          title: 'Les filières',
        }}
      />

      <SimpleStack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Mon profile',
        }}
      />

      <SimpleStack.Screen
        name="Security"
        component={SecurityScreen}
        options={{
          title: 'Sécurité',
        }}
      />

       <SimpleStack.Screen
        name="About"
        component={AboutScreen}
        options={{
          title: 'A propos',
        }}
      />

    </Stack.Navigator>
  );
}
