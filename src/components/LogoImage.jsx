/* eslint-disable prettier/prettier */
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
// import logo from '../assets/gamocoinImages/gamocoin-logo.png';

function LogoImage(props) {
  return (
    <View style={props.imageWrapper}>
      <Text style={styles.logoText}>Reloadkart</Text>
    </View>
  );
}

export default LogoImage;

const styles = StyleSheet.create({
  logoText: {
    fontSize: 25,
    fontFamily: 'serif',
    color: '#ffffff',
    fontWeight: 900,
  },
});
