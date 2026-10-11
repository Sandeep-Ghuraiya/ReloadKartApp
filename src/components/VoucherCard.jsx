/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import {singleTopupData, singleVoucherData} from '../redux/voucherReducer';
import React, {useMemo} from 'react';
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
import {useNavigation} from '@react-navigation/native';
import usePopupImage from '../hooks/usePopupImage';

const {width} = Dimensions.get('screen');

const VoucherCard = ({item}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const checkImage = usePopupImage();

  const handlePress = () => {
    dispatch(incrementCount(checkImage));
    const productData = JSON.stringify({
      action: 'products',
      product_id: item.product_id,
      brand_id: '',
      category_id: '',
      type: item.product_type, // voucher | topup | gift
    });

    if (item.product_type === 'voucher') {
      dispatch(singleVoucherData(productData));

      navigation.navigate('SingleVoucher');
    } else {
      dispatch(singleTopupData(productData));

      navigation.navigate('SingleTopup');
    }
  };

  const htmlSource = useMemo(
    () => ({html: `<div>${item.title}</div>`}),
    [item.title],
  );

  const tagsStyles = useMemo(
    () => ({
      div: styles.voucherTitle,
    }),
    [],
  );

  return (
    <View style={styles.voucherListWrapper}>
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.8}
        style={styles.mainContainer}>
        <View style={styles.voucherItemsWrapper}>
          <View style={styles.voucherImageWrapper}>
            {item.image && (
              <Image
                source={{uri: item.image}}
                style={styles.image}
                resizeMode="contain"
              />
            )}
          </View>

          <View style={styles.voucherDetails}>
            <RenderHTML
              contentWidth={width}
              source={htmlSource}
              tagsStyles={tagsStyles}
            />

            <View style={styles.denominationWrapper}>
              <Text style={styles.label}>Denomination:</Text>
              <Text style={styles.denominationValue}>
                {parseFloat(item.min_face)}
              </Text>
            </View>

            {parseFloat(item.sale_price) >= parseFloat(item.actual_price) ? (
              <View style={styles.priceContainer}>
                <Text style={styles.actualPrice}>
                  {`${item.currency_symbol} ${parseFloat(item.sale_price)}`}
                </Text>
              </View>
            ) : (
              <>
                <View style={styles.priceContainer}>
                  <Text style={styles.actualPrice}>
                    {`${item.currency_symbol} ${parseFloat(item.sale_price)}`}
                  </Text>
                  <Text style={[styles.price, {marginLeft: 5}]}>
                    {`${item.currency_symbol} ${parseFloat(item.actual_price)}`}
                  </Text>
                </View>
                <View style={styles.discountPercentageContainer}>
                  <Text style={styles.discountPercentage}>
                    {item?.discount ? `Save ${parseFloat(item.discount)}%` : ''}{' '}
                  </Text>
                </View>
              </>
            )}
          </View>
        </View>
        <View style={styles.voucherDivider} />
      </TouchableOpacity>
    </View>
  );
};

export default VoucherCard;

const styles = StyleSheet.create({
  voucherListWrapper: {
    width: '100%',
  },
  mainContainer: {
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  voucherItemsWrapper: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  voucherImageWrapper: {
    width: 45,
    height: 35,
    marginRight: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(235, 235, 245, 0.1)',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  voucherDetails: {
    width: '80%',
    paddingLeft: 2,
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
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#e4e4e4',
  },
  discountPercentageContainer: {
    backgroundColor: '#20B038',
    marginVertical: 2,
    paddingVertical: 1,
    width: 100,
    borderRadius: 4,
    // alignItems: 'center'
  },
  discountPercentage: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
    paddingHorizontal: 10,
    textAlign: 'center',
  },
  voucherDivider: {
    height: 1,
    backgroundColor: 'rgba(235, 235, 245, 0.1)',
    marginVertical: 15,
    width: '80%',
  },
});
