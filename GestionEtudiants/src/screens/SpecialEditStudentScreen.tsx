import React, { useEffect, useState } from 'react';
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
import { Etudiant, getEtudiants, updateEtudiant } from '../api/api';
import EditPhotoModal from '../components/photo/EditPhotoModal';

const CompactEditStudentScreen: React.FC = () => {
  const [students, setStudents] = useState<Etudiant[]>([]);
  const [search, setSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Etudiant | null>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [photoModalVisible, setPhotoModalVisible] = useState(false);

  const [updatedData, setUpdatedData] = useState<Partial<Etudiant>>({});
  const [errors, setErrors] = useState({
    nom: false,
    prenom: false,
    age: false,
    telephone: false,
    filiere: false,
  });

  /* ================= CHARGER LES ETUDIANTS ================= */
  const fetchStudents = async () => {
    try {
      const data = await getEtudiants();
      setStudents(data);
    } catch {
      Alert.alert('Erreur', 'Impossible de charger les étudiants');
    }
  };

  useEffect(() => { fetchStudents(); }, []);

  const filteredStudents = students.filter(s =>
    s.nom.toLowerCase().includes(search.toLowerCase()) ||
    s.prenom.toLowerCase().includes(search.toLowerCase()) ||
    s.ine.toLowerCase().includes(search.toLowerCase())
  );

  /* ================= VALIDATIONS ================= */
  const isNameValid = (v: string) => /^[A-Za-zÀ-ÖØ-öø-ÿ]{2,50}$/.test(v.trim());
  const isAgeValid = (v: string) => /^\d+$/.test(v) && parseInt(v) >= 12 && parseInt(v) <= 99;
  const isPhoneValid = (v: string) => /^\d{8,15}$/.test(v);
  const isFiliereValid = (v: string) => /^[A-Za-zÀ-ÖØ-öø-ÿ ]{2,50}$/.test(v.trim());

  /* ================= SAUVEGARDE ================= */
  const handleSave = async () => {
    if (!selectedStudent) return;

    if (updatedData.ine && updatedData.ine !== selectedStudent.ine) {
      setConfirmModal(true);
      return;
    }
    await saveChanges();
  };

  const saveChanges = async () => {
    if (!selectedStudent) return;

    const newErrors = {
      nom: !isNameValid(updatedData.nom ?? selectedStudent.nom),
      prenom: !isNameValid(updatedData.prenom ?? selectedStudent.prenom),
      age: !isAgeValid((updatedData.age ?? selectedStudent.age)?.toString() ?? ''),
      telephone: !isPhoneValid(updatedData.telephone ?? selectedStudent.telephone ?? ''),
      filiere: !isFiliereValid(updatedData.filiere ?? selectedStudent.filiere),
    };
    setErrors(newErrors);

    if (Object.values(newErrors).some(Boolean)) {
      const messages: string[] = [];
      if (newErrors.nom) messages.push('Nom invalide (lettres uniquement, 2-50 caractères).');
      if (newErrors.prenom) messages.push('Prénom invalide (lettres uniquement, 2-50 caractères).');
      if (newErrors.age) messages.push('Âge invalide (12 à 99).');
      if (newErrors.telephone) messages.push('Téléphone invalide (8 à 15 chiffres).');
      if (newErrors.filiere) messages.push('Filière invalide (lettres uniquement, 2-50 caractères).');
      return Alert.alert('Erreur de saisie', messages.join('\n'));
    }

    setLoading(true);
    try {
      const payload: Etudiant = {
        id: selectedStudent.id,
        ine: selectedStudent.ine,
        nom: (updatedData.nom ?? selectedStudent.nom)!.trim(),
        prenom: (updatedData.prenom ?? selectedStudent.prenom)!.trim(),
        age: parseInt((updatedData.age ?? selectedStudent.age)!.toString()),
        sexe: (updatedData.sexe ?? selectedStudent.sexe)!,
        filiere: (updatedData.filiere ?? selectedStudent.filiere)!.trim(),
        telephone: (updatedData.telephone ?? selectedStudent.telephone)?.trim(),
        photo: updatedData.photo ?? selectedStudent.photo,
      };
      await updateEtudiant(payload);
      Alert.alert('Succès', 'Étudiant modifié avec succès');
      setDrawerVisible(false);
      setSelectedStudent(null);
      setUpdatedData({});
      fetchStudents();
    } catch {
      Alert.alert('Erreur', 'Impossible de modifier l’étudiant');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmINEChange = async () => {
    setConfirmModal(false);
    await saveChanges();
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.container}>
        <Text style={styles.title}>Modifier un étudiant</Text>

        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher par nom, prénom ou INE..."
          value={search}
          onChangeText={setSearch}
        />

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

        {/* DRAWER MODAL */}
        <Modal visible={drawerVisible} animationType="slide" transparent>
          <View style={styles.drawerOverlay}>
            <ScrollView contentContainerStyle={styles.drawerContainer}>
              <Text style={styles.modalTitle}>Modifier étudiant</Text>

              {/* INE */}
              <Text style={styles.label}>INE (non modifiable)</Text>
              <TextInput
                style={[styles.input, styles.inputDisabled]}
                value={selectedStudent?.ine}
                editable={false}
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
              <TouchableOpacity
                style={styles.photoWrapper}
                onPress={() => setPhotoModalVisible(true)}
              >
                {updatedData.photo || selectedStudent?.photo ? (
                  <Image
                    source={{ uri: updatedData.photo ?? selectedStudent?.photo }}
                    style={styles.photo}
                  />
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

              {/* BOUTONS */}
              <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSave} disabled={loading}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Enregistrer</Text>}
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => { setDrawerVisible(false); setSelectedStudent(null); setUpdatedData({}); }}
              >
                <Text style={styles.buttonText}>Annuler</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </Modal>

        {/* CONFIRMATION INE */}
        <Modal visible={confirmModal} transparent animationType="fade">
          <View style={styles.overlay}>
            <View style={[styles.drawerContainer, { padding: 20 }]}>
              <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 15 }}>Confirmer le changement d'INE</Text>
              <Text style={{ marginBottom: 20 }}>Vous êtes sur le point de modifier l'INE. Êtes-vous sûr ?</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <TouchableOpacity style={[styles.saveButton, { flex: 1, marginRight: 5 }]} onPress={handleConfirmINEChange}>
                  <Text style={styles.buttonText}>Oui, confirmer</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.cancelButton, { flex: 1, marginLeft: 5 }]} onPress={() => setConfirmModal(false)}>
                  <Text style={styles.buttonText}>Annuler</Text>
                </TouchableOpacity>
              </View>
            </View>
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
  searchInput: { borderWidth: 1, borderColor: '#ccc', borderRadius: 20, paddingHorizontal: 12, height: 40, backgroundColor: '#fff', marginBottom: 10 },
  card: { backgroundColor: '#fff', padding: 12, marginVertical: 6, borderRadius: 15 },
  name: { fontSize: 16, fontWeight: '600' },
  meta: { fontSize: 13, color: '#666' },
  drawerOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
  drawerContainer: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 },
  modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 15 },
  input: { backgroundColor: '#fff', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, marginVertical: 8, fontSize: 16, borderWidth: 1, borderColor: '#ccc' },
  inputDisabled: { backgroundColor: '#e5e5e5' },
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
  overlay: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.6)', padding: 20 },
});
