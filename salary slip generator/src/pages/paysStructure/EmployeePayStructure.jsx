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
  List,
  Autocomplete,
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
import { fetchPayCommisions } from '../../redux/slices/payCommision';
import { fetchPayLevelByCommission } from '../../redux/slices/levelSlice';
import { dateFormat } from 'utils/helpers';
import { Edit, FormatListBulleted, History } from '@mui/icons-material';



const EmployeePayStructures = () => {
  const dispatch = useDispatch();
  const employees = useSelector((state) => state.employee.employees) || [];
  const { matrixCells, loading } = useSelector((state) => state.levelCells);
  const { commissionLevels } = useSelector((state) => state.levels);
  const { matrixCells, loading } = useSelector((state) => state.levelCells);
  const { commissionLevels } = useSelector((state) => state.levels);
  const { payStructure, payStructureShow, totalCount } = useSelector((state) => state.payStructure);
  const { payCommissions } = useSelector((state) => state.payCommision);
  const [ selectedCommissionId, setSelectedCommissionId ] = useState('');
  const [selectedLevelId, setSelectedLevelId] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchText, setSearchText] = useState('');
  const [renderFunction, setRenderFunction] = useState(() => null);
  const [tableHead, setTableHead] = useState([
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
            "Added By",
            "Edited By"
          ],
          renderRow: (record, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td className='text-capitalize'>{record.employee?.first_name} {record.employee?.last_name}</td>
              <td>{record.pay_matrix_cell?.pay_matrix_level?.name || "NA"}</td>
              <td>{record.pay_matrix_cell.index} - {record.pay_matrix_cell.amount}</td>
              <td>{record.added_by?.name || "NA"} </td>
              <td>{record.edited_by?.name || "NA"}</td>
            </tr>
          ),
        };
      default:
        return { head: [], renderRow: () => null };
    }
  };
      default:
        return { head: [], renderRow: () => null };
    }
  };

  const filteredPayStructures = payStructure.filter((structure) => {
    const fullName = `${structure.employee?.first_name} ${structure.employee?.last_name}`.toLowerCase();
    return fullName.includes(searchText.toLowerCase());
  });



  const handleHistoryStatus = (id) => {
    dispatch(showPayStructure(id));
    toggleHistoryModal();
    toggleHistoryModal();
  };


  useEffect(() => {
    dispatch(fetchPayCommisions());
    dispatch(fetchPayCommisions());
    dispatch(fetchEmployees({ page: 1, limit: 40, search: "" }));
  }, [dispatch]);

  useEffect(() => {
    if (selectedCommissionId) {
      dispatch(fetchPayLevelByCommission(selectedCommissionId));
    }
  }, [dispatch, selectedCommissionId]);

  useEffect(() => {
    if (selectedCommissionId) {
      dispatch(fetchPayLevelByCommission(selectedCommissionId));
    }
  }, [dispatch, selectedCommissionId]);

  useEffect(() => {
    if (selectedLevelId) {
      dispatch(fetchPayCell({ matrix_level_id: Number(selectedLevelId), page: 1, limit: 1000 }));
    }
  }, [dispatch, selectedLevelId]);

  useEffect(() => {
    dispatch(fetchPayStructure({ page: page + 1, limit: rowsPerPage, search: "" }));
    dispatch(fetchPayStructure({ page: page + 1, limit: rowsPerPage, search: "" }));
  }, [dispatch, page, rowsPerPage]);

  useEffect(() => {
    if (payStructureShow && payStructureShow.history) {
      const config = getTableConfig("cell");
      setTableHead(config.head);
      setRenderFunction(() => config.renderRow);
      setHistoryRecord(payStructureShow.history);
    }
  }, [payStructureShow]);

  useEffect(() => {
    if (payStructureShow && payStructureShow.history) {
      const config = getTableConfig("cell");
      setTableHead(config.head);
      setRenderFunction(() => config.renderRow);
      setHistoryRecord(payStructureShow.history);
    }
  }, [payStructureShow]);

  const filteredCells = matrixCells.filter(cell => cell.matrix_level_id === Number(selectedLevelId));

  const initialValues = {
    pay_structure_id: editData?.pay_structure_id || Date.now(),
    employee_id: editData?.employee_id || '',
    commission_id: editData?.commission_id || selectedCommissionId || '',
    level_id: editData?.pay_matrix_cell?.matrix_level_id || selectedLevelId || '',
    matrix_cell_id: editData?.matrix_cell_id || '',
    effective_from: editData?.effective_from || '',
    effective_till: editData?.effective_till || '',
  };


  const handleSubmit = async (values, { resetForm }) => {
    try {
      const payload = {
        ...values,
        employee_id: values.employee_id || '',
        commission_id: values.commission_id || selectedCommissionId,
        level_id: values.level_id || selectedLevelId,
      };

      if (editData) {
        const res = await dispatch(updatePayStructure({ id: editData.id, values: payload })).unwrap();
        toast.success(res?.successMsg || "Pay Structure updated successfully");
        setEditMode(false);
      } else {
        console.log("Adding new pay structure with payload:", payload);
        const res = await dispatch(addPayStructure(payload)).unwrap();
        toast.success(res?.successMsg || "Pay Structure added successfully");
      }

      resetForm();
      setEditData(null);
      setSelectedCommissionId('');
      setSelectedLevelId('');
      dispatch(fetchPayStructure({ page: 1, limit: rowsPerPage, search: "" }));

    } catch (error) {
      toast.error(error?.message || error.errorMsg || "Something went wrong");
    }
  };


  const handleEdit = (structure) => {
    setEditMode(true);
    setSelectedCommissionId(structure.pay_matrix_cell.pay_matrix_level.pay_commission_id);  // for consistency
    setSelectedLevelId(structure.pay_matrix_cell.matrix_level_id);
    setEditData(structure);
  };


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };






  console.log("Levels:", commissionLevels);

  return (
    <>
      {/* <Typography variant="h6" mb={2}>Employee Pay Structure</Typography> */}
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2, boxShadow: 'none' }}>
        <Typography variant="h4" sx={{ mb: 2, fontWeight: 800 }}>
          Create Employee Pay Structures 
        </Typography>

        <Formik
          initialValues={initialValues}
          enableReinitialize
          onSubmit={handleSubmit}
        >
          {({ values, handleChange, setFieldValue }) => (
          {({ values, handleChange, setFieldValue }) => (
            <Form>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} size={12}>
                  <TextField
                    select
                    name="employee_id"
                    label="Employee"
                    fullWidth
                    value={values.employee_id}
                    onChange={handleChange}
                  >
                <Grid item xs={12} sm={6} size={12}>
                  <TextField
                    select
                    name="employee_id"
                    label="Employee"
                    fullWidth
                    value={values.employee_id}
                    onChange={handleChange}
                  >
                    {employees.map((emp) => (
                      <MenuItem key={emp.id} value={emp.id} className="text-capitalize">
                      <MenuItem key={emp.id} value={emp.id} className="text-capitalize">
                        {emp.first_name} {emp.last_name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12} sm={6} size={4}>
                  <TextField
                    select
                    name="commission_selection"
                    label="Select Commission"
                    fullWidth
                    value={values.commission_id}
                    onChange={(e) => {
                      setFieldValue("commission_id", e.target.value);
                      setFieldValue("level_id", '');
                      setSelectedCommissionId(e.target.value);
                    }}
                  >
                    {payCommissions.map((cmn) => (
                      <MenuItem key={cmn.id} value={cmn.id}>{cmn.name}</MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12} sm={6} size={4}>
                   <TextField
                    select
                    name="level_selection"
                    label="Select Level"
                    fullWidth
                    value={values.level_id}
                    onChange={(e) => setSelectedLevelId(e.target.value)}
                  >
                    {commissionLevels.map((level) => (
                      <MenuItem key={level.id} value={level.id}>{level.name}</MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12} sm={6} size={4}>
                  <TextField
                    select
                    name="matrix_cell_id"
                    label="Select Pay Cell"
                    fullWidth
                    value={values.matrix_cell_id}
                    onChange={handleChange}
                    required
                  >
                    {filteredCells.length === 0 ? (
                      <MenuItem disabled>Select Level First</MenuItem>
                    ) : (
                      filteredCells.map((cell) => (
                        <MenuItem key={cell.id} value={cell.id}>
                          {cell.index} - {cell.amount}
                        </MenuItem>
                      ))
                    )}
                      <MenuItem disabled>Select Level First</MenuItem>
                    ) : (
                      filteredCells.map((cell) => (
                        <MenuItem key={cell.id} value={cell.id}>
                          {cell.index} - {cell.amount}
                        </MenuItem>
                      ))
                    )}
                  </TextField>
                </Grid>


                <Grid item xs={12} sm={6} size={4}>
                <Grid item xs={12} sm={6} size={4}>
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

                <Grid item xs={12} sm={6} size={4}>
                <Grid item xs={12} sm={6} size={4}>
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

              <Grid container spacing={2} mt={3} size={4}>
              <Grid container spacing={2} mt={3} size={4}>
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
                      setSelectedCommissionId('');
                      setSelectedLevelId('');
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
          <hr />
        <Typography variant="h4" sx={{ mt: 4, mb: 2, fontWeight: 800 }}>
          Existing Employee Pay Structures
        </Typography>

        <Autocomplete
          freeSolo
          disableClearable
          options={payStructure.map(
            (option) => option.employee?.first_name + ' ' + option.employee?.last_name
          )}
          onInputChange={(event, newInputValue) => setSearchText(newInputValue)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search employee by name"
              margin="normal"
              variant="outlined"
              InputProps={{
                ...params.InputProps,
                type: 'search',
              }}
            />
          )}
        />


        <TableContainer component={Paper} variant="outlined">
          <Table>
            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
              <TableRow>
                <TableCell><b>Sr. No.</b></TableCell>
                <TableCell><b>Employee Code</b></TableCell>
                <TableCell><b>Employee</b></TableCell>
                <TableCell><b>Level</b></TableCell>
                <TableCell><b>Cell ID</b></TableCell>
                <TableCell><b>Effective Date</b></TableCell>
                <TableCell><b>Actions</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={6}>Loading...</TableCell></TableRow>
                <TableRow><TableCell colSpan={6}>Loading...</TableCell></TableRow>
              ) : (
                filteredPayStructures.map((structure, index) => (
                  <TableRow key={structure.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{structure.employee?.employee_code || "-"}</TableCell>
                    <TableCell className='text-capitalize'>
                      {structure.employee?.first_name} {structure.employee?.last_name}
                    </TableCell>
                    <TableCell>
                      {structure?.pay_matrix_cell?.matrix_level_id < 10 ? `0${structure?.pay_matrix_cell?.matrix_level_id}` : structure?.pay_matrix_cell?.matrix_level_id}
                    </TableCell>
                    <TableCell>
                      {structure?.pay_matrix_cell?.index < 10 ? `0${structure?.pay_matrix_cell?.index}` : structure?.pay_matrix_cell?.index} - {structure?.pay_matrix_cell?.amount}
                    </TableCell>
                    <TableCell>
                      {structure?.effective_from ? dateFormat(structure.effective_from) : 'N/A'} - {structure?.effective_till ? dateFormat(structure?.effective_till) : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => handleEdit(structure)}
                        style={{ marginRight: '8px' }}
                        startIcon={<Edit/>}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="contained"
                        color="warning"
                        size="small"
                        startIcon={<History/>}
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
