import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, TextField, MenuItem, Button } from '@mui/material';
import { Formik, Form } from 'formik';
import { updateEmployeeField, nextUserStep } from '../../redux/slices/memberStoreSlice';
import { toast } from 'react-toastify';


const prefixes = ['Mr.', 'Ms.', 'Mrs.', 'Dr.'];

const PersonalInfoForm = ({ onNext }) => {
    const dispatch = useDispatch();
    const { user, employeeForm } = useSelector((state) => state.memeberStore);
    const { name, email } = user;

    const splitName = (fullName) => {
        const parts = fullName?.trim().split(" ");

        return {
            firstName: parts[0] || "",
            middleName: parts.length > 2 ? parts.slice(1, -1).join(" ") : "",
            lastName: parts.length > 1 ? parts[parts.length - 1] : ""
        };
    };

    const { firstName, middleName, lastName } = splitName(name);

    const initialValues = {
        ...employeeForm,
        email: user.email || '',
        first_name:firstName,
        middle_name:middleName,
        last_name:lastName,
    };

    const validate = (values) => {
        const errors = {};
        if (!values.employee_code) errors.employee_code = 'Required';
        if (!values.last_name) errors.last_name = 'Required';
        if (!values.prefix) errors.prefix = 'Required';
        if (!values.gender) errors.gender = 'Required';
        if (!values.date_of_birth) errors.date_of_birth = 'Required';
        if (!values.pancard) errors.pancard = 'Required';
        return errors;
    };

    const handleSubmit = async (values) => {
        try {
            Object.entries(values).forEach(([key, value]) => {
                dispatch(updateEmployeeField({ name: key, value }))
            });
            toast.success('Employee info saved');
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
        dispatch(nextUserStep());
    };

    return (
        <Formik initialValues={initialValues} validate={validate} onSubmit={handleSubmit}>
            {({ handleChange, values, errors, touched }) => (
                <Form>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                name="employee_code"
                                label="Employee Code"
                                value={employeeForm.employee_code || values.employee_code}
                                onChange={handleChange}
                                error={touched.employee_code && Boolean(errors.employee_code)}
                                helperText={touched.employee_code && errors.employee_code}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                select
                                name="prefix"
                                label="Prefix"
                                value={employeeForm.prefix || values.prefix}
                                onChange={handleChange}
                                error={touched.prefix && Boolean(errors.prefix)}
                                helperText={touched.prefix && errors.prefix}
                            >
                                <MenuItem value="">Select Prefix</MenuItem>
                                {prefixes.map((prefix) => (
                                    <MenuItem key={prefix} value={prefix}>{prefix}</MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                name="first_name"
                                label="First Name"
                                value={firstName || employeeForm.prefix || values.first_name}
                                onChange={handleChange}
                                error={touched.first_name && Boolean(errors.first_name)}
                                helperText={touched.first_name && errors.first_name}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                name="middle_name"
                                label="Middle Name"
                                value={middleName || employeeForm.middle_name || values.middle_name}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                name="last_name"
                                label="Last Name"
                                value={lastName || employeeForm.last_name || values.last_name}
                                onChange={handleChange}
                                error={touched.last_name && Boolean(errors.last_name)}
                                helperText={touched.last_name && errors.last_name}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                select
                                name="gender"
                                label="Gender"
                                value={employeeForm.gender || values.gender}
                                onChange={handleChange}
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
                                label="Date of Birth"
                                InputLabelProps={{ shrink: true }}
                                value={employeeForm.date_of_birth || values.date_of_birth}
                                onChange={handleChange}
                                error={touched.date_of_birth && Boolean(errors.date_of_birth)}
                                helperText={touched.date_of_birth && errors.date_of_birth}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                name="email"
                                label="Email Address"
                                value={email || employeeForm.email || values.email}
                                onChange={handleChange}
                                error={touched.email && Boolean(errors.email)}
                                helperText={touched.email && errors.email}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                name="pancard"
                                label="PAN Card Number"
                                value={employeeForm.pancard || values.pancard}
                                onChange={handleChange}
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
