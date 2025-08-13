import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "global/AxiosSetting";


// ------------------ DEARNESS ALLOWANCE ------------------

// Fetch Dearness Allowance Rate
export const fetchDearnessAllowance = createAsyncThunk(
    "dearnessAllowance/fetchDearnessAllowance",
    async ({ page, limit }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`dearness-allowance-rate?page=${page}&limit=${limit}`);
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

// Fetch Dearness Allowance Rate Show
export const fetchDearnessAllowanceShow = createAsyncThunk(
    "dearnessAllowanceShow/fetchDearnessAllowanceShow",
    async (id, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`dearness-allowance-rate/${id}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch single dearness allowance");
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


// Fetch House Rent Allowance Rate Show
export const fetchHouseRentShow = createAsyncThunk(
    "houseRentAllowanceShow/fetchHouseRentShow",
    async (id, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`house-rent-allowance-rate/${id}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch house rent allowance show");
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


// Fetch Non Practicing Allowance Rate
export const fetchNonPracticingShow = createAsyncThunk(
    "nonPracticingShow/fetchNonPracticingShow",
    async (id, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`non-practicing-allowance-rate/${id}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch single non-practicing allowance rate");
        }
    }
);


// ------------------ TRANSPORT ALLOWANCE ------------------

// Fetch Transport
export const fetchTransport = createAsyncThunk(
    "transport/fetchTransport",
    async ({ page, limit }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`transport-allowance-rate?page=${page}&limit=${limit}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch transport");
        }
    }
);


// Add Transport Allowance Rate
export const addTransport = createAsyncThunk(
    "transport/addTransport",
    async (data, { rejectWithValue }) => {
        try {
            const {
                transport_amount,
                pay_matrix_level,
            } = data.data;
            const response = await axiosInstance.post("/transport-allowance-rate", {
                amount: transport_amount,
                pay_matrix_level,
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to add transport allowance rate");
        }
    }
);

// Update Transport Allowance Rate
export const updateTransport = createAsyncThunk(
    "transport/updateTransport",
    async (data, { rejectWithValue }) => {
        try {
            const {
                id,
                transport_amount,
                pay_matrix_level,
            } = data.data;
            const response = await axiosInstance.put(`/transport-allowance-rate/${id}`, {
                amount: transport_amount,
                pay_matrix_level,
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to update transport allowance rate");
        }
    }
);

// Fetch Transport Show
export const fetchTransportShow = createAsyncThunk(
    "transportShow/fetchTransportShow",
    async (id, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`transport-allowance-rate/${id}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch single transport");
        }
    }
);


// ------------------ UNIFORM ALLOWANCE ------------------

// Fetch Uniform Allowance
export const fetchUniform = createAsyncThunk(
    "uniform/fetchUniform",
    async ({ page, limit }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`uniform-allowance-rate?page=${page}&limit=${limit}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch uniform allowance");
        }
    }
);

// Add Uniform Allowance
export const addUniform = createAsyncThunk(
    "uniform/addUniform",
    async (data, { rejectWithValue }) => {
        try {
            const {
                applicable_post,
                amount,
                effective_from,
                effective_till,
                notification_ref
            } = data.data;
            const response = await axiosInstance.post("/uniform-allowance-rate", {
                applicable_post,
                amount,
                effective_from,
                effective_till,
                notification_ref
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to add uniform allowance rate");
        }
    }
);

// Update Uniform Allowance
export const updateUniform = createAsyncThunk(
    "uniform/updateUniform",
    async (data, { rejectWithValue }) => {
        try {
            const {
                id,
                applicable_post,
                amount,
                effective_from,
                effective_till,
                notification_ref
            } = data.data;
            const response = await axiosInstance.put(`/uniform-allowance-rate/${id}`, {
                applicable_post,
                amount,
                effective_from,
                effective_till,
                notification_ref
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to update uniform allowance rate");
        }
    }
);


// Fetch Uniform Allowance
export const fetchUniformShow = createAsyncThunk(
    "uniformShow/fetchUniformShow",
    async (id, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`uniform-allowance-rate/${id}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch uniform allowance show");
        }
    }
);


// ------------------ GIS ELIGIBILITY ------------------

// Fetch GIS Eligibility
export const fetchGisEligibility = createAsyncThunk(
    "gisEligibility/fetchGisEligibility",
    async ({ page, limit }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`employee-gis?page=${page}&limit=${limit}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch GIS Eligibility");
        }
    }
);

// Add GIS Eligibility
export const addGisEligibility = createAsyncThunk(
    "gisEligibility/addGisEligibility",
    async (data, { rejectWithValue }) => {
        try {
            const {
                pay_matrix_level,
                scheme_category,
                gis_amount
            } = data.data;
            const response = await axiosInstance.post("/employee-gis", {
                pay_matrix_level,
                scheme_category,
                amount: gis_amount
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to add GIS Eligibility");
        }
    }
);

// Update GIS Eligibility
export const updateGisEligibility = createAsyncThunk(
    "gisEligibility/updateGisEligibility",
    async (data, { rejectWithValue }) => {
        try {
            const {
                id,
                pay_matrix_level,
                scheme_category,
                gis_amount
            } = data.data;
            const response = await axiosInstance.put(`/employee-gis/${id}`, {
                pay_matrix_level,
                scheme_category,
                amount: gis_amount
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to update GIS Eligibility");
        }
    }
);

// Fetch GIS Eligibility
export const fetchGisEligibilityShow = createAsyncThunk(
    "gisEligibilityShow/fetchGisEligibilityShow",
    async (id, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`employee-gis/${id}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch GIS Eligibility show");
        }
    }
);



const initialState = {
    dearnessAllowance: {
        list: [],
        dearnessAllowanceShow: null,
        loading: false,
        totalCount: 0,
        error: null,
    },
    houseRent: {
        list: [],
        houseRentAllowanceShow: null,
        loading: false,
        totalCount: 0,
        error: null,
    },
    nonPracticing: {
        list: [],
        nonPracticingShow: null,
        loading: false,
        totalCount: 0,
        error: null,
    },
    transport: {
        list: [],
        transportShow: null,
        loading: false,
        totalCount: 0,
        error: null,
    },
    uniform: {
        list: [],
        uniformShow: null,
        loading: false,
        totalCount: 0,
        error: null,
    },
    gisEligibility: {
        list: [],
        gisEligibilityShow: null,
        loading: false,
        totalCount: 0,
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
            state.dearnessAllowance.totalCount = action.payload.total_count || 0;
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
        })
        .addCase(fetchDearnessAllowanceShow.pending, (state) => {
            state.dearnessAllowance.loading = true;
            state.dearnessAllowance.error = null;
        })
        .addCase(fetchDearnessAllowanceShow.fulfilled, (state, action) => {
            state.dearnessAllowance.loading = false;
            state.dearnessAllowance.dearnessAllowanceShow = action.payload;
        })
        .addCase(fetchDearnessAllowanceShow.rejected, (state, action) => {
            state.dearnessAllowance.loading = false;
            state.dearnessAllowance.error = action.payload;
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
            state.houseRent.totalCount = action.payload.total_count || 0;
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
        })
        .addCase(fetchHouseRentShow.pending, (state) => {
            state.houseRent.loading = true;
            state.houseRent.error = null;
        })
        .addCase(fetchHouseRentShow.fulfilled, (state, action) => {
            state.houseRent.loading = false;
            state.houseRent.houseRentAllowanceShow = action.payload.data || [];
        })
        .addCase(fetchHouseRentShow.rejected, (state, action) => {
            state.houseRent.loading = false;
            state.houseRent.error = action.payload;
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
            state.nonPracticing.totalCount = action.payload.total_count || 0;
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
        })
        .addCase(fetchNonPracticingShow.pending, (state) => {
            state.nonPracticing.loading = true;
            state.nonPracticing.error = null;
        })
        .addCase(fetchNonPracticingShow.fulfilled, (state, action) => {
            state.nonPracticing.loading = false;
            state.nonPracticing.nonPracticingShow = action.payload.data || [];
        })
        .addCase(fetchNonPracticingShow.rejected, (state, action) => {
            state.nonPracticing.loading = false;
            state.nonPracticing.error = action.payload;
        });
        
    // Transport Allowance
    builder
        .addCase(fetchTransport.pending, (state) => {
            state.transport.loading = true;
            state.transport.error = null;
        })
        .addCase(fetchTransport.fulfilled, (state, action) => {
            state.transport.loading = false;
            state.transport.list = action.payload.data || [];
            state.transport.totalCount = action.payload.total_count || 0;
        })
        .addCase(fetchTransport.rejected, (state, action) => {
            state.transport.loading = false;
            state.transport.error = action.payload;
        })
        .addCase(addTransport.fulfilled, (state, action) => {
            state.transport.list.push(action.payload.data);
        })
        .addCase(updateTransport.fulfilled, (state, action) => {
            const updated = action.payload.data;
            const index = state.transport.list.findIndex((item) => item.id === updated.id);
            if (index !== -1) state.transport.list[index] = updated;
        })
        .addCase(fetchTransportShow.pending, (state) => {
            state.transport.loading = true;
            state.transport.error = null;
        })
        .addCase(fetchTransportShow.fulfilled, (state, action) => {
            state.transport.loading = false;
            state.transport.transportShow = action.payload.data || [];
        })
        .addCase(fetchTransportShow.rejected, (state, action) => {
            state.transport.loading = false;
            state.transport.error = action.payload;
        });

    // Uniform Allowance
    builder
        .addCase(fetchUniform.pending, (state) => {
            state.uniform.loading = true;
            state.uniform.error = null;
        })
        .addCase(fetchUniform.fulfilled, (state, action) => {
            state.uniform.loading = false;
            state.uniform.list = action.payload.data || [];
            state.uniform.totalCount = action.payload.total_count || 0;
        })
        .addCase(fetchUniform.rejected, (state, action) => {
            state.uniform.loading = false;
            state.uniform.error = action.payload;
        })
        .addCase(addUniform.fulfilled, (state, action) => {
            state.uniform.list.push(action.payload.data);
        })
        .addCase(updateUniform.fulfilled, (state, action) => {
            const updated = action.payload.data;
            const index = state.uniform.list.findIndex((item) => item.id === updated.id);
            if (index !== -1) state.uniform.list[index] = updated;
        })
        .addCase(fetchUniformShow.pending, (state) => {
            state.uniform.loading = true;
            state.uniform.error = null;
        })
        .addCase(fetchUniformShow.fulfilled, (state, action) => {
            state.uniform.loading = false;
            state.uniform.uniformShow = action.payload.data || [];
        })
        .addCase(fetchUniformShow.rejected, (state, action) => {
            state.uniform.loading = false;
            state.uniform.error = action.payload;
        });

    // GIS Eligibility
    builder
        .addCase(fetchGisEligibility.pending, (state) => {
            state.gisEligibility.loading = true;
            state.gisEligibility.error = null;
        })
        .addCase(fetchGisEligibility.fulfilled, (state, action) => {
            state.gisEligibility.loading = false;
            state.gisEligibility.list = action.payload.data || [];
            state.gisEligibility.totalCount = action.payload.total_count || 0;
        })
        .addCase(fetchGisEligibility.rejected, (state, action) => {
            state.gisEligibility.loading = false;
            state.gisEligibility.error = action.payload;
        })
        .addCase(addGisEligibility.fulfilled, (state, action) => {
            state.gisEligibility.list.push(action.payload.data);
        })
        .addCase(updateGisEligibility.fulfilled, (state, action) => {
            const updated = action.payload.data;
            const index = state.gisEligibility.list.findIndex((item) => item.id === updated.id);
            if (index !== -1) state.gisEligibility.list[index] = updated;
        })
        .addCase(fetchGisEligibilityShow.pending, (state) => {
            state.gisEligibility.loading = true;
            state.gisEligibility.error = null;
        })
        .addCase(fetchGisEligibilityShow.fulfilled, (state, action) => {
            state.gisEligibility.loading = false;
            state.gisEligibility.gisEligibilityShow = action.payload.data || [];
        })
        .addCase(fetchGisEligibilityShow.rejected, (state, action) => {
            state.gisEligibility.loading = false;
            state.gisEligibility.error = action.payload;
        });
    },
});

export default allowanceSlice.reducer;