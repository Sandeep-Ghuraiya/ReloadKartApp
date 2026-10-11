/* eslint-disable no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {Alert, StatusBar, StyleSheet, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
//Redux
import {useSelector} from 'react-redux';
//Components
import InternetConnection from '../../components/InternetConnection';
import SingleTopupView from '../../components/SingleTopupView';
//Hooks
import useInternetCheck from '../../hooks/useInternetCheck';
//Models
import PopupImages from '../../models/PopupImages';
import SinglePageSkeleton from '../../loader/SinglePageSkeleton';

const SingleTopup = () => {
  const loaderTimerRef = React.useRef(null);
  const insets = useSafeAreaInsets();

  const {topupList} = useSelector(state => state.vouchers);

  const internetValue = useInternetCheck();

  const [allTopupData, setAllTopupData] = useState(null);
  const [showConnection, setShowConnection] = useState(false);
  const [loading, setLoading] = useState(true);

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

    if (topupList?.status === 1 && topupList?.data) {
      setAllTopupData(topupList?.data);
    }

    loaderTimerRef.current = setTimeout(() => {
      setLoading(false);

      if (topupList?.status === 0) {
        setAllTopupData(null);

        Alert.alert('Error', 'Internal Server Error');
      }
    }, 2000);

    return () => {
      if (loaderTimerRef.current) {
        clearTimeout(loaderTimerRef.current);
      }
    };
  }, [topupList]);

  return (
    <View style={[styles.productContainer, {paddingBottom: insets.bottom}]}>
      <StatusBar animated={true} backgroundColor="#16182B" />
      {internetValue ? (
        loading ? (
          <View style={{marginTop: 5}}>
            <SinglePageSkeleton />
          </View>
        ) : (
          allTopupData && (
            <View style={{flex: 1}}>
              <PopupImages />
              <SingleTopupView topupData={allTopupData} />
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
