import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import PasswordCard from '../components/profile/password/PasswordCard';

const SecurityScreen = () => {
  // Ici tu peux récupérer l'ID user depuis AsyncStorage ou context
  const [userId, setUserId] = useState<number>(1); // exemple static, à remplacer

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Sécurité</Text>

      <Text style={styles.section}>Mot de passe</Text>
      <PasswordCard userId={userId} />

      <Text style={styles.section}>Autres options</Text>
      <View style={styles.card}>
        <Text style={styles.infoText}>
          Ici vous pouvez ajouter d’autres fonctionnalités de sécurité comme:
          {"\n"}- Authentification 2FA
          {"\n"}- Historique de connexion
          {"\n"}- Déconnexion de tous les appareils
        </Text>
      </View>
    </ScrollView>
  );
};

export default SecurityScreen;

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#f7f9fc', flexGrow: 1 },
  title: { fontSize: 26, fontWeight: '700', marginBottom: 20 },
  section: { fontSize: 18, fontWeight: '600', marginTop: 15, marginBottom: 10 },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 14,
    elevation: 2,
    marginBottom: 15,
  },
  infoText: { fontSize: 15, color: '#555', lineHeight: 22 },
});
