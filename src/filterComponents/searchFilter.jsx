/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable curly */
/* eslint-disable react-hooks/exhaustive-deps */
import {Feather} from '@react-native-vector-icons/feather';
import {AntDesign} from '@react-native-vector-icons/ant-design';
import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useState} from 'react';
import {Pressable, StyleSheet, TextInput, View} from 'react-native';

const SearchFilter = ({
  onSearchItems,
  searchList,
  onSearchValue,
  searchValueText,
  onBrandItems,
  item,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const placeholderText = React.useMemo(() => {
    if (item === 'brands') return 'Search by voucher';
    if (item === 'vouchers' || item === 'categories')
      return 'Search by voucher or brand name';
    return 'Search by topup';
  }, [item]);

  const handleSearch = useCallback(
    text => {
      setSearchQuery(text);
      onSearchValue(text);

      if (!text) {
        onSearchItems(searchList);
        onBrandItems([]);
        return;
      }

      const lowerText = text.toLowerCase();

      // Product search
      const productResult = searchList.filter(v =>
        v.title.toLowerCase().includes(lowerText),
      );

      // Brand search (deduped)
      const brandResult =
        item === 'brands' || item === 'topup'
          ? []
          : Array.from(
              new Map(
                searchList
                  .filter(v =>
                    v.brand.some(b => b.toLowerCase().includes(lowerText)),
                  )
                  .map(v => [v.brand.join(','), v]),
              ).values(),
            );

      onBrandItems(brandResult);
      onSearchItems(productResult);
    },
    [searchList, item],
  );

  const handleClear = () => {
    setSearchQuery('');
    onSearchValue('');
    onSearchItems(searchList);
    onBrandItems([]);
  };

  return (
    <View style={styles.serachContainer}>
      <View style={styles.searchWrapper}>
        <View style={styles.searchIconCSS}>
          <Feather name="search" color={'gray'} size={22} />
        </View>
        <View>
          <TextInput
            value={searchQuery}
            style={styles.searchInput}
            onChangeText={text => {
              handleSearch(text);
              setSearchQuery(text);
              //onSearchValue(text);
            }}
            placeholder={placeholderText}
            placeholderTextColor={'gray'}
          />
        </View>
        {searchQuery ? (
          <View style={styles.closeSearchContainer}>
            <Pressable
              style={styles.closeSearch}
              onPress={() => {
                handleClear();
              }}>
              <AntDesign name="close-circle" color={'gray'} size={22} />
            </Pressable>
          </View>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  serachContainer: {
    width: '100%',
    paddingHorizontal: 8,
    paddingBottom: 10,
    position: 'relative',
  },
  searchWrapper: {
    width: '100%',
    position: 'relative',
    backgroundColor: '#fff',
    borderRadius: 40,
    overflow: 'hidden',
    marginTop: 2,
  },
  searchInput: {
    backgroundColor: '#303b53ff',
    width: '100%',
    paddingLeft: 40,
    paddingRight: 4,
    paddingVertical: 10,
    color: '#fff',
    fontSize: 16,
  },
  searchIconCSS: {
    position: 'absolute',
    zIndex: 9,
    left: 12,
    top: 8,
  },
  closeSearchContainer: {
    position: 'absolute',
    right: 4,
    top: 0.5,
  },
  closeSearch: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SearchFilter;
