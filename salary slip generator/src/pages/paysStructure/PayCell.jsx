import React, { useEffect, useState } from 'react';
import {
  Button, Grid, IconButton, Paper,
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TextField, Typography,
  MenuItem, Select, FormControl, InputLabel,
  TablePagination
} from '@mui/material';
import { Edit, Save, Cancel } from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';

import {
  fetchPayLevel,
  fetchPayCell,
  addCellToAPI,
  updateCellToAPI
} from '../../redux/slices/levelCellSlice';

import { toast } from 'react-toastify';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

const PayMatrixCell = () => {
  const dispatch = useDispatch();
  const { levels, levelCount, matrixCells, cellCount, loading } = useSelector((state) => state.levelCells);

  const [selectedLevelId, setSelectedLevelId] = useState('');
  const [editingCellId, setEditingCellId] = useState(null);
  const [editedLevel, setEditedLevel] = useState('');
  const [editedIndex, setEditedIndex] = useState('');
  const [editedPay, setEditedPay] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [limit] = useState(100);

  useEffect(() => {
    dispatch(fetchPayLevel({ page: 1, limit: levelCount }));
    dispatch(fetchPayCell({ matrix_level_id: selectedLevelId, page: page + 1, limit: rowsPerPage }));
  }, [dispatch, selectedLevelId, page, limit]);
  const refreshCells = () => dispatch(fetchPayCell({ page: page + 1, limit: rowsPerPage }));

  const handleSaveEdit = async (cellId) => {
    try {
      await dispatch(updateCellToAPI({
        id: cellId,
        index: Number(editedIndex),
        amount: Number(editedPay),
        matrix_level_id: selectedLevelId,
      })).unwrap();
      toast.success("Cell updated successfully!");
      setEditingCellId(null);
      refreshCells();
    } catch (error) {
      toast.error("Failed to update cell.");
    }
  };

  const handleStartEdit = (cell) => {
    setEditingCellId(cell.id);
    setEditedLevel(cell.pay_matrix_level.name);
    setEditedIndex(cell.index);
    setEditedPay(cell.amount);
  };

  const handleCancelEdit = () => {
    setEditingCellId(null);
  };

  
  const handleChangePage = (event, newPage) => {
    console.log("CHange newPa",newPage);
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };


  const filteredCells = matrixCells.filter(cell => cell.matrix_level_id === Number(selectedLevelId));

  console.log("Matrix Cells:", matrixCells);
  console.log("Filtered Cells:", filteredCells.length);

  return (
    <Paper sx={{ p: 3, boxShadow: 'none' }}>
      <Typography variant="h6" mb={2}>Pay Matrix Cells</Typography>

      <FormControl fullWidth margin="normal">
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

      {selectedLevelId && (
        <>
          {/* Formik Form Start */}
          <Formik
            initialValues={{ cellIndex: '', basicPay: '' }}
            validationSchema={Yup.object({
              cellIndex: Yup.number().required('Cell index is required'),
              basicPay: Yup.number().required('Basic pay is required'),
            })}
            onSubmit={async (values, { resetForm }) => {
              try {
                await dispatch(addCellToAPI({
                  id: selectedLevelId,
                  index: Number(values.cellIndex),
                  amount: Number(values.basicPay)
                })).unwrap();
                toast.success("Cell added successfully!");
                refreshCells();
                resetForm();
              } catch (error) {
                toast.error("Failed to add cell.");
              }
            }}
          >
            {({ values, errors, touched, handleChange }) => (
              <Form>
                <Grid container spacing={2} mb={2}>
                  <Grid item xs={12} md={5}>
                    <TextField
                      fullWidth
                      name="cellIndex"
                      label="Cell Index"
                      type="number"
                      value={values.cellIndex}
                      onChange={handleChange}
                      error={touched.cellIndex && Boolean(errors.cellIndex)}
                      helperText={touched.cellIndex && errors.cellIndex}
                    />
                  </Grid>
                  <Grid item xs={12} md={5}>
                    <TextField
                      fullWidth
                      name="basicPay"
                      label="Basic Pay"
                      type="number"
                      value={values.basicPay}
                      onChange={handleChange}
                      error={touched.basicPay && Boolean(errors.basicPay)}
                      helperText={touched.basicPay && errors.basicPay}
                    />
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <Button
                      fullWidth
                      variant="contained"
                      style={{ background: "#004080" }}
                      sx={{ height: '100%' }}
                      type="submit"
                    >
                      Add Cell
                    </Button>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
          {/* Formik Form End */}

          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                <TableRow>
                  <TableCell><b>Sr.No.</b></TableCell>
                  <TableCell><b>Level</b></TableCell>
                  <TableCell><b>Cell/Index</b></TableCell>
                  <TableCell><b>Basic Pay</b></TableCell>
                  <TableCell><b>Actions</b></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={3}>Loading...</TableCell></TableRow>
                ) : (
                  filteredCells.map((cell, index) => (
                    <TableRow key={cell.id}>
                     <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                      <TableCell>
                        {editingCellId === cell.id ? (
                          <Select
                            value={editedLevel}
                            onChange={(e) => setEditedLevel(e.target.value)}
                            fullWidth
                          >
                            {levels.map((level) => (
                              <MenuItem key={level.id} value={level.id}>
                                {level.name}
                              </MenuItem>
                            ))}
                          </Select>
                        ) : (
                          cell.pay_matrix_level.name
                        )}
                      </TableCell>
                      <TableCell>
                        {editingCellId === cell.id ? (
                          <TextField
                            type="number"
                            value={editedIndex}
                            onChange={(e) => setEditedIndex(e.target.value)}
                          />
                        ) : cell.index}
                      </TableCell>
                      <TableCell>
                        {editingCellId === cell.id ? (
                          <TextField
                            type="number"
                            value={editedPay}
                            onChange={(e) => setEditedPay(e.target.value)}
                          />
                        ) : `₹ ${cell.amount}`}
                      </TableCell>
                      <TableCell>
                        {editingCellId === cell.id ? (
                          <>
                            <IconButton color="success" onClick={() => handleSaveEdit(cell.id)}><Save /></IconButton>
                            <IconButton color="warning" onClick={handleCancelEdit}><Cancel /></IconButton>
                          </>
                        ) : (
                          <IconButton color="primary" onClick={() => handleStartEdit(cell)}><Edit /></IconButton>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            <TablePagination
              rowsPerPageOptions={[5, 10, 20, 50]}
              component="div"
              count={cellCount}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
        </>
      )}
    </Paper>
  );
};

export default PayMatrixCell;
