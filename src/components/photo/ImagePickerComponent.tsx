import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

import GalleryPicker from './GalleryPicker';
import CameraPicker from './CameraPicker';

interface Props {
  photo: string | null;
  onImagePicked: (uri: string) => void;
}

const ImagePickerComponent = ({ photo, onImagePicked }: Props) => {
  return (
    <View style={styles.container}>
      <View style={styles.preview}>
        {photo ? (
          <Image source={{ uri: photo }} style={styles.image} />
        ) : (
          <Text style={styles.placeholder}>Aucune photo</Text>
        )}
      </View>

      <View style={styles.actions}>
        <GalleryPicker onPick={onImagePicked} />
        <CameraPicker onCapture={onImagePicked} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: 'center', marginVertical: 15 },
  preview: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#e1e4e8',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  image: { width: '100%', height: '100%' },
  placeholder: { color: '#9ca3af', fontSize: 12 },
  actions: { flexDirection: 'row', marginTop: 10 },
});

export default ImagePickerComponent;