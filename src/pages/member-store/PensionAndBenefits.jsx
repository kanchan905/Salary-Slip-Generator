import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { Grid, TextField, MenuItem, Button} from '@mui/material';
import { Formik, Form } from 'formik';
import { toast } from 'react-toastify';

const pensionSchemes = ['GPF', 'NPS'];
const yesNoOptions = [
    { label: 'No', value: 0 },
    { label: 'Yes', value: 1 }
];

const PensionAndBenefits = forwardRef(({ values, onNext }, ref) => {
    const formikRef = useRef();

    useImperativeHandle(ref, () => ({
        saveCurrentValues: () => {
            return formikRef.current?.values || values;
        }
    }));

    const validate = (values) => {
        if (values.status ==='Retired') {
            return {};
        }
        const errors = {};
        if (!values.pension_scheme) errors.pension_scheme = 'Required';
        if (!values.pension_number) errors.pension_number = 'Required';
        if (values.hra_eligibility === '' || values.hra_eligibility == null) errors.hra_eligibility = 'Required';
        if (values.npa_eligibility === '' || values.npa_eligibility == null) errors.npa_eligibility = 'Required';
        if (values.gis_eligibility === '' || values.gis_eligibility == null) errors.gis_eligibility = 'Required';
        if (values.uniform_allowance_eligibility === '' || values.uniform_allowance_eligibility == null) errors.uniform_allowance_eligibility = 'Required';
        if (values.credit_society_member === '' || values.credit_society_member == null) errors.credit_society_member = 'Required';
        if (values.pwd_status === '' || values.pwd_status == null) errors.pwd_status = 'Required';
        return errors;
    };

    const handleSubmit = (stepValues) => {
        try {
            onNext(stepValues);
        } catch (err) {
            toast.error('Failed to save pension & benefits');
        }
    };

    return (
        <Formik innerRef={formikRef} initialValues={values} enableReinitialize validate={validate} onSubmit={handleSubmit}>
            {({ values, errors, touched, handleChange }) => (
                <Form>
                    <Grid container spacing={2}>
                        <Grid item size={{ xs: 6, md: 3 }}>
                            <TextField
                                select
                                fullWidth
                                name="pension_scheme"
                                label="Pension Scheme*"
                                value={values.pension_scheme}
                                onChange={handleChange}
                                error={touched.pension_scheme && Boolean(errors.pension_scheme)}
                                helperText={touched.pension_scheme && errors.pension_scheme}
                            >
                                <MenuItem value="">Select Scheme</MenuItem>
                                {pensionSchemes.map((scheme) => (
                                    <MenuItem key={scheme} value={scheme}>{scheme}</MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        <Grid item size={{ xs: 6, md: 3 }}>
                            <TextField
                                fullWidth
                                name="pension_number"
                                label="Pension Number*"
                                value={values.pension_number}
                                onChange={handleChange}
                                error={touched.pension_number && Boolean(errors.pension_number)}
                                helperText={touched.pension_number && errors.pension_number}
                            />
                        </Grid>

                        <Grid item size={{ xs: 6, md: 3 }}>
                            <TextField
                                select
                                fullWidth
                                name="hra_eligibility"
                                label="HRA Eligibility*"
                                value={values.hra_eligibility}
                                onChange={handleChange}
                                error={touched.hra_eligibility && Boolean(errors.hra_eligibility)}
                                helperText={touched.hra_eligibility && errors.hra_eligibility}

                            >
                                {/* <MenuItem value="">Select HRA</MenuItem> */}
                                {yesNoOptions.map((opt) => (
                                    <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        <Grid item size={{ xs: 6, md: 3 }}>
                            <TextField
                                select
                                fullWidth
                                name="npa_eligibility"
                                label="NPA Eligibility*"
                                value={values.npa_eligibility}
                                onChange={handleChange}
                                error={touched.npa_eligibility && Boolean(errors.npa_eligibility)}
                                helperText={touched.npa_eligibility && errors.npa_eligibility}

                            >
                                {/* <MenuItem value="">Select NPA</MenuItem> */}
                                {yesNoOptions.map((opt) => (
                                    <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        <Grid item size={{ xs: 6, md: 3 }}>
                            <TextField
                                select
                                fullWidth
                                name="gis_eligibility"
                                label="GIS Eligibility*"
                                value={values.gis_eligibility}
                                onChange={handleChange}
                                error={touched.gis_eligibility && Boolean(errors.gis_eligibility)}
                                helperText={touched.gis_eligibility && errors.gis_eligibility}

                            >
                                {/* <MenuItem value="">Select GIS</MenuItem> */}
                                {yesNoOptions.map((opt) => (
                                    <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        <Grid item size={{ xs: 6, md: 3 }}>
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

                        <Grid item size={{ xs: 6, md: 3 }}>
                            <TextField
                                select
                                fullWidth
                                name="uniform_allowance_eligibility"
                                label="Uniform Allowance Eligibility*"
                                value={values.uniform_allowance_eligibility}
                                onChange={handleChange}
                                error={touched.uniform_allowance_eligibility && Boolean(errors.uniform_allowance_eligibility)}
                                helperText={touched.uniform_allowance_eligibility && errors.uniform_allowance_eligibility}

                            >
                                {/* <MenuItem value="">Select uniform</MenuItem> */}
                                {yesNoOptions.map((opt) => (
                                    <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        <Grid item size={{ xs: 6, md: 3 }}>
                            <TextField
                                select
                                fullWidth
                                name="credit_society_member"
                                label="Credit Society Member*"
                                value={values.credit_society_member}
                                onChange={handleChange}
                                error={touched.credit_society_member && Boolean(errors.credit_society_member)}
                                helperText={touched.credit_society_member && errors.credit_society_member}

                            >
                                {/* <MenuItem value="">Select credit</MenuItem> */}
                                {yesNoOptions.map((opt) => (
                                    <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        <Grid item size={{ xs: 6, md: 3 }}>
                            <TextField
                                select
                                fullWidth
                                name="pwd_status"
                                label="PWD Status*"
                                value={values.pwd_status}
                                onChange={handleChange}
                                error={touched.pwd_status && Boolean(errors.pwd_status)}
                                helperText={touched.pwd_status && errors.pwd_status}

                            >
                                {/* <MenuItem value="">Select PWD</MenuItem> */}
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
});

export default PensionAndBenefits;
