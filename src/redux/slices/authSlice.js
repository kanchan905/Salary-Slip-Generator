import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import axiosInstance, { updateToken } from "global/AxiosSetting";
import { deleteCookie, getCookie, setCookie } from 'cookies-next';

// Async thunk for login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/login", credentials);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.errorMsg || "Login failed");
    }
  }
);

// Async thunk to fetch current logged-in user
export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/user");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch user data");
    }
  }
);

//forget password working 

export const sendPasswordResetOtp = createAsyncThunk(
  'auth/sendPasswordResetOtp',
  async ({ email }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/forgot-password', { email });
      return response.data; 
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to send OTP. Please try again.';
      return rejectWithValue(errorMessage);
    }
  }
);


export const verifyOtpAndGetToken = createAsyncThunk(
  'auth/verifyOtpAndGetToken',
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/verify-otp', { email, otp });
      if (!response.data.reset_token) {
        return rejectWithValue('Verification failed: No reset token received.');
      }
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Invalid OTP or an error occurred.';
      return rejectWithValue(errorMessage);
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ email, reset_token, password }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/reset-password', { email, reset_token, password });
      return response.data; 
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to reset password. The token may be invalid or expired.';
      return rejectWithValue(errorMessage);
    }
  }
);


export const appLogout = createAction('app/logout');


// Initial state based on localStorage data
const getInitialState = () => {
  // let token = localStorage.getItem('token');
  let token = getCookie('token');
  if (token) updateToken(token);
  let user = null;

  try {
    const encodedUser = getCookie('user'); // Get the raw cookie string
    if (encodedUser) {
      const decodedUser = decodeURIComponent(encodedUser); // Decode it
      user = JSON.parse(decodedUser); // Parse to object
    }
  } catch (err) {
    user = null;
  }


  return {
    user: user || null,
    token: token || null,
    isLoggedIn: Boolean(user && token),
    loading: false,
    error: null,
  };
};


const authSlice = createSlice({
  name: "auth",
  initialState: getInitialState(),
  reducers: {
    login: (state, action) => {
      state.isLoggedIn = true;
      state.token = action.payload.token;
      updateToken(action.payload.token);
      setCookie('token', action.payload.token, { path: '/', maxAge: 60 * 60 * 24 });
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      state.isLoggedIn = false;

      deleteCookie('token');
      deleteCookie('user');
      updateToken('');
    },
    clearAuth: (state) => {
      state.user = null;
      state.token = null;
      state.isLoggedIn = false;

      deleteCookie('token');
      deleteCookie('user');
      updateToken('');
    },
  },
  extraReducers: (builder) => {
    builder
      // loginUser
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.isLoggedIn = true;

        setCookie('token', action.payload.token, { path: '/', maxAge: 60 * 60 * 24 });
        updateToken(action.payload.token); // Update Axios token globally
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // fetchCurrentUser
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data;

        setCookie('user', JSON.stringify(action.payload.data), { path: '/', maxAge: 60 * 60 * 24 });
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
       // Handlers for sendPasswordResetOtp
      .addCase(sendPasswordResetOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendPasswordResetOtp.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(sendPasswordResetOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handlers for verifyOtpAndGetToken
      .addCase(verifyOtpAndGetToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtpAndGetToken.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(verifyOtpAndGetToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Handlers for resetPassword
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { login, logout, clearAuth } = authSlice.actions;
export default authSlice.reducer;
