import React from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  Share,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

interface PhotoModalProps {
  visible: boolean;
  photoUri: string;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const PhotoModal: React.FC<PhotoModalProps> = ({
  visible,
  photoUri,
  onClose,
  onEdit,
  onDelete,
}) => {
  const scale = useSharedValue(1);

  const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = e.scale;
    })
    .onEnd(() => {
      scale.value = withTiming(1, { duration: 200 });
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handleDelete = () => {
    Alert.alert(
      'Confirmer la suppression',
      'Voulez-vous vraiment supprimer cette photo ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Supprimer', style: 'destructive', onPress: onDelete },
      ]
    );
  };

  const handleShare = async () => {
    try {
      await Share.share({ url: photoUri });
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de partager la photo.');
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* PHOTO ZOOM */}
          <GestureDetector gesture={pinchGesture}>
            <Animated.Image
              source={{ uri: photoUri }}
              style={[styles.photo, animatedStyle]}
              resizeMode="contain"
            />
          </GestureDetector>

          {/* ACTIONS */}
          <View style={styles.actions}>
            <TouchableOpacity style={[styles.button, { backgroundColor: '#1e90ff' }]} onPress={onEdit}>
              <Text style={styles.buttonText}>Modifier</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, { backgroundColor: '#ff4d4d' }]} onPress={handleDelete}>
              <Text style={styles.buttonText}>Supprimer</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, { backgroundColor: '#32cd32' }]} onPress={handleShare}>
              <Text style={styles.buttonText}>Partager</Text>
            </TouchableOpacity>
          </View>

          {/* FERMER */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close-circle" size={36} color="#555" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '95%',
    maxHeight: '90%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  photo: {
    width: '100%',
    height: 300,
    borderRadius: 12,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    width: '100%',
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 12,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },
  closeButton: {
    marginTop: 20,
  },
});

export default PhotoModal;