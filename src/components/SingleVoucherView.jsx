/* eslint-disable prettier/prettier */
/* eslint-disable curly */

/* eslint-disable no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/react-in-jsx-scope */
import {
  clearOrderResponse,
  createOrder,
  orderModalOpen,
} from '../redux/orderReducer';
import useLoginData from '../hooks/useLoginData';
import {Lucide} from '@react-native-vector-icons/lucide';
import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Linking,
} from 'react-native';
import RenderHTML from 'react-native-render-html';
import {Link, useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import Banner from './Banner';
import DynamicAccordion from './DynamicAccordion';
import ShowAlert from './ShowAlert';
import {showMessage} from 'react-native-flash-message';
import SinglePageSkeleton from '../loader/SinglePageSkeleton';
import PaymentModal from '../models/PaymentModal';
import NetInfo from '@react-native-community/netinfo';

const {width} = Dimensions.get('screen');

const SingleVoucherView = ({voucherData}) => {
  const {createOrderData} = useSelector(state => state.orders);
  const {loginDetails, loginLoading} = useLoginData();
  const dispatch = useDispatch();

  // ─── Refs for timers (prevent setState on unmounted component) ───────────
  const clearOrderTimerRef = useRef(null);
  const paymentTimerRef = useRef(null);

  // ─── State ───────────────────────────────────────────────────────────────
  const [netIpAddress, setNetIpAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);

  // ─── Derived values (stable, no re-computation risk) ─────────────────────
  const currencySymbol = voucherData.currency_symbol;
  const smallFees = voucherData?.small_processing_fee?.fees
    ? parseFloat(voucherData.small_processing_fee.fees)
    : 0;
  const label =
    voucherData?.small_processing_fee?.label &&
    voucherData.small_processing_fee.label;
  const paymentFees = parseFloat(voucherData?.payment_processing_fees ?? 0);
  const paymentLabel = 'Price includes Payment Processing Fees';
  const total = parseFloat(voucherData?.sale_price) + paymentFees + smallFees;
  const usdTotal = parseFloat(voucherData?.usd_sale_price);
  const usd = voucherData?.brand_currency;

  useEffect(() => {
    let isMounted = true;

    const fetchNetwork = async () => {
      try {
        const state = await NetInfo.fetch();

        if (isMounted) {
          setNetIpAddress(state.details?.ipAddress);
        }
      } catch (error) {
        console.log('NetInfo Error:', error);
      }
    };

    fetchNetwork();

    return () => {
      isMounted = false; // prevent memory leak
    };
  }, []);

  useEffect(() => {
    if (loginDetails?.status) {
      setFirstName(loginDetails?.data?.first_name);
      setLastName(loginDetails?.data?.last_name);
      setEmail(loginDetails?.data?.email);
    }
    if (loginDetails?.user) {
      setFirstName(loginDetails?.user?.givenName);
      setLastName(loginDetails?.user?.familyName);
      setEmail(loginDetails?.user?.email);
    }
    if (loginDetails?.userData) {
      setFirstName(loginDetails?.userData?.first_name);
      setLastName(loginDetails?.userData?.last_name);
      setEmail(loginDetails?.userData?.email);
    }
  }, [loginDetails]);

  // ─── Effect: Handle order response with cleanup on timers ─────────────────
  useEffect(() => {
    if (!createOrderData) return;

    if (createOrderData.status === 1) {
      paymentTimerRef.current = setTimeout(() => {
        setLoading(false);
        dispatch(orderModalOpen(false));
        Linking.openURL(createOrderData.ref_url);
      }, 2000);
    } else if (createOrderData.status === 0) {
      setLoading(false);
      dispatch(orderModalOpen(false));
      showMessage({
        message: 'Error',
        description: createOrderData.message,
        type: 'danger',
        duration: 5000,
        statusBarHeight: 50,
      });
    }

    clearOrderTimerRef.current = setTimeout(() => {
      dispatch(clearOrderResponse());
    }, 10000);

    return () => {
      clearTimeout(paymentTimerRef.current);
      clearTimeout(clearOrderTimerRef.current);
    };
  }, [createOrderData, dispatch]);

  const handleCreateOrder = useCallback(async () => {
    setLoading(true);
    const createData = JSON.stringify({
      action: 'create_order',
      user_email: email,
      first_name: firstName,
      last_name: lastName,
      product_id: voucherData.product_id,
      account_id: '',
      server_id: '',
      zone_id: '',
      payment_method: 'cryptomus',
      ip_address: netIpAddress,
    });
    dispatch(orderModalOpen(true));
    await dispatch(createOrder(createData));

    setTimeout(() => {
      setLoading(false);
    }, 10000);
  }, [
    dispatch,
    email,
    firstName,
    lastName,
    voucherData.product_id,
    netIpAddress,
  ]);

  const htmlSource = useMemo(
    () => ({
      html: `<div>${voucherData?.title ?? ''}</div>`,
    }),
    [voucherData?.title],
  );

  const tagsStyles = useMemo(
    () => ({
      div: styles.productTitle,
    }),
    [],
  );

  // ─── Payment fees label/value helpers (extracted to avoid JSX clutter) ────
  const feesLabel = useMemo(() => {
    if (paymentFees > 0 && label) return `${paymentLabel} + ${label}`;
    if (paymentFees > 0) return paymentLabel;
    return label || null;
  }, [paymentFees, label, paymentLabel]);

  const feesValue = useMemo(() => {
    if (paymentFees > 0 && smallFees)
      return `${currencySymbol}${paymentFees} + ${currencySymbol}${smallFees}`;
    if (paymentFees > 0) return `${currencySymbol}${paymentFees}`;
    if (smallFees) return `${currencySymbol}${smallFees}`;
    return null;
  }, [paymentFees, smallFees, currencySymbol]);

  const isSalePrice =
    parseFloat(voucherData.sale_price) >= parseFloat(voucherData.actual_price);

  return (
    <View style={styles.singleProductContainer} key={voucherData.id}>
      <>
        <PaymentModal
          paymentModalVisible={paymentModalVisible}
          onClose={value => setPaymentModalVisible(value)}
        />
        <Modal transparent={true} visible={confirmLoading}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size={'large'} color={'#fff'} />
          </View>
        </Modal>

        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.scrollContainer}>
          <View style={{marginTop: 5}}>
            {voucherData != '' ? (
              <View style={styles.productWrapper}>
                <View style={{width: '100%'}}>
                  <View style={styles.bannerContainer}>
                    <Banner image={voucherData.image} />
                  </View>
                </View>
                <View style={styles.contentWrapper}>
                  <View style={styles.mainContentHeading}>
                    <View style={{width: '100%'}}>
                      <View style={{marginBottom: 5}}>
                        <RenderHTML
                          contentWidth={width}
                          source={htmlSource}
                          tagsStyles={tagsStyles}
                        />
                      </View>
                      <View style={{width: '100%'}}>
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
                                fontSize: 12,
                              }}>
                              {parseFloat(voucherData.min_face)}
                            </Text>
                          </>
                        </View>
                      </View>
                      <View
                        style={{
                          width: 150,
                        }}>
                        {isSalePrice ? (
                          <View>
                            <Text
                              style={{
                                color: '#fff',
                                fontSize: 16,
                                fontWeight: '600',
                              }}>
                              {`${currencySymbol}${parseFloat(
                                voucherData.sale_price,
                              )}`}
                            </Text>
                          </View>
                        ) : (
                          <View>
                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'flex-end',
                              }}>
                              <Text
                                style={{
                                  color: '#fff',
                                  fontSize: 16,
                                  fontWeight: '600',
                                }}>
                                {`${currencySymbol}${parseFloat(
                                  voucherData.sale_price,
                                )}`}
                              </Text>
                              <Text
                                style={{
                                  color: 'rgba(235, 235, 245, 0.6)',
                                  fontSize: 14,
                                  fontWeight: '600',
                                  textDecorationLine: 'line-through',
                                  marginLeft: 5,
                                }}>
                                {`${currencySymbol}${parseFloat(
                                  voucherData.actual_price,
                                )}`}
                              </Text>
                            </View>

                            <View style={styles.discountPercentageContainer}>
                              <Text style={styles.discountPercentage}>
                                {voucherData?.discount
                                  ? `Save ${parseFloat(voucherData.discount)}%`
                                  : ''}
                              </Text>
                            </View>
                          </View>
                        )}
                      </View>
                      {voucherData?.region_note && (
                        <View style={[{marginTop: 10}]}>
                          <Text style={{color: 'red', fontWeight: '600'}}>
                            {voucherData?.region_note}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>

                  <View style={styles.accordionToggleContainer}>
                    <DynamicAccordion voucherData={voucherData} />
                  </View>
                </View>
              </View>
            ) : null}
          </View>
        </ScrollView>
        <View style={styles.buttonPosition}>
          <View style={styles.buttonLayout}>
            <View style={styles.buttonFlexWrapper}>
              <View style={styles.buttonView}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                  }}>
                  <Text
                    style={[
                      styles.totalPriceText,
                      usd === 'INR' ? {fontSize: 12} : {fontSize: 14},
                    ]}>
                    Total Price : {`${currencySymbol}${total.toFixed(2)}`}
                  </Text>
                  {usd === 'INR' && (
                    <>
                      <Lucide
                        name="equal-approximately"
                        size={20}
                        color="#000"
                      />

                      <Text
                        style={[
                          styles.totalPriceText,
                          usd === 'INR' ? {fontSize: 12} : {fontSize: 14},
                        ]}>
                        ${usdTotal}
                      </Text>
                    </>
                  )}
                </View>
                <View>
                  {feesLabel && feesValue ? (
                    <Text style={styles.paymentFeesStyle}>
                      {`${feesLabel}: ${feesValue}`}
                    </Text>
                  ) : null}
                </View>
              </View>
              {voucherData.is_draft === 'no' ? (
                <TouchableOpacity
                  onPress={handleCreateOrder}
                  style={styles.buttonContainer}>
                  {loading ? (
                    <ActivityIndicator size={'small'} color={'#fff'} />
                  ) : (
                    <Text style={styles.buttonText}>Buy Now</Text>
                  )}
                </TouchableOpacity>
              ) : (
                <View style={styles.buttonContainer}>
                  <Text style={styles.buttonText}>Out Of Stock</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </>
    </View>
  );
};

