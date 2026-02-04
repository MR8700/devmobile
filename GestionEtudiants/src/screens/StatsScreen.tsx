import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  FlatList,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getEtudiants, Etudiant } from '../api/api';

const COLORS = {
  primary: '#1e90ff',
  secondary: '#32cd32',
  danger: '#f44336',
  background: '#f7f9fc',
  card: '#fff',
  textPrimary: '#111',
  textSecondary: '#666',
  textMuted: '#555',
};

const ageGroups = [
  { label: '< 18', min: 0, max: 17 },
  { label: '18-20', min: 18, max: 20 },
  { label: '21-23', min: 21, max: 23 },
  { label: '24+', min: 24, max: 100 },
];

const StatsScreen = () => {
  const [students, setStudents] = useState<Etudiant[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Modal details
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalData, setModalData] = useState<Etudiant[]>([]);

  // FETCH STUDENTS
  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getEtudiants();
      setStudents(data.map(s => ({ ...s, id: s.id! })));
    } catch (err) {
      console.error('Erreur fetchStudents', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  // REFRESH
  const onRefresh = () => {
    setRefreshing(true);
    fetchStudents();
  };

  /* ================== STATISTIQUES DYNAMIQUES ================== */
  const total = students.length;
  const garcons = students.filter(s => s.sexe === 'M').length;
  const filles = students.filter(s => s.sexe === 'F').length;

  const filieres = Array.from(new Set(students.map(s => s.filiere))).filter(f => f);
  const byFiliere = filieres.map(f => ({
    filiere: f,
    count: students.filter(s => s.filiere === f).length,
  }));

  const byAgeGroup = ageGroups.map(g => ({
    label: g.label,
    min: g.min,
    max: g.max,
    count: students.filter(s => s.age && s.age >= g.min && s.age <= g.max).length,
  }));

  /* ================== MODAL ================== */
  const openModal = (title: string, data: Etudiant[]) => {
    setModalTitle(title);
    setModalData(data);
    setModalVisible(true);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <Text style={styles.title}>Statistiques des étudiants</Text>

      {/* STATS GLOBALES */}
      <View style={styles.cardRow}>
        <StatCard
          icon="people-outline"
          label="Total"
          value={total}
          color={COLORS.primary}
          onPress={() => openModal('Tous les étudiants', students)}
        />
        <StatCard
          icon="male-outline"
          label="Garçons"
          value={garcons}
          color="#2563eb"
          onPress={() => openModal('Garçons', students.filter(s => s.sexe === 'M'))}
        />
        <StatCard
          icon="female-outline"
          label="Filles"
          value={filles}
          color="#db2777"
          onPress={() => openModal('Filles', students.filter(s => s.sexe === 'F'))}
        />
      </View>

      {/* PAR FILIERE */}
      <Text style={styles.sectionTitle}>Par filière</Text>
      <View style={styles.cardRow}>
        {byFiliere.map(f => (
          <StatCard
            key={f.filiere}
            icon="school-outline"
            label={f.filiere}
            value={f.count}
            color={COLORS.secondary}
            onPress={() =>
              openModal(`Filière : ${f.filiere}`, students.filter(s => s.filiere === f.filiere))
            }
          />
        ))}
      </View>

      {/* PAR TRANCHE D'AGE */}
      <Text style={styles.sectionTitle}>Par tranche d'âge</Text>
      <View style={styles.cardRow}>
        {byAgeGroup.map(g => (
          <StatCard
            key={g.label}
            icon="calendar-outline"
            label={g.label}
            value={g.count}
            color={COLORS.primary}
            onPress={() =>
              openModal(
                `Âge : ${g.label}`,
                students.filter(s => s.age && g.min <= s.age && s.age <= g.max)
              )
            }
          />
        ))}
      </View>

      {/* MODAL DETAIL */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{modalTitle}</Text>
            <FlatList
              data={modalData}
              keyExtractor={item => item.id!.toString()}
              renderItem={({ item }) => (
                <View style={styles.modalRow}>
                  <Text style={styles.modalText}>
                    {item.nom} {item.prenom} - {item.filiere}
                  </Text>
                </View>
              )}
            />
            <TouchableOpacity
              style={styles.modalClose}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalCloseText}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default StatsScreen;

/* ================== CARD STAT ================== */
const StatCard = ({
  icon,
  label,
  value,
  color,
  onPress,
}: {
  icon: string;
  label: string;
  value: number;
  color: string;
  onPress?: () => void;
}) => (
  <TouchableOpacity style={[styles.card, { backgroundColor: color }]} onPress={onPress}>
    <Ionicons name={icon as any} size={28} color="#fff" />
    <Text style={styles.cardValue}>{value}</Text>
    <Text style={styles.cardLabel}>{label}</Text>
  </TouchableOpacity>
);

/* ================== STYLES ================== */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 20, paddingBottom: 50 },

  title: { fontSize: 24, fontWeight: '700', marginBottom: 20, color: COLORS.textPrimary },

  cardRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  card: {
    width: '48%',
    padding: 18,
    borderRadius: 12,
    marginBottom: 12,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  cardValue: { fontSize: 22, fontWeight: '700', color: '#fff', marginTop: 6 },
  cardLabel: { fontSize: 14, color: '#fff', marginTop: 2, textAlign: 'center' },

  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 8 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', padding: 20 },
  modalContainer: { backgroundColor: '#fff', borderRadius: 12, padding: 20, maxHeight: '80%' },
  modalTitle: { fontSize: 20, fontWeight: '700', marginBottom: 10 },
  modalRow: { paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: '#eee' },
  modalText: { fontSize: 16 },
  modalClose: {
    marginTop: 10,
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalCloseText: { color: '#fff', fontWeight: '700' },
});
