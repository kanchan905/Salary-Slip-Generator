import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from "global/AxiosSetting";

// Async thunks
export const fetchNpsContribution = createAsyncThunk(
  'npsContribution/fetchNpsContribution',
  async ({type}, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/nps-govt-contribution?type=${type}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const addNpsContribution = createAsyncThunk(
  'npsContribution/addNpsContribution',
  async ({ data }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post('/nps-govt-contribution', data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const updateNpsContribution = createAsyncThunk(
  'npsContribution/updateNpsContribution',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(`/nps-govt-contribution/${id}`, data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchNpsContributionShow = createAsyncThunk(
  'npsContribution/fetchNpsContributionShow',
  async (id, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/nps-govt-contribution/${id}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const selectLatestNpsRateByType = (state, type) => {
  const filtered = state.npsContribution.list?.filter(cont => cont.type === type);
  if (!filtered || filtered.length === 0) return null;
  const latest = filtered.reduce((latest, curr) => {
    if (!latest) return curr;
    const latestDate = new Date(latest.effective_from);
    const currDate = new Date(curr.effective_from);
    return currDate > latestDate ? curr : latest;
  }, null);
  return latest?.rate_percentage || null;
};

export const selectLatestGovtRate = (state) => state.npsContribution.latestGovtRate;
export const selectLatestEmployeeRate = (state) => state.npsContribution.latestEmployeeRate;

const npsContributionSlice = createSlice({
  name: 'npsContribution',
  initialState: {
    list: [],
    loading: false,
    error: null,
    totalCount: 0,
    history: [],
    show: null,
    latestGovtRate: null, // NEW
    latestEmployeeRate: null, // NEW
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch list
      .addCase(fetchNpsContribution.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNpsContribution.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.data || [];
        state.totalCount = action.payload.totalCount || 0;
        // Set latestGovtRate or latestEmployeeRate based on type
        if (Array.isArray(action.payload.data) && action.meta && action.meta.arg && action.meta.arg.type) {
          const type = action.meta.arg.type;
          const filtered = action.payload.data.filter(cont => cont.type === type);
          if (filtered.length > 0) {
            const latest = filtered.reduce((latest, curr) => {
              if (!latest) return curr;
              const latestDate = new Date(latest.effective_from);
              const currDate = new Date(curr.effective_from);
              return currDate > latestDate ? curr : latest;
            }, null);
            if (type === 'GOVT') {
              state.latestGovtRate = latest?.rate_percentage || null;
            } else if (type === 'Employee') {
              state.latestEmployeeRate = latest?.rate_percentage || null;
            }
          }
        }
      })
      .addCase(fetchNpsContribution.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add
      .addCase(addNpsContribution.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addNpsContribution.fulfilled, (state, action) => {
        state.loading = false;
        state.list.unshift(action.payload.data);
      })
      .addCase(addNpsContribution.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update
      .addCase(updateNpsContribution.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateNpsContribution.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.list.findIndex((item) => item.id === action.payload.data.id);
        if (idx !== -1) state.list[idx] = action.payload.data;
      })
      .addCase(updateNpsContribution.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Show (history)
      .addCase(fetchNpsContributionShow.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNpsContributionShow.fulfilled, (state, action) => {
        state.loading = false;
        state.show = action.payload.data;
        state.history = action.payload.data?.history || [];
      })
      .addCase(fetchNpsContributionShow.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default npsContributionSlice.reducer; 