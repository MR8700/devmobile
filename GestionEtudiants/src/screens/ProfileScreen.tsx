import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import AvatarSection from '../components/profile/AvatarSection';
import ProfileInfoCard from '../components/profile/ProfileInfoCard';
import EmailCard from '../components/profile/email/mailCard';
import PasswordCard from '../components/profile/password/PasswordCard';

// ✅ Importer le type global User
import { User } from '../types/User';

const API_BASE_URL = 'http://localhost:3000'; // ou ton URL backend

const ProfileScreen = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          Alert.alert('Erreur', 'Utilisateur non connecté');
          setLoading(false);
          return;
        }

        const response = await axios.get<User>(`${API_BASE_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // ✅ On s'assure que id est toujours défini
        if (response.data.id === undefined) {
          throw new Error('ID utilisateur manquant');
        }

        setUser(response.data);
      } catch (err: any) {
        console.error(err);
        Alert.alert('Erreur', err.response?.data?.error || err.message || 'Impossible de charger le profil');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (!user) return null;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <AvatarSection user={user} />
      <ProfileInfoCard user={user} onUpdate={(updatedUser) => setUser(updatedUser)} />
      <EmailCard user={user} onUpdate={(updatedUser) => setUser(updatedUser)} />
      <PasswordCard userId={user.id} />
    </ScrollView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#f2f5f9' },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
