import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, TextField, Button, MenuItem } from '@mui/material';
import { Formik, Form } from 'formik';
import { updatePensionerField, updatePensionerFormFields } from '../../redux/slices/pensionerStoreSlice';
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
  }, [])

  useEffect(() => {
    dispatch(fetchPayCommisions());
  }, [dispatch])

  useEffect(() => {
    if (levels?.length && pensionerForm?.pay_level) {
      const levelObj = levels.find((level) => level.name === pensionerForm.pay_level);
      setSelectedLevel(levelObj);
    }
  }, [])


   
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
      onSubmit={handleSubmit}
    >
      {({ values, errors, touched, handleChange, setFieldValue }) => (
        <Form>
          <Grid container spacing={2}>

            <Grid item size={{ xs: 6, md: 4 }}>
              <TextField
                select
                fullWidth
                name="pay_commission_at_retirement"
                label="Pay Commission at Retirement"
                value={values.pay_commission_at_retirement}
                onChange={handleChange}
                error={touched.pay_commission_at_retirement && Boolean(errors.pay_commission_at_retirement)}
                helperText={touched.pay_commission_at_retirement && errors.pay_commission_at_retirement}
              >
                <MenuItem value="">Select Pay Commission</MenuItem>
                {payCommissions.map((c) => <MenuItem key={c.id} value={c.name}>{c.name}-{c.year}</MenuItem>)}
              </TextField>
            </Grid>

            <Grid item size={{ xs: 6, md: 4 }}>
              <TextField
                fullWidth
                name="last_drawn_salary"
                label="Last Drawn Salary (Gross)"
                value={values.last_drawn_salary}
                onChange={handleChange}
                error={touched.last_drawn_salary && Boolean(errors.last_drawn_salary)}
                helperText={touched.last_drawn_salary && errors.last_drawn_salary}
              />
            </Grid>

            <Grid item size={{ xs: 6, md: 4 }}>
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

            <Grid item size={{ xs: 6, md: 4 }}>
              <TextField
                fullWidth
                name="HRA"
                label="HRA at Time of Retirement"
                value={values.HRA}
                onChange={handleChange}
                error={touched.HRA && Boolean(errors.HRA)}
                helperText={touched.HRA && errors.HRA}
              />
            </Grid>

            <Grid item size={{ xs: 6, md: 4 }}>
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