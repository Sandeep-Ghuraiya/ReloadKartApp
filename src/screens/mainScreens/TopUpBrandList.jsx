/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import {useFocusEffect} from '@react-navigation/native';
import {decode} from 'html-entities';
import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
//Components
import Banner from '../../components/Banner';
import BrandCard from '../../components/BrandCard';
import InternetConnection from '../../components/InternetConnection';
import VoucherCard from '../../components/VoucherCard';
//Hooks
import useInternetCheck from '../../hooks/useInternetCheck';
import useTopupItems from '../../hooks/useTopupItems';
//Models
import PopupImages from '../../models/PopupImages';
//Filters
import SearchFilter from '../../filterComponents/searchFilter';
//Loader
import Skeleton from '../../loader/skeleton';

const TopupBrandList = props => {
  const {navigation, route} = props;
  const insets = useSafeAreaInsets();

  const {allTopupList} = useTopupItems();
  const {brandName, image, item} = route.params;

  const flatListRef = React.useRef(null);

  const internetValue = useInternetCheck();

  const [topupList, setTopupList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchList, setSearchList] = useState([]);
  const [searchValueText, setSearchValueText] = useState('');
  const [moreLoad, setMoreLoad] = useState(false);
  const [numItem, setNumItem] = useState(10);
  const [searchData, setSearchData] = useState([]);
  const [brandItemList, setBrandItemList] = useState('');
  const [pageLoading, setPageLoading] = useState(false);
  const [countryData, setCountryData] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [showConnection, setShowConnection] = useState(false);

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        headerTitle: decode(brandName),
        headerTitleStyle: {
          color: '#fff',
        },
      });
    }, [brandName, navigation]),
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
    setTimeout(() => {
      setPageLoading(true);
    }, 1500);
  }, [pageLoading, searchData]);

  useEffect(() => {
    if (allTopupList && allTopupList.length > 0) {
      const filtered = allTopupList.filter(item =>
        item.brand.includes(brandName),
      );
      setTopupList(filtered);
      const sortedProducts = filtered.sort((a, b) => {
        return parseFloat(a.min_face) - parseFloat(b.min_face);
      });
      setCountryData(sortedProducts);
    }
  }, [allTopupList]);

  let brandArray = ['All'];

  // Loop through the products
  searchList.forEach(product => {
    const lastBrand = product.brand[product.brand.length - 1]; // Get the last brand in the array

    // If the brand is not already in the brandArray, add it
    if (!brandArray.includes(lastBrand)) {
      brandArray.push(lastBrand);
    }
  });

  const onBrandItems = value => {
    setBrandItemList([...value]);
  };

  const onSearchItems = value => {
    setSearchData([...value]);
    setMoreLoad(false);
  };

  const onSearchValue = value => {
    setSearchValueText(value);
  };

  const handleLoadMore = () => {
    if (!moreLoad && topupList.length > numItem) {
      setMoreLoad(true);
      setTimeout(() => {
        setNumItem(prev => prev + 10); // Load 10 more items
        setMoreLoad(false);
      }, 1000); // Optional delay to simulate loading
    }
  };

  const handleCountry = country => {
    setSelectedCountry(country);
    if (country === 'All') {
      const filtered = allTopupList.filter(item =>
        item.brand.includes(brandName),
      );
      setCountryData(filtered);
    } else {
      const filtered = allTopupList.filter(item =>
        item.brand.includes(country),
      );
      setCountryData(filtered);
      if (searchValueText) {
        const searchFiltered = allTopupList.filter(
          item =>
            item.brand.includes(country) &&
            item.title.toLowerCase().includes(searchValueText.toLowerCase()),
        );
        setSearchData(searchFiltered);
      }
    }
  };

  return (
    <View style={[styles.container, {paddingBottom: insets.bottom}]}>
      <StatusBar animated={true} backgroundColor="#252f45" />
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
            searchList={countryData}
            onSearchItems={onSearchItems}
            searchView={'category'}
            onBrandItems={onBrandItems}
            searchValueText={searchValueText}
            onSearchValue={onSearchValue}
            item={item}
          />

          {brandArray.length > 2 && (
            <ScrollView
              contentContainerStyle={styles.scrollContainer}
              horizontal={true}
              showsHorizontalScrollIndicator={false}>
              <View style={styles.countryView}>
                {brandArray.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleCountry(item)}
                    style={[
                      styles.countryContainer,
                      selectedCountry === item
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
                    ? brandArray.length > 2
                      ? {height: Dimensions.get('screen').height - 430}
                      : {height: Dimensions.get('screen').height - 360}
                    : brandArray.length > 2
                    ? {
                        height: Dimensions.get('screen').height - 280,
                      }
                    : {height: Dimensions.get('screen').height - 220},
                ]}>
                <View style={styles.listContainer}>
                  <ScrollView showsVerticalScrollIndicator={false}>
                    {brandItemList &&
                      brandItemList.length > 0 &&
                      brandItemList.map((item, index) => (
                        <BrandCard item={item} index={index} key={index} />
                      ))}
                    {searchData && searchData.length > 0 ? (
                      searchData.map((item, index) => (
                        <VoucherCard item={item} index={index} key={index} />
                      ))
                    ) : (
                      <View style={styles.noListContainer}>
                        <Text style={styles.noList}>Voucher not found</Text>
                      </View>
                    )}
                  </ScrollView>
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.listContainer}>
              <View
                style={[
                  styles.listWrapper,
                  image
                    ? brandArray.length > 2
                      ? {height: Dimensions.get('screen').height - 430}
                      : {height: Dimensions.get('screen').height - 360}
                    : brandArray.length > 2
                    ? {
                        height: Dimensions.get('screen').height - 280,
                      }
                    : {height: Dimensions.get('screen').height - 220},
                ]}>
                {pageLoading ? (
                  <View style={{paddingHorizontal: 8, marginBottom: 12}}>
                    {countryData.length > 0 ? (
                      <View style={[{width: '100%'}]}>
                        <FlatList
                          ref={flatListRef}
                          data={countryData.slice(0, numItem)}
                          showsVerticalScrollIndicator={false}
                          onEndReached={handleLoadMore}
                          onEndReachedThreshold={0.1}
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

export default TopupBrandList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#16182B',
  },
  containerWrapper: {
    flex: 1,
    marginTop: 12,
  },
  listContainer: {
    paddingHorizontal: 8,
    marginBottom: 12,
    width: '100%',
  },
  listWrapper: {
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
  },
  countryText: {
    fontWeight: '500',
    color: '#fff',
  },
});
