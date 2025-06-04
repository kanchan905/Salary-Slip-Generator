import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, TextField, Button } from '@mui/material';
import { Formik, Form } from 'formik';
import { toast } from 'react-toastify';
import { updateEmployeeField, nextUserStep } from '../../redux/slices/memberStoreSlice';

const BankAccountDetails = ({ onNext }) => {
  const dispatch = useDispatch();
  const { employeeForm } = useSelector((state) => state.memeberStore);


  const validate = (values) => {
    const errors = {};
    if (!values.bank_name) errors.bank_name = 'Required';
    if (!values.branch_name) errors.branch_name = 'Required';
    if (!values.account_number) errors.account_number = 'Required';
    if (!values.ifsc_code) errors.ifsc_code = 'Required';
    return errors;
  };

  const handleSubmit = async (values) => {
    try {
      Object.entries(values).forEach(([key, value]) => {
        dispatch(updateEmployeeField({ name: key, value }));
      });
      toast.success('Bank account details saved');
      onNext();
      dispatch(nextUserStep());
    } catch (err) {
      toast.error('Failed to save bank account details');
    }
  };

  return (
    <Formik initialValues={employeeForm} onSubmit={handleSubmit} validate={validate}>
      {({ values, handleChange, errors, touched }) => (
        <Form>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                name="bank_name"
                label="Bank Name"
                value={values.bank_name}
                onChange={handleChange}
                error={touched.bank_name && Boolean(errors.bank_name)}
                helperText={touched.bank_name && errors.bank_name}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                name="branch_name"
                label="Branch Name"
                value={values.branch_name}
                onChange={handleChange}
                error={touched.branch_name && Boolean(errors.branch_name)}
                helperText={touched.branch_name && errors.branch_name}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                name="account_number"
                label="Account Number"
                value={values.account_number}
                onChange={handleChange}
                error={touched.account_number && Boolean(errors.account_number)}
                helperText={touched.account_number && errors.account_number}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                name="ifsc_code"
                label="IFSC Code"
                value={values.ifsc_code}
                onChange={handleChange}
                error={touched.ifsc_code && Boolean(errors.ifsc_code)}
                helperText={touched.ifsc_code && errors.ifsc_code}
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

export default BankAccountDetails;
