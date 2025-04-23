import { configureStore } from '@reduxjs/toolkit';
import levelReducer from './slices/levelSlice';
import salaryReducer from './slices/salarySlice';

const store = configureStore({
  reducer: {
    levels: levelReducer,
    salary: salaryReducer,
  },
});

export default store;