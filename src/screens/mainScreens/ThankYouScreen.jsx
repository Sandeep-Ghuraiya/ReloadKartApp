/* eslint-disable no-unused-vars */
import React, {useEffect, useState} from 'react';
import {
  BackHandler,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

const ThankYouScreen = props => {
  const {navigation, route} = props;
  const {getOrderData} = useSelector(state => state.orders);

  const dispatch = useDispatch();

  const [confirmOrderList, setConfirmOrderList] = useState([]);

  useEffect(() => {
    if (getOrderData?.data) {
      setConfirmOrderList(getOrderData.data[0]);
    }
  }, [getOrderData]);

  useEffect(() => {
    const backAction = () => {};

    // Add event listener for the back button
    BackHandler.addEventListener('hardwareBackPress', backAction);
  }, []);

  const handleNavigation = () => {
    navigation.navigate('Home');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {confirmOrderList && (
        <>
          <View style={styles.header}>
            <Text style={styles.title}>Thank you for your order!</Text>
          </View>

          {/* Message Section */}
          <View style={styles.messageContainer}>
            <Text style={styles.message}>
              {confirmOrderList?.products?.product_type === 'voucher'
                ? 'Your voucher is ready for use! Please check the details below.'
                : 'Your account has been successfully topped up!'}
            </Text>
          </View>

          {confirmOrderList.voucher_detail && (
            <View style={styles.orderDetails}>
              <Text style={styles.subtitle}>Voucher Details</Text>
              {confirmOrderList.voucher_detail.map((voucherItem, index) => (
                <View style={styles.detailsBox} key={index}>
                  <View style={styles.detailsView}>
                    <View style={styles.detailsInnerBox}>
                      {voucherItem.order_id && (
                        <Text style={styles.bold}>Order ID: </Text>
                      )}
                      {voucherItem.serial_number && (
                        <Text style={styles.bold}>Serial Number: </Text>
                      )}
                      {voucherItem.card_code && (
                        <Text style={styles.bold}>Card Code: </Text>
                      )}
                      {voucherItem.pin && (
                        <Text style={styles.bold}>PIN: </Text>
                      )}
                      {voucherItem.expiration_date && (
                        <Text style={styles.bold}>Expiration Date: </Text>
                      )}
                    </View>
                    <View style={styles.detailsInnerBox}>
                      {voucherItem.order_id && (
                        <Text style={styles.detailText}>
                          {voucherItem.order_id}
                        </Text>
                      )}
                      {voucherItem.serial_number && (
                        <Text style={styles.detailText}>
                          {voucherItem.serial_number}
                        </Text>
                      )}
                      {voucherItem.card_code && (
                        <Text style={styles.detailText}>
                          {voucherItem.card_code}
                        </Text>
                      )}
                      {voucherItem.pin && (
                        <Text style={styles.detailText}>{voucherItem.pin}</Text>
                      )}
                      {voucherItem.expiration_date && (
                        <Text style={styles.detailText}>
                          {voucherItem.expiration_date}
                        </Text>
                      )}
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}

          <TouchableOpacity onPress={handleNavigation} style={styles.backBtn}>
            <Text style={styles.backBtnText}>Go Back To Home</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#16182B', // Dark background color
  },
  header: {
    marginVertical: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff', // White text color to stand out on dark background
    textAlign: 'center',
    marginBottom: 15,
  },
  messageContainer: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    color: '#fff', // White text for the message
    marginBottom: 10,
    lineHeight: 22,
    fontWeight: '500',
  },
  orderDetails: {
    marginVertical: 30,
    width: '100%',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff', // White for subtitle
    marginBottom: 15,
    textAlign: 'center',
  },
  detailsBox: {
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  detailsView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  detailsInnerBox: {
    width: '50%',
    borderWidth: 0.5,
    borderColor: '#fff',
  },

  bold: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#28a745', // Green for bold labels (for better visibility and contrast)
    padding: 10,
    borderWidth: 0.2,
    borderColor: '#fff',
    height: 60,
    textAlignVertical: 'center',
  },
  detailText: {
    fontSize: 16,
    color: '#ddd', // Light grey color for the text
    padding: 10,
    borderWidth: 0.2,
    borderColor: '#fff',
    backgroundColor: '#3F3F46',
    height: 60,
    textAlignVertical: 'center',
  },
  button: {
    marginTop: 30,
    backgroundColor: '#28a745', // Green button background
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 30,
    color: '#fff',
  },
  backBtn: {
    backgroundColor: '#20B038',
    borderRadius: 4,
    padding: 10,
  },
  backBtnText: {
    color: '#fff',
    fontWeight: '500',
  },
});

export default ThankYouScreen;
