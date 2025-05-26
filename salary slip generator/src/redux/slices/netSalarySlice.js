import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "global/AxiosSetting";


export const fetchNetSalary = createAsyncThunk(
  "salary/fetchNetSalary",
  async ({id,page,limit}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/salary?page=${page}&limit=${limit}&employee_id=${id}`);
      return {
        data: response.data.data,
        totalCount: response.data.total_count
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch employees");
    }
  }
);

export const createNetSalary = createAsyncThunk(
  "salary/createNetSalary",
  async (values, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/salary", values);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const updateNetSalary = createAsyncThunk(
  "salary/updateNetSalary",
  async ({ id, values }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/salary/${id}?_method=PUT`, values);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const viewNetSalary = createAsyncThunk(
  "salary/viewNetSalary",
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/salary/${id}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const initialState = {
  netSalary: [],
  netSalaryData : null,
  totalCount: 0,
  loading: false,
  error: null
}

const netSalarySlice = createSlice({
  name: 'netSalary',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchNetSalary.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(fetchNetSalary.fulfilled, (state, action) => {
        state.loading = false;
        state.netSalary = action.payload.data;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(fetchNetSalary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createNetSalary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNetSalary.fulfilled, (state, action) => {
        state.loading = false;
        state.netSalary.push(action.payload);
      })
      .addCase(createNetSalary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateNetSalary.pending, (state) => {
        // state.loading = true;
        state.error = null;
      })
      .addCase(updateNetSalary.fulfilled, (state, action) => {
        const updatedLoan = action.payload;
        const index = state.netSalary.findIndex(a => a.id === action.payload.id);
        if (index !== -1) {
          state.netSalary[index] = {
            ...state.netSalary[index], ...updatedLoan
          };
        }
        state.loading = false;
      })
      .addCase(updateNetSalary.rejected, (state, action) => {
        // state.loading = false;
        state.error = action.payload;
      })
      .addCase(viewNetSalary.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(viewNetSalary.fulfilled, (state, action) => {
        state.loading = false;
        state.netSalaryData = action.payload.data;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(viewNetSalary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  }
})

export default netSalarySlice.reducer;