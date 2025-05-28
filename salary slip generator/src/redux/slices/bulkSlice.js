import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from 'global/AxiosSetting';

export const createBulkSalry = createAsyncThunk(
    'bulk/createBulkSalry',
    async (data, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/bulk-pay-slip', data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to create bulk salary");
        }
    }
);

const initialState = {
    loading: false,
    error: null,
    success: false,
    bulkSalary: [],
};

const bulkSlice = createSlice({
    name: 'bulk',
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(createBulkSalry.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(createBulkSalry.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.bulkSalary.push(action.payload.data);
            })
            .addCase(createBulkSalry.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to create bulk salary";
            });
    },
});


export default bulkSlice.reducer;