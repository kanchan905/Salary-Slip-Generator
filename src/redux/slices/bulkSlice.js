import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from 'global/AxiosSetting';

export const createBulkSalry = createAsyncThunk(
    'bulk/createBulkSalry',
    async (data, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/bulk-pay-slip', data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.errorMsg || "Failed to create bulk salary");
        }
    }
);

export const createBulkPension = createAsyncThunk(
    'bulk/createBulkPension',
    async (bulkForm, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/bulk-pensions', bulkForm);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.errorMsg || "Failed to create bulk Pension");
        }
    }
);

const initialState = {
    loading: false,
    error: null,
    success: false,
    bulkSalary: [],
    bulkPension:[],
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
            })
            .addCase(createBulkPension.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(createBulkPension.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.bulkPension.push(action.payload.data);
            })
            .addCase(createBulkPension.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to create bulk salary";
            });
    },
});


export default bulkSlice.reducer;