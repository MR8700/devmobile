import React from 'react';
import {
  Modal,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  visible: boolean;
  photo: string;
  onClose: () => void;
}

const PhotoFullModal: React.FC<Props> = ({ visible, photo, onClose }) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.container}>
              <Image
                source={{ uri: photo }}
                style={styles.photo}
                resizeMode="contain"
              />

              <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                <Ionicons name="close" size={30} color="#fff" />
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default PhotoFullModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },

  container: {
    width: '100%',
    height: '100%',
  },

  photo: {
    width: '100%',
    height: '100%',
  },

  closeBtn: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 20,
    elevation: 10,
  },
});
