/* eslint-disable no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {Alert, StatusBar, StyleSheet, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
//Redux
import {useDispatch, useSelector} from 'react-redux';
//Components
import InternetConnection from '../../components/InternetConnection';
import SingleTopupView from '../../components/SingleTopupView';
//Hooks
import useInternetCheck from '../../hooks/useInternetCheck';
//Models
import PopupImages from '../../models/PopupImages';
import SinglePageSkeleton from '../../loader/SinglePageSkeleton';
import {clearSingleTopupData} from '../../redux/voucherReducer';

const SingleTopup = () => {
  const loaderTimerRef = React.useRef(null);
  const insets = useSafeAreaInsets();

  const {singleTopupObject} = useSelector(state => state.vouchers);

  const internetValue = useInternetCheck();

  const dispatch = useDispatch();

  const [singleTopupData, setSingleTopupData] = useState(null);
  const [showConnection, setShowConnection] = useState(false);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      if (internetValue) {
        setShowConnection(false);

        // Reset states
        setSingleTopupData(null);
        setLoading(true);
      } else {
        setShowConnection(true);
        setLoading(false);
      }

      return () => {
        dispatch(clearSingleTopupData());

        if (loaderTimerRef.current) {
          clearTimeout(loaderTimerRef.current);
        }
      };
    }, [internetValue, dispatch]),
  );

  useEffect(() => {
    if (!singleTopupObject) {
      return;
    }

    // Clear previous timer
    if (loaderTimerRef.current) {
      clearTimeout(loaderTimerRef.current);
    }

    loaderTimerRef.current = setTimeout(() => {
      // Success
      if (singleTopupObject?.status === 1) {
        setSingleTopupData(singleTopupObject?.data);
      }

      // Error
      else if (singleTopupObject?.status === 0) {
        setSingleTopupData(null);

        Alert.alert('Error', 'Internal server error');
      }

      setLoading(false);
    }, 2000);

    return () => {
      if (loaderTimerRef.current) {
        clearTimeout(loaderTimerRef.current);
      }
    };
  }, [singleTopupObject]);

  return (
    <View style={[styles.productContainer, {paddingBottom: insets.bottom}]}>
      <StatusBar animated={true} backgroundColor="#16182B" />
      {internetValue ? (
        loading ? (
          <View style={{marginTop: 5}}>
            <SinglePageSkeleton />
          </View>
        ) : (
          singleTopupData && (
            <View style={{flex: 1}}>
              <PopupImages />
              <SingleTopupView topupData={singleTopupData} />
            </View>
          )
        )
      ) : (
        <InternetConnection
          visible={showConnection}
          onClose={() => setShowConnection(false)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  productContainer: {
    flex: 1,
    backgroundColor: '#16182B',
  },
  innerContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 16,
  },
});

export default SingleTopup;
