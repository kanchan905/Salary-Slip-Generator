import React, { useState } from 'react';
import {
  Button,
  Grid,
  Paper,
  TextField,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
  IconButton
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDispatch, useSelector } from 'react-redux';
import { setAllowanceRate, deleteAllowanceRate } from '../../redux/slices/levelSlice';

const ALLOWANCE_KEYS = ['da', 'hra', 'npa', 'transport', 'uniform'];

const AllowanceRates = () => {
  const dispatch = useDispatch();
  const levels = useSelector((state) => state.levels.levels);

  const [selectedLevelId, setSelectedLevelId] = useState('');

  const [localRates, setLocalRates] = useState({});

  const handleLevelChange = (e) => {
    const levelId = e.target.value;
    setSelectedLevelId(levelId);
    const level = levels.find((lvl) => lvl.id === levelId);
    setLocalRates(level?.allowances || {});
  };

  const handleChange = (key) => (e) => {
    const value = e.target.value;
    setLocalRates((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    if (!selectedLevelId) return;
    for (const key of Object.keys(localRates)) {
      dispatch(setAllowanceRate({ levelId: selectedLevelId, key, value: localRates[key] }));
    }
  };

  const handleDeleteRate = (key) => {
    dispatch(deleteAllowanceRate({ levelId: selectedLevelId, key }));
    setLocalRates((prev) => {
      const updated = { ...prev };
      delete updated[key];
      return updated;
    });
  };

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2, boxShadow: 'none' }}>
      <Typography variant="h6" gutterBottom>
        Allowance Rates Per Level
      </Typography>

      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Select Level</InputLabel>
        <Select value={selectedLevelId} label="Select Level" onChange={handleLevelChange}>
          {levels.map((lvl) => (
            <MenuItem key={lvl.id} value={lvl.id}>
              {lvl.levelName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {selectedLevelId && (
        <>
          <Grid container spacing={2}>
            {ALLOWANCE_KEYS.map((key) => (
              <Grid item xs={12} sm={6} key={key}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TextField
                    fullWidth
                    label={key.toUpperCase()}
                    placeholder={`Enter ${key.toUpperCase()} rate`}
                    value={localRates[key] || ''}
                    onChange={handleChange(key)}
                    variant="outlined"
                    type="number"
                  />
                  {localRates[key] && (
                    <IconButton color="error" onClick={() => handleDeleteRate(key)}>
                      <DeleteIcon />
                    </IconButton>
                  )}
                </Box>
              </Grid>
            ))}
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Button
                variant="contained"
                onClick={handleSave}
                endIcon={<SendIcon />}
                fullWidth
              >
                Save Allowance Rates
              </Button>
            </Grid>
          </Grid>
        </>
      )}
    </Paper>
  );
};

export default AllowanceRates;
