import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "global/AxiosSetting";


export const fetchEmployees = createAsyncThunk(
    "employee/fetchEmployees",
    async (credentials, { rejectWithValue }) => {
        const { page, limit, search, institute } = credentials;
        try {
            const response = await axiosInstance.get(`/employees?search=${search}&page=${page}&limit=${limit}&institute=${institute}`);           
            if (response.status === 204) {               
                return { employees: [], totalCount: 0 };
            }

            return {
                data: response.data.data,
                totalCount: response.data.total_count
            };
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch employees");
        }
    }
);

export const fetchEmployeeById = createAsyncThunk(
    "employee/fetchEmployeeById",
    async (id, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/employees/${id}`);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch employee details");
        }
    }
);

export const storeEmployee = createAsyncThunk(
    "employee/addEmployee",
    async (employeeData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post("/employees", employeeData);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to add employee");
        }
    }
);


export const updateEmployeeStatus = createAsyncThunk(
    "employee/updateEmployeeStatus",
    async ({ employeeId, statusData }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`/employee-status/${employeeId}?_method=PUT`, statusData);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to update employee status");
        }
    }
);

// Fetch employee status by employee ID
export const fetchEmployeeStatus = createAsyncThunk(
    "employeeStatus/fetchEmployeeStatus",
    async (employeeId, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/employee-status/${employeeId}`);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch employee status");
        }
    }
)

export const addEmploeeStatus = createAsyncThunk(
    "employee/addEmployeeStatus",
    async (statusData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post("/employee-status", statusData);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to add employee status");
        }
    }
);

export const fetchEmployeeBankdetail = createAsyncThunk(
    "employeeBank/fetchEmployeeBankdetail",
    async ({ employeeId }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/employee-bank?employee_id=${employeeId}`);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch employee bank details");
        }
    }
);

export const fetchEmployeeBankdetailStatus = createAsyncThunk(
    "bankStatus/fetchEmployeeBankdetailStatus",
    async (employeeId, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/employee-bank/${employeeId}`);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch employee bank details");
        }
    }
);

export const addBankdetails = createAsyncThunk(
    "employeeBankStatus/addBankdetails",
    async (bankData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post("/employee-bank", bankData);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to add employee bank status");
        }
    }
);

export const updateEmployeeBankdetail = createAsyncThunk(
    "employee/updateEmployeeBankdetail",
    async ({ employeeId, bankData }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`/employee-bank/${employeeId}?_method=PUT`, bankData);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to update employee bank details");
        }
    }
);

