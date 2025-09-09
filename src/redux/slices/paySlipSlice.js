import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from "global/AxiosSetting";

// Initial State
const initialState = {
    paySlips: [],
    loading: false,
    error: null,
    paySlipCount: 0,
};

// Async Thunks

// 1. Fetch Payslips with Pagination
export const fetchPaySlips = createAsyncThunk(
    'paySlips/fetch',
    async ({ page, limit }, thunkAPI) => {
        try {
            const res = await axiosInstance.get(`employee-pay-slip?page=${page}&limit=${limit}`);
            return res.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data?.errorMsg || err.message);
        }
    }
);

// 2. Add a new Payslip
export const addPaySlip = createAsyncThunk(
    'paySlips/add',
    async (cleanFormData, thunkAPI) => {
        try {
            const res = await axiosInstance.post(`employee-pay-slip`, cleanFormData);
            return res.data;
        } catch (err) {         
            return thunkAPI.rejectWithValue(err.response?.data?.errorMsg || err.message);
        }
    }
);

// 3. Update an existing Payslip
export const updatePaySlip = createAsyncThunk(
    'paySlips/update',
    async ({ id, pay_slip }, thunkAPI) => {
        try {
            const res = await axiosInstance.post(`/employee-pay-slip/${id}?_method=PUT`, pay_slip);
            return res.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data?.errorMsg || err.message);
        }
    }
);

// Slice
const paySlipSlice = createSlice({
    name: 'paySlips',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchPaySlips.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPaySlips.fulfilled, (state, action) => {
                state.loading = false;
                state.paySlips = action.payload?.data || [];
                state.paySlipCount = action.payload?.total_count || 0;
            })
            .addCase(fetchPaySlips.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Add
            .addCase(addPaySlip.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addPaySlip.fulfilled, (state, action) => {
                state.loading = false;              
                const newPaySlip = action.payload; 
                if (newPaySlip) {
                    state.paySlips.unshift(newPaySlip);
                }
            })
            .addCase(addPaySlip.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;             
            })

            // Update
            .addCase(updatePaySlip.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updatePaySlip.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.paySlips.findIndex((s) => s.id === action.payload.id);
                if (index !== -1) {
                    state.paySlips[index] = action.payload;
                }
            })
            .addCase(updatePaySlip.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default paySlipSlice.reducer;
