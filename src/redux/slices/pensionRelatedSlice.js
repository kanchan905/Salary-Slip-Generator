import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from 'global/AxiosSetting';
import { showPension } from './pensionerSlice';

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

export const CreatePensionRelated = createAsyncThunk(
    'info/CreatePensionRelated',
    async (values, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`/pension-related-information`, values);
            return response.data.data
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to update employee");
        }
    }
);

export const ShowPensionRelated = createAsyncThunk(
    'info/ShowPensionRelated',
    async (id, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/pension-related-information/${id}`);
            return response.data.data
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to update employee");
        }
    }
);

export const UpdatePensionRelated = createAsyncThunk(
    'info/UpdatePensionRelated',
    async ({ id, values }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`/pension-related-information/${id}?_method=PUT`, values);
            return response.data.data
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to update employee");
        }
    }
);


const initialState = {
    pensionRelated: [],
    showPensionRelated: null,
    totalCount: 0,
    loading: false,
    error: null
}


const pensionSLice = createSlice({
    name: 'info',
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
            .addCase(CreatePensionRelated.fulfilled, (state, action) => {
                state.loading = false;
                state.pensionRelated.push(action.payload);
            })
            .addCase(ShowPensionRelated.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(ShowPensionRelated.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            })
            .addCase(ShowPensionRelated.fulfilled, (state, action) => {
                state.loading = false;             
                state.showPensionRelated = action.payload;
            })
            .addCase(UpdatePensionRelated.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.pensionRelated.findIndex(item => item.id === action.payload.id);
                if (index !== -1) {
                    state.pensionRelated[index] = action.payload;
                }
            })
    }
})

export default pensionSLice.reducer;
