/* eslint-disable curly */
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Image, Modal, StyleSheet, TouchableOpacity, View} from 'react-native';

// REDUX
import {useDispatch, useSelector} from 'react-redux';
import {resetCounter} from '../redux/counterReducer';
import {topupDataList, voucherDataList} from '../redux/voucherReducer';

// ICONS & NAVIGATION
import AntDesign from '@react-native-vector-icons/ant-design';
import {useNavigation} from '@react-navigation/native';

const STORAGE_KEY = 'counter_currenttime';
const MAX_TOUCH_COUNT = 15;
const HOURS_LIMIT = 6;

const PopupImages = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const {settingData} = useSelector(state => state.setting);
  const {touchCount} = useSelector(state => state.counters);

  const [counterModalVisible, setCounterModalVisible] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);

  /* -------------------- OFFERS ARRAY -------------------- */
  const imageArray = useMemo(() => {
    return settingData?.offers_popup || [];
  }, [settingData]);

  /* -------------------- RANDOM OFFER -------------------- */
  const getRandomOffer = useCallback(() => {
    if (!imageArray.length) return null;

    const randomIndex = Math.floor(Math.random() * imageArray.length);

    return imageArray[randomIndex];
  }, [imageArray]);

  /* -------------------- CLOSE MODAL -------------------- */
  const handleClose = useCallback(async () => {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEY,
        moment().format('DD-MM-YYYY HH-mm-ss'),
      );
    } catch (error) {
      console.log('AsyncStorage Error:', error);
    }

    setCounterModalVisible(false);
    dispatch(resetCounter());
  }, [dispatch]);

  /* -------------------- CHECK MODAL VISIBILITY -------------------- */
  useEffect(() => {
    const checkPopupVisibility = async () => {
      try {
        if (touchCount <= MAX_TOUCH_COUNT) {
          setCounterModalVisible(false);
          return;
        }

        const storedTime = await AsyncStorage.getItem(STORAGE_KEY);

        let shouldShowPopup = false;

        if (!storedTime) {
          shouldShowPopup = true;
        } else {
          const storedDate = moment(storedTime, 'DD-MM-YYYY HH-mm-ss');

          const diffHours = moment().diff(storedDate, 'hours');

          shouldShowPopup = diffHours >= HOURS_LIMIT;
        }

        if (shouldShowPopup && imageArray.length) {
          const randomOffer = getRandomOffer();

          if (randomOffer) {
            setSelectedOffer(randomOffer);
            setCounterModalVisible(true);
          }
        } else {
          dispatch(resetCounter());
        }
      } catch (error) {
        console.log('Popup Error:', error);
      }
    };

    checkPopupVisibility();
  }, [touchCount, imageArray, getRandomOffer, dispatch]);

  /* -------------------- NAVIGATION -------------------- */
  const handleNavigation = useCallback(async () => {
    if (!selectedOffer) return;

    await handleClose();

    if (selectedOffer?.offer_type === 'brand') {
      navigation.navigate('BrandInfo', {
        title: selectedOffer?.brand?.name,
        slug: '',
        item: 'brands',
        image: selectedOffer?.brand?.image,
        name: 'Categories',
      });

      return;
    }

    if (selectedOffer?.offer_type === 'product') {
      const productData = JSON.stringify({
        action: 'products',
        product_id: selectedOffer?.product?.product_id,
        brand_id: '',
        category_id: '',
        type: selectedOffer?.product?.product_type,
      });

      if (selectedOffer?.product?.product_type === 'voucher') {
        dispatch(
          voucherDataList({
            data: 'SingleData',
            voucherData: productData,
          }),
        );

        navigation.navigate('SingleVoucher');
      } else {
        dispatch(
          topupDataList({
            data: 'SingleTopupData',
            topupData: productData,
          }),
        );

        navigation.navigate('SingleTopup');
      }
    }
  }, [selectedOffer, handleClose, navigation, dispatch]);

  /* -------------------- UI -------------------- */
  return (
    <Modal
      transparent
      visible={counterModalVisible}
      animationType="fade"
      onRequestClose={handleClose}>
      <View style={styles.modalContainer}>
        <View style={styles.closeBtnView}>
          <TouchableOpacity style={styles.closeBtn} onPress={handleClose}>
            <AntDesign name="close" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {selectedOffer?.image ? (
          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.imageContainer}
            onPress={handleNavigation}>
            <View style={styles.imgView}>
              <Image
                resizeMode="contain"
                style={styles.img}
                source={{uri: selectedOffer.image}}
              />
            </View>
          </TouchableOpacity>
        ) : null}
      </View>
    </Modal>
  );
};

export default React.memo(PopupImages);

/* -------------------- STYLES -------------------- */
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingHorizontal: 10,
  },

  closeBtnView: {
    marginTop: 50,
    alignItems: 'flex-end',
    marginBottom: 15,
  },

  closeBtn: {
    borderWidth: 1,
    borderColor: '#fff',
    padding: 5,
    borderRadius: 100,
  },

  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -150,
  },

  imgView: {
    width: '100%',
    height: '100%',
  },

  img: {
    width: '100%',
    height: '100%',
  },
});
