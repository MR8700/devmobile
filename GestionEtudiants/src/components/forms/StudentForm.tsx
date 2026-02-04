import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';

import ImagePickerComponent from '../photo/ImagePickerComponent';
import { addEtudiant, Etudiant } from '../../api/api';

interface Props {
  filiere?: string;
  onSuccess?: () => void;
}

const StudentForm: React.FC<Props> = ({ filiere, onSuccess }) => {
  const [ine, setIne] = useState('');
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [age, setAge] = useState('');
  const [telephone, setTelephone] = useState('');
  const [sexe, setSexe] = useState<'M' | 'F'>('M');
  const [photo, setPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [localFiliere, setLocalFiliere] = useState(filiere ?? '');

  /* ================= VALIDATIONS ================= */
  const isIneValid = (v: string) => /^N\d{11}$/.test(v);
  const isNameValid = (v: string) => /^[A-Za-zÀ-ÖØ-öø-ÿ]{2,50}$/.test(v.trim());
  const isAgeValid = (v: string) => /^\d+$/.test(v) && parseInt(v) >= 12 && parseInt(v) <= 99;
  const isPhoneValid = (v: string) => /^\d{8,15}$/.test(v);
  const isFiliereValid = (v: string) => /^[A-Za-zÀ-ÖØ-öø-ÿ ]{2,50}$/.test(v.trim());

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    let errorMessage = '';
    if (!isIneValid(ine)) errorMessage += '• L’INE doit commencer par N suivi de 11 chiffres.\n';
    if (!isNameValid(nom)) errorMessage += '• Le nom doit contenir uniquement des lettres (2-50 caractères).\n';
    if (!isNameValid(prenom)) errorMessage += '• Le prénom doit contenir uniquement des lettres (2-50 caractères).\n';
    if (!isAgeValid(age)) errorMessage += '• L’âge doit être un nombre entre 12 et 99.\n';
    if (!isPhoneValid(telephone)) errorMessage += '• Le numéro de téléphone doit contenir 8 à 15 chiffres.\n';
    if (!isFiliereValid(localFiliere)) errorMessage += '• La filière doit contenir uniquement des lettres (2-50 caractères).\n';
    if (!['M', 'F'].includes(sexe)) errorMessage += '• Veuillez sélectionner un sexe valide.\n';

    if (errorMessage) {
      return Alert.alert('Champs invalides', errorMessage.trim());
    }

    setLoading(true);

    try {
      const newStudent: Etudiant = {
        ine,
        nom: nom.trim(),
        prenom: prenom.trim(),
        age: parseInt(age),
        sexe,
        filiere: localFiliere.trim(),
        telephone: telephone.trim(),
        photo: photo ?? undefined,
      };

      await addEtudiant(newStudent);
      Alert.alert('Succès', 'L’étudiant a été ajouté avec succès !');
      onSuccess?.();

      // RESET
      setIne('');
      setNom('');
      setPrenom('');
      setAge('');
      setTelephone('');
      setSexe('M');
      setPhoto(null);

    } catch (err: any) {
      Alert.alert('Erreur', err.message || 'Impossible d’ajouter l’étudiant.');
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <View>
      <ImagePickerComponent photo={photo} onImagePicked={setPhoto} />

      <TextInput
        style={[styles.input, !isIneValid(ine) && ine ? styles.inputError : null]}
        placeholder="INE (NXXXXXXXXXXX)"
        value={ine}
        onChangeText={setIne}
      />

      <TextInput
        style={[styles.input, !isNameValid(nom) && nom ? styles.inputError : null]}
        placeholder="Nom"
        value={nom}
        onChangeText={setNom}
      />

      <TextInput
        style={[styles.input, !isNameValid(prenom) && prenom ? styles.inputError : null]}
        placeholder="Prénom"
        value={prenom}
        onChangeText={setPrenom}
      />

      <TextInput
        style={[styles.input, !isAgeValid(age) && age ? styles.inputError : null]}
        placeholder="Âge"
        keyboardType="number-pad"
        value={age}
        onChangeText={setAge}
      />

      <TextInput
        style={[styles.input, !isPhoneValid(telephone) && telephone ? styles.inputError : null]}
        placeholder="Téléphone"
        keyboardType="phone-pad"
        value={telephone}
        onChangeText={setTelephone}
      />

      {/* Sexe */}
      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.sexBtn, sexe === 'M' && styles.sexActive]}
          onPress={() => setSexe('M')}
        >
          <Text style={{ color: sexe === 'M' ? '#fff' : '#000' }}>Garçon</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.sexBtn, sexe === 'F' && styles.sexActive]}
          onPress={() => setSexe('F')}
        >
          <Text style={{ color: sexe === 'F' ? '#fff' : '#000' }}>Fille</Text>
        </TouchableOpacity>
      </View>

      {/* Filière */}
      <TextInput
        style={[
          styles.input,
          (!isFiliereValid(localFiliere) && localFiliere) ? styles.inputError : null,
          filiere && { backgroundColor: '#eee' },
        ]}
        placeholder="Filière"
        value={localFiliere}
        editable={!filiere}
        onChangeText={setLocalFiliere}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Ajouter</Text>}
      </TouchableOpacity>
    </View>
  );
};

export default StudentForm;

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  inputError: {
    borderColor: '#ff4d4d',
  },
  row: { flexDirection: 'row', marginVertical: 10 },
  sexBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  sexActive: {
    backgroundColor: '#1e90ff',
    borderColor: '#1e90ff',
  },
  button: {
    backgroundColor: '#1e90ff',
    padding: 14,
    borderRadius: 8,
    marginTop: 15,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
