import React, { useCallback, useEffect, useState } from 'react';
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
  getEtudiants,
} from '../api/api';
import { styles } from '../components/forms/add/AddStudentStyle';
import { isAgeValid, isFiliereValid, isIneValid, isNameValid, isPhoneValid } from '../components/forms/FieldValidation';
import { useFocusEffect } from '@react-navigation/native';

const AddStudentScreen: React.FC = () => {
   const [students, setStudents] = useState<Etudiant[]>([]);
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


export default AddStudentScreen;
