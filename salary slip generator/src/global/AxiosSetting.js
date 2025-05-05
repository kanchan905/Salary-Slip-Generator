import axios from 'axios';
import { API_URL } from './Global';


let authToken = "";

export function updateToken(token) {
  // console.log({authToken, token})
  // console.log("axioss", {authToken, token})
  authToken = token;
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


// Intercept responses for errors, particularly 401 (unauthorized)
axiosInstance.interceptors.response.use(
  function (response) {
    return response;
  },
  async function (error) {
    // console.log("RESPONSE_ERR: ", error);
    if (error.status === 401) {
      (async function() {
        const { clearAuth } = await import('../redux/slices/authSlice');
        const { store } = await import('../redux/store');
        store?.dispatch(clearAuth());
      })()
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
