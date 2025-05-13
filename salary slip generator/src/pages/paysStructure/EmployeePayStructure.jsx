import React, { useEffect, useState } from 'react';
import {
  Button,
  Grid,
  Paper,
  TextField,
  Typography,
  Box,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDispatch, useSelector } from 'react-redux';
import { addEmployeePayStructure, deleteEmployeePayStructure } from '../../redux/slices/levelSlice';
import {
  fetchPayLevel,
  fetchPayCell,
} from '../../redux/slices/levelCellSlice';



const EmployeePayStructures = () => {
  const dispatch = useDispatch();
  const employeePayStructures = useSelector((state) => state.levels.employeePayStructures);
  const { levels, matrixCells, loading } = useSelector((state) => state.levelCells);
  const [selectedLevelId, setSelectedLevelId] = useState('');
  const [selectedCellId, setSelectedCellId] = useState('');

  useEffect(() => {
    dispatch(fetchPayLevel());
    dispatch(fetchPayCell());
  },[])

  const [ form, setForm ] = useState({
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

  
  const filteredCells = matrixCells.filter(cell => cell.matrix_level_id === Number(selectedLevelId));
  
  console.log("Levels: ",selectedLevelId); 
  console.log("Matrix Cells: ",selectedCellId);
  return (
    <>
    <Typography variant="h6" mb={2}>Employee Pay Structure</Typography>
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2, boxShadow: 'none' }}>

      <FormControl fullWidth margin="normal" className='mb-3'>
        <InputLabel>Select Pay Level</InputLabel>
          <Select
            value={selectedLevelId}
            label="Select Pay Level"
            onChange={(e) => setSelectedLevelId(e.target.value)}
          >
          {levels.map((level) => (
            <MenuItem key={level.id} value={level.id}>
              {level.name}
            </MenuItem>
          ))}
          </Select>
      </FormControl>
    
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
            <FormControl fullWidth sx={{minWidth: 150 }}>
              <InputLabel id="select-pay-cell">Select Pay Cell</InputLabel>
              <Select
                labelId="select-pay-cell"
                id="cell_id"
                name="cell_id"
                value={selectedCellId}
                label="Select Pay Cell"
                onChange={(e) => setSelectedCellId(e.target.value)}
                required
              >
                {filteredCells.length === 0 ? (
                  <MenuItem disabled>Select Pay Level First</MenuItem>
                ) : (
                  filteredCells.map((cell) => (
                    <MenuItem key={cell.id} value={cell.id}>
                      {cell.index}
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>
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
          {/* <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Order Reference"
              name="order_reference"
              value={form.order_reference}
              onChange={handleChange}
              required
            />
          </Grid> */}
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