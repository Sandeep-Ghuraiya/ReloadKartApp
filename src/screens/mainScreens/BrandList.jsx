/* eslint-disable curly */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useSelector} from 'react-redux';

import BrandItemGrid from '../../components/BrandItemGrid';
import InternetConnection from '../../components/InternetConnection';
import SectionListComponent from '../../components/SectionListComponent';
import BrandSearchFilter from '../../filterComponents/brandSearchFilter';
import useInternetCheck from '../../hooks/useInternetCheck';
import BrandSkeleton from '../../loader/brandSkeleton';
import PopupImages from '../../models/PopupImages';
import useVoucherItems from '../../hooks/useVoucherItems';

const BrandList = ({navigation, route}) => {
  const {brandList} = useSelector(state => state.vouchers);
  const {allVoucherList} = useVoucherItems();
  const {dataName, title} = route.params;

  const insets = useSafeAreaInsets();
  const flatListRef = useRef(null);
  const internetValue = useInternetCheck();

  const [searchText, setSearchText] = useState('');
  const [pageLoading, setPageLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showConnection, setShowConnection] = useState(false);

  /* ---------------- MEMOIZED DATA ---------------- */

  const {voucherBrands, giftCards} = useMemo(() => {
    const voucher = [];
    const gift = [];

    brandList?.data?.forEach(item => {
      if (item.type !== 'voucher') return;

      // check if brand exists in allVoucherList
      const exists = allVoucherList.some(voucherItem =>
        voucherItem?.brand?.includes(item.name),
      );

      if (!exists) return;

      item.gaming_category ? voucher.push(item) : gift.push(item);
    });

    return {voucherBrands: voucher, giftCards: gift};
  }, [brandList, allVoucherList]);

  const dataList = useMemo(() => {
    return dataName === 'giftCard' ? giftCards : voucherBrands;
  }, [dataName, giftCards, voucherBrands]);

  const filteredData = useMemo(() => {
    if (!searchText.trim()) return [];
    return dataList.filter(item =>
      item.name.toLowerCase().includes(searchText.toLowerCase()),
    );
  }, [searchText, dataList]);

  /* ---------------- EFFECTS ---------------- */

  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (searchText) {
      const timer = setTimeout(() => {
        setSearchLoading(false);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [searchText]);

  useFocusEffect(
    useCallback(() => {
      setShowConnection(!internetValue);
    }, [internetValue]),
  );

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        headerTitle: title,
        headerTitleStyle: {color: '#fff'},
      });
    }, [title]),
  );

  /* ---------------- RENDER ITEM ---------------- */

  const renderItem = useCallback(({item, index}) => {
    return <BrandItemGrid item={item} index={index} title="Brand" />;
  }, []);

  const keyExtractor = useCallback((_, index) => index.toString(), []);

  /* ---------------- UI ---------------- */

  return (
    <View style={[styles.container, {paddingBottom: insets.bottom}]}>
      {internetValue ? (
        <View style={styles.innerContainer}>
          <PopupImages />

          <BrandSearchFilter
            value={searchText}
            onChangeText={text => {
              setSearchLoading(true);
              setSearchText(text);
            }}
          />

          {/* 🔍 SEARCH MODE */}
          {searchText ? (
            <View style={styles.listContainer}>
              {searchLoading ? (
                <BrandSkeleton />
              ) : filteredData.length > 0 ? (
                <FlatList
                  ref={flatListRef}
                  data={filteredData}
                  numColumns={3}
                  renderItem={renderItem}
                  keyExtractor={keyExtractor}
                  showsVerticalScrollIndicator={false}
                />
              ) : (
                <View style={styles.noListContainer}>
                  <Text style={styles.noList}>Brand not found</Text>
                </View>
              )}
            </View>
          ) : (
            /* 📦 NORMAL LIST */
            <View style={styles.listContainer}>
              {pageLoading ? (
                dataList.length > 0 ? (
                  <SectionListComponent
                    data={dataList}
                    indexLetter={styles.indexLetter}
                    title="Brand"
                    alpha_height={true}
                  />
                ) : (
                  <View style={styles.noListContainer}>
                    <Text style={styles.noList}>Brand not found</Text>
                  </View>
                )
              ) : (
                <BrandSkeleton />
              )}
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

export default BrandList;

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 10,
    backgroundColor: '#16182B',
  },
  innerContainer: {
    width: '100%',
  },
  listContainer: {
    paddingHorizontal: 8,
    marginBottom: 12,
  },
  noListContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  noList: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  indexLetter: {
    fontSize: 12,
    paddingVertical: 3,
    paddingHorizontal: 8,
    color: '#20B038',
    fontWeight: '600',
    textAlign: 'center',
  },
});
