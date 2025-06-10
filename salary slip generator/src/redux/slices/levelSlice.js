import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from 'global/AxiosSetting';

// THUNKS
export const fetchPayLevel = createAsyncThunk(
  "levels/fetchPayLevel",
  async (credentials, { rejectWithValue }) => {
    const { page, limit } = credentials;
    try {
      const response = await axiosInstance.get(`pay-matrix-levels?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch levels");
    }
  }
);

export const fetchPayLevelShow = createAsyncThunk(
  "levelShow/fetchPayLevelShow",
  async (level_id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`pay-matrix-levels/${level_id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch levels show");
    }
  }
);

export const fetchPayLevelByCommission = createAsyncThunk(
  "commissionLevels/fetchPayLevelByCommission",
  async (selectedCommissionId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`level-by-commission/${selectedCommissionId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch level by commission");
    }
  }
);

export const addLevelToAPI = createAsyncThunk(
  "levels/addLevelToAPI",
  async (newLevel, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/pay-matrix-levels", {
        pay_commission_id: newLevel.pay_commission_id,
        name: newLevel.levelName,
        description: newLevel.description
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to add level");
    }
  }
);

export const updateLevelToAPI = createAsyncThunk(
  "levels/updateLevelToAPI",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/pay-matrix-levels/${data.id}`, {
        name: data.levelName,
        description: data.description
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to update level");
    }
  }
);

// INITIAL STATE
const initialState = {
  levels: [],
  levelShow: {},
  commissionLevels: [],
  totalCount: 0,
  employeePayStructures: [],
  loading: false,
  error: null
};

// SLICE
const levelSlice = createSlice({
  name: 'levels',
  initialState,
  reducers: {
    deleteLevel: (state, action) => {
      const { id } = action.payload;
      state.levels = state.levels.filter((lvl) => lvl.id !== id);
    },

    addCellToLevel: (state, action) => {
      const { levelId, cell } = action.payload;
      const level = state.levels.find((lvl) => lvl.id === levelId);
      if (level) {
        level.cells = level.cells || [];
        level.cells.push(cell);
      }
    },

    updateCellInLevel: (state, action) => {
      const { levelId, cellId, updatedCell } = action.payload;
      const level = state.levels.find((lvl) => lvl.id === levelId);
      if (level && level.cells) {
        const cellIndex = level.cells.findIndex((cell) => cell.id === cellId);
        if (cellIndex !== -1) {
          level.cells[cellIndex] = { ...level.cells[cellIndex], ...updatedCell };
        }
      }
    },

    deleteCellFromLevel: (state, action) => {
      const { levelId, cellId } = action.payload;
      const level = state.levels.find((lvl) => lvl.id === levelId);
      if (level && level.cells) {
        level.cells = level.cells.filter((cell) => cell.id !== cellId);
      }
    },

    setAllowanceRate: (state, action) => {
      const { levelId, key, value } = action.payload;
      const level = state.levels.find((lvl) => lvl.id === levelId);
      if (level) {
        level.allowances = {
          ...level.allowances,
          [key]: value,
        };
      }
    },

    deleteAllowanceRate: (state, action) => {
      const { levelId, key } = action.payload;
      const level = state.levels.find((lvl) => lvl.id === levelId);
      if (level && level.allowances) {
        delete level.allowances[key];
      }
    },

    addEmployeePayStructure: (state, action) => {
      state.employeePayStructures.push(action.payload);
    },

    updateEmployeePayStructure: (state, action) => {
      const { id, updatedData } = action.payload;
      const index = state.employeePayStructures.findIndex(ep => ep.id === id);
      if (index !== -1) {
        state.employeePayStructures[index] = {
          ...state.employeePayStructures[index],
          ...updatedData
        };
      }
    },

    deleteEmployeePayStructure: (state, action) => {
      const { id } = action.payload;
      state.employeePayStructures = state.employeePayStructures.filter(ep => ep.id !== id);
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Levels
      .addCase(fetchPayLevel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPayLevel.fulfilled, (state, action) => {
        state.loading = false;
        state.levels = action.payload?.data || [];
        state.totalCount = action.payload?.total_count || 0;
      })
      .addCase(fetchPayLevel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchPayLevelShow.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPayLevelShow.fulfilled, (state, action) => {
        state.loading = false;
        state.levelShow = action.payload?.data || [];
      })
      .addCase(fetchPayLevelShow.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchPayLevelByCommission.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPayLevelByCommission.fulfilled, (state, action) => {
        state.loading = false;
        state.commissionLevels = action.payload?.data || [];
        state.totalCount = action.payload?.total_count || 0;
      })
      .addCase(fetchPayLevelByCommission.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add Level
      .addCase(addLevelToAPI.fulfilled, (state, action) => {
        state.levels.push({
          id: action.payload.id,
          levelName: action.payload.name,
          description: action.payload.description,
          cells: [],
          allowances: {}
        });
      })
      .addCase(addLevelToAPI.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Update Level
      .addCase(updateLevelToAPI.fulfilled, (state, action) => {
        const index = state.levels.findIndex(lvl => lvl.id === action.payload.id);
        if (index !== -1) {
          state.levels[index] = {
            ...state.levels[index],
            levelName: action.payload.name,
            description: action.payload.description
          };
        }
      })
      .addCase(updateLevelToAPI.rejected, (state, action) => {
        state.error = action.payload;
      });
  }
});

export const {
  deleteLevel,
  addCellToLevel,
  updateCellInLevel,
  deleteCellFromLevel,
  setAllowanceRate,
  deleteAllowanceRate,
  addEmployeePayStructure,
  updateEmployeePayStructure,
  deleteEmployeePayStructure
} = levelSlice.actions;

export default levelSlice.reducer;
