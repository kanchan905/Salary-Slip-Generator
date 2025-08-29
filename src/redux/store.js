import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { appLogout } from './slices/authSlice';
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
import informationReducer from './slices/pensionRelatedSlice'
import memberStoreReducer from './slices/memberStoreSlice'
import pensionerStoreReducer from './slices/pensionerStoreSlice'
import payCommisionReducer from './slices/payCommision'
import pensionslipReducer from './slices/pensionSlice'
import reportReducer from './slices/reportsSlice'
import dashboardReportReducer from './slices/reportSlice';
import npsContributionReducer from './slices/npsContributionSlice';
import gpfContributionReducer from './slices/gpfContributionSlice';
import viewSalaryReducer from './slices/viewSalarySlice';
import designationReducer from './slices/designationSlice';


// 1. Combine all your reducers into a single appReducer
const appReducer = combineReducers({
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
    info:informationReducer,
    memeberStore:memberStoreReducer,
    pensionerStore:pensionerStoreReducer,
    payCommision:payCommisionReducer,
    pension:pensionslipReducer,
    reports: reportReducer,
    dashboardReport: dashboardReportReducer,
    npsContribution: npsContributionReducer,
    gpfContribution: gpfContributionReducer,
    viewSalary: viewSalaryReducer,
    designation: designationReducer,
})

const rootReducer = (state, action) => {
  if (action.type === appLogout.type) {
    return appReducer(undefined, action);
  }

  return appReducer(state, action);
};

// 3. Pass the new rootReducer to configureStore
const store = configureStore({
  reducer: rootReducer, 
});

export default store;