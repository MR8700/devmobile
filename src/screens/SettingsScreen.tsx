import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const SettingsScreen = () => {
  const navigation = useNavigation<any>();

  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  /* ======================
     Charger préférences
  ====================== */
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const dark = await AsyncStorage.getItem('darkMode');
    const notif = await AsyncStorage.getItem('notifications');

    if (dark !== null) setDarkMode(JSON.parse(dark));
    if (notif !== null) setNotifications(JSON.parse(notif));
  };

  /* ======================
     Sauvegarder préférences
  ====================== */
  const toggleDarkMode = async () => {
    const newValue = !darkMode;
    setDarkMode(newValue);
    await AsyncStorage.setItem('darkMode', JSON.stringify(newValue));
  };

  const toggleNotifications = async () => {
    const newValue = !notifications;
    setNotifications(newValue);
    await AsyncStorage.setItem('notifications', JSON.stringify(newValue));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Paramètres</Text>

      {/* PROFIL */}
      <SettingItem
        icon="person-outline"
        label="Profil"
        onPress={() => navigation.navigate('Profile')}
      />

      {/* SECURITE */}
      <SettingItem
        icon="lock-closed-outline"
        label="Sécurité"
        onPress={() => navigation.navigate('Security')}
      />

      {/* NOTIFICATIONS */}
      <SettingSwitch
        icon="notifications-outline"
        label="Notifications"
        value={notifications}
        onValueChange={toggleNotifications}
      />

      {/* MODE SOMBRE */}
      <SettingSwitch
        icon="moon-outline"
        label="Mode sombre"
        value={darkMode}
        onValueChange={toggleDarkMode}
      />

      <View style={styles.separator} />

      {/* A PROPOS */}
      <SettingItem
        icon="information-circle-outline"
        label="À propos"
        onPress={() => navigation.navigate('About')}
      />
    </View>
  );
};

export default SettingsScreen;

/* ======================
   ITEM SIMPLE
====================== */
const SettingItem = ({
  icon,
  label,
  onPress,
}: {
  icon: any;
  label: string;
  onPress: () => void;
}) => (
  <TouchableOpacity style={styles.item} onPress={onPress}>
    <Ionicons name={icon} size={22} color="#4a90e2" />
    <Text style={styles.itemText}>{label}</Text>
    <Ionicons name="chevron-forward-outline" size={20} color="#9ca3af" />
  </TouchableOpacity>
);

/* ======================
   ITEM AVEC SWITCH
====================== */
const SettingSwitch = ({
  icon,
  label,
  value,
  onValueChange,
}: {
  icon: any;
  label: string;
  value: boolean;
  onValueChange: () => void;
}) => (
  <View style={styles.item}>
    <Ionicons name={icon} size={22} color="#4a90e2" />
    <Text style={styles.itemText}>{label}</Text>
    <Switch value={value} onValueChange={onValueChange} />
  </View>
);

/* ======================
   STYLES
====================== */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f7f9fc',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 25,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    elevation: 2,
  },
  itemText: {
    flex: 1,
    marginLeft: 14,
    fontSize: 16,
    fontWeight: '500',
  },
  separator: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 25,
  },
});
