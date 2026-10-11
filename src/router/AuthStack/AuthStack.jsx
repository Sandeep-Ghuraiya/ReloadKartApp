/* eslint-disable curly */
import React, {useEffect, useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
//Navigation
import DrawerNavigator from '../AppDrawer/AppDrawer';
//SplashScreen
import SplashScreen from '../../screens/SplashScreen';
//Hooks
import useLoginData from '../../hooks/useLoginData';
//Screen
import LoginScreen from '../../screens/authScreens/LoginScreen';
import AddMpinScreen from '../../screens/authScreens/AddMpinScreen';
import EnterMpinScreen from '../../screens/authScreens/EnterMpinScreen';
import ResetMpinScreen from '../../screens/authScreens/ResetMpinScreen';
import ForgotMpinEmailScreen from '../../screens/authScreens/ForgotMpinEmailScreen';
import SetForgotMpinScreen from '../../screens/authScreens/SetForgotMpinScreen';
//import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  const {mpinDetails, otpDetails, userDetails, loginLoading} = useLoginData();

  const [showSplash, setShowSplash] = useState(true);
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    // ⏳ Force splash for 4 seconds
    const splashTimer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);

    return () => clearTimeout(splashTimer);
  }, []);

  useEffect(() => {
    // 🚦 Wait until splash & login storage check are done
    if (showSplash || loginLoading) return;

    const hasOtp = Boolean(otpDetails);
    const hasMpin = Boolean(mpinDetails) || Boolean(userDetails?.data?.mpin);

    const timer = setTimeout(() => {
      if (!hasOtp) {
        setInitialRoute('Login');
        return;
      }

      setInitialRoute(hasMpin ? 'EnterMpinScreen' : 'AddMpinScreen');
    }, 500);

    return () => clearTimeout(timer);
  }, [
    showSplash,
    loginLoading,
    otpDetails,
    mpinDetails,
    userDetails?.data?.mpin,
  ]);

  // 🟡 Always show splash first
  if (showSplash || loginLoading || !initialRoute) {
    return <SplashScreen />;
  }

  return (
    <Stack.Navigator
      initialRouteName={initialRoute}
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="AppDrawer" component={DrawerNavigator} />
      <Stack.Screen name="AddMpinScreen" component={AddMpinScreen} />
      <Stack.Screen name="EnterMpinScreen" component={EnterMpinScreen} />
      <Stack.Screen name="ResetMpinScreen" component={ResetMpinScreen} />
      <Stack.Screen
        name="ForgotMpinEmailScreen"
        component={ForgotMpinEmailScreen}
      />
      <Stack.Screen
        name="SetForgotMpinScreen"
        component={SetForgotMpinScreen}
      />
    </Stack.Navigator>
  );
};

export default AuthStack;
