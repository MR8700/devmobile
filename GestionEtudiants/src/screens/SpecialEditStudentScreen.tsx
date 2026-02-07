import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';

import LottieView from 'lottie-react-native';
import { Etudiant, getEtudiants, updateEtudiant } from '../api/api';
import EditPhotoModal from '../components/photo/EditPhotoModal';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/types';
import {
  isAgeValid,
  isFiliereValid,
  isIneValid,
  isNameValid,
  isPhoneValid,
} from '../components/forms/FieldValidation';
import { useFocusEffect } from '@react-navigation/native';

type Props = NativeStackScreenProps<RootStackParamList, 'SpecialEditStudent'>;

const BASE_URL = 'http://10.0.2.2:3000';

const CompactEditStudentScreen: React.FC<Props> = ({ navigation }) => {
  const [students, setStudents] = useState<Etudiant[]>([]);
  const [photo, setPhoto] = useState<string | undefined>();
  const [search, setSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Etudiant | null>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [photoModalVisible, setPhotoModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [updatedData, setUpdatedData] = useState<Partial<Etudiant>>({});
  const [errors, setErrors] = useState({
    ine: false,
    nom: false,
    prenom: false,
    age: false,
    telephone: false,
    filiere: false,
  });

  /* ================= FETCH ================= */

  const loadStudents = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getEtudiants();
      setStudents(data);
    } catch {
      Alert.alert('Erreur', 'Impossible de charger les étudiants');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadStudents();
    }, [loadStudents])
  );

  /* ================= FILTRE ================= */

  const filteredStudents = students.filter(
    s =>
      s.nom.toLowerCase().includes(search.toLowerCase()) ||
      s.prenom.toLowerCase().includes(search.toLowerCase()) ||
      s.ine.toLowerCase().includes(search.toLowerCase())
  );

  /* ================= SAVE ================= */

  const handleSave = async () => {
    if (!selectedStudent) return;

    if (updatedData.ine && updatedData.ine !== selectedStudent.ine) {
      const exists = students.some(s => s.ine === updatedData.ine);
      if (exists) {
        Alert.alert('INE existant');
        return;
      }
    }

    await saveChanges();
  };

  const saveChanges = async () => {
    if (!selectedStudent) return;

    const newErrors = {
      ine: !isIneValid(updatedData.ine ?? selectedStudent.ine),
      nom: !isNameValid(updatedData.nom ?? selectedStudent.nom),
      prenom: !isNameValid(updatedData.prenom ?? selectedStudent.prenom),
      age: !isAgeValid(
        (updatedData.age ?? selectedStudent.age)?.toString() ?? ''
      ),
      telephone: !isPhoneValid(
        updatedData.telephone ?? selectedStudent.telephone ?? ''
      ),
      filiere: !isFiliereValid(
        updatedData.filiere ?? selectedStudent.filiere
      ),
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some(Boolean)) {
      return Alert.alert('Erreur de saisie');
    }

    setLoading(true);

    try {
      const payload: Etudiant = {
        id: selectedStudent.id,
        ine: updatedData.ine ?? selectedStudent.ine,
        nom: (updatedData.nom ?? selectedStudent.nom)!.trim(),
        prenom: (updatedData.prenom ?? selectedStudent.prenom)!.trim(),
        age: parseInt(
          (updatedData.age ?? selectedStudent.age)!.toString()
        ),
        sexe: updatedData.sexe ?? selectedStudent.sexe,
        filiere: (updatedData.filiere ?? selectedStudent.filiere)!.trim(),
        telephone:
          updatedData.telephone ?? selectedStudent.telephone,

        photo: photo
          ? photo.replace(BASE_URL, '')
          : undefined,
      };

      await updateEtudiant(payload);

      Alert.alert('Succès', 'Étudiant modifié');

      setDrawerVisible(false);
      setSelectedStudent(null);
      setUpdatedData({});
      loadStudents();
    } catch (err: any) {
      Alert.alert('Erreur', err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Modifier un étudiant</Text>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddStudent')}
        >
          <Text style={styles.addButtonText}>+ Ajouter</Text>
        </TouchableOpacity>

        <TextInput
          style={styles.searchInput}
          placeholder="Recherche..."
          value={search}
          onChangeText={setSearch}
        />

        {filteredStudents.length === 0 ? (
          <View style={styles.empty}>
            <LottieView
              source={require('../../assets/lottie/Empty.json')}
              autoPlay
              loop
              style={{ width: 200, height: 200 }}
            />
          </View>
        ) : (
          <FlatList
            data={filteredStudents}
            keyExtractor={item => item.id!.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.card}
                onPress={() => {
                  setSelectedStudent(item);
                  setUpdatedData(item);

                  if (item.photo) {
                    setPhoto(
                      item.photo.startsWith('http')
                        ? item.photo
                        : `${BASE_URL}${item.photo}`
                    );
                  } else {
                    setPhoto(undefined);
                  }

                  setDrawerVisible(true);
                }}
              >
                <Text style={styles.name}>
                  {item.nom} {item.prenom}
                </Text>
                <Text style={styles.meta}>
                  {item.ine}
                </Text>
              </TouchableOpacity>
            )}
          />
        )}

        {/* MODAL EDIT */}
        <Modal visible={drawerVisible} animationType="slide" transparent>
          <View style={styles.drawerOverlay}>
            <ScrollView style={styles.drawerContainer}>
              <Text style={styles.modalTitle}>
                Modifier étudiant
              </Text>

              <TextInput
                style={styles.input}
                value={updatedData.nom}
                onChangeText={v =>
                  setUpdatedData(p => ({ ...p, nom: v }))
                }
              />

              <TextInput
                style={styles.input}
                value={updatedData.prenom}
                onChangeText={v =>
                  setUpdatedData(p => ({ ...p, prenom: v }))
                }
              />

              {/* PHOTO */}
              <TouchableOpacity
                style={styles.photoWrapper}
                onPress={() => setPhotoModalVisible(true)}
              >
                {photo ? (
                  <Image
                    source={{ uri: photo }}
                    style={styles.photo}
                  />
                ) : (
                  <View style={styles.photoPlaceholder}>
                    <Text>Aucune photo</Text>
                  </View>
                )}
              </TouchableOpacity>

              <EditPhotoModal
                visible={photoModalVisible}
                studentId={selectedStudent?.id!}
                currentPhoto={photo}
                onClose={() => setPhotoModalVisible(false)}
                onConfirm={newUri => {
                  const relative = newUri.replace(BASE_URL, '');
                  setPhoto(newUri);
                  setUpdatedData(p => ({ ...p, photo: relative }));
                  setPhotoModalVisible(false);
                }}
              />

              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSave}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>
                    Enregistrer
                  </Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setDrawerVisible(false)}
              >
                <Text style={styles.buttonText}>Annuler</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </Modal>
      </View>
    </KeyboardAvoidingView>
  );
};

export default CompactEditStudentScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 },
  title: { fontSize: 22, fontWeight: 'bold' },
  addButton: { backgroundColor: '#1e90ff', padding: 10, borderRadius: 10 },
  addButtonText: { color: '#fff', textAlign: 'center' },
  searchInput: { borderWidth: 1, marginVertical: 10, borderRadius: 10 },
  card: { backgroundColor: '#fff', padding: 12, marginVertical: 6, borderRadius: 10 },
  name: { fontWeight: '600' },
  meta: { color: '#666' },
  drawerOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
  drawerContainer: { backgroundColor: '#fff', padding: 20 },
  modalTitle: { fontSize: 18, fontWeight: 'bold' },
  input: { borderWidth: 1, borderRadius: 8, marginVertical: 6, padding: 10 },
  photoWrapper: { alignSelf: 'center', marginVertical: 10 },
  photo: { width: 120, height: 120, borderRadius: 60 },
  photoPlaceholder: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#eee', justifyContent: 'center', alignItems: 'center' },
  saveButton: { backgroundColor: '#1e90ff', padding: 12, borderRadius: 10, marginTop: 10 },
  cancelButton: { backgroundColor: '#f44336', padding: 12, borderRadius: 10, marginTop: 10 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

