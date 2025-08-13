import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "global/AxiosSetting";


// ------------------ QUARTER ------------------

// Fetch Quarter List
export const fetchQuarterList = createAsyncThunk(
  "quarter/fetchQuarterList",
  async (credentials, { rejectWithValue }) => {
    const { page, limit } = credentials;
    try {
      const response = await axiosInstance.get(`/quarters?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch quarters");
    }
  }
);

// Fetch Quarter Show
export const fetchQuarterShow = createAsyncThunk(
  "quarterShow/fetchQuarterShow",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/quarters/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data.message || "Failed to fetch quarters show");
    }
  }
);

// Fetch Quarter by ID
export const fetchQuarterById = createAsyncThunk(
  "quarter/fetchQuarterById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/quarter/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data.message || "Failed to fetch quarter");
    }
  }
);

// Create Quarter
export const createQuarter = createAsyncThunk(
  "quarter/createQuarter",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/quarters", formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data.message || "Failed to create quarter");
    }
  }
);

// Update Quarter
export const updateQuarter = createAsyncThunk(
  "quarter/updateQuarter",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/quarters/${id}`, formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data.message || "Failed to update quarter");
    }
  }
);


// ------------------ EMPLOYEE QUARTER ------------------

// Fetch Employee Quarter List
export  const fetchEmployeeQuarterList = createAsyncThunk(
  "quarter/fetchEmployeeQuarterList",
  async (credentials, { rejectWithValue }) => {
    const { page, limit} = credentials;
    try {
      const response = await axiosInstance.get(`/employee-quarters?page=${page}&limit=${limit}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data.message || "Failed to fetch employees");
    }
  }
);

// Create Employee Quarter
export const createEmployeeQuarter = createAsyncThunk(
  "quarter/createEmployeeQuarter",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/employee-quarters", formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data.message || "Failed to create employee quarter");
    }
  }
);

// Update Employee Quarter
export const updateEmployeeQuarter = createAsyncThunk(
  "quarter/updateEmployeeQuarter",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/employee-quarters/${id}?_method=PUT`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data.message || "Failed to update employee quarter");
    }
  }
);

// Fetch Employee Quarter Show
export  const fetchEmployeeQuarterShow = createAsyncThunk(
  "employeeQuarterShow/fetchEmployeeQuarterShow",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/employee-quarters/${id}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error?.response?.message || "Failed to fetch employees quarter show");
    }
  }
);

const initialState = {
  employeeQuarterList: [],
  quarterList: [],
  quarterShow: null,
  employeeQuarterShow: null,
  totalCount: 0,
  singleQuarter: null,
  loading: false,
  error: null,    
  updateStatus: 'idle',
};

const quarterSlice = createSlice({
  name: 'quarter',
  initialState,
  extraReducers: (builder) => {
    builder
      // Quarter Reducers
      .addCase(fetchQuarterList.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchQuarterList.fulfilled, (state, action) => {
        state.loading = false;
        state.quarterList = action.payload.data;
        state.totalCount = action.payload.total_count; // Assuming the response contains the total count
      })
      .addCase(fetchQuarterList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchQuarterShow.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchQuarterShow.fulfilled, (state, action) => {
        state.loading = false;
        state.quarterShow = action.payload.data;
      })
      .addCase(fetchQuarterShow.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchQuarterById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchQuarterById.fulfilled, (state, action) => {
        state.loading = false;
        state.singleQuarter = action.payload;
      })
      .addCase(fetchQuarterById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createQuarter.pending, (state) => {
        state.loading = true;
      })
      .addCase(createQuarter.fulfilled, (state, action) => {
        state.loading = false;
        state.quarterList.push(action.payload);
      })
      .addCase(createQuarter.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateQuarter.pending, (state) => {
        state.loading = true;
        state.updateStatus = 'pending';
      })
      .addCase(updateQuarter.fulfilled, (state, action) => {
        state.loading = false;
        state.updateStatus = 'succeeded';
        const updatedQuarter = action.payload;
        const index = state.quarterList.findIndex(q => q.id === updatedQuarter.id);
        if (index !== -1) {
          state.quarterList[index] = updatedQuarter;
        }
      })
      .addCase(updateQuarter.rejected, (state, action) => {
        state.loading = false;
        state.updateStatus = 'failed';
        state.error = action.payload;
      })
      // Employee Quarter Reducers
      .addCase(fetchEmployeeQuarterList.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEmployeeQuarterList.fulfilled, (state, action) => {
        state.loading = false;
        state.employeeQuarterList = action.payload;
      })
      .addCase(fetchEmployeeQuarterList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchEmployeeQuarterShow.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEmployeeQuarterShow.fulfilled, (state, action) => {
        state.loading = false;
        state.employeeQuarterShow = action.payload;
      })
      .addCase(fetchEmployeeQuarterShow.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createEmployeeQuarter.pending, (state) => {
        state.loading = true;
      })
      .addCase(createEmployeeQuarter.fulfilled, (state, action) => {
        state.loading = false;
        state.employeeQuarterList.push(action.payload);
      })
      .addCase(createEmployeeQuarter.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateEmployeeQuarter.pending, (state) => {
        state.loading = true;
        state.updateStatus = 'pending'; 
      })
      .addCase(updateEmployeeQuarter.fulfilled, (state, action) => {
         state.loading = false;
        state.updateStatus = 'succeeded';
        const updatedQuarter = action.payload;
            const index = state.employeeQuarterList.findIndex(q => q.id === updatedQuarter.id);
            if (index !== -1) {
                state.employeeQuarterList[index] = updatedQuarter;
            }
      })
      .addCase(updateEmployeeQuarter.rejected, (state, action) => {
        state.loading = false;
        state.updateStatus = 'failed';
        state.error = action.payload;
      });
  }
});


export default quarterSlice.reducer;