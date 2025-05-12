import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
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
      return rejectWithValue(error.response?.data || "Login failed");
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const token = getCookie("token");

      if (!token) {
        throw new Error("Token is missing");
      }

      const response = await axiosInstance.get("/user", {
        headers: { Authorization: `Bearer ${token}` }
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch user data");
    }
  }
);



// Initial state based on localStorage data
const getInitialState = () => {
  // let token = localStorage.getItem('token');
  let token = getCookie('token');
  let user = null;

  try {
    const encodedUser = getCookie('user'); // Get the raw cookie string
    if (encodedUser) {
      const decodedUser = decodeURIComponent(encodedUser); // Decode it
      user = JSON.parse(decodedUser); // Parse to object
    }
  } catch (err) {
    console.error("Failed to parse user cookie:", err);
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
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      state.isLoggedIn = false;
      // Set cookies to expire immediately
      setCookie('token', '', { path: '/', maxAge: -1 });
      setCookie('user', '', { path: '/', maxAge: -1 });

      console.log("Cookies deleted:", getCookie('token'), getCookie('user'));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.isLoggedIn = true;
        setCookie('token', action.payload.token, { path: '/', maxAge: 60 * 60 * 24 }); // 1 day expiration
        fetchCurrentUser();
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
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
      });
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;