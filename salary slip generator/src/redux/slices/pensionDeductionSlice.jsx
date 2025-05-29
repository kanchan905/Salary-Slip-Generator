import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from 'global/AxiosSetting';

export const fetchPensionDeduction = createAsyncThunk(
    'pension/fetchPensionDeduction',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/pension-deduction`);
            return {
                data: response.data.data,
                totalCount: response.data.total_count
            };
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to update employee");
        }
    }
);

export const createPensionDeduction = createAsyncThunk(
    'pension/createPensionDeduction',
    async (values, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`/pension-deduction`, values);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to update employee");
        }
    }
);

export const updatePensionDeduction = createAsyncThunk(
    'pension/updatePensionDeduction',
    async ({ id, values }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`/pension-deduction/${id}?_method=PUT`, values);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to update employee");
        }
    }
);

const initialState = {
    pension: [],
    totalCount: 0,
    loading: false,
    error: null
}

const pensionDeductionSlice = createSlice(({
    name: 'pension',
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(fetchPensionDeduction.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchPensionDeduction.fulfilled, (state, action) => {
                state.loading = false;
                state.pension = action.payload.data;
                state.totalCount = action.payload.totalCount;
            })
            .addCase(fetchPensionDeduction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(createPensionDeduction.pending, (state) => {
                state.loading = true;
            })
            .addCase(createPensionDeduction.fulfilled, (state, action) => {
                state.loading = false;
                state.pension.push(action.payload);
            })
            .addCase(createPensionDeduction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(updatePensionDeduction.pending, (state) => {
                state.loading = true;
            })
            .addCase(updatePensionDeduction.fulfilled, (state, action) => {
                const updatedata = action.payload;
                const index = state.pension.findIndex(a => a.id === action.payload.id);
                if (index !== -1) {
                    state.pension[index] = {
                        ...state.pension[index], ...updatedata
                    };
                }
                state.loading = false;
            })
            .addCase(updatePensionDeduction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
    }
}));


export default pensionDeductionSlice.reducer;