/* eslint-disable prettier/prettier */
/* eslint-disable no-shadow */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/no-unstable-nested-components */
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {Fragment, useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  LayoutAnimation,
  LogBox,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import usePopupImage from '../hooks/usePopupImage';
import {brandListData, categoryListData} from '../redux/voucherReducer';
import RenderHtml from 'react-native-render-html';
import {incrementCount} from '../redux/counterReducer';
import {useDispatch, useSelector} from 'react-redux';

const {width} = Dimensions.get('screen');

const TabSection = () => {
  LogBox.ignoreLogs([
    'Support for defaultProps will be removed from function components',
  ]);
  const {brandList, categoryList} = useSelector(state => state.vouchers);

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const checkImage = usePopupImage();

  const [tabText, setTabText] = useState('category');
  const [categoryData, setCategoryData] = useState([]);
  const [brandData, setBrandData] = useState([]);
  const [giftCardData, setGiftCardData] = useState([]);
  const [buttonLoader, setButtonLoader] = useState(false);

  const getFirstLetters = text => {
    return text
      .replace(/[^a-zA-Z0-9\s]/g, '') // Remove any characters that are not letters or numbers
      .split(' ') // Split the string into words
      .map(word => word.charAt(0).toUpperCase()) // Get the first letter of each valid word
      .join(''); // Join the letters together without spaces
  };

  useEffect(() => {
    const getBrandandCategoryData = async () => {
      if (brandList?.data) {
        const voucherBrands = [];
        const giftCards = [];

        brandList.data.forEach(item => {
          if (item.type === 'voucher') {
            if (item.gaming_category === true) {
              voucherBrands.push(item); // Add to voucherBrands array
            } else {
              giftCards.push(item); // Add to giftCards array
            }
          }
        });

        // Set both arrays once after processing all items
        setBrandData(voucherBrands);
        setGiftCardData(giftCards);
      } else {
        const brandValue = await AsyncStorage.getItem('brand_items');

        if (brandValue) {
          const parsedBrand = JSON.parse(brandValue);
          const voucherBrands = [];
          const giftCards = [];

          parsedBrand.forEach(item => {
            if (item.type === 'voucher') {
              if (item.gaming_category === true) {
                voucherBrands.push(item); // Add to voucherBrands array
              } else {
                giftCards.push(item); // Add to giftCards array
              }
            }
          });

          // Set both arrays once after processing all items
          setBrandData(voucherBrands);
          setGiftCardData(giftCards);
        }
      }

      if (categoryList?.data) {
        setCategoryData(categoryList.data);
      } else {
        const categoryValue = await AsyncStorage.getItem('category_items');
        if (categoryValue) {
          const parsedCategory = JSON.parse(categoryValue);
          setCategoryData(parsedCategory);
        }
      }
    };
    getBrandandCategoryData();
  }, [brandList, categoryList]);

  const handleViewAll = () => {
    setButtonLoader(true);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    dispatch(incrementCount(checkImage));
    if (tabText === 'category') {
      const categoryPayload = JSON.stringify({action: 'categories'});
      dispatch(categoryListData(categoryPayload));

      setTimeout(() => {
        setButtonLoader(false);
        navigation.navigate('CategoryList', {
          categoryList: JSON.stringify(categoryData),
        });
      }, 1500);
    } else if (tabText === 'brand') {
      const brandPayload = JSON.stringify({action: 'brands'});
      dispatch(brandListData(brandPayload));
      setTimeout(() => {
        setButtonLoader(false);
        navigation.navigate('BrandList', {
          brandList: JSON.stringify(brandData),
          dataName: 'vouchers',
          title: 'Gaming Voucher',
        });
      }, 1500);
    } else {
      const brandPayload = JSON.stringify({action: 'brands'});
      dispatch(brandListData(brandPayload));
      setTimeout(() => {
        setButtonLoader(false);
        navigation.navigate('BrandList', {
          brandList: JSON.stringify(giftCardData),
          dataName: 'giftCard',
          title: 'Gift Card',
        });
      }, 1500);
    }
  };

  const tagsStyles = {
    div: {
      fontSize: 12,
      color: '#fff',
      textAlign: 'center',
      textTransform: 'capitalize',
    },
  };

  const HtmlTitle = ({name}) => {
    const source = useMemo(
      () => ({
        html: `<div>${name}</div>`,
      }),
      [name],
    );

    return (
      <RenderHtml
        contentWidth={width}
        source={source}
        tagsStyles={tagsStyles}
      />
    );
  };

  const renderCategoryItem = (item, index) => {
    const firstLetters = getFirstLetters(item.name);

    return (
      <View
        style={styles.categoryItemWrapper}
        key={`category-${item.name}-${index}`}>
        <TouchableOpacity
          style={styles.touchableOpacity}
          onPress={() => {
            dispatch(incrementCount(checkImage));
            navigation.navigate('CategoriesList', {
              title: item.name,
              slug: '',
              item: 'categories',
              image: item.image,
              name: 'Categories',
            });
          }}>
          <View style={styles.imageWrapper}>
            {item.image ? (
              <Image
                source={{uri: item.image}}
                style={styles.image}
                resizeMode="cover"
              />
            ) : (
              <Text style={styles.letterText}>{firstLetters}</Text>
            )}
          </View>

          {/* <HtmlTitle name={item.name} /> */}
        </TouchableOpacity>
      </View>
    );
  };

  const renderBrandItem = (item, index) => {
    const firstLetters = getFirstLetters(item.name);
    return (
      <Fragment key={`brand-${item.name}-${index}`}>
        {item.is_featured && (
          <View style={styles.brandItemWrapper}>
            <TouchableOpacity
              style={styles.touchableOpacity}
              onPress={() => {
                dispatch(incrementCount(checkImage));
                navigation.navigate('BrandInfo', {
                  title: item.name,
                  slug: '',
                  item: 'brands',
                  image: item.image,
                  name: 'Categories',
                });
              }}>
              <View style={styles.imageWrapper}>
                {item.image ? (
                  <Image
                    source={{uri: item.image}}
                    style={styles.image}
                    resizeMode="cover"
                  />
                ) : (
                  <Text style={styles.letterText}>{firstLetters}</Text>
                )}
              </View>

              {/* <HtmlTitle name={item.name} /> */}
            </TouchableOpacity>
          </View>
        )}
      </Fragment>
    );
  };

  const renderGiftCardItem = (item, index) => {
    const firstLetters = getFirstLetters(item.name);
    return (
      <Fragment key={`gift-${item.name}-${index}`}>
        {item.is_featured && (
          <View style={styles.brandItemWrapper}>
            <TouchableOpacity
              style={styles.touchableOpacity}
              onPress={() => {
                dispatch(incrementCount(checkImage));
                navigation.navigate('BrandInfo', {
                  title: item.name,
                  slug: '',
                  item: 'brands',
                  image: item.image,
                  name: 'Categories',
                });
              }}>
              <View style={styles.imageWrapper}>
                {item.image ? (
                  <Image
                    source={{uri: item.image}}
                    style={styles.image}
                    resizeMode="cover"
                  />
                ) : (
                  <Text style={styles.letterText}>{firstLetters}</Text>
                )}
              </View>

              {/* <HtmlTitle name={item.name} /> */}
            </TouchableOpacity>
          </View>
        )}
      </Fragment>
    );
  };

  const renderItems = () => {
    if (tabText === 'category') {
      return categoryData.slice(0, 8).map(renderCategoryItem);
    } else if (tabText === 'brand') {
      return brandData.map(renderBrandItem);
    } else {
      return giftCardData.map(renderGiftCardItem);
    }
  };

  const handleTab = tabText => {
    if (tabText === 'topup') {
      const brandPayload = JSON.stringify({action: 'brands'});
      dispatch(brandListData(brandPayload));
      navigation.navigate('TopupList');
    } else {
      setTabText(tabText);
    }
    dispatch(incrementCount(checkImage));
  };

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <View style={styles.tabButtonWrapper}>
          <TabButton
            key="category"
            title="Categories"
            isActive={tabText === 'category'}
            onPress={() => handleTab('category')}
          />
          <TabButton
            key="giftCard"
            title="Gift Card"
            isActive={tabText === 'giftCard'}
            onPress={() => handleTab('giftCard')}
          />
          <TabButton
            key="brand"
            title="Vouchers"
            isActive={tabText === 'brand'}
            onPress={() => handleTab('brand')}
          />
          <TabButton
            key="topup"
            title="Direct Top-up"
            isActive={tabText === 'topup'}
            onPress={() => handleTab('topup')}
          />
        </View>

        <View style={styles.tabItemGrid}>{renderItems()}</View>

        {((tabText === 'category' && categoryData.length > 8) ||
          (tabText === 'giftCard' && giftCardData.length > 0) ||
          (tabText === 'brand' && brandData.length > 0)) && (
          <View style={styles.viewAllWrapper}>
            <TouchableOpacity
              style={styles.viewAllButton}
              onPress={() => handleViewAll()}
              disabled={buttonLoader}>
              {buttonLoader ? (
                <ActivityIndicator size={16} color={'#fff'} />
              ) : (
                <Text style={styles.viewAllText}>Show More</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const TabButton = ({title, isActive, onPress}) => (
  <TouchableOpacity style={styles.tabButton} onPress={onPress}>
    <Text style={[styles.headingTitle, isActive && styles.activeHeading]}>
      {title}
    </Text>
  </TouchableOpacity>
);

export default TabSection;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#252f45',
  },
  innerContainer: {
    width: '100%',
  },
  tabButtonWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 12,
  },
  tabItemGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
    columnGap: 4,
  },
  tabButton: {
    marginRight: 10,
    paddingHorizontal: 5,
  },
  headingTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    lineHeight: 25,
  },
  activeHeading: {
    color: '#20B038',
    borderBottomWidth: 3,
    borderBottomColor: '#20B038',
  },
  categoryItemWrapper: {
    width: '24%',
    marginBottom: 15,
  },
  brandItemWrapper: {
    width: '24%',
    marginBottom: 15,
  },
  touchableOpacity: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    rowGap: 8,
  },
  imageWrapper: {
    width: 35,
    height: 35,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 100,
    backgroundColor: '#fff',
  },
  brandImage: {
    borderRadius: 100,
    width: 30,
    height: 30,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  itemTitle: {
    fontSize: 12,
    color: '#fff',
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  brandTitle: {
    marginTop: 5,
  },
  viewAllWrapper: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingVertical: 10,
  },
  viewAllButton: {
    borderRadius: 8,
    paddingHorizontal: 5,
    paddingVertical: 8,
    width: 100,
    backgroundColor: '#20B038',
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#fff',
    textAlign: 'center',
    lineHeight: 16,
    // borderBottomWidth: 1,
    // borderBottomColor: '#fff',
  },
  letterText: {
    color: '#000',
    fontSize: 10,
    textAlign: 'center',
    fontWeight: '600',
  },
});
