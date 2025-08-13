import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "global/AxiosSetting";


export const fetchCredits = createAsyncThunk(
  "credits/fetchCredits",
  async ({id,page,limit}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/credit-society-member?employee_id=${id}&page=${page}&limit=${limit}`);
      return {
        data: response.data.data,
        totalCount: response.data.total_count
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch employees");
    }
  }
);

export const createCredit = createAsyncThunk(
  "credits/createCredit",
  async (values, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/credit-society-member", values);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const updateCredit = createAsyncThunk(
  "credits/updateCredit",
  async ({ id, values }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/credit-society-member/${id}?_method=PUT`, values);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const showCredit =  createAsyncThunk(
  "credits/showCredit",
  async ({ id}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/credit-society-member?employee_id=${id}&page=&limit=`);
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const initialState = {
  credits: [],
  showcredit:[],
  totalCount: 0,
  loading: false,
  error: null
}

const creditSlice = createSlice({
  name: 'credit',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchCredits.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(fetchCredits.fulfilled, (state, action) => {
        state.loading = false;
        state.credits = action.payload.data;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(fetchCredits.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createCredit.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCredit.fulfilled, (state, action) => {
        state.loading = false;
        state.credits.push(action.payload);
      })
      .addCase(createCredit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateCredit.pending, (state) => {
        // state.loading = true;
        state.error = null;
      })
      .addCase(updateCredit.fulfilled, (state, action) => {
        const updatedCredit = action.payload;
        const index = state.credits.findIndex(a => a.id === action.payload.id);
        if (index !== -1) {
          state.credits[index] = {
            ...state.credits[index], ...updatedCredit
          };
        }
        state.loading = false;
      })
      .addCase(updateCredit.rejected, (state, action) => {
        // state.loading = false;
        state.error = action.payload;
      })
      .addCase(showCredit.pending,(state,action)=>{
        state.loading = true;
      })
      .addCase(showCredit.fulfilled,(state,action)=>{
        state.showcredit = action.payload;
        state.loading = false;
      })
      .addCase(showCredit.rejected,(state,action)=>{
        state.loading = false;
         state.error = action.payload;
      })
  }
})

export default creditSlice.reducer;