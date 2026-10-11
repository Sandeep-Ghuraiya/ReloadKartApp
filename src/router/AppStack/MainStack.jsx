/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

//ICONS
import {FontAwesome} from '@react-native-vector-icons/fontawesome';

//components
import HeaderBar from '../../components/HeaderBar';
import LogoImage from '../../components/LogoImage';

// Screens
import HomeScreen from '../../screens/HomeScreen';
import CategoriesList from '../../screens/mainScreens/CategoriesList';
import BrandInfo from '../../screens/mainScreens/BrandInfo';
import CategoryList from '../../screens/mainScreens/CategoryList';
import BrandList from '../../screens/mainScreens/BrandList';
import SingleVoucher from '../../screens/mainScreens/SingleVoucher';
import TopupList from '../../screens/mainScreens/TopupList';
import SingleTopup from '../../screens/mainScreens/SingleTopup';
import SingleOrderView from '../../screens/mainScreens/SingleOrderView';
import ThankYouScreen from '../../screens/mainScreens/ThankYouScreen';
import TopupBrandList from '../../screens/mainScreens/TopUpBrandList';
// import WebViewScreen from '../../screens/mainScreens/WebViewScreen';
import {useSelector} from 'react-redux';
import OrderModal from '../../models/orderModal';
import PaymentCancel from '../../screens/mainScreens/PaymentCanncel';
import SingleTipsBlogView from '../../screens/mainScreens/SingleTipsBlogView';

const Stack = createNativeStackNavigator();

