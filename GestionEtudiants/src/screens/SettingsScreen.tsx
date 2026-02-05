import React, { useContext } from 'react';
import {
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ThemeContext } from '../context/ThemeContext';
import { SettingSwitch } from '../components/settings/SettingSwitch';
import { SettingItem } from '../components/settings/SettingItem';

/* ======================
   COMPOSANT PRINCIPAL
====================== */
const SettingsScreen = () => {
  const navigation = useNavigation<any>();
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);

  /* ======================
     COULEURS DYNAMIQUES
  ====================== */
  const colors = {
    background: darkMode ? '#1f2937' : '#f7f9fc',
    card: darkMode ? '#374151' : '#fff',
    textPrimary: darkMode ? '#f3f4f6' : '#111827',
    textMuted: darkMode ? '#9ca3af' : '#374151',
    accent: '#4a90e2',
  };

  return (
    <ScrollView
      contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}
    >
      <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
        Paramètres
      </Text>

      {/* PROFIL */}
      <SettingItem
        icon="person-outline"
        label="Profil"
        onPress={() => navigation.navigate('Profile')}
        colors={colors}
      />

      {/* MODE SOMBRE */}
      <SettingSwitch
        icon="moon-outline"
        label="Mode sombre"
        value={darkMode}
        onValueChange={toggleDarkMode}
        colors={colors}
      />
    </ScrollView>
  );
};

export default SettingsScreen;




/* ======================
   STYLES
====================== */
export const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 25,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
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
});
