/* eslint-disable prettier/prettier */
import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

const BrandCard = ({item, index}) => {
  const {id, image, brand, product_type} = item;

  const navigation = useNavigation();

  const handlePress = brandName => {
    if (product_type === 'voucher') {
      navigation.navigate('BrandInfo', {
        title: brandName,
        slug: '',
        item: 'brands',
        image: image,
        name: 'Categories',
      });
    } else if (product_type === 'topup') {
      navigation.navigate('TopupList', {
        title: brandName,
        slug: '',
        item: 'topup',
        image: image,
        name: 'Topup',
      });
    }
  };

  return (
    <View style={styles.voucherListWrapper} key={item.product_id}>
      {brand.map((brandName, index) => (
        <TouchableOpacity
          onPress={() => handlePress(brandName)}
          key={index}
          style={styles.mainContainer}>
          <View style={styles.voucherItemsWrapper}>
            <View style={styles.voucherImageWrapper}>
              {image && (
                <Image
                  source={{uri: image}}
                  style={styles.image}
                  resizeMode="contain"
                />
              )}
            </View>
            <View style={styles.voucherDetails}>
              <Text style={styles.voucherTitle}>{brandName}</Text>
            </View>
          </View>
          <View style={styles.voucherDivider} />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  voucherListWrapper: {
    width: '100%',
    marginBottom: 0,
  },
  voucherItemsWrapper: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  voucherImageWrapper: {
    width: 50,
    height: 50,
    marginRight: 10,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(235, 235, 245, 0.1)',
    padding: 5,
  },
  voucherDetails: {
    width: '80%',
    paddingLeft: 2,
    justifyContent: 'center',
    alignItems: 'flex-start',
    height: 50,
  },
  voucherTitle: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
    color: '#fff',
  },
  denominationWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    fontWeight: '400',
    color: 'rgba(235, 235, 245, 0.6)',
  },
  denominationValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  actualPrice: {
    color: '#fff',
    marginTop: 2,
    fontWeight: 'bold',
  },
  price: {
    color: 'rgba(235, 235, 245, 0.6)',
    marginTop: 2,
    fontWeight: 'bold',
    fontSize: 12,
    textDecorationLine: 'line-through',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#e4e4e4',
  },
  dicountContainer: {
    backgroundColor: '#20B038',
    marginVertical: 2,
    width: 140,
    borderRadius: 4,
    alignItems: 'center',
  },
  discount: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
    paddingHorizontal: 10,
  },
  voucherDivider: {
    height: 1,
    backgroundColor: 'rgba(235, 235, 245, 0.1)',
    marginVertical: 10,
    width: '80%',
  },
});

export default BrandCard;
