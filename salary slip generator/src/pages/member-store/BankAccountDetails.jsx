import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, TextField, Button, MenuItem } from '@mui/material';
import { Formik, Form } from 'formik';
import { toast } from 'react-toastify';
import { updateEmployeeField, nextUserStep } from '../../redux/slices/memberStoreSlice';

const BankAccountDetails = ({ onNext }) => {
  const dispatch = useDispatch();
  const { employeeForm } = useSelector((state) => state.memeberStore);
  const yesNoOptions = [
    { label: 'Yes', value: 1 },
    { label: 'No', value: 0 }
  ];

  const validate = (values) => {
    const errors = {};
    if (!values.bank_name) errors.bank_name = 'Required';
    if (!values.branch_name) errors.branch_name = 'Required';
    if (!values.account_number) errors.account_number = 'Required';
    if (!values.ifsc_code) {
      errors.ifsc_code = 'Required';
    } else if (!/^[A-Za-z]{4}[0-9]{1}[A-Za-z0-9]{6}$/.test(values.ifsc_code)) {
      errors.ifsc_code = 'Invalid IFSC code, format IS 4 letters + 1 digit + 6 chars';
    }
    // if (values.is_active == 'Select status') errors.is_active = 'Required';
    return errors;
  };

  const handleSubmit = () => {
    try {
      onNext();
    } catch (err) {
      toast.error('Failed to save bank account details');
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
            <Grid item xs={6}>
              <TextField
                fullWidth
                name="bank_name"
                label="Bank Name*"
                value={values.bank_name}
                onChange={(e) => handleChange(e)}
                error={touched.bank_name && Boolean(errors.bank_name)}
                helperText={touched.bank_name && errors.bank_name}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                name="branch_name"
                label="Branch Name*"
                value={values.branch_name}
                onChange={(e) => handleChange(e)}
                error={touched.branch_name && Boolean(errors.branch_name)}
                helperText={touched.branch_name && errors.branch_name}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                name="account_number"
                label="Account Number*"
                value={values.account_number}
                onChange={(e) => handleChange(e)}
                error={touched.account_number && Boolean(errors.account_number)}
                helperText={touched.account_number && errors.account_number}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                name="ifsc_code"
                label="IFSC Code*"
                value={values.ifsc_code}
                onChange={(e) => handleChange(e)}
                error={touched.ifsc_code && Boolean(errors.ifsc_code)}
                helperText={touched.ifsc_code && errors.ifsc_code}
              />
            </Grid>

            {/* <Grid item xs={6}>
              <TextField
                select
                name="is_active"
                label="Is Active*"
                value={values.is_active}
                onChange={(e) => handleChange(e)}
                error={touched.is_active && Boolean(errors.is_active)}
                helperText={touched.is_active && errors.is_active}

              >
                <MenuItem value="Select status">Select status</MenuItem>
                {yesNoOptions.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                ))}
              </TextField>
            </Grid> */}
            
          </Grid>

          <Grid container justifyContent="flex-end" sx={{ mt: 3 }}>
            <Button type="submit" variant="contained">Next</Button>
          </Grid>
        </Form>
      )}
    </Formik>
  );
};

export default BankAccountDetails;
