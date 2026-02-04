import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator
} from 'react-native';

import { updateUserEmail } from '../../../api/api';
import { User } from '../../../types/User';

interface EmailCardProps {
  user: User;
  onUpdate: (user: User) => void;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const EmailCard: React.FC<EmailCardProps> = ({ user, onUpdate }) => {

  const [email, setEmail] = useState(user.email ?? '');
  const [loading, setLoading] = useState(false);

  /* Synchroniser si user change */
  useEffect(() => {
    setEmail(user.email ?? '');
  }, [user.email]);

  /* =========================
     UPDATE EMAIL
  ========================== */
  const handleUpdateEmail = useCallback(async () => {

    if (!user.id) {
      Alert.alert('Erreur', 'ID utilisateur manquant');
      return;
    }

    const cleanEmail = email.trim();

    if (!emailRegex.test(cleanEmail)) {
      Alert.alert('Erreur', 'Veuillez entrer un email valide');
      return;
    }

    if (cleanEmail === user.email) {
      Alert.alert('Information', 'Aucune modification détectée');
      return;
    }

    setLoading(true);

    try {

      const updatedUser = await updateUserEmail(user.id, cleanEmail);

      onUpdate(updatedUser);

      Alert.alert('Succès', 'Email mis à jour');

    } catch (error: any) {

      Alert.alert(
        'Erreur',
        error.message || 'Impossible de mettre à jour l’email'
      );

    } finally {
      setLoading(false);
    }

  }, [email, user, onUpdate]);

  return (
    <View style={styles.card}>

      <Text style={styles.label}>Adresse Email</Text>

      <TextInput
        style={[styles.input, loading && styles.inputDisabled]}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!loading}
        placeholder="exemple@email.com"
      />

      <TouchableOpacity
        style={[styles.btn, loading && styles.btnDisabled]}
        onPress={handleUpdateEmail}
        disabled={loading}
      >
        {loading
          ? <ActivityIndicator />
          : <Text style={styles.btnText}>Modifier l’email</Text>
        }
      </TouchableOpacity>

    </View>
  );
};

export default EmailCard;

/* ================= STYLES ================= */

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
    marginBottom: 8
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
    padding: 13,
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
