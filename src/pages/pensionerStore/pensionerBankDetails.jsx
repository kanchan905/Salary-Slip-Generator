import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, TextField, Button, MenuItem } from '@mui/material';
import { Formik, Form } from 'formik';
import { updatePensionerBankField } from '../../redux/slices/pensionerStoreSlice';
import { toast } from 'react-toastify';


const statuses = [
    { value: '1', label: 'Active' },
    { value: '0', label: 'Inactive' }
];

const PensionerBankDetails = ({ onNext }) => {
    const dispatch = useDispatch();
    const { pensionerBankForm } = useSelector((state) => state.pensionerStore);


    const validate = (values) => {
        const errors = {};
        if (!values.bank_name) errors.bank_name = "required";
        if (!values.branch_name) errors.branch_name = "required";
        if (!values.account_no) errors.account_no = "required";
        if (!values.ifsc_code) errors.ifsc_code = "required";
        if (values.is_active == 'Select Status') errors.is_active = 'Required';
        return errors;
    };

    const handleSubmit = (values) => {
        try {
          dispatch(updatePensionerBankField(values));
          onNext();
        } catch (err) {
          const apiMsg =
            err?.response?.data?.message ||
            err?.message ||
            'Failed to save info.';
          toast.error(apiMsg);
        }
      };

    return (
        <Formik
            initialValues={pensionerBankForm}
            validate={validate}
            onSubmit={handleSubmit}
        >
            {({ values, errors, touched, handleChange }) => (
                <Form>
                    <Grid container spacing={2}>
                        <Grid item size={{ xs: 6, md: 4 }}>
                            <TextField
                                fullWidth
                                name="bank_name"
                                label="Bank Name*"
                                value={values.bank_name}
                                onChange={handleChange}
                                error={touched.bank_name && Boolean(errors.bank_name)}
                                helperText={touched.bank_name && errors.bank_name}
                            />
                        </Grid>
                        <Grid item size={{ xs: 6, md: 4 }}>
                            <TextField
                                fullWidth
                                name="branch_name"
                                label="Branch Name*"
                                value={values.branch_name}
                                onChange={handleChange}
                                error={touched.branch_name && Boolean(errors.branch_name)}
                                helperText={touched.branch_name && errors.branch_name}
                            />
                        </Grid>
                        <Grid item size={{ xs: 6, md: 4 }}>
                            <TextField
                                fullWidth
                                name="account_no"
                                label="Account Number*"
                                value={values.account_no}
                                onChange={handleChange}
                                error={touched.account_no && Boolean(errors.account_no)}
                                helperText={touched.account_no && errors.account_no}
                            />
                        </Grid>
                        <Grid item size={{ xs: 6, md: 4 }}>
                            <TextField
                                fullWidth
                                name="ifsc_code"
                                label="IFSC Code*"
                                value={values.ifsc_code}
                                onChange={handleChange}
                                error={touched.ifsc_code && Boolean(errors.ifsc_code)}
                                helperText={touched.ifsc_code && errors.ifsc_code}
                            />
                        </Grid>
                        <Grid item size={{ xs: 6, md: 4 }}>
                            <TextField
                                select
                                fullWidth
                                name="is_active"
                                label="Status*"
                                value={values.is_active}
                                onChange={handleChange}
                                error={touched.is_active && Boolean(errors.is_active)}
                                helperText={touched.is_active && errors.is_active}
                            >
                                <MenuItem value="Select Status">Select Status</MenuItem>
                                {statuses.map((opt) => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
                            </TextField>
                        </Grid>
                    </Grid>
                    <Grid container justifyContent="flex-end" sx={{ mt: 3 }}>
                        <Button type="submit" variant="contained">Next</Button>
                    </Grid>
                </Form>
            )}
        </Formik>
    );

}


export default PensionerBankDetails;