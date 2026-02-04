// src/screens/StudentDetailScreenWrapper.tsx
import React, { useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/types';
import StudentDetailScreen from './StudentDetailScreen';

type Props = NativeStackScreenProps<RootStackParamList, 'StudentDetail'>;

const StudentDetailScreenWrapper: React.FC<Props> = ({ route, navigation }) => {
  const { student } = route.params;
  const [visible, setVisible] = useState(true);

  const handleClose = () => {
    setVisible(false);
    navigation.goBack();
  };

  return (
    <StudentDetailScreen
      visible={visible}
      student={student}
      onClose={handleClose}
      onEdit={() => navigation.navigate('EditStudent', { student })}
      onDelete={() => console.log('Supprimer depuis wrapper')} // ou passer callback réel
    />
  );
};

export default StudentDetailScreenWrapper;
