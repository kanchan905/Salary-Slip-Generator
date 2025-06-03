import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from 'global/AxiosSetting';

export const fetchPensionRelated = createAsyncThunk(
    'info/fetchPensionRelated',
    async ({ page, limit }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/pension-related-information?page=${page}&limit=${limit}`);
            return {
                data: response.data.data,
                totalCount: response.data.total_count
            };
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to update employee");
        }
    }
);


const initialState = {
    pensionRelated: [],
    totalCount: 0,
    loading: false,
    error: null
}


const pensionSLice = createSlice({
    name: 'pension',
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(fetchPensionRelated.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchPensionRelated.fulfilled, (state, action) => {
                state.loading = false;
                state.pensionRelated = action.payload.data;
                state.totalCount = action.payload.totalCount;
            })
            .addCase(fetchPensionRelated.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
    }
})

export default pensionSLice.reducer;