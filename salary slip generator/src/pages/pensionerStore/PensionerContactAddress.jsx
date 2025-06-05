import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, TextField, Button } from '@mui/material';
import { Formik, Form } from 'formik';
import { updatePensionerField } from '../../redux/slices/pensionerStoreSlice';

const PensionerContactAddress = ({ onNext }) => {
  const dispatch = useDispatch();
  const { pensionerForm } = useSelector((state) => state.pensionerStore);

  const handleChange = (e) => {
    dispatch(updatePensionerField({ name: e.target.name, value: e.target.value }));
  };

  return (
    <Formik initialValues={pensionerForm} onSubmit={onNext}>
      {({ values }) => (
        <Form>
          <Grid container spacing={2}>
            <Grid item xs={12}><TextField fullWidth name="address" label="Address" value={values.address} onChange={handleChange} /></Grid>
            <Grid item xs={4}><TextField fullWidth name="city" label="City" value={values.city} onChange={handleChange} /></Grid>
            <Grid item xs={4}><TextField fullWidth name="state" label="State" value={values.state} onChange={handleChange} /></Grid>
            <Grid item xs={4}><TextField fullWidth name="pin_code" label="Pin Code" value={values.pin_code} onChange={handleChange} /></Grid>
            <Grid item xs={6}><TextField fullWidth name="mobile" label="Mobile Number" value={values.mobile} onChange={handleChange} /></Grid>
            <Grid item xs={6}><TextField fullWidth name="email" label="Email ID" value={values.email} onChange={handleChange} /></Grid>
          </Grid>

          <Grid container justifyContent="flex-end" sx={{ mt: 3 }}>
            <Button type="submit" variant="contained">Submit</Button>
          </Grid>
        </Form>
      )}
    </Formik>
  );
};

export default PensionerContactAddress;
