import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "global/AxiosSetting";

export const fetchAllUserData = createAsyncThunk(
  "user/fetchAllUserData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/all-users`);
      return {
        data: response.data.data,
        totalCount: response.data.total_count,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to update employee"
      );
    }
  }
);

export const fetchUserData = createAsyncThunk(
  "user/fetchUserData",
  async ({ page, limit, search, institute,status }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/users?page=${page}&limit=${limit}&search=${search}&institute=${institute}&status=${status}`
      );
      return {
        data: response.data.data,
        totalCount: response.data.total_count,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to update employee"
      );
    }
  }
);

export const createUserData = createAsyncThunk(
  "user/createUserData",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/user", userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to create user");
    }
  }
);

export const updateUserData = createAsyncThunk(
  "user/updateUserData",
  async ({ formData, id }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/user/${id}`, formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to update user");
    }
  }
);

export const changeUserStatus = createAsyncThunk(
  "user/changeUserStatus",
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/user-status/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to change user status"
      );
    }
  }
);

export const changeUserPassword = createAsyncThunk(
  "user/changeUserPassword",
  async ({ id, password }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/user/change-password/${id}`, {
        password,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to change password"
      );
    }
  }
);

export const assignUserRoles = createAsyncThunk(
  "user/assignUserRoles",
  async ({ id, roles }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/user/assign-roles/${id}`, {
        roles,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to assign roles");
    }
  }
);

export const removeUserRoles = createAsyncThunk(
  "user/removeUserRoles",
  async ({ id, roles }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/user/remove-roles/${id}`, {
        roles,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to remove roles");
    }
  }
);

const initialState = {
  users: [],
  allUsers: [],
  totalCount: 0,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllUserData.fulfilled, (state, action) => {
        state.loading = false;
        state.allUsers = action.payload.data;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(fetchUserData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.data;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createUserData.pending, (state) => {
        // state.loading = true;
      })
      .addCase(createUserData.fulfilled, (state, action) => {
        state.loading = false;
        state.users.push(action.payload);
      })
      .addCase(createUserData.rejected, (state, action) => {
        // state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateUserData.pending, (state) => {
        // state.loading = true;
      })
      .addCase(updateUserData.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.users.findIndex(
          (user) => user.id === action.payload.id
        );
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(updateUserData.rejected, (state, action) => {
        // state.loading = false;
        state.error = action.error.message;
      })
      .addCase(changeUserStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.users.findIndex(
          (user) => user.id === action.payload.id
        );
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      // Reducers for the new password change action
      .addCase(changeUserPassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(changeUserPassword.fulfilled, (state) => {
        state.loading = false;
        // No state change needed here, success is handled in the component
      })
      .addCase(changeUserPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default userSlice.reducer;
