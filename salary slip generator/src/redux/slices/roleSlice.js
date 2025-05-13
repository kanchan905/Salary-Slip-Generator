import { createSlice,createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from 'global/AxiosSetting';

export const fetchRoleData = createAsyncThunk(
    'role/fetchRoleData',
    async (_, { rejectWithValue }) => {
        try {
                const response = await axiosInstance.get(`/role`);
                return response.data.data;
            } catch (error) {
                return rejectWithValue(error.response?.data || "Failed to update employee");
            }
    }
);

const initialState = {
    roles : [],
    loading: false,
    error: null,
}

const roleSlice = createSlice({
    name: 'role',
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(fetchRoleData.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchRoleData.fulfilled, (state, action) => {
                state.loading = false;
                state.roles = action.payload;
            })
            .addCase(fetchRoleData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});


export default roleSlice.reducer;