/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react-hooks/exhaustive-deps */
import useLoginData from '../hooks/useLoginData';
import {useCallback, useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import RenderHTML from 'react-native-render-html';
import {useDispatch, useSelector} from 'react-redux';
import Banner from './Banner';
import TopupPlayerDetails from './TopupPlayerDetails';
import {useNavigation, useFocusEffect, Link} from '@react-navigation/native';
import {Lucide} from '@react-native-vector-icons/lucide';
import SinglePageSkeleton from '../loader/SinglePageSkeleton';
import PaymentModal from '../models/PaymentModal';
import {
  clearOrderResponse,
  createOrder,
  orderModalOpen,
} from '../redux/orderReducer';
import {showMessage} from 'react-native-flash-message';
import NetInfo from '@react-native-community/netinfo';

const {width} = Dimensions.get('screen');

const SingleTopupView = ({topupData}) => {
  const {createOrderData} = useSelector(state => state.orders);

  const {loginDetails, loginLoading} = useLoginData();

  const dispatch = useDispatch();
  // const navigation = useNavigation();

  const currencySymbol = topupData.currency_symbol;
  const smallFees = topupData?.small_processing_fee?.fees
    ? parseFloat(topupData.small_processing_fee.fees)
    : 0;
  const label =
    topupData?.small_processing_fee?.label &&
    topupData.small_processing_fee.label;
  const paymentFees = parseFloat(topupData?.payment_processing_fees);
  const paymentLabel = 'Price includes Payment Processing Fees';

  const total =
    parseFloat(topupData.sale_price) +
    parseFloat(topupData.payment_processing_fees) +
    smallFees;
  const usdTotal = parseFloat(topupData.usd_sale_price);
  const usd = topupData.brand_currency;

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [netIpAddress, setNetIpAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [formValues, setFormValues] = useState({});
  const [errors, setErrors] = useState({});

  const showToast = ({
    message,
    description = '',
    type = 'success',
    icon = 'success',
    duration = 6000,
  }) => {
    showMessage({
      message,
      description,
      type,
      icon,
      duration,
      statusBarHeight: 50,
    });
  };

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

  useEffect(() => {
    const getPayment = async () => {
      if (createOrderData?.status === 1) {
        setTimeout(() => {
          dispatch(orderModalOpen(false));
          Link.openURL(createOrderData.ref_url);
          setLoading(false);
        }, 2000);
      } else if (createOrderData?.status === 0) {
        setLoading(false);
        dispatch(orderModalOpen(false));
        showToast({
          message: 'Error',
          description: createOrderData?.message,
          type: 'danger',
          icon: 'danger',
        });
      }

      setTimeout(() => {
        dispatch(clearOrderResponse());
      }, 3000);
    };
    getPayment();
  }, [createOrderData]);

  const handleVerifyandPay = useCallback(async () => {
    let isValid = true;

    let newErrors = {};

    Object.entries(topupData?.form_field || {}).forEach(([key, field]) => {
      // Required validation
      if (!formValues[key] || formValues[key].toString().trim() === '') {
        newErrors[key] = `${field.label} is required`;
      }
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    // If validation passed, proceed to order creation
    if (isValid) {
      setLoading(true);
      const orderData = JSON.stringify({
        action: 'create_order',
        user_email: email,
        first_name: firstName,
        last_name: lastName,
        product_id: topupData.product_id,
        identifiers: formValues,
        payment_method: 'cryptomus',
        ip_address: netIpAddress,
      });

      // Uncomment and use dispatch if you're making an API call
      dispatch(orderModalOpen(true));
      await dispatch(createOrder(orderData));
    }
    setTimeout(() => {
      setLoading(false);
    }, 10000);
  }, [dispatch]);

  const handleChange = (key, value) => {
    setFormValues(prev => ({
      ...prev,
      [key]: value,
    }));

    // clear error on change
    setErrors(prev => ({
      ...prev,
      [key]: '',
    }));
  };

  const htmlSource = useMemo(
    () => ({
      html: `<div>${topupData.title}</div>`,
    }),
    [topupData?.title],
  );

  const tagsStyles = useMemo(
    () => ({
      div: styles.productTitle,
    }),
    [],
  );

  // const is_draft = 'yes';

  return (
    <View style={styles.singleProductContainer} key={topupData.product_id}>
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

        <KeyboardAvoidingView
          style={{flex: 1, paddingBottom: 50}}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.scrollContainer}>
            <View>
              <View style={styles.productWrapper}>
                <View style={{width: '100%'}}>
                  <View style={styles.bannerContainer}>
                    <Banner image={topupData.image} />
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
                              {topupData.min_face}
                            </Text>
                          </>
                        </View>
                      </View>
                      <View
                        style={{
                          width: 150,
                        }}>
                        {parseFloat(topupData.sale_price) >=
                        parseFloat(topupData.actual_price) ? (
                          <View>
                            <Text
                              style={{
                                color: '#fff',
                                fontSize: 16,
                                fontWeight: '600',
                              }}>
                              {`${currencySymbol}${parseFloat(
                                topupData.sale_price,
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
                                  topupData.sale_price,
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
                                  topupData.actual_price,
                                )}`}
                              </Text>
                            </View>

                            <View style={styles.discountPercentageContainer}>
                              <Text style={styles.discountPercentage}>
                                {topupData.discount
                                  ? `Save ${parseFloat(topupData.discount)}%`
                                  : ''}
                              </Text>
                            </View>
                          </View>
                        )}
                      </View>
                      {topupData?.region_note && (
                        <View style={[{marginTop: 10}]}>
                          <Text style={{color: 'red', fontWeight: '600'}}>
                            {topupData?.region_note}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                  <View style={styles.accordionToggleContainer}>
                    <TopupPlayerDetails
                      formFieldData={topupData?.form_field}
                      formValues={formValues}
                      setFormValues={setFormValues}
                      errors={errors}
                      setErrors={setErrors}
                      handleChange={handleChange}
                    />
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
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
                  <Text style={styles.paymentFees}>
                    {paymentFees > 0 && label
                      ? `${paymentLabel} + ${label}`
                      : paymentFees > 0
                      ? paymentLabel
                      : label || null}{' '}
                    :{' '}
                    {paymentFees > 0 && smallFees
                      ? `${currencySymbol} ${paymentFees} + ${currencySymbol} ${smallFees}`
                      : paymentFees > 0
                      ? `${currencySymbol}${paymentFees}`
                      : `${currencySymbol}${smallFees}` || null}
                  </Text>
                </View>
              </View>
              {topupData?.is_draft === 'no' ? (
                <TouchableOpacity
                  onPress={handleVerifyandPay}
                  style={styles.buttonContainer}>
                  {loading ? (
                    <ActivityIndicator size={'small'} color={'#fff'} />
                  ) : (
                    <Text style={styles.buttonText}>Verify and Pay Now</Text>
                  )}
                </TouchableOpacity>
              ) : (
                <View
                  style={[
                    styles.buttonContainer,
                    {backgroundColor: '#EF4444'},
                  ]}>
                  <Text style={styles.buttonText}>Out of Stock</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </>
    </View>
  );
};

export default SingleTopupView;

const styles = StyleSheet.create({
  singleProductContainer: {
    flex: 1,
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
    marginTop: 12,
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
    backgroundColor: '#fff',
    height: 60,
    position: 'relative',
  },
  buttonFlexWrapper: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
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
    fontWeight: '500',
  },
  discountPercentageContainer: {
    width: 100,
    backgroundColor: '#20B038',
    borderRadius: 4,
    marginVertical: 5,
    alignItems: 'center',
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
  paymentFees: {
    fontSize: 8,
    color: '#000',
    fontWeight: '600',
    textAlign: 'center',
  },
});
