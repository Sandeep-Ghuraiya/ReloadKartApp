/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-unused-vars */
import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {Alert, StatusBar, StyleSheet, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
//Redux
import {useDispatch, useSelector} from 'react-redux';
//Components
import InternetConnection from '../../components/InternetConnection';
import SingleVoucherView from '../../components/SingleVoucherView';
//Hooks
import useInternetCheck from '../../hooks/useInternetCheck';
//Models
import PopupImages from '../../models/PopupImages';
import SinglePageSkeleton from '../../loader/SinglePageSkeleton';
import {clearSingleVoucherData} from '../../redux/voucherReducer';

const SingleVoucher = () => {
  const loaderTimerRef = React.useRef(null);

  const insets = useSafeAreaInsets();

  const {singleVoucherObject} = useSelector(state => state.vouchers);

  const dispatch = useDispatch();

  const internetValue = useInternetCheck();

  const [vouchersData, setVouchersData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showConnection, setShowConnection] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (internetValue) {
        setShowConnection(false);

        // Reset states
        setVouchersData(null);
        setLoading(true);
      } else {
        setShowConnection(true);
        setLoading(false);
      }

      return () => {
        dispatch(clearSingleVoucherData());

        if (loaderTimerRef.current) {
          clearTimeout(loaderTimerRef.current);
        }
      };
    }, [internetValue, dispatch]),
  );

  useEffect(() => {
    if (!singleVoucherObject) {
      return;
    }

    // Clear previous timer
    if (loaderTimerRef.current) {
      clearTimeout(loaderTimerRef.current);
    }

    loaderTimerRef.current = setTimeout(() => {
      // Success
      if (singleVoucherObject?.status === 1) {
        setVouchersData(singleVoucherObject?.data);
      }

      // Error
      else if (singleVoucherObject?.status === 0) {
        setVouchersData(null);

        Alert.alert('Error', 'Internal server error');
      }

      setLoading(false);
    }, 2000);

    return () => {
      if (loaderTimerRef.current) {
        clearTimeout(loaderTimerRef.current);
      }
    };
  }, [singleVoucherObject]);

  return (
    <View style={[styles.productContainer, {paddingBottom: insets.bottom}]}>
      <StatusBar animated={true} backgroundColor="#16182B" />
      {internetValue ? (
        loading ? (
          <View style={{marginTop: 5}}>
            <SinglePageSkeleton />
          </View>
        ) : (
          vouchersData && (
            <View style={{flex: 1}}>
              <PopupImages />
              <SingleVoucherView voucherData={vouchersData} />
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

export default SingleVoucher;
