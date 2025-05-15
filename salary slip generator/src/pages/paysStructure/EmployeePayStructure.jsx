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
  TableBody,
  Pagination
} from '@mui/material';
import { toast } from 'react-toastify';
import SendIcon from '@mui/icons-material/Send';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field } from 'formik';
import { fetchEmployees } from '../../redux/slices/employeeSlice';
import {
  fetchPayLevel,
  fetchPayCell,
} from '../../redux/slices/levelCellSlice';
import { 
  addPayStructure, 
  fetchPayStructure, 
  updatePayStructure 
} from '../../redux/slices/payStructureSlice';
import { PaginationItem, PaginationLink } from 'reactstrap';



const EmployeePayStructures = () => {
  const dispatch = useDispatch();
  // const employeePayStructures = useSelector((state) => state.levels.employeePayStructures);
  const employees = useSelector((state) => state.employee.employees) || [];
  const { levels, matrixCells, loading } = useSelector((state) => state.levelCells);
  const { payStructure } = useSelector((state) => state.payStructure);
  const [selectedLevelId, setSelectedLevelId] = useState('');
  const [editData, setEditData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    dispatch(fetchPayLevel());
    dispatch(fetchPayCell());
    dispatch(fetchEmployees({page: 1, limit: 10, search: ""}));
    dispatch(fetchPayStructure({page: currentPage, limit: rowsPerPage, search: ""}));
  },[dispatch])

  
  const filteredCells = matrixCells.filter(cell => cell.matrix_level_id === Number(selectedLevelId));

   const initialValues = editData || {
    pay_structure_id: Date.now(),
    employee_id: editData ? editData?.employee_id : '',
    matrix_cell_id: editData ? editData?.matrix_cell_id : '',
    commission: '',
    effective_from: '',
    effective_till: '',
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

      // Refetch data after update
      dispatch(fetchPayStructure({ page: 1, limit: 10, search: "" }));
    } catch (error) {
      toast.error(error?.message || "Something went wrong");
    }
  };

  const handleEdit = (structure) => {
    setSelectedLevelId(
      matrixCells.find((c) => c.id === structure.matrix_cell_id)?.matrix_level_id || ''
    );
    setEditData(structure);
  };

  
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

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
          enableReinitialize
          onSubmit={handleSubmit}
        >
          {({ values, handleChange, handleReset }) => (
            <Form>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth sx={{ minWidth: 170 }}>
                    <InputLabel id="employee_id">Select Employee</InputLabel>
                    <Select
                      labelId="employee_id"
                      name="employee_id"
                      value={values.employee_id}
                      onChange={handleChange}
                      required
                    >
                      {employees.map((emp) => (
                        <MenuItem key={emp.id} className='text-capitalize' value={emp.id}>
                          {emp.first_name} {emp.last_name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth sx={{ minWidth: 180 }}>
                    <InputLabel id="matrix_cell_id">Select Pay Cell</InputLabel>
                    <Select
                      labelId="matrix_cell_id"
                      name="matrix_cell_id"
                      value={values.matrix_cell_id}
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
                  {editData ? 'Update' : 'Add'} Pay Structure
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
                <TableCell><b>Employee</b></TableCell>
                <TableCell><b>Cell ID</b></TableCell>
                <TableCell><b>Commission</b></TableCell>
                <TableCell><b>Actions</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={3}>Loading...</TableCell></TableRow>
              ) : (
                payStructure.map((structure, index) => (
                  <TableRow key={structure.id}>
                    <TableCell>{index + 1 || '-'}</TableCell>
                    <TableCell className='text-capitalize'>{structure.employee.first_name || '-'} {structure.employee.last_name}</TableCell>
                    <TableCell>{structure?.pay_matrix_cell?.index || '-'}</TableCell>
                    <TableCell>₹ {structure?.commission || '-'}</TableCell>
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

        {/* <Box display="flex" justifyContent="center" mt={2}>
          {[...Array(payStructure?.total_count || 1)].map((_, i) => (
            <PaginationItem key={i} active={i + 1 === currentPage}>
              <PaginationLink
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage(i + 1);
                }}
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}

          <PaginationItem disabled={currentPage >= payStructure?.total_count}>
            <PaginationLink
              next
              onClick={(e) => {
                e.preventDefault();
                if (currentPage < payStructure?.total_count) setCurrentPage(currentPage + 1);
              }}
            />
          </PaginationItem>
        </Box> */}
      </Paper>
  </>
  );
};

export default EmployeePayStructures;