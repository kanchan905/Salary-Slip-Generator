import React, { useEffect, useState } from 'react';
import { Autocomplete, Grid, IconButton, MenuItem, TextField, Typography, Button } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { updatePensionField, addArrear, updateArrear, removeArrear } from '../../../redux/slices/pensionSlice';
import { fetchPensionRelated } from '../../../redux/slices/pensionRelatedSlice';
import { fetchBankDetails } from '../../../redux/slices/bankSlice';
import { fetchDearnessRelief } from '../../../redux/slices/dearnessRelief';
import { months, customRound } from 'utils/helpers';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';


const status = ["Initiated", "Approved", "Disbursed"];
// Define the available arrear types in a constant
const ARREAR_TYPES = [
  'Pay Arrear',
  'Commutational Arrear',
  'Additional Pension Arrear',
  'Medical Arrear',
  'DA Arrear',
  'Other'
];


const MonthlyPension = ({ pensioners, mode }) => {
  const [dearnessAmount, setDearnessAmount] = useState(0);
  const dispatch = useDispatch();
  const { formData, dr_amount_overridden } = useSelector((state) => state.pension);
  const { pensionRelated } = useSelector((state) => state.info);
  const [selectedPensionerId, setSelectedPensionerId] = useState('');
  const { bankdetails } = useSelector((state) => state.bankdetail);
  const { dearness } = useSelector((state) => state.dearnessRelief);
  // let netPayable = null;

  // Prefill processing date with the current date
  useEffect(() => {
    if (!formData.processing_date) {
      const today = dayjs().format('YYYY-MM-DD');
      dispatch(updatePensionField({ name: 'processing_date', value: today }));
    }
  }, [formData.processing_date, dispatch]);

  // Sync selectedPensionerId with formData.pensioner_id
  useEffect(() => {
    if (formData.pensioner_id && formData.pensioner_id !== selectedPensionerId) {
      setSelectedPensionerId(formData.pensioner_id);
    }
  }, [formData.pensioner_id]);

  useEffect(() => {
    if (selectedPensionerId) {
      dispatch(fetchPensionRelated({ page: 1, limit: 1000 }))
      dispatch(fetchBankDetails({ page: '1', limit: '1000', id: selectedPensionerId }));
      dispatch(fetchDearnessRelief());
    }
  }, [dispatch, selectedPensionerId]);

  useEffect(() => {
    // Prefill current month and year if not already set
    if (!formData.month) {
      const currentMonth = (dayjs().month() + 1).toString().padStart(2, '0');
      dispatch(updatePensionField({ name: 'month', value: currentMonth }));
    }
    if (!formData.year) {
      const currentYear = dayjs().year().toString();
      dispatch(updatePensionField({ name: 'year', value: currentYear }));
    }
  }, [dispatch, formData.month, formData.year]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(updatePensionField({ name, value }));
    if (name === 'pension_related_info_id') {
      // Find the record corresponding to the NEW value
      const selectedRecord = (pensionRelated || []).find(info => info.id === value && info.is_active) || {};

      // Dispatch updates for all dependent fields
      dispatch(updatePensionField({ name: 'basic_pension', value: Number(selectedRecord.basic_pension) || 0 }));
      dispatch(updatePensionField({ name: 'additional_pension', value: Number(selectedRecord.additional_pension) || 0 }));
      dispatch(updatePensionField({ name: 'medical_allowance', value: Number(selectedRecord.medical_allowance) || 0 }));
      dispatch(updatePensionField({ name: 'commutation_amount', value: Number(selectedRecord?.commutation_amount) || 0 }));
    }
  };

const drHandleChange = (e) => {
  const { name, value } = e.target;
  dispatch(updatePensionField({ name, value }));
}




useEffect(() => {
    const basic = Number(formData.basic_pension) || 0;
    const additional = Number(formData.additional_pension) || 0;
    const medical = Number(formData.medical_allowance) || 0;
    
    // Recalculate DR Amount when dr_id or related fields change
    const selectedDR = (dearness || []).find(dr => dr.id === formData.dr_id);
    const drPercentage = selectedDR ? Number(selectedDR.dr_percentage) : 0;
    const calculatedDrAmt = customRound(((basic + additional) * drPercentage) / 100);
    
    if (formData.dr_amount !== calculatedDrAmt) {
      dispatch(updatePensionField({ name: 'dr_amount', value: Number(dr_amount_overridden ? formData.dr_amount : calculatedDrAmt) }));
    }

    const totalArrears = (formData.arrears || []).reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    const netPayable = customRound(basic + additional + medical + (Number(formData.dr_amount) || 0) + totalArrears);

    if (formData.total_pension !== netPayable) {
      dispatch(updatePensionField({ name: 'total_pension', value: netPayable }));
    }
  }, [formData.basic_pension, formData.additional_pension, formData.medical_allowance, formData.dr_id, formData.arrears, dearness, dispatch]);

  return (
    <div>
      <Grid container spacing={2}>
        <Grid size={{ xs: 4 }}>
          <Autocomplete
            options={pensioners}
            getOptionKey={(option) => option.id}
            getOptionLabel={(option) =>
              `${option?.name || "NA"} - (${option?.user?.employee_code})`
            }
            value={pensioners.find(p => p.id === formData.pensioner_id) || null}
            onChange={(_, newValue) => {
              const newId = newValue ? newValue.id : null;
              setSelectedPensionerId(newId);
              dispatch(updatePensionField({ name: 'pensioner_id', value: newId }));
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                required
                label="Pensioner"
                name="pensioner_id"
                fullWidth
              />
            )}
            isOptionEqualToValue={(option, value) => option.id === value.id}
          />
        </Grid>

        <Grid item size={{ xs: 4 }}>
          <TextField
            select
            required
            name="pensioner_bank_id"
            label="Pensioner Bank"
            value={formData.pensioner_bank_id}
            fullWidth
            onChange={handleChange}
          >
            {(bankdetails || [])
              .filter(bank => bank.pensioner_id === selectedPensionerId && bank.is_active)
              .map((bank) => (
                <MenuItem key={bank.id} value={bank.id}>
                  {bank.bank_name} - {bank.account_no}
                </MenuItem>
              ))}
          </TextField>
        </Grid>

        <Grid item size={{ xs: 4 }}>
          <TextField
            select
            required
            name="pension_related_info_id"
            label="Pension Info"
            value={formData.pension_related_info_id}
            fullWidth
            onChange={handleChange}
          >
            {(pensionRelated || [])
              .filter(info => info.pensioner_id === selectedPensionerId && info.is_active)
              .map((info) => (
                <MenuItem key={info.id} value={info.id}>
                  {'Pension'} - {info.basic_pension}
                </MenuItem>
              ))}
          </TextField>
        </Grid>

        <Grid item size={{ xs: 4 }}>
          <TextField name="basic_pension" label="Basic Pension" fullWidth value={formData.basic_pension} onChange={handleChange} />
        </Grid>


        <Grid item size={{ xs: 4 }}>
          <TextField name="additional_pension" label="Additional Pension" fullWidth value={formData.additional_pension} onChange={handleChange} />
        </Grid>

        <Grid item size={{ xs: 4 }}>
          <TextField name="medical_allowance" label="Medical Allowance" fullWidth value={formData.medical_allowance} onChange={handleChange} />
        </Grid>

        <Grid item size={{ xs: 4 }}>
          <TextField
            select
            required
            name="dr_id"
            label="DR Rate%"
            value={formData.dr_id}
            fullWidth
            onChange={handleChange}
          >
            {dearness.map((dear) => (
              <MenuItem key={dear.id} value={dear.id}>
                {dear.dr_percentage}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item size={{ xs: 4 }}>
          <TextField name="dr_amount" label="DR Amount" fullWidth value={formData.dr_amount} onChange={drHandleChange} />
        </Grid>


        <Grid size={{ xs: 4 }} >
          <TextField
            select
            required
            name="month"
            label="Month"
            value={formData.month}
            fullWidth
            onChange={handleChange}
            
          >
            {months.map((month) => (
              <MenuItem key={month.value} value={month.value}>
                {month.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item size={{ xs: 4 }}>
          <TextField
            label="Year*"
            name="year"
            fullWidth
            value={formData.year}
            onChange={handleChange}
            
          />
        </Grid>

        <Grid item size={{ xs: 4 }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Processing Date*"
              format="DD-MM-YYYY"
              name="processing_date"
              value={formData.processing_date ? dayjs(formData.processing_date) : null}
              onChange={(date) => {
                const formatted = date ? dayjs(date).format('YYYY-MM-DD') : '';
                dispatch(updatePensionField({ name: "processing_date", value: formatted }))
              }}
              slotProps={{
                textField: {
                  fullWidth: true,
                  name: 'processing_date',
                },
              }}
            />
          </LocalizationProvider>
        </Grid>


        <Grid size={{ xs: 4 }} >
          <TextField select required name="status" label="Status" value={formData.status} fullWidth onChange={handleChange} >
            {status.map((stats) => (
              <MenuItem key={stats} value={stats}>
                {stats}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item size={{ xs: 4 }}>
          <TextField label="Remarks" name="remarks" fullWidth value={formData.remarks} onChange={handleChange} />
        </Grid>
      </Grid>


      {/* --- DYNAMIC ARREARS SECTION --- */}
      <Grid item size={{ xs: 12 }} marginTop={'20px'}>
        <Typography variant="h3" gutterBottom>Additional Arrears</Typography>
      </Grid>
      {formData.arrears.map((arrear, index) => (
        <Grid item xs={12} container spacing={2} key={index} alignItems="center" marginBottom={'10px'}>
          <Grid item size={{ xs: 12, md: 5 }}>
            <TextField
              select
              label={`Arrear Type ${index + 1}`}
              value={arrear.type}
              onChange={(e) => dispatch(updateArrear({ index, name: 'type', value: e.target.value }))}
              fullWidth
            >
              {ARREAR_TYPES.map(type => <MenuItem key={type} value={type}>{type}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item size={{ xs: 9, md: 5 }}>
            <TextField
              type="text"
              label={`Arrear Amount ${index + 1}`}
              value={arrear.amount}
              onChange={(e) => dispatch(updateArrear({ index, name: 'amount', value: e.target.value }))}
              fullWidth
            />
          </Grid>
          <Grid item size={{ xs: 3, md: 2 }}>
            <IconButton onClick={() => dispatch(removeArrear(index))} color="error">
              <DeleteIcon />
            </IconButton>
          </Grid>
        </Grid>
      ))}
      <Grid item size={{ xs: 12 }} marginTop={'10px'}>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => dispatch(addArrear())}
        >
          Add Arrear
        </Button>
      </Grid>

      <div style={{ textAlign: 'right', marginTop: 16 }}>
        <span style={{ fontWeight: 'bold', color: '#1976d2', fontSize: '1.1rem' }}>
          Total Pension: ₹ {formData.total_pension}
        </span>
        <div style={{ fontSize: '0.85rem', color: '#888' }}>
          Sum of Basic, Additional Pension, and DR (rounded as per rules)
        </div>
      </div>
    </div>
  );
};

export default MonthlyPension;