const MainStack = () => {
  const {openModalData} = useSelector(state => state.orders);

  return (
    <>
      <Stack.Navigator screenOptions={{headerShown: true}}>
        {/* HOME */}
        <Stack.Screen
          name="Index"
          component={HomeScreen}
          options={{
            headerTitle: () => (
              <TouchableOpacity>
                <LogoImage
                  imageWrapper={styles.imageWrapper}
                  imageCss={styles.imageCss}
                />
              </TouchableOpacity>
            ),
            headerTitleAlign: 'center',
            headerStyle: {backgroundColor: '#20B038'},
            headerLeft: () => (
              <View style={{}}>
                <HeaderBar />
              </View>
            ),
            headerRight: () => <View />,
          }}
        />

        {/* CATEGORIES LIST */}
        <Stack.Screen
          name="CategoriesList"
          component={CategoriesList}
          options={{
            headerTitle: () => (
              <Text style={styles.headerText}>Categories</Text>
            ),
            headerTintColor: '#fff',
            headerStyle: {backgroundColor: '#252F45'},
            headerBackTitleVisible: false,
            headerBackImage: () => (
              <FontAwesome name="angle-left" size={25} color="#fff" />
            ),
          }}
        />

        {/* BRAND INFO */}
        <Stack.Screen
          name="BrandInfo"
          component={BrandInfo}
          options={{
            headerTitle: () => <Text style={styles.headerText}>Brand</Text>,
            headerTintColor: '#fff',
            headerStyle: {backgroundColor: '#252F45'},
            headerBackTitleVisible: false,
            headerBackImage: () => (
              <FontAwesome name="angle-left" size={25} color="#fff" />
            ),
          }}
        />

        {/* CATEGORY LIST */}
        <Stack.Screen
          name="CategoryList"
          component={CategoryList}
          options={{
            headerTitle: () => <Text style={styles.headerText}>Category</Text>,
            headerTintColor: '#fff',
            headerStyle: {backgroundColor: '#20B038'},
            headerBackTitleVisible: false,
            headerBackImage: () => (
              <FontAwesome name="angle-left" size={25} color="#fff" />
            ),
          }}
        />

        {/* BRAND LIST */}
        <Stack.Screen
          name="BrandList"
          component={BrandList}
          options={{
            headerTitle: () => <Text style={styles.headerText}>Brand</Text>,
            headerTintColor: '#fff',
            headerStyle: {backgroundColor: '#20B038'},
            headerBackTitleVisible: false,
            headerBackImage: () => (
              <FontAwesome name="angle-left" size={25} color="#fff" />
            ),
          }}
        />

        {/* SINGLE VOUCHER */}
        <Stack.Screen
          name="SingleVoucher"
          component={SingleVoucher}
          options={{
            headerTitle: () => (
              <Text style={styles.headerText}>Product Voucher</Text>
            ),
            headerTintColor: '#fff',
            headerStyle: {backgroundColor: '#20B038'},
            headerBackTitleVisible: false,
            headerBackImage: () => (
              <FontAwesome name="angle-left" size={25} color="#fff" />
            ),
          }}
        />

        {/* TOPUP LIST */}
        <Stack.Screen
          name="TopupList"
          component={TopupList}
          options={{
            headerTitle: () => (
              <Text style={styles.headerText}>Direct Top-up</Text>
            ),
            headerTintColor: '#fff',
            headerStyle: {backgroundColor: '#20B038'},
            headerBackTitleVisible: false,
            headerBackImage: () => (
              <FontAwesome name="angle-left" size={25} color="#fff" />
            ),
          }}
        />

        {/* TOPUP BRAND LIST */}
        <Stack.Screen
          name="TopupBrandList"
          component={TopupBrandList}
          options={{
            // headerShown: true,
            headerTitle: () => (
              <Text style={styles.headerText}>Direct Top-up</Text>
            ),
            headerTintColor: '#fff',
            headerStyle: {
              backgroundColor: '#20B038',
            },
            headerBackImage: () => (
              <FontAwesome name="angle-left" size={25} color="#fff" />
            ),
            headerBackTitleVisible: false,
          }}
        />

        {/* SINGLE TOPUP */}
        <Stack.Screen
          name="SingleTopup"
          component={SingleTopup}
          options={{
            headerTitle: () => <Text style={styles.headerText}>Topup</Text>,
            headerTintColor: '#fff',
            headerStyle: {backgroundColor: '#20B038'},
            headerBackTitleVisible: false,
            headerBackImage: () => (
              <FontAwesome name="angle-left" size={25} color="#fff" />
            ),
          }}
        />

        {/* PAYMENT VIEW */}

        {/* SINGLE ORDER VIEW */}
        <Stack.Screen
          name="SingleOrderView"
          component={SingleOrderView}
          options={{
            headerTitle: () => <Text style={styles.headerText}>Order</Text>,
            headerTintColor: '#fff',
            headerStyle: {backgroundColor: '#20B038'},
            headerBackTitleVisible: false,
            headerBackImage: () => (
              <FontAwesome name="angle-left" size={25} color="#fff" />
            ),
          }}
        />

        {/* THANK YOU */}
        <Stack.Screen
          name="ThankYouScreen"
          component={ThankYouScreen}
          options={{
            headerShown: false,
          }}
        />

        {/* CANCEL PAYMENT */}
        <Stack.Screen
          name="PaymentCancel"
          component={PaymentCancel}
          options={{
            headerShown: false,
          }}
        />

        {/* TIPS BLOG VIEW */}
        <Stack.Screen
          name="TipsBlogView"
          component={SingleTipsBlogView}
          options={{
            headerTitle: () => (
              <Text style={styles.headerText}>Tips / Blog</Text>
            ),
            headerTintColor: '#fff',
            headerStyle: {backgroundColor: '#20B038'},
            headerBackTitleVisible: false,
            headerBackImage: () => (
              <FontAwesome name="angle-left" size={25} color="#fff" />
            ),
          }}
        />
      </Stack.Navigator>

      {/* Order Modal Loader */}
      <OrderModal loading={openModalData} />
    </>
  );
};

export default MainStack;

const styles = StyleSheet.create({
  imageCss: {
    width: 150,
    height: 30,
  },
  headerText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
});
