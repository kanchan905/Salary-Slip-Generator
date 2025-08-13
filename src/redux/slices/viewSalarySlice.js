import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "global/AxiosSetting";

export const fetchViewSalary = createAsyncThunk(
  "viewSalary/fetchViewSalary",
  async ({ page, limit, month, year, is_verified }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/view-salary?page=${page}&limit=${limit}&month=${month || ''}&year=${year || ''}&is_verified=${is_verified || ''}`);
      return {
        data: response.data.data,
        totalCount: response.data.total_count
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch view salary data");
    }
  }
);


const initialState = {
  viewSalary: [],
  totalCount: 0,
  loading: false,
  error: null
}

const viewSalarySlice = createSlice({
  name: 'viewSalary',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchViewSalary.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(fetchViewSalary.fulfilled, (state, action) => {
        state.loading = false;
        state.viewSalary = action.payload.data;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(fetchViewSalary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  }
})

export default viewSalarySlice.reducer; 