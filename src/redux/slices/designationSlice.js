import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "global/AxiosSetting";


export const fetchDesignations = createAsyncThunk(
    "designations/fetch",
    async ( _, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/designation');
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch designations");
        }
    }
);


export const createDesignation = createAsyncThunk(
    "designations/create",
    async (designationData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/designation', designationData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to create designation");
        }
    }
);

export const updateDesignation = createAsyncThunk(
    "designations/update",
    async ({ id, designationData }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(`/designation/${id}?_method=PUT`, designationData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to update designation");
        }
    }
);

export const showDesignation = createAsyncThunk(
    "designations/show",
    async (id, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/designation/${id}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch designation");
        }
    }
);


const initialState = {
    designations: [],
    showDesignation: null,
    loading: false,
    error: null
};


const designationSlice = createSlice({
    name: "designations",
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(fetchDesignations.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDesignations.fulfilled, (state, action) => {
                state.loading = false;
                state.designations = action.payload;
            })
            .addCase(fetchDesignations.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createDesignation.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createDesignation.fulfilled, (state, action) => {
                state.loading = false;
                state.designations.push(action.payload);
            })
            .addCase(createDesignation.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateDesignation.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateDesignation.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.designations.findIndex(designation => designation.id === action.payload.id);
                if (index !== -1) {
                    state.designations[index] = action.payload;
                }
            })
            .addCase(updateDesignation.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(showDesignation.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(showDesignation.fulfilled, (state, action) => {
                state.loading = false;
                state.showDesignation = action.payload;
            })
            .addCase(showDesignation.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});



export default designationSlice.reducer;
