import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface DashboardButtonProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}

const DashboardButton: React.FC<DashboardButtonProps> = ({
  icon,
  label,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Ionicons name={icon} size={28} color="#1e90ff" />
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

export default DashboardButton;

/* =======================
   STYLES
======================= */
const styles = StyleSheet.create({
  card: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 25,
    paddingHorizontal: 10,
    alignItems: 'center',
    marginBottom: 15,
    elevation: 2,
  },
  label: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
});