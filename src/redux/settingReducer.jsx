/* eslint-disable prettier/prettier */
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import instance from '../axios/api';

const initialState = {
  settingData: null,
  tipsData: [],
  blogData: null,

  activeReload: false,

  loading: false, // initial load
  loadMore: false, // pagination loader

  error: null,
  page: 1,
  hasMore: true,
};

/* ✅ GENERAL SETTINGS */
export const generalSetting = createAsyncThunk(
  'country/generalSetting',
  async (payload, {rejectWithValue}) => {
    try {
      const response = await instance.post('/api', payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Something Went Wrong');
    }
  },
);

/* ✅ BLOG API WITH PAGE */
export const tipsBlog = createAsyncThunk(
  'country/tipsBlog',
  async (payload, {rejectWithValue}) => {
    try {
      const response = await instance.post('/api', payload);

      return {
        ...response.data,
        currentPage: payload.page, // 👈 IMPORTANT
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Something Went Wrong');
    }
  },
);

const SettingSlice = createSlice({
  name: 'country',
  initialState,
  reducers: {
    setActiveReloader: (state, action) => {
      state.activeReload = action.payload;
    },

    resetTipsData: state => {
      state.tipsData = [];
      state.page = 1;
      state.hasMore = true;
    },
  },
  extraReducers: builder => {
    builder
      /* ================= GENERAL ================= */
      .addCase(generalSetting.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generalSetting.fulfilled, (state, action) => {
        state.loading = false;
        state.settingData = action.payload.data;
      })
      .addCase(generalSetting.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ================= BLOG ================= */
      .addCase(tipsBlog.pending, (state, action) => {
        state.error = null;

        if (action.meta.arg.page === 1) {
          state.loading = true; // full loader
        } else {
          state.loadMore = true; // footer loader
        }
      })
      .addCase(tipsBlog.fulfilled, (state, action) => {
        const newData = Array.isArray(action.payload?.data)
          ? action.payload.data
          : [];

        const currentPage = action.payload.currentPage;

        state.loading = false;
        state.loadMore = false;

        // ✅ Pagination Logic (FIXED)
        if (currentPage === 1) {
          state.tipsData = newData;
        } else {
          state.tipsData = [...state.tipsData, ...newData];
        }

        state.blogData = action.payload;

        // ✅ Has More Check
        if (newData.length === 0) {
          state.hasMore = false;
        } else {
          state.page = currentPage;
        }
      })
      .addCase(tipsBlog.rejected, (state, action) => {
        state.loading = false;
        state.loadMore = false;
        state.error = action.payload;
      });
  },
});

export const {setActiveReloader, resetTipsData} = SettingSlice.actions;

export default SettingSlice.reducer;
