import { Ionicons } from "@expo/vector-icons";
import { View, Text } from "react-native";
import { styles } from "../dashboard/DashboadStyle";

export const StatItem = ({ icon, label, value, color }: { icon: any; label: string; value: number; color: string }) => (
  <View style={styles.statItem}>
    <Ionicons name={icon} size={26} color={color} />
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);
