import axios, { AxiosInstance } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types/User';

/* ================= CONFIG API ================= */

const API_BASE_URL = 'http://10.0.2.2:3000/';

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/* ================= INTERCEPTOR JWT ================= */

apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ================= TYPES ================= */

export interface LoginResponse {
  token: string;
  role: 'admin' | 'user';
  photo?: string;
  nom: string;
  prenom: string;
  email: string;
}


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

interface BackendError {
  error?: string;
  message?: string;
}

/* ================= AUTH ================= */

export const login = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  try {
    const response = await apiClient.post<LoginResponse>('/auth/login', {
      email,
      password,
    });

    await AsyncStorage.setItem('token', response.data.token);

    return response.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.error ||
      error?.response?.data?.message ||
      'Identifiants invalides'
    );
  }
};

export const logout = async (): Promise<void> => {
  await AsyncStorage.removeItem('token');
};

export const addUser = async (userData: User): Promise<User> => {
  const response = await apiClient.post<User>('/auth/register', userData);
  return response.data;
};

export const getCurrentUser = async (): Promise<User> => {
  const response = await apiClient.get<User>('/auth/me');
  return response.data;
};

/* ================= USER ================= */

/* Update informations (nom, prénom, photo, etc) */
export const updateUserInfo = async (
  data: Partial<User>
): Promise<User> => {

  const response = await apiClient.put<User>(
    `/auth/me`,
    data
  );

  return response.data;
};


/* ✅ UPDATE EMAIL USER */
export const updateUserEmail = async (
  id: number,
  email: string
): Promise<User> => {

  try {
    const response = await apiClient.put<User>(
      `/users/${id}/email`,
      { email }
    );

    return response.data;

  } catch (error: any) {

    throw new Error(
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      'Erreur mise à jour email'
    );
  }
};

/* ================= ETUDIANTS ================= */

export const getEtudiants = async (): Promise<Etudiant[]> => {
  const response = await apiClient.get<Etudiant[]>('/etudiants');
  return response.data;
};

export const addEtudiant = async (
  etudiantData: Etudiant
): Promise<Etudiant> => {

  const response = await apiClient.post<Etudiant>(
    '/etudiants',
    etudiantData
  );

  return response.data;
};

export const updateEtudiant = async (
  etudiantData: Etudiant
): Promise<Etudiant> => {

  if (!etudiantData.id) {
    throw new Error('ID étudiant manquant');
  }

  const response = await apiClient.put(
    `/etudiants/${etudiantData.id}`,
    etudiantData
  );

  return response.data;
};

export const deleteEtudiant = async (id: number): Promise<void> => {
  await apiClient.delete(`/etudiants/${id}`);
};

/* ================= PHOTO ETUDIANT ================= */



export const updateEtudiantPhoto = async (
  id: number,
  photoUri: string
): Promise<Etudiant> => {

  const formData = new FormData();
  const fileName = photoUri.split('/').pop() || `photo_${id}.jpg`;
  const fileType = `image/${fileName.split('.').pop() || 'jpg'}`;

  formData.append('photo', {
    uri: photoUri,
    name: fileName,
    type: fileType,
  } as any);

  const response = await apiClient.put(`/etudiants/${id}/photo`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return response.data;
};


/* ================= FILIERES ================= */

export const getFilieres = async (): Promise<string[]> => {
  try {
    const response = await apiClient.get<string[]>('/filieres');
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Impossible de récupérer les filières');
  }
};

