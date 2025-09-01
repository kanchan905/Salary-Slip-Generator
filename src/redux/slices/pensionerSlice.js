import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "global/AxiosSetting";

export const fetchPensioners = createAsyncThunk(
    "pensioner/details",
    async ({page,limit,id,search}, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/pensioner?page=${page}&limit=${limit}&retired_employee_id=${id}&search=${search}`);
            return {
                data: response.data.data,
                totalCount: response.data.total_count
            };
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
    async ({ id, values }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`/pensioner/${id}?_method=PUT`, values);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch employees");
        }
    }
)

export const showPension = createAsyncThunk(
    "pensionerShow/showPension",
    async (id, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/pensioner/${id}`);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch pension details");
        }
    }
);

export const showPensioner = createAsyncThunk(
    "pensioner/show",
    async (id, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/pensioner/${id}`);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch pension details");
        }
    }
);

const initialState = {
    pensioners: [],
    pensionerShow: null,
    pensioner:{},
    totalCount: 0,
    loading: false,
    error: null,
    pensionerId: null,
}

const pensionerSlice = createSlice({
    name: 'pensioner',
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(fetchPensioners.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchPensioners.fulfilled, (state, action) => {
                state.loading = false;
                state.pensioners = action.payload.data;
                state.totalCount = action.payload.totalCount
            })
            .addCase(fetchPensioners.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
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
            })
            .addCase(createPensioner.pending, (state) => {
                state.loading = true;
            })
            .addCase(createPensioner.fulfilled, (state, action) => {
                state.loading = false;
                state.pensionerId = action.payload.id
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
            .addCase(showPension.pending, (state) => {
                state.loading = true;
            })
            .addCase(showPension.fulfilled, (state, action) => {
                state.loading = false;
                state.pensionerShow = action.payload;
            })
            .addCase(showPension.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(showPensioner.pending, (state,action) => {
                state.loading = true;
            })
            .addCase(showPensioner.fulfilled, (state, action) => {
                state.loading = false;
                state.pensioner = action.payload;
            })
            .addCase(showPensioner.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
})

export default pensionerSlice.reducer;
