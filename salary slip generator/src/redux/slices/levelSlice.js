import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  levels: [],
  employeePayStructures: []
};

const levelSlice = createSlice({
  name: 'levels',
  initialState,
  reducers: {
    addLevel: (state, action) => {
      state.levels.push(action.payload);
    },

    updateLevel: (state, action) => {
      const { id, levelName, description } = action.payload;
      const level = state.levels.find((lvl) => lvl.id === id);
      if (level) {
        level.levelName = levelName;
        level.description = description;
      }
    },

    deleteLevel: (state, action) => {
      const { id } = action.payload;
      state.levels = state.levels.filter((lvl) => lvl.id !== id);
    },

    addCellToLevel: (state, action) => {
      const { levelId, cell } = action.payload;
      const level = state.levels.find((lvl) => lvl.id === levelId);
      if (level) {
        level.cells.push(cell);
      }
    },

    updateCellInLevel: (state, action) => {
      const { levelId, cellId, updatedCell } = action.payload;
      const level = state.levels.find((lvl) => lvl.id === levelId);
      if (level) {
        const cellIndex = level.cells.findIndex((cell) => cell.id === cellId);
        if (cellIndex !== -1) {
          level.cells[cellIndex] = { ...level.cells[cellIndex], ...updatedCell };
        }
      }
    },

    deleteCellFromLevel: (state, action) => {
      const { levelId, cellId } = action.payload;
      const level = state.levels.find((lvl) => lvl.id === levelId);
      if (level) {
        level.cells = level.cells.filter((cell) => cell.id !== cellId);
      }
    },

    // ALLOWANCE RATE ACTIONS
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
        state.employeePayStructures[index] = { ...state.employeePayStructures[index], ...updatedData };
      }
    },
    deleteEmployeePayStructure: (state, action) => {
      const { id } = action.payload;
      state.employeePayStructures = state.employeePayStructures.filter(ep => ep.id !== id);
    }
  },
});

export const {
  addLevel,
  updateLevel,
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
