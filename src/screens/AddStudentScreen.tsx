import React, { useState } from 'react';
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
} from 'react-native';
import ImagePickerComponent from '../components/photo/ImagePickerComponent';
import { addEtudiant, Etudiant } from '../api/api';

const AddStudentScreen: React.FC = () => {
  const [ine, setIne] = useState('');
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [age, setAge] = useState('');
  const [telephone, setTelephone] = useState('');
  const [sexe, setSexe] = useState<'M' | 'F'>('M');
  const [filiere, setFiliere] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Validation
  const isIneValid = (v: string) => /^N\d{11}$/.test(v);
  const isTextValid = (v: string) => v.trim().length > 0;
  const isAgeValid = (v: string) => /^\d+$/.test(v) && parseInt(v) > 0;
  const isPhoneValid = (v: string) => /^\d{8,15}$/.test(v);

  const handleSubmit = async () => {
    if (
      !isIneValid(ine) ||
      !isTextValid(nom) ||
      !isTextValid(prenom) ||
      !isAgeValid(age) ||
      !isTextValid(filiere) ||
      !isPhoneValid(telephone)
    ) {
      Alert.alert('Erreur', 'Veuillez vérifier tous les champs.\nL’INE doit être au format NXXXXXXXXXXX (N suivi de 11 chiffres).');
      return;
    }

    setLoading(true);

    try {
      const newStudent: Etudiant = {
        ine,
        nom,
        prenom,
        age: parseInt(age),
        sexe,
        filiere,
        telephone,
        photo: photo ?? undefined,
      };

      await addEtudiant(newStudent);
      Alert.alert('Succès', 'Étudiant ajouté avec succès !');

      // reset
      setIne('');
      setNom('');
      setPrenom('');
      setAge('');
      setTelephone('');
      setSexe('M');
      setFiliere('');
      setPhoto(null);
    } catch (err: any) {
      Alert.alert('Erreur', err.message || 'Impossible d’ajouter l’étudiant');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Ajouter un étudiant</Text>

        <TextInput
          style={styles.input}
          placeholder="INE (N suivi de 11 chiffres)"
          value={ine}
          onChangeText={setIne}
        />
        <TextInput
          style={styles.input}
          placeholder="Nom"
          value={nom}
          onChangeText={setNom}
        />
        <TextInput
          style={styles.input}
          placeholder="Prénom"
          value={prenom}
          onChangeText={setPrenom}
        />
        <TextInput
          style={styles.input}
          placeholder="Âge"
          keyboardType="number-pad"
          value={age}
          onChangeText={setAge}
        />
        <TextInput
          style={styles.input}
          placeholder="Téléphone"
          keyboardType="phone-pad"
          value={telephone}
          onChangeText={setTelephone}
        />

        {/* Sexe */}
        <View style={styles.sexeContainer}>
          <TouchableOpacity
            style={[styles.sexeButton, sexe === 'M' && styles.sexeSelected]}
            onPress={() => setSexe('M')}
          >
            <Text style={styles.sexeText}>Garçon</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sexeButton, sexe === 'F' && styles.sexeSelected]}
            onPress={() => setSexe('F')}
          >
            <Text style={styles.sexeText}>Fille</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Filière"
          value={filiere}
          onChangeText={setFiliere}
        />

        {/* Composant Photo */}
        <ImagePickerComponent photo={photo} onImagePicked={setPhoto} />

        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#1e90ff' }]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Ajouter</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
    backgroundColor: '#f7f9fc',
  },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 20, color: '#111' },
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
  sexeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  sexeSelected: { backgroundColor: '#1e90ff', borderColor: '#1e90ff' },
  sexeText: { color: '#111', fontWeight: '600' },
  button: {
    marginTop: 20,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default AddStudentScreen;
