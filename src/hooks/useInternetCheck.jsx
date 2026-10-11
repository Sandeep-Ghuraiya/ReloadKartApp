/* eslint-disable prettier/prettier */
import NetInfo from '@react-native-community/netinfo';
import {useEffect, useState} from 'react';

const useInternetCheck = () => {
  const [internetValue, setInternetValue] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setInternetValue(state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  return internetValue;
};

export default useInternetCheck;
