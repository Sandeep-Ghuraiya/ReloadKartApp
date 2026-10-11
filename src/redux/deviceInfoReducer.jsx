/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import AsyncStorage from '@react-native-async-storage/async-storage';
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';

const initialState = {
  deviceInfoData: null,
  loading: false,
  error: null,
};

const DeviceInfoSlice = createSlice({
  name: 'deviceInfo',
  initialState,
  reducers: {
    setDeviceInfo: (state, action) => {
      state.deviceInfoData = action.payload;
      AsyncStorage.setItem('device_info', JSON.stringify(action.payload));
    },
  },
});

export const {setDeviceInfo} = DeviceInfoSlice.actions;
export default DeviceInfoSlice.reducer;
