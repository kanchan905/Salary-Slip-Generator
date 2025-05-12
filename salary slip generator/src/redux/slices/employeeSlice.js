import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getCookie } from "cookies-next";
import axiosInstance from "global/AxiosSetting";


export const fetchEmployees = createAsyncThunk(
    "employee/fetchEmployees",
    async (credentials, { rejectWithValue }) => {
        const { page, limit, search } = credentials;
        const token = getCookie("token");
        try {
            const response = await axiosInstance.get(`/employees?search=${search}&page=${page}&limit=${limit}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch employees");
        }
    }
);

export const fetchEmployeeById = createAsyncThunk(
    "employee/fetchEmployeeById",
    async (id, { rejectWithValue }) => {
        const token = getCookie("token");
        try {
            const response = await axiosInstance.get(`/employees/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // console.log(response.data.data);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch employee details");
        }
    }
);

export const storeEmployee = createAsyncThunk(
    "employee/addEmployee",
    async (employeeData, { rejectWithValue }) => {
        const token = getCookie("token");
        try {
            // console.log(employeeData);
            const response = await axiosInstance.post("/employees", employeeData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to add employee");
        }
    }
);


export const updateEmployeeStatus = createAsyncThunk(
    "employee/updateEmployeeStatus",
    async ({ employeeId, statusData }, { rejectWithValue }) => {
        const token = getCookie("token");
        try {
            const response = await axiosInstance.post(`/employee-status/${employeeId}?_method=PUT`, statusData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log(response.data.data);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to update employee status");
        }
    }
);

export const addEmploeeStatus = createAsyncThunk(
    "employee/addEmployeeStatus",
    async (statusData, { rejectWithValue }) => {
        const token = getCookie("token");
        try {
            console.log(statusData);
            const response = await axiosInstance.post("/employee-status", statusData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to add employee status");
        }
    }
);

export const addBankdetails = createAsyncThunk(
    "employee/addBankdetails",
    async (bankData, { rejectWithValue }) => {
        const token = getCookie("token");
        try {
            const response = await axiosInstance.post("/employee-bank", bankData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to add employee bank details");
        }
    }
);

export const updateEmployeeBankdetail = createAsyncThunk(
    "employee/updateEmployeeBankdetail",
    async ({ employeeId, bankData }, { rejectWithValue }) => {
        const token = getCookie("token");
        try {
            const response = await axiosInstance.post(`/employee-bank/${employeeId}?_method=PUT`, bankData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to update employee bank details");
        }
    }
);

export const addDesignation = createAsyncThunk(
    "employee/addDesignation",
    async (designationData, { rejectWithValue }) => {
        const token = getCookie("token");
        try {
            const response = await axiosInstance.post("/employee-designation", designationData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to add designation");
        }
    }
);

export const updateDesignation = createAsyncThunk(
    "employee/updateDesignation",
    async ({ employeeId, designationData }, { rejectWithValue }) => {
        const token = getCookie("token");
        try {
            const response = await axiosInstance.post(`/employee-designation/${employeeId}?_method=PUT`, designationData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to update designation");
        }
    }
);


const initialState = {
    employees: [],
    EmployeeDetail: null,
    loading: false,
    error: null,
};

const employeeSlice = createSlice({
    name: 'employee',
    initialState,
    reducers: {
        addEmployee: (state, action) => {
            state.employees.push(action.payload);
        },
        deleteEmployee: (state, action) => {
            state.employees = state.employees.filter(emp => emp.id !== action.payload);
        },
        deleteMultipleEmployees: (state, action) => {
            state.employees = state.employees.filter(employee => !action.payload.includes(employee.id));
        },
        updateEmployee: (state, action) => {
            const index = state.employees.findIndex(emp => emp.id === action.payload.id);
            if (index !== -1) {
                state.employees[index] = action.payload;
            }
        },
        toggleStatus: (state, action) => {
            state.employees = state.employees.map((employee) =>
                employee.id === action.payload
                    ? { ...employee, status: employee.status === "Active" ? "Inactive" : "Active" }
                    : employee
            );
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchEmployees.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchEmployees.fulfilled, (state, action) => {
                state.loading = false;
                state.employees = action.payload;
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
            .addCase(updateEmployeeStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateEmployeeStatus.fulfilled, (state, action) => {
                state.loading = false;
                if (state.EmployeeDetail) {
                    // Find the index of the status being updated
                    const index = state.EmployeeDetail.employee_status.findIndex(
                        (status) => status.id === action.payload.id
                    );

                    if (index !== -1) {
                        // Update the specific status in the array
                        state.EmployeeDetail.employee_status[index] = action.payload;
                    } else {
                        // If the status is not found, add it to the array (optional)
                        state.EmployeeDetail.employee_status.push(action.payload);
                    }
                }
            })
            .addCase(updateEmployeeStatus.rejected, (state, action) => {
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
            .addCase(updateEmployeeBankdetail.pending, (state) => {
                state.loading = true;
                state.error = null;
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
            .addCase(updateEmployeeBankdetail.rejected, (state, action) => {
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
            .addCase(updateDesignation.pending, (state) => {
                state.loading = true;
                state.error = null;
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
            .addCase(updateDesignation.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    },

})

export const { addEmployee, deleteEmployee, deleteMultipleEmployees, updateEmployee, toggleStatus } = employeeSlice.actions;
export default employeeSlice.reducer;