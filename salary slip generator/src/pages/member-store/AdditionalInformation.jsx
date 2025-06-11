import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, TextField, Button } from '@mui/material';
import { Formik, Form } from 'formik';
import { toast } from 'react-toastify';
import { resetemployeeForm, updateEmployeeField } from '../../redux/slices/memberStoreSlice';
import { storeEmployee } from '../../redux/slices/employeeSlice';
import { addDesignation } from '../../redux/slices/employeeSlice';
import { addBankdetails } from '../../redux/slices/employeeSlice';

const AdditionalInformation = () => {
    const dispatch = useDispatch();
    const { employeeForm,activeStep } = useSelector((state) => state.memeberStore);
    const {
        employee_code,
        prefix,
        user_id,
        first_name,
        middle_name,
        last_name,
        gender,
        date_of_birth,
        date_of_joining,
        date_of_retirement,
        pwd_status,
        pension_scheme,
        pension_number,
        gis_eligibility,
        gis_no,
        credit_society_member,
        email,
        pancard,
        increment_month,
        uniform_allowance_eligibility,
        hra_eligibility,
        npa_eligibility,
        status,
        effective_from,
        effective_till,
        remark,
        order_reference,
        bank_name,
        branch_name,
        account_number,
        ifsc_code,
        designation,
        cadre,
        job_group,
        promotion_order_no,
        institute,
        is_active,
    } = employeeForm



    const employeeData = {
        employee_code,
        prefix,
        user_id,
        first_name,
        middle_name,
        last_name,
        gender,
        date_of_birth,
        date_of_joining,
        date_of_retirement,
        pwd_status,
        pension_scheme,
        pension_number,
        gis_eligibility,
        gis_no,
        credit_society_member,
        email,
        pancard,
        increment_month,
        uniform_allowance_eligibility,
        hra_eligibility,
        npa_eligibility,
        status,
        effective_from,
        effective_till,
        remark,
        order_reference,
        institute,
    }

    const BankData = {
        bank_name,
        branch_name,
        account_number,
        ifsc_code,
        effective_from,
        is_active 
    }

    const DesignationData = {
        designation,
        cadre,
        job_group,
        effective_from,
        effective_till,
        promotion_order_no,
    }


    const validate = (values) => {
        const errors = {};
        if (!values.promotion_order_no) errors.promotion_order_no = 'Required'
        if (!values.effective_from) errors.effective_from = 'Required';
        if (values.effective_till && values.effective_from) {
            const fromDate = new Date(values.effective_from);
            const tillDate = new Date(values.effective_till);
            if (tillDate <= fromDate) {
                errors.effective_till = 'Must be after Effective From date';
            }
        }
        return errors;
    };

    const handleSubmit = async () => {
        toast.success('Additional information saved');
        console.log('Additional information saved:', employeeForm);
        try {
            // Step 1: Store the main employee data and wait for the result
            const res = await dispatch(storeEmployee(employeeData)).unwrap();
            toast.success('Employee Added Successfully');

            const employeeId = res?.[1]?.employee_id;
            if (!employeeId) {
                // Throw an error if we don't get the ID we need for the next steps
                throw new Error('Could not retrieve employee ID after creation.');
            }

            // Step 2: Add bank details using the new ID and wait for it to complete
            const bankDataWithId = { ...BankData, employee_id: employeeId };
            await dispatch(addBankdetails(bankDataWithId)).unwrap();
            toast.success('Bank Details Added Successfully');

            // Step 3: Add designation using the new ID and wait for it to complete
            const designationDataWithId = { ...DesignationData, employee_id: employeeId };
            await dispatch(addDesignation(designationDataWithId)).unwrap();
            toast.success('Designation Added Successfully');

            // Step 4: Only reset the form if all previous steps were successful
            dispatch(resetemployeeForm());

        } catch (err) {
            // This single catch block will now correctly handle an error from ANY of the steps
            const apiMsg = err?.data?.message || err?.message || 'An error occurred during submission.';
            toast.error(apiMsg);
        }
    };


    const handleChange = (e) => {
        dispatch(updateEmployeeField({ name: e.target.name, value: e.target.value }));
    }

    return (
        <Formik initialValues={employeeForm} enableReinitialize onSubmit={handleSubmit} validate={validate}>
            {({ values, errors, touched }) => (
                <Form>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                name="promotion_order_no"
                                label="Promotion Order No*"
                                value={values.promotion_order_no}
                                onChange={(e)=> handleChange(e)}
                                error={touched.promotion_order_no && Boolean(errors.promotion_order_no)}
                                helperText={touched.promotion_order_no && errors.promotion_order_no}
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                type="date"
                                name="effective_from"
                                label="Effective From*"
                                InputLabelProps={{ shrink: true }}
                                value={values.effective_from}
                                onChange={(e)=> handleChange(e)}
                                error={touched.effective_from && Boolean(errors.effective_from)}
                                helperText={touched.effective_from && errors.effective_from}
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                type="date"
                                name="effective_till"
                                label="Effective Till(if applicable)"
                                InputLabelProps={{ shrink: true }}
                                value={values.effective_till}
                                onChange={(e)=> handleChange(e)}
                                error={touched.effective_till && Boolean(errors.effective_till)}
                                helperText={touched.effective_till && errors.effective_till}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                name="order_reference"
                                label="Order Reference(if applicable)"
                                value={values.order_reference}
                                onChange={(e)=> handleChange(e)}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                name="remark"
                                label="Remark(if applicable)"
                                value={values.remark}
                                onChange={(e)=> handleChange(e)}
                            />
                        </Grid>
                    </Grid>

                    <Grid container justifyContent="flex-end" sx={{ mt: 3 }}>
                        <Button type="submit" variant="contained">Finish</Button>
                    </Grid>
                </Form>
            )}
        </Formik>
    );
};

export default AdditionalInformation;
