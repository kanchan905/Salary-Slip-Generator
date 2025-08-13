import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, TextField, MenuItem, Button } from '@mui/material';
import { Formik, Form } from 'formik';
import { updateEmployeeField } from '../../redux/slices/memberStoreSlice';
import { toast } from 'react-toastify';


const prefixes = ['Mr.', 'Ms.', 'Mrs.', 'Dr.'];

const PersonalInfoForm = ({ onNext }) => {
    const dispatch = useDispatch();
    const { employeeForm } = useSelector((state) => state.memeberStore);

    const validate = (values) => {
        if (employeeForm.status ==='Retired') {
            return {};
        }
        const errors = {};
        if (!values.employee_code) {
            errors.employee_code = 'Required';
        } else if (values.employee_code.length < 4) {
            errors.employee_code = 'The employee code field must be at least 4 characters.';
        }
        if (!values.prefix ) errors.prefix = 'Required';
        if (!values.gender) errors.gender = 'Required';
        if (!values.date_of_birth) errors.date_of_birth = 'Required';
        if (!values.pancard) {
            errors.pancard = 'Required';
        } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(values.pancard)) {
            errors.pancard = 'Invalid PAN, format is 5 letters + 4 digits + 1 letter';
        }
        return errors;
    };

    const handleSubmit = () => {
        try {
            onNext();
        }
        catch (err) {
            const apiMsg =
                err?.response?.data?.message ||
                err?.message ||
                err?.message ||
                'Failed to save info.';
            toast.error(apiMsg);
        }
    };

    const handleChange = (e) => {
        dispatch(updateEmployeeField({ name: e.target.name, value: e.target.value }));
    }

    return (
        <Formik initialValues={employeeForm} enableReinitialize validate={validate} onSubmit={handleSubmit}>
            {({ values, errors, touched }) => (
                <Form>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                name="employee_code"
                                label="Employee Code*"
                                value={values.employee_code}
                                onChange={(e) => handleChange(e)}
                                error={touched.employee_code && Boolean(errors.employee_code)}
                                helperText={touched.employee_code && errors.employee_code}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                select
                                name="prefix"
                                label="Prefix*"
                                value={values.prefix}
                                onChange={(e) => handleChange(e)}
                                error={touched.prefix && Boolean(errors.prefix)}
                                helperText={touched.prefix && errors.prefix}                 
                            >
                                <MenuItem value="Select Prefix">Select Prefix</MenuItem>
                                {prefixes.map((prefix) => (
                                    <MenuItem key={prefix} value={prefix}>{prefix}</MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                name="first_name"
                                label="First Name*"
                                value={values.first_name}
                                onChange={(e) => handleChange(e)}
                                error={touched.first_name && Boolean(errors.first_name)}
                                helperText={touched.first_name && errors.first_name}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                name="middle_name"
                                label="Middle Name"
                                value={values.middle_name}
                                onChange={(e) => handleChange(e)}
                                error={touched.middle_name && Boolean(errors.middle_name)}
                                helperText={touched.middle_name && errors.middle_name}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                name="last_name"
                                label="Last Name"
                                value={values.last_name}
                                onChange={(e) => handleChange(e)}
                                error={touched.last_name && Boolean(errors.last_name)}
                                helperText={touched.last_name && errors.last_name}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                select
                                name="gender"
                                label="Gender*"
                                value={values.gender}
                                onChange={(e) => handleChange(e)}
                                error={touched.gender && Boolean(errors.gender)}
                                helperText={touched.gender && errors.gender}
                            >
                                <MenuItem value="">Select Gender</MenuItem>
                                <MenuItem value="male">Male</MenuItem>
                                <MenuItem value="female">Female</MenuItem>
                                <MenuItem value="other">Other</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                type="date"
                                name="date_of_birth"
                                label="Date of Birth*"
                                InputLabelProps={{ shrink: true }}
                                value={values.date_of_birth}
                                onChange={(e) => handleChange(e)}
                                error={touched.date_of_birth && Boolean(errors.date_of_birth)}
                                helperText={touched.date_of_birth && errors.date_of_birth}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                name="email"
                                label="Email Address*"
                                value={values.email}
                                onChange={(e) => handleChange(e)}
                                error={touched.email && Boolean(errors.email)}
                                helperText={touched.email && errors.email}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                name="pancard"
                                label="PAN Card Number*"
                                value={values.pancard}
                                onChange={(e) => handleChange(e)}
                                error={touched.pancard && Boolean(errors.pancard)}
                                helperText={touched.pancard && errors.pancard}
                            />
                        </Grid>
                    </Grid>

                    <Grid container justifyContent="flex-end" sx={{ mt: 3 }}>
                        <Button type="submit" variant="contained">Next</Button>
                    </Grid>
                </Form>
            )}
        </Formik>
    );
};

export default PersonalInfoForm;
