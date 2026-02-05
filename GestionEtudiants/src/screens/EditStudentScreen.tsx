import React, { useState, useEffect, useCallback } from 'react';
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
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/types';
import EditPhotoModal from '../components/photo/EditPhotoModal';
import { deleteEtudiant, updateEtudiant, Etudiant, getEtudiants } from '../api/api';
import { isAgeValid, isFiliereValid, isNameValid, isPhoneValid } from '../components/forms/FieldValidation';
import { styles } from '../components/forms/edit/EditStyle';
import { useFocusEffect } from '@react-navigation/native';

type Props = NativeStackScreenProps<RootStackParamList, 'EditStudent'>;

const EditStudentScreen: React.FC<Props> = ({ route, navigation }) => {
  const { student } = route.params;

  /* ================= STATES ================= */
   const [students, setStudents] = useState<Etudiant[]>([]);
  const [nom, setNom] = useState(student.nom);
  const [prenom, setPrenom] = useState(student.prenom);
  const [age, setAge] = useState(student.age?.toString() ?? '');
  const [telephone, setTelephone] = useState(student.telephone ?? '');
  const [sexe, setSexe] = useState<'M' | 'F'>(student.sexe);
  const [filiere, setFiliere] = useState(student.filiere);

  const [photo, setPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [photoModalVisible, setPhotoModalVisible] = useState(false);

  // Etats d'erreur pour affichage rouge
  const [errors, setErrors] = useState({
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
    if (student.photo) {
      setPhoto(
        student.photo.startsWith('http')
          ? student.photo
          : `http://10.0.2.2:3000${student.photo}`
      );
    }
  }, [student.photo]);

  /* ================= UPDATE ================= */
  const handleSubmit = async () => {
    if (!student?.id) {
      Alert.alert('Erreur', 'ID étudiant introuvable');
      return;
    }

    const newErrors = {
      nom: !isNameValid(nom),
      prenom: !isNameValid(prenom),
      age: !isAgeValid(age),
      telephone: !isPhoneValid(telephone),
      filiere: !isFiliereValid(filiere),
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

    if (!['M', 'F'].includes(sexe)) {
      return Alert.alert('Sexe invalide', 'Veuillez sélectionner un sexe valide.');
    }

    setLoading(true);
    try {
      const updatedStudent: Etudiant = {
        id: student.id,
        ine: student.ine,
        nom: nom.trim(),
        prenom: prenom.trim(),
        age: parseInt(age),
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
        <TextInput
          style={[styles.input, errors.nom && styles.inputError]}
          placeholder="Nom"
          value={nom}
          onChangeText={setNom}
        />

        {/* PRENOM */}
        <TextInput
          style={[styles.input, errors.prenom && styles.inputError]}
          placeholder="Prénom"
          value={prenom}
          onChangeText={setPrenom}
        />

        {/* AGE */}
        <TextInput
          style={[styles.input, errors.age && styles.inputError]}
          placeholder="Âge"
          keyboardType="number-pad"
          value={age}
          onChangeText={setAge}
        />

        {/* TELEPHONE */}
        <TextInput
          style={[styles.input, errors.telephone && styles.inputError]}
          placeholder="Téléphone"
          keyboardType="phone-pad"
          value={telephone}
          onChangeText={setTelephone}
        />

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
        <TextInput
          style={[styles.input, errors.filiere && styles.inputError]}
          placeholder="Filière"
          value={filiere}
          onChangeText={setFiliere}
        />

        /* ================= PHOTO ================= */
        <TouchableOpacity onPress={() => setPhotoModalVisible(true)} style={styles.photoWrapper}>
          {photo ? (
            <Image
              source={{ uri: photo.startsWith('http') ? photo : `http://10.0.2.2:3000${photo}` }}
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
          studentId={student.id!}
          currentPhoto={photo ?? undefined}
          onClose={() => setPhotoModalVisible(false)}
          onConfirm={(newPhotoUri: string) => {
            const relativeUri = newPhotoUri.replace('http://10.0.2.2:3000', '');
            setPhoto(relativeUri);
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


