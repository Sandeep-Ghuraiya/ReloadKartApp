/* eslint-disable no-unused-vars */
/* eslint-disable curly */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable no-shadow */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {useFocusEffect} from '@react-navigation/native';
import {decode} from 'html-entities';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

//redux
import {useDispatch} from 'react-redux';
import {incrementCount} from '../../redux/counterReducer';

//loader
import Skeleton from '../../loader/skeleton';

//components
import Banner from '../../components/Banner';
import BrandCard from '../../components/BrandCard';
import InternetConnection from '../../components/InternetConnection';
import VoucherCard from '../../components/VoucherCard';

//hook
import useInternetCheck from '../../hooks/useInternetCheck';
import useVoucherItems from '../../hooks/useVoucherItems';
import SearchFilter from '../../filterComponents/searchFilter';

//modal
import PopupImages from '../../models/PopupImages';
import usePopupImage from '../../hooks/usePopupImage';

const {height} = Dimensions.get('screen');

const CategoriesList = props => {
  const insets = useSafeAreaInsets();
  const {navigation, route} = props;
  const dispatch = useDispatch();

  const {title, item, image} = route.params;

  const flatListRef = React.useRef(null);

  const internetValue = useInternetCheck();
  const {allVoucherList} = useVoucherItems();
  const checkImage = usePopupImage();

  //Arrray STATES
  const [searchList, setSearchList] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [allSelectedData, setAllSelectedData] = useState([]);
  const [selectBrandCurrency, setSelectBrandCurrency] = useState([]);
  const [brandItemList, setBrandItemList] = useState([]);

  //Value states
  const [selectedCurrency, setSelectedCurrency] = useState('All');
  const [searchValueText, setSearchValueText] = useState('');
  const [numItem, setNumItem] = useState(10);

  //Loading states
  const [moreLoad, setMoreLoad] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [showConnection, setShowConnection] = useState(false);

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        headerTitle: decode(title),
        headerTitleStyle: {
          color: '#fff',
        },
      });
    }, [title, navigation]),
  );

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
    if (allVoucherList.length > 0) {
      if (item === 'categories') {
        const filtered = allVoucherList.filter(item =>
          item.categories.includes(title),
        );
        setSearchList(filtered);
        setAllSelectedData(filtered);
      } else {
        setSearchList(allVoucherList);
        setAllSelectedData(allVoucherList);
      }
    }
  }, [allVoucherList]);

  useEffect(() => {
    setTimeout(() => {
      setPageLoading(true);
    }, 1500);
  }, [pageLoading, searchData]);

  const onBrandItems = value => {
    setBrandItemList([...value]);
    setSelectBrandCurrency([...value]);
  };
  const onSearchItems = value => {
    setSearchData([...value]);
    setMoreLoad(false);
  };

  const onSearchValue = useCallback(value => {
    setSearchValueText(value);
  }, []);

  const handleLoadMore = () => {
    if (!moreLoad && allSelectedData.length > numItem) {
      setMoreLoad(true);
      setTimeout(() => {
        setNumItem(prev => prev + 10); // Load 10 more items
        setMoreLoad(false);
      }, 1000); // Optional delay to simulate loading
    }
  };

  useEffect(() => {
    if (searchValueText) {
      let filtered = [];
      let brandFiltered = [];
      if (selectedCurrency === 'All') return;
      else {
        filtered = allVoucherList.filter(
          item =>
            item.categories.includes(title) &&
            item.brand_currency.includes(selectedCurrency),
        );
        const searchFiltered = filtered.filter(item =>
          item.title.toLowerCase().includes(searchValueText.toLowerCase()),
        );
        setSearchData(searchFiltered);
      }
      if (route.params.item === 'categories') {
        brandFiltered = selectBrandCurrency.filter(item =>
          item.brand_currency.includes(selectedCurrency),
        );
        setBrandItemList(brandFiltered);
      }
    }
  }, [searchValueText]);

  const handleCountry = currency => {
    dispatch(incrementCount(checkImage));
    setSelectedCurrency(currency);
    let filtered = [];
    let brandFiltered = [];

    if (currency === 'All') {
      filtered = allVoucherList.filter(item => item.categories.includes(title));
      setAllSelectedData(filtered);
      if (route.params.item === 'categories') {
        setBrandItemList(selectBrandCurrency);
      }
    } else {
      filtered = allVoucherList.filter(
        item =>
          item.categories.includes(title) &&
          item.brand_currency.includes(currency),
      );
      setAllSelectedData(filtered);
      if (route.params.item === 'categories') {
        brandFiltered = selectBrandCurrency.filter(item =>
          item.brand_currency.includes(currency),
        );
        setBrandItemList(brandFiltered);
      }
    }
    if (searchValueText) {
      const searchFiltered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchValueText.toLowerCase()),
      );
      setSearchData(searchFiltered);
      if (route.params.item === 'categories') {
        const searchBrandFiltered = filtered.filter(item =>
          item.title.toLowerCase().includes(searchValueText.toLowerCase()),
        );
        setBrandItemList(searchBrandFiltered);
      }
    }
  };

  const uniqueBrands = useMemo(() => {
    const map = new Map();

    brandItemList?.forEach(item => {
      (item.brand || []).forEach(b => {
        if (!map.has(b)) {
          map.set(b, {
            brand: [b],
            image: item.image || null, // take first available image
            product_type: item.product_type,
            product_id: item.product_id,
          });
        }
      });
    });

    return [...map.values()];
  }, [brandItemList]);

  // const categoryArray = ['inr', 'usa', 'eur']

  let categoryArray = ['All'];
  if (route.params.item === 'categories') {
    searchList.forEach(product => {
      // 2. Get product currency
      const productCurrency = product.brand_currency;
      if (!categoryArray.includes(productCurrency)) {
        categoryArray.push(productCurrency);
      }
    });
  }

  const NoResult = () => (
    <View style={[styles.noListContainer]}>
      <Text style={styles.noList}>No voucher found</Text>
    </View>
  );

  return (
    <View style={[styles.container, {paddingBottom: insets.bottom}]}>
      {internetValue ? (
        <View style={styles.containerWrapper}>
          <PopupImages />
          {image ? (
            <View
              style={{width: '100%', paddingHorizontal: 8, marginBottom: 12}}>
              <View style={styles.bannerContainer}>
                <Banner image={image} />
              </View>
            </View>
          ) : null}

          <SearchFilter
            searchList={searchList}
            onSearchItems={onSearchItems}
            searchView={'category'}
            onBrandItems={onBrandItems}
            searchValueText={searchValueText}
            onSearchValue={onSearchValue}
            item={item}
          />

          {categoryArray.length > 2 && (
            <ScrollView
              contentContainerStyle={styles.scrollContainer}
              horizontal={true}
              showsHorizontalScrollIndicator={false}>
              <View style={styles.countryView}>
                {categoryArray.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleCountry(item)}
                    style={[
                      styles.countryContainer,
                      selectedCurrency === item
                        ? {backgroundColor: '#20B038'}
                        : {backgroundColor: '#252F45'},
                    ]}>
                    <Text style={styles.countryText}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          )}

          {searchValueText ? (
            <View style={styles.listContainer}>
              <View
                style={[
                  styles.listWrapper,
                  image
                    ? categoryArray.length > 2
                      ? {height: Dimensions.get('screen').height - 430}
                      : {height: Dimensions.get('screen').height - 360}
                    : categoryArray.length > 2
                    ? {
                        height: Dimensions.get('screen').height - 280,
                      }
                    : {height: Dimensions.get('screen').height - 220},
                ]}>
                <View style={styles.listContainer}>
                  {uniqueBrands.length === 0 && searchData.length === 0 ? (
                    <NoResult />
                  ) : (
                    <>
                      <FlatList
                        data={[1]}
                        keyExtractor={(item, index) => index.toString()}
                        showsVerticalScrollIndicator={false}
                        renderItem={({item, index}) => (
                          <>
                            {uniqueBrands && uniqueBrands.length > 0 ? (
                              <View
                                style={[
                                  {position: 'relative', marginBottom: 20},
                                ]}>
                                <FlatList
                                  data={uniqueBrands}
                                  keyExtractor={(item, index) =>
                                    index.toString()
                                  }
                                  showsVerticalScrollIndicator={false}
                                  renderItem={({item, index}) => (
                                    <>
                                      <BrandCard item={item} index={index} />
                                    </>
                                  )}
                                  initialNumToRender={10}
                                  maxToRenderPerBatch={10}
                                  windowSize={7}
                                />
                              </View>
                            ) : null}
                            {searchData && searchData.length > 0 ? (
                              <View
                                style={[
                                  {position: 'relative', marginBottom: 30},
                                ]}>
                                <FlatList
                                  data={searchData}
                                  keyExtractor={(item, index) =>
                                    index.toString()
                                  }
                                  showsVerticalScrollIndicator={false}
                                  renderItem={({item, index}) => (
                                    <>
                                      <VoucherCard item={item} index={index} />
                                    </>
                                  )}
                                  initialNumToRender={10}
                                  maxToRenderPerBatch={10}
                                  windowSize={7}
                                />
                              </View>
                            ) : null}
                          </>
                        )}
                      />
                    </>
                  )}
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.listContainer}>
              <View
                style={[
                  styles.listWrapper,
                  image
                    ? categoryArray.length > 2
                      ? {height: Dimensions.get('screen').height - 430}
                      : {height: Dimensions.get('screen').height - 360}
                    : categoryArray.length > 2
                    ? {
                        height: Dimensions.get('screen').height - 280,
                      }
                    : {height: Dimensions.get('screen').height - 220},
                ]}>
                {pageLoading ? (
                  <View style={[styles.listContainer]}>
                    {allSelectedData.length > 0 ? (
                      <View style={[{width: '100%'}]}>
                        <FlatList
                          ref={flatListRef}
                          data={allSelectedData.slice(0, numItem)}
                          showsVerticalScrollIndicator={false}
                          onEndReached={handleLoadMore}
                          onEndReachedThreshold={0.2}
                          renderItem={({item, index}) => (
                            <VoucherCard item={item} index={index} />
                          )}
                          keyExtractor={(item, index) => index.toString()}
                          ListFooterComponent={
                            moreLoad ? (
                              <View style={{paddingVertical: 16}}>
                                <ActivityIndicator color={'#fff'} size={25} />
                              </View>
                            ) : null
                          }
                          contentContainerStyle={{paddingBottom: 0}}
                        />
                      </View>
                    ) : (
                      <View style={styles.noListContainer}>
                        <Text style={styles.noList}>Voucher not found</Text>
                      </View>
                    )}
                  </View>
                ) : (
                  <View style={{}}>
                    <Skeleton loaderLayout={styles.loaderWrapper} />
                  </View>
                )}
              </View>
            </View>
          )}
        </View>
      ) : (
        <InternetConnection
          visible={showConnection}
          onClose={() => setShowConnection(false)}
        />
      )}
    </View>
  );
};

