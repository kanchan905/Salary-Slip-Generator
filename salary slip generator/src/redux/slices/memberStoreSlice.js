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
    employeeForm: {
        employee_code: 'Select Employee Code',
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
        institute:'Select Institute'
    },
    designationList: []
};

const memberStoreSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        updateEmployeeField: (state, action) => {
            const { name, value } = action.payload;
            state.employeeForm[name] = value;
        },
        updateEmployeeFormFields: (state, action) => {
            const obj = action.payload;
            state.employeeForm = {...state.employeeForm, ...obj };
            
        },
        nextUserStep: (state) => {
            state.activeStep += 1;
        },
        prevUserStep: (state) => {
            state.activeStep -= 1;
        },
        resetemployeeForm: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDesignationList.fulfilled, (state, action) => {
                state.designationList = action.payload;
            })
    }
});

export const { nextUserStep, prevUserStep, resetemployeeForm, setCreatedUser, updateEmployeeField, updateEmployeeFormFields } = memberStoreSlice.actions;
export default memberStoreSlice.reducer;