export default SingleVoucherView;

const styles = StyleSheet.create({
  singleProductContainer: {
    flex: 1,
    position: 'relative',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  scrollContainer: {flex: 1, marginBottom: 40},
  bannerContainer: {
    width: '100%',
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  contentWrapper: {
    flex: 1,
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
    marginBottom: 12,
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
  },
  textColon: {
    paddingHorizontal: 2,
    color: 'rgba(235, 235, 245, 0.6)',
    fontSize: 12,
  },
  accordionToggleContainer: {
    width: '100%',
    zIndex: 10,
    position: 'relative',
  },
  buttonPosition: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
  },
  buttonLayout: {
    width: '100%',
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: 'rgba(0,0,0,0.15)',
    position: 'relative',
    height: 60,
    backgroundColor: '#fff',
  },
  buttonFlexWrapper: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonView: {
    width: '55%',
    height: '100%',
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    width: '45%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#20B038',
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 30,
    fontWeight: '500',
  },
  discountPercentageContainer: {
    backgroundColor: '#20B038',
    borderRadius: 4,
    marginVertical: 5,
    alignItems: 'center',
    width: 100,
    paddingBottom: 3,
  },
  discountPercentage: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  totalPriceText: {
    textAlign: 'center',
    fontWeight: '600',
    color: '#000',
  },
  paymentFeesStyle: {
    color: '#000',
    fontWeight: '600',
    fontSize: 8,
    textAlign: 'center',
  },
});
