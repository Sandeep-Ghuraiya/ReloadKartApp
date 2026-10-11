/* eslint-disable prettier/prettier */
import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import PhoneInput from 'react-native-international-phone-number';

export default function PhoneNoInput() {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [inputValue, setInputValue] = useState('');

  function handleInputValue(phoneNumber) {
    setInputValue(phoneNumber);
  }

  function handleSelectedCountry(country) {
    setSelectedCountry(country);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter Your Phone Number</Text>

      <PhoneInput
        value={inputValue}
        onChangePhoneNumber={handleInputValue}
        selectedCountry={selectedCountry}
        onChangeSelectedCountry={handleSelectedCountry}
        showModalAlphabetFilter={false}
        showModalCloseButton={true}
        modalType="popup"
        phoneInputStyles={{
          container: styles.inputContainer,
          flagContainer: styles.flagContainer,
          callingCode: styles.callingCode,
          input: styles.input,
        }}
        modalStyles={{
          modal: styles.modal,
          backdrop: styles.backdrop,
          searchInput: styles.searchInput,
          countryButton: styles.countryButton,
          countryName: styles.countryName,
          callingCode: styles.modalCallingCode,
          flatList: styles.flatList,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f8fa',
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  inputContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
    elevation: 2,
  },
  flagContainer: {
    borderRightWidth: 1,
    borderRightColor: '#eee',
    paddingRight: 10,
  },
  callingCode: {
    color: '#444',
    fontSize: 16,
    paddingHorizontal: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#111',
    paddingVertical: 8,
  },

  // 💬 Modal Styling
  modal: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  backdrop: {
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  searchInput: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
  },
  countryButton: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  countryName: {
    fontSize: 16,
    color: '#222',
  },
  modalCallingCode: {
    fontSize: 15,
    color: '#888',
  },
  flatList: {
    paddingBottom: 40,
  },
});
