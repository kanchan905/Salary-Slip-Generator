import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, TextField, MenuItem, Button } from '@mui/material';
import { Formik, Form } from 'formik';
import {
  updateUserField,
  setCreatedUser,
} from '../../redux/slices/memberStoreSlice';
import { createUserData } from '../../redux/slices/userSlice';
import { toast } from 'react-toastify';

const roles = [
  { id: 1, name: 'IT Admin' },
  { id: 2, name: 'Administrative Officer' },
  { id: 3, name: 'Accounts Officer' },
  { id: 4, name: 'Salary Coordinator - NIOH' },
  // { id: 5, name: 'Salary Coordinator - ROHC' },
  // { id: 6, name: 'Pension Coordinator' },
  { id: 5, name: 'End User' }
];

const UserCreation = ({ onNext }) => {
  const dispatch = useDispatch();
  const { userForm } = useSelector((state) => state.memeberStore);

  const validate = (values) => {
    const errors = {};
    if (!values.name) errors.name = 'Required';
    if (!values.email) errors.email = 'Required';
    if (!values.password) errors.password = 'Required';
    if (values.institute == 'Select Institute') errors.institute = 'Required';
    if (values.role_id == 'Select Role') errors.role_id = 'Required';
    return errors;
  };

  const handleSubmit = async (values) => {
    try {
      const response = await dispatch(createUserData(values)).unwrap();
      dispatch(setCreatedUser(response.data));
      toast.success('User created successfully');
      onNext();
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
    dispatch(updateUserField({ name: e.target.name, value: e.target.value }));
  }


  return (
    <Formik
      initialValues={userForm}
      enableReinitialize
      validate={validate}
      onSubmit={handleSubmit}
    >
      {({values, errors, touched}) => (
        <Form>
          <Grid container spacing={2} justifyContent={'center'}>
            <Grid item xs={6}>
              <TextField fullWidth name="name" label="Name*" value={values.name}  onChange={(e)=> handleChange(e)} error={touched.name && Boolean(errors.name)} helperText={touched.name && errors.name} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth name="email" label="Email*" value={values.email}  onChange={(e)=> handleChange(e)} error={touched.email && Boolean(errors.email)} helperText={touched.email && errors.email} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth name="password" type="password" label="Password*" value={values.password}  onChange={(e)=> handleChange(e)} error={touched.password && Boolean(errors.password)} helperText={touched.password && errors.password} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth select name="role_id" label="Role*" value={values.role_id}  onChange={(e)=> handleChange(e)} error={touched.role_id && Boolean(errors.role_id)} helperText={touched.role_id && errors.role_id}>
                <MenuItem value="Select Role">Select Role</MenuItem>
                {roles.map((role) => (
                  <MenuItem key={role.id} value={role.id}>{role.name}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth select name="institute" label="Institute*" value={values.institute}  onChange={(e)=> handleChange(e)} error={touched.institute && Boolean(errors.institute)} helperText={touched.institute && errors.institute}>
                <MenuItem value="Select Institute">Select Institute</MenuItem>
                <MenuItem value="NIOH">NIOH</MenuItem>
                <MenuItem value="ROHC">ROHC</MenuItem>
                <MenuItem value="BOTH">BOTH</MenuItem>
              </TextField>
            </Grid>
          </Grid>

          <Grid container justifyContent="flex-end" sx={{ mt: 3 }}>
            <Button type="submit" variant="contained">Create User</Button>
          </Grid>
        </Form>
      )}
    </Formik>
  );
};

export default UserCreation;
