import AntDesign from '@react-native-vector-icons/ant-design';
import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

const PaymentModal = ({paymentModalVisible, onClose}) => {
  const navigation = useNavigation();
  return (
    <Modal
      transparent={true}
      visible={paymentModalVisible}
      animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalView}>
          <View style={styles.iconContainer}>
            <TouchableOpacity
              style={styles.iconView}
              onPress={() => onClose(false)}>
              <AntDesign name="close-circle" size={26} color="#fff" />
            </TouchableOpacity>
          </View>
          <View style={styles.paymentTypeContainer}>
            <Text style={styles.paymentMode}>Choose Payment Mode</Text>
            <TouchableOpacity
              style={styles.typeView}
              onPress={() => {
                onClose(false);
                navigation.navigate('WebViewScreen', {
                  url: 'https://pay.cryptomus.com/pay/fe617979-dfe5-4ae1-aec5-cabc3b068cf9',
                });
              }}>
              <Text style={styles.typeText}>Cryptomus</Text>
              {/* <Entypo name="chevron-right" size={18} color="#fff" /> */}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.typeView}
              onPress={() => {
                onClose(false);
                navigation.navigate('WebViewScreen', {
                  url: 'https://reloadkart.com/gp/create-invoice.php?v=1',
                });
              }}>
              <Text style={styles.typeText}>NowPayment</Text>
              {/* <Entypo name="chevron-right" size={18} color="#fff" /> */}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default PaymentModal;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modalView: {
    height: 400,
    backgroundColor: '#252F45',
    padding: 20,
  },
  iconContainer: {
    alignItems: 'flex-end',
  },
  paymentTypeContainer: {
    paddingVertical: 15,
  },
  paymentMode: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 20,
  },
  typeView: {
    padding: 15,
    borderColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 15,
    backgroundColor: '#252F45',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  typeText: {
    color: '#fff',
    fontWeight: '500',
  },
});
