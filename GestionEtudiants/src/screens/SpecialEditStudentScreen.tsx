import React, { useCallback, useEffect, useState } from 'react';
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
import { Etudiant, getEtudiants, updateEtudiant, updateEtudiantPhoto } from '../api/api';
import EditPhotoModal from '../components/photo/EditPhotoModal';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/types';
import { isAgeValid, isFiliereValid, isIneValid, isNameValid, isPhoneValid } from '../components/forms/FieldValidation';
import { useFocusEffect } from '@react-navigation/native';
type Props = NativeStackScreenProps<RootStackParamList, 'SpecialEditStudent'>;
const CompactEditStudentScreen: React.FC<Props> = ({ navigation }) => {

  const [students, setStudents] = useState<Etudiant[]>([]);
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

  // FETCH STUDENTS + STATS
      const loadStudents = useCallback(async () => {
        setLoading(true);
        try {
          const data = await getEtudiants();
          setStudents(data.map(s => ({ ...s, id: s.id! })));
  
        } catch (err) {
          console.error('Erreur dashboard :', err);
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
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const data = await getEtudiants();
      setStudents(data);
    } catch {
      Alert.alert('Erreur', 'Impossible de charger les étudiants');
    }
  };

  const filteredStudents = students.filter(s =>
    s.nom.toLowerCase().includes(search.toLowerCase()) ||
    s.prenom.toLowerCase().includes(search.toLowerCase()) ||
    s.ine.toLowerCase().includes(search.toLowerCase())
  );


  /* ================= SAUVEGARDE ================= */
  const handleSave = async () => {
    if (!selectedStudent) return;

    // Vérifier si l'INE a changé et existe déjà
    if (updatedData.ine && updatedData.ine !== selectedStudent.ine) {
      const ineExists = students.some(s => s.ine === updatedData.ine);
      if (ineExists) {
        Alert.alert('INE existant', 'Cet INE est déjà utilisé par un autre étudiant.');
        setErrors(prev => ({ ...prev, ine: true }));
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
      age: !isAgeValid((updatedData.age ?? selectedStudent.age)?.toString() ?? ''),
      telephone: !isPhoneValid(updatedData.telephone ?? selectedStudent.telephone ?? ''),
      filiere: !isFiliereValid(updatedData.filiere ?? selectedStudent.filiere),
    };
    setErrors(newErrors);

    if (Object.values(newErrors).some(Boolean)) {
      const messages: string[] = [];
      if (newErrors.ine) messages.push('INE invalide (5-20 caractères alphanumériques).');
      if (newErrors.nom) messages.push('Nom invalide (lettres uniquement, 2-50 caractères).');
      if (newErrors.prenom) messages.push('Prénom invalide (lettres uniquement, 2-50 caractères).');
      if (newErrors.age) messages.push('Âge invalide (12 à 99).');
      if (newErrors.telephone) messages.push('Téléphone invalide (8 à 15 chiffres).');
      if (newErrors.filiere) messages.push('Filière invalide (lettres uniquement, 2-50 caractères).');
      return Alert.alert('Erreur de saisie', messages.join('\n'));
    }

    setLoading(true);
    try {
      // Gestion photo si elle a changé
      let photo = updatedData.photo ?? selectedStudent.photo;
      if (updatedData.photo && updatedData.photo !== selectedStudent.photo) {
        const photoRes = await updateEtudiantPhoto(selectedStudent.id!, updatedData.photo);
        photo = photoRes.photo;
      }

      const payload: Etudiant = {
        id: selectedStudent.id,
        ine: updatedData.ine ?? selectedStudent.ine,
        nom: (updatedData.nom ?? selectedStudent.nom)!.trim(),
        prenom: (updatedData.prenom ?? selectedStudent.prenom)!.trim(),
        age: parseInt((updatedData.age ?? selectedStudent.age)!.toString()),
        sexe: (updatedData.sexe ?? selectedStudent.sexe)!,
        filiere: (updatedData.filiere ?? selectedStudent.filiere)!.trim(),
        telephone: (updatedData.telephone ?? selectedStudent.telephone)?.trim(),
        photo,
      };

      await updateEtudiant(payload);
      Alert.alert('Succès', 'Étudiant modifié avec succès');
      setDrawerVisible(false);
      setSelectedStudent(null);
      setUpdatedData({});
      fetchStudents();
    } catch (err: any) {
      Alert.alert('Erreur', err.message || 'Impossible de modifier l’étudiant');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.container}>
        <Text style={styles.title}>Modifier un étudiant</Text>

        {/* BOUTON + Ajouter un étudiant */}
        <TouchableOpacity style={styles.addButton} onPress={ ()=>{navigation.navigate('AddStudent')}}>
          <Text style={styles.addButtonText}>+ Ajouter un étudiant</Text>
        </TouchableOpacity>

        {/* RECHERCHE */}
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher par nom, prénom ou INE..."
          value={search}
          onChangeText={setSearch}
        />

        {/* LISTE ETUDIANTS */}
        {filteredStudents.length === 0 ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <LottieView
              source={require('../../assets/lottie/Empty.json')}
              autoPlay
              loop
              style={{ width: 200, height: 200 }}
            />
            <Text style={{ fontSize: 16, color: '#555', marginTop: 10 }}>Aucun étudiant à modifier</Text>
          </View>
        ) : (
          <FlatList
            data={filteredStudents}
            keyExtractor={(item) => item.id?.toString() ?? item.ine}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.card}
                onPress={() => {
                  setSelectedStudent(item);
                  setUpdatedData({ ...item });
                  setDrawerVisible(true);
                }}
              >
                <Text style={styles.name}>{item.nom} {item.prenom}</Text>
                <Text style={styles.meta}>INE: {item.ine} • Filière: {item.filiere}</Text>
              </TouchableOpacity>
            )}
          />
        )}

        {/* DRAWER MODAL */}
        <Modal visible={drawerVisible} animationType="slide" transparent>
          <View style={styles.drawerOverlay}>
            <ScrollView contentContainerStyle={styles.drawerContainer}>
              <Text style={styles.modalTitle}>Modifier étudiant</Text>

              {/* INE */}
              <Text style={styles.label}>INE</Text>
              <TextInput
                style={[styles.input, errors.ine && styles.inputError]}
                value={updatedData.ine ?? selectedStudent?.ine}
                onChangeText={(v) => setUpdatedData(prev => ({ ...prev, ine: v }))}
                editable={true}
              />

              {/* NOM */}
              <TextInput
                style={[styles.input, errors.nom && styles.inputError]}
                placeholder="Nom"
                value={updatedData.nom ?? ''}
                onChangeText={(v) => setUpdatedData(prev => ({ ...prev, nom: v }))}
              />

              {/* PRENOM */}
              <TextInput
                style={[styles.input, errors.prenom && styles.inputError]}
                placeholder="Prénom"
                value={updatedData.prenom ?? ''}
                onChangeText={(v) => setUpdatedData(prev => ({ ...prev, prenom: v }))}
              />

              {/* AGE */}
              <TextInput
                style={[styles.input, errors.age && styles.inputError]}
                placeholder="Âge"
                keyboardType="number-pad"
                value={(updatedData.age ?? selectedStudent?.age)?.toString() ?? ''}
                onChangeText={(v) => setUpdatedData(prev => ({ ...prev, age: v ? parseInt(v) : undefined }))}
              />

              {/* TELEPHONE */}
              <TextInput
                style={[styles.input, errors.telephone && styles.inputError]}
                placeholder="Téléphone"
                keyboardType="phone-pad"
                value={updatedData.telephone ?? ''}
                onChangeText={(v) => setUpdatedData(prev => ({ ...prev, telephone: v }))}
              />

              {/* SEXE */}
              <View style={styles.sexeContainer}>
                <TouchableOpacity
                  style={[styles.sexeButton, (updatedData.sexe ?? selectedStudent?.sexe) === 'M' && styles.sexeSelected]}
                  onPress={() => setUpdatedData(prev => ({ ...prev, sexe: 'M' }))}
                >
                  <Text style={[styles.sexeText, (updatedData.sexe ?? selectedStudent?.sexe) === 'M' && styles.sexeTextSelected]}>Garçon</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.sexeButton, (updatedData.sexe ?? selectedStudent?.sexe) === 'F' && styles.sexeSelected]}
                  onPress={() => setUpdatedData(prev => ({ ...prev, sexe: 'F' }))}
                >
                  <Text style={[styles.sexeText, (updatedData.sexe ?? selectedStudent?.sexe) === 'F' && styles.sexeTextSelected]}>Fille</Text>
                </TouchableOpacity>
              </View>

              {/* FILIERE */}
              <TextInput
                style={[styles.input, errors.filiere && styles.inputError]}
                placeholder="Filière"
                value={updatedData.filiere ?? ''}
                onChangeText={(v) => setUpdatedData(prev => ({ ...prev, filiere: v }))}
              />

              {/* PHOTO */}
              <TouchableOpacity style={styles.photoWrapper} onPress={() => setPhotoModalVisible(true)}>
                {updatedData.photo || selectedStudent?.photo ? (
                  <Image source={{ uri: updatedData.photo ?? selectedStudent?.photo }} style={styles.photo} />
                ) : (
                  <View style={styles.photoPlaceholder}><Text>Aucune photo</Text></View>
                )}
              </TouchableOpacity>

              <EditPhotoModal
                visible={photoModalVisible}
                studentId={selectedStudent?.id!}
                currentPhoto={updatedData.photo ?? selectedStudent?.photo ?? undefined}
                onClose={() => setPhotoModalVisible(false)}
                onConfirm={(newPhotoUri: string) => {
                  const relativeUri = newPhotoUri.replace('http://10.0.2.2:3000', '');
                  setUpdatedData(prev => ({ ...prev, photo: relativeUri }));
                  setPhotoModalVisible(false);
                }}
              />

              <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSave} disabled={loading}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Enregistrer</Text>}
              </TouchableOpacity>

              <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => { setDrawerVisible(false); setSelectedStudent(null); setUpdatedData({}); }}>
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
  container: { flex: 1, padding: 12, backgroundColor: '#f4f6fc' },
  title: { fontSize: 24, fontWeight: '700', color: '#1e90ff', marginBottom: 10 },
  addButton: { backgroundColor: '#1e90ff', padding: 12, borderRadius: 12, alignItems: 'center', marginBottom: 10 },
  addButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  searchInput: { borderWidth: 1, borderColor: '#ccc', borderRadius: 20, paddingHorizontal: 12, height: 40, backgroundColor: '#fff', marginBottom: 10 },
  card: { backgroundColor: '#fff', padding: 12, marginVertical: 6, borderRadius: 15 },
  name: { fontSize: 16, fontWeight: '600' },
  meta: { fontSize: 13, color: '#666' },
  drawerOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
  drawerContainer: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 },
  modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 15 },
  input: { backgroundColor: '#fff', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, marginVertical: 8, fontSize: 16, borderWidth: 1, borderColor: '#ccc' },
  inputError: { borderColor: 'red' },
  label: { fontSize: 12, color: '#555', marginBottom: 4 },
  sexeContainer: { flexDirection: 'row', marginVertical: 10 },
  sexeButton: { flex: 1, paddingVertical: 12, borderRadius: 8, borderWidth: 1, borderColor: '#888', marginHorizontal: 5, alignItems: 'center' },
  sexeSelected: { backgroundColor: '#1e90ff', borderColor: '#1e90ff' },
  sexeText: { color: '#111', fontWeight: '600' },
  sexeTextSelected: { color: '#fff' },
  button: { paddingVertical: 14, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  saveButton: { backgroundColor: '#1e90ff' },
  cancelButton: { backgroundColor: '#f44336' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  photoWrapper: { alignSelf: 'center', marginVertical: 10 },
  photo: { width: 120, height: 120, borderRadius: 60, borderWidth: 3, borderColor: '#1e90ff' },
  photoPlaceholder: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#eee', justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#1e90ff' },
});
