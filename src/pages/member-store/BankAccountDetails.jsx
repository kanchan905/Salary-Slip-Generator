import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { Grid, TextField, Button, MenuItem } from '@mui/material';
import { Formik, Form } from 'formik';
import { toast } from 'react-toastify';

const BankAccountDetails = forwardRef(({ values, onNext }, ref) => {
  const formikRef = useRef();

  useImperativeHandle(ref, () => ({
    saveCurrentValues: () => {
      return formikRef.current?.values || values;
    }
  }));

  const yesNoOptions = [
    { label: 'Yes', value: 1 },
    { label: 'No', value: 0 }
  ];

  const validate = (values) => {
    if (values.status ==='Retired') {
      return {};
    }
    const errors = {};
    if (!values.bank_name) errors.bank_name = 'Required';
    if (!values.branch_name) errors.branch_name = 'Required';
    if (!values.account_number) errors.account_number = 'Required';
    if (!values.ifsc_code) {
      errors.ifsc_code = 'Required';
    } else if (!/^[A-Za-z]{4}[0-9]{1}[A-Za-z0-9]{6}$/.test(values.ifsc_code)) {
      errors.ifsc_code = 'Invalid IFSC code, format IS 4 letters + 0(Zero) + 6 chars';
    }
    return errors;
  };

  const handleSubmit = (stepValues) => {
    try {
      onNext(stepValues);
    } catch (err) {
      toast.error('Failed to save bank account details');
    }
  };

  return (
    <Formik innerRef={formikRef} initialValues={values} enableReinitialize validate={validate} onSubmit={handleSubmit}>
      {({ values, errors, touched, handleChange }) => (
        <Form>
          <Grid container spacing={2}>
            <Grid item xs={6}>
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
            <Grid item xs={6}>
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
            <Grid item xs={6}>
              <TextField
                fullWidth
                name="account_number"
                label="Account Number*"
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
                label="IFSC Code*"
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
});

export default BankAccountDetails;
