export interface Student {
  id: number;
  ine: string;
  nom: string;
  prenom: string;
  age: number;
  telephone: string;
  sexe: 'M' | 'F';
  photo?: string; 
  filiere: string;
}