/* eslint-disable no-useless-escape */
/* eslint-disable curly */
/* eslint-disable no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
import {yupResolver} from '@hookform/resolvers/yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import PhoneInput from 'react-native-phone-input';
import {SafeAreaView} from 'react-native-safe-area-context';
import * as yup from 'yup';
//Redux
import {useDispatch, useSelector} from 'react-redux';
import {incrementCount} from '../../redux/counterReducer';
import {
  clearUserResponse,
  userGeneralDetails,
  userUpdatedProfile,
} from '../../redux/loginReducer';
//Components
import InternetConnection from '../../components/InternetConnection';
import ShowAlert from '../../components/ShowAlert';
//Hooks
import useInternetCheck from '../../hooks/useInternetCheck';
import useLoginData from '../../hooks/useLoginData';
//Models
import PopupImages from '../../models/PopupImages';
import {showMessage} from 'react-native-flash-message';
import usePopupImage from '../../hooks/usePopupImage';
import ModalPickerImage from '../../models/ModalPickerImage';

// Validation schema using Yup
const validationSchema = yup.object().shape({
  firstName: yup
    .string()
    .matches(
      /^[a-zA-Z\s]+$/,
      'First name should only contain letters and spaces',
    )
    .required('First name is required'),
  lastName: yup
    .string()
    .matches(
      /^[a-zA-Z\s]+$/,
      'Last name should only contain letters and spaces',
    )
    .required('Last name is required'),
  email: yup
    .string()
    .email('Invalid email')
    .matches(
      /^[a-zA-Z0-9](\.?[a-zA-Z0-9_\+-])*@(gmail|yahoo|outlook|hotmail)\.com$/,
      'Email must be a valid Gmail, Yahoo, Outlook, or Hotmail address.',
    )
    .required('Email is required'),
  phoneNo: yup
    .string()
    .min(10, 'Phone number should have at least 10 digits')
    .max(10, 'Phone number should have exactly 10 digits')
    .matches(/^\d+$/, 'Phone number must be digits')
    .required('Phone number is required'),
});

const ProfileScreen = ({navigation, route}) => {
  const isProfileUpdate = React.useRef(false);
  const phoneRef = React.useRef(null);
  const pickerRef = React.useRef(null);
  const myCountryPicker = React.useRef(null);
  const internetValue = useInternetCheck();
  const {updatedProfileData, userGeneralData} = useSelector(
    state => state.userDetails,
  );

  const dispatch = useDispatch();
  const checkImage = usePopupImage();

  const {userDetails, loginDetails, loginLoading} = useLoginData();

  const {
    control,
    handleSubmit,
    formState: {errors},
    setValue,
    getValues,
    clearErrors,
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      firstName: userDetails?.data?.first_name,
      lastName: userDetails?.data?.last_name,
      email: (userDetails?.data?.email || '').toLowerCase(),
      phoneNo: userDetails?.data?.phone,
    },
  });

  const [countryCode, setCountryCode] = useState('us');
  const [pickerData, setPickerData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [showConnection, setShowConnection] = useState(false);

  const setFormValues = useCallback(
    data => {
      if (!data) return;

      setValue('firstName', data.first_name || data.givenName || '');
      setValue('lastName', data.last_name || data.familyName || '');
      setValue('email', (data.email || '').toLowerCase());
      setValue('phoneNo', data.phone || '');
    },
    [setValue],
  );

  // Check Internet
  useFocusEffect(
    useCallback(() => {
      if (internetValue) {
        setShowConnection(false);
      } else {
        setShowConnection(true);
      }
    }, [internetValue]),
  );

  useEffect(() => {
    if (phoneRef.current) {
      setPickerData(phoneRef.current.getPickerData());
    }
  }, []);

  // Get country code from AsyncStorage
  useFocusEffect(
    useCallback(() => {
      setCountryCode();
      const getCountryCode = async () => {
        const value = await AsyncStorage.getItem('country_code');
        if (value) {
          setCountryCode(value.toUpperCase());
        }
      };
      getCountryCode();
    }, []),
  );

  // Set default values based on login data
  useFocusEffect(
    useCallback(() => {
      if (userGeneralData?.status === 1) {
        setFormValues(userGeneralData?.data);
      } else {
        if (userDetails?.data) {
          setFormValues(userDetails.data);
        } else if (userDetails?.user) {
          setFormValues(userDetails.user);
        } else if (userDetails?.userData) {
          setFormValues(userDetails.userData);
        }
      }

      clearErrors();
      setPageLoading(false);
    }, [userDetails, setFormValues, clearErrors, userGeneralData]),
  );

  useEffect(() => {
    if (userGeneralData?.status === 1) {
      setFormValues(userGeneralData?.data);
    }
    setTimeout(() => {
      setLoading(false);
      dispatch(clearUserResponse());
    }, 2000);
  }, [userGeneralData, setFormValues, dispatch, userDetails]);

  useEffect(() => {
    if (updatedProfileData?.status === 1 && isProfileUpdate.current) {
      isProfileUpdate.current = false;

      showMessage({
        message: 'Success',
        description: updatedProfileData.message,
        type: 'success',
        duration: 4000,
        statusBarHeight: 50,
      });

      dispatch(
        userGeneralDetails({
          action: 'get_user',
          email: userDetails?.data?.email,
        }),
      );

      //navigation.navigate('Home');
    } else if (updatedProfileData?.status === 0) {
      showMessage({
        message: 'Error',
        description: updatedProfileData.message,
        type: 'danger',
        duration: 5000,
        statusBarHeight: 50,
      });
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  }, [updatedProfileData, dispatch, userDetails]);

  // Handle profile update
  const handleProfileUpdate = data => {
    isProfileUpdate.current = true;

    dispatch(incrementCount(checkImage));
    setLoading(true);

    const profileData = JSON.stringify({
      action: 'update_profile',
      email: data.email,
      first_name: data.firstName,
      last_name: data.lastName,
      phone: data.phoneNo,
    });

    dispatch(userUpdatedProfile(profileData));
  };

  const onPressFlag = () => {
    setModalVisible(true);
    if (pickerRef.current) {
      pickerRef.current.open();
    }
  };

  const selectCountry = country => {
    setCountryCode(country.iso2);
    phoneRef.current?.selectCountry(country.iso2);
  };

  // useImperativeHandle(ref, () => ({
  //   open,
  //   close,
  // }));

  const closeFlagSelection = () => {
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.loginContainer}>
      {internetValue ? (
        pageLoading ? (
          <View style={styles.pageLoadingContainer}>
            <ActivityIndicator size={'large'} color={'#fff'} />
          </View>
        ) : (
          <KeyboardAvoidingView
            style={{flex: 1}}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}>
            <StatusBar animated={true} backgroundColor="#20B038" />
            <PopupImages />
            {showAlert && (
              <ShowAlert
                onMessage={message}
                onVisiable={showAlert}
                onCloseAlert={() => setShowAlert(false)}
                showName="login"
              />
            )}

            <ScrollView
              contentContainerStyle={{flexGrow: 1}}
              keyboardShouldPersistTaps="handled">
              <View style={styles.innerContainer}>
                <View style={styles.subContainer}>
                  <View style={styles.inputWrapper}>
                    <Text style={styles.heading}>Profile</Text>
                    <View style={styles.inputBoxWrapper}>
                      {/* First Name */}
                      <Controller
                        control={control}
                        name="firstName"
                        render={({field: {onChange, onBlur, value}}) => (
                          <View>
                            <TextInput
                              style={[
                                styles.input,
                                errors.firstName && styles.errorInput,
                              ]}
                              placeholder="First Name"
                              placeholderTextColor="rgba(245, 245, 245, 0.4)"
                              onChangeText={onChange}
                              onBlur={onBlur}
                              value={value}
                            />
                            {errors.firstName && (
                              <Text style={styles.errorText}>
                                {errors.firstName.message}
                              </Text>
                            )}
                          </View>
                        )}
                      />

                      {/* Last Name */}
                      <Controller
                        control={control}
                        name="lastName"
                        render={({field: {onChange, onBlur, value}}) => (
                          <View>
                            <TextInput
                              style={[
                                styles.input,
                                errors.lastName && styles.errorInput,
                              ]}
                              placeholder="Last Name"
                              placeholderTextColor="rgba(245, 245, 245, 0.4)"
                              onChangeText={onChange}
                              onBlur={onBlur}
                              value={value}
                            />
                            {errors.lastName && (
                              <Text style={styles.errorText}>
                                {errors.lastName.message}
                              </Text>
                            )}
                          </View>
                        )}
                      />

                      {/* Email */}
                      <Controller
                        control={control}
                        name="email"
                        render={({field: {onChange, onBlur, value}}) => (
                          <View>
                            <TextInput
                              style={[
                                styles.input,
                                errors.email && styles.errorInput,
                              ]}
                              placeholder="Email"
                              placeholderTextColor="rgba(245, 245, 245, 0.4)"
                              onChangeText={onChange}
                              onBlur={onBlur}
                              value={value}
                              keyboardType="email-address"
                            />
                            {errors.email && (
                              <Text style={styles.errorText}>
                                {errors.email.message}
                              </Text>
                            )}
                          </View>
                        )}
                      />

                      {/* Phone */}
                      <Controller
                        control={control}
                        name="phoneNo"
                        render={({field: {onChange, onBlur, value}}) => (
                          <View style={[{}]}>
                            {/* <Text style={styles.callingCode}>
                              +{phoneRef.current?.getCountryCode() || ''}
                            </Text> */}
                            <PhoneInput
                              ref={phoneRef}
                              value={value}
                              onPressFlag={onPressFlag}
                              onChangePhoneNumber={number =>
                                onChange(number.replace(/\s/g, ''))
                              }
                              initialValue={value}
                              initialCountry={countryCode}
                              textProps={{
                                placeholder: 'Phone No.',
                                placeholderTextColor: 'gray',
                              }}
                              style={[
                                styles.inputContainer,
                                styles.phoneContainer,
                                errors.phoneNo && styles.errorInput,
                              ]}
                              flagStyle={styles.flag}
                              textStyle={styles.phoneInput}
                            />
                            {errors.phoneNo && (
                              <Text style={styles.errorText}>
                                {errors.phoneNo.message}
                              </Text>
                            )}
                          </View>
                        )}
                      />

                      {/* Submit Button */}
                      <TouchableOpacity
                        onPress={handleSubmit(handleProfileUpdate)}
                        style={styles.buttonWrapper}>
                        {loading ? (
                          <ActivityIndicator size="small" color="#fff" />
                        ) : (
                          <Text style={styles.buttonText}>Update Profile</Text>
                        )}
                      </TouchableOpacity>
                    </View>

                    <View style={styles.linksContainer}>
                      <Text style={styles.linkText}>Go Back </Text>
                      <TouchableOpacity
                        style={styles.link}
                        onPress={() => {
                          navigation.navigate('Home');
                          dispatch(incrementCount(checkImage));
                        }}>
                        <Text
                          style={[
                            styles.linkText,
                            {textDecorationLine: 'underline', color: '#20B038'},
                          ]}>
                          Home
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
              {/* Country Picker Modal */}
              <ModalPickerImage
                ref={myCountryPicker}
                visible={modalVisible}
                data={pickerData}
                onChange={selectCountry}
                cancelText="Cancel"
                closeOnSelect={closeFlagSelection}
              />
            </ScrollView>
          </KeyboardAvoidingView>
        )
      ) : (
        <InternetConnection
          visible={showConnection}
          onClose={() => setShowConnection(false)}
        />
      )}
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  loginContainer: {
    flex: 1,
    backgroundColor: '#16182B',
  },
  pageLoadingContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'flex-start', // IMPORTANT
    alignItems: 'center',
    margin: 10,
  },
  subContainer: {
    width: '100%',
    paddingHorizontal: 10,
  },
  inputWrapper: {
    backgroundColor: '#252F45',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingTop: 5,
    paddingBottom: 20,
  },
  heading: {
    fontSize: 18,
    textAlign: 'center',
    color: '#20B038',
    fontWeight: '600',
    textTransform: 'uppercase',
    marginVertical: 20,
  },
  inputBoxWrapper: {
    width: '100%',
  },
  input: {
    height: 50,
    marginTop: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.4)',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    color: '#fff',
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
    bottom: 25,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: -8,
    marginBottom: 8,
  },
  errorInput: {
    borderColor: 'red',
  },
  buttonWrapper: {
    height: 50,
    backgroundColor: '#20B038',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 8,
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '500',
  },
  linksContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
    gap: 3,
  },
  linkText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  inputContainer: {
    marginTop: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.4)',
    backgroundColor: 'transparent',
    borderRadius: 8,
  },
  caret: {
    color: '#fff',
  },
  divider: {
    height: '100%',
    left: -10,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },

  phoneContainer: {
    width: '100%',
    backgroundColor: 'transparent',
    height: 50,
    paddingHorizontal: 10,
  },

  phoneInput: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
    marginLeft: 10, // space after flag
  },

  flag: {
    width: 30,
    height: 20,
    resizeMode: 'contain',
  },
  callingCode: {
    left: -10,
    color: '#fff',
  },
  backdrop: {
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
});
