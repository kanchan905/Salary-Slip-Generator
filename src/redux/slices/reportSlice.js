import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from 'global/AxiosSetting';

export const fetchDashboardSummary = createAsyncThunk(
  'report/fetchDashboardSummary',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/dashboard');
      // Validate that the response data is not an error object
      if (response.data && typeof response.data === 'object' && response.data.message) {
        return rejectWithValue(response.data.message);
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch dashboard summary');
    }
  }
);

export const fetchDashboardReports = createAsyncThunk(
  'report/fetchDashboardReports',
  async ({ month, year }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/dashboard-reports?month=${month}&year=${year}`);
      // Validate that the response data is not an error object
      if (response.data && typeof response.data === 'object' && response.data.message) {
        return rejectWithValue(response.data.message);
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch dashboard reports');
    }
  }
);

const initialState = {
  loading: false,
  error: null,
  summary: {
    total_users: 0,
    total_employees: 0,
    total_nioh_employees: 0,
    total_rohc_employees: 0,
    total_pensioners: 0,
  },
  reports: {
    total_income_tax: 0,
    total_net_pay: 0,
    total_net_pension: 0,
    loading: false,
    error: null,
  },
};

const reportSlice = createSlice({
  name: 'report',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardSummary.fulfilled, (state, action) => {
        state.loading = false;
        // Ensure we only store valid data
        if (action.payload && typeof action.payload === 'object' && !action.payload.message) {
          state.summary = { ...state.summary, ...action.payload };
        }
      })
      .addCase(fetchDashboardSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchDashboardReports.pending, (state) => {
        state.reports.loading = true;
        state.reports.error = null;
      })
      .addCase(fetchDashboardReports.fulfilled, (state, action) => {
        state.reports.loading = false;
        // Ensure we only store valid data
        if (action.payload && typeof action.payload === 'object' && !action.payload.message) {
          state.reports = { ...state.reports, ...action.payload };
        }
      })
      .addCase(fetchDashboardReports.rejected, (state, action) => {
        state.reports.loading = false;
        state.reports.error = action.payload;
      });
  },
});

export default reportSlice.reducer;
 