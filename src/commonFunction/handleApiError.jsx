import {Alert} from 'react-native';

export const handleApiError = error => {
  // ⏱ Timeout
  if (error.code === 'ECONNABORTED') {
    Alert.alert(
      'Request Timeout',
      'Server is taking too long to respond. Please try again.',
    );
    return;
  }

  // 🌐 No response from server
  if (error.request && !error.response) {
    Alert.alert(
      'Network Error',
      'Unable to reach the server. Please check your internet connection.',
    );
    return;
  }

  // ❌ Server responded with error
  if (error.response) {
    Alert.alert('Error', 'Network issue' || 'Sever error');
    return;
  }

  // ❗ Unknown error
  Alert.alert('Error', 'Unexpected error occurred');
};
