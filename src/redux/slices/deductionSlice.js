import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from "global/AxiosSetting";

// Initial State
const initialState = {
    deductions: [],
    deduction:{},
    loading: false,
    error: null,
};

export const addDeduction = createAsyncThunk(
    'addDeduction/deduction',
    async (newdeductionForm, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.post(`/employee-deduction`, newdeductionForm);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to add deduction");
        }
    }
);

export const updateDeduction = createAsyncThunk(
    'updateDeduction/deduction',
    async ({ id, deduction }, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.post(`/employee-deduction/${id}?_method=PUT`, deduction);
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to add deduction");
        }
    }
);

export const showDeduction = createAsyncThunk(
    'showDeduction/deduction',
    async (id, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get(`/pension-deduction/${id}`);           
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to add deduction");
        }
    }
);



const deductionSlice = createSlice({
    name: 'deductions',
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(addDeduction.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addDeduction.fulfilled, (state, action) => {
                state.loading = false;
                state.deductions.push(action.payload)
            })
            .addCase(addDeduction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update
            .addCase(updateDeduction.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateDeduction.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.deductions.findIndex((s) => s.id === action.payload.id);
                if (index !== -1) {
                    state.deductions[index] = action.payload;
                }
            })
            .addCase(updateDeduction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
           .addCase(showDeduction.pending, (state,action) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(showDeduction.fulfilled, (state, action) => {
                state.loading = false;
                state.deduction = action.payload
            })
            .addCase(showDeduction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    },
});


export default deductionSlice.reducer;
