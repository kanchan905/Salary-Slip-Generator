import React, { useState } from 'react';
import {
  Button,
  Grid,
  Paper,
  TextField,
  Typography,
  Box,
  IconButton
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDispatch, useSelector } from 'react-redux';
import { addEmployeePayStructure, deleteEmployeePayStructure } from '../../redux/slices/levelSlice';

const EmployeePayStructures = () => {
  const dispatch = useDispatch();
  const employeePayStructures = useSelector((state) => state.levels.employeePayStructures);

  const [form, setForm] = useState({
    pay_structure_id: Date.now(),
    employee_id: '',
    cell_id: '',
    commission: '',
    effective_from: '',
    effective_till: '',
    order_reference: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleAddPayStructure = (e) => {
    e.preventDefault();
    dispatch(addEmployeePayStructure(form));
    setForm({
      pay_structure_id: Date.now(),
      employee_id: '',
      cell_id: '',
      commission: '',
      effective_from: '',
      effective_till: '',
      order_reference: ''
    });
  };

  const handleDeletePayStructure = (id) => {
    dispatch(deleteEmployeePayStructure(id));
  };

  return (
    <>
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2, boxShadow: 'none' }}>
      <form onSubmit={handleAddPayStructure}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Employee ID"
              name="employee_id"
              value={form.employee_id}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Cell ID"
              name="cell_id"
              value={form.cell_id}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Commission"
              name="commission"
              value={form.commission}
              onChange={handleChange}
              type="number"
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Effective From"
              name="effective_from"
              value={form.effective_from}
              onChange={handleChange}
              type="date"
              InputLabelProps={{ shrink: true }}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Effective Till"
              name="effective_till"
              value={form.effective_till}
              onChange={handleChange}
              type="date"
              InputLabelProps={{ shrink: true }}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Order Reference"
              name="order_reference"
              value={form.order_reference}
              onChange={handleChange}
              required
            />
          </Grid>
        </Grid>
          <Grid container spacing={2} mt={4} mb={4}>
            <Button
             style={{background:"#004080"}}
              variant="contained"
              type="submit"
              endIcon={<SendIcon />}
            //   fullWidth
            >
              Add
            </Button>
          </Grid>
      </form>

      <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
        Existing Employee Pay Structures
      </Typography>

      {employeePayStructures?.map((structure) => (
        <Box key={structure.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography>{`ID: ${structure.pay_structure_id}, Employee ID: ${structure.employee_id}, Commission: ${structure.commission}`}</Typography>
          <IconButton color="error" onClick={() => handleDeletePayStructure(structure.pay_structure_id)}>
            <DeleteIcon />
          </IconButton>
        </Box>
      ))}
    </Paper>


</>
  );
};

export default EmployeePayStructures;