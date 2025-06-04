import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from 'global/AxiosSetting';


export const fetchDesignationList = createAsyncThunk(
    "designation/fetchDesignationList",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/designation`);
            return response.data.data
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch employees");
        }
    }
);

const initialState = {
    activeStep: 0,
    userForm: {
        name: '',
        email: '',
        password: '',
        role_id: 'Select Role',
        institute: 'Select Institute',
    },
    user: {},
    employeeForm: {
        employee_code: '',
        prefix: '',
        user_id: '',
        first_name: '',
        middle_name: '',
        last_name: '',
        gender: '',
        date_of_birth: '',
        date_of_joining: '',
        date_of_retirement: '',
        pwd_status: '',
        pension_scheme: 'Select Scheme',
        pension_number: '',
        gis_eligibility: 'Select gis',
        gis_no: '',
        credit_society_member: 'Select credit',
        email: '',
        pancard: '',
        increment_month: 'Select Month',
        uniform_allowance_eligibility: 'Select uniform',
        hra_eligibility: 'Select hra',
        npa_eligibility: 'Select npa',
        status: 'Select Status',
        effective_from: '',
        effective_till: '',
        remark: '',
        order_reference: '',
        designation: 'Select Designation',
        cadre: 'Select Cadre',
        job_group: 'Select Group',
        bank_name: '',
        branch_name: '',
        account_number: '',
        ifsc_code: ''
    },
    designationList: []
};

const memberStoreSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        updateUserField: (state, action) => {
            const { name, value } = action.payload;
            state.userForm[name] = value;
        },
        updateEmployeeField: (state, action) => {
            const { name, value } = action.payload;
            state.employeeForm[name] = value;
        },
        nextUserStep: (state) => {
            state.activeStep += 1;
        },
        prevUserStep: (state) => {
            state.activeStep -= 1;
        },
        resetUserForm: () => initialState,
        setCreatedUser: (state, action) => {
            const user = action.payload;
            state.user = user;
            state.employeeForm.user_id = user?.id || '';
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDesignationList.fulfilled, (state, action) => {
                state.designationList = action.payload;
            })
    }
});

export const { updateUserField, nextUserStep, prevUserStep, resetUserForm, setCreatedUser, updateEmployeeField } = memberStoreSlice.actions;
export default memberStoreSlice.reducer;
