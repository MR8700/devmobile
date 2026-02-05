import React from 'react';
import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity } from "react-native";
import { styles } from '../../screens/SettingsScreen';

export const SettingItem = ({
  icon,
  label,
  onPress,
  colors,
}: {
  icon: any;
  label: string;
  onPress: () => void;
  colors: any;
}) => (
  <TouchableOpacity
    style={[styles.item, { backgroundColor: colors.card }]}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <Ionicons name={icon} size={22} color={colors.accent} />
    <Text style={[styles.itemText, { color: colors.textPrimary }]}>{label}</Text>
    <Ionicons name="chevron-forward-outline" size={20} color={colors.textMuted} />
  </TouchableOpacity>
);
