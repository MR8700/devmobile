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

  // ================= VALIDATION =================
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
      !isTextValid(localFiliere) ||
      !isPhoneValid(telephone)
    ) {
      Alert.alert('Erreur', 'Veuillez vérifier tous les champs');
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
        filiere: localFiliere,
        telephone,
        photo: photo ?? undefined,
      };

      await addEtudiant(newStudent);

      Alert.alert('Succès', 'Étudiant ajouté');

      onSuccess?.();

      // reset
      setIne('');
      setNom('');
      setPrenom('');
      setAge('');
      setTelephone('');
      setSexe('M');
      setPhoto(null);

    } catch (err: any) {
      Alert.alert('Erreur', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>

      <ImagePickerComponent photo={photo} onImagePicked={setPhoto} />

      <TextInput style={styles.input} placeholder="INE" value={ine} onChangeText={setIne} />
      <TextInput style={styles.input} placeholder="Nom" value={nom} onChangeText={setNom} />
      <TextInput style={styles.input} placeholder="Prénom" value={prenom} onChangeText={setPrenom} />

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
        style={[styles.input, filiere && { backgroundColor: '#eee' }]}
        placeholder="Filière"
        value={localFiliere}
        editable={!filiere}
        onChangeText={setLocalFiliere}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        {loading ? <ActivityIndicator color="#fff" /> :
          <Text style={styles.buttonText}>Ajouter</Text>}
      </TouchableOpacity>

    </View>
  );
};

export default StudentForm;

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#ccc',
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

  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
