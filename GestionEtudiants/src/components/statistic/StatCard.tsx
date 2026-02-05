import { TouchableOpacity, Text } from "react-native";
import { styles } from "../../screens/StatsScreen";
import { Ionicons } from "@expo/vector-icons";

/* ================== CARD STAT ================== */
export const StatCard = ({
  icon,
  label,
  value,
  color,
  onPress,
}: {
  icon: string;
  label: string;
  value: number;
  color: string;
  onPress?: () => void;
}) => (
  <TouchableOpacity
    style={[styles.card, { backgroundColor: color }]}
    activeOpacity={0.8}
    onPress={onPress}
  >
    <Ionicons name={icon as any} size={28} color="#fff" />
    <Text style={styles.cardValue}>{value}</Text>
    <Text style={styles.cardLabel}>{label}</Text>
  </TouchableOpacity>
);