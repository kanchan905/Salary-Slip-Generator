import React, { useEffect, forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, TextField, MenuItem, Button, Autocomplete, Tooltip, IconButton } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import { Formik, Form } from 'formik';
import { toast } from 'react-toastify';
import { fetchAllUserData } from '../../redux/slices/userSlice';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { InfoOutline } from '@mui/icons-material';

const roles = [
  { id: 1, name: 'IT Admin' },
  { id: 2, name: 'Administrative Officer' },
  { id: 3, name: 'Accounts Officer' },
  { id: 4, name: 'Salary Coordinator - NIOH' },
  { id: 5, name: 'Salary Coordinator - ROHC' },
  { id: 6, name: 'Pension Coordinator' },
  { id: 7, name: 'End User' }
];

const UserCreation = forwardRef(({ values, onNext }, ref) => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.user.allUsers);
  const statuses = ['Active', 'Suspended', 'Resigned', 'Retired', 'On Leave'];
  const [nonRetired, setNonRetired] = useState([]);

  useEffect(() => {
    if (users.length) {
      const activeUser = users.filter(
        (user) => user.employee_count === 0 && user.is_retired === 0
      );
      setNonRetired(activeUser)
    } 
  }, [users]);


  useEffect(() => {
    dispatch(fetchAllUserData());
  }, [dispatch]);

  const formikRef = useRef();

  useImperativeHandle(ref, () => ({
    saveCurrentValues: () => {
      return formikRef.current?.values || values;
    }
  }));

  const validate = (values) => {
    if (values.status === 'Retired') {
      const errors = {};
      if (!values.employee_code) errors.employee_code = 'Required';
      if (!values.prefix) errors.prefix = 'Required';
      if (!values.gender) errors.gender = 'Required';
      if (!values.first_name) errors.first_name = 'Required';
      if (!values.institute) errors.institute = 'Required';
      if (!values.email) errors.email = 'Required';
      return errors;
    }
    const errors = {};
    if (!values.employee_code) errors.employee_code = 'Required';
    if (!values.prefix) errors.prefix = 'Required';
    if (!values.first_name) errors.first_name = 'Required';
    if (!values.gender) errors.gender = 'Required';
    if (!values.date_of_birth) errors.date_of_birth = 'Required';
    if (!values.pancard) {
      errors.pancard = 'Required';
    } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(values.pancard)) {
      errors.pancard = 'Invalid PAN format';
    }
    if (!values.institute) errors.institute = 'Required';
    if (!values.email) errors.email = 'Required';
    if (!values.status) errors.status = 'Required';
    if (!values.status_effective_from) errors.status_effective_from = 'Required';
    if (values.status_effective_till && values.status_effective_from) {
      const fromDate = new Date(values.status_effective_from);
      const tillDate = new Date(values.status_effective_till);
      if (tillDate <= fromDate) {
        errors.status_effective_till = 'Must be after Status From date';
      }
    }
    return errors;
  };

  const handleSubmit = (stepValues) => {
    try {
      onNext(stepValues);
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || 'Failed to save info.');
    }
  };

  return (
    <Formik innerRef={formikRef} initialValues={values} enableReinitialize validate={validate} onSubmit={handleSubmit}>
      {({ values, errors, touched, handleChange, setFieldValue }) => (
        <Form>
          <Grid container spacing={2}>
            {/* Autocomplete: Employee Code */}
            <Grid item size={{ xs: 6, md: 4 }}>
              <Autocomplete
                fullWidth
                options={nonRetired}
                getOptionLabel={(nonRetired) => {
                  if (!nonRetired || !nonRetired.employee_code) return "-|-";
                  const employeeCode = nonRetired.employee_code.toUpperCase();
                  const name = nonRetired.name
                    ? nonRetired.name
                      .toLowerCase()
                      .split(' ')
                      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(' ')
                    : "NA";
                  return `${employeeCode} - ${name}`;
                }}
                isOptionEqualToValue={(option, value) => option.employee_code === value.employee_code}
                value={nonRetired.find((user) => user.employee_code === values.employee_code) || null}
                onChange={(event, selectedUser) => {
                  if (selectedUser) {
                    setFieldValue('employee_code', selectedUser.employee_code);
                    setFieldValue('first_name', selectedUser.first_name);
                    setFieldValue('middle_name', selectedUser.middle_name || '');
                    setFieldValue('last_name', selectedUser.last_name);
                    setFieldValue('user_id', selectedUser.id);
                    setFieldValue('email', selectedUser.email);
                    setFieldValue('institute', selectedUser.institute);
                  } else {
                    setFieldValue('employee_code', '');
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Employee Code*"
                    error={touched.employee_code && Boolean(errors.employee_code)}
                    helperText={touched.employee_code && errors.employee_code}
                    size="medium"
                    sx={{
                      '& .MuiInputBase-root': {
                        height: 56,
                        fontSize: '1rem',
                      },
                      '& .MuiInputLabel-root': {
                        fontSize: '1rem',
                      },
                    }}
                  />
                )}
              />
            </Grid>
            {/* Personal Details */}
            <Grid item size={{ xs: 6, md: 4 }} height={0} width={0}>
              <TextField fullWidth select label="Prefix*" name="prefix" value={values.prefix} onChange={handleChange}  
                error={touched.prefix && Boolean(errors.prefix)} helperText={touched.prefix && errors.prefix}>
                <MenuItem value="Select Prefix">Select Prefix</MenuItem>
                <MenuItem value="Mr.">Mr.</MenuItem>
                <MenuItem value="Mrs.">Mrs.</MenuItem>
                <MenuItem value="Ms.">Ms.</MenuItem>
                <MenuItem value="Dr.">Dr.</MenuItem>
              </TextField>
            </Grid>
            <Grid item size={{ xs: 6, md: 4 }}>
              <TextField fullWidth name="first_name" label="First Name*" className='text-capitalize' value={values.first_name}
                onChange={handleChange} error={touched.first_name && Boolean(errors.first_name)}
                helperText={touched.first_name && errors.first_name} disabled />
            </Grid>
            <Grid item size={{ xs: 6, md: 4 }}>
              <TextField fullWidth name="middle_name" label="Middle Name (Optional)" className='text-capitalize' value={values.middle_name} disabled
                onChange={handleChange} />
            </Grid>
            <Grid item size={{ xs: 6, md: 4 }}>
              <TextField fullWidth name="last_name" label="Last Name (Optional)" className='text-capitalize' value={values.last_name} disabled
                onChange={handleChange} error={touched.last_name && Boolean(errors.last_name)}
                helperText={touched.last_name && errors.last_name} />
            </Grid>
            <Grid item size={{ xs: 6, md: 4 }}>
              <TextField fullWidth select name="gender" label="Gender*" value={values.gender}
                onChange={handleChange} error={touched.gender && Boolean(errors.gender)}
                helperText={touched.gender && errors.gender}>
                <MenuItem value="">Select Gender</MenuItem>
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </TextField>
            </Grid>
            <Grid item size={{ xs: 6, md: 4 }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Date of Birth*"
                  format="DD-MM-YYYY"
                  value={values.date_of_birth ? dayjs(values.date_of_birth) : null}
                  onChange={(date) => {
                    const formatted = date ? dayjs(date).format('YYYY-MM-DD') : '';
                    setFieldValue('date_of_birth', formatted);
                  }}
                  disableFuture
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      name: 'date_of_birth',
                      error: touched.date_of_birth && Boolean(errors.date_of_birth),
                      helperText: touched.date_of_birth && errors.date_of_birth,
                    },
                    field: {
                      inputProps: {
                        placeholder: 'DD-MM-YYYY',
                      }
                    }
                  }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item size={{ xs: 6, md: 4 }}>
              <TextField fullWidth name="email" label="Email*" value={values.email}
                onChange={handleChange} error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email} disabled />
            </Grid>
            <Grid item size={{ xs: 6, md: 4 }}>
              <TextField fullWidth name="pancard" label="PAN Card Number*" value={values.pancard}
                onChange={handleChange} error={touched.pancard && Boolean(errors.pancard)}
                helperText={touched.pancard && errors.pancard}
                placeholder="e.g. AAAAA1234A"
                InputProps={{
                  endAdornment: (
                    <Tooltip title="PAN format: 5 uppercase letters, 4 digits, and 1 letter (e.g. ABCDE1234F)">
                      <IconButton tabIndex={-1}>
                        <InfoOutline fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  ),
                }}
              />
            </Grid>
            <Grid item size={{ xs: 6, md: 4 }}>
              <TextField
                fullWidth
                select
                name="status"
                label="Employee Status*"
                value={values.status}
                onChange={handleChange}
                error={touched.status && Boolean(errors.status)}
                helperText={touched.status && errors.status}
              >
                <MenuItem value="">Select Status</MenuItem>
                {statuses.map((status) => (
                  <MenuItem key={status} value={status}>{status}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item size={{ xs: 6, md: 4 }}>
               <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Employee Status From*"
                format="DD-MM-YYYY"
                value={values.status_effective_from ? dayjs(values.status_effective_from) : null}
                onChange={(date) => {
                  const formatted = date ? dayjs(date).format('YYYY-MM-DD') : '';
                  setFieldValue('status_effective_from', formatted);
                }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    name: 'status_effective_from',
                    error: touched.status_effective_from && Boolean(errors.status_effective_from),
                    helperText: touched.status_effective_from && errors.status_effective_from,
                  },
                }}
              />
              </LocalizationProvider>
            </Grid>
            <Grid item size={{ xs: 6, md: 4 }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Employee Status Till"
                format="DD-MM-YYYY"
                value={values.status_effective_till ? dayjs(values.status_effective_till) : null}
                onChange={(date) => {
                  const formatted = date ? dayjs(date).format('YYYY-MM-DD') : '';
                  setFieldValue('status_effective_till', formatted);
                }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    name: 'status_effective_from',
                    error: touched.status_effective_till && Boolean(errors.status_effective_till),
                    helperText: touched.status_effective_till && errors.status_effective_till,
                  },
                }}
              />
              </LocalizationProvider>
            </Grid>
            <Grid item size={{ xs: 6, md: 4 }}>
              <TextField fullWidth select name="institute" label="Institute*" value={values.institute}
                onChange={handleChange} error={touched.institute && Boolean(errors.institute)}
                helperText={touched.institute && errors.institute} disabled>
                <MenuItem value="">Select Institute</MenuItem>
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
});

export default UserCreation;
