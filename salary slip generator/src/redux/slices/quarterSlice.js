import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "global/AxiosSetting";


export  const fetchEmployeeQuarterList = createAsyncThunk(
  "quarter/fetchEmployeeQuarterList",
   async (credentials, { rejectWithValue }) => {
          const { page, limit} = credentials;
          try {
              const response = await axiosInstance.get(`/employee-quarters?page=${page}&limit=${limit}`);
              console.log("Employee Quarter List Response:", response.data);
              return response.data.data;
          } catch (error) {
              return rejectWithValue(error.response?.data || "Failed to fetch employees");
          }
      }
);

export const createEmployeeQuarter = createAsyncThunk(
  "quarter/createEmployeeQuarter",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/employee-quarters", formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to create employee quarter");
    }
  }
);

export const updateEmployeeQuarter = createAsyncThunk(
  "quarter/updateEmployeeQuarter",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/employee-quarters/${id}?_method=PUT`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to update employee quarter");
    }
  }
);

const initialState = {
  employeeQuarterList: [],
    loading: false,
    error: null,    
    updateStatus: 'idle',
};

const quarterSlice = createSlice({
  name: 'quarter',
  initialState,
  extraReducers: (builder) => {
    builder
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