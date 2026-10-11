import * as React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

// Components
import VoucherCard from '../components/VoucherCard';
import useSpecialItems from '../hooks/useSpecialItems';
import useVoucherItems from '../hooks/useVoucherItems';
import {FlatList} from 'react-native-gesture-handler';
import Skeleton from '../loader/skeleton';
import {useNavigation} from '@react-navigation/native';

import {incrementCount} from '../redux/counterReducer';
import {useDispatch} from 'react-redux';
import usePopupImage from '../hooks/usePopupImage';

const SecondTabRoute = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const checkImage = usePopupImage();

  const {allVoucherList} = useVoucherItems();

  const {allSpecialDealsList} = useSpecialItems();

  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, [allVoucherList, allSpecialDealsList]);

  return (
    <View style={styles.container}>
      <View style={styles.mainWrapper}>
        {loading ? (
          <View>
            <Skeleton />
          </View>
        ) : (
          <View style={styles.listContainer}>
            {allSpecialDealsList && allSpecialDealsList.length > 0 ? (
              <>
                <View style={styles.listVoucherWrapper}>
                  <FlatList
                    // ref={flatListRef}
                    data={allSpecialDealsList}
                    nestedScrollEnabled={true}
                    showsVerticalScrollIndicator={false}
                    renderItem={({item, index}) =>
                      index < 10 ? (
                        <VoucherCard
                          item={item}
                          index={index}
                          // userToken={userToken}
                        />
                      ) : null
                    }
                    keyExtractor={(item, index) => index.toString()}
                  />
                </View>
                {allVoucherList.length > 10 ? (
                  <View style={styles.allViewButton}>
                    <TouchableOpacity
                      style={styles.allViewTouchableOpacity}
                      onPress={() => {
                        dispatch(incrementCount(checkImage));
                        navigation.navigate('CategoriesList', {
                          title: 'All Vouchers',
                          slug: '',
                          item: 'vouchers',
                          image: null,
                          name: 'Vocher',
                        });
                      }}>
                      <Text style={styles.btnText}>View all Vouchers</Text>
                    </TouchableOpacity>
                  </View>
                ) : null}
              </>
            ) : (
              <View style={styles.textCenter}>
                <Text style={styles.noText}>Voucher not found</Text>
              </View>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

export default SecondTabRoute;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#252f45',
  },
  mainWrapper: {
    paddingHorizontal: 8,
    paddingTop: 20,
    paddingBottom: 10,
    marginBottom: 5,
  },
  listContainer: {
    width: '100%',
    maxWidth: '100%',
    position: 'relative',
    height: '100%',
  },
  listVoucherWrapper: {
    width: '100%',
    height: '80%',
    overflow: 'hidden',
    paddingBottom: 8,
    marginBottom: 10,
  },
  allViewButton: {
    width: '100%',
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  allViewTouchableOpacity: {
    width: '100%',
    borderRadius: 8,
    backgroundColor: '#20B038',
  },
  btnText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 40,
    color: '#fff',
  },
  textCenter: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff',
    letterSpacing: 1,
  },
});
