import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

interface Props {
  user: {
    prenom?: string;
    nom?: string;
    role?: string;
    photo?: string;
  };
}

const AvatarSection: React.FC<Props> = ({ user }) => {

  /* Construction nom propre */
  const fullName = `${user.prenom ?? ''} ${user.nom ?? ''}`.trim() || 'Utilisateur';

  /* Format rôle */
  const roleLabel = user.role ? user.role.toUpperCase() : 'MEMBRE';

  return (
    <View style={styles.container}>

      {/* Avatar */}
      <View style={styles.avatarWrapper}>
        <Image
          source={
            user.photo
              ? { uri: user.photo }
              : require('../../../assets/images/placeholder.png')
          }
          style={styles.avatar}
        />
      </View>

      {/* Nom */}
      <Text style={styles.name}>{fullName}</Text>

      {/* Rôle */}
      <View style={styles.roleBadge}>
        <Text style={styles.roleText}>{roleLabel}</Text>
      </View>

    </View>
  );
};

export default AvatarSection;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 28
  },

  avatarWrapper: {
    padding: 4,
    borderRadius: 60,
    backgroundColor: '#1e90ff20'
  },

  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#e6e6e6'
  },

  name: {
    fontSize: 21,
    fontWeight: '700',
    marginTop: 12,
    color: '#222'
  },

  roleBadge: {
    marginTop: 6,
    backgroundColor: '#1e90ff15',
    paddingVertical: 4,
    paddingHorizontal: 14,
    borderRadius: 20
  },

  roleText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1e90ff',
    letterSpacing: 0.6
  }
});
