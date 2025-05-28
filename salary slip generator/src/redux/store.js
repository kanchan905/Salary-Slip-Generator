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
import arrearReducer from './slices/arrearsSlice'
import bankReducer from './slices/bankSlice'
import monthlyReducer from './slices/monthlyPensionSlice'
import dearnessReducer from './slices/dearnessRelief'
import pensionReducer from './slices/pensionDeductionSlice'
import documentReducer from './slices/pensionDocumentSlice'
import creditReducer from './slices/creditSlice'
import loanReducer from './slices/employeeLoanSlice'
import netSalaryReducer from './slices/netSalarySlice'
import paySlipSlice from './slices/paySlipSlice';
import deductionReducer from './slices/deductionSlice'
import bulkReducer from './slices/bulkSlice'
import netPensionReducer from './slices/netPensionSlice'

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
    allowence: allowenceSlice,
    arrears: arrearReducer,
    bankdetail:bankReducer,
    monthlypension:monthlyReducer,
    dearnessRelief:dearnessReducer,
    pensionDeduction:pensionReducer,
    pensionDocument:documentReducer,
    societyMember: creditReducer,
    employeeLoan: loanReducer,
    netSalary:netSalaryReducer,
    paySlip: paySlipSlice,
    deduction:deductionReducer,
    bulk:bulkReducer,
    netPension:netPensionReducer,
  },
});

export default store;
