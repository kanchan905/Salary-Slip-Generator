import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, TextField, Button } from '@mui/material';
import { Formik, Form } from 'formik';
import { resetPensionerForm, updatePensionerField } from '../../redux/slices/pensionerStoreSlice';
import { toast } from 'react-toastify';
import { createPensioner } from '../../redux/slices/pensionerSlice';

const PensionerContactAddress = ({ onNext }) => {
  const dispatch = useDispatch();
  const { pensionerForm } = useSelector((state) => state.pensionerStore);

  const validate = (values) => {
    const errors = {};
    if (!values.address) errors.address = 'Required';
    if (!values.city) errors.city = 'Required';
    if (!values.state) errors.state = 'Required';
    if (!values.pin_code) errors.pin_code = 'Required';
    if (!values.mobile_no) errors.mobile_no = 'Required';
    if (!values.email) errors.email = 'Required';
    return errors;
  };

  const handleSubmit = () => {
    toast.success('Pensioner Contact Saved');
    const credentials = {...pensionerForm}
      dispatch(createPensioner(credentials)).unwrap()
       .then(()=>{
        toast.success('pensioner Created');
        dispatch(resetPensionerForm())
       })
       .catch((err)=>{
        const apiMsg =
        err?.response?.data?.message ||
        err?.message ||
        err?.message ||
        'Failed to save info.';
      toast.error(apiMsg);
       })
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
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                name="address"
                label="Address*"
                value={values.address}
                onChange={handleChange}
                error={touched.address && Boolean(errors.address)}
                helperText={touched.address && errors.address}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                name="city"
                label="City*"
                value={values.city}
                onChange={handleChange}
                error={touched.city && Boolean(errors.city)}
                helperText={touched.city && errors.city}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                name="state"
                label="State*"
                value={values.state}
                onChange={handleChange}
                error={touched.state && Boolean(errors.state)}
                helperText={touched.state && errors.state}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                name="pin_code"
                label="Pin Code*"
                value={values.pin_code}
                onChange={handleChange}
                error={touched.pin_code && Boolean(errors.pin_code)}
                helperText={touched.pin_code && errors.pin_code}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                name="mobile_no"
                label="Mobile Number*"
                value={values.mobile}
                onChange={handleChange}
                error={touched.mobile_no && Boolean(errors.mobile_no)}
                helperText={touched.mobile_no && errors.mobile_no}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                name="email"
                label="Email ID*"
                value={values.email}
                onChange={handleChange}
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
              />
            </Grid>
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
