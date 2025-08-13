import axios from 'axios';
import { API_URL } from './Global';
import { deleteCookie } from 'cookies-next';
import { handleAuthError, clearSessionData } from '../utils/helpers';

let authToken = "";
let store = null;

export function updateToken(token) {
  authToken = token;
}

// Function to set store reference (called from index.js)
export function setStore(storeInstance) {
  store = storeInstance;
}

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    Accept: 'application/json',
    Authorization: 'Bearer ' + authToken,
  },
});

axiosInstance.interceptors.request.use(function (config) {
  if (authToken) {
    config.headers['Authorization'] = `Bearer ${authToken}`
  }

  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});

// Enhanced response interceptor to handle authentication errors
axiosInstance.interceptors.response.use(
  function (response) {
    return response;
  },
  async function (error) {
    // Use helper function to detect authentication errors
    const authErrorDetected = handleAuthError(error);
    
    if (authErrorDetected) {
      // Clear session data
      clearSessionData();
      
      // Dispatch Redux action if store is available
      if (store) {
        const { clearAuth, invalidateSession } = await import('../redux/slices/authSlice');
        
        if (error.response?.data?.message?.toLowerCase().includes('unauthenticated')) {
          store.dispatch(invalidateSession("Token invalidated by server - please login again"));
        } else {
          store.dispatch(clearAuth());
        }
      }
      
      // Redirect to login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    } else {
      // Handle other types of errors here if needed
      console.error('API Error:', error);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
