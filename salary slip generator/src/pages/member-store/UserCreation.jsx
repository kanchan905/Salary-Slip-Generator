import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, TextField, MenuItem, Button } from '@mui/material';
import { Formik, Form } from 'formik';
import {
  updateEmployeeField, updateEmployeeFormFields
} from '../../redux/slices/memberStoreSlice';
import { toast } from 'react-toastify';
import { fetchEmployees } from '../../redux/slices/employeeSlice';
import { fetchUserData } from '../../redux/slices/userSlice';

const roles = [
  { id: 1, name: 'IT Admin' },
  { id: 2, name: 'Administrative Officer' },
  { id: 3, name: 'Accounts Officer' },
  { id: 4, name: 'Salary Coordinator - NIOH' },
  { id: 5, name: 'Salary Coordinator - ROHC' },
  { id: 6, name: 'Pension Coordinator' },
  { id: 7, name: 'End User' }
];

const UserCreation = ({ onNext }) => {
  const dispatch = useDispatch();
  const employees = useSelector((state) => state.employee.employees) || [];
  const users = useSelector((state) => state.user.users);
  const { employeeForm } = useSelector((state) => state.memeberStore);

  const [EmployeeCodes, setEmployeeCodes] = React.useState([]);
  const [NotExistId, setNotExistId] = React.useState([]);
  // let EmployeeCodes = []//employees.map(emp => emp?.user?.id);
  // let NotExistId = []//users.filter(user => !EmployeeCodes.includes(user.id));
 

  useEffect(() => {
    if (employees.length) {
      const empCodes = employees.map(emp => emp?.user?.id).filter(emp => emp);
      console.log('empCodes', empCodes);
      setEmployeeCodes(empCodes);
      if (users.length) {
        const notExistId = users.filter(user => !EmployeeCodes.includes(user.id));
        setNotExistId(notExistId);
        console.log('NotExistId', notExistId);
      }
    }
  }, [employees, users]);


  useEffect(() => {
    dispatch(fetchEmployees({ page: '1', limit: '1000', search: '' }));
    dispatch(fetchUserData({ page: '1', limit: '1000' }));
  }, [dispatch])

  const validate = (values) => {
    const errors = {};
    if (values.employee_code == 'Select Employee Code') errors.employee_code = 'Required';
    return errors;
  };

  const handleSubmit = () => {
    try {
      toast.success('User created successfully');
      onNext();
      console.log('User created successfully:', employeeForm);
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
    dispatch(updateEmployeeField({ name: e.target.name, value: e.target.value }));
    if (e.target.name === 'employee_code') {
      const user = NotExistId.find((u) => u.id == e.target.value);
      if (user) {
        // dispatch(updateEmployeeField({ name: 'first_name', value: user.first_name }));
        // dispatch(updateEmployeeField({ name: 'middle_name', value: user.middle_name }));
        // dispatch(updateEmployeeField({ name: 'last_name', value: user.last_name }));
        // dispatch(updateEmployeeField({ name: 'employee_code', value: user.employee_code }));
        // dispatch(updateEmployeeField({ name: 'user_id', value: user.id }));
        // dispatch(updateEmployeeField({ name: 'email', value: user.email }));
        // dispatch(updateEmployeeField({ name: 'institute', value: user.institute }));
        const data = {
          first_name: user.first_name,
          middle_name: user.middle_name,
          last_name: user.last_name,
          employee_code: user.employee_code,
          user_id: user.id,
          email: user.email,
          institute: user.institute
        };
        dispatch(updateEmployeeFormFields(data));
      }
    }
  }


  return (
    <Formik
      initialValues={employeeForm}
      enableReinitialize
      validate={validate}
      onSubmit={handleSubmit}
    >
      {({ values, errors, touched }) => (
        <Form>
          <Grid container spacing={2} >
            <Grid item xs={6} sx={{width:'100px'}}>
              <TextField
                fullWidth
                select
                name="employee_code"
                label="Employee Code*"
                value={values.employee_code}
                onChange={(e) => handleChange(e)}
                error={touched.employee_code && Boolean(errors.employee_code)}
                helperText={touched.employee_code && errors.employee_code}
              >
                <MenuItem value="Select Employee Code">Select Employee Code</MenuItem>
                {NotExistId.map((user) => (
                  <MenuItem key={`${user.id}`} value={`${user.employee_code}`}>
                    {user.employee_code} - {user.first_name} {user.last_name}
                  </MenuItem>
                ))}
              </TextField>

            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth name="first_name" label="First Name*" value={values.first_name} disabled onChange={(e) => handleChange(e)} error={touched.first_name && Boolean(errors.first_name)} helperText={touched.first_name && errors.first_name} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth name="last_name" label="Last Name*" value={values.last_name} disabled onChange={(e) => handleChange(e)} error={touched.last_name && Boolean(errors.last_name)} helperText={touched.last_name && errors.last_name} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth name="email" label="Email*" value={values.email} disabled onChange={(e) => handleChange(e)} error={touched.email && Boolean(errors.email)} helperText={touched.email && errors.email} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth select name="institute" label="Institute*" value={values.institute} disabled onChange={(e) => handleChange(e)} error={touched.institute && Boolean(errors.institute)} helperText={touched.institute && errors.institute}>
                <MenuItem value="Select Institute">Select Institute</MenuItem>
                <MenuItem value="NIOH">NIOH</MenuItem>
                <MenuItem value="ROHC">ROHC</MenuItem>
                <MenuItem value="BOTH">BOTH</MenuItem>
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
};

export default UserCreation;
