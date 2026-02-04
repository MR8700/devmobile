import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/* =======================
   TYPE
======================= */
type Filiere = {
  id: number;
  nom: string;
  code: string;
};

const FilieresScreen = () => {
  const [filieres, setFilieres] = useState<Filiere[]>([]);
  const [loading, setLoading] = useState(true);

  /* =======================
     LOAD (MOCK / API)
  ======================= */
  useEffect(() => {
    // 🔁 Remplacer par API plus tard
    setTimeout(() => {
      setFilieres([
        { id: 1, nom: 'Informatique', code: 'INFO' },
        { id: 2, nom: 'Mathématiques', code: 'MATH' },
        { id: 3, nom: 'Physique', code: 'PHY' },
      ]);
      setLoading(false);
    }, 800);
  }, []);

  /* =======================
     RENDER ITEM
  ======================= */
  const renderItem = ({ item }: { item: Filiere }) => (
    <View style={styles.card}>
      <Ionicons name="school-outline" size={24} color="#4a90e2" />
      <View style={styles.textContainer}>
        <Text style={styles.name}>{item.nom}</Text>
        <Text style={styles.code}>{item.code}</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#4a90e2" />
        <Text style={styles.loaderText}>Chargement des filières…</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={filieres}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
      contentContainerStyle={styles.container}
    />
  );
};

export default FilieresScreen;

/* =======================
   STYLES
======================= */
const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f7f9fc',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {
    marginTop: 10,
    color: '#555',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 14,
    marginBottom: 14,
    elevation: 2,
  },
  textContainer: {
    marginLeft: 15,
  },
  name: {
    fontSize: 17,
    fontWeight: '600',
  },
  code: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 2,
  },
});
