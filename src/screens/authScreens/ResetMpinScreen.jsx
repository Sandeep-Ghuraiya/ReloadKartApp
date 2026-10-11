/* eslint-disable react-native/no-inline-styles */
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import {OtpInput} from 'react-native-otp-entry';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import backGroundImage from '../../assets/gamocoinImages/reloadkart_screen.jpg';
import {clearResponseData, resetMpinDetails} from '../../redux/loginReducer';
import AntDesign from '@react-native-vector-icons/ant-design';

const {width, height} = Dimensions.get('screen');

const ResetMpinScreen = ({navigation, route}) => {
  const {resetMpinData} = useSelector(state => state.userDetails);

  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [oldMpin, setOldMpin] = useState('');
  const [newMpin, setNewMpin] = useState('');
  const [oldMpinError, setOldMpinError] = useState('');
  const [newMpinError, setNewMpinError] = useState('');
  const [focusedField, setFocusedField] = useState('');

  const showToast = ({
    message,
    description = '',
    type = 'success',
    icon = 'success',
    duration = 5000,
  }) => {
    showMessage({
      message,
      description,
      type,
      icon,
      duration,
      statusBarHeight: 50,
    });
  };

  useEffect(() => {
    const getEmail = async () => {
      const value = await AsyncStorage.getItem('email');
      if (value) {
        const parsedValue = JSON.parse(value);
        setEmail(parsedValue);
      }
    };
    getEmail();
  }, []);

  useEffect(() => {
    if (resetMpinData?.status === 1) {
      showToast({
        message: 'Success',
        description: resetMpinData.message,
        type: 'success',
        icon: 'success',
        duration: 4000,
      });
      setTimeout(() => {
        setLoading(false);
        navigation.navigate('AppDrawer');
      }, 3000);
    } else if (resetMpinData?.status === 0) {
      setLoading(false);
      showToast({
        message: 'Error',
        description: resetMpinData.message,
        type: 'danger',
        icon: 'danger',
        duration: 4000,
      });
    }
    setTimeout(() => {
      dispatch(clearResponseData('resetMpin'));
    }, 2000);
  }, [resetMpinData, dispatch, navigation]);

  const handleFocus = fieldName => {
    setFocusedField(fieldName);
  };

  const handleForgotMpin = () => {
    setNewMpinError('');
    setOldMpinError('');
    if (!oldMpin) {
      setOldMpinError('Old MPIN is required');
    }
    if (!newMpin) {
      setNewMpinError('New MPIN is required');
    }
    if (oldMpin && oldMpin.length < 4) {
      setOldMpinError('Old MPIN must be 4 digits');
    }
    if (newMpin && newMpin.length < 4) {
      setNewMpinError('New MPIN must be 4 digits');
    }

    if (newMpin && oldMpin && newMpin.length === 4 && oldMpin.length === 4) {
      setLoading(true);
      dispatch(
        resetMpinDetails({
          action: 'reset_mpin',
          email: email,
          old_mpin: oldMpin,
          new_mpin: newMpin,
        }),
      );
    }
  };

  return (
    <>
      <ImageBackground
        source={backGroundImage}
        style={[{width: width, height: '100%'}]}>
        <SafeAreaView style={{flex: 1}}>
          <LinearGradient
            colors={['rgba(22, 24, 43, 0)', 'rgba(22, 24, 43, 1)']}
            locations={[0, 0.5]}
            start={{x: 0, y: 0}}
            end={{x: 0, y: 1}}
            style={styles.gradientContainer}>
            <View style={{flex: 1, marginBottom: 100}}>
              <KeyboardAvoidingView
                style={{flex: 1, justifyContent: 'flex-end', margin: 0}}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}>
                <ScrollView
                  contentContainerStyle={{flexGrow: 1}}
                  keyboardShouldPersistTaps="handled"
                  style={{flex: 1, backgroundColor: 'transparent'}}>
                  <View style={styles.inputWrapper}>
                    <Text style={styles.heading}>Reset MPIN</Text>

                    <View style={styles.inputBoxWrapper}>
                      <View
                        style={{
                          marginBottom: 20,
                          paddingHorizontal: 15,
                        }}>
                        <Text style={styles.label}>Enter Old MPIN</Text>
                        <OtpInput
                          numberOfDigits={4}
                          focusColor="#20B038"
                          autoFocus={false}
                          hideStick={true}
                          blurOnFilled={true}
                          disabled={false}
                          type="numeric"
                          secureTextEntry={false}
                          focusStickBlinkingDuration={500}
                          onFocus={() => handleFocus('oldMpin')}
                          onTextChange={setOldMpin}
                          theme={{
                            containerStyle: styles.containerStyle,
                            pinCodeContainerStyle: [
                              styles.pinCodeContainer,
                              focusedField === 'oldMpin' &&
                                styles.focusedBackground,
                              newMpinError && styles.errorInput,
                            ],
                            pinCodeTextStyle: styles.pinCodeText,
                          }}
                        />
                        {oldMpinError && (
                          <Text style={styles.errorText}>{oldMpinError}</Text>
                        )}
                      </View>

                      <View
                        style={{
                          marginBottom: 20,
                          paddingHorizontal: 15,
                        }}>
                        <Text style={styles.label}>Enter New MPIN</Text>
                        <OtpInput
                          numberOfDigits={4}
                          focusColor="#20B038"
                          autoFocus={false}
                          hideStick={true}
                          blurOnFilled={true}
                          disabled={false}
                          type="numeric"
                          secureTextEntry={false}
                          focusStickBlinkingDuration={500}
                          onFocus={() => handleFocus('newMpin')}
                          onTextChange={setNewMpin}
                          theme={{
                            containerStyle: styles.containerStyle,
                            pinCodeContainerStyle: [
                              styles.pinCodeContainer,
                              focusedField === 'newMpin' &&
                                styles.focusedBackground,
                              newMpinError && styles.errorInput,
                            ],
                            pinCodeTextStyle: styles.pinCodeText,
                          }}
                        />
                        {newMpinError && (
                          <Text style={styles.errorText}>{newMpinError}</Text>
                        )}
                      </View>

                      <TouchableOpacity
                        onPress={handleForgotMpin}
                        style={styles.buttonWrapper}>
                        {loading ? (
                          <ActivityIndicator size="small" color="#fff" />
                        ) : (
                          <Text style={styles.loginHeading}>Reset MPIN</Text>
                        )}
                      </TouchableOpacity>
                    </View>
                    <View>
                      <TouchableOpacity
                        style={styles.iconWrapper}
                        onPress={() => navigation.navigate('EnterMpinScreen')}>
                        <AntDesign name="arrow-left" color={'#fff'} size={25} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </ScrollView>
              </KeyboardAvoidingView>
            </View>
          </LinearGradient>
        </SafeAreaView>
      </ImageBackground>
    </>
  );
};

