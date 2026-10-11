/* eslint-disable react-native/no-inline-styles */
import {yupResolver} from '@hookform/resolvers/yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import React, {useEffect, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {
  ActivityIndicator,
  Dimensions,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import * as yup from 'yup';
import backGroundImage from '../../assets/gamocoinImages/reloadkart_screen.jpg';
import {clearResponseData, forgotMpinEmail} from '../../redux/loginReducer';
import AntDesign from '@react-native-vector-icons/ant-design';

const {width, height} = Dimensions.get('screen');

const validationSchema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
});

const ForgotMpinEmailScreen = ({navigation, route}) => {
  const {mpinEmailData} = useSelector(state => state.userDetails);

  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [focusedField, setFocusedField] = useState('');

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      email: '',
    },
  });

  const onResetPassword = data => {
    setLoading(true);
    setEmail(data.email);
    dispatch(
      forgotMpinEmail({
        action: 'forgot_mpin',
        email: data.email,
      }),
    );
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

  useEffect(() => {
    const setForgotMpin = async () => {
      await AsyncStorage.setItem('email', JSON.stringify(email));
      if (mpinEmailData?.status === 1) {
        showToast({
          message: 'Success',
          description: mpinEmailData.message,
          type: 'success',
          icon: 'success',
          duration: 5000,
        });
        setTimeout(() => {
          navigation.navigate('SetForgotMpinScreen');
          setLoading(false);
        }, 3000);
      } else if (mpinEmailData?.status === 0) {
        showToast({
          message: 'Error',
          description: mpinEmailData.message,
          type: 'danger',
          icon: 'danger',
          duration: 5000,
        });
        setLoading(false);
      }
      setTimeout(() => {
        dispatch(clearResponseData('forgotEmail'));
      }, 2000);
    };
    setForgotMpin();
  }, [mpinEmailData, dispatch, navigation, email]);

  const handleFocus = fieldName => {
    setFocusedField(fieldName);
  };

  return (
    <>
      <ImageBackground source={backGroundImage} style={styles.backgroundImage}>
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
                    <View style={styles.textWrapper}>
                      <Text style={styles.text}>Forgot MPIN</Text>
                    </View>
                    <>
                      <View style={{width: '100%', marginBottom: 5}}>
                        <Text
                          style={{
                            fontSize: 16,
                            lineHeight: 22,
                            color: '#fff',
                          }}>
                          Please enter your email address and we will send you a
                          verification code to reset your MPIN.
                        </Text>
                      </View>
                      <View style={styles.inputBoxWrapper}>
                        <View style={{width: '100%'}}>
                          <Controller
                            name="email"
                            control={control}
                            render={({field: {onChange, value}}) => (
                              <View
                                style={[
                                  styles.inputView,
                                  focusedField === 'email' &&
                                    styles.focusedBackground,
                                  errors.email && styles.errorInput,
                                ]}>
                                <TextInput
                                  style={[styles.input]}
                                  placeholder="E-Mail"
                                  placeholderTextColor="rgba(245, 245, 245, 0.4)"
                                  value={value}
                                  keyboardType="email-address"
                                  onChangeText={onChange}
                                  maxLength={50}
                                  onFocus={() => handleFocus('email')}
                                />
                              </View>
                            )}
                          />
                          {errors.email && (
                            <Text style={styles.errorText}>
                              {errors.email.message}
                            </Text>
                          )}
                        </View>
                        <TouchableOpacity
                          onPress={handleSubmit(onResetPassword)}>
                          <View style={styles.buttonWrapper}>
                            {loading ? (
                              <ActivityIndicator
                                size="small"
                                color="#ffffff"
                                animating={loading}
                              />
                            ) : (
                              <Text
                                style={{
                                  fontSize: 18,
                                  textAlign: 'center',
                                  color: '#ffffff',
                                  fontWeight: 'bold',
                                }}>
                                Continue
                              </Text>
                            )}
                          </View>
                        </TouchableOpacity>
                      </View>
                    </>
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

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  inputBoxWrapper: {
    width: '100%',
    marginTop: 5,
  },
  gradientContainer: {
    width: width,
    height: height,
  },
  inputWrapper: {
    paddingHorizontal: 25,
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  textWrapper: {
    width: '100%',
    marginTop: 30,
    marginBottom: 30,
  },
  text: {
    fontSize: 24,
    color: '#fff',
    fontWeight: '700',
  },
  messageContainer: {
    // flex:1,
    marginBottom: 10,
    borderRadius: 4,
    paddingVertical: 10,
  },
  messageText: {
    color: '#C9D1D9',
    paddingHorizontal: 5,
    fontWeight: '600',
    paddingBottom: 8,
    lineHeight: 14,
  },
  messageLink: {
    top: 8,
    left: 6,
  },
  messageLinkText: {
    fontWeight: '600',
    color: '#20B038',
    textDecorationLine: 'underline',
  },
  inputView: {
    borderWidth: 1,
    borderColor: 'rgba(245, 245, 245, 0.4)',
    borderRadius: 10,
    marginVertical: 13,
    paddingHorizontal: 10,
  },
  input: {
    height: 50,
    paddingVertical: 10,
    fontSize: 16,
    color: '#fff',
  },
  focusedBackground: {
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  errorInput: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: -8,
    marginBottom: 8,
  },
  buttonWrapper: {
    width: '100%',
    marginTop: 0,
    marginBottom: 14,
    backgroundColor: '#252f45',
    borderRadius: 10,
    padding: 16,
  },
  iconWrapper: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
  },
});

export default ForgotMpinEmailScreen;
