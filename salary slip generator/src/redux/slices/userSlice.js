import { createSlice } from '@reduxjs/toolkit';

const initialState = JSON.parse(localStorage.getItem('userData')) || null;

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUserData: (state, action) => {
            // const { username, email, role, institute, status } = action.payload;
            state = action.payload;
        },
        clearUserData: (state) => {
            state = null;
        },
    },
});

export const { setUserData, clearUserData } = userSlice.actions;

export default userSlice.reducer;