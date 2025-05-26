import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from "global/AxiosSetting";

// Initial State
const initialState = {
    deductions: [],
    loading: false,
    error: null,
};

export const addDeduction = createAsyncThunk(
    'addDeduction/deduction',
    async ( newdeductionForm, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.post(`/employee-deduction`,newdeductionForm);
            return res.data;
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
    },
});


export default deductionSlice.reducer;
