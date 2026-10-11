/* eslint-disable prettier/prettier */
import React from 'react';
import {Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import LogoImage from './LogoImage';

const InternetConnection = ({visible, onClose}) => {
  return (
    <Modal visible={visible} transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalView}>
          <View style={styles.logoView}>
            <LogoImage />
          </View>
          <Text style={styles.modalText}>Internet is not avaliable</Text>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default InternetConnection;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalView: {
    backgroundColor: '#252F45',
    padding: 20,
    borderRadius: 4,
    width: '80%',
  },
  logoView: {
    marginVertical: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
    textAlign: 'center',
  },
  closeBtn: {
    alignItems: 'flex-end',
    // paddingHorizontal:10,
    paddingTop: 15,
    // backgroundColor:"red"
  },
  closeBtnText: {
    fontWeight: '800',
    color: '#20B038',
    fontSize: 16,
    textTransform: 'uppercase',
  },
});
