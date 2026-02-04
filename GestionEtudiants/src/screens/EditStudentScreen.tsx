import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
} from 'react-native';

import EditPhotoModal from '../components/photo/EditPhotoModal';
import { deleteEtudiant, updateEtudiant, Etudiant } from '../api/api';

interface Props {
  route: { params: { student: Etudiant } };
  navigation: any;
}

const EditStudentScreen: React.FC<Props> = ({ route, navigation }) => {
  const { student } = route.params;

  /* ================= STATES ================= */
  const [nom, setNom] = useState(student.nom);
  const [prenom, setPrenom] = useState(student.prenom);
  const [age, setAge] = useState(student.age?.toString() ?? '');
  const [telephone, setTelephone] = useState(student.telephone ?? '');
  const [sexe, setSexe] = useState<'M' | 'F'>(student.sexe);
  const [filiere, setFiliere] = useState(student.filiere);

  // ✅ Photo complète avec URL pour l’aperçu immédiat
  const [photo, setPhoto] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [photoModalVisible, setPhotoModalVisible] = useState(false);

  /* ================= EFFET POUR CHARGER LA PHOTO ================= */
useEffect(() => {
  if (student.photo) {
    setPhoto(
      student.photo.startsWith('http')
        ? student.photo
        : `http://10.0.2.2:3000${student.photo}`
    );
  }
}, [student.photo]);


  /* ================= VALIDATION ================= */
  const isTextValid = (v: string) => v.trim().length > 0;
  const isAgeValid = (v: string) =>
    /^\d+$/.test(v) && Number(v) > 0 && Number(v) < 120;
  const isPhoneValid = (v: string) => /^\d{8,15}$/.test(v);

  /* ================= UPDATE ================= */
  const handleSubmit = async () => {
    if (!student?.id) {
      Alert.alert('Erreur', 'ID étudiant introuvable');
      return;
    }

    if (
      !isTextValid(nom) ||
      !isTextValid(prenom) ||
      !isAgeValid(age) ||
      !isTextValid(filiere) ||
      !isPhoneValid(telephone)
    ) {
      Alert.alert('Erreur', 'Veuillez vérifier tous les champs.');
      return;
    }

    setLoading(true);
    try {
      const parsedAge = Number(age);

      const updatedStudent: Etudiant = {
        id: student.id,
        ine: student.ine,
        nom: nom.trim(),
        prenom: prenom.trim(),
        age: parsedAge,
        sexe,
        filiere: filiere.trim(),
        telephone: telephone.trim(),
        photo: photo ? photo.replace('http://10.0.2.2:3000', '') : undefined,
      };

      await updateEtudiant(updatedStudent);
      Alert.alert('Succès', 'Étudiant mis à jour avec succès !');
      navigation.goBack();
    } catch (err: any) {
      Alert.alert('Erreur', err.message || 'Impossible de mettre à jour l’étudiant');
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = () => {
    if (!student?.id) return;
    Alert.alert('Supprimer étudiant', 'Voulez-vous vraiment supprimer cet étudiant ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: async () => {
          try {
            setLoading(true);
            await deleteEtudiant(student.id!);
            Alert.alert('Succès', 'Étudiant supprimé.');
            navigation.goBack();
          } catch (err: any) {
            Alert.alert('Erreur', err.message || 'Impossible de supprimer');
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  /* ================= UI ================= */
  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Modifier l’étudiant</Text>

        {/* INE */}
        <Text style={styles.label}>INE (non modifiable)</Text>
        <TextInput style={[styles.input, styles.inputDisabled]} value={student.ine} editable={false} />

        {/* NOM */}
        <TextInput style={styles.input} placeholder="Nom" value={nom} onChangeText={setNom} />

        {/* PRENOM */}
        <TextInput style={styles.input} placeholder="Prénom" value={prenom} onChangeText={setPrenom} />

        {/* AGE */}
        <TextInput style={styles.input} placeholder="Âge" keyboardType="number-pad" value={age} onChangeText={setAge} />

        {/* TELEPHONE */}
        <TextInput style={styles.input} placeholder="Téléphone" keyboardType="phone-pad" value={telephone} onChangeText={setTelephone} />

        {/* SEXE */}
        <View style={styles.sexeContainer}>
          <TouchableOpacity
            style={[styles.sexeButton, sexe === 'M' && styles.sexeSelected]}
            onPress={() => setSexe('M')}
          >
            <Text style={[styles.sexeText, sexe === 'M' && styles.sexeTextSelected]}>Garçon</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.sexeButton, sexe === 'F' && styles.sexeSelected]}
            onPress={() => setSexe('F')}
          >
            <Text style={[styles.sexeText, sexe === 'F' && styles.sexeTextSelected]}>Fille</Text>
          </TouchableOpacity>
        </View>

        {/* FILIERE */}
        <TextInput style={styles.input} placeholder="Filière" value={filiere} onChangeText={setFiliere} />

        {/* ================= PHOTO ================= */}
        <TouchableOpacity
          onPress={() => setPhotoModalVisible(true)}
          style={styles.photoWrapper}
        >
          {photo ? (
            <Image source={{ uri: photo }} style={styles.photo} />
          ) : (
            <View style={styles.photoPlaceholder}>
              <Text>Aucune photo</Text>
            </View>
          )}
        </TouchableOpacity>

        <EditPhotoModal
          visible={photoModalVisible}
          studentId={student.id!}
          currentPhoto={photo?.replace('http://10.0.2.2:3000', '')}
          onClose={() => {
            setPhotoModalVisible(false);

            // ⚡ RAFFRAICHIR LA PHOTO AU CAS OÙ L'UTILISATEUR FERME LE MODAL SANS CONFIRMER
            if (student.photo) {
              setPhoto(
                student.photo.startsWith('http')
                  ? student.photo
                  : `http://10.0.2.2:3000${student.photo}`
              );
            } else {
              setPhoto(null);
            }
          }}
          onConfirm={(newPhotoUri: string) => {
            setPhoto(
              newPhotoUri.startsWith('http')
                ? newPhotoUri
                : `http://10.0.2.2:3000${newPhotoUri}`
            );
            setPhotoModalVisible(false);
          }}
        />


        {/* BOUTONS */}
        <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSubmit} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Enregistrer</Text>}
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleDelete} disabled={loading}>
          <Text style={styles.buttonText}>Supprimer</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default EditStudentScreen;

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
    backgroundColor: '#f7f9fc',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    color: '#111',
  },
  label: {
    fontSize: 12,
    color: '#555',
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginVertical: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  inputDisabled: {
    backgroundColor: '#e5e5e5',
  },
  sexeContainer: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  sexeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#888',
    marginHorizontal: 5,
    alignItems: 'center',
  },
  sexeSelected: {
    backgroundColor: '#1e90ff',
    borderColor: '#1e90ff',
  },
  sexeText: {
    color: '#111',
    fontWeight: '600',
  },
  sexeTextSelected: {
    color: '#fff',
  },
  button: {
    marginTop: 20,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#1e90ff',
  },
  deleteButton: {
    backgroundColor: '#ff4d4d',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  photoWrapper: {
    alignSelf: 'center',
    marginVertical: 10,
  },
  photo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#1e90ff',
  },
  photoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#1e90ff',
  },
});
