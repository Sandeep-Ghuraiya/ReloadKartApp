/* eslint-disable prettier/prettier */
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import instance from '../axios/api';

const initialState = {
  createOrderData: null,
  getOrderData: null,
  openModalData: false,
  loading: false,
  error: null,
};

export const createOrder = createAsyncThunk(
  'user/createOrder',
  async (payload, {rejectWithValue}) => {
    try {
      // Sending the POST request to the API
      const response = await instance.post('/api', payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Something Went Wrong');
    }
  },
);

export const getOrder = createAsyncThunk(
  'user/getOrder',
  async (payload, {rejectWithValue}) => {
    try {
      // Sending the POST request to the API
      const response = await instance.post('/api', payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Something Went Wrong');
    }
  },
);

const OrderSlice = createSlice({
  name: 'userLogin',
  initialState,
  reducers: {
    clearOrderResponse: state => {
      state.createOrderData = null;
    },
    orderModalOpen: (state, action) => {
      state.openModalData = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(createOrder.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.createOrderData = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getOrder.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.getOrderData = action.payload;
      })
      .addCase(getOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {clearOrderResponse, orderModalOpen} = OrderSlice.actions;
export default OrderSlice.reducer;
