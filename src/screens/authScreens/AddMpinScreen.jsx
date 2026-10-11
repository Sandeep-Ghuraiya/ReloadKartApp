/* eslint-disable curly */
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
import {clearResponseData, userSetMpin} from '../../redux/loginReducer';
import useInternetCheck from '../../hooks/useInternetCheck';
import {useFocusEffect} from '@react-navigation/native';
import InternetConnection from '../../components/InternetConnection';

const {width, height} = Dimensions.get('screen');

const AddMpinScreen = ({navigation, route}) => {
  const internetValue = useInternetCheck();

  const {setMpinData} = useSelector(state => state.userDetails);

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [mpin, setMpin] = useState('');
  const [confirmMpin, setConfirmMpin] = useState('');
  const [mpinError, setMpinError] = useState('');
  const [confirmMpinError, setConfirmMpinError] = useState('');
  const [focusedField, setFocusedField] = useState('');
  const [showConnection, setShowConnection] = useState(false);

  const dispatch = useDispatch();

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
    if (!setMpinData) return;

    let navigationTimer;
    let clearDataTimer;

    if (setMpinData.status === 1) {
      // ✅ Show success message for 5 seconds
      showToast({
        message: 'Success',
        description: setMpinData.message,
        type: 'success',
        icon: 'success',
        duration: 4000,
      });

      setLoading(false);

      // ✅ Navigate AFTER flash message
      navigationTimer = setTimeout(() => {
        navigation.navigate('EnterMpinScreen');
      }, 4000);
    }

    if (setMpinData.status === 0) {
      setLoading(false);

      showMessage({
        message: 'Error',
        description: setMpinData.message,
        type: 'danger',
        icon: 'danger',
        duration: 4000,
      });
    }

    // ✅ Clear redux response AFTER message is shown
    clearDataTimer = setTimeout(() => {
      dispatch(clearResponseData('setMpin'));
    }, 5500);

    return () => {
      clearTimeout(navigationTimer);
      clearTimeout(clearDataTimer);
    };
  }, [setMpinData, dispatch, navigation]);

  const handleFocus = fieldName => {
    setFocusedField(fieldName);
  };

  const handleMpinSubmit = () => {
    if (internetValue) {
      setMpinError('');
      setConfirmMpinError('');
      if (!mpin) {
        setMpinError('MPIN is required');
      }
      if (!confirmMpin) {
        setConfirmMpinError('Confirm MPIN is required');
      }

      if (mpin !== confirmMpin) {
        setConfirmMpinError('MPIN and ConfirmMpin does not match');
      }

      if (mpin && mpin.length < 4) {
        setMpinError('MPIN must be 4 digits');
      }

      if (confirmMpin && confirmMpin.length < 4) {
        setConfirmMpinError('Confirm MPIN must be 4 digits');
      }

      if (
        mpin &&
        confirmMpin &&
        mpin === confirmMpin &&
        mpin.length === 4 &&
        confirmMpin.length === 4
      ) {
        setLoading(true);
        dispatch(
          userSetMpin({
            action: 'set_mpin',
            email: email,
            mpin: mpin,
            confirm_mpin: confirmMpin,
          }),
        );
        setTimeout(() => {
          setLoading(false);
        }, 15000);
      }
    } else {
      setShowConnection(true);
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
                <View style={styles.inputWrapper}>
                  <Text style={styles.heading}>Set MPIN</Text>

                  <View style={styles.inputBoxWrapper}>
                    <View
                      style={{
                        marginBottom: 20,
                        paddingHorizontal: 15,
                      }}>
                      <Text style={styles.label}>Enter MPIN</Text>
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
                        onFocus={() => handleFocus('mpin')}
                        onBlur={() => console.log('Blurred')}
                        onTextChange={setMpin}
                        theme={{
                          containerStyle: styles.containerStyle,
                          pinCodeContainerStyle: [
                            styles.pinCodeContainer,
                            focusedField === 'mpin' && styles.focusedBackground,
                            mpinError && styles.errorInput,
                          ],
                          pinCodeTextStyle: styles.pinCodeText,
                        }}
                      />
                      {mpinError && (
                        <Text style={styles.errorText}>{mpinError}</Text>
                      )}
                    </View>

                    <View style={{marginBottom: 20, paddingHorizontal: 15}}>
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
                        onFocus={() => handleFocus('otp')}
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
                      onPress={handleMpinSubmit}
                      style={styles.buttonWrapper}>
                      {loading ? (
                        <ActivityIndicator size="small" color="#fff" />
                      ) : (
                        <Text style={styles.loginHeading}>Confirm MPIN</Text>
                      )}
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

export default AddMpinScreen;

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
  pinCodeContainer: {
    width: 60,
    height: 60,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(245, 245, 245, 0.4)',
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
    color: '#3c6f67',
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
});
