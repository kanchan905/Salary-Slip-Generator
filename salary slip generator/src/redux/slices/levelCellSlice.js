import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from 'global/AxiosSetting';

// ASYNC THUNKS

// Fetch Pay Levels
export const fetchPayLevel = createAsyncThunk(
  "levels/fetchPayLevel",
  async ({ page, limit }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`pay-matrix-levels?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch levels");
    }
  }
);

// Fetch Pay Cells
export const fetchPayCell = createAsyncThunk(
  "levels/fetchPayCell",
  async ({ page, limit }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`pay-matrix-cells?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch matrix cells");
    }
  }
);

// Add Pay Cell
export const addCellToAPI = createAsyncThunk(
  "levels/addCellToAPI",
  async ({ id, index, amount }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/pay-matrix-cells", {
        matrix_level_id: id,
        index,
        amount
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to add matrix cell");
    }
  }
);

// Update Pay Cell
export const updateCellToAPI = createAsyncThunk(
  "levels/updateCellToAPI",
  async ({ id, index, amount, matrix_level_id }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/pay-matrix-cells/${id}`, {
        matrix_level_id: matrix_level_id,
        index,
        amount
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to update cell");
    }
  }
);

// INITIAL STATE
const initialState = {
  levels: [],
  matrixCells: [],
  loading: false,
  error: null
};

// SLICE
const levelCellSlice = createSlice({
  name: 'metrixCells',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // FETCH PAY LEVELS
      .addCase(fetchPayLevel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPayLevel.fulfilled, (state, action) => {
        state.loading = false;
        state.levels = action.payload?.data || [];
      })
      .addCase(fetchPayLevel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // FETCH PAY CELLS
      .addCase(fetchPayCell.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPayCell.fulfilled, (state, action) => {
        state.loading = false;
        state.matrixCells = action.payload?.data || [];
      })
      .addCase(fetchPayCell.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ADD PAY CELL
      .addCase(addCellToAPI.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCellToAPI.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addCellToAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE PAY CELL
      .addCase(updateCellToAPI.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCellToAPI.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateCellToAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

// EXPORT
export default levelCellSlice.reducer;
