import { createSlice } from '@reduxjs/toolkit';


export const validateStep = ({ formData, activeStep }) => {
    switch (activeStep) {
        case 1:
            if (!formData.pensioner_id) {
                return { valid: false, message: 'The pensioner  field is required.' };
            }

            if (!formData.pensioner_bank_id) {
                return { valid: false, message: 'The Bank field is required.' };
            }

            if (!formData.month) {
                return { valid: false, message: 'The month field is required.' };
            }

            if (!formData.year) {
                return { valid: false, message: 'The year field is required.' };
            }

            if (!formData.processing_date) {
                return { valid: false, message: 'The Processing Date field is required.' };
            }


            if (!formData.status) {
                return { valid: false, message: 'The status field is required.' };
            }

            if (!formData.dr_id) {
                return { valid: false, message: 'The Dr field is required.' };
            }

            return { valid: true };

        case 2:

            return { valid: true };

        default:
            return { valid: true };
    }
};

const initialState = {
    activeStep: 0,
    formData: {
        pension_related_info_id: '',
        dr_id: '',
        remarks: '',
        status: '',
        pensioner_id: '',
        pensioner_bank_id: '',
        month: '',
        year: '',
        processing_date: '',
        payment_date: '',
        net_pension_id: '',
        income_tax: '',
        recovery: '',
        other: '',
        description: '',
        commutation_amount:'',
        net_pension:'',
        total_pension:'',
        amount:'',
        arrears:[],
        dr_amount:'',
        basic_pension:'',
        additional_pension:'',
        medical_allowance:'',
    },
    bulkForm: {
        month: '',
        year: '',
        processing_date: '',
        payment_date: '',
    },
}


const pensionSlice = createSlice(({
    name: 'pension',
    initialState,
    reducers: {
        nextStep: (state) => {
            if (state.activeStep < 4) state.activeStep += 1;
        },
        prevStep: (state) => {
            if (state.activeStep > 0) state.activeStep -= 1;
        },
        updatePensionField: (state, action) => {
            const { name, value } = action.payload;
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

                state.bulkForm[name] = ['month', 'year'].includes(name)
                    ? Number(value) || 0
                    : isDateField
                        ? formatDate(value)
                        : value;
            }
        },
        reset: (state) => {
            state.formData = initialState.formData;
            state.bulkForm = initialState.bulkForm;
            state.activeStep = 0;
        },
        addArrear: (state) => {
            state.formData.arrears.push({ type: '', amount: '' });
        },
        updateArrear: (state, action) => {
            const { index, name, value } = action.payload;
            state.formData.arrears[index][name] = value;
        },
        removeArrear: (state, action) => {
            const index = action.payload;
            state.formData.arrears.splice(index, 1);
        },
    }
}))


export const { nextStep, prevStep, updatePensionField, bulkUpdateField, reset,addArrear, updateArrear, removeArrear } = pensionSlice.actions
export default pensionSlice.reducer;