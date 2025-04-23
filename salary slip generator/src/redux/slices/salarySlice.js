// features/salary/salarySlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    activeStep: 0,
    formData: {
        mode: 'bulk',
        month: '',
        year: '',
        employeeId: '',
        basic: 0,
        hra: 0,
        da: 0,
        npa:0,
        otherAllowances: 0,
        pf: 0,
        tax: 0,
        approved: false,
        arrears: 0,
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
