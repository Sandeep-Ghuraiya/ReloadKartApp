/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
/* eslint-disable curly */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/react-in-jsx-scope */
import {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import {showMessage} from 'react-native-flash-message';
import {OtpInput} from 'react-native-otp-entry';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Controller, useForm} from 'react-hook-form';

//REDUX ACTIONS
import {useDispatch, useSelector} from 'react-redux';
import {
  clearResponseData,
  userGeneralDetails,
  userLoginDetails,
  userLoginOtp,
} from '../../redux/loginReducer';

//ASSETS
import backGroundImage from '../../assets/gamocoinImages/reloadkart_screen.jpg';

//COMPONENTS
import ShowAlert from '../../components/ShowAlert';
import useInternetCheck from '../../hooks/useInternetCheck';
import {useFocusEffect} from '@react-navigation/native';
import InternetConnection from '../../components/InternetConnection';

const {width, height} = Dimensions.get('screen');

const validationSchema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
});

const LoginScreen = props => {
  const internetValue = useInternetCheck();
  const {navigation, route} = props;

  const device_info = useSelector(state => state.deviceInfo.deviceInfoData);

  const {
    control,
    handleSubmit,
    setValue,
    formState: {errors},
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      email: '',
    },
  });

  const {loginData, loginOtpData, userGeneralData} = useSelector(
    state => state.userDetails,
  );

  const dispatch = useDispatch();

  // const messaging = getMessaging();

  const [secureText, setSecureText] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [focusedField, setFocusedField] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [isOtpVisible, setIsOtpVisible] = useState(false);
  const [timer, setTimer] = useState(120);
  const [canResend, setCanResend] = useState(false);
  const [showConnection, setShowConnection] = useState(false);

  const clearResponse = key => {
    dispatch(clearResponseData(key));
  };

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

    if (isOtpVisible) {
      const interval = setInterval(() => {
        setTimer(t => t - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isOtpVisible, timer]);

  const toggleSecureText = () => {
    setSecureText(!secureText);
  };

  useEffect(() => {
    if (!loginData) return;

    setLoading(false);

    if (loginData.status === 1) {
      setTimer(120);
      setIsOtpVisible(true);
      showToast({
        message: 'Success',
        description: loginData.message,
        type: 'success',
        icon: 'success',
        duration: 4000,
      });

      AsyncStorage.setItem('email', JSON.stringify(email));
    } else {
      setIsOtpVisible(false);
      showToast({
        message: 'Error',
        description: loginData.message,
        type: 'danger',
        icon: 'danger',
        duration: 4000,
      });
    }

    clearResponse('loginEmail');
  }, [loginData]);

  useEffect(() => {
    if (!loginOtpData) return;

    if (loginOtpData.status === 1) {
      dispatch(
        userGeneralDetails({
          action: 'get_user',
          email,
        }),
      );
    } else {
      showToast({
        message: 'Error',
        description: loginData.message,
        type: 'danger',
      });
    }

    clearResponse('loginOtp');
  }, [loginOtpData]);

  useEffect(() => {
    if (!userGeneralData) return;

    setLoading(false);

    if (userGeneralData.status !== 1) return;

    setTimer(120);

    const route = userGeneralData.data.mpin
      ? 'EnterMpinScreen'
      : 'AddMpinScreen';

    navigation.navigate(route);
    //navigation.replace('AppDrawer');
  }, [userGeneralData]);

  const handleLogin = data => {
    if (internetValue) {
      setOtpError('');
      if (!otp && isOtpVisible) {
        setOtpError('OTP is required');
      }
      if (otp && isOtpVisible && otp.length < 6) {
        setOtpError('OTP must be 6 digits');
      }
      if (otp && isOtpVisible) {
        if (otp.length === 6) {
          setLoading(true);
          Keyboard.dismiss();
          dispatch(
            userLoginOtp({
              action: 'email_verify_otp',
              email: data.email,
              otp: otp,
            }),
          );
        }
      } else if (data.email) {
        setEmail(data.email);
        setLoading(true);
        Keyboard.dismiss();
        const user_data = JSON.stringify({
          action: 'email_otp',
          email: data.email,
          device_token: device_info?.deviceToken || '',
          device_id: device_info?.deviceId || '',
        });
        dispatch(userLoginDetails(user_data));

        setTimeout(() => {
          setLoading(false);
        }, 10000);
      }
    } else {
      setShowConnection(true);
    }
  };

  const onResendOtp = () => {
    if (internetValue) {
      setLoading(true);
      dispatch(
        userLoginDetails({
          action: 'email_otp',
          email: email,
        }),
      );
      setTimeout(() => {
        setLoading(false);
      }, 10000);
    } else {
      setShowConnection(true);
    }
  };

  const handleFocus = fieldName => {
    setFocusedField(fieldName);
  };

  return (
    <>
      <ImageBackground
        source={backGroundImage}
        style={[{width: width, height: '100%'}]}>
        <SafeAreaView style={{flex: 1}}>
          <ShowAlert
            onMessage="Please enter valid email address and password."
            onVisiable={showAlert}
            onCloseAlert={() => setShowAlert(false)}
            showName="login"
          />
          <LinearGradient
            colors={['rgba(22, 24, 43, 0)', 'rgba(22, 24, 43, 1)']}
            locations={[0, 0.5]} // Percentage stops (0%, 100%)
            start={{x: 0, y: 0}} // Start at the top-left
            end={{x: 0, y: 1}} // End at the bottom-left (top-to-bottom)
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
                    <Text style={styles.heading}>Log In</Text>

                    <View style={styles.inputBoxWrapper}>
                      <Controller
                        name="email"
                        control={control}
                        render={({field: {onChange, value}}) => (
                          <TextInput
                            // style={styles.input}
                            style={[
                              styles.input,
                              errors.email && styles.errorInput,
                            ]}
                            placeholder="User Id"
                            placeholderTextColor="rgba(245, 245, 245, 0.5)"
                            value={value}
                            keyboardType="email-address"
                            onChangeText={onChange}
                          />
                        )}
                      />
                      {errors.email && (
                        <Text style={styles.errorText}>
                          {errors.email.message}
                        </Text>
                      )}

                      {isOtpVisible && (
                        <View style={{marginBottom: 20}}>
                          {/* <Controller
                          name="otp"
                          control={control}
                          render={({ field: { onChange, value } }) => ( */}
                          <View style={{paddingHorizontal: 5}}>
                            <Text style={styles.label}>Enter OTP</Text>
                            <OtpInput
                              numberOfDigits={6}
                              focusColor="#20B038"
                              autoFocus={true}
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
                                  styles.pinCodeContainer,
                                  focusedField === 'otp' &&
                                    styles.focusedBackground,
                                  otpError && styles.errorInput,
                                ],
                                pinCodeTextStyle: styles.pinCodeText,
                              }}
                            />
                            {otpError && (
                              <Text style={styles.errorText}>{otpError}</Text>
                            )}
                          </View>
                          {/* RESEND */}
                          <View style={styles.resendContainer}>
                            {canResend ? (
                              <Text
                                style={styles.resendText}
                                onPress={onResendOtp}>
                                Resend OTP
                              </Text>
                            ) : (
                              <Text style={styles.timerText}>
                                Resend OTP in {timer}s
                              </Text>
                            )}
                          </View>
                        </View>
                      )}

                      <TouchableOpacity
                        onPress={handleSubmit(handleLogin)}
                        style={[
                          styles.buttonWrapper,
                          loading && {opacity: 0.5},
                        ]}
                        disabled={loading}>
                        {loading ? (
                          <ActivityIndicator size="small" color="#fff" />
                        ) : (
                          <Text style={styles.loginHeading}>Sign In</Text>
                        )}
                      </TouchableOpacity>
                    </View>
                  </View>
                </ScrollView>
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

