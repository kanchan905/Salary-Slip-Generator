import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  levels: [],
};

const levelSlice = createSlice({
  name: 'levels',
  initialState,
  reducers: {
    addLevel: (state, action) => {
      const { id, levelName, description } = action.payload;
      state.levels.push({
        id,
        levelName,
        description,
        cells: [],
        allowances: {}, // <- Add this
      });
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
} = levelSlice.actions;

export default levelSlice.reducer;
