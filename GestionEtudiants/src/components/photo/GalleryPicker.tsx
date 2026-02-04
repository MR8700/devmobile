import React from 'react';
import { TouchableOpacity, Text, Alert, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

interface Props {
  onPick: (uri: string) => void;
}

const GalleryPicker = ({ onPick }: Props) => {
  const pickFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert(
        'Permission requise',
        "L'accès à la galerie est nécessaire."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [5, 6],
      quality: 0.7,
    });

    if (!result.canceled && result.assets?.length) {
      onPick(result.assets[0].uri);
    }
  };

  return (
    <TouchableOpacity style={styles.button} onPress={pickFromGallery}>
      <Text style={styles.text}>Galerie</Text>
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

export default GalleryPicker;