import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "global/AxiosSetting";


export const fetchEmployeeLoan = createAsyncThunk(
  "loan/fetchEmployeeLoan",
  async ({id,page,limit}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/employee-loan?page=${page}&limit=${limit}&employee_id=${id}`);
      return {
        data: response.data.data,
        totalCount: response.data.total_count
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch employees");
    }
  }
);

export const createEmployeeLoan = createAsyncThunk(
  "loan/createEmployeeLoan",
  async (values, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/employee-loan", values);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const updateEmployeeLoan = createAsyncThunk(
  "loan/updateEmployeeLoan",
  async ({ id, values }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/employee-loan/${id}?_method=PUT`, values);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const showEmployeeLoan = createAsyncThunk(
  "loan/showEmployeeLoan",
  async ({id}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/employee-loan?page=&limit=&employee_id=${id}`);
      return response.data.data  
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch employees");
    }
  }
);


export const fetchSingleEmployeeLoan = createAsyncThunk(
  "singleLoan/fetchSingleEmployeeLoan",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/employee-loan/${id}`);
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
)


const initialState = {
  loans: [],
  showloan:[],
  singleLoan: null,
  totalCount: 0,
  loading: false,
  error: null
}

const loanSlice = createSlice({
  name: 'loans',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployeeLoan.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(fetchEmployeeLoan.fulfilled, (state, action) => {
        state.loading = false;
        state.loans = action.payload.data;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(fetchEmployeeLoan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createEmployeeLoan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEmployeeLoan.fulfilled, (state, action) => {
        state.loading = false;
        state.loans.push(action.payload);
      })
      .addCase(createEmployeeLoan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateEmployeeLoan.pending, (state) => {
        // state.loading = true;
        state.error = null;
      })
      .addCase(updateEmployeeLoan.fulfilled, (state, action) => {
        const updatedLoan = action.payload;
        const index = state.loans.findIndex(a => a.id === action.payload.id);
        if (index !== -1) {
          state.loans[index] = {
            ...state.loans[index], ...updatedLoan
          };
        }
        state.loading = false;
      })
      .addCase(updateEmployeeLoan.rejected, (state, action) => {
        // state.loading = false;
        state.error = action.payload;
      })
      .addCase(showEmployeeLoan.pending,(state,action)=>{
        state.loading = true;
        state.error = null;
      })
      .addCase(showEmployeeLoan.fulfilled,(state,action)=>{
        state.showloan = action.payload
        state.loading = false
      })
      .addCase(showEmployeeLoan.rejected,(state,action)=>{
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchSingleEmployeeLoan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSingleEmployeeLoan.fulfilled, (state, action) => {
        state.loading = false;
        state.singleLoan = action.payload;
      })
      .addCase(fetchSingleEmployeeLoan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
})

export default loanSlice.reducer;
