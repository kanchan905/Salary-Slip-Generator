import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from 'global/AxiosSetting';

export const monthlyPensionDetails = createAsyncThunk(
    'month/monthlyPensionDetails',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/monthly-pension`);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to update employee");
        }
    }
);

export const createMonthlyPension = createAsyncThunk(
    'month/createMonthlyPension',
    async (values, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`/monthly-pension`, values);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to update employee");
        }
    }
);

const initialState = {
    monthlyPension: [],
    loading: false,
    error: null
}

const monthlyPensionSlice = createSlice(({
    name: 'monthlyPension',
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(monthlyPensionDetails.pending, (state) => {
                state.loading = true;
            })
            .addCase(monthlyPensionDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.monthlyPension = action.payload;
            })
            .addCase(monthlyPensionDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // .addCase(createMonthlyPension.pending, (state) => {
            //     state.loading = true;
            // })
            .addCase(createMonthlyPension.fulfilled, (state, action) => {
                state.loading = false;
                state.monthlyPension.push(action.payload);
            })
            // .addCase(createMonthlyPension.rejected, (state, action) => {
            //     state.loading = false;
            //     state.error = action.error.message;
            // })
    }
}));


export default monthlyPensionSlice.reducer;