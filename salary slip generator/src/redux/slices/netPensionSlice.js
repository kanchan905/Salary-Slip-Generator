import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "global/AxiosSetting";


export const fetchNetPension = createAsyncThunk(
    "Pension/fetchNetPension",
    async ({ page, limit }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/net-pension?page=${page}&limit=${limit}`);
            return {
                data: response.data.data,
                totalCount: response.data.total_count
            };
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch employees");
        }
    }
);

export const updateNetPension = createAsyncThunk(
    "Pension/updateNetPension",
    async ({ id, values}, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`/net-pension/${id}?_method=PUT`, values);
            return  response.data
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch employees");
        }
    }
);

export const showNetPension = createAsyncThunk(
    "Pension/showNetPension",
    async ({ id }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/net-pension/${id}`);
            return response.data.data
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch employees");
        }
    }
);



const initialState = {
    netPension: [],
    netPensionData: null,
    totalCount: 0,
    loading: false,
    error: null
}

const netPensionSlice = createSlice({
    name: 'netPension',
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(fetchNetPension.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(fetchNetPension.fulfilled, (state, action) => {
                state.loading = false;
                state.netPension = action.payload.data;
                state.totalCount = action.payload.totalCount;
            })
            .addCase(fetchNetPension.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateNetPension.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(updateNetPension.fulfilled, (state, action) => {
                const updatedPension = action.payload;
                const index = state.netPension.findIndex(a => a.id === action.payload.id);
                if (index !== -1) {
                    state.netPension[index] = {
                        ...state.netPension[index], ...updatedPension
                    };
                }
                state.loading = false;
            })
            .addCase(updateNetPension.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(showNetPension.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(showNetPension.fulfilled, (state, action) => {
                state.loading = false;
                state.netPensionData = action.payload;
                state.totalCount = action.payload.totalCount;
            })
            .addCase(showNetPension.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    }
})


export default netPensionSlice.reducer;