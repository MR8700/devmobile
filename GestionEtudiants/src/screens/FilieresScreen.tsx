import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  Alert,
  TextInput,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Etudiant, getEtudiants, getFilieres } from '../api/api';
import StudentForm from '../components/forms/StudentForm';
import { isFiliereValid } from '../components/forms/FieldValidation';
import StudentDetailScreen from './StudentDetailScreen';
import { useFocusEffect } from '@react-navigation/native';

const FiliereScreen: React.FC = () => {
  const [filieres, setFilieres] = useState<string[]>([]);
  const [selectedFiliere, setSelectedFiliere] = useState<string | null>(null);
  const [students, setStudents] = useState<Etudiant[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newFiliere, setNewFiliere] = useState('');
  const [search, setSearch] = useState('');

  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Etudiant | null>(null);

  /* ================= FETCH FILIERES ================= */
  const fetchFilieres = async () => {
    try {
      const data = await getFilieres();
      setFilieres(data);
      if (!selectedFiliere && data.length > 0) setSelectedFiliere(data[0]);
    } catch {
      Alert.alert('Erreur', 'Impossible de charger les filières');
    }
  };

  /* ================= FETCH STUDENTS ================= */
  const fetchStudents = async (filiere: string) => {
    try {
      const data = await getEtudiants();
      setStudents(data.filter(s => s.filiere === filiere));
    } catch {
      Alert.alert('Erreur', 'Impossible de charger les étudiants');
    }
  };

  useFocusEffect(useCallback(() => { fetchFilieres(); }, []));

  useEffect(() => { if (selectedFiliere) fetchStudents(selectedFiliere); }, [selectedFiliere]);

  /* ================= AJOUT FILIERE ================= */
  const handleAddFiliere = () => {
    const f = newFiliere.trim();
    if (!f) return Alert.alert('Erreur', 'Veuillez saisir le nom de la filière.');
    if (!isFiliereValid(f)) return Alert.alert('Filière invalide', 'Le nom doit contenir 2-50 lettres et espaces.');
    if (filieres.includes(f)) return Alert.alert('Attention', 'Cette filière existe déjà.');
    setFilieres(prev => [...prev, f]);
    setNewFiliere('');
    setSelectedFiliere(f);
  };

  /* ================= RENDER STUDENT ================= */
  const renderStudentItem = ({ item }: { item: Etudiant }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => { setSelectedStudent(item); setDetailVisible(true); }}
    >
      <Image
        source={item.photo ? { uri: item.photo } : require('../../assets/images/placeholder.png')}
        style={styles.photo}
      />
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.nom} {item.prenom}</Text>
        <Text style={styles.meta}>{item.sexe === 'M' ? 'Garçon' : 'Fille'} • {item.age} ans</Text>
      </View>
    </TouchableOpacity>
  );

  const filteredFilieres = filieres.filter(f => f.toLowerCase().includes(search.toLowerCase()));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Filières</Text>

      {/* RECHERCHE */}
      <TextInput
        style={styles.searchInput}
        placeholder="Rechercher une filière..."
        value={search}
        onChangeText={setSearch}
      />

      {/* FILIERES HORIZONTALES */}
      <FlatList
        data={filteredFilieres}
        horizontal
        keyExtractor={(item) => item}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 10 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.filiereButton, selectedFiliere === item && styles.filiereSelected]}
            onPress={() => setSelectedFiliere(item)}
          >
            <Text style={selectedFiliere === item ? styles.filiereTextSelected : styles.filiereText}>
              {item}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* AJOUT FILIERE */}
      <View style={styles.addFiliereContainer}>
        <TextInput
          style={[styles.inputFiliere, newFiliere && !isFiliereValid(newFiliere) && { borderColor: '#ff4d4d' }]}
          placeholder="Nouvelle filière"
          value={newFiliere}
          onChangeText={setNewFiliere}
        />
        <TouchableOpacity style={styles.addBtnSmall} onPress={handleAddFiliere}>
          <Ionicons name="add" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* LISTE DES ETUDIANTS */}
      {selectedFiliere && (
        students.length > 0 ? (
          <FlatList
            data={students}
            keyExtractor={(item, i) => item.id?.toString() ?? i.toString()}
            renderItem={renderStudentItem}
          />
        ) : (
          <Text style={styles.emptyMessage}>Aucun étudiant dans cette filière</Text>
        )
      )}

      {/* BOUTON AJOUT ETUDIANT */}
      {selectedFiliere && (
        <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
          <Ionicons name="add" size={28} color="#fff" />
        </TouchableOpacity>
      )}

      {/* MODAL AJOUT ETUDIANT */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalTitle}>Ajouter étudiant ({selectedFiliere})</Text>
              <StudentForm
                filiere={selectedFiliere!}
                onSuccess={() => {
                  setModalVisible(false);
                  if (selectedFiliere) fetchStudents(selectedFiliere);
                }}
              />
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelText}>Annuler</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* MODAL DETAIL ETUDIANT */}
      {selectedStudent && (
        <StudentDetailScreen
          visible={detailVisible}
          student={selectedStudent}
          onClose={() => setDetailVisible(false)}
          onEdit={() => Alert.alert('Modifier', `Modifier ${selectedStudent.nom}`)}
          onDelete={() => Alert.alert('Supprimer', `Supprimer ${selectedStudent.nom}`)}
        />
      )}
    </View>
  );
};

