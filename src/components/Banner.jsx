/* eslint-disable prettier/prettier */
/* eslint-disable eqeqeq */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Image, StyleSheet, View} from 'react-native';

const Banner = ({image}) => {
  return (
    <View style={{width: '100%', borderRadius: 8, backgroundColor: '#fff'}}>
      {image != '' ? (
        <View style={{width: '100%', height: 140, borderRadius: 8}}>
          <Image
            source={{uri: `${image}`}}
            style={{
              width: '100%',
              height: '100%',
              borderRadius: 8,
            }}
            resizeMode="cover"
          />
        </View>
      ) : (
        <View style={{width: '100%', height: 150, borderRadius: 8}}>
          <Image
            source=""
            alt="voucher.jpg"
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#e4e4e4',
              borderRadius: 8,
            }}
            resizeMode="contain"
          />
        </View>
      )}
    </View>
  );
};

export default Banner;
