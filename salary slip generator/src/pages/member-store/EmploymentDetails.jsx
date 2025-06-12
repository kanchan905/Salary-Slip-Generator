import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, TextField, MenuItem, Button, ListSubheader } from '@mui/material';
import { Formik, Form } from 'formik';
import { updateEmployeeField, nextUserStep, fetchDesignationList } from '../../redux/slices/memberStoreSlice';
import { toast } from 'react-toastify';
import { months } from 'utils/helpers';


const statuses = ['Active', 'Suspended', 'Resigned', 'Retired', 'On Leave'];
const jobGroups = ['A', 'B', 'C', 'D'];
const Cadree = ['Technical','Administrative'];

const EmploymentDetails = ({ onNext }) => {
    const dispatch = useDispatch();
    const { employeeForm, designationList } = useSelector((state) => state.memeberStore);

    useEffect(() => {
        dispatch(fetchDesignationList());
    }, [dispatch])

    const validate = (values) => {
        const errors = {};
        if (!values.date_of_joining) errors.date_of_joining = 'Required';
        if (values.designation == 'Select Designation') errors.designation = 'Required';
        if (values.job_group == 'Select Group') errors.job_group = 'Required';
        if (values.cadre == 'Select Cadre') errors.cadre = 'Required';
        if (values.status == 'Select Status') errors.status = 'Required';
        if (values.increment_month == 'Select Month') errors.status = 'Required';
        if (values.increment_month == 'Select Month') errors.increment_month = 'Required';
        return errors;
    };

    const handleSubmit = () => {
        try {
            onNext();
        } catch (err) {
            const apiMsg =
                err?.response?.data?.message ||
                err?.message ||
                'Failed to save employment detail.';
            toast.error(apiMsg);
        }
    };


    const handleChange = (e) => {
        dispatch(updateEmployeeField({ name: e.target.name, value: e.target.value }));
      }

    return (
        <Formik initialValues={employeeForm} enableReinitialize validate={validate} onSubmit={handleSubmit}>
            {({ values, errors, touched }) => (
                <Form>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                type="date"
                                name="date_of_joining"
                                label="Date of Joining*"
                                InputLabelProps={{ shrink: true }}
                                value={values.date_of_joining}
                                onChange={(e)=> handleChange(e)}
                                error={touched.date_of_joining && Boolean(errors.date_of_joining)}
                                helperText={touched.date_of_joining && errors.date_of_joining}
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                type="date"
                                name="date_of_retirement"
                                label="Date of Retirement(if applicable)"
                                InputLabelProps={{ shrink: true }}
                                value={values.date_of_retirement}
                                onChange={(e)=> handleChange(e)}
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                select
                                name="designation"
                                label="Designation*"
                                value={values.designation}
                                onChange={(e)=> handleChange(e)}
                                error={touched.designation && Boolean(errors.designation)}
                                helperText={touched.designation && errors.designation}
                            >
                                <MenuItem value="Select Designation">Select Designation</MenuItem>
                                {designationList.map((group) => [
                                    <ListSubheader sx={{fontSize:'18px'}} key={group.id}>{group.name}</ListSubheader>,
                                    group.options.map((option) => (                                       
                                        <MenuItem key={group.id} value={option}>
                                            {option}
                                        </MenuItem>                                       
                                    )),
                                ])}
                            </TextField>
                        </Grid>

                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                select
                                name="cadre"
                                label="Cadre*"
                                value={values.cadre}
                                onChange={(e)=> handleChange(e)}
                                error={touched.cadre && Boolean(errors.cadre)}
                                helperText={touched.cadre && errors.cadre}
                            >
                                <MenuItem value="Select Cadre">Select Cadre</MenuItem>
                                {Cadree.map((cad) => (
                                    <MenuItem key={cad} value={cad}>{cad}</MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                select
                                name="job_group"
                                label="Job Group*"
                                value={values.job_group}
                                onChange={(e)=> handleChange(e)}
                                error={touched.job_group && Boolean(errors.job_group)}
                                helperText={touched.job_group && errors.job_group}
                            >
                                <MenuItem value="Select Group">Select Group</MenuItem>
                                {jobGroups.map((group) => (
                                    <MenuItem key={group} value={group}>{group}</MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                select
                                name="status"
                                label="Employee Status*"
                                value={values.status}
                                onChange={(e)=> handleChange(e)}
                                error={touched.status && Boolean(errors.status)}
                                helperText={touched.status && errors.status}
                            >
                                <MenuItem value="Select Status">Select Status</MenuItem>
                                {statuses.map((status) => (
                                    <MenuItem key={status} value={status}>{status}</MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                select
                                name="increment_month"
                                label="Increment Month*"
                                value={values.increment_month}
                                onChange={(e)=> handleChange(e)}
                                error={touched.increment_month && Boolean(errors.increment_month)}
                                helperText={touched.increment_month && errors.increment_month}
                            >
                                <MenuItem value="Select Month">Select Month</MenuItem>
                                {months.map((month) => (
                                    <MenuItem key={month} value={month.label}>{month.label}</MenuItem>
                                ))}
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

export default EmploymentDetails;