export default FiliereScreen;

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: { flex: 1, padding: 12, backgroundColor: '#f4f6fc' },
  title: { fontSize: 24, fontWeight: '700', color: '#1e90ff', marginBottom: 10 },
  searchInput: { borderWidth: 1, borderColor: '#ccc', borderRadius: 25, paddingHorizontal: 12, height: 40, backgroundColor: '#fff', marginBottom: 10 },
  filiereButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#aaa',
    marginHorizontal: 5,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 2,
    height: 40,
  },
  filiereSelected: { flex:1,backgroundColor: '#1e90ff', borderColor: '#1e90ff',},
  filiereText: { color: '#111', fontWeight: '600',height: 40,},
  filiereTextSelected: { color: '#fff', fontWeight: '600', height: 40,},
  addFiliereContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  inputFiliere: { borderWidth: 1, borderColor: '#ccc', borderRadius: 25, paddingHorizontal: 12, height: 40, backgroundColor: '#fff', flex: 1, marginRight: 5 },
  addBtnSmall: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#07a114', justifyContent: 'center', alignItems: 'center' },
  addBtn: { position: 'absolute', right: 20, bottom: 20, backgroundColor: '#1e90ff', width: 55, height: 55, borderRadius: 28, justifyContent: 'center', alignItems: 'center', zIndex: 10, shadowColor: '#000', shadowOpacity: 0.2, shadowOffset: { width: 0, height: 3 }, shadowRadius: 4, elevation: 4 },
  card: { flexDirection: 'row', backgroundColor: '#fff', padding: 12, marginVertical: 6, borderRadius: 20, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.05, shadowOffset: { width: 0, height: 2 }, shadowRadius: 3, elevation: 1 },
  photo: { width: 60, height: 60, borderRadius: 30, marginRight: 12 },
  name: { fontSize: 16, fontWeight: '600' },
  meta: { color: '#666', fontSize: 13 },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', padding: 20 },
  modalContainer: { backgroundColor: '#fff', borderRadius: 20, padding: 20, maxHeight: '90%' },
  modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 15 },
  cancelBtn: { marginTop: 15, paddingVertical: 12, backgroundColor: '#f44336', borderRadius: 15, alignItems: 'center' },
  cancelText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  emptyMessage: { textAlign: 'center', marginVertical: 20, color: '#666', fontStyle: 'italic' },
});
