/* eslint-disable curly */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
//modules
import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import {request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import Geocoder from 'react-native-geocoder';
import {Alert, Platform} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import DeviceInfo from 'react-native-device-info';

//REDUX
import {useDispatch} from 'react-redux';
import AuthStack from './router/AuthStack/AuthStack';
import {generalSetting} from './redux/settingReducer';

// Common Functions
import fetchDataFromApi from './commonFunction/fetchDataFromApi';
import {setDeviceInfo} from './redux/deviceInfoReducer';

async function requestLocationPermission() {
  if (Platform.OS === 'ios') {
    const result = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);

    if (result === RESULTS.GRANTED) {
      return true;
    }

    //console.log('Location permission denied:', result);
    return false;
  }
}

export default function AppLayout() {
  const dispatch = useDispatch();
  const date = moment().format('DD-MM-YYYY HH-mm-ss');

  const [permissions, setPermissions] = useState({});
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getDeviceId = async () => {
      // ✅ async
      const uniqueId = await DeviceInfo.getUniqueId();

      // ✅ sync (NO await)
      const model = DeviceInfo.getModel();
      const deviceId = DeviceInfo.getDeviceId();
      const brand = DeviceInfo.getBrand();
      const systemVersion = DeviceInfo.getSystemVersion();

      // ⚠️ async – may fail on simulator
      let deviceName = null;
      try {
        deviceName = await DeviceInfo.getDeviceName();
      } catch (e) {
        deviceName = 'Unavailable';
      }

      // ⚠️ iOS ONLY – requires push notification setup
      let deviceToken = null;
      try {
        deviceToken = await DeviceInfo.getDeviceToken();
      } catch (e) {
        deviceToken = null;
      }

      let deviceInfo = {
        uniqueId,
        model,
        deviceId,
        deviceName,
        deviceToken,
        brand,
        systemVersion,
      };

      dispatch(setDeviceInfo(deviceInfo));
    };

    getDeviceId();
  }, []);

  useEffect(() => {
    const generalData = JSON.stringify({
      action: 'general_settings',
    });
    dispatch(generalSetting(generalData));
  }, []);

  /* ---------------- LOGIN FLOW ---------------- */
  useEffect(() => {
    const timer = setTimeout(() => {
      getCurrentDateandTime();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  /* ---------------- DATE / LOCATION LOGIC ---------------- */
  const getCurrentDateandTime = async () => {
    try {
      const value = await AsyncStorage.getItem('country_code');
      getLocation();
      if (value) {
        const currentDate = await AsyncStorage.getItem('current_date');

        if (currentDate) {
          const storedDate = moment(currentDate, 'DD-MM-YYYY HH-mm-ss');
          const diff = moment().diff(storedDate, 'hours');

          if (diff > 3) {
            fetchDataFromApi(dispatch);
            await AsyncStorage.setItem('current_date', date);
          }
        } else {
          await AsyncStorage.setItem('current_date', date);
          fetchDataFromApi(dispatch);
        }
      } else {
        getLocation();
        fetchDataFromApi(dispatch);
      }
    } catch (error) {
      console.error('Date error:', error);
    }
  };

  const getLocation = async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) return;

    setLoading(true);

    Geolocation.getCurrentPosition(
      async position => {
        const {latitude, longitude} = position.coords;

        setLocation({latitude, longitude});

        try {
          const geoData = await Geocoder.geocodePosition({
            lat: latitude,
            lng: longitude,
          });

          if (geoData && geoData.length > 0) {
            setAddress(geoData[0]);
            fetchAddressFromCoords(geoData);
          }
        } catch (error) {
          console.log('Geocoder error:', error);
        }

        setLoading(false);
      },
      error => {
        setLoading(false);
        console.log('Location error:', error);
        handleNoPermission();
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      },
    );
  };

  const fetchAddressFromCoords = async geoData => {
    try {
      if (geoData.length > 0) {
        await AsyncStorage.setItem('country_code', geoData[0].countryCode);
        await AsyncStorage.setItem('current_date', date);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleNoPermission = async () => {
    await AsyncStorage.setItem('country_code', 'in');
    await AsyncStorage.setItem('current_date', date);
  };

  return (
    <>
      <NavigationContainer>
        <AuthStack />
      </NavigationContainer>
    </>
  );
}
