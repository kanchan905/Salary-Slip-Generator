import React, { useState } from 'react';
import {
  Button,
  Grid,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';


const AllowanceRates = () => {
  const [rates, setRates] = useState({
    da: '12',
    hra: '8',
    npa: '',
    transport: '',
    uniform: '',
  });

  const handleChange = (field) => (event) => {
    setRates((prev) => ({ ...prev, [field]: event.target.value }));
  };

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2, boxShadow: 0 }}>
      <Typography variant="h6" gutterBottom>
        Allowance Rates (%)
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="DA"
            value={rates.da}
            onChange={handleChange('da')}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="HRA"
            value={rates.hra}
            onChange={handleChange('hra')}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="NPA"
            placeholder="Enter NPA rate"
            value={rates.npa}
            onChange={handleChange('npa')}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Transport"
            placeholder="Enter Transport rate"
            value={rates.transport}
            onChange={handleChange('transport')}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Uniform"
            placeholder="Enter Uniform rate"
            value={rates.uniform}
            onChange={handleChange('uniform')}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} sx={{ display: 'flex'}} >
          <Button variant="contained" endIcon={<SendIcon />}>Send</Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default AllowanceRates;
