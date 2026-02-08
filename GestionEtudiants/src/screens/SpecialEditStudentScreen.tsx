import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';

import { Etudiant, getEtudiants } from '../api/api';
import { useFocusEffect } from '@react-navigation/native';
import EditStudentModal from '../components/forms/edit/EditStudentModal';

const SpecialEditStudentScreen = () => {
  const [students, setStudents] = useState<Etudiant[]>([]);
  const [selectedStudent, setSelectedStudent] =
    useState<Etudiant | null>(null);
  const [modalVisible, setModalVisible] =
    useState(false);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  /* ================= FETCH ================= */

  const loadStudents = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getEtudiants();
      setStudents(data);
    } catch {
      Alert.alert('Erreur chargement');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadStudents();
    }, [])
  );

  /* ================= FILTER ================= */

  const filtered = students.filter(
    s =>
      s.nom.toLowerCase().includes(search.toLowerCase()) ||
      s.prenom
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      s.ine.toLowerCase().includes(search.toLowerCase())
  );

  /* ================= UI ================= */

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Modifier étudiant
      </Text>

      <TextInput
        style={styles.search}
        placeholder="Recherche..."
        value={search}
        onChangeText={setSearch}
      />

      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={i => i.id!.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => {
                setSelectedStudent(item);
                setModalVisible(true);
              }}
            >
              <Text style={styles.name}>
                {item.nom} {item.prenom}
              </Text>
              <Text>{item.ine}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      <EditStudentModal
        visible={modalVisible}
        student={selectedStudent}
        onClose={() => setModalVisible(false)}
        onRefresh={loadStudents}
      />
    </View>
  );
};

export default SpecialEditStudentScreen;

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15 },

  title: { fontSize: 20, fontWeight: 'bold' },

  search: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    marginVertical: 15,
  },

  card: {
    backgroundColor: '#ecf0f1',
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
  },

  name: { fontWeight: 'bold' },
});
