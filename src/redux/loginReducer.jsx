/* eslint-disable prettier/prettier */
/* eslint-disable curly */
import AsyncStorage from '@react-native-async-storage/async-storage';
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import instance from '../axios/api';

/* INITIAL STATE  */
const initialState = {
  loginData: null,
  loginOtpData: null,
  setMpinData: null,
  loginMpinData: null,
  mpinEmailData: null,
  forgotMpinData: null,
  userGeneralData: null,
  resetMpinData: null,
  updatedProfileData: null,

  isLoggedIn: false,
  loading: false,
  error: null,
};

/* GENERIC API THUNK */
const createPostThunk = (type, storageKey = null) =>
  createAsyncThunk(type, async (payload, {rejectWithValue}) => {
    try {
      const response = await instance.post('/api', payload);

      if (storageKey && response.data?.status === 1) {
        await AsyncStorage.setItem(storageKey, JSON.stringify(response?.data));
      }

      return response?.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Something Went Wrong');
    }
  });

/* THUNKS */
export const userLoginDetails = createPostThunk('user/userLoginDetails');

export const userLoginOtp = createPostThunk('user/userLoginOtp', 'otp_login');

export const userSetMpin = createPostThunk('user/userSetMpin', 'set_mpin');

export const loginWithMpin = createPostThunk(
  'user/loginWithMpin',
  'login_data',
);

export const forgotMpinEmail = createPostThunk('user/forgotMpinEmail');

export const setForgotMpin = createPostThunk('user/setForgotMpin');

export const userGeneralDetails = createPostThunk(
  'user/userGeneralDetails',
  'user_data',
);

export const resetMpinDetails = createPostThunk('user/resetMpinDetails');

export const userUpdatedProfile = createPostThunk(
  'user/updatedProfile',
);

/* GENERIC REDUCER HANDLERS */
const pending = state => {
  state.loading = true;
  state.error = null;
};

const rejected = (state, action) => {
  state.loading = false;
  state.error = action.payload;
};

const fulfilled = key => (state, action) => {
  state.loading = false;
  state[key] = action.payload;
};

/* SLICE */
const LoginSlice = createSlice({
  name: 'userLogin',
  initialState,

  reducers: {
    setLogoutFunction: (state, action) => {
      state.isLoggedIn = action.payload;

      if (!action.payload) {
        state.loginData = null;
        state.loginOtpData = null;
        state.setMpinData = null;
        state.loginMpinData = null;

        AsyncStorage.multiRemove(['login_data']);
      }
    },

    clearResponseData: (state, action) => {
      const map = {
        loginEmail: 'loginData',
        loginOtp: 'loginOtpData',
        setMpin: 'setMpinData',
        enterMpin: 'loginMpinData',
        forgotEmail: 'mpinEmailData',
        forgotMpin: 'forgotMpinData',
        resetMpin: 'resetMpinData',
      };

      const key = map[action.payload];
      if (key) state[key] = null;
    },

    clearUserResponse: state => {
      state.updatedProfileData = null;
    },
  },

  extraReducers: builder => {
    builder
      .addCase(userLoginDetails.pending, pending)
      .addCase(userLoginDetails.fulfilled, fulfilled('loginData'))
      .addCase(userLoginDetails.rejected, rejected)

      .addCase(userLoginOtp.pending, pending)
      .addCase(userLoginOtp.fulfilled, fulfilled('loginOtpData'))
      .addCase(userLoginOtp.rejected, rejected)

      .addCase(userSetMpin.pending, pending)
      .addCase(userSetMpin.fulfilled, fulfilled('setMpinData'))
      .addCase(userSetMpin.rejected, rejected)

      .addCase(loginWithMpin.pending, pending)
      .addCase(loginWithMpin.fulfilled, fulfilled('loginMpinData'))
      .addCase(loginWithMpin.rejected, rejected)

      .addCase(forgotMpinEmail.pending, pending)
      .addCase(forgotMpinEmail.fulfilled, fulfilled('mpinEmailData'))
      .addCase(forgotMpinEmail.rejected, rejected)

      .addCase(setForgotMpin.pending, pending)
      .addCase(setForgotMpin.fulfilled, fulfilled('forgotMpinData'))
      .addCase(setForgotMpin.rejected, rejected)

      .addCase(userGeneralDetails.pending, pending)
      .addCase(userGeneralDetails.fulfilled, fulfilled('userGeneralData'))
      .addCase(userGeneralDetails.rejected, rejected)

      .addCase(resetMpinDetails.pending, pending)
      .addCase(resetMpinDetails.fulfilled, fulfilled('resetMpinData'))
      .addCase(resetMpinDetails.rejected, rejected)

      .addCase(userUpdatedProfile.pending, pending)
      .addCase(userUpdatedProfile.fulfilled, fulfilled('updatedProfileData'))
      .addCase(userUpdatedProfile.rejected, rejected);
  },
});

/* EXPORTS */
export const {setLogoutFunction, clearResponseData, clearUserResponse} =
  LoginSlice.actions;

export default LoginSlice.reducer;
