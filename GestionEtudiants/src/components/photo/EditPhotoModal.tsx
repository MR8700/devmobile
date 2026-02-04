import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { updateEtudiantPhoto } from '../../api/api';

interface EditPhotoModalProps {
  visible: boolean;
  studentId: number;
  currentPhoto?: string;
  onClose: () => void;
  onConfirm: (newPhotoUri: string) => void;
}

const SERVER_BASE_URL = 'http://10.0.2.2:3000';

const EditPhotoModal: React.FC<EditPhotoModalProps> = ({
  visible,
  studentId,
  currentPhoto,
  onClose,
  onConfirm,
}) => {
  const [tempPhoto, setTempPhoto] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      if (currentPhoto) {
        // ⚡ Vérifie si c’est déjà une URL complète
        setTempPhoto(
          currentPhoto.startsWith('http')
            ? currentPhoto
            : `${SERVER_BASE_URL}${currentPhoto}`
        );
      } else {
        setTempPhoto(undefined);
      }
      setLoading(false);
    }
  }, [visible=true, currentPhoto]);

  const pickImage = async (fromCamera: boolean) => {
    if (loading) return;

    try {
      const permission = fromCamera
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permission.status !== 'granted') {
        Alert.alert('Permission refusée', 'Veuillez autoriser l’accès.');
        return;
      }

      const result = fromCamera
        ? await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
          })
        : await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
          });

      if (!result.canceled && result.assets?.length > 0) {
        setTempPhoto(result.assets[0].uri);
      }
    } catch {
      Alert.alert('Erreur', 'Impossible de sélectionner l’image.');
    }
  };

  const handleConfirm = async () => {
    if (!tempPhoto) {
      Alert.alert('Erreur', 'Veuillez sélectionner une photo.');
      return;
    }

    try {
      setLoading(true);

      const updatedStudent = await updateEtudiantPhoto(studentId, tempPhoto);

      const finalPhoto = updatedStudent?.photo
        ? `${SERVER_BASE_URL}${updatedStudent.photo}`
        : tempPhoto;

      onConfirm(finalPhoto);
      onClose();
    } catch (error: any) {
      Alert.alert(
        'Erreur',
        error?.response?.data?.error || error?.message || 'Impossible de mettre à jour la photo.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Modifier la photo</Text>

          {tempPhoto ? (
            <Image source={{ uri: tempPhoto }} style={styles.photo} />
          ) : (
            <View style={styles.photoPlaceholder}>
              <Ionicons name="camera" size={48} color="#777" />
              <Text style={styles.photoText}>Aucune photo</Text>
            </View>
          )}

          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => pickImage(true)}
              disabled={loading}
            >
              <Ionicons name="camera-outline" size={18} color="#fff" />
              <Text style={styles.actionText}>Caméra</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => pickImage(false)}
              disabled={loading}
            >
              <Ionicons name="image-outline" size={18} color="#fff" />
              <Text style={styles.actionText}>Galerie</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.footerButton, styles.cancel]}
              onPress={onClose}
              disabled={loading}
            >
              <Text style={styles.footerText}>Annuler</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.footerButton, styles.confirm]}
              onPress={handleConfirm}
              disabled={loading}
            >
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.footerText}>Confirmer</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default EditPhotoModal;

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  container: { width: '90%', backgroundColor: '#fff', borderRadius: 16, padding: 20, alignItems: 'center' },
  title: { fontSize: 18, fontWeight: '600', marginBottom: 20 },
  photo: { width: 180, height: 150, borderRadius: 12, marginBottom: 20 },
  photoPlaceholder: {
    width: 180,
    height: 150,
    borderRadius: 12,
    backgroundColor: '#f2f2f2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  photoText: { marginTop: 6, color: '#777' },
  actions: { flexDirection: 'row', width: '100%', marginBottom: 20, justifyContent: 'space-between' },
  actionButton: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 12, marginHorizontal: 5, backgroundColor: '#1e90ff', borderRadius: 10 },
  actionText: { color: '#fff', fontWeight: '600', marginLeft: 6 },
  footer: { flexDirection: 'row', width: '100%', justifyContent: 'space-between' },
  footerButton: { flex: 1, paddingVertical: 12, borderRadius: 10, marginHorizontal: 5 },
  cancel: { backgroundColor: '#777' },
  confirm: { backgroundColor: '#32cd32' },
  footerText: { color: '#fff', fontWeight: '600', textAlign: 'center' },
});
