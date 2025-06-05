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

const splitName = (fullName) => {
    const parts = fullName?.trim().split(" ");

    return {
        firstName: parts[0] || "",
        middleName: parts.length > 2 ? parts.slice(1, -1).join(" ") : "",
        lastName: parts.length > 1 ? parts[parts.length - 1] : ""
    };
};


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
        prefix: 'Select Prefix',
        user_id: '',
        first_name: '',
        middle_name: '',
        last_name: '',
        gender: 'Select Gender',
        date_of_birth: '',
        date_of_joining: '',
        date_of_retirement: '',
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
        pwd_status: 'Select pwd',
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
        ifsc_code: '',
        is_active:'Select status',
        promotion_order_no: '',
        institute:''
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
            const { firstName, middleName, lastName } = splitName(user?.name);
            state.employeeForm.user_id = user?.id || '';
            state.employeeForm.email = user?.email || '';
            state.employeeForm.first_name = firstName;
            state.employeeForm.middle_name = middleName;
            state.employeeForm.last_name = lastName;
            state.employeeForm.institute = user?.institute;
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
