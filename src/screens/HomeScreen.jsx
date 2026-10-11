/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/react-in-jsx-scope */
import {useCallback, useState} from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
// COMPONENTS
import DashboardSection from '../components/DashboardSection';
import InternetConnection from '../components/InternetConnection';
// CUSTOM HOOKS
import useInternetCheck from '../hooks/useInternetCheck';
import useVoucherItems from '../hooks/useVoucherItems';
// MODELS
import PopupImages from '../models/PopupImages';
import HomeSkeleton from '../loader/HomeSkeleton';
import {useSelector} from 'react-redux';

const HomeScreen = props => {
  const {navigation} = props;

  const insets = useSafeAreaInsets();

  const internetValue = useInternetCheck();

  const {allVoucherList} = useVoucherItems();

  const [loading, setLoading] = useState(true);
  const [showConnection, setShowConnection] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (internetValue) {
        setShowConnection(false);
      } else {
        setShowConnection(true);
      }
    }, [internetValue]),
  );

  useFocusEffect(
    useCallback(() => {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }, [allVoucherList]),
  );

  return (
    <View style={[styles.dashboardContainer, {paddingBottom: insets.bottom}]}>
      {internetValue ? (
        loading ? (
          <View style={styles.loadingContainer}>
            <HomeSkeleton />
          </View>
        ) : (
          <View>
            <PopupImages />
            <DashboardSection navigation={navigation} />
          </View>
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

export default HomeScreen;

const styles = StyleSheet.create({
  dashboardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#16182B',
  },
});
