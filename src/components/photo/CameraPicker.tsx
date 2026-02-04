import React from 'react';
import { TouchableOpacity, Text, Alert, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

interface Props {
  onCapture: (uri: string) => void;
}

const CameraPicker = ({ onCapture }: Props) => {
  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert(
        'Permission requise',
        "L'accès à la caméra est nécessaire."
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [5, 6],
      quality: 0.7,
    });

    if (!result.canceled && result.assets?.length) {
      onCapture(result.assets[0].uri);
    }
  };

  return (
    <TouchableOpacity style={styles.button} onPress={takePhoto}>
      <Text style={styles.text}>Caméra</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#4a90e2',
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  text: { color: '#fff', fontWeight: 'bold' },
});

export default CameraPicker;