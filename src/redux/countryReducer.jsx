/* eslint-disable prettier/prettier */
import AsyncStorage from '@react-native-async-storage/async-storage';
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import instance from '../axios/api';

const initialState = {
  countryData: null,
  countryName: '',
  currentCountry: '',
  loading: false,
  error: null,
  loginValue: false,
};

export const userCountryDetails = createAsyncThunk(
  'country/userCountryDetails',
  async ({countryName, countryData}, {rejectWithValue}) => {
    try {
      // Sending the POST request to the API
      const response = await instance.post('/api', countryData);
      await AsyncStorage.setItem('Country_data', JSON.stringify(countryName));
      await AsyncStorage.setItem(
        'AllCountry_details',
        JSON.stringify(response.data),
      );

      return {
        data: response.data,
        countryName: countryName,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Something Went Wrong');
    }
  },
);

const CountrySlice = createSlice({
  name: 'country',
  initialState,
  reducers: {
    setCountryName: (state, action) => {
      state.currentCountry = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(userCountryDetails.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userCountryDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.countryData = action.payload.data;

        // Extract the country list from the response
        const countryList = action.payload.data?.data || [];

        // Check if the countryName exists in the list
        const found = countryList.some(
          item =>
            item.name?.toLowerCase() ===
            action.payload.countryName.toLowerCase(),
        );

        // Set currentCountry based on match
        state.currentCountry = found ? action.payload.countryName : 'Global'; // fallback to Global if not found
      })

      .addCase(userCountryDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {setCountryName} = CountrySlice.actions;
export default CountrySlice.reducer;
