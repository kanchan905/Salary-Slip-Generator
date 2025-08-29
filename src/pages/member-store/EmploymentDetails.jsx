import React, { useEffect, forwardRef, useImperativeHandle, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, TextField, MenuItem, Button, ListSubheader } from '@mui/material';
import { Formik, Form } from 'formik';
import { fetchDesignationList } from '../../redux/slices/memberStoreSlice';
import { toast } from 'react-toastify';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { increamentMonths } from 'utils/helpers';



const jobGroups = ['A', 'B', 'C'];
const Cadree = ['Scientific', 'Technical', 'Administrative'];

const EmploymentDetails = forwardRef(({ values, onNext }, ref) => {
    const dispatch = useDispatch();
    const { designationList } = useSelector((state) => state.memeberStore);


    useEffect(() => {
        dispatch(fetchDesignationList());
    }, [dispatch]);

    const formikRef = useRef();

    useImperativeHandle(ref, () => ({
        saveCurrentValues: () => {
            return formikRef.current?.values || values;
        }
    }));

    const validate = (values) => {
        if (values.status ==='Retired') {
            return {};
        }
        const errors = {};
        if (!values.date_of_joining) errors.date_of_joining = 'Required';
        if (!values.date_of_retirement) errors.date_of_retirement = 'Required';
        if (!values.designation_group) errors.designation_group = 'Required';
        if (!values.designation) errors.designation = 'Required';
        if (!values.designation_effective_from) errors.designation_effective_from = 'Required';
        if (values.designation_effective_till && values.designation_effective_from) {
            const fromDate = new Date(values.designation_effective_from);
            const tillDate = new Date(values.designation_effective_till);
            if (tillDate <= fromDate) {
                errors.designation_effective_till = 'Must be after Designation From date';
            }
        }
       
        if (!values.job_group) errors.job_group = 'Required';
        if (!values.cadre ) errors.cadre = 'Required';
        if (!values.increment_month ) errors.increment_month = 'Required';

        return errors;
    };

    const handleSubmit = (stepValues) => {
        const safeValues = {
            ...stepValues,
            increment_month: String(stepValues.increment_month || ''),
        };
        try {
            onNext(safeValues);
        } catch (err) {
            const apiMsg =
                err?.response?.data?.message ||
                err?.message ||
                'Failed to save employment detail.';
            toast.error(apiMsg);
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Formik innerRef={formikRef} initialValues={values} enableReinitialize validate={validate} onSubmit={handleSubmit}>
                {({ values, errors, touched, handleChange, setFieldValue }) => (
                    <Form>
                        <Grid container spacing={2}>
                            <Grid item size={{ xs: 6, md: 4 }}>
                                <TextField
                                    fullWidth
                                    select
                                    name="cadre"
                                    label="Cadre*"
                                    value={values.cadre}
                                    onChange={handleChange}
                                    error={touched.cadre && Boolean(errors.cadre)}
                                    helperText={touched.cadre && errors.cadre}
                                >
                                    <MenuItem value="">Select Cadre</MenuItem>
                                    {/* {Cadree.map((cad) => (
                                        <MenuItem key={cad} value={cad}>{cad}</MenuItem>
                                    ))} */}
                                    {designationList.map((group) => [
                                        <MenuItem key={group.id} value={group.name}>
                                            {group.name.split(' ')[0]}
                                        </MenuItem>
                                    ])}
                                </TextField>
                            </Grid>
                            <Grid item size={{ xs: 6, md: 4 }}>
                                <TextField
                                    fullWidth
                                    select
                                    name="designation_group"
                                    label="Designation Group"
                                    value={values.designation_group}
                                    onChange={e => {
                                        handleChange(e);
                                        setFieldValue('designation', '');
                                    }}
                                    error={touched.designation_group && Boolean(errors.designation_group)}
                                    helperText={touched.designation_group && errors.designation_group}
                                >
                                    <MenuItem value="">Select...</MenuItem>
                                    {designationList.map((group) => [
                                        <MenuItem key={group.id} value={group.name}>
                                            {group.name}
                                        </MenuItem>
                                    ])}
                                </TextField>
                            </Grid>
                            <Grid item size={{ xs: 6, md: 4 }}>
                                <TextField
                                    fullWidth
                                    select
                                    name="designation"
                                    label="Designation*"
                                    value={values.designation}
                                    onChange={handleChange}
                                    error={touched.designation && Boolean(errors.designation)}
                                    helperText={touched.designation && errors.designation}
                                >
                                    <MenuItem value="">Select...</MenuItem>
                                    {designationList
                                        .find((d) => d.name === values.designation_group)?.options
                                        ?.map((opt, index) => (
                                            <MenuItem key={index} value={opt}>
                                                {opt}
                                            </MenuItem>
                                        ))}
                                </TextField>
                            </Grid>
                            <Grid item size={{ xs: 6, md: 4 }}>
                                <TextField
                                    fullWidth
                                    select
                                    name="job_group"
                                    label="Job Group*"
                                    value={values.job_group}
                                    onChange={handleChange}
                                    error={touched.job_group && Boolean(errors.job_group)}
                                    helperText={touched.job_group && errors.job_group}
                                >
                                    <MenuItem value="">Select Group</MenuItem>
                                    {jobGroups.map((group) => (
                                        <MenuItem key={group} value={group}>{group}</MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item size={{ xs: 6, md: 4 }} >
                                <DatePicker
                                    name="date_of_joining"
                                    label="Date of Joining*"
                                    format="DD-MM-YYYY"
                                    InputLabelProps={{ shrink: true }}
                                    value={values.date_of_joining ? dayjs(values.date_of_joining) : null}
                                    onChange={(newValue) => {
                                        const formatted = newValue ? dayjs(newValue).format('YYYY-MM-DD') : '';
                                        setFieldValue('date_of_joining', formatted || '');
                                    }}
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            error: touched.date_of_joining && Boolean(errors.date_of_joining),
                                            helperText: touched.date_of_joining && errors.date_of_joining
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item size={{ xs: 6, md: 4 }}>
                                <DatePicker
                                    name="date_of_retirement"
                                    label="Date of Retirement*"
                                    format="DD-MM-YYYY"
                                    InputLabelProps={{ shrink: true }}
                                    value={values.date_of_retirement ? dayjs(values.date_of_retirement) : null}
                                    onChange={(newValue) => {
                                        const formatted = newValue ? dayjs(newValue).format('YYYY-MM-DD') : '';
                                        setFieldValue('date_of_retirement', formatted || '');
                                    }}
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            error: touched.date_of_retirement && Boolean(errors.date_of_retirement),
                                            helperText: touched.date_of_retirement && errors.date_of_retirement
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item size={{ xs: 6, md: 4 }}>
                                <DatePicker
                                    label="Designation Effective from*"
                                    format="DD-MM-YYYY"
                                    value={values.designation_effective_from ? dayjs(values.designation_effective_from) : null}
                                    onChange={(date) => {
                                        const formatted = date ? dayjs(date).format('YYYY-MM-DD') : '';
                                        setFieldValue('designation_effective_from', formatted);
                                    }}
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            name: 'designation_effective_from',
                                            error: touched.designation_effective_from && Boolean(errors.designation_effective_from),
                                            helperText: touched.designation_effective_from && errors.designation_effective_from,
                                        },
                                    }}
                                />
                            </Grid>
                            <Grid item size={{ xs: 6, md: 4 }}>
                                <DatePicker
                                    label="Designation Effective till"
                                    format="DD-MM-YYYY"
                                    value={values.designation_effective_till ? dayjs(values.designation_effective_till) : null}
                                    onChange={(date) => {
                                        const formatted = date ? dayjs(date).format('YYYY-MM-DD') : '';
                                        setFieldValue('designation_effective_till', formatted);
                                    }}
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            name: 'designation_effective_till',
                                            error: touched.designation_effective_till && Boolean(errors.designation_effective_till),
                                            helperText: touched.designation_effective_till && errors.designation_effective_till,
                                        },
                                    }}
                                />
                            </Grid>
                            <Grid item size={{ xs: 6, md: 4 }}>
                                <TextField
                                    fullWidth
                                    select
                                    name="increment_month"
                                    label="Increment Month*"
                                    value={values.increment_month}
                                    onChange={e => setFieldValue('increment_month', String(e.target.value))}
                                    error={touched.increment_month && Boolean(errors.increment_month)}
                                    helperText={touched.increment_month && errors.increment_month}
                                >
                                    <MenuItem value="">Select Month</MenuItem>
                                    {increamentMonths.map((month) => (
                                        <MenuItem key={month.value} value={String(month.value)}>{month.label}</MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            {/* Add back promotion_order_no and order_reference fields */}
                            <Grid item size={{ xs: 6, md: 4 }}>
                                <TextField
                                    fullWidth
                                    name="promotion_order_no"
                                    label="Promotion Order No (If applicable)"
                                    value={values.promotion_order_no}
                                    onChange={handleChange}
                                    error={touched.promotion_order_no && Boolean(errors.promotion_order_no)}
                                    helperText={touched.promotion_order_no && errors.promotion_order_no}
                                />
                            </Grid>
                            <Grid item size={{ xs: 6, md: 4 }}>
                                <TextField
                                    fullWidth
                                    name="order_reference"
                                    label="Order Reference (if applicable)"
                                    value={values.order_reference}
                                    onChange={handleChange}
                                />
                            </Grid>
                        </Grid>
                        <Grid container justifyContent="flex-end" sx={{ mt: 3 }}>
                            <Button type="submit" variant="contained">Next</Button>
                        </Grid>
                    </Form>
                )}
            </Formik>
        </LocalizationProvider>
    );
});

export default EmploymentDetails;
