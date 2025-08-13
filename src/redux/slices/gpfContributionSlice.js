import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from "global/AxiosSetting";

// Async thunks
export const fetchGpfContribution = createAsyncThunk(
  'gpfContribution/fetchGpfContribution',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/gpf-contribution`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const addGpfContribution = createAsyncThunk(
  'gpfContribution/addGpfContribution',
  async ({ data }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post('/gpf-contribution', data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const updateGpfContribution = createAsyncThunk(
  'gpfContribution/updateGpfContribution',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(`/gpf-contribution/${id}`, data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchGpfContributionShow = createAsyncThunk(
  'gpfContribution/fetchGpfContributionShow',
  async (id, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/gpf-contribution/${id}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const gpfContributionSlice = createSlice({
  name: 'gpfContribution',
  initialState: {
    list: [],
    loading: false,
    error: null,
    totalCount: 0,
    history: [],
    show: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch list
      .addCase(fetchGpfContribution.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGpfContribution.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.data || [];
        state.totalCount = action.payload.totalCount || 0;
      })
      .addCase(fetchGpfContribution.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add
      .addCase(addGpfContribution.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addGpfContribution.fulfilled, (state, action) => {
        state.loading = false;
        state.list.unshift(action.payload.data);
      })
      .addCase(addGpfContribution.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update
      .addCase(updateGpfContribution.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateGpfContribution.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.list.findIndex((item) => item.id === action.payload.data.id);
        if (idx !== -1) state.list[idx] = action.payload.data;
      })
      .addCase(updateGpfContribution.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Show (history)
      .addCase(fetchGpfContributionShow.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGpfContributionShow.fulfilled, (state, action) => {
        state.loading = false;
        state.show = action.payload.data;
        state.history = action.payload.data?.history || [];
      })
      .addCase(fetchGpfContributionShow.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default gpfContributionSlice.reducer; 