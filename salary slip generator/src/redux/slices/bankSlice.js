import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from 'global/AxiosSetting';

export const fetchBankDetails = createAsyncThunk(
    'bank/fetchBankDetails',
    async ({page,limit,id}, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/bank-account?page=${page}&limit=${limit}&pensioner_id=${id}`);
            return {
                data: response.data.data,
                totalCount: response.data.total_count
            };
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to update employee");
        }
    }
);

export const createBankDetail = createAsyncThunk(
    'bank/createBankDetail',
    async (values, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`/bank-account`, values);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to update employee");
        }
    }
);

export const updateBankDetail = createAsyncThunk(
    'bank/updateBankDetail',
    async ({ id, values }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`/bank-account/${id}?_method=PUT`, values);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to update employee");
        }
    }
);

export const toggleBankDetailStatus = createAsyncThunk(
    'bank/toggleBankDetailStatus',
    async ({ id }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/bank-account/${id}`);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to update employee");
        }
    }
);

export const showBankDetail = createAsyncThunk(
    'bank/showBankDetail',
    async (id, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/bank-account/${id}`);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to update employee");
        }
    }
);


const initialState = {
    bankdetails: [],
    showBank:{},
    totalCount: 0,
    loading: false,
    error: null
}

const bankSlice = createSlice(({
    name: 'bankdetail',
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(fetchBankDetails.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchBankDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.bankdetails = action.payload.data;
                state.totalCount = action.payload.totalCount;
            })
            .addCase(fetchBankDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(createBankDetail.pending, (state) => {
                state.loading = true;
            })
            .addCase(createBankDetail.fulfilled, (state, action) => {
                state.loading = false;
                state.bankdetails.push(action.payload);
            })
            .addCase(createBankDetail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(updateBankDetail.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateBankDetail.fulfilled, (state, action) => {
                const updatedata = action.payload;
                const index = state.bankdetails.findIndex(a => a.id === action.payload.id);
                if (index !== -1) {
                    state.bankdetails[index] = {
                        ...state.bankdetails[index], ...updatedata
                    };
                }
                state.loading = false;
            })
            .addCase(updateBankDetail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(toggleBankDetailStatus.pending, (state) => {
                state.loading = true;
            })
            .addCase(toggleBankDetailStatus.fulfilled, (state, action) => {
                const updateBankStatus = action.payload;
                const index = state.bankdetails.findIndex(bank => bank.id === action.payload.id);
                if (index !== -1) {
                    state.bankdetails[index] = {
                        ...state.bankdetails[index],
                        ...updateBankStatus
                    };
                }
                state.loading = false;
            })
            .addCase(toggleBankDetailStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(showBankDetail.pending, (state) => {
                state.loading = true;
            })
            .addCase(showBankDetail.fulfilled, (state, action) => {
                state.loading = false;
                state.showBank = action.payload;
            })
            .addCase(showBankDetail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
}));


export default bankSlice.reducer;