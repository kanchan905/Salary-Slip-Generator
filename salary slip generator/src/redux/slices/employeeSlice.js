import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const employeeSlice = createSlice({
    name:'employee',
    initialState,
    reducers:{
        addEmployee:(state,action)=>{
            state.push(action.payload)
        },
        deleteEmployee:(state,action)=>{
            return state.filter(emp => emp.id !== action.payload);
        },
        deleteMultipleEmployees: (state, action) => {
            return state.filter(employee => !action.payload.includes(employee.id));
        },
        updateEmployee: (state, action) => {
            const index = state.findIndex(emp => emp.id === action.payload.id);
            if (index !== -1) {
                state[index] = action.payload;
            }
        },
        toggleStatus:(state,action)=>{
          return state.map((employee) =>
                    employee.id === action.payload
                        ? { ...employee, status: employee.status === "Active" ? "Inactive" : "Active" }
                        : employee
                )
        },
    }
})

export const {addEmployee,deleteEmployee,deleteMultipleEmployees,updateEmployee,toggleStatus} = employeeSlice.actions;
export default employeeSlice.reducer;