import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, TextField, MenuItem, Button, FormControlLabel, Switch } from '@mui/material';
import { Formik, Form } from 'formik';
import { toast } from 'react-toastify';
import { updateEmployeeField, nextUserStep } from '../../redux/slices/memberStoreSlice';

const pensionSchemes = ['GPF', 'NPS'];
const yesNoOptions = [
    { label: 'Yes', value: 1 },
    { label: 'No', value: 0 }
];

const PensionAndBenefits = ({ onNext }) => {
    const dispatch = useDispatch();
    const { employeeForm } = useSelector((state) => state.memeberStore);


    const validate = (values) => {
        const errors = {};
        if (values.pension_scheme == 'Select Scheme') errors.pension_scheme = 'Required';
        if (!values.pension_number) errors.pension_number = 'Required';        
        if (values.hra_eligibility == 'Select hra') errors.hra_eligibility = 'Required';
        if (values.npa_eligibility == 'Select npa') errors.npa_eligibility = 'Required';
        if (values.gis_eligibility == 'Select gis') errors.gis_eligibility = 'Required';
        if (values.uniform_allowance_eligibility == 'Select uniform') errors.uniform_allowance_eligibility = 'Required';
        if (values.credit_society_member == 'Select credit') errors.credit_society_member = 'Required';
        return errors;
    };

    const handleSubmit = async (values) => {
        try {
            Object.entries(values).forEach(([key, value]) => {
                dispatch(updateEmployeeField({ name: key, value }));
            });
            toast.success('Pension & Benefits details saved');
            onNext();
            dispatch(nextUserStep());
        } catch (err) {
            toast.error('Failed to save pension & benefits');
        }
    };

    return (
        <Formik initialValues={employeeForm} onSubmit={handleSubmit} validate={validate}>
            {({ values, handleChange, setFieldValue, errors, touched }) => (
                <Form>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <TextField
                                select
                                fullWidth
                                name="pension_scheme"
                                label="Pension Scheme"
                                value={values.pension_scheme}
                                onChange={handleChange}
                                error={touched.pension_scheme && Boolean(errors.pension_scheme)}
                                helperText={touched.pension_scheme && errors.pension_scheme}
                            >
                                <MenuItem value="Select Scheme">Select Scheme</MenuItem>
                                {pensionSchemes.map((scheme) => (
                                    <MenuItem key={scheme} value={scheme}>{scheme}</MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                name="pension_number"
                                label="Pension Number"
                                value={values.pension_number}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <TextField
                                select
                                fullWidth
                                name= "hra_eligibility"
                                label= "hra_eligibility"
                                value={values.hra_eligibility}
                                onChange={handleChange}
                                error={touched.hra_eligibility && Boolean(errors.hra_eligibility)}
                                helperText={touched.hra_eligibility && errors.hra_eligibility}

                            >
                                <MenuItem value="Select hra">Select hra</MenuItem>
                                {yesNoOptions.map((opt) => (
                                    <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        <Grid item xs={6}>
                             <TextField
                                select
                                fullWidth
                                name= "npa_eligibility"
                                label= "npa_eligibility"
                                value={values.npa_eligibility}
                                onChange={handleChange}
                                error={touched.npa_eligibility && Boolean(errors.npa_eligibility)}
                                helperText={touched.npa_eligibility && errors.npa_eligibility}

                            >
                                <MenuItem value="Select npa">Select npa</MenuItem>
                                {yesNoOptions.map((opt) => (
                                    <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        <Grid item xs={6}>
                            <TextField
                                select
                                fullWidth
                                name= "gis_eligibility"
                                label= "gis_eligibility"
                                value={values.gis_eligibility}
                                onChange={handleChange}
                                error={touched.gis_eligibility && Boolean(errors.gis_eligibility)}
                                helperText={touched.gis_eligibility && errors.gis_eligibility}

                            >
                                <MenuItem value="Select gis">Select gis</MenuItem>
                                {yesNoOptions.map((opt) => (
                                    <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                name="gis_no"
                                label="GIS Number"
                                value={values.gis_no}
                                onChange={handleChange}
                                error={touched.gis_no && Boolean(errors.gis_no)}
                                helperText={touched.gis_no && errors.gis_no}
                                disabled={!values.gis_eligibility}
                            />
                        </Grid>

                        <Grid item xs={6}>
                           <TextField
                                select
                                fullWidth
                                name= "uniform_allowance_eligibility"
                                label= "uniform_allowance_eligibility"
                                value={values.uniform_allowance_eligibility}
                                onChange={handleChange}
                                error={touched.uniform_allowance_eligibility && Boolean(errors.uniform_allowance_eligibility)}
                                helperText={touched.uniform_allowance_eligibility && errors.uniform_allowance_eligibility}

                            >
                                <MenuItem value="Select uniform">Select uniform</MenuItem>
                                {yesNoOptions.map((opt) => (
                                    <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        <Grid item xs={6}>
                            <TextField
                                select
                                fullWidth
                                name= "credit_society_member"
                                label= "credit_society_member"
                                value={values.credit_society_member}
                                onChange={handleChange}
                                error={touched.credit_society_member && Boolean(errors.credit_society_member)}
                                helperText={touched.credit_society_member && errors.credit_society_member}

                            >
                                <MenuItem value="Select credit">Select credit</MenuItem>
                                {yesNoOptions.map((opt) => (
                                    <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                    </Grid>

                    <Grid container justifyContent="flex-end" sx={{ mt: 3 }}>
                        <Button type="submit" variant="contained">
                            Next
                        </Button>
                    </Grid>
                </Form>
            )}
        </Formik>
    );
};

export default PensionAndBenefits;
