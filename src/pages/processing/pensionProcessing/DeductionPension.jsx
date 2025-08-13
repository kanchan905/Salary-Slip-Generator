import React, {useEffect} from 'react';
import { Grid, TextField } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { updatePensionField } from '../../../redux/slices/pensionSlice';
import { customRound } from 'utils/helpers';

const DeductionPension = () => {
  const dispatch = useDispatch();
  const { formData } = useSelector((state) => state.pension);



  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(updatePensionField({ name, value }));
  };

  // Calculate total deductions (including commutation amount)
  const totalDeductions = customRound([
    formData.income_tax,
    formData.recovery,
    formData.other,
    formData.commutation_amount,
  ].reduce((sum, val) => sum + (Number(val) || 0), 0));

 
  useEffect(() => {
    // Only dispatch if the calculated total is different from the one in the store
    if (formData.amount !== totalDeductions) {
      dispatch(updatePensionField({ name: 'amount', value: totalDeductions }));
    }
  }, [totalDeductions, formData.amount, dispatch]);

  const formatCurrency = (val) => (Number(val) || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div>
      <Grid container spacing={2}>
        <Grid item size={{ xs: 4 }}>
          <TextField label="Income Tax" name="income_tax" fullWidth value={formData.income_tax} onChange={handleChange} />
        </Grid>
        <Grid item size={{ xs: 4 }}>
          <TextField label="Recovery" name="recovery" fullWidth value={formData.recovery} onChange={handleChange} />
        </Grid>

        <Grid item size={{ xs: 4 }}>
          <TextField label="Other" name="other" fullWidth value={formData.other} onChange={handleChange} />
        </Grid>
        <Grid item size={{ xs: 4 }}>
          <TextField
            label="Description"
            name="description"
            fullWidth
            value={formData.description}
            onChange={handleChange}
          />
        </Grid>
        <Grid item size={{ xs: 4 }}>
          <TextField
            label="Commutation Amount"
            name="commutation_amount"
            fullWidth
            value={formData.commutation_amount}
            onChange={handleChange}
          />
        </Grid>
      </Grid>
      <div style={{ textAlign: 'right', marginTop: 16 }}>
        <span style={{ fontWeight: 'bold', color: '#d32f2f', fontSize: '1.1rem' }}>
          Total Deductions: ₹ {formatCurrency(totalDeductions)}
        </span>
        <div style={{ fontSize: '0.85rem', color: '#888' }}>
          Sum of all deductions (rounded as per rules)
        </div>
      </div>
    </div>
  );
};

export default DeductionPension;

