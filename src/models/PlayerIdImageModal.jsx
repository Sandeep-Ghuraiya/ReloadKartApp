import AntDesign from '@react-native-vector-icons/ant-design';
import React from 'react';
import {Image, Modal, StyleSheet, TouchableOpacity, View} from 'react-native';

const PlayerIdImageModal = ({modalVisible, onClose, image}) => {
  return (
    <Modal transparent={true} visible={modalVisible}>
      <View style={styles.modalContainer}>
        <View style={styles.closebtnContainer}>
          <TouchableOpacity onPress={onClose}>
            <AntDesign name="close" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        <View style={styles.modalView}>
          <View style={styles.imgView}>
            <Image source={{uri: image}} style={styles.img} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default PlayerIdImageModal;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
  },
  closebtnContainer: {
    marginTop: 40,
    alignItems: 'flex-end',
    marginRight: 20,
  },
  modalView: {
    marginTop: '60%',
  },
  imgView: {
    width: '100%',
    height: 200,
  },
  img: {
    width: '100%',
    height: '100%',
  },
});
