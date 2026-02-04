import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

import ImagePickerComponent from '../components/photo/ImagePickerComponent';
import {
  addEtudiant,
  updateEtudiantPhoto,
  getFilieres,
  Etudiant,
} from '../api/api';

const AddStudentScreen: React.FC = () => {
  const [ine, setIne] = useState('');
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [age, setAge] = useState('');
  const [telephone, setTelephone] = useState('');
  const [sexe, setSexe] = useState<'M' | 'F'>('M');

  const [filiere, setFiliere] = useState('');
  const [filieres, setFilieres] = useState<string[]>([]);
  const [nouvelleFiliere, setNouvelleFiliere] = useState('');
  const [isNouvelleFiliere, setIsNouvelleFiliere] = useState(false);

  const [photo, setPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // États d’erreurs pour les bordures rouges
  const [errors, setErrors] = useState({
    ine: false,
    nom: false,
    prenom: false,
    age: false,
    telephone: false,
    filiere: false,
  });

  /* ================= CHARGER FILIERES ================= */
  useEffect(() => {
    const fetchFilieres = async () => {
      try {
        const data = await getFilieres();
        setFilieres(data);
      } catch (error) {
        Alert.alert('Erreur', 'Impossible de charger les filières.');
      }
    };
    fetchFilieres();
  }, []);

  /* ================= VALIDATIONS ================= */
  const isIneValid = (v: string) => /^N\d{11}$/.test(v);
  const isNameValid = (v: string) => /^[A-Za-zÀ-ÖØ-öø-ÿ]{2,50}$/.test(v.trim());
  const isAgeValid = (v: string) => /^\d+$/.test(v) && parseInt(v) >= 12 && parseInt(v) <= 99;
  const isPhoneValid = (v: string) => /^\d{8}$/.test(v);
  const isFiliereValid = (v: string) => /^[A-Za-zÀ-ÖØ-öø-ÿ ]{2,50}$/.test(v.trim());

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    const filiereFinale = isNouvelleFiliere ? nouvelleFiliere : filiere;

    const newErrors = {
      ine: !isIneValid(ine),
      nom: !isNameValid(nom),
      prenom: !isNameValid(prenom),
      age: !isAgeValid(age),
      telephone: !isPhoneValid(telephone),
      filiere: !isFiliereValid(filiereFinale),
    };
    setErrors(newErrors);

    // Si un champ est invalide, alert et stop
    if (Object.values(newErrors).some(Boolean)) {
      const messages: string[] = [];
      if (newErrors.ine) messages.push('INE invalide (N suivi de 11 chiffres).');
      if (newErrors.nom) messages.push('Nom invalide (lettres uniquement, 2-50 caractères).');
      if (newErrors.prenom) messages.push('Prénom invalide (lettres uniquement, 2-50 caractères).');
      if (newErrors.age) messages.push('Âge invalide (12 à 99).');
      if (newErrors.telephone) messages.push('Téléphone invalide (8 chiffres).');
      if (newErrors.filiere) messages.push('Filière invalide (lettres uniquement, 2-50 caractères).');

      return Alert.alert('Erreur de saisie', messages.join('\n'));
    }

    if (!['M', 'F'].includes(sexe)) {
      return Alert.alert('Sexe invalide', 'Veuillez sélectionner un sexe valide.');
    }

    setLoading(true);

    try {
      const newStudent: Etudiant = {
        ine,
        nom,
        prenom,
        age: parseInt(age),
        sexe,
        filiere: filiereFinale,
        telephone,
      };

      const created = await addEtudiant(newStudent);

      if (photo && created.id) {
        await updateEtudiantPhoto(created.id, photo);
      }

      Alert.alert('Succès', 'L’étudiant a été ajouté avec succès !');

      /* RESET */
      setIne('');
      setNom('');
      setPrenom('');
      setAge('');
      setTelephone('');
      setSexe('M');
      setFiliere('');
      setNouvelleFiliere('');
      setIsNouvelleFiliere(false);
      setPhoto(null);
      setErrors({
        ine: false,
        nom: false,
        prenom: false,
        age: false,
        telephone: false,
        filiere: false,
      });

      if (isNouvelleFiliere && nouvelleFiliere) {
        setFilieres(prev => [...prev, nouvelleFiliere]);
      }

    } catch (err: any) {
      if (err.response?.data?.error?.includes('INE déjà')) {
        Alert.alert('INE existant', 'Cet INE est déjà utilisé pour un autre étudiant.');
        setErrors(prev => ({ ...prev, ine: true }));
      } else {
        Alert.alert('Erreur', err.message || 'Impossible d’ajouter l’étudiant.');
      }
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Ajouter un étudiant</Text>

        <ImagePickerComponent photo={photo} onImagePicked={setPhoto} />

        <TextInput
          style={[styles.input, errors.ine && styles.inputError]}
          placeholder="INE (N suivi de 11 chiffres)"
          value={ine}
          onChangeText={setIne}
        />

        <TextInput
          style={[styles.input, errors.nom && styles.inputError]}
          placeholder="Nom"
          value={nom}
          onChangeText={setNom}
        />

        <TextInput
          style={[styles.input, errors.prenom && styles.inputError]}
          placeholder="Prénom"
          value={prenom}
          onChangeText={setPrenom}
        />

        <TextInput
          style={[styles.input, errors.age && styles.inputError]}
          placeholder="Âge"
          keyboardType="number-pad"
          value={age}
          onChangeText={setAge}
        />

        <TextInput
          style={[styles.input, errors.telephone && styles.inputError]}
          placeholder="Téléphone"
          keyboardType="number-pad"
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

        {/* Filière */}
        <View style={[styles.pickerContainer, errors.filiere && styles.inputError]}>
          <Picker
            selectedValue={isNouvelleFiliere ? 'nouvelle' : filiere}
            onValueChange={(value) => {
              if (value === 'nouvelle') {
                setIsNouvelleFiliere(true);
                setFiliere('');
              } else {
                setIsNouvelleFiliere(false);
                setFiliere(value);
              }
            }}
          >
            <Picker.Item label="Sélectionner une filière" value="" />
            {filieres.map((f, index) => (
              <Picker.Item key={index} label={f} value={f} />
            ))}
            <Picker.Item label="➕ Nouvelle filière" value="nouvelle" />
          </Picker>
        </View>

        {isNouvelleFiliere && (
          <TextInput
            style={[styles.input, errors.filiere && styles.inputError]}
            placeholder="Entrer nouvelle filière"
            value={nouvelleFiliere}
            onChangeText={setNouvelleFiliere}
          />
        )}

        <TouchableOpacity
          style={styles.button}
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
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  inputError: {
    borderColor: 'red',
  },
  sexeContainer: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  sexeButton: {
    flex: 1,
    padding: 12,
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
    fontWeight: '600',
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    marginVertical: 8,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#1e90ff',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default AddStudentScreen;