export default CategoriesList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#16182B',
    // backgroundColor:'red'
  },
  containerWrapper: {
    flex: 1,
    marginTop: 12,
  },
  listContainer: {
    paddingHorizontal: 8,
    marginBottom: 12,
    width: '100%',
    position: 'relative',
  },
  listWrapper: {
    position: 'relative',
    width: '100%',
    backgroundColor: '#252f45',
    paddingTop: 14,
    borderRadius: 8,
  },
  noList: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff',
    letterSpacing: 1,
  },
  noListContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'red',
  },
  loaderInnerWrapper: {
    width: '100%',
    maxWidth: 420,
    marginBottom: 10,
  },
  loaderWrapper: {
    width: '100%',
    maxWidth: 400,
    marginBottom: 10,
  },
  scrollContainer: {
    paddingHorizontal: 8,
    marginBottom: 12,
    paddingTop: 5,
  },
  countryView: {
    // backgroundColor: 'pink',
    height: 45,
    // width: '100%',
    // backgroundColor: '#252f45',
    borderRadius: 8,
    flexDirection: 'row',
  },
  countryContainer: {
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
    height: '100%',
    marginHorizontal: 5,
    padding: 6,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
  },
  countryText: {
    fontWeight: '500',
    color: '#fff',
  },
});
