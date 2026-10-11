/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-unused-vars */
import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {Alert, StatusBar, StyleSheet, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
//Redux
import {useSelector} from 'react-redux';
//Components
import InternetConnection from '../../components/InternetConnection';
import SingleVoucherView from '../../components/SingleVoucherView';
//Hooks
import useInternetCheck from '../../hooks/useInternetCheck';
//Models
import PopupImages from '../../models/PopupImages';
import SinglePageSkeleton from '../../loader/SinglePageSkeleton';

const SingleVoucher = () => {
  const loaderTimerRef = React.useRef(null);
  const insets = useSafeAreaInsets();

  const {voucherList} = useSelector(state => state.vouchers);

  const internetValue = useInternetCheck();

  const [allVouchersData, setAllVouchersData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showConnection, setShowConnection] = useState(false);
  // const [errorMessage, setErrorMessage] = useState('');

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
    setLoading(true);

    if (voucherList?.status === 1 && voucherList?.data) {
      setAllVouchersData(voucherList.data);
    }

    loaderTimerRef.current = setTimeout(() => {
      setLoading(false);

      if (voucherList?.status === 0) {
        setAllVouchersData(null);

        Alert.alert('Error', 'Internal Server Error');
      }
    }, 2000);

    return () => {
      if (loaderTimerRef.current) {
        clearTimeout(loaderTimerRef.current);
      }
    };
  }, [voucherList]);

  return (
    <View style={[styles.productContainer, {paddingBottom: insets.bottom}]}>
      <StatusBar animated={true} backgroundColor="#16182B" />
      {internetValue ? (
        loading ? (
          <View style={{marginTop: 5}}>
            <SinglePageSkeleton />
          </View>
        ) : (
          allVouchersData && (
            <View style={{flex: 1}}>
              <PopupImages />
              <SingleVoucherView voucherData={allVouchersData} />
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