export default ResetMpinScreen;

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  gradientContainer: {
    width: width,
    height: height,
  },
  inputWrapper: {
    paddingHorizontal: 40,
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  heading: {
    fontSize: 22,
    textAlign: 'center',
    color: '#fff',
    fontWeight: '900',
    textTransform: 'uppercase',
    marginVertical: 25,
  },
  inputBoxWrapper: {
    width: '100%',
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  inputView: {
    borderWidth: 1,
    borderColor: 'rgba(245, 245, 245, 0.4)',
    marginTop: 5,
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  input: {
    height: 50,
    paddingVertical: 10,
    fontSize: 14,
    color: '#fff',
  },
  focusedBackground: {
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  errorInput: {
    borderColor: 'red',
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
    bottom: 15,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 6,
    marginBottom: 8,
  },
  label: {
    color: '#fff',
    marginBottom: 5,
  },
  containerStyle: {
    width: '100%',
  },
  otpPinCodeContainer: {
    width: 45,
    height: 45,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(245, 245, 245, 0.4)',
  },
  pinCodeContainer: {
    width: 60,
    height: 60,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(245, 245, 245, 0.4)',
  },
  otpPinCodeText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 18, // Slightly bigger font size for better visibility
  },
  pinCodeText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 22, // Slightly bigger font size for better visibility
  },

  resendContainer: {
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 10,
  },

  resendText: {
    color: '#20B038',
    fontWeight: '700',
    fontSize: 14,
  },

  timerText: {
    color: '#ddd',
    fontSize: 13,
  },

  buttonWrapper: {
    width: '100%',
    height: 55,
    backgroundColor: '#252f45',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 8,
  },
  loginHeading: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '500',
  },
  linksContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  link: {
    width: '50%',
    paddingVertical: 8,
  },
  linkText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 5,
    paddingBottom: 15,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#fff',
  },
  orText: {
    paddingHorizontal: 10,
    fontSize: 14,
    fontWeight: '500',
    color: '#fff',
  },
  authLoginButtonWrapper: {
    alignItems: 'center',
  },
  iconWrapper: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
  },
});
