import { configureStore } from '@reduxjs/toolkit';
import levelReducer from './slices/levelSlice';
import salaryReducer from './slices/salarySlice';
import userReducer from './slices/userSlice';
import authReducer from './slices/authSlice'
import employeeReducer from './slices/employeeSlice'
import levelCellSlice from './slices/levelCellSlice';
import quarterReducer from './slices/quarterSlice';
import payStructureSlice from './slices/payStructureSlice';
import pensionerReducer from './slices/pensionerSlice'
import allowenceSlice from './slices/allowenceSlice';

const store = configureStore({
  reducer: {
    levels: levelReducer,
    salary: salaryReducer,
    user:userReducer,
    auth:authReducer,
    employee:employeeReducer,
    levelCells: levelCellSlice,
    quarter:quarterReducer,
    payStructure: payStructureSlice,
    pensioner:pensionerReducer,
    allowence: allowenceSlice
  },
});

export default store;
