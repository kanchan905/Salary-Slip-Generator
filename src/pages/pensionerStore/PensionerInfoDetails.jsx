import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, TextField, Button, MenuItem } from '@mui/material';
import { Formik, Form } from 'formik';
// IMPORTANT: Make sure this is the correct path to your slice
import { updatePensionerInfoField, resetPensionerForm } from '../../redux/slices/pensionerStoreSlice'; 
import { toast } from 'react-toastify';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { createPensioner } from '../../redux/slices/pensionerSlice';

const statuses = [
    { value: '1', label: 'Active' },
    { value: '0', label: 'Inactive' }
];

const PensionerInfoDetails = ({ onNext }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const dispatch = useDispatch();
    // Your useSelector is correct
    const { pensionerInfoForm, pensionerForm, pensionerBankForm } = useSelector((state) => state.pensionerStore);

    const validate = (values) => {
        const errors = {};
        if (!values.basic_pension) errors.basic_pension = "Required";
        if (values.is_active === 'Select Status') errors.is_active = 'Required'; // Use strict equality
        if (!values.effective_from) errors.effective_from = "Required";
        return errors;
    };

    const handleSubmit = async (values) => {
        setIsSubmitting(true);
        // The final update before submitting is still a good practice, though technically redundant if onChange is working
        dispatch(updatePensionerInfoField(values));
        try {
            // Re-fetch the latest state directly from the store to ensure you have the most up-to-date combined data
            const finalPayload = { ...pensionerForm, ...pensionerBankForm, ...values }; // Use 'values' from formik as it's the most current
            
            await dispatch(createPensioner(finalPayload)).unwrap();

            toast.success('Pensioner Added Successfully');
            dispatch(resetPensionerForm());
            // You might want to navigate away or clear the form here
            // onNext(); // e.g.
        } catch (err) {
            console.error("Submission error:", err);
            toast.error(err.message || "An unexpected error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Formik
            initialValues={pensionerInfoForm}
            validate={validate}
            onSubmit={handleSubmit}
            // This enables the form to re-initialize if the Redux state changes from an external source
            enableReinitialize 
        >
            {({ values, errors, touched, handleChange, setFieldValue }) => {
                
                // *** CHANGE 1: Create a custom handler for standard inputs ***
                const handleFormChange = (e) => {
                    const { name, value } = e.target;
                    // First, let Formik do its thing
                    handleChange(e);
                    // Second, dispatch the change to Redux
                    dispatch(updatePensionerInfoField({ name, value }));
                };

                // *** CHANGE 2: Create a custom handler for the DatePicker ***
                const handleDateChange = (fieldName, date) => {
                    const formatted = date ? dayjs(date).format('YYYY-MM-DD') : '';
                    // First, let Formik do its thing
                    setFieldValue(fieldName, formatted);
                    // Second, dispatch the change to Redux
                    dispatch(updatePensionerInfoField({ name: fieldName, value: formatted }));
                };

                return (
                    <Form>
                        <Grid container spacing={2}>
                            <Grid item size={{ xs: 6, md: 4 }}>
                                <TextField
                                    fullWidth
                                    name="basic_pension"
                                    label="Basic Pension*"
                                    value={values.basic_pension}
                                    // *** CHANGE 3: Use the custom handler ***
                                    onChange={handleFormChange}
                                    error={touched.basic_pension && Boolean(errors.basic_pension)}
                                    helperText={touched.basic_pension && errors.basic_pension}
                                />
                            </Grid>
                            <Grid item size={{ xs: 6, md: 4 }}>
                                <TextField
                                    fullWidth
                                    name="commutation_amount"
                                    label="Commutation Amount"
                                    value={values.commutation_amount}
                                    onChange={handleFormChange}
                                    error={touched.commutation_amount && Boolean(errors.commutation_amount)}
                                    helperText={touched.commutation_amount && errors.commutation_amount}
                                />
                            </Grid>
                            {/* Apply handleFormChange to all other TextFields */}
                            <Grid item size={{ xs: 6, md: 4 }}>
                                <TextField
                                    fullWidth
                                    name="additional_pension"
                                    label="Additional Pension"
                                    value={values.additional_pension}
                                    onChange={handleFormChange}
                                />
                            </Grid>
                            <Grid item size={{ xs: 6, md: 4 }}>
                                <TextField
                                    fullWidth
                                    name="medical_allowance"
                                    label="Medical Allowance"
                                    value={values.medical_allowance}
                                    onChange={handleFormChange}
                                />
                            </Grid>
                            <Grid item size={{ xs: 6, md: 4 }}>
                                <TextField
                                    select
                                    fullWidth
                                    name="is_active"
                                    label="Status*"
                                    value={values.is_active}
                                    onChange={handleFormChange}
                                    error={touched.is_active && Boolean(errors.is_active)}
                                    helperText={touched.is_active && errors.is_active}
                                >
                                    <MenuItem value="Select Status">Select Status</MenuItem>
                                    {statuses.map((opt) => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
                                </TextField>
                            </Grid>
                            <Grid item size={{ xs: 6, md: 4 }}>
                                <TextField
                                    fullWidth
                                    name="arrear_type"
                                    label="Arrear Type"
                                    value={values.arrear_type}
                                    onChange={handleFormChange}
                                />
                            </Grid>
                            <Grid item size={{ xs: 6, md: 4 }}>
                                <TextField
                                    fullWidth
                                    name="total_arrear"
                                    label="Total Arrear"
                                    value={values.total_arrear}
                                    onChange={handleFormChange}
                                />
                            </Grid>
                            <Grid item size={{ xs: 6, md: 4 }}>
                                <TextField
                                    fullWidth
                                    name="arrear_remarks"
                                    label="Arrear Remarks"
                                    value={values.arrear_remarks}
                                    onChange={handleFormChange}
                                />
                            </Grid>
                            <Grid item size={{ xs: 6, md: 4 }}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        label="Effective From*"
                                        format="DD-MM-YYYY"
                                        value={values.effective_from ? dayjs(values.effective_from) : null}
                                        // *** CHANGE 4: Use the custom date handler ***
                                        onChange={(date) => handleDateChange('effective_from', date)}
                                        slotProps={{
                                            textField: {
                                                fullWidth: true,
                                                name: 'effective_from',
                                                error: touched.effective_from && Boolean(errors.effective_from),
                                                helperText: touched.effective_from && errors.effective_from,
                                            },
                                        }}
                                    />
                                </LocalizationProvider>
                            </Grid>
                            <Grid item size={{ xs: 6, md: 4 }}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        label="Effective Till(Optional)"
                                        format="DD-MM-YYYY"
                                        value={values.effective_till ? dayjs(values.effective_till) : null}
                                        onChange={(date) => handleDateChange('effective_till', date)}
                                        slotProps={{
                                            textField: {
                                                fullWidth: true,
                                                name: 'effective_till',
                                            },
                                        }}
                                    />
                                </LocalizationProvider>
                            </Grid>
                        </Grid>
                        <Grid container justifyContent="flex-end" sx={{ mt: 3 }}>
                            <Button type="submit" variant="contained" disabled={isSubmitting}>
                                {isSubmitting ? 'Submitting...' : 'Submit'}
                            </Button>
                        </Grid>
                    </Form>
                )
            }}
        </Formik>
    );
}

export default PensionerInfoDetails;