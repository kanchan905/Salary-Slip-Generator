import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance, { updateToken } from "global/AxiosSetting";
import { deleteCookie, getCookie, setCookie } from 'cookies-next';

// Async thunk for login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/user-login", credentials);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Login failed");
    }
  }
);

// Initial state based on localStorage data
const getInitialState = () => {
  // let token = localStorage.getItem('token');
  let token = getCookie('token');
  let user = {email:"admin@gmail.com" , password:'123456'} || null;

  try {
    const encodedUser = getCookie('user'); // Get the raw cookie string
    if (encodedUser) {
      const decodedUser = decodeURIComponent(encodedUser); // Decode it
      user = JSON.parse(decodedUser); // Parse to object
    }
  } catch (err) {
    console.error("Failed to parse user cookie:", err);
    user = {email:"admin@gmail.com" , password:'123456'} || null;
  }


  return {
    user: user || {email:"admin@gmail.com" , password:"123456"},
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
      state.user = {email:"admin@gmail.com" , password:"123456"} || action.payload.user;
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      state.isLoggedIn = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        console.log(action.payload.data)
        state.loading = false;
        state.user = action.payload.data;
        state.token = action.payload.token;
        state.isLoggedIn = true;
        setCookie('token', action.payload.token, { path: '/', maxAge: 60 * 60 * 24 }); // 1 day expiration
        setCookie('user', JSON.stringify(action.payload.data), { path: '/', maxAge: 60 * 60 * 24 });
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;