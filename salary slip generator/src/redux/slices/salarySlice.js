import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from 'global/AxiosSetting';




export const fetchNpaData = createAsyncThunk(
    'npa/fetchNpaData',
    async ({ page, limit }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/non-practicing-allowance-rate?page=${page}&limit=${limit}`);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to update employee");
        }
    }
);

export const fetchHraData = createAsyncThunk(
    'hra/fetchHraData',
    async ({ page, limit }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/house-rent-allowance-rate?page=${page}&limit=${limit}`);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to update employee");
        }
    }
);


export const fetchDaData = createAsyncThunk(
    'da/fetchDaData',
    async ({ page, limit }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/dearness-allowance-rate?page=${page}&limit=${limit}`);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to update employee");
        }
    }
);

export const fetchUniformData = createAsyncThunk(
    'uniform/fetchUniformData',
    async ({ page, limit }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/uniform-allowance-rate?page=${page}&limit=${limit}`);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to update employee");
        }
    }
);

export const fetchTransportData = createAsyncThunk(
    'transport/fetchTransportData',
    async ({ page, limit }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/transport-allowance-rate?page=${page}&limit=${limit}`);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to update employee");
        }
    }
);

export const fetchGisData = createAsyncThunk(
    'gis/fetchGisData',
    async ({ page, limit }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/employee-gis?page=${page}&limit=${limit}&employee_id=`);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to update employee");
        }
    }
);



const initialState = {
    activeStep: 0,
    formData: {
        pay_structure_id: '',
        npa_rate_id: '',
        hra_rate_id: '',
        da_rate_id: '',
        uniform_rate_id: '',
        pay_plus_npa: '',
        govt_contribution: '',
        arrears: '',
        spacial_pay: '',
        da_1: '',
        da_2: '',
        itc_leave_salary: '',
        employee_id: '',
        month: '',
        year: '',
        processing_date: '',
        employee_bank_id: '',
        payment_date: '',
    },
    deductionForm: {
        net_salary_id: '',
        income_tax: '',
        professional_tax: '',
        license_fee: '',
        nfch_donation: '',
        gpf: '',
        transport_allowance_recovery: '',
        hra_recovery: '',
        computer_advance: '',
        computer_advance_installment: '',
        computer_advance_inst_no: '',
        computer_advance_balance: '',
        employee_contribution_10: '',
        govt_contribution_14_recovery: '',
        dies_non_recovery: '',
        computer_advance_interest: '',
        pay_recovery: '',
        nps_recovery: '',
        lic: '',
        credit_society_membership: ''
    },
    bulkForm: {
        month: '',
        year: '',
        processing_date: '',
        payment_date: '',
    },
    npaList: [],
    hraList: [],
    daList: [],
    uniformList: [],
    transportList: [],
    gisList: [],
    basic_pay: '',
    npa_amount: '',
    hra_amount: '',
    da_amount: '',
    uniform_amount: '',
    transport_amount: '',
    gis_deduction: '',

};

const salarySlice = createSlice({
    name: 'salary',
    initialState,
    reducers: {
        nextStep: (state) => {
            if (state.activeStep < 4) state.activeStep += 1;
        },
        prevStep: (state) => {
            if (state.activeStep > 0) state.activeStep -= 1;
        },
        updateField: (state, action) => {
            const { name, value } = action.payload;
            if (state.activeStep === 1) {
                const isDateField = ['processing_date', 'payment_date'].includes(name);

                const formatDate = (date) => {
                    if (!date) return '';
                    const d = new Date(date);
                    const year = d.getFullYear();
                    const month = String(d.getMonth() + 1).padStart(2, '0');
                    const day = String(d.getDate()).padStart(2, '0');
                    return `${year}-${month}-${day}`;
                };

                state.formData[name] = ['month', 'year'].includes(name)
                    ? Number(value) || 0
                    : isDateField
                        ? formatDate(value)
                        : value;
            }
        },
        bulkUpdateField: (state, action) => {
            const { name, value } = action.payload;
            if (state.activeStep === 0) {
                const isDateField = ['processing_date', 'payment_date'].includes(name);

                const formatDate = (date) => {
                    if (!date) return '';
                    const d = new Date(date);
                    const year = d.getFullYear();
                    const month = String(d.getMonth() + 1).padStart(2, '0');
                    const day = String(d.getDate()).padStart(2, '0');
                    return `${year}-${month}-${day}`;
                };

                // state.bulkForm[name] = isDateField ? formatDate(value) : value;
                 state.bulkForm[name] = ['month', 'year'].includes(name)
                    ? Number(value) || 0
                    : isDateField
                        ? formatDate(value)
                        : value;
            }
        },
        setDeductionField: (state, action) => {
            const { name, value } = action.payload;
            state.deductionForm[name] = Number(value);
        },
        setBasicPayAmount: (state, action) => {
            state.basic_pay = action.payload
        },
        setNpaAmount: (state, action) => {
            const { basic_pay, npaRate } = action.payload;
            const npaAmount = (basic_pay * npaRate) / 100;
            state.basic_pay = basic_pay;
            state.npa_amount = npaAmount;
        },
        setHraAmount: (state, action) => {
            const { basic_pay, hra_percentage } = action.payload;
            const hraamount = (basic_pay * hra_percentage) / 100;
            state.basic_pay = basic_pay;
            state.hra_amount = hraamount;
        },
        setDaAmount: (state, action) => {
            const { basic_pay, da_percentage, npa_amount } = action.payload;
            const daamount = ((basic_pay + npa_amount) * da_percentage) / 100
            // const daamount = (basic_pay * da_percentage) / 100;
            state.basic_pay = basic_pay;
            state.da_amount = daamount;
        },
        setUniformAmount: (state, action) => {
            const { basic_pay, uniform_percentage } = action.payload;
            state.basic_pay = basic_pay;
            state.uniform_amount = uniform_percentage;
        },
        setTransportRate: (state, action) => {
            state.transport_amount = action.payload;
        },
        setGisDeduction: (state, action) => {
            state.gis_deduction = action.payload;
        },
        resetSalaryState: () => initialState,
        reset: (state) => {
            state.formData = initialState.formData;
            state.deductionForm = initialState.deductionForm;
            state.activeStep = 0;
        },
        resetBulkState: (state) => {
            state.bulkForm = initialState.bulkForm;
            state.activeStep = 0;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchNpaData.fulfilled, (state, action) => {
                state.npaList = action.payload;
            })
            .addCase(fetchHraData.fulfilled, (state, action) => {
                state.hraList = action.payload;
            })
            .addCase(fetchDaData.fulfilled, (state, action) => {
                state.daList = action.payload;
            })
            .addCase(fetchUniformData.fulfilled, (state, action) => {
                state.uniformList = action.payload;
            })
            .addCase(fetchTransportData.fulfilled, (state, action) => {
                state.transportList = action.payload;
            })
            .addCase(fetchGisData.fulfilled, (state, action) => {
                state.gisList = action.payload;
            })
    }
});

export const { nextStep, prevStep, updateField, setDeductionField, resetSalaryState, setBasicPayAmount, setNpaAmount, setHraAmount, setUniformAmount, setDaAmount, setTransportRate, setGisDeduction, reset, bulkUpdateField, resetBulkState } = salarySlice.actions;
export default salarySlice.reducer;
