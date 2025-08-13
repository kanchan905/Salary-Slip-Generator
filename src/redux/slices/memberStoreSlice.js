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
        employee_code: 'Select User',
        prefix: '',
        user_id: '',
        first_name: '',
        middle_name: '',
        last_name: '',
        gender: '',
        date_of_birth: '',
        date_of_joining: '',
        date_of_retirement: '',
        pension_scheme: '',
        pension_number: '',
        gis_eligibility: '0',
        gis_no: '',
        credit_society_member: '0',
        email: '',
        pancard: '',
        increment_month: '',
        uniform_allowance_eligibility: '0',
        hra_eligibility: '0',
        npa_eligibility: '0',
        pwd_status: '0',
        status: '',
        designation_effective_from: '',
        designation_effective_till: '',
        status_effective_from: '',
        status_effective_till: '',
        remark: '',
        order_reference: '',
        designation_group: '',
        designation: '',
        cadre: '',
        job_group: '',
        bank_name: '',
        branch_name: '',
        account_number: '',
        ifsc_code: '',
        is_active:'0',
        promotion_order_no: '',
        institute:''
    },
    designationList: [],
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
export { initialState };
