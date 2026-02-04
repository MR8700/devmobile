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
