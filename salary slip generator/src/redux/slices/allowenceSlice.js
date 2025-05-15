import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "global/AxiosSetting";


// ------------------ DEARNESS ALLOWANCE ------------------

// Fetch Dearness Allowance Rate
export const fetchDearnessAllowance = createAsyncThunk(
    "dearnessAllowance/fetchDearnessAllowance",
    async ({ page, limit }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`dearness-allowance-rate?page=${page}&limit=${limit}`);
            console.log("DR Res", response);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch dearness allowance");
        }
    }
);

// Add Dearness Allowance
export const addDearnessAllowance = createAsyncThunk(
    "dearnessAllowance/addDearnessAllowance",
    async (data, { rejectWithValue }) => {
        try {
            const { rate_percentage ,pwd_rate_percentage, effective_from, effective_till, notification_ref } = data.data;
            const response = await axiosInstance.post("/dearness-allowance-rate", {
                rate_percentage,
                pwd_rate_percentage, 
                effective_from, 
                effective_till, 
                notification_ref
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to add dearness allowance");
        }
    }
);

// Update Dearness Allowance
export const updateDearnessAllowance = createAsyncThunk(
    "dearnessAllowance/updateDearnessAllowance",
    async (data, { rejectWithValue }) => {
        try {
            const {
                id,
                rate_percentage,
                pwd_rate_percentage,
                effective_from,
                effective_till,
                notification_ref,
            } = data.data;
            const response = await axiosInstance.put(`/dearness-allowance-rate/${id}`, {
                rate_percentage,
                pwd_rate_percentage,
                effective_from,
                effective_till,
                notification_ref,
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to update dearness allowance");
        }
    }
);

// ------------------ HOUSE RENT ALLOWANCE ------------------

// Fetch House Rent Allowance Rate
export const fetchHouseRent = createAsyncThunk(
    "houseRentAllowance/fetchHouseRent",
    async ({ page, limit }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`house-rent-allowance-rate?page=${page}&limit=${limit}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch house rent allowance");
        }
    }
);

// Add House Rent Allowance
export const addHouseRent = createAsyncThunk(
    "houseRentAllowance/addHouseRent",
    async (data, { rejectWithValue }) => {
        try {
            const { city_class, rate_percentage, effective_from, effective_till, notification_ref } = data.data;
            const response = await axiosInstance.post("/house-rent-allowance-rate", {
                city_class, 
                rate_percentage, 
                effective_from, 
                effective_till, 
                notification_ref
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to add house rent allowance");
        }
    }
);

// Update House Rent Allowance
export const updateHouseRent = createAsyncThunk(
    "houseRentAllowance/updateHouseRent",
    async (data, { rejectWithValue }) => {
        try {
            const {
                id,
                city_class,
                rate_percentage,
                effective_from,
                effective_till,
                notification_ref,
            } = data.data;
            const response = await axiosInstance.put(`/house-rent-allowance-rate/${id}`, {
                city_class,
                rate_percentage,
                effective_from,
                effective_till,
                notification_ref,
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to update house rent allowance");
        }
    }
);

// ------------------ NON-PRACTICING ALLOWANCE ------------------

// Fetch Non Practicing Allowance Rate
export const fetchNonPracticing = createAsyncThunk(
    "nonPracticing/fetchNonPracticing",
    async ({ page, limit }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`non-practicing-allowance-rate?page=${page}&limit=${limit}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch non-practicing allowance rate");
        }
    }
);

// Add Non Practicing Allowance Rate
export const addNonPracticing = createAsyncThunk(
    "nonPracticing/addNonPracticing",
    async (data, { rejectWithValue }) => {
        try {
            const {
                applicable_post,
                rate_percentage,
                effective_from,
                effective_till,
                notification_ref,
            } = data.data;
            const response = await axiosInstance.post("/non-practicing-allowance-rate", {
                applicable_post,
                rate_percentage,
                effective_from,
                effective_till,
                notification_ref,
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to add non-practicing allowance rate");
        }
    }
);

// Update Non Practicing Allowance Rate
export const updateNonPracticing = createAsyncThunk(
    "nonPracticing/updateNonPracticing",
    async (data, { rejectWithValue }) => {
        try {
            const {
                id,
                applicable_post,
                rate_percentage,
                effective_from,
                effective_till,
                notification_ref,
            } = data.data;
            const response = await axiosInstance.put(`/non-practicing-allowance-rate/${id}`, {
                applicable_post,
                rate_percentage,
                effective_from,
                effective_till,
                notification_ref,
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to update non-practicing allowance rate");
        }
    }
);


const initialState = {
    dearnessAllowance: {
        list: [],
        loading: false,
        error: null,
    },
    houseRent: {
        list: [],
        loading: false,
        error: null,
    },
    nonPracticing: {
        list: [],
        loading: false,
        error: null,
    },
};


const allowanceSlice = createSlice({
    name: "allowance",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
    // Dearness Allowance
    builder
        .addCase(fetchDearnessAllowance.pending, (state) => {
            state.dearnessAllowance.loading = true;
            state.dearnessAllowance.error = null;
        })
        .addCase(fetchDearnessAllowance.fulfilled, (state, action) => {
            state.dearnessAllowance.loading = false;
            state.dearnessAllowance.list = action.payload.data || [];
        })
        .addCase(fetchDearnessAllowance.rejected, (state, action) => {
            state.dearnessAllowance.loading = false;
            state.dearnessAllowance.error = action.payload;
        })
        .addCase(addDearnessAllowance.fulfilled, (state, action) => {
            state.dearnessAllowance.list.push(action.payload.data);
        })
        .addCase(updateDearnessAllowance.fulfilled, (state, action) => {
            const updated = action.payload.data;
            const index = state.dearnessAllowance.list.findIndex((item) => item.id === updated.id);
            if (index !== -1) state.dearnessAllowance.list[index] = updated;
        });

    // House Rent Allowance
    builder
        .addCase(fetchHouseRent.pending, (state) => {
            state.houseRent.loading = true;
            state.houseRent.error = null;
        })
        .addCase(fetchHouseRent.fulfilled, (state, action) => {
            state.houseRent.loading = false;
            state.houseRent.list = action.payload.data || [];
        })
        .addCase(fetchHouseRent.rejected, (state, action) => {
            state.houseRent.loading = false;
            state.houseRent.error = action.payload;
        })
        .addCase(addHouseRent.fulfilled, (state, action) => {
            state.houseRent.list.push(action.payload.data);
        })
        .addCase(updateHouseRent.fulfilled, (state, action) => {
            const updated = action.payload.data;
            const index = state.houseRent.list.findIndex((item) => item.id === updated.id);
            if (index !== -1) state.houseRent.list[index] = updated;
        });

    // Non Practicing Allowance
    builder
        .addCase(fetchNonPracticing.pending, (state) => {
            state.nonPracticing.loading = true;
            state.nonPracticing.error = null;
        })
        .addCase(fetchNonPracticing.fulfilled, (state, action) => {
            state.nonPracticing.loading = false;
            state.nonPracticing.list = action.payload.data || [];
        })
        .addCase(fetchNonPracticing.rejected, (state, action) => {
            state.nonPracticing.loading = false;
            state.nonPracticing.error = action.payload;
        })
        .addCase(addNonPracticing.fulfilled, (state, action) => {
            state.nonPracticing.list.push(action.payload.data);
        })
        .addCase(updateNonPracticing.fulfilled, (state, action) => {
            const updated = action.payload.data;
            const index = state.nonPracticing.list.findIndex((item) => item.id === updated.id);
            if (index !== -1) state.nonPracticing.list[index] = updated;
        });
    },
});

export default allowanceSlice.reducer;