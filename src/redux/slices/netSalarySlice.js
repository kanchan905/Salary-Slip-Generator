import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Header from "components/Headers/Header";
import { getCookie } from "cookies-next";
import axiosInstance from "global/AxiosSetting";
import { useSelector } from "react-redux";
import ky from "ky";

// const { token } = useSelector((state) => state.auth);
const token = getCookie("token");
const authToken = token;

export const fetchNetSalary = createAsyncThunk(
  "salary/fetchNetSalary",
  async ({ id, page, limit, month, year, verification_status, finalize_status, institute }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/salary?page=${page}&limit=${limit}&month=${month ?? ''}&year=${year ?? ''}&is_verified=${verification_status ?? ''}&employee_id=${id ?? ''}&is_finalize=${finalize_status ?? ''}&institute=${institute}`);
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

export const verifyNetSalary = createAsyncThunk(
  "salary/verifyNetSalary",
  async ({ selected_id, statusField }, { rejectWithValue }) => {
    try {
      const payload = { selected_id };
      if (statusField) payload[statusField] = 1; // Use 1 instead of true
      const response = await axiosInstance.post(`/verify-salary`, payload);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.errorMsg || err.message);
    }
  }
);

export const verifyNetSalaryAdmin = createAsyncThunk(
  "salary/verifyNetSalaryAdmin",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/verify-salary`, payload);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.errorMsg || err.message);
    }
  }
);

export const finalizeNetSalary = createAsyncThunk(
  "salary/finalizeNetSalary",
  async ({ selected_id }, { rejectWithValue }) => {
    try {
      const payload = { selected_id };
      const response = await axiosInstance.post(`/finalize-salary`, payload);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.errorMsg || err.message);
    }
  }
);

export const releaseNetSalary = createAsyncThunk(
  "salary/releaseNetSalary",
  async ({ selected_id }, { rejectWithValue }) => {
    try {
      const payload = { selected_id };
      const response = await axiosInstance.post(`/release-salary`, payload);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.errorMsg || err.message);
    }
  }
);




const initialState = {
  isReleasing: false,
  netSalary: [],
  netSalaryData: null,
  totalCount: 0,
  loading: false,
  error: null
}

const netSalarySlice = createSlice({
  name: 'netSalary',
  initialState,
  reducers: {
    setIsReleasing: (state, action) => {
      state.isReleasing = action.payload;
    },
  },
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
      .addCase(verifyNetSalary.fulfilled, (state, action) => {
        state.loading = false;

      })
      .addCase(verifyNetSalaryAdmin.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(finalizeNetSalary.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(releaseNetSalary.fulfilled, (state, action) => {
        state.loading = false;
      })
      
  }
})

export const { setIsReleasing } = netSalarySlice.actions;
export default netSalarySlice.reducer;
