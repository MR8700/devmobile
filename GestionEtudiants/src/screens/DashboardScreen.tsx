import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

import { Etudiant, getEtudiants, deleteEtudiant } from '../api/api';
import DashboardButton from '../components/dashboard/DashboardButton';
import StudentDetailScreen from './StudentDetailScreen';
import { styles } from '../components/dashboard/DashboadStyle';
import { StatItem } from '../components/statistic/StatItem';



const DashboardScreen = ({ navigation }: any) => {
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<Etudiant[]>([]);
  const [total, setTotal] = useState(0);
  const [garcons, setGarcons] = useState(0);
  const [filles, setFilles] = useState(0);
  const [search, setSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Etudiant | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);

  const COLORS = {
  primary: '#1e90ff',
  background: '#f7f9fc',
  card: '#ffffff',
  textPrimary: '#111',
  textSecondary: '#666',
  textMuted: '#555',
};
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
      Alert.alert('Erreur', 'Impossible de charger les étudiants');
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

  const handleDelete = async (student: Etudiant) => {
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
              if (selectedStudent?.id === student.id) closeDetail();
              await loadStudents();
              Alert.alert('Succès', 'Étudiant supprimé');
            } catch {
              Alert.alert('Erreur', 'Impossible de supprimer cet étudiant');
            }
          },
        },
      ]
    );
  };

  // FILTRE RECHERCHE (nom, prénom, filière, INE)
  const filteredStudents = students.filter(
    s =>
      `${s.nom} ${s.prenom} ${s.filiere} ${s.ine ?? ''}`
        .toLowerCase()
        .includes(search.toLowerCase())
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
          placeholder="Rechercher par nom, prénom, filière ou INE…"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* LISTE HORIZONTALE */}
      {filteredStudents.length > 0 ? (
        <FlatList
          data={filteredStudents}
          keyExtractor={item => item.id!.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 10 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.studentCard}
              onPress={() => openDetail(item)}
              activeOpacity={0.7}
            >
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
      ) : (
        <Text style={styles.emptyText}>Aucun étudiant trouvé</Text>
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
          onPress={() => navigation.navigate('Filieres')}
        />
        <DashboardButton
          icon="construct-outline"
          label="Modifications particulières"
          onPress={() => navigation.navigate('SpecialEditStudent')}
        />
      </View>

      {/* MODAL DETAIL */}
      {selectedStudent && (
        <StudentDetailScreen
          visible={detailVisible}
          student={selectedStudent}
          onClose={closeDetail}
          onEdit={() => handleEdit(selectedStudent)}
          onDelete={() => handleDelete(selectedStudent)}
        />
      )}
    </ScrollView>
  );
};

export default DashboardScreen;


