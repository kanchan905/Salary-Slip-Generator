import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "global/AxiosSetting";

export const fetchPensioners = createAsyncThunk(
    "pensioner/details",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/pensioner`);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch employees");
        }
    }
);

export const updateStatus = createAsyncThunk(
    "pensioner/status",
    async ({ id, value }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`/pensioner-status/${id}`, value);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch employees");
        }
    }
);

export const createPensioner = createAsyncThunk(
    "pensioner/add",
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`/pensioner`, credentials);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch employees");
        }
    }
)

export const updatePensioner = createAsyncThunk(
    "pensioner/update",
    async ({id,values}, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`/pensioner/${id}?_method=PUT`, values);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch employees");
        }
    }
)

const initialState = {
    pensioners: [],
    loading: false,
    error: null
}

const pensionerSlice = createSlice({
    name: 'pentioner',
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(fetchPensioners.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchPensioners.fulfilled, (state, action) => {
                state.loading = false;
                state.pensioners = action.payload;
            })
            .addCase(fetchPensioners.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateStatus.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateStatus.fulfilled, (state, action) => {
                const updatedPensioner = action.payload;
                const index = state.pensioners.findIndex(p => p.id === updatedPensioner.id);
                if (index !== -1) {
                    state.pensioners[index] = {
                        ...state.pensioners[index],
                        ...updatedPensioner
                    };
                }
                state.loading = false;
            })
            .addCase(updateStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
             .addCase(createPensioner.pending, (state) => {
                state.loading = true;
            })
            .addCase(createPensioner.fulfilled, (state, action) => {
                state.loading = false;
                state.pensioners.push(action.payload);
            })
            .addCase(createPensioner.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
             .addCase(updatePensioner.pending, (state) => {
                state.loading = true;
            })
            .addCase(updatePensioner.fulfilled, (state, action) => {
                const updatedPensioner = action.payload;
                const index = state.pensioners.findIndex(p => p.id === updatedPensioner.id);
                if (index !== -1) {
                    state.pensioners[index] = {
                        ...state.pensioners[index],
                        ...updatedPensioner
                    };
                }
                state.loading = false;
            })
            .addCase(updatePensioner.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    }
})

export default pensionerSlice.reducer;
