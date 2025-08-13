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
  async ({ matrix_level_id, page, limit }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`pay-matrix-cells?matrix_level_id=${matrix_level_id}&page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch matrix cells");
    }
  }
);

// Add Pay Cell
export const addCellToAPI = createAsyncThunk(
  "levels/addCellToAPI",
  async ({ matrix_level_id, index, amount }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/pay-matrix-cells", {
        matrix_level_id,
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


// Show Pay Cell
export const showCellToAPI = createAsyncThunk(
  "showCells/showCellToAPI",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/pay-matrix-cells/${id}`);
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
  showCells: {},
  levelCount: 0,
  cellCount: 0,
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
        state.levelCount = action.payload?.total_count || 0;
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
        state.cellCount = action.payload?.total_count || 0;
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
      })
      // SHOW PAY CELL
      .addCase(showCellToAPI.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(showCellToAPI.fulfilled, (state, action) => {
        state.loading = false;
        state.showCells = action.payload?.data || {};
      })
      .addCase(showCellToAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

// EXPORT
export default levelCellSlice.reducer;
