import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "global/AxiosSetting";

export const fetchViewPension = createAsyncThunk(
  "viewPension/fetchViewPension",
  async ({ page, limit, month, year }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/view-pension?page=${page}&limit=${limit}&month=${month || ''}&year=${year || ''}`);
      
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
  viewPension: [],
  totalCount: 0,
  loading: false,
  error: null
}

const viewPensionSlice = createSlice({
  name: 'viewPension',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchViewPension.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(fetchViewPension.fulfilled, (state, action) => {
        state.loading = false;
        state.viewPension = action.payload.data;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(fetchViewPension.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  }
})

export default viewPensionSlice.reducer; 