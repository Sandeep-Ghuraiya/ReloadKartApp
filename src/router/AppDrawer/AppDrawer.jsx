/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Text, View} from 'react-native';
import {createDrawerNavigator} from '@react-navigation/drawer';
//Icons
import {Ionicons} from '@react-native-vector-icons/ionicons';
import {MaterialDesignIcons} from '@react-native-vector-icons/material-design-icons';
// Screens
import CustomDrawerContent from '../../components/CustomDrawerContent';
import HeaderBar from '../../components/HeaderBar';
import MainStack from '../AppStack/MainStack';
import ProfileScreen from '../../screens/drawerScreens/ProfileScreen';
import OrderListScreen from '../../screens/mainScreens/OrderListScreen';
import TipsBlogList from '../../screens/drawerScreens/TipsBlogList';
import PrivacyPolicy from '../../screens/drawerScreens/PrivacyPolicy';
import TermsAndCondition from '../../screens/drawerScreens/TermsAndCondition';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerType: 'slide',
        headerShown: false,
        drawerActiveBackgroundColor: '#ccf8d3ff',
        drawerActiveTintColor: '#20B038',
        drawerInactiveTintColor: '#fff',
        drawerLabelStyle: {
          fontSize: 14,
          textTransform: 'uppercase',
          fontWeight: '500',
        },
        drawerStyle: {
          backgroundColor: '#252F45',
          width: '80%',
        },
      }}
      drawerContent={props => <CustomDrawerContent {...props} />}>
      {/* HOME */}
      <Drawer.Screen
        name="Home"
        component={MainStack}
        options={{
          drawerLabel: 'Home',
          drawerIcon: ({color}) => (
            <Ionicons name="home-outline" size={22} color={color} />
          ),
        }}
      />

      {/* PROFILE */}
      <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          drawerLabel: 'Profile',
          headerShown: true,
          drawerIcon: ({color}) => (
            <Ionicons name="person-outline" size={22} color={color} />
          ),
          headerLeft: () => (
            <View style={{marginLeft: 10}}>
              <HeaderBar />
            </View>
          ),
          headerTitleAlign: 'center',
          headerStyle: {backgroundColor: '#20B038'},
          headerTitle: () => (
            <Text style={{fontSize: 16, color: '#fff', fontWeight: '500'}}>
              Profile
            </Text>
          ),
        }}
      />

      {/* Blogs */}
      <Drawer.Screen
        name="TipsAndBlog"
        component={TipsBlogList}
        options={{
          drawerLabel: 'Tips / Blog',
          headerShown: true,
          drawerIcon: ({color}) => (
            <MaterialDesignIcons name="lightbulb-on" size={22} color={color} />
          ),
          headerLeft: () => (
            <View style={{marginLeft: 10}}>
              <HeaderBar />
            </View>
          ),
          headerTitleAlign: 'center',
          headerStyle: {backgroundColor: '#20B038'},
          headerTitle: () => (
            <Text style={{fontSize: 16, color: '#fff', fontWeight: '500'}}>
              Tips / Blog
            </Text>
          ),
        }}
      />

      {/* ORDER LIST */}
      <Drawer.Screen
        name="OrderList"
        component={OrderListScreen}
        options={{
          drawerLabel: 'Order List',
          headerShown: true,
          drawerIcon: ({color}) => (
            <Ionicons name="list-outline" size={22} color={color} />
          ),
          headerLeft: () => (
            <View style={{marginLeft: 10}}>
              <HeaderBar />
            </View>
          ),
          headerTitleAlign: 'center',
          headerStyle: {backgroundColor: '#20B038'},
          headerTitle: () => (
            <Text style={{fontSize: 16, color: '#fff', fontWeight: '500'}}>
              Order List
            </Text>
          ),
        }}
      />

      <Drawer.Screen
        name="PrivacyPolicy"
        component={PrivacyPolicy}
        options={{
          drawerLabel: 'Privacy Policy',
          headerShown: true,
          headerLeft: () => (
            <View style={{marginLeft: 10}}>
              <HeaderBar />
            </View>
          ),
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: '#20B038',
          },
          headerTitle: () => (
            <>
              <Text style={{fontSize: 16, color: '#fff', fontWeight: '500'}}>
                Privacy Policy
              </Text>
            </>
          ),
        }}
      />
      <Drawer.Screen
        name="TermsAndCondition"
        component={TermsAndCondition}
        options={{
          drawerLabel: 'Terms And Condition',
          headerShown: true,
          headerLeft: () => (
            <View style={{marginLeft: 10}}>
              <HeaderBar />
            </View>
          ),
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: '#20B038',
          },
          headerTitle: () => (
            <>
              <Text style={{fontSize: 16, color: '#fff', fontWeight: '500'}}>
                Terms and Condition
              </Text>
            </>
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
