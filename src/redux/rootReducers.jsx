/* eslint-disable prettier/prettier */
import {combineReducers} from '@reduxjs/toolkit';
import CounterSlice from './counterReducer';
import CountrySlice from './countryReducer';
import LoginSlice from './loginReducer';
import OrderSlice from './orderReducer';
import SettingSlice from './settingReducer';
import VoucherSlice from './voucherReducer';
import DeviceInfoSlice from './deviceInfoReducer';

const rootReducer = combineReducers({
  userDetails: LoginSlice,
  vouchers: VoucherSlice,
  country: CountrySlice,
  counters: CounterSlice,
  orders: OrderSlice,
  setting: SettingSlice,
  deviceInfo: DeviceInfoSlice,
});

export default rootReducer;
