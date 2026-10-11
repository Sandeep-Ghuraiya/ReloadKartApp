/* eslint-disable prettier/prettier */
import AsyncStorage from '@react-native-async-storage/async-storage';
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import instance from '../axios/api';

const initialState = {
  voucherList: null,
  brandList: null,
  categoryList: null,
  topupList: null,
  specialVouchersList: null,
  loading: false,
  voucherLoading: false,
  error: null,
};

export const voucherDataList = createAsyncThunk(
  'voucher/voucherDataList',
  async ({data, voucherData}, {rejectWithValue}) => {
    try {
      // Sending the POST request to the API
      const response = await instance.post('/api', voucherData);

      if (data === 'AllData') {
        await AsyncStorage.setItem(
          'voucher_items',
          JSON.stringify(response.data?.data),
        );
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Something Went Wrong');
    }
  },
);

export const brandListData = createAsyncThunk(
  'voucher/brandListData',
  async (payload, {rejectWithValue}) => {
    try {
      const response = await instance.post('/api', payload);
      await AsyncStorage.setItem(
        'brand_items',
        JSON.stringify(response.data?.data),
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Something Went Wrong');
    }
  },
);

export const categoryListData = createAsyncThunk(
  'voucher/categoryListData',
  async (payload, {rejectWithValue}) => {
    try {
      const response = await instance.post('/api', payload);
      await AsyncStorage.setItem(
        'category_items',
        JSON.stringify(response.data?.data),
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Something Went Wrong');
    }
  },
);

export const topupDataList = createAsyncThunk(
  'voucher/topupDataList',
  async ({data, topupData}, {rejectWithValue}) => {
    try {
      // Sending the POST request to the API
      const response = await instance.post('/api', topupData);

      if (data === 'AllTopupData') {
        await AsyncStorage.setItem(
          'topup_items',
          JSON.stringify(response.data?.data),
        );
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Something Went Wrong');
    }
  },
);

export const specialVouchersDataList = createAsyncThunk(
  'voucher/specialVouchersDataList',
  async (payload, {rejectWithValue}) => {
    try {
      // Sending the POST request to the API
      const response = await instance.post('/api', payload);
      await AsyncStorage.setItem(
        'special_items',
        JSON.stringify(response.data?.data),
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Something Went Wrong');
    }
  },
);

const VoucherSlice = createSlice({
  name: 'vocherData',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(voucherDataList.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(voucherDataList.fulfilled, (state, action) => {
        state.loading = false;
        state.voucherList = action.payload;
      })
      .addCase(voucherDataList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(brandListData.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(brandListData.fulfilled, (state, action) => {
        state.loading = false;
        state.brandList = action.payload;
      })
      .addCase(brandListData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(categoryListData.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(categoryListData.fulfilled, (state, action) => {
        state.loading = false;
        state.categoryList = action.payload;
      })
      .addCase(categoryListData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(topupDataList.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(topupDataList.fulfilled, (state, action) => {
        state.loading = false;
        state.topupList = action.payload;
      })
      .addCase(topupDataList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(specialVouchersDataList.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(specialVouchersDataList.fulfilled, (state, action) => {
        state.loading = false;
        state.specialVouchersList = action.payload;
      })
      .addCase(specialVouchersDataList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {} = VoucherSlice.actions;
export default VoucherSlice.reducer;
