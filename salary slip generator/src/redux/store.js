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
<<<<<<< Updated upstream
import allowenceSlice from './slices/allowenceSlice';
=======
import arrearReducer from './slices/arrearsSlice'
import bankReducer from './slices/bankSlice'
>>>>>>> Stashed changes

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
<<<<<<< Updated upstream
    allowence: allowenceSlice
=======
    arrears:arrearReducer,
    bankdetail:bankReducer
>>>>>>> Stashed changes
  },
});

export default store;
