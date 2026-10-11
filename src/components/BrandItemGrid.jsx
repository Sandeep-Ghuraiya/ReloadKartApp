/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import React from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import RenderHTML from 'react-native-render-html';
import {incrementCount} from '../redux/counterReducer';
import {useDispatch} from 'react-redux';
import usePopupImage from '../hooks/usePopupImage';

const {width} = Dimensions.get('screen');

const BrandItemGrid = ({item, index, title}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const checkImage = usePopupImage();

  const getFirstLetters = text => {
    return text
      .replace(/[^a-zA-Z0-9\s]/g, '') // Remove any characters that are not letters or numbers
      .split(' ') // Split the string into words
      .map(word => word.charAt(0).toUpperCase()) // Get the first letter of each valid word
      .join(''); // Join the letters together without spaces
  };

  const firstLetters = getFirstLetters(item.name);

  const htmlSource = React.useMemo(
    () => ({
      html: `<div>${item.name}</div>`,
    }),
    [item.name],
  );

  // 🔧 2. Memoize tagsStyles
  const tagsStyles = React.useMemo(
    () => ({
      div: styles.itemTitle,
    }),
    [],
  );

  return (
    <View style={styles.tabItemGrid} key={index}>
      <View style={styles.brandItemWrapper}>
        <TouchableOpacity
          style={styles.touchableOpacity}
          onPress={() => {
            dispatch(incrementCount(checkImage));
            if (title === 'Category') {
              navigation.navigate('CategoriesList', {
                title: item.name,
                slug: '',
                item: 'categories',
                image: item.image,
                name: 'Categories',
              });
            } else if (title === 'Brand') {
              navigation.navigate('BrandInfo', {
                title: item.name,
                slug: '',
                item: 'brands',
                image: item.image,
                name: 'Categories',
              });
            } else if (title === 'Topup') {
              navigation.navigate('TopupBrandList', {
                brandName: item.name,
                image: item.image,
                item: 'topup',
              });
            }
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

          <View>
            <RenderHTML
              contentWidth={width}
              source={htmlSource}
              tagsStyles={tagsStyles}
            />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default BrandItemGrid;

const styles = StyleSheet.create({
  tabItemGrid: {
    //flex: 1,
    width: '32%',
    paddingVertical: 6,
  },
  brandItemWrapper: {
    flex: 1,
    paddingHorizontal: 2,
  },
  touchableOpacity: {
    alignItems: 'center',
  },
  imageWrapper: {
    width: 50,
    height: 50,
    paddingVertical: 2,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 5,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  itemTitle: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    textTransform: 'capitalize',
    marginTop: 5,
  },
  letterText: {
    color: '#000',
    fontSize: 10,
    textAlign: 'center',
    fontWeight: '600',
  },
});
