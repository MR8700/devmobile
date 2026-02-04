import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface PasswordCardProps {
  userId?: number;
}

/* Validation mot de passe minimale */
const isStrongPassword = (password: string) => {
  return password.length >= 6;
};

const PasswordCard: React.FC<PasswordCardProps> = ({ userId }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  /* =========================
     Changement mot de passe
  ========================== */
  const changePassword = useCallback(async () => {

    if (!currentPassword || !newPassword) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    if (!isStrongPassword(newPassword)) {
      Alert.alert('Erreur', 'Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    if (currentPassword === newPassword) {
      Alert.alert('Erreur', 'Le nouveau mot de passe doit être différent');
      return;
    }

    setLoading(true);

    try {
      const token = await AsyncStorage.getItem('token');

      if (!token) {
        Alert.alert('Session expirée', 'Veuillez vous reconnecter');
        return;
      }

      await axios.put(
        `http://10.0.2.2:3000/api/users/${userId}/password`,
        {
          currentPassword: currentPassword.trim(),
          newPassword: newPassword.trim()
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          timeout: 5000
        }
      );

      Alert.alert('Succès', 'Mot de passe mis à jour');

      setCurrentPassword('');
      setNewPassword('');

    } catch (error: any) {

      if (error.response) {
        Alert.alert('Erreur', error.response.data?.message || 'Erreur serveur');
      }
      else if (error.request) {
        Alert.alert('Erreur réseau', 'Impossible de joindre le serveur');
      }
      else {
        Alert.alert('Erreur', 'Une erreur inattendue est survenue');
      }

    } finally {
      setLoading(false);
    }

  }, [currentPassword, newPassword, userId]);

  return (
    <View style={styles.card}>

      <Text style={styles.label}>Changer le mot de passe</Text>

      <TextInput
        placeholder="Mot de passe actuel"
        secureTextEntry
        style={[styles.input, loading && styles.inputDisabled]}
        value={currentPassword}
        onChangeText={setCurrentPassword}
        editable={!loading}
      />

      <TextInput
        placeholder="Nouveau mot de passe"
        secureTextEntry
        style={[styles.input, loading && styles.inputDisabled]}
        value={newPassword}
        onChangeText={setNewPassword}
        editable={!loading}
      />

      <TouchableOpacity
        style={[styles.btn, loading && styles.btnDisabled]}
        onPress={changePassword}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator />
        ) : (
          <Text style={styles.btnText}>Changer le mot de passe</Text>
        )}
      </TouchableOpacity>

    </View>
  );
};

export default PasswordCard;

/* =========================
   Styles
========================= */
const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 18,
    elevation: 3
  },

  label: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 10
  },

  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    fontSize: 15
  },

  inputDisabled: {
    backgroundColor: '#f2f2f2'
  },

  btn: {
    backgroundColor: '#1e90ff',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center'
  },

  btnDisabled: {
    opacity: 0.6
  },

  btnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15
  }
});
