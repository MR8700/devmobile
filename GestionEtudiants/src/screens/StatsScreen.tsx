import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  FlatList,
  Image,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getEtudiants, Etudiant } from '../api/api';
import { StatCard } from '../components/statistic/StatCard';

const COLORS = {
  primary: '#4f46e5',       // violet moderne
  secondary: '#14b8a6',     // teal
  danger: '#ef4444',        // rouge
  background: '#f3f4f6',    // gris clair
  card: '#ffffff',
  textPrimary: '#111827',
  textSecondary: '#6b7280',
  textMuted: '#374151',
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
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalData, setModalData] = useState<Etudiant[]>([]);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getEtudiants();
      setStudents(data.map(s => ({
        ...s,
        id: s.id!,
        filiere: s.filiere ?? '-',
        age: s.age ?? null
      })));
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

  const onRefresh = () => {
    setRefreshing(true);
    fetchStudents();
  };

  /* ================== STATISTIQUES ================== */
  const total = students.length;
  const garcons = students.filter(s => s.sexe === 'M').length;
  const filles = students.filter(s => s.sexe === 'F').length;
  const avgAge =
    students.filter(s => s.age !== null).length > 0
      ? (
          students.filter(s => s.age !== null).reduce((sum, s) => sum + (s.age ?? 0), 0) /
          students.filter(s => s.age !== null).length
        ).toFixed(1)
      : '-';

  // Filieres avec pourcentage sexe
  const filieres = Array.from(new Set(students.map(s => s.filiere).filter(f => f && f !== '-')));
  const filieresStats = filieres.map(f => {
    const filt = students.filter(s => s.filiere === f);
    const gar = filt.filter(s => s.sexe === 'M').length;
    const fill = filt.filter(s => s.sexe === 'F').length;
    return { filiere: f, total: filt.length, garcons: gar, filles: fill };
  });

  // Garde min/max pour TypeScript
  const byAgeGroup = ageGroups.map(g => ({
    label: g.label,
    min: g.min,
    max: g.max,
    count: students.filter(s => s.age !== null && s.age >= g.min && s.age <= g.max).length,
  }));

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
        <StatCard
          icon="calendar-outline"
          label="Âge moyen"
          value={avgAge === '-' ? 0 : Number(avgAge)}
          color={COLORS.secondary}
        />
      </View>

      {/* PAR FILIERE */}
      <Text style={styles.sectionTitle}>Par filière</Text>
      {filieresStats.length > 0 ? (
        filieresStats.map(f => (
          <TouchableOpacity
            key={f.filiere}
            style={styles.filiereCard}
            activeOpacity={0.8}
            onPress={() => openModal(`Filière : ${f.filiere}`, students.filter(s => s.filiere === f.filiere))}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={styles.filiereLabel}>{f.filiere}</Text>
              <Text style={styles.filiereCount}>{f.total} étudiants</Text>
            </View>
            <View style={styles.genderRow}>
              <View style={[styles.genderBar, { flex: f.garcons, backgroundColor: '#2563eb' }]} />
              <View style={[styles.genderBar, { flex: f.filles, backgroundColor: '#db2777' }]} />
            </View>
            <Text style={styles.genderText}>
              {f.garcons} Garçons • {f.filles} Filles
            </Text>
          </TouchableOpacity>
        ))
      ) : (
        <Text style={{ color: COLORS.textMuted, marginBottom: 12 }}>Aucune filière renseignée</Text>
      )}

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
                students.filter(s => s.age !== null && s.age >= g.min && s.age <= g.max)
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
            {modalData.length > 0 ? (
              <FlatList
                data={modalData}
                keyExtractor={item => item.id!.toString()}
                renderItem={({ item }) => (
                  <View style={styles.modalRow}>
                    <View style={styles.modalPhoto}>
                      {item.photo ? (
                        <Image source={{ uri: item.photo }} style={styles.modalImage} />
                      ) : (
                        <Ionicons name="person-circle-outline" size={40} color="#ccc" />
                      )}
                    </View>
                    <View style={styles.modalInfo}>
                      <Text style={styles.modalName}>
                        {item.nom ?? '-'} {item.prenom ?? '-'}
                      </Text>
                      <Text style={styles.modalDetail}>Filière: {item.filiere ?? '-'}</Text>
                      <Text style={styles.modalDetail}>INE: {item.ine ?? '-'}</Text>
                      <Text style={styles.modalDetail}>
                        Sexe: {item.sexe === 'M' ? 'Garçon' : item.sexe === 'F' ? 'Fille' : '-'}
                      </Text>
                      <Text style={styles.modalDetail}>Âge: {item.age ?? '-'}</Text>
                    </View>
                  </View>
                )}
                style={{ maxHeight: '75%' }}
              />
            ) : (
              <Text style={{ color: COLORS.textMuted, textAlign: 'center', marginVertical: 20 }}>
                Aucun étudiant disponible
              </Text>
            )}
            <TouchableOpacity style={styles.modalClose} onPress={() => setModalVisible(false)}>
              <Text style={styles.modalCloseText}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default StatsScreen;


/* ================== STYLES ================== */
export const styles = StyleSheet.create({
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
    borderRadius: 14,
    marginBottom: 12,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  cardValue: { fontSize: 22, fontWeight: '700', color: '#fff', marginTop: 6 },
  cardLabel: { fontSize: 14, color: '#fff', marginTop: 2, textAlign: 'center' },

  sectionTitle: { fontSize: 18, fontWeight: '600', marginVertical: 10, color: COLORS.textPrimary },

  filiereCard: {
    backgroundColor: COLORS.card,
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
  },
  filiereLabel: { fontSize: 16, fontWeight: '600', color: COLORS.textPrimary },
  filiereCount: { fontSize: 14, color: COLORS.textSecondary },
  genderRow: { flexDirection: 'row', height: 6, borderRadius: 3, overflow: 'hidden', marginVertical: 6 },
  genderBar: {},
  genderText: { fontSize: 12, color: COLORS.textMuted },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContainer: { backgroundColor: '#fff', borderRadius: 12, padding: 20, maxHeight: '80%' },
  modalTitle: { fontSize: 20, fontWeight: '700', marginBottom: 10 },
  modalRow: { flexDirection: 'row', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: '#eee', alignItems: 'center' },
  modalPhoto: { marginRight: 12 },
  modalImage: { width: 40, height: 40, borderRadius: 20 },
  modalInfo: {},
  modalName: { fontSize: 16, fontWeight: '600', color: COLORS.textPrimary },
  modalDetail: { fontSize: 12, color: COLORS.textSecondary },

  modalClose: {
    marginTop: 12,
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalCloseText: { color: '#fff', fontWeight: '700' },
});
