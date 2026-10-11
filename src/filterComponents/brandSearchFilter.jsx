/* eslint-disable prettier/prettier */
// BrandSearchFilter.js

import {Feather} from '@react-native-vector-icons/feather';
import {AntDesign} from '@react-native-vector-icons/ant-design';
import React from 'react';
import {Pressable, StyleSheet, TextInput, View} from 'react-native';

const BrandSearchFilter = ({value, onChangeText}) => {
  return (
    <View style={styles.serachContainer}>
      <View style={styles.searchWrapper}>
        <View style={styles.searchIconCSS}>
          <Feather name="search" color={'gray'} size={22} />
        </View>
        <TextInput
          value={value}
          style={styles.searchInput}
          onChangeText={onChangeText}
          placeholder="Search brand"
          placeholderTextColor={'gray'}
        />
        {value ? (
          <View style={styles.closeSearchContainer}>
            <Pressable
              style={styles.closeSearch}
              onPress={() => onChangeText('')}>
              <AntDesign name="close-circle" color={'gray'} size={22} />
            </Pressable>
          </View>
        ) : null}
      </View>
    </View>
  );
};

export default BrandSearchFilter;

const styles = StyleSheet.create({
  serachContainer: {
    width: '100%',
    paddingHorizontal: 8,
    paddingBottom: 10,
    position: 'relative',
  },
  searchWrapper: {
    width: '100%',
    position: 'relative',
    backgroundColor: '#fff',
    borderRadius: 40,
    overflow: 'hidden',
    marginTop: 2,
  },
  searchInput: {
    backgroundColor: '#303b53ff',
    width: '100%',
    paddingLeft: 40,
    paddingRight: 4,
    paddingVertical: 10,
    color: '#fff',
    fontSize: 16,
  },
  searchIconCSS: {
    position: 'absolute',
    zIndex: 9,
    left: 12,
    top: 8,
  },
  closeSearchContainer: {
    position: 'absolute',
    right: 4,
    top: 0.5,
  },
  closeSearch: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