export default LoginScreen;

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  gradientContainer: {
    width: width,
    height: height,
  },
  inputWrapper: {
    paddingHorizontal: 20,
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
    marginBottom: 20,
  },
  input: {
    height: 50,
    marginTop: 5,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(245, 245, 245, 0.4)',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    color: '#fff',
  },
  errorInput: {
    borderColor: 'red',
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
  buttonWrapper: {
    height: 50,
    backgroundColor: '#252f45',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
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
    backgroundColor: 'rgba(245, 245, 245, 0.4)',
  },
  orText: {
    paddingHorizontal: 10,
    fontSize: 14,
    fontWeight: '500',
    color: '#fff',
  },
  authLoginButtonWrapper: {
    // marginBottom: 20,
    alignItems: 'center',
  },
  iconWrapper: {
    width: '85%',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(245, 245, 245, 0.4)',
    borderRadius: 40,
    height: 50,
    marginBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: '#252F45',
  },
  iconMargin: {
    marginRight: 10,
    // marginLeft:15,
  },
  iconText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
    marginLeft: 50,
  },
  googleIcon: {
    width: 22,
    marginRight: 10,
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
  label: {
    color: '#fff',
    marginBottom: 5,
  },
  containerStyle: {
    width: '100%',
    justifyContent: 'center',
    gap: 7,
  },
  pinCodeContainer: {
    width: 50,
    height: 50,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(245, 245, 245, 0.4)',
  },
  pinCodeText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 18, // Slightly bigger font size for better visibility
  },
});
