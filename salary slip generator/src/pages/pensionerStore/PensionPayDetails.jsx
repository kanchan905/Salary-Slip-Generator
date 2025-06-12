import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, TextField, Button, MenuItem } from '@mui/material';
import { Formik, Form } from 'formik';
import { updatePensionerField } from '../../redux/slices/pensionerStoreSlice';
import { toast } from 'react-toastify';
import { fetchPayCommisions } from '../../redux/slices/payCommision';
import { fetchPayLevel } from '../../redux/slices/levelSlice';



const PensionPayDetails = ({ onNext }) => {
  const dispatch = useDispatch();
  const { pensionerForm } = useSelector((state) => state.pensionerStore);
  const { payCommissions } = useSelector((state) => state.payCommision);
  const { levels } = useSelector((state) => state.levels);
  const [selectedLevel, setSelectedLevel] = useState(null);

  useEffect(() => {
    dispatch(fetchPayLevel({ page: '1', limit: '1000' }));
  }, [selectedLevel])

  useEffect(() => {
    dispatch(fetchPayCommisions());
  }, [dispatch])

  useEffect(() => {
    if (levels?.length && pensionerForm?.pay_level) {
      const levelObj = levels.find((level) => level.name === pensionerForm.pay_level);
      setSelectedLevel(levelObj);
    }
  }, [])


  const validate = (values) => {
    const errors = {};
    if (values.pay_commission == 'Select Pay Commission') errors.pay_commission = 'Required';
    if (values.pay_level == 'Select Pay Level') errors.pay_level = 'Required';
    if (values.pay_cell == 'Select Pay Cell') errors.pay_cell = 'Required';
    if (values.pay_commission_at_retirement == 'Select Pay Commission') errors.pay_commission_at_retirement = 'Required';
    if (!values.basic_pay_at_retirement) errors.basic_pay_at_retirement = 'Required';
    if (!values.last_drawn_salary) errors.last_drawn_salary = 'Required';
    if (!values.HRA) errors.HRA = 'Required';
    return errors;
  };

  const handleSubmit = () => {
    try {
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
    const { name, value } = e.target;
    const stringValue = String(value);

    if (name === 'pay_level') {
      const levelObj = levels.find((level) => level.name === value);
      setSelectedLevel(levelObj);
      dispatch(updatePensionerField({ name, value }));
      dispatch(updatePensionerField({ name: 'pay_cell', value: 'Select Pay Cell' }));
      dispatch(updatePensionerField({ name: 'basic_pay_at_retirement', value: '' }));
      return;
    }

    if (name === 'pay_cell') {
      const cell = selectedLevel?.pay_matrix_cell.find(
        (cell) => String(cell.id) === stringValue
      );

      if (cell) {
        dispatch(updatePensionerField({
          name: 'basic_pay_at_retirement',
          value: String(cell.amount),
        }));
      }

      dispatch(updatePensionerField({ name, value: stringValue }));
      return;
    }

    dispatch(updatePensionerField({ name, value: stringValue }));
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

            <Grid item xs={6}>
              <TextField
                select
                fullWidth
                name="pay_commission"
                label="Pay Commission*"
                value={values.pay_commission}
                onChange={handleChange}
                error={touched.pay_commission && Boolean(errors.pay_commission)}
                helperText={touched.pay_commission && errors.pay_commission}
              >
                <MenuItem value="Select Pay Commission">Select Pay Commission</MenuItem>
                {payCommissions.map((c) => <MenuItem key={c.id} value={c.name}>{c.name}-{c.year}</MenuItem>)}
              </TextField>
            </Grid>

            <Grid item xs={6} sx={{ width: '80px' }}>
              <TextField
                select
                fullWidth
                name="pay_level"
                label="Pay Matrix Level*"
                value={values.pay_level}
                onChange={handleChange}
                error={touched.pay_level && Boolean(errors.pay_level)}
                helperText={touched.pay_level && errors.pay_level}
              >
                <MenuItem value="Select Pay Level">Select Pay Level</MenuItem>
                {levels.map((l) => <MenuItem key={l.id} value={l.name}>{l.name}</MenuItem>)}
              </TextField>
            </Grid>

            <Grid item xs={6} sx={{ width: '80px' }}>
              <TextField
                select
                fullWidth
                name="pay_cell"
                label="Pay Cell*"
                value={values.pay_cell}
                onChange={handleChange}
                error={touched.pay_cell && Boolean(errors.pay_cell)}
                helperText={touched.pay_cell && errors.pay_cell}
                disabled={!selectedLevel}
              >
                <MenuItem value="Select Pay Cell">Select Pay Cell</MenuItem>
                {selectedLevel?.pay_matrix_cell.map((cell) => (
                  <MenuItem key={cell.id} value={String(cell.id)}>
                    {cell.index}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={6}>
              <TextField
                select
                fullWidth
                name="pay_commission_at_retirement"
                label="Pay Commission at Retirement*"
                value={values.pay_commission_at_retirement}
                onChange={handleChange}
                error={touched.pay_commission_at_retirement && Boolean(errors.pay_commission_at_retirement)}
                helperText={touched.pay_commission_at_retirement && errors.pay_commission_at_retirement}
              >
                <MenuItem value="Select Pay Commission">Select Pay Commission</MenuItem>
                {payCommissions.map((c) => <MenuItem key={c.id} value={c.name}>{c.name}-{c.year}</MenuItem>)}
              </TextField>
            </Grid>

            {/* <Grid item xs={6}>
              <TextField
                fullWidth
                name="basic_pay_at_retirement"
                label="Basic Pay at Retirement*"
                value={values.basic_pay_at_retirement}
                onChange={handleChange}
                disabled
              >
              </TextField>
            </Grid> */}

            <Grid item xs={6}>
              <TextField
                fullWidth
                name="last_drawn_salary"
                label="Last Drawn Salary (Gross)*"
                value={values.last_drawn_salary}
                onChange={handleChange}
                error={touched.last_drawn_salary && Boolean(errors.last_drawn_salary)}
                helperText={touched.last_drawn_salary && errors.last_drawn_salary}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                name="NPA"
                label="NPA (if applicable)"
                value={values.NPA}
                onChange={handleChange}
                error={touched.NPA && Boolean(errors.NPA)}
                helperText={touched.NPA && errors.NPA}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                name="HRA"
                label="HRA at Time of Retirement*"
                value={values.HRA}
                onChange={handleChange}
                error={touched.HRA && Boolean(errors.HRA)}
                helperText={touched.HRA && errors.HRA}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                name="special_pay"
                label="Special Pay / Allowance(if any)"
                value={values.special_pay}
                onChange={handleChange}
                error={touched.special_pay && Boolean(errors.special_pay)}
                helperText={touched.special_pay && errors.special_pay}
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

export default PensionPayDetails;
