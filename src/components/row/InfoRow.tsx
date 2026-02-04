import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface InfoRowProps {
  label: string;
  value?: string | number | null;
}

const InfoRow: React.FC<InfoRowProps> = ({ label, value }) => {

  const displayValue =
    value !== undefined && value !== null && value !== ''
      ? value
      : 'Non renseigné';

  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.separator}>:</Text>
      <Text style={styles.value}>{displayValue}</Text>
    </View>
  );
};

export default InfoRow;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 14,
    paddingVertical: 6,
  },

  label: {
    width: 110,
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
  },

  separator: {
    marginHorizontal: 4,
    color: '#888',
    fontSize: 14,
  },

  value: {
    flex: 1,
    fontSize: 15,
    color: '#222',
    fontWeight: '500',
    lineHeight: 20,
  },
});
