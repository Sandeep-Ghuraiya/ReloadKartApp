/* eslint-disable react-native/no-inline-styles */
import {useFocusEffect} from '@react-navigation/native';
import {decode} from 'html-entities';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import RenderHTML from 'react-native-render-html';
//Icons
import Feather from '@react-native-vector-icons/feather';
//Redux
import {useDispatch} from 'react-redux';
import {incrementCount} from '../../redux/counterReducer';
//Components
import Banner from '../../components/Banner';
import DynamicTextShow from '../../components/DynamicTextShow';
import InternetConnection from '../../components/InternetConnection';
//Hooks
import useInternetCheck from '../../hooks/useInternetCheck';
//Models
import PopupImages from '../../models/PopupImages';
import usePopupImage from '../../hooks/usePopupImage';

const {width} = Dimensions.get('screen');

const SingleOrderView = props => {
  const {navigation, route} = props;
  const internetValue = useInternetCheck();

  const {item} = route.params || {};

  const dispatch = useDispatch();
  const checkImage = usePopupImage();

  const singleOrderData = useMemo(() => {
    return item ? JSON.parse(item) : [];
  }, [item]);

  const [loading, setLoading] = useState(true);
  const [showConnection, setShowConnection] = useState(false);

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        headerTitle: decode(singleOrderData.products.title),
        headerTitleStyle: {
          color: '#fff',
        },
      });
    }, [singleOrderData, navigation]),
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
      setLoading(false);
    }, 2000);
  }, [singleOrderData]);

  function formatDateTime(dateString) {
    // Split the input into date and time parts
    const [datePart, timePart] = dateString.split(' ');

    // Create a Date object from the date part
    const date = new Date(datePart);

    // Get the month (abbreviated)
    const month = date.toLocaleString('en-US', {month: 'short'});

    // Get the day (with padding for single digits)
    const day = date.getDate().toString().padStart(2, '0');

    // Get the year
    const year = date.getFullYear();

    // Return the formatted string (date in Mon DD, YYYY format and time as is)
    return `${month} ${day}, ${year} ${timePart}`;
  }

  const [openIndex, setOpenIndex] = useState(0);

  const total =
    parseFloat(singleOrderData.products.sale_price) +
    parseFloat(singleOrderData.products.payment_processing_fees);

  const source = useMemo(
    () => ({
      html: `<div>${singleOrderData?.products?.title || ''}</div>`,
    }),
    [singleOrderData?.products?.title],
  );

  const tagsStyles = useMemo(
    () => ({
      div: styles.productTitle,
    }),
    [],
  );

  return (
    <View style={styles.container}>
      {internetValue ? (
        loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size={'large'} color={'#fff'} />
          </View>
        ) : (
          <View>
            <PopupImages />
            <ScrollView
              contentContainerStyle={{paddingBottom: 40}}
              showsVerticalScrollIndicator={false}>
              <View style={styles.mainContainer}>
                <View style={{width: '100%'}}>
                  <View style={styles.bannerContainer}>
                    <Banner image={singleOrderData.products.image} />
                  </View>
                </View>

                <View style={styles.contentWrapper}>
                  <View style={styles.mainContentHeading}>
                    <View style={{width: '100%'}}>
                      <View style={{marginBottom: 10}}>
                        <Text style={styles.heading}>Product Details</Text>
                      </View>
                      <View style={{marginBottom: 5}}>
                        <Text style={styles.productTitle}>
                          #{singleOrderData.order_number}
                        </Text>
                      </View>
                      <View style={{marginBottom: 5}}>
                        <RenderHTML
                          contentWidth={width}
                          source={source}
                          tagsStyles={tagsStyles}
                        />
                      </View>
                      <View style={{width: '100%', marginBottom: 5}}>
                        <View style={styles.denominationContent}>
                          <>
                            <Text
                              style={{
                                fontSize: 12,
                                color: 'rgba(235, 235, 245, 0.6)',
                              }}>
                              Denomination
                            </Text>
                            <Text style={styles.textColon}>:</Text>
                            <Text
                              style={{
                                color: '#fff',
                                fontSize: 14,
                              }}>
                              {parseFloat(singleOrderData.products.min_face)}
                            </Text>
                          </>
                        </View>
                      </View>
                      <View>
                        <View style={{marginBottom: 5}}>
                          <Text
                            style={{
                              color: '#fff',
                              fontWeight: '600',
                            }}>
                            Price:{' '}
                            {`${
                              singleOrderData.products.currency_symbol
                            }${parseFloat(
                              singleOrderData.products.sale_price,
                            )}`}
                          </Text>
                        </View>
                        {parseFloat(
                          singleOrderData.products.payment_processing_fees,
                        ) && (
                          <View style={{marginBottom: 5}}>
                            <Text
                              style={{
                                color: '#fff',
                                fontWeight: '600',
                              }}>
                              Payment Processing Fees:{' '}
                              {`${singleOrderData.products.currency_symbol}${singleOrderData.products.payment_processing_fees}`}
                            </Text>
                          </View>
                        )}

                        <View>
                          <Text
                            style={{
                              color: '#fff',
                              fontSize: 16,
                              fontWeight: '600',
                            }}>
                            Total:{' '}
                            {`${
                              singleOrderData.products.currency_symbol
                            }${total.toFixed(2)}`}
                          </Text>
                        </View>
                      </View>
                      <View>
                        <Text style={styles.dateText}>
                          {singleOrderData?.order_date &&
                            formatDateTime(singleOrderData.order_date)}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {singleOrderData.voucher_detail &&
                    singleOrderData.voucher_detail.length > 0 &&
                    singleOrderData.voucher_detail.map((singleItem, index) => {
                      const isOpen = openIndex === index;
                      return (
                        <View
                          style={styles.mainContentHeading}
                          key={singleItem.id}>
                          <View style={{width: '100%'}}>
                            <TouchableOpacity
                              style={styles.accordionWrapper}
                              onPress={() => {
                                setOpenIndex(isOpen ? null : index);
                                dispatch(incrementCount(checkImage));
                              }}>
                              <Text style={styles.heading}>
                                Voucher Details
                              </Text>
                              <Feather
                                name={isOpen ? 'chevron-up' : 'chevron-down'}
                                color={'#ffffff'}
                                size={14}
                              />
                            </TouchableOpacity>
                            {isOpen && (
                              <View>
                                {singleItem.serial_number && (
                                  <View style={{marginBottom: 5}}>
                                    <Text style={styles.voucherText}>
                                      Serial Number: {singleItem.serial_number}
                                    </Text>
                                  </View>
                                )}
                                {singleItem.card_code && (
                                  <View style={{marginBottom: 5}}>
                                    <Text style={styles.voucherText}>
                                      Card Code: {singleItem.card_code}
                                    </Text>
                                  </View>
                                )}
                                {singleItem.pin && (
                                  <View style={{marginBottom: 5}}>
                                    <Text style={styles.voucherText}>
                                      PIN: {singleItem.pin}
                                    </Text>
                                  </View>
                                )}
                                {singleItem.expiration_date && (
                                  <View style={{marginBottom: 5}}>
                                    <Text style={styles.voucherText}>
                                      Expiration Date:{' '}
                                      {singleItem.expiration_date}
                                    </Text>
                                  </View>
                                )}
                              </View>
                            )}
                          </View>
                        </View>
                      );
                    })}

                  {singleOrderData.products.terms && (
                    <View style={styles.mainContentHeading}>
                      <View style={{marginBottom: 10}}>
                        <Text style={styles.heading}>Terms & Condition</Text>
                      </View>
                      <View>
                        <DynamicTextShow
                          content={singleOrderData.products.terms}
                        />
                      </View>
                    </View>
                  )}
                </View>
              </View>
            </ScrollView>
          </View>
        )
      ) : (
        <InternetConnection
          visible={showConnection}
          onClose={() => setShowConnection(false)}
        />
      )}
    </View>
  );
};

export default SingleOrderView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#16182B',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerContainer: {
    width: '100%',
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  contentWrapper: {
    // flex: 1,
    paddingHorizontal: 8,
  },
  mainContentHeading: {
    width: '100%',
    backgroundColor: '#252F45',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 12,
    paddingBottom: 18,
    position: 'relative',
    marginBottom: 20,
  },
  heading: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
  },
  productTitle: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  denominationContent: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    // marginBottom: 6,
  },
  textColon: {
    paddingHorizontal: 2,
    color: 'rgba(235, 235, 245, 0.6)',
    fontSize: 12,
  },
  accordionWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  dateText: {
    color: '#fff',
    marginVertical: 5,
  },
  voucherText: {
    color: '#fff',
    fontWeight: '500',
    // fontSize:16
  },
});
