import React from 'react';
import { Ionicons } from "@expo/vector-icons";
import { Switch, View, Text } from "react-native";
import { styles } from '../../screens/SettingsScreen';

export const SettingSwitch = ({
  icon,
  label,
  value,
  onValueChange,
  colors,
}: {
  icon: any;
  label: string;
  value: boolean;
  onValueChange: () => void;
  colors: any;
}) => (
  <View style={[styles.item, { backgroundColor: colors.card }]}>
    <Ionicons name={icon} size={22} color={colors.accent} />
    <Text style={[styles.itemText, { color: colors.textPrimary }]}>{label}</Text>
    <Switch
      value={value}
      onValueChange={onValueChange}
      thumbColor={value ? colors.accent : '#ccc'}
      trackColor={{ false: '#9ca3af', true: colors.accent }}
    />
  </View>
);
