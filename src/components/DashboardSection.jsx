/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useEffect, useState} from 'react';
import {Dimensions, FlatList, StyleSheet, Text, View} from 'react-native';
// COMPONENTS
import BannerSlider from './BannerSlider';
import TabSection from './TabSection';
import TabViews from './TabViews';
import VoucherCard from './VoucherCard';
import BrandCard from './BrandCard';
// FILTER
import SearchFilter from '../filterComponents/searchFilter';
// CUSTOM HOOKS
import useVoucherItems from '../hooks/useVoucherItems';

const {height} = Dimensions.get('screen');

const DashboardSection = () => {
  const {allVoucherList} = useVoucherItems();

  const flatListRef = React.useRef(null);

  const [searchList, setSearchList] = useState([]);
  const [searchValueText, setSearchValueText] = useState('');
  const [brandItemList, setBrandItemList] = useState('');

  const onBrandItems = value => {
    setBrandItemList([...value]);
  };

  const onSearchItems = value => {
    setSearchList([...value]);
  };

  const onSearchValue = value => {
    setSearchValueText(value);
  };

  return (
    <>
      <View style={{flex: 1, position: 'relative'}}>
        <FlatList
          data={[1]}
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={false}
          renderItem={({item, index}) => (
            <View style={{width: '100%', height: '100%'}}>
              <View
                style={{
                  width: '100%',
                  paddingVertical: 10,
                }}>
                <BannerSlider />
              </View>
              <SearchFilter
                searchList={allVoucherList}
                onSearchItems={onSearchItems}
                onBrandItems={onBrandItems}
                searchView={'home'}
                onSearchValue={onSearchValue}
                item={'vouchers'}
              />
              {searchValueText ? (
                <View
                  style={{
                    width: '100%',
                    paddingBottom: 10,
                    paddingHorizontal: 8,
                  }}>
                  <View style={styles.collectionContainer}>
                    <View style={{paddingHorizontal: 8, paddingVertical: 10}}>
                      {brandItemList.length >= 0 ? (
                        <View style={styles.mainView}>
                          <View style={{width: '100%', maxWidth: '100%'}}>
                            <View style={styles.listContainer}>
                              {brandItemList.length > 0 ? (
                                <View>
                                  <FlatList
                                    ref={flatListRef}
                                    data={brandItemList}
                                    showsVerticalScrollIndicator={false}
                                    renderItem={({item, index}) => (
                                      <BrandCard item={item} index={index} />
                                    )}
                                    keyExtractor={(item, index) =>
                                      index.toString()
                                    }
                                  />
                                </View>
                              ) : null}
                            </View>
                          </View>
                        </View>
                      ) : null}
                      {searchList.length >= 0 ? (
                        <View style={styles.mainView}>
                          <View style={{width: '100%', maxWidth: '100%'}}>
                            <View style={styles.listContainer}>
                              {searchList.length > 0 ? (
                                <View>
                                  <FlatList
                                    ref={flatListRef}
                                    data={searchList}
                                    showsVerticalScrollIndicator={false}
                                    renderItem={({item, index}) => (
                                      <VoucherCard item={item} index={index} />
                                    )}
                                    keyExtractor={(item, index) =>
                                      index.toString()
                                    }
                                  />
                                </View>
                              ) : (
                                <View
                                  style={{
                                    width: '100%',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                  }}>
                                  <Text
                                    style={{
                                      fontSize: 16,
                                      fontWeight: 'bold',
                                      textAlign: 'center',
                                      color: '#fff',
                                      letterSpacing: 1,
                                    }}>
                                    Voucher not found
                                  </Text>
                                </View>
                              )}
                            </View>
                          </View>
                        </View>
                      ) : null}
                    </View>
                  </View>
                </View>
              ) : (
                <>
                  <View
                    style={{
                      width: '100%',
                      paddingBottom: 10,
                      paddingHorizontal: 8,
                    }}>
                    <TabSection />
                  </View>
                </>
              )}
              <View
                style={{
                  width: '100%',
                  paddingBottom: 20,
                  paddingHorizontal: 8,
                  display: searchValueText ? 'none' : 'block',
                }}>
                <View
                  style={[
                    styles.collectionContainer,
                    {
                      position: 'relative',
                      overflow: 'hidden',
                      height: height / 1.5,
                    },
                  ]}>
                  <TabViews />
                </View>
              </View>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    </>
  );
};

export default DashboardSection;

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    maxWidth: '100%',
    marginTop: 5,
  },
  scrollView: {
    flex: 1,
  },
  button: {
    width: 45,
    height: 45,
    borderRadius: 40,
    elevation: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    width: '100%',
    maxWidth: '100%',
    position: 'relative',
  },
  animatedDrawer: {
    width: '100%',
    height: '100%',
    position: 'absolute',
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
  loadMoreContainer: {
    width: '100%',
    height: 300,
    position: 'absolute',
    bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 100,
  },
  collectionContainer: {
    flex: 1,
    borderRadius: 8,
    backgroundColor: '#252F45',
  },
  allViewButton: {
    width: '100%',
    marginBottom: 10,
  },
});
