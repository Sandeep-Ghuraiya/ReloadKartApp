import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

const PaymentCancel = ({navigation}) => {
  const handleNavigation = () => {
    navigation.navigate('Home');
  };
  return (
    <View style={styles.container}>
      <>
        <View style={styles.header}>
          <Text style={styles.title}>
            There was an issue with your payment, and your order has been
            canceled. Please check your payment details and try again.
          </Text>
        </View>

        <TouchableOpacity onPress={handleNavigation} style={styles.backBtn}>
          <Text style={styles.backBtnText}>Go Back To Home</Text>
        </TouchableOpacity>
      </>
    </View>
  );
};

export default PaymentCancel;

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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff', // White text color to stand out on dark background
    textAlign: 'center',
    marginBottom: 15,
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
