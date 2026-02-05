import React, { useState, useEffect, useCallback } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import EditPhotoModal from '../components/photo/EditPhotoModal';
import PhotoFullModal from '../components/photo/PhotoFullModal';
import { Etudiant, getEtudiants } from '../api/api';
import { useFocusEffect } from '@react-navigation/native';

const BASE_URL = 'http://10.0.2.2:3000';

interface Props {
  visible: boolean;
  student: Etudiant;
  onClose: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const StudentDetailScreen: React.FC<Props> = ({
  visible,
  student,
  onClose,
  onEdit,
  onDelete,
}) => {
  const [photo, setPhoto] = useState<string | undefined>();
  const [photoVisible, setPhotoVisible] = useState(false);
  const [editPhotoVisible, setEditPhotoVisible] = useState(false);

    
    useEffect(() => {
      if (student.photo) {
        setPhoto(
          student.photo.startsWith('http')
            ? student.photo
            : `http://10.0.2.2:3000${student.photo}`
        );
      }
    }, [student.photo]);

  // FORMAT PHOTO URL
  useEffect(() => {
    if (!student.photo) {
      setPhoto(undefined);
      return;
    }

    setPhoto(
      student.photo.startsWith('http')
        ? student.photo
        : `${BASE_URL}${student.photo}`
    );
  }, [student]);

  return (
    <>
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={onClose}
      >
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.overlay}>
            <TouchableWithoutFeedback>
              <View style={styles.container}>
                <ScrollView showsVerticalScrollIndicator={false}>
                  {/* CLOSE */}
                  <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                    <Ionicons name="close" size={28} color="#1e90ff" />
                  </TouchableOpacity>

                  {/* PHOTO */}
                  <TouchableOpacity
                    style={styles.photoWrapper}
                    onPress={() => photo && setPhotoVisible(true)}
                  >
                    <Image
                      source={
                        photo
                          ? { uri: photo }
                          : require('../../assets/images/placeholder.png')
                      }
                      style={styles.photo}
                    />

                    <TouchableOpacity
                      style={styles.editIcon}
                      onPress={() => setEditPhotoVisible(true)}
                    >
                      <Ionicons name="camera" size={18} color="#fff" />
                    </TouchableOpacity>
                  </TouchableOpacity>

                  {/* NOM */}
                  <Text style={styles.name}>
                    {student.nom} {student.prenom}
                  </Text>

                  {/* INFOS */}
                  <View style={styles.infoRow}>
                    <Ionicons name="ribbon-outline" size={20} color="#555" />
                    <Text style={styles.infoText}>
                      INE : {student.ine ?? 'N/A'}
                    </Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Ionicons name="person-outline" size={20} color="#555" />
                    <Text style={styles.infoText}>
                      Sexe : {student.sexe === 'M' ? 'Garçon' : 'Fille'}
                    </Text>
                  </View>

                  {student.age !== undefined && (
                    <View style={styles.infoRow}>
                      <Ionicons name="calendar-outline" size={20} color="#555" />
                      <Text style={styles.infoText}>
                        Âge : {student.age} ans
                      </Text>
                    </View>
                  )}

                  {student.telephone && (
                    <View style={styles.infoRow}>
                      <Ionicons name="call-outline" size={20} color="#555" />
                      <Text style={styles.infoText}>
                        Téléphone : {student.telephone}
                      </Text>
                    </View>
                  )}

                  <View style={styles.infoRow}>
                    <Ionicons name="school-outline" size={20} color="#555" />
                    <Text style={styles.infoText}>
                      Filière : {student.filiere}
                    </Text>
                  </View>

                  {/* ACTIONS */}
                  <View style={styles.actions}>
                    {onEdit && (
                      <TouchableOpacity
                        style={[styles.actionBtn, styles.editBtn]}
                        onPress={onEdit}
                      >
                        <Ionicons name="create-outline" size={20} color="#fff" />
                        <Text style={styles.actionText}>Modifier</Text>
                      </TouchableOpacity>
                    )}

                    {onDelete && (
                      <TouchableOpacity
                        style={[styles.actionBtn, styles.deleteBtn]}
                        onPress={onDelete}
                      >
                        <Ionicons name="trash-outline" size={20} color="#fff" />
                        <Text style={styles.actionText}>Supprimer</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* PHOTO FULL MODAL */}
      {photo && (
        <PhotoFullModal
          visible={photoVisible}
          photo={photo}
          onClose={() => setPhotoVisible(false)}
        />
      )}

      {/* EDIT PHOTO MODAL */}
      <EditPhotoModal
        visible={editPhotoVisible}
        studentId={student.id!}
        currentPhoto={photo}
        onClose={() => setEditPhotoVisible(false)}
        onConfirm={(uri) => {
          setPhoto(uri.startsWith('http') ? uri : `${BASE_URL}${uri}`);
          setEditPhotoVisible(false);
        }}
      />
    </>
  );
};

export default StudentDetailScreen;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    padding: 20,
  },

  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    maxHeight: '90%',
  },

  closeBtn: {
    position: 'absolute',
    right: 10,
    top: 10,
    zIndex: 10,
    elevation: 10,
  },

  photoWrapper: { alignItems: 'center', marginBottom: 20 },

  photo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#1e90ff',
  },

  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 25,
    backgroundColor: '#1e90ff',
    padding: 6,
    borderRadius: 20,
  },

  name: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 15,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },

  infoText: { marginLeft: 8, fontSize: 16, color: '#555' },

  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },

  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
  },

  editBtn: { backgroundColor: '#1e90ff' },
  deleteBtn: { backgroundColor: '#f44336' },

  actionText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 6,
  },
});
