/* eslint-disable react-native/no-inline-styles */
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import React, {useCallback, useEffect, useState} from 'react';
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
} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import {OtpInput} from 'react-native-otp-entry';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import backGroundImage from '../../assets/gamocoinImages/reloadkart_screen.jpg';
import {
  clearResponseData,
  forgotMpinEmail,
  setForgotMpin,
} from '../../redux/loginReducer';
import AntDesign from '@react-native-vector-icons/ant-design';
import useInternetCheck from '../../hooks/useInternetCheck';
import InternetConnection from '../../components/InternetConnection';
import {useFocusEffect} from '@react-navigation/native';

const {width, height} = Dimensions.get('screen');

const SetForgotMpinScreen = ({navigation, route}) => {
  const internetValue = useInternetCheck();
  const {forgotMpinData} = useSelector(state => state.userDetails);

  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmMpin, setConfirmMpin] = useState('');
  const [newMpin, setNewMpin] = useState('');
  const [otpError, setOtpError] = useState('');
  const [confirmMpinError, setConfirmMpinError] = useState('');
  const [newMpinError, setNewMpinError] = useState('');
  const [focusedField, setFocusedField] = useState('');
  const [timer, setTimer] = useState(120);
  const [canResend, setCanResend] = useState(false);
  const [showConnection, setShowConnection] = useState(false);

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
    if (timer === 0) {
      setCanResend(true);
      return;
    }

    const interval = setInterval(() => {
      setTimer(t => t - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  useEffect(() => {
    if (forgotMpinData?.status === 1) {
      showToast({
        message: 'Success',
        description: forgotMpinData.message,
        type: 'success',
        icon: 'success',
        duration: 4000,
      });
      setTimeout(() => {
        setLoading(false);
        navigation.navigate('EnterMpinScreen');
      }, 3000);
    } else if (forgotMpinData?.status === 0) {
      setLoading(false);
      showToast({
        message: 'Error',
        description: forgotMpinData.message,
        type: 'danger',
        icon: 'danger',
        duration: 4000,
      });
    }
    setTimeout(() => {
      dispatch(clearResponseData('forgotMpin'));
    }, 2000);
  }, [forgotMpinData, dispatch, navigation]);

  const handleFocus = fieldName => {
    setFocusedField(fieldName);
  };

  const handleForgotMpin = () => {
    if (internetValue) {
      setOtpError('');
      setNewMpinError('');
      setConfirmMpinError('');
      if (!otp) {
        setOtpError('OTP is required');
      }
      if (!newMpin) {
        setNewMpinError('New MPIN is required');
      }
      if (!confirmMpin) {
        setConfirmMpinError('Confirm MPIN is required');
      }
      if (newMpin !== confirmMpin) {
        setConfirmMpinError('New MPIN and Confirm MPIN does not match');
      }
      if (otp && otp.length < 6) {
        setOtpError('OTP must be 6 digits');
      }

      if (newMpin && newMpin.length < 4) {
        setNewMpinError('New MPIN must be 4 digits');
      }

      if (confirmMpin && confirmMpin.length < 4) {
        setConfirmMpinError('Confirm MPIN must be 4 digits');
      }

      if (
        otp &&
        newMpin &&
        confirmMpin &&
        newMpin === confirmMpin &&
        otp.length === 6 &&
        newMpin.length === 4 &&
        confirmMpin.length === 4
      ) {
        setLoading(true);
        dispatch(
          setForgotMpin({
            action: 'confirm_forgot_mpin',
            email: email,
            otp: otp,
            new_mpin: newMpin,
            confirm_mpin: confirmMpin,
          }),
        );
        setTimeout(() => {
          setLoading(false);
        }, 10000);
      }
    } else {
      setShowConnection(true);
    }
  };

  const onResendOtp = () => {
    dispatch(
      forgotMpinEmail({
        action: 'forgot_mpin',
        email: email,
      }),
    );
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
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <View style={styles.inputWrapper}>
                  <Text style={styles.heading}>Set New MPIN</Text>

                  <View style={styles.inputBoxWrapper}>
                    <View
                      style={{
                        marginBottom: 20,
                        paddingHorizontal: 15,
                      }}>
                      <Text style={styles.label}>Enter OTP</Text>
                      <OtpInput
                        numberOfDigits={6}
                        focusColor="#20B038"
                        autoFocus={false}
                        hideStick={true}
                        blurOnFilled={true}
                        disabled={false}
                        type="numeric"
                        secureTextEntry={false}
                        focusStickBlinkingDuration={500}
                        onFocus={() => handleFocus('otp')}
                        onTextChange={setOtp}
                        theme={{
                          containerStyle: styles.containerStyle,
                          pinCodeContainerStyle: [
                            styles.otpPinCodeContainer,
                            focusedField === 'otp' && styles.focusedBackground,
                            otpError && styles.errorInput,
                          ],
                          pinCodeTextStyle: styles.otpPinCodeText,
                        }}
                      />
                      {otpError && (
                        <Text style={styles.errorText}>{otpError}</Text>
                      )}
                      <View style={styles.resendContainer}>
                        {canResend ? (
                          <Text style={styles.resendText} onPress={onResendOtp}>
                            Resend OTP
                          </Text>
                        ) : (
                          <Text style={styles.timerText}>
                            Resend OTP in {timer}s
                          </Text>
                        )}
                      </View>
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

                    <View
                      style={{
                        marginBottom: 20,
                        paddingHorizontal: 15,
                      }}>
                      <Text style={styles.label}>Enter Confirm MPIN</Text>

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
                        onFocus={() => handleFocus('confirmMpin')}
                        onTextChange={setConfirmMpin}
                        theme={{
                          containerStyle: styles.containerStyle,
                          pinCodeContainerStyle: [
                            styles.pinCodeContainer,
                            focusedField === 'confirmMpin' &&
                              styles.focusedBackground,
                            confirmMpinError && styles.errorInput,
                          ],
                          pinCodeTextStyle: styles.pinCodeText,
                        }}
                      />
                      {confirmMpinError && (
                        <Text style={styles.errorText}>{confirmMpinError}</Text>
                      )}
                    </View>
                    <TouchableOpacity
                      onPress={handleForgotMpin}
                      style={styles.buttonWrapper}>
                      {loading ? (
                        <ActivityIndicator size="small" color="#fff" />
                      ) : (
                        <Text style={styles.loginHeading}>New MPIN</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                  <View>
                    <TouchableOpacity
                      style={styles.iconWrapper}
                      onPress={() =>
                        navigation.navigate('ForgotMpinEmailScreen')
                      }>
                      <AntDesign name="arrow-left" color={'#fff'} size={25} />
                    </TouchableOpacity>
                  </View>
                </View>
              </KeyboardAvoidingView>
            </View>
          </LinearGradient>
        </SafeAreaView>
        <InternetConnection
          visible={showConnection}
          onClose={() => setShowConnection(false)}
        />
      </ImageBackground>
    </>
  );
};

export default SetForgotMpinScreen;

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
  },
  inputView: {
    borderWidth: 1,
    borderColor: 'rgba(245, 245, 245, 0.4)',
    marginTop: 5,
    borderRadius: 8,
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
    height: 50,
    backgroundColor: '#252f45',
    borderRadius: 8,
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
