import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
} from 'react-native';
const COLORSdashboard = {
  primary: '#1e90ff',
  background: '#f7f9fc',
  card: '#ffffff',
  textPrimary: '#111',
  textSecondary: '#666',
  textMuted: '#555',
};
export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORSdashboard.background },
  content: { padding: 20, paddingBottom: 30 },

  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loaderText: { marginTop: 12, fontSize: 14, color: COLORSdashboard.textMuted },

  header: { marginBottom: 28 },
  title: { fontSize: 26, fontWeight: '700', color: COLORSdashboard.textPrimary },
  subtitle: { fontSize: 15, color: COLORSdashboard.textSecondary, marginTop: 4 },

  statsCard: {
    backgroundColor: COLORSdashboard.card,
    borderRadius: 18,
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    elevation: 3,
  },
  statItem: { alignItems: 'center' },
  statValue: { fontSize: 22, fontWeight: '700', marginTop: 6 },
  statLabel: { fontSize: 13, color: COLORSdashboard.textMuted },

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
  studentFiliere: { fontSize: 12, color: COLORSdashboard.primary, marginTop: 2 },

  emptyText: { textAlign: 'center', fontSize: 14, color: COLORSdashboard.textMuted, marginVertical: 20 },

  sectionTitle: { fontSize: 18, fontWeight: '600', marginVertical: 15 },
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
});


