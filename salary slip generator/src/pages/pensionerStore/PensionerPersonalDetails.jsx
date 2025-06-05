import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, TextField, Button, MenuItem } from '@mui/material';
import { Formik, Form } from 'formik';
import { updatePensionerField } from '../../redux/slices/pensionerStoreSlice';
import { toast } from 'react-toastify';

const relationOptions = ['Self', 'Spouse', 'Son', 'Daughter', 'Other'];

const PensionerPersonalDetails = ({ onNext }) => {
  const dispatch = useDispatch();
  const { pensionerForm } = useSelector((state) => state.pensionerStore);

  const validate = (values) => {
    const errors = {};
    if (!values.ppo_no) errors.ppo_no = 'Required';
    if (!values.first_name) errors.first_name = 'Required';
    if (!values.last_name) errors.last_name = 'Required';
    if (values.relation == 'Select relation') errors.relation = 'Required';
    if (!values.dob) errors.dob = 'Required';
    if (!values.pan_number) {
      errors.pan_number = 'Required';
    } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(values.pan_number)) {
      errors.pan_number = 'format should be 5 letters + 4 digits + 1 letter';
    }    
    if (!values.mobile_no) errors.mobile_no = 'Required';
    if (!values.email) errors.email = 'Required';
    return errors;
  };

  const handleSubmit = () => {
    try {
      toast.success('Pensioner Personal Detail Saved');
      onNext();
      console.log(pensionerForm);
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
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="ppo_no"
                label="PPO No"
                value={values.ppo_no}
                onChange={handleChange}
                error={touched.ppo_no && Boolean(errors.ppo_no)}
                helperText={touched.ppo_no && errors.ppo_no}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                name="first_name"
                label="First Name"
                value={values.first_name}
                onChange={handleChange}
                error={touched.first_name && Boolean(errors.first_name)}
                helperText={touched.first_name && errors.first_name}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                name="middle_name"
                label="Middle Name"
                value={values.middle_name}
                onChange={handleChange}
                error={touched.middle_name && Boolean(errors.middle_name)}
                helperText={touched.middle_name && errors.middle_name}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                name="last_name"
                label="Last Name"
                value={values.last_name}
                onChange={handleChange}
                error={touched.last_name && Boolean(errors.last_name)}
                helperText={touched.last_name && errors.last_name}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                select
                fullWidth
                name="relation"
                label="Relation"
                value={values.relation}
                onChange={handleChange}
                error={touched.relation && Boolean(errors.relation)}
                helperText={touched.relation && errors.relation}
              >
                <MenuItem value="Select relation">Select Relation</MenuItem>
                {relationOptions.map((opt) => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField
                type="date"
                fullWidth
                name="dob"
                label="Date of Birth"
                InputLabelProps={{ shrink: true }}
                value={values.dob}
                onChange={handleChange}
                error={touched.dob && Boolean(errors.dob)} 
                helperText={touched.dob && errors.dob}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                name="pan_number"
                label="PAN Number"
                value={values.pan_number}
                onChange={handleChange}
                error={touched.pan_number && Boolean(errors.pan_number)} 
                helperText={touched.pan_number && errors.pan_number}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                name="mobile_no"
                label="Contact No"
                value={values.mobile_no}
                onChange={handleChange}
                error={touched.mobile_no && Boolean(errors.mobile_no)} 
                helperText={touched.mobile_no && errors.mobile_no}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="email"
                label="Email"
                value={values.email}
                onChange={handleChange}
                error={touched.email && Boolean(errors.email)} 
                helperText={touched.email && errors.email}
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

export default PensionerPersonalDetails;
