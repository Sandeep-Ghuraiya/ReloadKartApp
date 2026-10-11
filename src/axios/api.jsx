/* eslint-disable quotes */
import axios from 'axios';
import {MAIN_API_URL, MAIN_AUTHORIZATION_KEY} from '@env';
import {handleApiError} from '../commonFunction/handleApiError';

console.log(typeof MAIN_AUTHORIZATION_KEY);

// POS API Axios Instance
const instance = axios.create({
  baseURL: MAIN_API_URL,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${MAIN_AUTHORIZATION_KEY}`,
  },
});

instance.interceptors.response.use(
  response => response,
  error => {
    handleApiError(error);
    return Promise.reject(error);
  },
);

// Named exports
export default instance;
