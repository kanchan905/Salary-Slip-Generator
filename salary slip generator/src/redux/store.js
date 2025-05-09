import { configureStore } from '@reduxjs/toolkit';
import levelReducer from './slices/levelSlice';
import salaryReducer from './slices/salarySlice';
import userReducer from './slices/userSlice';
import authReducer from './slices/authSlice'
import employeeReducer from './slices/employeeSlice'

const store = configureStore({
  reducer: {
    levels: levelReducer,
    salary: salaryReducer,
    user:userReducer,
    auth:authReducer,
    employee:employeeReducer
  },
});

export default store;