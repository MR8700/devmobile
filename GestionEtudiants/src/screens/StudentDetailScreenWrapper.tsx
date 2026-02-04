import React, { useEffect, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/types';
import StudentDetailScreen from './StudentDetailScreen';
import { Etudiant, getEtudiantById } from '../api/api';

type Props = NativeStackScreenProps<RootStackParamList, 'StudentDetail'>;

const StudentDetailScreenWrapper: React.FC<Props> = ({ route, navigation }) => {
  const { studentId } = route.params;

  const [student, setStudent] = useState<Etudiant | null>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const data = await getEtudiantById(studentId);
        setStudent(data);
      } catch {
        navigation.goBack();
      }
    };

    fetchStudent();
  }, []);

  const handleClose = () => {
    setVisible(false);
    navigation.goBack();
  };

  if (!student) return null;

  return (
    <StudentDetailScreen
      visible={visible}
      student={student}
      onClose={handleClose}
      onEdit={() => navigation.navigate('EditStudent', { student })}
      onDelete={() => console.log('Supprimer')}
    />
  );
};

export default StudentDetailScreenWrapper;
