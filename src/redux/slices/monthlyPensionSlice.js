import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from 'global/AxiosSetting';

export const monthlyPensionDetails = createAsyncThunk(
    'month/monthlyPensionDetails',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/monthly-pension`);
            return {
                data: response.data.data,
                totalCount: response.data.total_count
            };
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to monthly pension details");
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
            return rejectWithValue(error.response?.data || "Failed to add monthly detail");
        }
    }
);


export const monthlyPensionDetailShow = createAsyncThunk(
    'showMonthyPension/monthlyPensionDetailShow',
    async (id, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/monthly-pension/${id}`);
            return {
                data: response.data.data,
                totalCount: response.data.total_count
            };
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch monthly pension");
        }
    }
);

export const updateMonthlyPension = createAsyncThunk(
    'month/updateMonthlyPension',
    async ({ id, values }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`/monthly-pension/${id}?_method=PUT`, values);
            return response.data.data
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch monthly pension");
        }
    }
);



const initialState = {
    monthlyPension: [],
    showMonthyPension: null,
    totalCount: 0,
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
                state.monthlyPension = action.payload.data;
                state.totalCount = action.payload.totalCount;
            })
            .addCase(monthlyPensionDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(createMonthlyPension.fulfilled, (state, action) => {
                state.loading = false;
                state.monthlyPension.push(action.payload);
            })
            .addCase(monthlyPensionDetailShow.pending, (state) => {
                state.loading = true;
            })
            .addCase(monthlyPensionDetailShow.fulfilled, (state, action) => {
                state.loading = false;
                state.showMonthyPension = action.payload.data;
            })
            .addCase(monthlyPensionDetailShow.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(updateMonthlyPension.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateMonthlyPension.fulfilled, (state, action) => {
                state.loading = false;
                const updatedMonthlyPension = action.payload;
                const index = state.monthlyPension.findIndex(p => p.id === updatedMonthlyPension.id);
                if (index !== -1) {
                    state.monthlyPension[index] = updatedMonthlyPension;
                }
            })
            .addCase(updateMonthlyPension.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
}));


export default monthlyPensionSlice.reducer;