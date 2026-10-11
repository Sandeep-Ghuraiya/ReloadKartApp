/* eslint-disable prettier/prettier */
/* eslint-disable no-shadow */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
import {setLogoutFunction} from '../redux/loginReducer';
import {getOrder} from '../redux/orderReducer';
import {incrementCount} from '../redux/counterReducer';
import useLoginData from '../hooks/useLoginData';

import {Ionicons} from '@react-native-vector-icons/ionicons';
import {AntDesign} from '@react-native-vector-icons/ant-design';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';
import {CommonActions} from '@react-navigation/native';

import {useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Divider} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';

import LogoImage from './LogoImage';
import {MaterialDesignIcons} from '@react-native-vector-icons/material-design-icons';
import usePopupImage from '../hooks/usePopupImage';
import Feather from '@react-native-vector-icons/feather';

const CustomDrawerContent = props => {
  const {navigation, state} = props;
  const currentRoute = state.routeNames[state.index];

  const {settingData} = useSelector(state => state.setting);
  const {updatedProfileData, userGeneralData} = useSelector(
    state => state.userDetails,
  );
  const {loginDetails} = useLoginData();
  const dispatch = useDispatch();

  const checkImage = usePopupImage();

  const [email, setEmail] = useState('');
  const [version, setVersion] = useState('');
  const [userName, setUserName] = useState('');
  // const [googleEnable, setGoogleEnable] = useState('');
  // const [facebookEnable, setFacebookEnable] = useState('');

  useEffect(() => {
    if (settingData) {
      setVersion(settingData?.mobile_app_version);
    }
  }, [settingData]);

  useEffect(() => {
    if (userGeneralData?.status === 1) {
      setUserName(
        `${userGeneralData?.data?.first_name} ${userGeneralData?.data?.last_name}`,
      );
      setEmail(userGeneralData?.data?.email);
    } else if (loginDetails?.status === 1) {
      setEmail(loginDetails?.data?.email);
      if (
        loginDetails?.data?.first_name === null &&
        loginDetails?.data?.last_name === null
      ) {
        setUserName('');
      } else {
        setUserName(
          `${loginDetails?.data?.first_name} ${loginDetails?.data?.last_name}`,
        );
      }
    }
  }, [loginDetails, userGeneralData]);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('login_data');

      dispatch(setLogoutFunction(false));

      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'EnterMpinScreen'}],
        }),
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleOrderList = () => {
    dispatch(incrementCount(checkImage));
    navigation.navigate('OrderList');

    const orderData = JSON.stringify({
      action: 'get_orders',
      order_id: '',
      user_email: email,
    });

    dispatch(getOrder(orderData));
  };

  const isActive = routeName => currentRoute === routeName;

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={styles.container}>
      <View style={{marginBottom: 30}}>
        <View style={styles.logoView}>
          <LogoImage />
        </View>
        <Divider />
      </View>

      {/* HOME */}
      <DrawerItem
        label="Home"
        labelStyle={[
          styles.navItemLabel,
          {color: isActive('Home') ? '#20B038' : '#fff'},
        ]}
        style={isActive('Home') ? styles.activeStyle : null}
        icon={() => (
          <Ionicons
            name={isActive('Home') ? 'home' : 'home-outline'}
            size={22}
            color={isActive('Home') ? '#20B038' : '#fff'}
          />
        )}
        onPress={() => {
          dispatch(incrementCount(checkImage));
          navigation.navigate('Home');
        }}
      />

      {/* PROFILE */}
      <DrawerItem
        label="Profile"
        labelStyle={[
          styles.navItemLabel,
          {color: isActive('Profile') ? '#20B038' : '#fff'},
        ]}
        style={isActive('Profile') ? styles.activeStyle : null}
        icon={() => (
          <Ionicons
            name={isActive('Profile') ? 'person' : 'person-outline'}
            size={22}
            color={isActive('Profile') ? '#20B038' : '#fff'}
          />
        )}
        onPress={() => {
          dispatch(incrementCount(checkImage));
          navigation.navigate('Profile');
        }}
      />

      {/* TIPS / BLOG */}
      <DrawerItem
        label="Tips / Blog"
        labelStyle={[
          styles.navItemLabel,
          {color: isActive('TipsAndBlog') ? '#20B038' : '#fff'},
        ]}
        style={isActive('TipsAndBlog') ? styles.activeStyle : null}
        icon={() => (
          <MaterialDesignIcons
            name={
              isActive('TipsAndBlog') ? 'lightbulb-on' : 'lightbulb-on-outline'
            }
            size={22}
            color={isActive('TipsAndBlog') ? '#20B038' : '#fff'}
          />
        )}
        onPress={() => {
          dispatch(incrementCount(checkImage));
          navigation.navigate('TipsAndBlog');
        }}
      />

      {/* ORDER LIST */}
      <DrawerItem
        label="Order List"
        labelStyle={[
          styles.navItemLabel,
          {color: isActive('OrderList') ? '#20B038' : '#fff'},
        ]}
        style={isActive('OrderList') ? styles.activeStyle : null}
        icon={() => (
          <Ionicons
            name="list-outline"
            size={22}
            color={isActive('OrderList') ? '#20B038' : '#fff'}
          />
        )}
        onPress={handleOrderList}
      />

      {/* TIPS / BLOG */}
      <DrawerItem
        label="Privacy Policy"
        labelStyle={[
          styles.navItemLabel,
          {color: isActive('PrivacyPolicy') ? '#20B038' : '#fff'},
        ]}
        style={isActive('PrivacyPolicy') ? styles.activeStyle : null}
        icon={() => (
          <MaterialDesignIcons
            name={'security'}
            size={22}
            color={isActive('PrivacyPolicy') ? '#20B038' : '#fff'}
          />
        )}
        onPress={() => {
          dispatch(incrementCount(checkImage));
          navigation.navigate('PrivacyPolicy');
        }}
      />

      {/* TIPS / BLOG */}
      <DrawerItem
        label="Terms And Condition"
        labelStyle={[
          styles.navItemLabel,
          {color: isActive('TermsAndCondition') ? '#20B038' : '#fff'},
        ]}
        style={isActive('TermsAndCondition') ? styles.activeStyle : null}
        icon={() => (
          <Feather
            name={'file-text'}
            size={22}
            color={isActive('TermsAndCondition') ? '#20B038' : '#fff'}
          />
        )}
        onPress={() => {
          dispatch(incrementCount(checkImage));
          navigation.navigate('TermsAndCondition');
        }}
      />

      {/* LOGOUT */}
      <View style={styles.versionContainer}>
        <Divider />

        <TouchableOpacity style={styles.logoutView} onPress={handleLogout}>
          <View>
            <Text style={{color: '#fff', fontWeight: '600', fontSize: 16}}>
              Logout
            </Text>
            <Text style={styles.loginText}>{userName}</Text>
          </View>
          <View>
            <AntDesign name="logout" size={26} color={'#fff'} />
          </View>
        </TouchableOpacity>

        <View style={styles.versionView}>
          <Text style={styles.versionText}>{version}</Text>
        </View>
      </View>
    </DrawerContentScrollView>
  );
};

export default CustomDrawerContent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor:'yellow'
  },
  logoView: {
    marginTop: 15,
    marginBottom: 25,
    alignItems: 'center',
  },
  navItemLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  loginContainer: {
    marginBottom: 20,
    marginHorizontal: 10,
  },
  loginText: {
    color: '#fff',
    // marginBottom: 3,
    fontWeight: '600',
    fontSize: 10,
  },
  logoutView: {
    // backgroundColor:'red',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 10,
    marginVertical: 20,
  },
  versionContainer: {
    flexGrow: 1,
    // backgroundColor: 'red',
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
  versionView: {
    marginVertical: 10,
    alignItems: 'center',
  },
  versionText: {
    color: '#fff',
    fontWeight: '600',
  },
  activeStyle: {
    backgroundColor: '#ccf8d3ff',
    borderRadius: 6,
    paddingHorizontal: 6,
    marginHorizontal: 5,
  },
});
