// src/types/User.ts
export interface User {
  id?: number;
  nom: string;
  prenom: string;
  email?: string;
  password?: string;
  role: 'admin' | 'user';
  photo?: string;
}
