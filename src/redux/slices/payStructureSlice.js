import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from 'global/AxiosSetting';

// FETCH Pay Structures
export const fetchPayStructure = createAsyncThunk(
  'payStructure/fetchPayStructure',
  async ({ page, limit }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`employee-pay-structures?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch pay structure');
    }
  }
);

// ADD Pay Structure
export const addPayStructure = createAsyncThunk(
  'payStructure/addPayStructure',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/employee-pay-structures', {
        employee_id: data.employee_id,
        matrix_cell_id: data.matrix_cell_id,
        commission: data.commission,
        effective_from: data.effective_from,
        effective_till: data.effective_till,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to add pay structure');
    }
  }
);

// UPDATE Pay Structure
export const updatePayStructure = createAsyncThunk(
  'payStructure/updatePayStructure',
  async ({ id, values }, { rejectWithValue }) => {
    try {
      const { employee_id, matrix_cell_id, commission, effective_from, effective_till, order_reference } = values;

      const response = await axiosInstance.put(`/employee-pay-structures/${id}`, {
        employee_id,
        matrix_cell_id,
        commission,
        effective_from,
        effective_till,
        order_reference,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update pay structure');
    }
  }
);


// Show Pay Structure Slice
export const showPayStructure = createAsyncThunk(
  'payStructureShow/showPayStructure',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/employee-pay-structures/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch pay structure show');
    }
  }
);


// Initial state
const initialState = {
  payStructure: [],
  payStructureShow: {},
  totalCount: 0,
  loading: false,
  error: null,
};

// Slice
const payStructureSlice = createSlice({
  name: 'payStructure',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchPayStructure.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPayStructure.fulfilled, (state, action) => {
        state.loading = false;
        state.payStructure = action.payload?.data || [];
        state.totalCount = action.payload?.total_count || 0;
      })
      .addCase(fetchPayStructure.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ADD
      .addCase(addPayStructure.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addPayStructure.fulfilled, (state) => {
        state.loading = false;
        // Optional: trigger refetch or push to `state.payStructure`
      })
      .addCase(addPayStructure.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE
      .addCase(updatePayStructure.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePayStructure.fulfilled, (state) => {
        state.loading = false;
        // Optional: update state.payStructure here based on response
      })
      .addCase(updatePayStructure.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // SHOW
      .addCase(showPayStructure.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(showPayStructure.fulfilled, (state, action) => {
        state.loading = false;
        state.payStructureShow = action.payload?.data || {};
      })
      .addCase(showPayStructure.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export reducer
export default payStructureSlice.reducer;
