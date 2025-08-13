import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from "global/AxiosSetting";


const initialState = {
    payCommissions: [],
    totalCount: 0,
    singleCommission: null,
    loading: false,
    error: null,
    paySlipCount: 0,
};


export const fetchPayCommisions = createAsyncThunk(
    'payCommissions/fetchPayCommisions',
    async (_, thunkAPI) => {
        try {
            const res = await axiosInstance.get(`/pay-commission`);
            return res.data.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

export const fetchPayCommisionShow = createAsyncThunk(
    'payCommissions/fetchPayCommisionShow',
    async (id, thunkAPI) => {
        try {
            const res = await axiosInstance.get(`/pay-commission/${id}`);
            return res.data.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);


export const addPayCommisions = createAsyncThunk(
    'payCommissions/addPayCommisions',
    async (data, thunkAPI) => {
        try {
            const res = await axiosInstance.post(`/pay-commission`, {
                name: data.name,
                year: data.year,
                is_active: data.status
            });
            return res.data.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

export const updatePayCommisions = createAsyncThunk(
    'payCommissions/updatePayCommisions',
    async ({id, values}, thunkAPI) => {
        try {
            const res = await axiosInstance.put(`/pay-commission/${id}`, {
                name: values.name,
                year: values.year,
                is_active: values.is_active
            });
            return res.data.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);



const payCommisionSlice = createSlice({
    name: 'payCommissions',
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(fetchPayCommisions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPayCommisions.fulfilled, (state, action) => {
                state.loading = false;
                state.payCommissions = action.payload
            })
            .addCase(fetchPayCommisions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(addPayCommisions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addPayCommisions.fulfilled, (state, action) => {
                state.loading = false;
                state.payCommissions.push(action.payload);
            })
            .addCase(addPayCommisions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updatePayCommisions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPayCommisionShow.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPayCommisionShow.fulfilled, (state, action) => {
                state.loading = false;
                state.singleCommission = action.payload;
            })
            .addCase(fetchPayCommisionShow.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updatePayCommisions.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.payCommissions.findIndex(commission => commission.id === action.payload.id);
                if (index !== -1) {
                    state.payCommissions[index] = action.payload;
                }
            })
            .addCase(updatePayCommisions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
})

export default payCommisionSlice.reducer;
