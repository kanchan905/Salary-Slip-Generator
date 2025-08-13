import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from 'global/AxiosSetting';

export const fetchDearnessRelief = createAsyncThunk(
    'dear/fetchDearnessRelief',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/dearness-relief`);
            return {
                data: response.data.data,
                totalCount: response.data.total_count
            };
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to update employee");
        }
    }
);

export const createDearnessRelief = createAsyncThunk(
    'dear/createDearnessRelief',
    async (values, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`/dearness-relief`, values);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to update employee");
        }
    }
);

export const updateDearnessRelief = createAsyncThunk(
    'dear/updateDearnessRelief',
    async ({ id, values }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`/dearness-relief/${id}?_method=PUT`, values);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to update employee");
        }
    }
);

export const fetchDearnessReliefShow = createAsyncThunk(
    'showDearness/fetchDearnessReliefShow',
    async (id, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/dearness-relief/${id}`);
            return response.data.data              
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch dearness relief");
        }
    }
);

const initialState = {
    dearness: [],
    showDearness: null,
    totalCount: 0,
    loading: false,
    error: null
}

const dearnessSlice = createSlice(({
    name: 'dearness',
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(fetchDearnessRelief.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchDearnessRelief.fulfilled, (state, action) => {
                state.loading = false;
                state.dearness = action.payload.data;
                state.totalCount = action.payload.totalCount;
            })
            .addCase(fetchDearnessRelief.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(createDearnessRelief.pending, (state) => {
                state.loading = true;
            })
            .addCase(createDearnessRelief.fulfilled, (state, action) => {
                state.loading = false;
                state.dearness.push(action.payload);
            })
            .addCase(createDearnessRelief.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(updateDearnessRelief.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateDearnessRelief.fulfilled, (state, action) => {
                const updatedata = action.payload;
                const index = state.dearness.findIndex(a => a.id === action.payload.id);
                if (index !== -1) {
                    state.dearness[index] = {
                        ...state.dearness[index], ...updatedata
                    };
                }
                state.loading = false;
            })
            .addCase(updateDearnessRelief.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(fetchDearnessReliefShow.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchDearnessReliefShow.fulfilled, (state, action) => {
                state.loading = false;
                state.showDearness = action.payload;
            })
            .addCase(fetchDearnessReliefShow.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
}));


export default dearnessSlice.reducer;