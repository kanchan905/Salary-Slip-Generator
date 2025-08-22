import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "global/AxiosSetting";


export const fetchNetPension = createAsyncThunk(
    "Pension/fetchNetPension",
    async ({ page, limit, month, year }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/net-pension?page=${page}&limit=${limit}&month=${month}&year=${year}`);
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
    async ({ id, values }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`/net-pension/${id}?_method=PUT`, values);
            return response.data
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


export const verifyNetPension = createAsyncThunk(
    "pension/verifyNetPension",
    async ({ selected_id, statusField }, { rejectWithValue }) => {
        try {
            const payload = { selected_id };
            if (statusField) payload[statusField] = 1;
            const response = await axiosInstance.post(`/verify-pension`, payload);
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const verifyNetPensionAdmin = createAsyncThunk(
    "salary/verifyNetPensionAdmin",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`/verify-pension`, payload);
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const fetchOwnPension = createAsyncThunk(
    "Pension/fetchOwnPension",
    async ({ month, year, ppo }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/own-pension?month=${month}&year=${year}&ppo_no=${ppo}`);
            return {
                data: response.data.data,
                totalCount: response.data.total_count
            };
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch employees");
        }
    }
);


export const finalizeNetPension = createAsyncThunk(
    "salary/finalizeNetPension",
    async ({ selected_id }, { rejectWithValue }) => {
        try {
            const payload = { selected_id };
            const response = await axiosInstance.post(`/finalize-pension`, payload);
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.errorMsg || err.message);
        }
    }
);

export const releaseNetPension = createAsyncThunk(
    "salary/releaseNetPension",
    async ({ selected_id }, { rejectWithValue }) => {
        try {
            const payload = { selected_id };
            const response = await axiosInstance.post(`/release-pension`, payload);
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.errorMsg || err.message);
        }
    }
);



const initialState = {
    netPension: [],
    netPensionData: null,
    totalCount: 0,
    loading: false,
    error: null,
    ownPension: [],
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
                state.totalCount = action.payload?.totalCount;
            })
            .addCase(showNetPension.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(verifyNetPension.fulfilled, (state, action) => {
                state.loading = false;

            })
            .addCase(verifyNetPensionAdmin.fulfilled, (state, action) => {
                state.loading = false;

            })
            .addCase(fetchOwnPension.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(fetchOwnPension.fulfilled, (state, action) => {
                state.ownPension = action.payload;
            })
            .addCase(fetchOwnPension.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(finalizeNetPension.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(releaseNetPension.fulfilled, (state, action) => {
                state.loading = false;
            })
    }
})


export default netPensionSlice.reducer;