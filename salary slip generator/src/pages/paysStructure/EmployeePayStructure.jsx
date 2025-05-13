import React, { useEffect, useState } from 'react';
import {
  Button,
  Grid,
  Paper,
  TextField,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field } from 'formik';
import {
  fetchPayLevel,
  fetchPayCell,
} from '../../redux/slices/levelCellSlice';
import { fetchEmployees } from '../../redux/slices/employeeSlice';
import { addPayStructure, fetchPayStructure, updatePayStructure } from '../../redux/slices/payStructureSlice';
import { toast } from 'react-toastify';



const EmployeePayStructures = () => {
  const dispatch = useDispatch();
  const employeePayStructures = useSelector((state) => state.levels.employeePayStructures);
  const employees = useSelector((state) => state.employee.employees) || [];
  const { levels, matrixCells, loading } = useSelector((state) => state.levelCells);
  const [editingCellId, setEditingCellId] = useState(null);
  const { payStructure } = useSelector((state) => state.payStructure);
  const [ form, setForm ] = useState();
  const [selectedLevelId, setSelectedLevelId] = useState('');
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    dispatch(fetchPayLevel());
    dispatch(fetchPayCell());
    dispatch(fetchEmployees({page: 1, limit: 10, search: ""}));
    dispatch(fetchPayStructure({page: 1, limit: 10, search: ""}));
  },[dispatch])

  
  const filteredCells = matrixCells.filter(cell => cell.matrix_level_id === Number(selectedLevelId));

   const initialValues = editData || {
    pay_structure_id: Date.now(),
    emp_id: '',
    cell_id: '',
    commission: '',
    effective_from: '',
    effective_till: '',
    order_reference: ''
  };
  
  const handleSubmit = async (values, { resetForm }) => {
    try {
      if (editData) {
        const res = await dispatch(updatePayStructure(values)).unwrap();
        toast.success(res?.successMsg || "Pay Structure updated successfully");
      } else {
        const res = await dispatch(addPayStructure(values)).unwrap();
        toast.success(res?.successMsg || "Pay Structure added successfully");
      }

      resetForm();
      setEditData(null);
      setEditingCellId(null);

      // Refetch data after update
      dispatch(fetchPayStructure({ page: 1, limit: 10, search: "" }));
    } catch (error) {
      toast.error(error?.message || "Something went wrong");
    }
  };



  const handleEdit = (structure) => {
    setSelectedLevelId(
      matrixCells.find((c) => c.id === structure.cell_id)?.matrix_level_id || ''
    );
    setEditingCellId(structure);
  };

  console.log("pay Structure", payStructure);
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

        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
        >
          {({ values, handleChange, handleReset }) => (
            <Form>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth sx={{ minWidth: 170 }}>
                    <InputLabel id="emp_id">Select Employee</InputLabel>
                    <Select
                      labelId="emp_id"
                      name="emp_id"
                      value={values.emp_id}
                      onChange={handleChange}
                      required
                    >
                      {employees.map((emp) => (
                        <MenuItem key={emp.id} value={emp.id}>
                          {emp.first_name} {emp.last_name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth sx={{ minWidth: 180 }}>
                    <InputLabel id="cell_id">Select Pay Cell</InputLabel>
                    <Select
                      labelId="cell_id"
                      name="cell_id"
                      value={values.cell_id}
                      onChange={handleChange}
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
                    name="commission"
                    label="Commission"
                    value={values.commission}
                    onChange={handleChange}
                    type="number"
                    required
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    name="effective_from"
                    label="Effective From"
                    value={values.effective_from}
                    onChange={handleChange}
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    required
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    name="effective_till"
                    label="Effective Till"
                    value={values.effective_till}
                    onChange={handleChange}
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    required
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2} mt={3}>
                <Button
                  style={{ background: '#004080' }}
                  variant="contained"
                  type="submit"
                  endIcon={<SendIcon />}
                >
                  Add Pay Structure
                </Button>
              </Grid>
            </Form>
          )}
        </Formik>

        <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
          Existing Employee Pay Structures
        </Typography>

        <TableContainer component={Paper} variant="outlined">
          <Table>
            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
              <TableRow>
                <TableCell><b>Index</b></TableCell>
                <TableCell><b>Basic Pay</b></TableCell>
                <TableCell><b>Actions</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={3}>Loading...</TableCell></TableRow>
              ) : (
                payStructure.map((structure) => (
                  <TableRow key={structure.id}>
                    <TableCell>{structure.pay_matrix_cell?.index || '-'}</TableCell>
                    <TableCell>₹ {structure.pay_matrix_cell?.amount || '-'}</TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        onClick={() => handleEdit(structure)}
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>

          </Table>
        </TableContainer>
      </Paper>
  </>
  );
};

export default EmployeePayStructures;