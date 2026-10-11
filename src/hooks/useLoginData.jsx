/* eslint-disable prettier/prettier */
/* eslint-disable curly */
import {setLogoutFunction} from '../redux/loginReducer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

const STORAGE_KEYS = ['login_data', 'set_mpin', 'otp_login', 'user_data'];

const useLoginData = () => {
  const dispatch = useDispatch();

  const {isLoggedIn} = useSelector(
    state => state.userDetails,
  );

  const [loginDetails, setLoginDetails] = useState(null);
  const [mpinDetails, setMpinDetails] = useState(null);
  const [otpDetails, setOtpDetails] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [loginLoading, setLoginLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const getLoginData = async () => {
      try {
        setLoginLoading(true);

        // ✅ multiGet for better performance
        const keyValuePairs = await AsyncStorage.multiGet(STORAGE_KEYS);

        if (!isMounted) return;

        const storageData = Object.fromEntries(
          keyValuePairs.map(([key, value]) => [
            key,
            value ? JSON.parse(value) : null,
          ]),
        );

        const loginData = storageData.login_data;

        setLoginDetails(loginData);
        setMpinDetails(storageData.set_mpin);
        setOtpDetails(storageData.otp_login);
        setUserDetails(storageData.user_data);

        // ✅ Redux login state
        dispatch(setLogoutFunction(!!loginData));
      } catch (error) {
        console.error('AsyncStorage multiGet error:', error);

        if (!isMounted) return;

        setLoginDetails(null);
        setMpinDetails(null);
        setOtpDetails(null);
        dispatch(setLogoutFunction(false));
      } finally {
        isMounted && setLoginLoading(false);
      }
    };

    getLoginData();

    return () => {
      isMounted = false;
    };
  }, [dispatch]);

  return {
    loginDetails,
    mpinDetails,
    otpDetails,
    userDetails,
    loginLoading,
    isLoggedIn,
  };
};

export default useLoginData;
