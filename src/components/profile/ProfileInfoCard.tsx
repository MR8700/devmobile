import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';

import { getCurrentUser, updateUserInfo } from '../../api/api';
import { User } from '../../types/User';

interface Props {
  user: User;
  onUpdate?: (user: User) => void;
}

const ProfileInfoCard: React.FC<Props> = ({ user, onUpdate }) => {

  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    nom: '',
    prenom: '',
  });

  /* Sync form quand user change */
  useEffect(() => {
    setForm({
      nom: user.nom || '',
      prenom: user.prenom || '',
    });
  }, [user]);

  /* ================= SAVE ================= */

  const save = async () => {

    if (!form.nom.trim() || !form.prenom.trim()) {
      Alert.alert('Erreur', 'Nom et prénom obligatoires');
      return;
    }

    try {
      setLoading(true);

      // ✅ Update backend
      await updateUserInfo({
        nom: form.nom.trim(),
        prenom: form.prenom.trim(),
        email: user.email,
        photo: user.photo
      });

      // ✅ Recharger utilisateur
      const updatedUser = await getCurrentUser();

      onUpdate?.(updatedUser);

      Alert.alert('Succès', 'Profil mis à jour');

      setVisible(false);

    } catch (error: any) {

      Alert.alert(
        'Erreur',
        error?.message || 'Impossible de mettre à jour'
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.card}>

      <Text style={styles.title}>Informations personnelles</Text>

      <Text style={styles.row}>Nom : {user.nom}</Text>
      <Text style={styles.row}>Prénom : {user.prenom}</Text>

      <TouchableOpacity
        style={styles.btn}
        onPress={() => setVisible(true)}
      >
        <Text style={styles.btnText}>Modifier</Text>
      </TouchableOpacity>

      {/* ================= MODAL ================= */}

      <Modal visible={visible} transparent animationType="slide">

        <View style={styles.modal}>

          <View style={styles.modalCard}>

            <Text style={styles.title}>Modifier profil</Text>

            <TextInput
              style={styles.input}
              value={form.nom}
              onChangeText={(t) => setForm({ ...form, nom: t })}
              placeholder="Nom"
            />

            <TextInput
              style={styles.input}
              value={form.prenom}
              onChangeText={(t) => setForm({ ...form, prenom: t })}
              placeholder="Prénom"
            />

            <TouchableOpacity
              style={styles.save}
              onPress={save}
              disabled={loading}
            >
              {loading
                ? <ActivityIndicator color="#fff" />
                : <Text style={styles.saveText}>Enregistrer</Text>
              }
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setVisible(false)}
              disabled={loading}
            >
              <Text style={styles.cancel}>Annuler</Text>
            </TouchableOpacity>

          </View>

        </View>

      </Modal>

    </View>
  );
};

export default ProfileInfoCard;


const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 18,
    elevation: 3,
  },

  title: {
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 12,
  },

  row: {
    marginBottom: 6,
    color: '#444',
  },

  btn: {
    marginTop: 10,
    backgroundColor: '#2563eb',
    padding: 10,
    borderRadius: 8,
  },

  btnText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },

  modal: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: 20,
  },

  modalCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
  },

  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },

  save: {
    backgroundColor: '#16a34a',
    padding: 12,
    borderRadius: 8,
  },

  saveText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },

  cancel: {
    textAlign: 'center',
    marginTop: 12,
    color: '#dc2626',
  },
});
