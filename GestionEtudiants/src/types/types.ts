import { Etudiant } from "../api/api";

export type RootStackParamList = {
  Main: undefined;

  StudentDetail: { studentId: number };

  EditStudent: { student: Etudiant };

  AddStudent: undefined;

  Filieres: { filiere: string };

  Profile: undefined;
  Security: undefined;
  About: undefined;
};
