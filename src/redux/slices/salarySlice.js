import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from 'global/AxiosSetting';

// --- No changes to async thunks ---
export const fetchNpaData = createAsyncThunk('salary/fetchNpaData', async (_, { rejectWithValue }) => { try { const r = await axiosInstance.get(`/non-practicing-allowance-rate?page=1&limit=1000`); return r.data.data; } catch (e) { return rejectWithValue(e.response?.data); } });
export const fetchHraData = createAsyncThunk('salary/fetchHraData', async (_, { rejectWithValue }) => { try { const r = await axiosInstance.get(`/house-rent-allowance-rate?page=1&limit=1000`); return r.data.data; } catch (e) { return rejectWithValue(e.response?.data); } });
export const fetchDaData = createAsyncThunk('salary/fetchDaData', async (_, { rejectWithValue }) => { try { const r = await axiosInstance.get(`/dearness-allowance-rate?page=1&limit=1000`); return r.data.data; } catch (e) { return rejectWithValue(e.response?.data); } });
export const fetchUniformData = createAsyncThunk('salary/fetchUniformData', async (_, { rejectWithValue }) => { try { const r = await axiosInstance.get(`/uniform-allowance-rate?page=1&limit=1000`); return r.data.data; } catch (e) { return rejectWithValue(e.response?.data); } });
export const fetchTransportData = createAsyncThunk('salary/fetchTransportData', async (_, { rejectWithValue }) => { try { const r = await axiosInstance.get(`/transport-allowance-rate?page=1&limit=1000`); return r.data.data; } catch (e) { return rejectWithValue(e.response?.data); } });
export const fetchGisData = createAsyncThunk('salary/fetchGisData', async (_, { rejectWithValue }) => { try { const r = await axiosInstance.get(`/employee-gis?page=1&limit=1000&employee_id=`); return r.data.data; } catch (e) { return rejectWithValue(e.response?.data); } });


// REFINED: All salary-related fields are now consolidated within formData.
const initialState = {
    activeStep: 0,
    formData: {
        pay_structure_id: '',
        employee_id: '',
        month: '',
        year: '',
        processing_date: '',
        employee_bank_id: '',
        payment_date: '',
        net_amount: '',
        remarks: '',

        // Earnings (System Calculated)
        basic_pay: '',
        npa_rate_id: '',
        npa_amount: '',
        pay_plus_npa: '',
        hra_rate_id: '',
        hra_amount: '',
        da_rate_id: '',
        da_amount: '',
        transport_rate_id: '',
        transport_amount: '',
        da_on_ta: '',
        uniform_rate_id: '',
        uniform_rate_amount: '',
        govt_contribution: '',

        // Earnings (User Entered)
        spacial_pay: '',
        da_1: '',
        da_2: '',
        itc_leave_salary: '',
        total_pay: '',

        // Deductions (System Calculated & User Entered)
        income_tax: '',
        professional_tax: '',
        license_fee: '',
        nfch_donation: '',
        gpf: '',
        gis: '',
        employee_contribution_10: '',
        govt_contribution_14_recovery: '',

        // Loans & Other Deductions
        computer_advance_installment: '',
        computer_advance_balance: '',
        lic: '',
        credit_society_membership: '',
        total_deductions: '',
    },
    bulkForm: {
        month: '',
        year: '',
        processing_date: '',
        payment_date: '',
    },
    npaList: [],
    hraList: [],
    daList: [],
    uniformList: [],
    transportList: [],
    gisList: [],
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
            state.formData[name] = value;
        },
        bulkUpdateField: (state, action) => {
            const { name, value } = action.payload;
            state.bulkForm[name] = value;
        },
        setDeductionField: (state, action) => {
            const { name, value } = action.payload;
            state.formData[name] = value;
        },

        // NEW & REFINED: A single reducer to handle all calculated amounts.
        setCalculatedAmounts: (state, action) => {
            // Merges the payload object (e.g., { basic_pay: 100, npa_amount: 20 }) into formData
            state.formData = { ...state.formData, ...action.payload };
        },

        reset: (state) => {
            const month = state.formData.month;
            const year = state.formData.year;
            const processing_date = state.formData.processing_date;

            // Fully reset the state to its initial definition
            Object.assign(state, JSON.parse(JSON.stringify(initialState)));

            // Persist month/year/date after reset for convenience
            state.formData.month = month;
            state.formData.year = year;
            state.formData.processing_date = processing_date;
        },
        resetBulkState: (state) => {
            state.bulkForm = initialState.bulkForm;
            state.activeStep = 0;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchNpaData.fulfilled, (state, action) => { state.npaList = action.payload; })
            .addCase(fetchHraData.fulfilled, (state, action) => { state.hraList = action.payload; })
            .addCase(fetchDaData.fulfilled, (state, action) => { state.daList = action.payload; })
            .addCase(fetchUniformData.fulfilled, (state, action) => { state.uniformList = action.payload; })
            .addCase(fetchTransportData.fulfilled, (state, action) => { state.transportList = action.payload; })
            .addCase(fetchGisData.fulfilled, (state, action) => { state.gisList = action.payload; });
    }
});


export const {
    nextStep,
    prevStep,
    updateField,
    setDeductionField,
    setCalculatedAmounts, 
    reset,
    bulkUpdateField,
    resetBulkState,
} = salarySlice.actions;

export default salarySlice.reducer;