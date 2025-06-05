import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, TextField, Button, MenuItem } from '@mui/material';
import { Formik, Form } from 'formik';
import { updatePensionerField } from '../../redux/slices/pensionerStoreSlice';
import { toast } from 'react-toastify';
import { fetchPayCommisions } from '../../redux/slices/payCommision';

const commissions = ['4th', '5th', '6th', '7th'];

const PensionPayDetails = ({ onNext }) => {
  const dispatch = useDispatch();
  const { pensionerForm } = useSelector((state) => state.pensionerStore);
  const { payCommissions } = useSelector((state) => state.payCommision);

  console.log(payCommissions)

  useEffect(() => {
    dispatch(fetchPayCommisions())
  },[dispatch])

  const validate = (values) => {
    const errors = {};
    if (!values.pay_commission) errors.pay_commission = 'Required';
    if (!values.pay_level) errors.pay_level = 'Required';
    if (!values.pay_cell) errors.pay_cell = 'Required';
    if (!values.pay_commission_at_retirement) errors.pay_commission_at_retirement = 'Required';
    if (!values.basic_pay_at_retirement) errors.basic_pay_at_retirement = 'Required';
    if (!values.last_drawn_salary) errors.last_drawn_salary = 'Required';
    if (!values.NPA) errors.NPA = 'Required';
    if (!values.HRA) errors.HRA = 'Required';
    if (!values.special_pay) errors.special_pay = 'Required';
    return errors;
  };

  const handleSubmit = () => {
    try {
      toast.success('Pensioner Pay Detail Saved');
      onNext();
      console.log(pensionerForm)
    } catch (err) {
      const apiMsg =
        err?.response?.data?.message ||
        err?.message ||
        err?.message ||
        'Failed to save info.';
      toast.error(apiMsg);
    }
  };

  const handleChange = (e) => {
    dispatch(updatePensionerField({ name: e.target.name, value: e.target.value }));
  };

  return (
    <Formik
      initialValues={pensionerForm}
      enableReinitialize
      validate={validate}
      onSubmit={handleSubmit}
    >
      {({ values, errors, touched }) => (
        <Form>
          <Grid container spacing={2}>

            <Grid item xs={6}>
              <TextField
                select
                fullWidth
                name="pay_commission"
                label="Pay Commission"
                value={values.pay_commission}
                onChange={handleChange}
                error={touched.pay_commission && Boolean(errors.pay_commission)}
                helperText={touched.pay_commission && errors.pay_commission}
              >
                {commissions.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
              </TextField>
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                name="pay_level"
                label="Pay Matrix Level"
                value={values.pay_level}
                onChange={handleChange}
                error={touched.pay_level && Boolean(errors.pay_level)}
                helperText={touched.pay_level && errors.pay_level}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                name="pay_cell"
                label="Index / Cell in Pay Matrix"
                value={values.pay_cell}
                onChange={handleChange}
                error={touched.pay_cell && Boolean(errors.pay_cell)}
                helperText={touched.pay_cell && errors.pay_cell}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                name="pay_commission_at_retirement"
                label="Pay Commission at Retirement"
                value={values.pay_commission_at_retirement}
                onChange={handleChange}
                error={touched.pay_commission_at_retirement && Boolean(errors.pay_commission_at_retirement)}
                helperText={touched.pay_commission_at_retirement && errors.pay_commission_at_retirement}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                name="basic_pay_at_retirement"
                label="Basic Pay at Retirement"
                value={values.basic_pay_at_retirement}
                onChange={handleChange}
                error={touched.basic_pay_at_retirement && Boolean(errors.basic_pay_at_retirement)}
                helperText={touched.basic_pay_at_retirement && errors.basic_pay_at_retirement}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                name="last_drawn_salary"
                label="Last Drawn Salary (Gross)"
                value={values.last_drawn_salary}
                onChange={handleChange}
                error={touched.last_drawn_salary && Boolean(errors.last_drawn_salary)}
                helperText={touched.last_drawn_salary && errors.last_drawn_salary}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                name="NPA"
                label="NPA (if applicable)"
                value={values.NPA}
                onChange={handleChange}
                error={touched.NPA && Boolean(errors.NPA)}
                helperText={touched.NPA && errors.NPA}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                name="HRA"
                label="HRA at Time of Retirement"
                value={values.HRA}
                onChange={handleChange}
                error={touched.HRA && Boolean(errors.HRA)}
                helperText={touched.HRA && errors.HRA}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                name="special_pay"
                label="Special Pay / Allowance"
                value={values.special_pay}
                onChange={handleChange}
                error={touched.special_pay && Boolean(errors.special_pay)}
                helperText={touched.special_pay && errors.special_pay}
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

export default PensionPayDetails;
