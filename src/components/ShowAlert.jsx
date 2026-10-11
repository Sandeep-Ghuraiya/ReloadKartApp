/* eslint-disable prettier/prettier */
import React, {useState} from 'react';
import {Modal, Pressable, StyleSheet, Text, View} from 'react-native';

const ShowAlert = ({onMessage, onVisiable, onCloseAlert, showName}) => {
  const [modalVisible, setModalVisible] = useState(onVisiable);

  return (
    <Modal transparent={true} visible={onVisiable}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>{onMessage}</Text>
          <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={() => {
              setModalVisible(!modalVisible);
              onCloseAlert(!modalVisible);
            }}>
            <Text style={styles.textStyle}>Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0, 0.3)',
  },
  modalView: {
    margin: 20,
    backgroundColor: '#252F45',
    borderRadius: 10,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    color: '#fff',
  },
  button: {
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    elevation: 2,
  },
  // buttonOpen: {
  //   backgroundColor: '#F194FF',
  // },
  buttonClose: {
    backgroundColor: '#20B038',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },

  // button2: {
  //   borderRadius: 6,
  //   paddingVertical: 4,
  //   paddingHorizontal: 8,
  //   elevation: 2,
  // },
  // textStyle2: {
  //   color: 'white',
  //   fontWeight: 'bold',
  //   textAlign: 'center',
  //   fontSize: 10,
  // },
  // copiedText: {
  //   fontWeight: 'bold',
  //   fontSize: 16,
  //   marginBottom: 8,
  // }
});

export default ShowAlert;
