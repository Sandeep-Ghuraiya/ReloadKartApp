/* eslint-disable prettier/prettier */
/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */
import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';

const HeaderBar = () => {
  const navigation = useNavigation();
  const openDrawer = () => {
    navigation.openDrawer(); // This will open the drawer
  };
  return (
    <TouchableOpacity onPress={openDrawer}
      style={{
        paddingRight: 10,
        paddingLeft: 0,
        paddingVertical: 5,
      }}>
      < View style={styles.lineContainer}>
        <View style={styles.firstLine}></View>
        <View style={styles.SecondLine}></View>
        <View style={styles.firstLine}></View>
      </View>
    </TouchableOpacity>
  );
};

export default HeaderBar;

const styles = StyleSheet.create({
  lineContainer: {
    justifyContent: 'space-evenly',
    height: 30,
  },
  firstLine: {
    height: 2.3,
    backgroundColor: '#fff',
    width: 25,
  },
  SecondLine: {
    height: 2.3,
    backgroundColor: '#fff',
    width: 15,
  },
});
