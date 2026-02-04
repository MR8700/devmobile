import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

import { Etudiant, getEtudiants } from '../api/api';
import DashboardButton from '../components/dashboard/DashboardButton';
import StudentDetailScreen from './StudentDetailScreen';

const COLORS = {
  primary: '#1e90ff',
  background: '#f7f9fc',
  card: '#ffffff',
  textPrimary: '#111',
  textSecondary: '#666',
  textMuted: '#555',
};

const DashboardScreen = ({ navigation }: any) => {
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<Etudiant[]>([]);
  const [total, setTotal] = useState(0);
  const [garcons, setGarcons] = useState(0);
  const [filles, setFilles] = useState(0);
  const [search, setSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Etudiant | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);

  // FETCH STUDENTS + STATS
  const loadStudents = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getEtudiants();
      setStudents(data.map(s => ({ ...s, id: s.id! })));
      setTotal(data.length);
      setGarcons(data.filter(s => s.sexe === 'M').length);
      setFilles(data.filter(s => s.sexe === 'F').length);
    } catch (err) {
      console.error('Erreur dashboard :', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadStudents();
    }, [loadStudents])
  );

  // DETAIL MODAL
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

  // FILTRE RECHERCHE
  const filteredStudents = students.filter(
    s =>
      s.nom.toLowerCase().includes(search.toLowerCase()) ||
      s.prenom.toLowerCase().includes(search.toLowerCase()) ||
      s.filiere.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loaderText}>Chargement du tableau de bord…</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>Tableau de bord</Text>
        <Text style={styles.subtitle}>Gestion académique des étudiants</Text>
      </View>

      {/* STATS */}
      <View style={styles.statsCard}>
        <StatItem icon="people-outline" label="Total" value={total} color={COLORS.primary} />
        <StatItem icon="male-outline" label="Garçons" value={garcons} color="#2563eb" />
        <StatItem icon="female-outline" label="Filles" value={filles} color="#db2777" />
      </View>

      {/* RECHERCHE */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#888" />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher par nom, prénom ou filière…"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* LISTE HORIZONTALE */}
      {filteredStudents.length > 0 && (
        <FlatList
          data={filteredStudents}
          keyExtractor={item => item.id!.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 10 }}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.studentCard} onPress={() => openDetail(item)}>
              <View style={styles.photoWrapper}>
                {item.photo ? (
                  <Image source={{ uri: item.photo }} style={styles.photo} />
                ) : (
                  <Ionicons name="person-circle-outline" size={50} color="#ccc" />
                )}
              </View>
              <View style={styles.studentInfo}>
                <Text style={styles.studentName}>{item.nom} {item.prenom}</Text>
                <Text style={styles.studentFiliere}>{item.filiere}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}

      {/* ACTIONS RAPIDES */}
      <Text style={styles.sectionTitle}>Actions rapides</Text>
      <View style={styles.actionsGrid}>
        <DashboardButton
          icon="list-outline"
          label="Étudiants"
          onPress={() => navigation.navigate('Students')}
        />
        <DashboardButton
          icon="person-add-outline"
          label="Ajouter"
          onPress={() => navigation.navigate('AddStudent')}
        />
        <DashboardButton
          icon="school-outline"
          label="Filières"
          
          onPress={() => navigation.navigate('App', { screen: 'Filieres' })}
        />
        
      </View>

      {/* MODAL DETAIL */}
      {selectedStudent && (
        <StudentDetailScreen
          visible={detailVisible}
          student={selectedStudent}
          onClose={closeDetail}
          onEdit={() => handleEdit(selectedStudent)}
        />
      )}
    </ScrollView>
  );
};

export default DashboardScreen;

/* =======================
   STAT ITEM
======================= */
const StatItem = ({ icon, label, value, color }: { icon: any; label: string; value: number; color: string }) => (
  <View style={styles.statItem}>
    <Ionicons name={icon} size={26} color={color} />
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

/* =======================
   STYLES
======================= */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 20, paddingBottom: 30 },

  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loaderText: { marginTop: 12, fontSize: 14, color: COLORS.textMuted },

  header: { marginBottom: 28 },
  title: { fontSize: 26, fontWeight: '700', color: COLORS.textPrimary },
  subtitle: { fontSize: 15, color: COLORS.textSecondary, marginTop: 4 },

  statsCard: {
    backgroundColor: COLORS.card,
    borderRadius: 18,
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    elevation: 3,
  },
  statItem: { alignItems: 'center' },
  statValue: { fontSize: 22, fontWeight: '700', marginTop: 6 },
  statLabel: { fontSize: 13, color: COLORS.textMuted },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 15,
    elevation: 2,
  },
  searchInput: { marginLeft: 8, flex: 1, fontSize: 15 },

  studentCard: {
    width: 140,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
    marginRight: 12,
    alignItems: 'center',
    elevation: 2,
  },
  photoWrapper: { marginBottom: 8 },
  photo: { width: 60, height: 60, borderRadius: 30 },
  studentInfo: { alignItems: 'center' },
  studentName: { fontWeight: '600', fontSize: 14, textAlign: 'center' },
  studentFiliere: { fontSize: 12, color: COLORS.primary, marginTop: 2 },

  sectionTitle: { fontSize: 18, fontWeight: '600', marginVertical: 15 },
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
});
