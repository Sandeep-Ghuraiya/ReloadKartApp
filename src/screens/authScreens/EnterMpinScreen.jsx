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
  ScrollView,
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
import {clearResponseData, loginWithMpin} from '../../redux/loginReducer';

const {width, height} = Dimensions.get('screen');

const EnterMpinScreen = ({navigation, route}) => {
  const {loginMpinData} = useSelector(state => state.userDetails);
  const device_info = useSelector(state => state.deviceInfo.deviceInfoData);

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [mpin, setMpin] = useState('');
  const [mpinError, setMpinError] = useState('');
  const [focusedField, setFocusedField] = useState('');

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

  useEffect(() => {
    if (loginMpinData?.status === 1) {
      showMessage({
        message: 'Success',
        description: loginMpinData.message,
        type: 'success',
        icon: 'success',
        duration: 4000,
      });
      setTimeout(() => {
        setLoading(false);
        navigation.replace('AppDrawer');
      }, 3000);
    } else if (loginMpinData?.status === 0) {
      setLoading(false);
      showToast({
        message: 'Error',
        description: loginMpinData.message,
        type: 'danger',
        icon: 'danger',
        duration: 4000,
      });
    }
    setTimeout(() => {
      dispatch(clearResponseData('enterMpin'));
    }, 2000);
  }, [loginMpinData, dispatch, navigation]);

  const handleFocus = fieldName => {
    setFocusedField(fieldName);
  };

  const handleLoginMpin = () => {
    setMpinError('');
    if (!mpin) {
      setMpinError('MPIN is required');
    }

    if (mpin && mpin.length < 4) {
      setMpinError('MPIN must be 4 digits');
    }

    if (mpin && mpin.length === 4) {
      setLoading(true);
      dispatch(
        loginWithMpin({
          action: 'login_mpin',
          email: email,
          mpin: mpin,
          device_token: device_info?.deviceToken || '',
          device_id: device_info?.deviceId || '',
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
                    <Text style={styles.heading}>MPIN</Text>
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
                          onTextChange={setMpin}
                          theme={{
                            containerStyle: styles.containerStyle,
                            pinCodeContainerStyle: [
                              styles.pinCodeContainer,
                              focusedField === 'mpin' &&
                                styles.focusedBackground,
                              mpinError && styles.errorInput,
                            ],
                            pinCodeTextStyle: styles.pinCodeText,
                          }}
                        />
                        {mpinError && (
                          <Text style={styles.errorText}>{mpinError}</Text>
                        )}
                      </View>

                      <TouchableOpacity
                        onPress={handleLoginMpin}
                        style={styles.buttonWrapper}>
                        {loading ? (
                          <ActivityIndicator size="small" color="#fff" />
                        ) : (
                          <Text style={styles.loginHeading}>Enter MPIN</Text>
                        )}
                      </TouchableOpacity>
                      <View style={styles.linksContainer}>
                        <TouchableOpacity
                          style={styles.link}
                          onPress={() => {
                            navigation.navigate('ResetMpinScreen');
                          }}>
                          <Text style={styles.linkText}>Reset MPIN</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.link}
                          onPress={() => {
                            navigation.navigate('ForgotMpinEmailScreen');
                          }}>
                          <Text style={[styles.linkText, {textAlign: 'right'}]}>
                            Forgot MPIN?
                          </Text>
                        </TouchableOpacity>
                      </View>
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

export default EnterMpinScreen;

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
});
