/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import PlayerIdImageModal from '../models/PlayerIdImageModal';
import {MaterialDesignIcons} from '@react-native-vector-icons/material-design-icons';
import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';

const TopupPlayerDetails = ({
  formFieldData,
  formValues,
  setFormValues,
  errors,
  setErrors,
  handleChange,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [image, setImage] = useState('');

  const handleImage = img => {
    setModalVisible(true);
    setImage(img);
  };

  return (
    <View style={styles.container}>
      <PlayerIdImageModal
        modalVisible={modalVisible}
        onClose={() => setModalVisible(false)}
        image={image}
      />

      <View style={styles.checkoutContainer}>
        <Text style={styles.heading}>Order Information</Text>

        <View style={{marginVertical: 10}}>
          {Object.entries(formFieldData || {}).map(([key, field]) => {
            return (
              <View key={key} style={{marginBottom: 15}}>
                <View style={styles.accountContainer}>
                  <Text style={styles.inputText}>{field.label}</Text>

                  <View
                    style={[
                      styles.inputContainer,
                      field.type === 'select' && {paddingHorizontal: 0},
                    ]}>
                    {/* TEXT INPUT */}
                    {field.type === 'text' && (
                      <TextInput
                        style={styles.input}
                        placeholder={`Please Enter ${field.label}`}
                        placeholderTextColor={'rgba(245, 245, 245, 0.4)'}
                        value={formValues[key] || ''}
                        onChangeText={text => handleChange(key, text)}
                      />
                    )}

                    {/* DROPDOWN */}
                    {field.type === 'select' && (
                      <Dropdown
                        style={[styles.input, {width: '100%'}]}
                        containerStyle={styles.containerStyle}
                        itemTextStyle={styles.itemTextStyle}
                        placeholderStyle={{
                          color: '#fff',
                          fontSize: 14,
                          paddingHorizontal: 10,
                        }}
                        selectedTextStyle={{
                          color: '#fff',
                          fontSize: 14,
                          paddingHorizontal: 10,
                        }}
                        activeColor="#20B038"
                        maxHeight={180}
                        data={field.value || []}
                        labelField="name"
                        valueField="id"
                        placeholder="Please Select"
                        value={formValues[key]}
                        onChange={item => handleChange(key, item.id)}
                      />
                    )}

                    {/* IMAGE ICON */}
                    {field.pimage && (
                      <TouchableOpacity
                        onPress={() => handleImage(field.pimage)}>
                        <MaterialDesignIcons
                          name="image-filter-center-focus"
                          size={24}
                          color="#fff"
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>

                {/* ERROR */}
                {errors[key] && (
                  <Text style={{color: 'red', fontSize: 12}}>
                    {errors[key]}
                  </Text>
                )}
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
};

export default TopupPlayerDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: '#252F45',
  },
  checkoutContainer: {
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  heading: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
  },
  accountContainer: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.16)',
    borderRadius: 4,
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  inputText: {
    color: 'rgba(245, 245, 245, 0.8)',
    marginBottom: 5,
  },
  input: {
    color: '#fff',
    height: 50,
    fontSize: 14,
  },
  messageContainer: {
    marginVertical: 10,
    backgroundColor: '#20B038',
    padding: 5,
    borderRadius: 4,
  },
  messageText: {
    color: '#fff',
    fontWeight: '500',
  },
  containerStyle: {
    backgroundColor: '#252F45',
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    marginRight: 0,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.16)',
  },
  itemTextStyle: {
    color: '#fff',
    position: 'absolute',
    paddingHorizontal: 10,
  },
});
