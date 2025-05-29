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
  TablePagination,
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
  showPayStructure, 
  updatePayStructure 
} from '../../redux/slices/payStructureSlice';
import HistoryModal from 'Modal/HistoryModal';



const EmployeePayStructures = () => {
  const dispatch = useDispatch();
  // const employeePayStructures = useSelector((state) => state.levels.employeePayStructures);
  const employees = useSelector((state) => state.employee.employees) || [];
  const { levels, matrixCells, loading } = useSelector((state) => state.levelCells);
  const { payStructure, payStructureShow, totalCount } = useSelector((state) => state.payStructure);
  const [ selectedLevelId, setSelectedLevelId ] = useState('');
  const [ editMode, setEditMode ] = useState(false);
  const [ editData, setEditData ] = useState(null);
  const [ page, setPage ] = useState(0);
  const [ rowsPerPage, setRowsPerPage ] = useState(5);
  const [ renderFunction, setRenderFunction ] = useState(() => null);
  const [ tableHead, setTableHead ] = useState([
    "Sr. No.",
    "Head 1",
    "Head 2",
    "Head 3",
    "Head 4",
    "Head 5",
    "Head 6",
  ]);
  const [historyRecord, setHistoryRecord] = useState([]);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const toggleHistoryModal = () => setIsHistoryModalOpen(!isHistoryModalOpen);
  
  const getTableConfig = (type) => {
    switch (type) {
      case "cell":
        return {
          head: [
            "Sr. No.",
            "Employee Name",
            "Pay Level",
            "Cell Index - Amount",
            "Comission",
            "Added By",
            "Edited By"
          ],
          renderRow: (record, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td className='text-capitalize'>{record.employee?.first_name} {record.employee?.last_name}</td>
              <td>{record.pay_matrix_cell?.pay_matrix_level?.name || "NA"}</td>
              <td>{record.pay_matrix_cell.index} - {record.pay_matrix_cell.amount}</td>
              <td>{record.commission || "NA"}</td>
              <td>{record.added_by?.name || "NA"} </td>
              <td>{record.edited_by?.name || "NA"}</td>
            </tr>
          ),
        };
        // You can add more.
        default:
          return { head: [], renderRow: () => null };
      }
    };

  
  // Status History handlers
  const handleHistoryStatus = (id) => {
    dispatch(showPayStructure(id));
    toggleHistoryModal(); // Open the modal immediately (or you can delay until data loads if preferred)
  };
    
    
  useEffect(() => {
    if (payStructureShow && payStructureShow.history) {
      const config = getTableConfig("cell");
      setHistoryRecord(payStructureShow.history);
      setTableHead(config.head);
      setRenderFunction(() => config.renderRow);
    }
  }, [payStructureShow]);
    

  useEffect(() => {
    dispatch(fetchPayLevel());
    dispatch(fetchEmployees({ page: 1, limit: 40, search: "" }));
  }, [dispatch]);

  useEffect(() => {
    if (selectedLevelId) {
      dispatch(fetchPayCell({ matrix_level_id: Number(selectedLevelId), page: 1, limit: 1000 }));
    }
  }, [dispatch, selectedLevelId]);

  useEffect(() => {
    dispatch(fetchPayStructure({ page: page + 1 , limit: rowsPerPage, search: "" }));
  }, [dispatch, page, rowsPerPage]);


  
  const filteredCells = matrixCells.filter(cell => cell.matrix_level_id === Number(selectedLevelId));

  const initialValues = {
    pay_structure_id: editData?.pay_structure_id || Date.now(),
    employee_id: editData?.employee_id || '',
    matrix_cell_id: editData?.matrix_cell_id || '',
    commission: editData?.commission || '',
    effective_from: editData?.effective_from || '',
    effective_till: editData?.effective_till || '',
  };

  
  const handleSubmit = async (values, { resetForm }) => {
    try {
      if (editData) {
        const res = await dispatch(updatePayStructure({ id: editData.id, values })).unwrap();
        toast.success(res?.successMsg || "Pay Structure updated successfully");
        setEditMode(false);
      } else {
        const res = await dispatch(addPayStructure(values)).unwrap();
        toast.success(res?.successMsg || "Pay Structure added successfully");
      }

      resetForm();
      setEditData(null);

      // Refetch data after update
      dispatch(fetchPayStructure({ page: 1, limit: rowsPerPage, search: "" }));
    } catch (error) {
      toast.error(error?.message || "Something went wrong");
    }
  };

  const handleEdit = (structure) => {
    setEditMode(true);
    setSelectedLevelId(structure.pay_matrix_cell.matrix_level_id);
    setEditData(structure);
  };
  
  const handleChangePage = (event, newPage) => {
    console.log("CHange newPa",newPage);
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
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
                {level.name < 10 ? `0${level.name}` : level.name}
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
                <Grid item xs={12} sm={6} sx={{ minWidth: 180 }}>
                  <TextField select name="employee_id" label="Employee" className='text-capitalize' fullWidth value={values.employee_id} onChange={handleChange}>
                    {employees.map((emp) => (
                      <MenuItem key={emp.id} className='text-capitalize' value={emp.id}>
                        {emp.first_name} {emp.last_name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6} sx={{ minWidth: 180 }}>
                  <TextField select name="matrix_cell_id" label="Select Pay Cell" fullWidth value={values.matrix_cell_id} onChange={handleChange}>
                    {filteredCells.length === 0 ? (
                        <MenuItem disabled>Select Pay Level First</MenuItem>
                      ) : (
                        filteredCells.map((cell) => (
                          <MenuItem key={cell.id} value={cell.id}>
                          {cell.index < 10 ? `0${cell.index}` : cell.index} - {cell.amount}
                          </MenuItem>
                        ))
                      )}
                  </TextField>
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
                  {editMode ? 'Update' : 'Add'} Pay Structure
                </Button>
                {editMode && (
                    <Button
                        type="button"
                        color="secondary"
                        onClick={() => {
                          setEditData(null);
                          setEditMode(false);
                        }}
                    >
                        Cancel
                    </Button>
                )}
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
                <TableCell><b>Level</b></TableCell>
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
                    <TableCell>{ structure?.pay_matrix_cell?.matrix_level_id < 10 ? `0${structure?.pay_matrix_cell?.matrix_level_id}` : structure?.pay_matrix_cell?.matrix_level_id || '-'}</TableCell>
                    <TableCell>{structure?.pay_matrix_cell?.index < 10 ? `0${structure?.pay_matrix_cell?.index}` : structure?.pay_matrix_cell?.index || '-'} - {structure?.pay_matrix_cell?.amount}</TableCell>
                    <TableCell>₹ {structure?.commission || '-'}</TableCell>
                    <TableCell>
                      <Button
                      className='mr-2'
                        variant="outlined"
                        color="primary"
                        size="small"
                        onClick={() => handleEdit(structure)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outlined"
                        color="warning"
                        size="small"
                        onClick={() => handleHistoryStatus(structure?.id)}
                      >
                        History
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>

          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 20, 50]}
          component="div"
          count={totalCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <HistoryModal
        isOpen={isHistoryModalOpen}
        toggle={toggleHistoryModal}
        tableHead={tableHead}
        historyRecord={historyRecord}
        renderRow={renderFunction}
      />
  </>
  );
};

export default EmployeePayStructures;