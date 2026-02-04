import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View, ActivityIndicator, Alert } from 'react-native';

import AvatarSection from '../components/profile/AvatarSection';
import ProfileInfoCard from '../components/profile/ProfileInfoCard';
import EmailCard from '../components/profile/email/mailCard';
import PasswordCard from '../components/profile/password/PasswordCard';

import { User } from '../types/User';
import { getCurrentUser } from '../api/userapi';

const ProfileScreen = () => {

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchProfile = async () => {
      try {

        const data = await getCurrentUser();
        setUser(data);

      } catch (error: any) {

        Alert.alert(
          'Erreur',
          error.message || 'Impossible de charger le profil'
        );

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

      <ProfileInfoCard
        user={user}
        onUpdate={(u) => setUser(u)}
      />

      <EmailCard
        user={user}
        onUpdate={(u) => setUser(u)}
      />

      <PasswordCard userId={user.id} />
    </ScrollView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#f2f5f9' },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
