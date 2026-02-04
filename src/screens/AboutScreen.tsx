import React from 'react';
import { View, Text, StyleSheet, Linking, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const AboutScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>À propos</Text>

      <View style={styles.card}>
        <Text style={styles.text}>
          GestionEtudiants v1.0.0{"\n\n"}
          Application de gestion des étudiants avec fonctionnalités :
        </Text>
        <Text style={styles.list}>• Ajout / modification / suppression d’étudiants</Text>
        <Text style={styles.list}>• Gestion des filières</Text>
        <Text style={styles.list}>• Authentification sécurisée</Text>
        <Text style={styles.list}>• Profil utilisateur</Text>
        <Text style={styles.list}>• Paramètres personnalisables</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.text}>
          Développé par Richard Maré {"\n"} 2026
        </Text>
        <View style={styles.links}>
          <Ionicons name="logo-github" size={20} color="#1e90ff" />
          <Text style={styles.link} onPress={() => Linking.openURL('https://github.com/')}>
            GitHub
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default AboutScreen;

const styles = StyleSheet.create({
  container: { padding: 20, flexGrow: 1, backgroundColor: '#f7f9fc' },
  title: { fontSize: 26, fontWeight: '700', marginBottom: 20 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 15,
    elevation: 2,
  },
  text: { fontSize: 15, color: '#555', lineHeight: 22, marginBottom: 8 },
  list: { fontSize: 14, color: '#333', marginLeft: 10, marginBottom: 4 },
  links: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
  link: { marginLeft: 8, color: '#1e90ff', textDecorationLine: 'underline' },
});
