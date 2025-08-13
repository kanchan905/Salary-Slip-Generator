import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, TextField, Button, MenuItem, Autocomplete } from '@mui/material';
import { Formik, Form } from 'formik';
import { updatePensionerField, updatePensionerFormFields } from '../../redux/slices/pensionerStoreSlice';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { fetchPensioners } from '../../redux/slices/pensionerSlice';
import { fetchAllUserData, fetchUserData } from '../../redux/slices/userSlice';

const relationOptions = ['Spouse', 'Son', 'Daughter', 'Other'];

const PensionerPersonalDetails = ({ onNext }) => {
  const dispatch = useDispatch();
  const { pensionerForm } = useSelector((state) => state.pensionerStore);
  const users = useSelector((state) => state.user.allUsers);
  const [retired, setRetired] = useState([]);
  const { pensioners, totalCount } = useSelector((state) => state.pensioner);
  const pensionTypes = ['Regular', 'Family'];



  // MODIFIED useEffect to filter retired employees who are not already pensioners
  useEffect(() => {
    if (users.length > 0 && pensioners) {
      // Create a set of user IDs from the existing pensioners list for efficient lookup.
      const existingPensionerUserIds = new Set(pensioners.map(p => p.user_id));

      // Filter users to get those who are retired but not yet in the pensioners list.
      const availableRetiredUsers = users.filter(
        (user) => user.is_retired === 1 && !existingPensionerUserIds.has(user.id)
      );
      
      setRetired(availableRetiredUsers);
    }
  }, [users, pensioners]); // Dependency array now includes pensioners

  useEffect(() => {
    dispatch(fetchAllUserData({
      page: 1,
      limit: '1000',
      search: '',
      institute: ''
    }))
    dispatch(fetchPensioners({ page: '1', limit: 1000, id: '' }))
  }, [dispatch]);

  const validate = (values) => {
    const errors = {};
    if (!values.ppo_no) errors.ppo_no = 'Required';
    // if (!values.first_name) errors.first_name = 'Required';
    // if (values.relation == 'Select relation') errors.relation = 'Required';
    // if (!values.dob) errors.dob = 'Required';
    // if (!values.pan_number) {
    //   errors.pan_number = 'Required';
    // } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(values.pan_number)) {
    //   errors.pan_number = 'format should be 5 letters + 4 digits + 1 letter';
    // }
    if (values.type_of_pension == 'Select Type') errors.type_of_pension = 'Required';
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
      {({ values, errors, touched, handleChange, setFieldValue, setValues }) => (
        <Form>
          <Grid container spacing={2}>
            <Grid item size={{ xs: 6, md: 4 }}>
              <Autocomplete
                options={retired}
                getOptionLabel={(option) => `${option?.name || ''}-${option?.employee_code || ''}`}
                value={retired.find(ret => String(ret.id) === String(values.user_id)) || null}
                onChange={(_, newValue) => {
                  if (newValue) {
                    const dor = newValue.employee_status?.find(status => status.status === 'Retired')?.effective_from || '';
                    const data = {
                      retired_employee_id: '',
                      first_name: newValue.first_name || '',
                      middle_name: newValue.middle_name || '',
                      last_name: newValue.last_name || '',
                      dob: newValue.date_of_birth || '',
                      email: newValue.email || '',
                      institute: newValue.user?.institute || '',
                      pan_number: newValue.pancard || '',
                      doj: newValue.date_of_joining || '',
                      dor: dor,
                      ppo_no: newValue?.pension_number || '',
                      relation: 'Self',
                      user_id: newValue.id || '',
                    };

                    setValues({ ...values, ...data });
                  } else {
                    // Handle case when selection is cleared
                    setFieldValue('user_id', '');
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    required
                    label="Retired Employee"
                    name="user_id"
                  />
                )}
                isOptionEqualToValue={(option, value) => option.id === value.id}
              />

            </Grid>

            <Grid item size={{ xs: 6, md: 4 }}>
              <TextField
                select
                fullWidth
                name="type_of_pension"
                label="Type of Pension*"
                value={values.type_of_pension}
                onChange={(e) => {
                  handleChange(e);
                  if (e.target.value === 'Family') {
                    setValues({
                      ...values,
                      first_name: '',
                      middle_name: '',
                      last_name: '',
                      dob: '',
                      email: '',
                      institute: '',
                      pan_number: '',
                      doj: '',
                      dor: '',
                      ppo_no: '',
                      relation: 'Select relation',
                      type_of_pension: 'Family',
                    });
                  } else if (e.target.value === 'Regular') {
                    setValues({
                      ...values,
                      relation: 'Self',
                      type_of_pension: 'Regular',
                    });
                  }
                }}
                error={touched.type_of_pension && Boolean(errors.type_of_pension)}
                helperText={touched.type_of_pension && errors.type_of_pension}
              >
                <MenuItem value="Select Type">Select Type</MenuItem>
                {pensionTypes.map((opt) => (
                  <MenuItem key={opt} value={opt}>
                    {opt}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {
              values.type_of_pension === 'Family' ? (
                <Grid item size={{ xs: 6, md: 4 }}>
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
                    {relationOptions.map((opt) => (
                      <MenuItem key={opt} value={opt}>
                        {opt}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              ) : (
                <Grid item size={{ xs: 6, md: 4 }}>
                  <TextField
                    fullWidth
                    name="relation"
                    label="Relation"
                    value={values.relation}
                    onChange={handleChange}
                    error={touched.relation && Boolean(errors.relation)}
                    helperText={touched.relation && errors.relation}
                    disabled={values.type_of_pension === 'Regular'}
                  />
                </Grid>
              )
            }


            <Grid item size={{ xs: 6, md: 4 }}>
              <TextField
                fullWidth
                name="ppo_no"
                label="PPO No*"
                value={values.ppo_no}
                onChange={handleChange}
                error={touched.ppo_no && Boolean(errors.ppo_no)}
                helperText={touched.ppo_no && errors.ppo_no}
              />
            </Grid>
            <Grid item size={{ xs: 6, md: 4 }}>
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
            <Grid item size={{ xs: 6, md: 4 }}>
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
            <Grid item size={{ xs: 6, md: 4 }}>
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
            <Grid item size={{ xs: 6, md: 4 }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Date of Birth"
                  format="DD-MM-YYYY"
                  value={values.dob ? dayjs(values.dob) : null}
                  onChange={(date) => {
                    const formatted = date ? dayjs(date).format('YYYY-MM-DD') : '';
                    setFieldValue('dob', formatted);
                  }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      name: 'dob',
                      error: touched.dob && Boolean(errors.dob),
                      helperText: touched.dob && errors.dob,
                    },
                  }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item size={{ xs: 6, md: 4 }}>
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
