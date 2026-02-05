import { Etudiant } from "../api/api";

export type RootStackParamList = {
  Main: undefined;

  StudentDetail: { studentId: number };

  EditStudent: { student: Etudiant };

  SpecialEditStudent: undefined;

  AddStudent: undefined;

  Filieres: { filiere: string };

  Profile: undefined;
  Security: undefined;
  About: undefined;
};


export type DrawerParamList = {
  HomeTabs: undefined;
  AddStudent: undefined;
  Students: undefined;
  SpecialEditStudent: undefined;
  Settings: undefined;
  Profile: undefined;
  Logout: undefined;
};