export const fetchEmployeeDesignationStatus = createAsyncThunk(
    "designationStatus/fetchEmployeeDesignationStatus",
    async (employeeId, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/employee-designation/${employeeId}`);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch employee designation status");
        }
    }
);

export const addDesignation = createAsyncThunk(
    "employee/addDesignation",
    async (designationData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post("/employee-designation", designationData);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to add designation");
        }
    }
);

export const updateDesignation = createAsyncThunk(
    "employee/updateDesignation",
    async ({ employeeId, designationData }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`/employee-designation/${employeeId}?_method=PUT`, designationData);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to update designation");
        }
    }
);

export const UpdateEmployee = createAsyncThunk(
    "employee/updateEmployee",
    async ({ employeeId, employeeData }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(`/employees/${employeeId}`, employeeData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response || "Failed to update employee");
        }
    }
);

const initialState = {
    employees: [],
    employeeStatus: [],
    employeeBank: [],
    bankStatus: [],
    designationStatus: [],
    totalCount: 0,
    EmployeeDetail: null,
    loading: false,
    error: null,
};

const employeeSlice = createSlice({
    name: 'employee',
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(fetchEmployees.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchEmployees.fulfilled, (state, action) => {
                state.loading = false;
                state.employees = action.payload.data;
                state.totalCount = action.payload.totalCount;
            })
            .addCase(fetchEmployees.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchEmployeeById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchEmployeeById.fulfilled, (state, action) => {
                state.loading = false;
                state.EmployeeDetail = action.payload;
            })
            .addCase(fetchEmployeeById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(storeEmployee.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(storeEmployee.fulfilled, (state, action) => {
                state.loading = false;
                state.employees.push(action.payload);
            })
            .addCase(storeEmployee.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateEmployeeStatus.fulfilled, (state, action) => {
                state.loading = false;
                if (state.EmployeeDetail) {
                    const index = state.EmployeeDetail.employee_status.findIndex(
                        (status) => status.id === action.payload.id
                    );
                    
                    if (index !== -1) {
                        state.EmployeeDetail.employee_status[index] = action.payload;
                    } else {
                        state.EmployeeDetail.employee_status.push(action.payload);
                    }
                }
            })
            .addCase(fetchEmployeeStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchEmployeeStatus.fulfilled, (state, action) => {
                state.loading = false;
                state.employeeStatus = action.payload;
            })
            .addCase(fetchEmployeeStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(addEmploeeStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addEmploeeStatus.fulfilled, (state, action) => {
                state.loading = false;
                if (state.EmployeeDetail) {
                    state.EmployeeDetail.employee_status.push(action.payload);
                }
            })
            .addCase(addEmploeeStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchEmployeeBankdetail.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchEmployeeBankdetail.fulfilled, (state, action) => {
                state.loading = false;
                state.employeeBank = action.payload;
            })
            .addCase(fetchEmployeeBankdetail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchEmployeeBankdetailStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchEmployeeBankdetailStatus.fulfilled, (state, action) => {
                state.loading = false;
                state.bankStatus = action.payload;
            })
            .addCase(fetchEmployeeBankdetailStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(addBankdetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addBankdetails.fulfilled, (state, action) => {
                state.loading = false;
                if (state.EmployeeDetail) {
                    state.EmployeeDetail.employee_bank.push(action.payload);
                }
            })
            .addCase(addBankdetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateEmployeeBankdetail.fulfilled, (state, action) => {
                state.loading = false;
                if (state.EmployeeDetail) {
                    // Find the index of the bank detail being updated
                    const index = state.EmployeeDetail.employee_bank.findIndex(
                        (bank) => bank.id === action.payload.id
                    );

                    if (index !== -1) {
                        // Update the specific bank detail in the array
                        state.EmployeeDetail.employee_bank[index] = action.payload;
                    } else {
                        // If the bank detail is not found, add it to the array (optional)
                        state.EmployeeDetail.employee_bank.push(action.payload);
                    }
                }
            })
            .addCase(fetchEmployeeDesignationStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchEmployeeDesignationStatus.fulfilled, (state, action) => {
                state.loading = false;
                state.designationStatus = action.payload; // ✅ Set the fetched data
                // If you want to also set the history status, you can do so here
            })
            .addCase(fetchEmployeeDesignationStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(addDesignation.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addDesignation.fulfilled, (state, action) => {
                state.loading = false;
                if (state.EmployeeDetail) {
                    state.EmployeeDetail.employee_designation.push(action.payload);
                }
            })
            .addCase(addDesignation.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateDesignation.fulfilled, (state, action) => {
                state.loading = false;
                if (state.EmployeeDetail) {
                    // Find the index of the designation being updated
                    const index = state.EmployeeDetail.employee_designation.findIndex(
                        (designation) => designation.id === action.payload.id
                    );

                    if (index !== -1) {
                        // Update the specific designation in the array
                        state.EmployeeDetail.employee_designation[index] = action.payload;
                    } else {
                        // If the designation is not found, add it to the array (optional)
                        state.EmployeeDetail.employee_designation.push(action.payload);
                    }
                }
            })
            .addCase(UpdateEmployee.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(UpdateEmployee.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.employees.findIndex(emp => emp.id === action.payload.id);
                if (index !== -1) {
                    state.employees[index] = action.payload;
                }
            })
            .addCase(UpdateEmployee.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },

})


export default employeeSlice.reducer;
