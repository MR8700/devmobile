import axios, { AxiosInstance } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

/* ======================================================
   CONFIG API
====================================================== */

const API_BASE_URL = 'http://10.0.2.2:3000';

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

/* ======================================================
   INTERCEPTOR JWT
====================================================== */

apiClient.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/* ======================================================
   TYPES
====================================================== */

export interface Etudiant {
  id?: number;
  ine: string;
  nom: string;
  prenom: string;
  age: number;
  telephone: string;
  sexe: 'M' | 'F';
  filiere: string;
  photo?: string;
}

/* ======================================================
   ETUDIANTS CRUD
====================================================== */

// 🔹 Liste étudiants
export const getEtudiants = async (): Promise<Etudiant[]> => {
  const response = await apiClient.get('/etudiants');
  return response.data;
};

// 🔹 Obtenir étudiant par ID
export const getEtudiantById = async (id: number): Promise<Etudiant> => {
  const response = await apiClient.get(`/etudiants/${id}`);
  return response.data;
};

// 🔹 Ajouter étudiant
export const addEtudiant = async (
  etudiant: Etudiant
): Promise<Etudiant> => {
  const response = await apiClient.post('/etudiants', etudiant);
  return response.data;
};

// 🔹 Modifier étudiant
export const updateEtudiant = async (
  etudiant: Etudiant
): Promise<Etudiant> => {

  if (!etudiant.id) {
    throw new Error('ID étudiant manquant');
  }

  const response = await apiClient.put(
    `/etudiants/${etudiant.id}`,
    etudiant
  );

  return response.data;
};

// 🔹 Supprimer étudiant
export const deleteEtudiant = async (id: number): Promise<void> => {
  await apiClient.delete(`/etudiants/${id}`);
};


/* ======================================================
   UPLOAD PHOTO ETUDIANT
====================================================== */

export const updateEtudiantPhoto = async (
  id: number,
  photoUri: string
): Promise<Etudiant> => {

  const formData = new FormData();

  // Extraire nom fichier
  const filename = photoUri.split('/').pop() || `photo_${id}.jpg`;

  // Déterminer type MIME
  const match = /\.(\w+)$/.exec(filename);
  const type = match ? `image/${match[1]}` : `image/jpeg`;

  formData.append('photo', {
    uri: photoUri,
    name: filename,
    type: type,
  } as any);

  const response = await apiClient.put(
    `/etudiants/${id}/photo`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return response.data;
};


/* ======================================================
   FILIERES
====================================================== */

export const getFilieres = async (): Promise<string[]> => {
  try {
    const response = await apiClient.get('/filieres');
    return response.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message ||
      'Impossible de récupérer les filières'
    );
  }
};


/* ======================================================
   AUTH (si tu utilises login)
====================================================== */

export const login = async (email: string, password: string) => {
  const response = await apiClient.post('/auth/login', {
    email,
    password,
  });

  if (response.data.token) {
    await AsyncStorage.setItem('token', response.data.token);
  }

  return response.data;
};

export const logout = async () => {
  await AsyncStorage.removeItem('token');
};
