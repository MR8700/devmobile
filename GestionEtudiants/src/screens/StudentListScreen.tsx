import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';

import { Etudiant, getEtudiants, deleteEtudiant } from '../api/api';
import StudentDetailScreen from './StudentDetailScreen';

const BASE_URL = 'http://10.0.2.2:3000';

const StudentListScreen = ({ navigation }: any) => {
  const [students, setStudents] = useState<Etudiant[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Etudiant | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);

  // FETCH STUDENTS
  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getEtudiants();
      setStudents(
        data.map(s => ({ ...s, id: s.id! }))
      );
    } catch (err) {
      console.error(err);
      Alert.alert('Erreur', 'Impossible de charger les étudiants');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
    const unsubscribe = navigation.addListener('focus', fetchStudents);
    return unsubscribe;
  }, [navigation, fetchStudents]);

  // DELETE STUDENT
  const handleDelete = (student: Etudiant) => {
    Alert.alert(
      'Suppression',
      `Voulez-vous supprimer ${student.nom} ${student.prenom} ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteEtudiant(student.id!);
              // Fermer le détail si c’est le même étudiant
              if (selectedStudent?.id === student.id) {
                setDetailVisible(false);
                setSelectedStudent(null);
              }
              fetchStudents();
              Alert.alert('Succès', 'Étudiant supprimé');
            } catch {
              Alert.alert('Erreur', 'Impossible de supprimer cet étudiant');
            }
          },
        },
      ]
    );
  };

  // OPEN DETAIL MODAL
  const openDetail = (student: Etudiant) => {
    setSelectedStudent(student);
    setDetailVisible(true);
  };

  const closeDetail = () => {
    setSelectedStudent(null);
    setDetailVisible(false);
  };

  const handleEdit = (student: Etudiant) => {
    closeDetail();
    navigation.navigate('EditStudent', { student });
  };

  // SEARCH FILTER (nom, prénom, filière, INE)
  const filtered = students.filter(s =>
    `${s.nom} ${s.prenom} ${s.filiere} ${s.ine}`.toLowerCase().includes(search.toLowerCase())
  );

  // RENDER ITEM
  const renderItem = useCallback(
    ({ item }: { item: Etudiant }) => (
      <TouchableOpacity style={styles.card} onPress={() => openDetail(item)}>
        <Image
          source={
            item.photo
              ? { uri: item.photo }
              : require('../../assets/images/placeholder.png')
          }
          style={styles.photo}
        />
        <View style={styles.info}>
          <Text style={styles.name}>{item.nom} {item.prenom}</Text>
          <Text style={styles.filiere}>{item.filiere}</Text>
          <Text style={styles.meta}>
            {item.sexe === 'M' ? 'Garçon' : 'Fille'}
            {item.age ? ` • ${item.age} ans` : ''}
            {item.telephone ? ` • ${item.telephone}` : ''}
            {item.ine ? ` • ${item.ine}` : ''}
          </Text>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity style={[styles.actionBtn, styles.editBtn]} onPress={() => handleEdit(item)}>
            <Ionicons name="create-outline" size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, styles.deleteBtn]} onPress={() => handleDelete(item)}>
            <Ionicons name="trash-outline" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    ),
    [selectedStudent]
  );

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>Liste des étudiants</Text>
        <TextInput
          placeholder="Rechercher par nom, prénom, filière ou INE..."
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* ADD BUTTON */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddStudent')}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      {/* LIST */}
      {loading ? (
        <ActivityIndicator size="large" color="#1e90ff" style={{ flex: 1 }} />
      ) : filtered.length === 0 ? (
        <View style={styles.emptyContainer}>
          <LottieView
            source={require('../../assets/lottie/Empty.json')}
            autoPlay
            loop
            style={{ width: 200, height: 200 }}
          />
          <Text style={styles.emptyText}>Aucun étudiant trouvé</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => item.id!.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 80, paddingTop: 10 }}
        />
      )}

      {/* DETAIL MODAL */}
      {selectedStudent && (
        <StudentDetailScreen
          visible={detailVisible}
          student={selectedStudent}
          onClose={closeDetail}
          onEdit={() => handleEdit(selectedStudent)}
          onDelete={() => handleDelete(selectedStudent)}
        />
      )}
    </View>
  );
};

export default StudentListScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6fc', padding: 10 },
  header: { marginBottom: 10 },
  title: { fontSize: 22, fontWeight: '700', color: '#1e90ff', marginBottom: 6 },
  searchInput: { backgroundColor: '#fff', borderRadius: 12, padding: 10, fontSize: 16, elevation: 2 },
  addButton: {
    position: 'absolute',
    right: 20,
    top: 15,
    backgroundColor: '#1e90ff',
    width: 55,
    height: 55,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    elevation: 6,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 6,
    borderRadius: 18,
    alignItems: 'center',
    elevation: 4,
  },
  photo: { width: 70, height: 70, borderRadius: 35, marginRight: 12 },
  info: { flex: 1 },
  name: { fontSize: 18, fontWeight: '700', color: '#1a1a1a' },
  filiere: { fontSize: 14, fontWeight: '500', color: '#4a90e2', marginVertical: 2 },
  meta: { fontSize: 12, color: '#555' },
  actions: { flexDirection: 'row', gap: 8 },
  actionBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  editBtn: { backgroundColor: '#1e90ff' },
  deleteBtn: { backgroundColor: '#f44336' },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 80 },
  emptyText: { fontSize: 16, color: '#777', marginTop: 10 },
});
