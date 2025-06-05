import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, TextField, Button, MenuItem } from '@mui/material';
import { Formik, Form } from 'formik';
import { updatePensionerField } from '../../redux/slices/pensionerStoreSlice';
import { toast } from 'react-toastify';
import { fetchEmployees } from '../../redux/slices/employeeSlice';

const pensionTypes = ['Regular', 'Family'];
const statuses = ['Active', 'Deceased'];

const PensionerServiceDetails = ({ onNext }) => {
  const dispatch = useDispatch();
  const { pensionerForm } = useSelector((state) => state.pensionerStore);
  const { employees } = useSelector((state) => state.employee);
  const retired = employees.filter(emp => emp?.date_of_retirement !== null);


  useEffect(() => {
    dispatch(fetchEmployees({ page: '1', limit: '1000', search: '' }))
  }, [dispatch])

  const validate = (values) => {
    const errors = {};
    if (values.retired_employee_id == 'Select Retired') errors.retired_employee_id = 'Required';
    if (!values.doj) errors.doj = 'Required';
    if (!values.dor) errors.dor = 'Required';
    if (!values.start_date) errors.start_date = 'Required';
    if (values.type_of_pension == 'Select Type') errors.type_of_pension = 'Required';
    if (values.status == 'Select Status') errors.status = 'Required';
    return errors;
  };

  const handleSubmit = () => {
    try {
      toast.success('Pensioner Service Saved');
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
            <Grid item xs={12}>
              <TextField
                select
                fullWidth               
                name="retired_employee_id"
                label="Retired Employee ID"
                value={values.retired_employee_id}
                onChange={handleChange}
                error={touched.retired_employee_id && Boolean(errors.retired_employee_id)}
                helperText={touched.retired_employee_id && errors.retired_employee_id}
              >
                <MenuItem value="Select Retired">Select Retired</MenuItem>
                {retired.map((ret) => <MenuItem key={ret} value={ret.id}>{ret.first_name}{ret.last_name}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={4}>
              <TextField
                type="date"
                fullWidth
                name="doj"
                label="Date of Joining"
                InputLabelProps={{ shrink: true }}
                value={values.doj}
                onChange={handleChange}
                error={touched.doj && Boolean(errors.doj)}
                helperText={touched.doj && errors.doj}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                type="date"
                fullWidth
                name="dor"
                label="Date of Retirement"
                InputLabelProps={{ shrink: true }}
                value={values.dor}
                onChange={handleChange}
                error={touched.dor && Boolean(errors.dor)}
                helperText={touched.dor && errors.dor}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                type="date"
                fullWidth
                name="start_date"
                label="Pension Start Date"
                InputLabelProps={{ shrink: true }}
                value={values.start_date}
                onChange={handleChange}
                error={touched.start_date && Boolean(errors.start_date)}
                helperText={touched.start_date && errors.start_date}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                type="date"
                fullWidth
                name="end_date"
                label="End Date (if applicable)"
                InputLabelProps={{ shrink: true }}
                value={values.end_date}
                onChange={handleChange}
                error={touched.end_date && Boolean(errors.end_date)}
                helperText={touched.end_date && errors.end_date}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                select
                fullWidth
                name="type_of_pension"
                label="Type of Pension"
                value={values.type_of_pension}
                onChange={handleChange}
                error={touched.type_of_pension && Boolean(errors.type_of_pension)}
                helperText={touched.type_of_pension && errors.type_of_pension}
              >
                <MenuItem value="Select Type">Select Type</MenuItem>
                {pensionTypes.map((opt) => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={3}>
              <TextField
                select
                fullWidth
                name="status"
                label="Status"
                value={values.status}
                onChange={handleChange}
                error={touched.status && Boolean(errors.status)}
                helperText={touched.status && errors.status}
              >
                <MenuItem value="Select Status">Select Status</MenuItem>
                {statuses.map((opt) => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
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

export default PensionerServiceDetails;
