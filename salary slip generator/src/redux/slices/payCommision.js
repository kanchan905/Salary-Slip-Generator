import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from "global/AxiosSetting";


const initialState = {
    payCommissions: [],
    loading: false,
    error: null,
    paySlipCount: 0,
};


export const fetchPayCommisions = createAsyncThunk(
    'payCommissions/fetchPayCommisions',
    async (_, thunkAPI) => {
        try {
            const res = await axiosInstance.get(`/pay-commission`);
            return res.data.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);


const payCommisionSlice = createSlice({
    name: 'payCommissions',
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(fetchPayCommisions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPayCommisions.fulfilled, (state, action) => {
                state.loading = false;
                state.payCommissions = action.payload
            })
            .addCase(fetchPayCommisions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    }
})

export default payCommisionSlice.reducer;
