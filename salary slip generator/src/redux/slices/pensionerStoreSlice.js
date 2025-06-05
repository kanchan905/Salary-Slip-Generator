import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeStep: 0,
  pensionerForm: {
    ppo_no: '',
    first_name: '',
    middle_name: '',
    last_name: '',
    relation: 'Select relation',
    dob: '',
    pan_number: '',
    mobile_no: '',
    email: '',
    retired_employee_id: 'Select Retired',
    doj: '',
    dor: '',
    start_date: '',
    end_date: '',
    type_of_pension: 'Select Type',
    status: 'Select Status',
    pay_commission: '',
    pay_level: '',
    pay_cell: '',
    pay_commission_at_retirement: '',
    basic_pay_at_retirement: '',
    last_drawn_salary: '',
    NPA: '',
    HRA: '',
    special_pay: '',
    address: '',
    city: '',
    state: '',
    pin_code: '',
  },
};

const pensionerSlice = createSlice({
  name: 'pensioner',
  initialState,
  reducers: {
    updatePensionerField: (state, action) => {
      const { name, value } = action.payload;
      state.pensionerForm[name] = value;
    },
    nextPensionerStep: (state) => {
      state.activeStep += 1;
    },
    prevPensionerStep: (state) => {
      state.activeStep -= 1;
    },
    resetPensionerForm: () => initialState,
  },
});

export const {
  updatePensionerField,
  nextPensionerStep,
  prevPensionerStep,
  resetPensionerForm,
} = pensionerSlice.actions;

export default pensionerSlice.reducer;
