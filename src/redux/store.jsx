/* eslint-disable prettier/prettier */
import {configureStore} from '@reduxjs/toolkit';
import rootReducer from './rootReducers';

const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable this check for non-serializable values
    }), // Ensure thunk is properly added
});

export default store;
