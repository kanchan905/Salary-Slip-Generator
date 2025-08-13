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
    retired_employee_id: '',
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
    user_id:'',
  },
  pensionerBankForm: {
    pensioner_id: "",
    bank_name: "",
    branch_name: "",
    account_no: "",
    ifsc_code: "",
    is_active: "Select Status"
  },
  pensionerInfoForm: {
    pensioner_id:  "",
    basic_pension: "",
    commutation_amount: "",
    additional_pension:  "",
    medical_allowance:  "",
    arrear_type:"",
    total_arrear:  "",
    arrear_remarks:  "",
    is_active: "Select Status",
    effective_from: "",
    effective_till: ""
  }
};

const pensionerSlice = createSlice({
  name: 'pensioner',
  initialState,
  reducers: {
    updatePensionerField: (state, action) => {
      const { name, value } = action.payload;
      state.pensionerForm[name] = value;
    },
    updatePensionerFormFields: (state, action) => {
      const obj = action.payload;
      state.pensionerForm = { ...state.pensionerForm, ...obj };
    },
    updatePensionerBankField: (state, action) => {
      if (action.payload.name && action.payload.value !== undefined) {
        // Single field update
        const { name, value } = action.payload;
        state.pensionerBankForm[name] = value;
      } else {
        // Full object update
        state.pensionerBankForm = {
          ...state.pensionerBankForm,
          ...action.payload
        };
      }
    },
    updatePensionerInfoField: (state, action) => {
      if (action.payload.name && action.payload.value !== undefined) {
        // Single field update
        const { name, value } = action.payload;
        state.pensionerInfoForm[name] = value;
      } else {
        // Full form update
        state.pensionerInfoForm = {
          ...state.pensionerInfoForm,
          ...action.payload
        };
      }
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
  updatePensionerFormFields,
  updatePensionerBankField,
  updatePensionerInfoField
} = pensionerSlice.actions;

export default pensionerSlice.reducer;
