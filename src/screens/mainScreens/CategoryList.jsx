/* eslint-disable no-unused-vars */
/* eslint-disable curly */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
//Components
import BrandItemGrid from '../../components/BrandItemGrid';
import InternetConnection from '../../components/InternetConnection';
//Hooks
import useInternetCheck from '../../hooks/useInternetCheck';
//Filter Components
import CategorySearchFilter from '../../filterComponents/categorySearchFilter';
//Loader
import BrandSkeleton from '../../loader/brandSkeleton';
//Models
import PopupImages from '../../models/PopupImages';

const CategoryList = props => {
  const {categoryList} = useSelector(state => state.vouchers);

  const categoryData = categoryList?.data || [];

  const {route, navigation} = props;
  const insets = useSafeAreaInsets();

  const flatListRef = React.useRef(null);

  const internetValue = useInternetCheck();

  // const [numItem, setNumItem] = useState(10);
  const [searchBrandData, setSearchBrandData] = useState('');
  //Boollean State
  const [pageLoading, setPageLoading] = useState(false);
  const [showConnection, setShowConnection] = useState(false);
  const [searchLoader, setSearchLoader] = useState(false);

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
    const timer = setTimeout(() => {
      setPageLoading(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // useEffect(() => {
  //   const getCategoryData = async () => {
  //     if (categoryList?.data) {
  //       setCategoryData(categoryList.data);
  //     }
  //   };
  //   getCategoryData();
  // }, [categoryList]);

  const searchData = React.useMemo(() => {
    if (searchBrandData.trim() === '') return [];

    return categoryData.filter(item =>
      item.name.toLowerCase().includes(searchBrandData.toLowerCase()),
    );
  }, [searchBrandData, categoryData]);

  useEffect(() => {
    if (!searchBrandData) return;

    const timer = setTimeout(() => {
      setSearchLoader(false);
    }, 8000);

    return () => clearTimeout(timer);
  }, [searchBrandData]);

  const handleSearch = useCallback(text => {
    setSearchLoader(true);
    setSearchBrandData(text);
  }, []);

  return (
    <View style={[styles.container, {paddingBottom: insets.bottom}]}>
      {internetValue ? (
        <View style={styles.innerContainer}>
          <PopupImages />
          <CategorySearchFilter
            value={searchBrandData}
            onChangeText={text => {
              handleSearch(text);
            }}
          />

          {searchBrandData ? (
            <View style={styles.listContainer}>
              <View style={styles.listWrapper}>
                <View style={styles.listContainer}>
                  {searchLoader ? (
                    <View
                      style={{
                        flex: 1,
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        width: '100%',
                        maxWidth: '100%',
                        marginTop: 20,
                      }}>
                      <BrandSkeleton loaderLayout={styles.loaderWrapper} />
                    </View>
                  ) : searchData.length > 0 ? (
                    <View
                      style={{
                        width: '100%',
                      }}>
                      <FlatList
                        ref={flatListRef}
                        data={searchData}
                        showsVerticalScrollIndicator={false}
                        numColumns={3}
                        nestedScrollEnabled={true}
                        renderItem={({item, index}) => (
                          <BrandItemGrid
                            item={item}
                            index={index}
                            title={'Category'}
                          />
                        )}
                        keyExtractor={(item, index) => index.toString()}
                      />
                    </View>
                  ) : (
                    <View style={styles.noListContainer}>
                      <Text style={styles.noList}>Category not found</Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.listContainer}>
              <View style={styles.listWrapper}>
                {pageLoading ? (
                  // categoryLoading ? (
                  <View style={styles.listContainer}>
                    {categoryData.length > 0 ? (
                      <View
                        style={{
                          width: '100%',
                        }}>
                        <FlatList
                          ref={flatListRef}
                          data={categoryData}
                          showsVerticalScrollIndicator={false}
                          nestedScrollEnabled={true}
                          numColumns={3}
                          renderItem={({item, index}) => (
                            <BrandItemGrid
                              item={item}
                              index={index}
                              title={'Category'}
                            />
                          )}
                          keyExtractor={(item, index) => index.toString()}
                        />
                      </View>
                    ) : (
                      <View style={styles.noListContainer}>
                        <Text style={styles.noList}>Category not found</Text>
                      </View>
                    )}
                  </View>
                ) : (
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                      width: '100%',
                      maxWidth: '100%',
                      marginTop: 20,
                      // paddingHorizontal: 14,
                    }}>
                    <BrandSkeleton loaderLayout={styles.loaderWrapper} />
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

export default CategoryList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 10,
    borderRadius: 0,
    backgroundColor: '#16182B',
  },
  innerContainer: {
    width: '100%',
  },
  listContainer: {
    paddingHorizontal: 8,
    marginBottom: 12,
    width: '100%',
  },
  listWrapper: {
    width: '100%',
    height: '95%',
    backgroundColor: '#252F45',
    paddingVertical: 14,
    borderRadius: 8,
  },
  noListContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noList: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff',
    letterSpacing: 1,
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
});
