import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { login } from '../api/userapi';

interface Props {
  navigation: any;
}

const LoginScreen: React.FC<Props> = ({ navigation }) => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  /* ================= VALIDATION EMAIL ================= */

  const isEmailValid = (value: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  /* ================= LOGIN ================= */

  const handleLogin = async () => {

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    if (!isEmailValid(cleanEmail)) {
      Alert.alert('Erreur', 'Format email invalide');
      return;
    }

    setLoading(true);

    try {

      const data = await login(cleanEmail, cleanPassword);

      Alert.alert(
        'Connexion réussie',
        `Bienvenue ${data.prenom} ${data.nom}`
      );

      /* Remplace la stack auth */
      navigation.getParent()?.replace('App');

    } catch (error: any) {

      Alert.alert(
        'Erreur de connexion',
        error.message || 'Identifiants incorrects'
      );

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

        <Text style={styles.title}>Connexion</Text>

        {/* EMAIL */}

        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          value={email}
          onChangeText={setEmail}
        />

        {/* PASSWORD */}

        <View style={styles.passwordContainer}>

          <TextInput
            style={styles.passwordInput}
            placeholder="Mot de passe"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            autoCapitalize="none"
          />

          <TouchableOpacity
            onPress={() => setShowPassword(prev => !prev)}
          >
            <Ionicons
              name={showPassword ? 'eye' : 'eye-off'}
              size={24}
              color="#555"
            />
          </TouchableOpacity>

        </View>

        {/* BUTTON LOGIN */}

        <TouchableOpacity
          style={[
            styles.button,
            loading && styles.buttonDisabled
          ]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>
              Se connecter
            </Text>
          )}
        </TouchableOpacity>

        {/* REGISTER LINK */}

        <TouchableOpacity
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.toggleText}>
            Pas de compte ? S'inscrire
          </Text>
        </TouchableOpacity>

      </ScrollView>

    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

/* ================= STYLES ================= */

const styles = StyleSheet.create({

  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },

  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center'
  },

  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    marginVertical: 10,
  },

  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 14,
    marginVertical: 10,
  },

  passwordInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16
  },

  button: {
    backgroundColor: '#4a90e2',
    paddingVertical: 15,
    borderRadius: 10,
    marginVertical: 20,
  },

  buttonDisabled: {
    opacity: 0.6
  },

  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16
  },

  toggleText: {
    color: '#4a90e2',
    textAlign: 'center',
    fontSize: 14
  }

});
