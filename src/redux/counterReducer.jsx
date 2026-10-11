// redux/counterSlice.js
import {createSlice} from '@reduxjs/toolkit';

// Define initial state
const initialState = {
  touchCount: 0,
};

// Create slice
const CounterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    incrementCount: state => {
      state.touchCount += 1;
    },
    resetCounter: state => {
      state.touchCount = 0;
    },
  },
});

// Export the action
export const {incrementCount, resetCounter} = CounterSlice.actions;

// Export the reducer to be used in the store
export default CounterSlice.reducer;
