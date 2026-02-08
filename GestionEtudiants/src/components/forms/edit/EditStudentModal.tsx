import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Animated,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import { Etudiant, updateEtudiant } from '../../../api/api';
import EditPhotoModal from '../../photo/EditPhotoModal';

import {
  isAgeValid,
  isFiliereValid,
  isNameValid,
  isPhoneValid,
} from '../../forms/FieldValidation';

interface StudentForm {
  ine: string;
  nom: string;
  prenom: string;
  age: string;
  telephone: string;
  filiere: string;
  sexe: 'M' | 'F';
}

interface Props {
  visible: boolean;
  student: Etudiant | null;
  onClose: () => void;
  onRefresh: () => void;
}

const BASE_URL = 'http://10.0.2.2:3000';

const EditStudentModal: React.FC<Props> = ({
  visible,
  student,
  onClose,
  onRefresh,
}) => {
  const [form, setForm] = useState<StudentForm>({
    ine: '',
    nom: '',
    prenom: '',
    age: '',
    telephone: '',
    filiere: '',
    sexe: 'M',
  });

  const [originalValues, setOriginalValues] = useState<StudentForm | null>(null);
  const [photo, setPhoto] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [photoModalVisible, setPhotoModalVisible] = useState(false);
  const [slideAnim] = useState(new Animated.Value(300)); // pour animation bottom sheet

  const [errors, setErrors] = useState({
    nom: false,
    prenom: false,
    age: false,
    telephone: false,
    filiere: false,
  });

  /* ================= INIT ================= */
  useEffect(() => {
    if (student) {
      const initForm: StudentForm = {
        ine: student.ine ?? '',
        nom: student.nom ?? '',
        prenom: student.prenom ?? '',
        age: student.age?.toString() ?? '',
        telephone: student.telephone ?? '',
        filiere: student.filiere ?? '',
        sexe: student.sexe ?? 'M',
      };
      setForm(initForm);
      setOriginalValues(initForm);

      if (student.photo) {
        setPhoto(
          student.photo.startsWith('http')
            ? student.photo
            : `${BASE_URL}${student.photo}`
        );
      }

      // Animation d'apparition
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    }
  }, [student, slideAnim]);

  if (!student) return null;

  /* ================= VALIDATION ================= */
  const validateField = (field: keyof StudentForm, value: string) => {
    let valid = true;
    switch (field) {
      case 'nom':
      case 'prenom':
        valid = isNameValid(value);
        break;
      case 'age':
        valid = isAgeValid(value);
        break;
      case 'telephone':
        valid = isPhoneValid(value);
        break;
      case 'filiere':
        valid = isFiliereValid(value);
        break;
    }
    setErrors(prev => ({ ...prev, [field]: !valid }));
  };

  /* ================= SAVE ================= */
  const confirmINEChange = () => {
    if (form.ine !== student.ine) {
      Alert.alert(
        'Confirmation',
        'Vous modifiez l’INE. Continuer ?',
        [
          { text: 'Annuler', style: 'cancel' },
          { text: 'Confirmer', onPress: handleSave },
        ]
      );
      return;
    }
    handleSave();
  };

  const handleSave = async () => {
    if (Object.values(errors).some(Boolean)) {
      return Alert.alert('Erreur', 'Corrigez les champs invalides');
    }

    setLoading(true);
    try {
      const payload: Etudiant = {
        ...student,
        ine: form.ine.trim(),
        nom: form.nom.trim(),
        prenom: form.prenom.trim(),
        age: Number(form.age),
        telephone: form.telephone.trim(),
        filiere: form.filiere.trim(),
        sexe: form.sexe,
        photo: photo ? photo.replace(BASE_URL, '') : undefined,
      };
      await updateEtudiant(payload);
      Alert.alert('Succès', 'Étudiant modifié');
      onRefresh();
      onClose();
    } catch (e: any) {
      Alert.alert('Erreur', e.message);
    } finally {
      setLoading(false);
    }
  };

  /* ================= RENDER INPUT ================= */
  const renderInput = (
    label: string,
    field: keyof StudentForm,
    keyboardType: any = 'default'
  ) => (
    <View style={styles.inputRow} key={field}>
      <View style={{ flex: 1 }}>
        <Text style={styles.label}>{label}</Text>
        <TextInput
          style={[
            styles.input,
            errors[field as keyof typeof errors] ? styles.errorInput : null,
          ]}
          keyboardType={keyboardType}
          value={form[field]}
          onChangeText={v => {
            setForm(p => ({ ...p, [field]: v }));
            validateField(field, v);
          }}
        />
      </View>

      {originalValues && form[field] !== originalValues[field] && (
        <TouchableOpacity
          style={styles.restoreBtn}
          onPress={() =>
            setForm(p => ({
              ...p,
              [field]: (originalValues as any)[field]?.toString() ?? '',
            }))
          }
        >
          <Text style={styles.restoreText}>↺</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  /* ================= UI ================= */
  return (
    <Modal visible={visible} transparent animationType="fade">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <View style={styles.overlay}>
          <Animated.View style={[styles.modalContainer, { transform: [{ translateY: slideAnim }] }]}>
            {/* HEADER */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Modifier étudiant</Text>
              <TouchableOpacity onPress={onClose}>
                <Text style={styles.closeBtn}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* PHOTO */}
              <TouchableOpacity
                style={styles.photoWrapper}
                onPress={() => setPhotoModalVisible(true)}
              >
                {photo ? (
                  <Image source={{ uri: photo }} style={styles.photo} />
                ) : (
                  <Text style={styles.photoText}>Ajouter Photo</Text>
                )}
              </TouchableOpacity>

              {/* INPUTS */}
              {renderInput('INE', 'ine')}
              {renderInput('Nom', 'nom')}
              {renderInput('Prénom', 'prenom')}
              {renderInput('Age', 'age', 'number-pad')}
              {renderInput('Téléphone', 'telephone', 'phone-pad')}
              {renderInput('Filière', 'filiere')}

              {/* ACTIONS */}
              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={onClose}
                >
                  <Text style={styles.btnText}>Annuler</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.saveBtn}
                  onPress={confirmINEChange}
                >
                  {loading
                    ? <ActivityIndicator color="#fff" />
                    : <Text style={styles.btnText}>Enregistrer</Text>}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </Animated.View>
        </View>

        <EditPhotoModal
          visible={photoModalVisible}
          studentId={student.id!}
          currentPhoto={photo}
          onClose={() => setPhotoModalVisible(false)}
          onConfirm={uri => {
            setPhoto(uri);
            setPhotoModalVisible(false);
          }}
        />
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default EditStudentModal;

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 22,
    padding: 20,
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeBtn: {
    fontSize: 22,
  },
  label: {
    fontWeight: '600',
    marginBottom: 4,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#f3f6fa',
    borderRadius: 12,
    padding: 12,
  },
  errorInput: {
    borderColor: 'red',
    borderWidth: 1,
  },
  restoreBtn: {
    marginLeft: 8,
    backgroundColor: '#eaf2ff',
    padding: 10,
    borderRadius: 10,
  },
  restoreText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e90ff',
  },
  photoWrapper: {
    alignItems: 'center',
    marginBottom: 15,
  },
  photo: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  photoText: {
    color: '#999',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelBtn: {
    backgroundColor: '#e74c3c',
    padding: 14,
    borderRadius: 12,
    flex: 1,
    marginRight: 10,
  },
  saveBtn: {
    backgroundColor: '#1abc9c',
    padding: 14,
    borderRadius: 12,
    flex: 1,
  },
  btnText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
