import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, TextField, Button } from '@mui/material';
import { Formik, Form } from 'formik';
import { toast } from 'react-toastify';
import { updateEmployeeField, nextUserStep } from '../../redux/slices/memberStoreSlice';
import { storeEmployee } from '../../redux/slices/employeeSlice';
import { addDesignation } from '../../redux/slices/employeeSlice';
import { addBankdetails } from '../../redux/slices/employeeSlice';

const AdditionalInformation = ({ onNext }) => {
    const dispatch = useDispatch();
    const { employeeForm } = useSelector((state) => state.memeberStore);
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
        order_reference
    }

    const BankData = {
        bank_name,
        branch_name,
        account_number,
        ifsc_code,
        effective_from,
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
        if(!values.promotion_order_no) errors.promotion_order_no = 'Required'
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

    const handleSubmit = (values) => {
        try {
            Object.entries(values).forEach(([key, value]) => {
                dispatch(updateEmployeeField({ name: key, value }));
            });
            toast.success('Additional information saved');
            dispatch(storeEmployee(employeeData)).unwrap()
                .then((res) => {
                    toast.success('Employee Added');
                    console.log(res)
                    const bankData = { ...BankData, employee_id: res.id }
                    dispatch(addBankdetails(bankData)).unwrap()
                        .then(() => {
                            toast.success('Bank Detail of Employee Added');
                        })
                    const designationData = { ...DesignationData, employee_id: res.id }
                    dispatch(addDesignation(designationData)).unwrap()
                        .then(() => {
                            toast.success('Designation of Employee Added');
                        })
                })
                .catch((err) => {
                    const apiMsg = err?.data?.message || err?.message || err?.errorMsg || 'Failed to add employee.';
                    toast.error(apiMsg);
                });

            console.log(employeeForm);
        } catch (err) {
            toast.error('Failed to save additional information');
        }
    };

    return (
        <Formik initialValues={employeeForm} onSubmit={handleSubmit} validate={validate}>
            {({ values, handleChange, errors, touched }) => (
                <Form>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                name="promotion_order_no"
                                label="Order promotion_order_no"
                                value={values.promotion_order_no}
                                onChange={handleChange}
                                error={touched.promotion_order_no && Boolean(errors.promotion_order_no)}
                                helperText={touched.promotion_order_no && errors.promotion_order_no}
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                type="date"
                                name="effective_from"
                                label="Effective From"
                                InputLabelProps={{ shrink: true }}
                                value={values.effective_from}
                                onChange={handleChange}
                                error={touched.effective_from && Boolean(errors.effective_from)}
                                helperText={touched.effective_from && errors.effective_from}
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                type="date"
                                name="effective_till"
                                label="Effective Till"
                                InputLabelProps={{ shrink: true }}
                                value={values.effective_till}
                                onChange={handleChange}
                                error={touched.effective_till && Boolean(errors.effective_till)}
                                helperText={touched.effective_till && errors.effective_till}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                name="order_reference"
                                label="Order Reference"
                                value={values.order_reference}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                name="remark"
                                label="Remark"
                                value={values.remark}
                                onChange={handleChange}
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
