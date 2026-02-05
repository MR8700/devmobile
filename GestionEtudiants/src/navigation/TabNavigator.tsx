import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

/* SCREENS */
import DashboardScreen from '../screens/DashboardScreen';
import StudentListScreen from '../screens/StudentListScreen';
import StatsScreen from '../screens/StatsScreen';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          title: 'Tableau de bord',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="grid-outline" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Students"
        component={StudentListScreen}
        options={{
          title: 'Liste des étudiants',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people-outline" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Stats"
        component={StatsScreen}
        options={{
          title: 'Statistiques',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="stats-chart-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
