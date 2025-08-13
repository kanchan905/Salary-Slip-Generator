import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, TextField, Button, MenuItem } from '@mui/material';
import { Formik, Form } from 'formik';
import { updatePensionerField, updatePensionerFormFields } from '../../redux/slices/pensionerStoreSlice';
import { toast } from 'react-toastify';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';



const statuses = ['Active', 'Inactive'];

const PensionerServiceDetails = ({ onNext }) => {
  const dispatch = useDispatch();
  const { pensionerForm } = useSelector((state) => state.pensionerStore);


  const validate = (values) => {
    const errors = {};
    // if (!values.doj) errors.doj = 'Required';
    // if (!values.dor) errors.dor = 'Required';
    if (!values.start_date) errors.start_date = 'Required';
    if (values.status == 'Select Status') errors.status = 'Required';
    return errors;
  };

  const handleSubmit = (values) => {
    try {
      dispatch(updatePensionerFormFields(values));
      onNext();
    } catch (err) {
      const apiMsg =
        err?.response?.data?.message ||
        err?.message ||
        'Failed to save info.';
      toast.error(apiMsg);
    }
  };

  return (
    <Formik
      initialValues={pensionerForm}
      validate={validate}
      onSubmit={handleSubmit}
    >
      {({ values, errors, touched, handleChange, setFieldValue }) => (
        <Form>
          <Grid container spacing={2}>
            <Grid item size={{ xs: 6, md: 4 }}>             
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Date of Joining"
                  format="DD-MM-YYYY"
                  value={values.doj ? dayjs(values.doj) : null}
                  onChange={(date) => {
                    const formatted = date ? dayjs(date).format('YYYY-MM-DD') : '';                    
                    setFieldValue('doj', formatted);
                  }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      name: 'doj',
                      error: touched.doj && Boolean(errors.doj),
                      helperText: touched.doj && errors.doj,
                    },
                  }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item size={{ xs: 6, md: 4 }}>            
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Date of Retirement"
                  format="DD-MM-YYYY"
                  value={values.dor ? dayjs(values.dor) : null}
                  onChange={(date) => {
                    const formatted = date ? dayjs(date).format('YYYY-MM-DD') : '';                    
                    setFieldValue('dor', formatted);
                  }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      name: 'dor',
                      error: touched.dor && Boolean(errors.dor),
                      helperText: touched.dor && errors.dor,
                    },
                  }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item size={{ xs: 6, md: 4 }}>         
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Pension Start Date*"
                  format="DD-MM-YYYY"
                  value={values.start_date ? dayjs(values.start_date) : null}
                  onChange={(date) => {
                    const formatted = date ? dayjs(date).format('YYYY-MM-DD') : '';                    
                    setFieldValue('start_date', formatted);
                  }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      name: 'start_date',
                      error: touched.start_date && Boolean(errors.start_date),
                      helperText: touched.start_date && errors.start_date,
                    },
                  }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item size={{ xs: 6, md: 4 }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="End Date (if applicable)"
                  format="DD-MM-YYYY"
                  value={values.end_date ? dayjs(values.end_date) : null}
                  onChange={(date) => {
                    const formatted = date ? dayjs(date).format('YYYY-MM-DD') : '';                    
                    setFieldValue('end_date', formatted);
                  }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      name: 'end_date',
                      error: touched.end_date && Boolean(errors.end_date),
                      helperText: touched.end_date && errors.end_date,
                    },
                  }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item size={{ xs: 6, md: 4 }}>
              <TextField
                select
                fullWidth
                name="status"
                label="Status*"
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
