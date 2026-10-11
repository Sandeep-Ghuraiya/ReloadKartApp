/* eslint-disable quotes */
import axios from 'axios';
import {handleApiError} from '../commonFunction/handleApiError';

// POS API Axios Instance
const instance = axios.create({
  baseURL: 'https://reloadkart.com/wp-json/pos/v1',
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer Y2tfMjVhMjExNjgxY2Y4YWZkZTUwMzdmOWUzNDQzYzgxNjM4NTg4ZjZhOA==`,
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
