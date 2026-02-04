// src/types/types.ts
import { Etudiant } from '../api/api';

export type RootStackParamList = {
  Main: undefined;
  StudentDetail: { student: Etudiant }; // plus de visible/onClose, géré dans l'écran
  EditStudent: { student: Etudiant }; // facultatif pour création
  AddStudent: undefined;
};
