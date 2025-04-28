// features/salary/salarySlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    activeStep: 0,
    formData: {
        mode: 'bulk',
        month: new Date().getMonth(),
        year: new Date().getFullYear(),
        employeeId: '',
        basic: '',
        hra: '',
        da: '',
        npa:'',
        otherAllowances: '',
        pf: '',
        tax: '',
        approved: true,
        arrears: '',
    },
};

const salarySlice = createSlice({
    name: 'salary',
    initialState,
    reducers: {
        nextStep: (state) => {
            if (state.activeStep < 4) state.activeStep += 1;
        },
        prevStep: (state) => {
            if (state.activeStep > 0) state.activeStep -= 1;
        },
        updateField: (state, action) => {
            const { name, value } = action.payload;
            state.formData[name] = ['arrears', 'basic', 'hra', 'da', 'otherAllowances', 'pf', 'tax'].includes(name)
                ? Number(value) || 0
                : value;
        },
        resetSalaryState: () => initialState,
    },
});

export const { nextStep, prevStep, updateField, resetSalaryState } = salarySlice.actions;
export default salarySlice.reducer;
