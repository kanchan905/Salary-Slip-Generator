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
  capitalize,
} from '@mui/material';
import { toast } from 'react-toastify';
import SendIcon from '@mui/icons-material/Send';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field } from 'formik';
import { fetchEmployees } from '../../redux/slices/employeeSlice';
import {
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
import { Edit, History } from '@mui/icons-material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { getMonthName } from 'utils/helpers';


const EmployeePayStructures = () => {
  const dispatch = useDispatch();
  const employees = useSelector((state) => state.employee.employees) || [];
  const { matrixCells, loading } = useSelector((state) => state.levelCells);
  const { commissionLevels } = useSelector((state) => state.levels);
  const { payStructure, payStructureShow, totalCount } = useSelector((state) => state.payStructure);
  const { payCommissions } = useSelector((state) => state.payCommision);
  const currentRoles = useSelector((state) =>
          state.auth.user?.roles?.map(role => role.name) || []
      );

  // State for triggering useEffects and edit mode
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedCommissionId, setSelectedCommissionId] = useState('');
  const [selectedLevelId, setSelectedLevelId] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState(null);

  // State for table and pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchText, setSearchText] = useState('');

  // State for History Modal
  const [renderFunction, setRenderFunction] = useState(() => null);
  const [tableHead, setTableHead] = useState([]);
  const [historyRecord, setHistoryRecord] = useState([]);
  const [firstRow, setFirstRow] = useState({});
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  const toggleHistoryModal = () => {
    setIsHistoryModalOpen(prev => !prev);
    if (isHistoryModalOpen) {
      setHistoryRecord([]);
      // setFirstRow(null); 
    }
  };

  const getTableConfig = (data, type) => {
    switch (type) {
      case "cell":
        return {
          head: [
            "Sr. No.",
            "Employee Name",
            "Pay Level",
            "Cell Index - Basic Pay",
            "Increment Month",
            "effective_from",
            "effective_till",
            "Added By",
            "Edited By",
            "Created At",
            "Updated At"
          ],
          firstRow: (
            <tr className="bg-green text-white">
              <td>{1}</td>
              <td className='text-capitalize'>{data?.employee?.name || "NA"}</td>
              <td>{data?.pay_matrix_cell?.pay_matrix_level?.name || "NA"}</td>
              <td>{data?.pay_matrix_cell?.index} - {data?.pay_matrix_cell?.amount}</td>
              <td className='text-capitalize'>{data?.employee?.increment_month || "NA"}</td>
              <td>{dateFormat(data?.effective_from) || "NA"}</td>
              <td>{data?.effective_till ? dateFormat(data.effective_till) : "Present"}</td>
              <td className='text-capitalize'>{data?.added_by
                ? `${data.added_by.name || '-'}${data.added_by.roles && data.added_by.roles.length > 0 ? ' (' + data.added_by.roles.map(role => role.name).join(', ') + ')' : ''}`
                : 'NA'}</td>
              <td className='text-capitalize'>{data?.edited_by
                ? `${data.edited_by.name || '-'}${data.edited_by.roles && data.edited_by.roles.length > 0 ? ' (' + data.edited_by.roles.map(role => role.name).join(', ') + ')' : ''}`
                : 'NA'}</td>
              <td>{data?.created_at ? new Date(data.created_at).toLocaleString() : '-'}</td>
              <td>{data?.updated_at ? new Date(data.updated_at).toLocaleString() : '-'}</td>
            </tr>
          ),
          renderRow: (record, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td className='text-capitalize'>{record.employee?.name || "NA"}</td>
              <td>{record.pay_matrix_cell?.pay_matrix_level?.name || "NA"}</td>
              <td>{record.pay_matrix_cell.index} - {record.pay_matrix_cell.amount}</td>
              <td className='text-capitalize'>{record.employee?.increment_month || "NA"}</td>
              <td>{dateFormat(record.effective_from) || "NA"}</td>
              <td>{record.effective_till ? dateFormat(record.effective_till) : "Present"}</td>
              <td>{record.added_by
                ? `${record.added_by.name || '-'}${record.added_by.roles && record.added_by.roles.length > 0 ? ' (' + record.added_by.roles.map(role => role.name).join(', ') + ')' : ''}`
                : 'NA'}</td>
              <td>{record.edited_by
                ? `${record.edited_by.name || '-'}${record.edited_by.roles && record.edited_by.roles.length > 0 ? ' (' + record.edited_by.roles.map(role => role.name).join(', ') + ')' : ''}`
                : 'NA'}</td>
              <td>{record.created_at ? new Date(record.created_at).toLocaleString() : '-'}</td>
              <td>{record.updated_at ? new Date(record.updated_at).toLocaleString() : '-'}</td>
            </tr>
          ),
        };
      default:
        return { head: [], renderRow: () => null };
    }
  };

  const filteredPayStructures = payStructure.filter((structure) => {
    const fullName = `${structure.employee?.first_name || ''} ${structure.employee?.last_name || ''}`.toLowerCase();
    return fullName.includes(searchText.toLowerCase());
  });


  const handleHistoryStatus = (id) => {
    dispatch(showPayStructure(id)).then((action) => {
      const payload = action.payload.data;


      if (!payload) {
        toast.error("Failed to fetch pay structure details.");
        return;
      }
      const config = getTableConfig(payload, "cell");
      setTableHead(config.head);
      setFirstRow(config.firstRow);
      setRenderFunction(() => config.renderRow);
      const history = payload.history;
      if (Array.isArray(history) && history.length > 0) {
        setHistoryRecord(history);
      } else {
        setHistoryRecord([]);
      }
      toggleHistoryModal();
    });
  };


  useEffect(() => {
    dispatch(fetchPayCommisions());
    dispatch(fetchEmployees({ page: 1, limit: 1000, search: "", institute: "" })); // Fetch more employees for better autocomplete
  }, [dispatch]);

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
    dispatch(fetchPayStructure({ page: page + 1, limit: rowsPerPage, search: searchText }));
  }, [dispatch, page, rowsPerPage, searchText]);

  // Filter employees: only those who do NOT have a pay structure, or the one being edited
  const employeesWithPayStructure = payStructure.map((p) => p.employee_id);
  const availableEmployees = employees.filter(
    (emp) =>
      !employeesWithPayStructure.includes(emp.id) ||
      (editMode && editData && emp.id === editData.employee_id)
  );


  const filteredCells = matrixCells.filter(cell => cell.matrix_level_id === Number(selectedLevelId));

  const initialValues = {
    employee_id: selectedEmployee?.id || editData?.employee_id || '',
    commission_id: editData?.pay_matrix_cell?.pay_matrix_level?.pay_commission_id || '',
    level_id: editData?.pay_matrix_cell?.matrix_level_id || '',
    matrix_cell_id: editData?.matrix_cell_id || '',
    effective_from: editData?.effective_from ? editData.effective_from.split('T')[0] : '',
    effective_till: editData?.effective_till ? editData.effective_till.split('T')[0] : '',
  };

  const handleSubmit = async (values, { resetForm }) => {
    // The `values` object from Formik is now the correct payload.
    if (!values.employee_id) {
      toast.error("Employee is a required field.");
      return;
    }

    try {
      if (editData) {
        const res = await dispatch(updatePayStructure({ id: editData.id, values })).unwrap();
        toast.success(res?.successMsg || "Pay Structure updated successfully");
      } else {
        const res = await dispatch(addPayStructure(values)).unwrap();
        toast.success(res?.successMsg || "Pay Structure added successfully");
      }

      resetForm();
      setEditData(null);
      setSelectedEmployee(null);
      setEditMode(false);
      setSelectedCommissionId('');
      setSelectedLevelId('');
      dispatch(fetchPayStructure({ page: 1, limit: rowsPerPage, search: "" }));

    } catch (error) {
      toast.error(error?.message || error.errorMsg || "Something went wrong");
    }
  };

  const exist = (value) => {

    if (!value) {
      setEditMode(false);
      setEditData(null);
      setSelectedCommissionId('');
      setSelectedLevelId('');
      return;
    }

    const findStructure = payStructure.find((p) => value?.id === p?.employee_id)

    if (findStructure) {
      setEditMode(true);
      const commissionId = findStructure.pay_matrix_cell.pay_matrix_level.pay_commission_id;
      const levelId = findStructure.pay_matrix_cell.matrix_level_id;
      setSelectedCommissionId(commissionId);
      setSelectedLevelId(levelId);
      setEditData(findStructure);
    }
    else {
      setEditMode(false);
      setEditData(null);
      setSelectedCommissionId('');
      setSelectedLevelId('');
    }
  }

  const handleEdit = (structure) => {
    setEditMode(true);
    const commissionId = structure.pay_matrix_cell.pay_matrix_level.pay_commission_id;
    const levelId = structure.pay_matrix_cell.matrix_level_id;
    setSelectedCommissionId(commissionId);
    setSelectedLevelId(levelId);
    // Also set the selected employee when editing from the table
    const employeeForEdit = employees.find(e => e.id === structure.employee_id);
    setSelectedEmployee(employeeForEdit || null);

    setEditData(structure);
  };

  const handleCancelEdit = (resetForm) => {
    setEditMode(false);
    setEditData(null);
    setSelectedEmployee(null);
    setSelectedCommissionId('');
    setSelectedLevelId('');
    resetForm();
  };

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  
  return (
    <>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2, boxShadow: 'none' }}>
        {
          currentRoles.some(role => ['IT Admin',"Salary Processing Coordinator (NIOH)", "Salary Processing Coordinator (ROHC)"].includes(role)) && (
            <>
              <Typography variant="h4" sx={{ mb: 2, fontWeight: 800 }}>
                {editMode ? "Update" : "Create"} Employee Pay Structures
              </Typography>

              <Formik
                initialValues={initialValues}
                enableReinitialize
                onSubmit={handleSubmit}
              >
                {({ values, handleChange, setFieldValue, touched, errors, resetForm }) => (
                  <Form>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6} size={12}>
                        <Autocomplete
                          options={availableEmployees}
                          getOptionLabel={(option) => {
                            if (!option || !option.employee_code) return "";
                            const employeeCode = option.employee_code.toUpperCase();
                            const name = option.name ? capitalize(option.name) : "NA";
                            return `${employeeCode} - ${name}`;
                          }}
                          value={availableEmployees.find(emp => emp.id === values.employee_id) || null}
                          onChange={(_, newValue) => {
                            setSelectedEmployee(newValue);
                            exist(newValue);
                            // setFieldValue('employee_id', newValue ? newValue.id : '');
                          }}
                          isOptionEqualToValue={(option, value) => option.id === value.id}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              required
                              label="Employee"
                              name="employee_id"
                              fullWidth
                              error={touched.employee_id && Boolean(errors.employee_id)}
                              helperText={touched.employee_id && errors.employee_id}
                            />
                          )}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6} size={4}>
                        <TextField
                          select
                          name="commission_id"
                          label="Select Commission"
                          fullWidth
                          value={values.commission_id}
                          onChange={(e) => {
                            const newCommissionId = e.target.value;
                            setFieldValue("commission_id", newCommissionId);
                            setFieldValue("level_id", '');
                            setFieldValue("matrix_cell_id", '');
                            setSelectedCommissionId(newCommissionId);
                            setSelectedLevelId('');
                          }}
                          required
                        >
                          {payCommissions.map((cmn) => (
                            <MenuItem key={cmn.id} value={cmn.id}>{cmn.name}</MenuItem>
                          ))}
                        </TextField>
                      </Grid>

                      <Grid item xs={12} sm={6} size={4}>
                        <TextField
                          select
                          name="level_id"
                          label="Select Level"
                          fullWidth
                          value={values.level_id}
                          onChange={(e) => {
                            const newLevelId = e.target.value;
                            setFieldValue("level_id", newLevelId);
                            setFieldValue("matrix_cell_id", '');
                            setSelectedLevelId(newLevelId);
                          }}
                          required
                          disabled={!values.commission_id}
                        >
                          {commissionLevels.length === 0 ? (
                            <MenuItem disabled>Select Commission First</MenuItem>
                          ) : (
                            commissionLevels.map((level) => (
                              <MenuItem key={level.id} value={level.id}>{level.name}</MenuItem>
                            ))
                          )}
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
                          disabled={!values.level_id}
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
                        </TextField>
                      </Grid>


                      <Grid item xs={12} sm={6} size={4}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            label="Effective From*"
                            format="DD-MM-YYYY"
                            value={values.effective_from ? dayjs(values.effective_from) : null}
                            onChange={(date) => {
                              const formatted = date ? dayjs(date).format('YYYY-MM-DD') : '';
                              setFieldValue('effective_from', formatted);
                            }}
                            slotProps={{
                              textField: {
                                fullWidth: true,
                                name: 'effective_from',
                                error: touched.effective_from && Boolean(errors.effective_from),
                                helperText: touched.effective_from && errors.effective_from,
                              },
                            }}
                          />
                        </LocalizationProvider>
                      </Grid>

                      <Grid item xs={12} sm={6} size={4}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            label="Effective Till"
                            format="DD-MM-YYYY"
                            value={values.effective_till ? dayjs(values.effective_till) : null}
                            onChange={(date) => {
                              const formatted = date ? dayjs(date).format('YYYY-MM-DD') : '';
                              setFieldValue('effective_till', formatted);
                            }}
                            slotProps={{
                              textField: {
                                fullWidth: true,
                                name: 'effective_till',
                                helperText: !values.effective_till
                                  ? 'If not selected, it will be considered as Present'
                                  : '',
                              },
                            }}
                          />
                        </LocalizationProvider>
                      </Grid>
                    </Grid>

                    <Box mt={3} display="flex" gap={2}>
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
                          variant="outlined"
                          color="secondary"
                          onClick={() => handleCancelEdit(resetForm)}
                        >
                          Cancel
                        </Button>
                      )}
                    </Box>
                  </Form>
                )}
              </Formik>
              <hr style={{ margin: '32px 0' }} />
            </>
          )}

        <Typography variant="h4" sx={{ mb: 2, fontWeight: 800 }}>
          Existing Employee Pay Structures
        </Typography>

        <Autocomplete
          freeSolo
          disableClearable
          options={payStructure.map(
            (option) => `${capitalize(option.employee?.name || '')} - ${option.employee?.employee_code || ''}`
          )}
          onInputChange={(event, newInputValue) => setSearchText(newInputValue.split(' - ')[0])}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search by employee name or code"
              margin="normal"
              variant="outlined"
              InputProps={{ ...params.InputProps, type: 'search' }}
            />
          )}
        />


        <div className="table-responsive">
          <Table>
            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
              <TableRow style={{ whiteSpace: "nowrap" }}>
                <TableCell><b>Sr. No.</b></TableCell>
                <TableCell><b>Employee Code</b></TableCell>
                <TableCell><b>Employee</b></TableCell>
                <TableCell><b>Month</b></TableCell>
                <TableCell><b>Level</b></TableCell>
                <TableCell><b>Cell Index - Basic Pay</b></TableCell>
                <TableCell><b>Effective Date</b></TableCell>
                <TableCell align="center"><b>Actions</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={7} align="center">Loading...</TableCell></TableRow>
              ) : (
                filteredPayStructures.map((structure, index) => (
                  <TableRow key={structure.id} hover style={{ whiteSpace: "nowrap" }}>
                    <TableCell>{(page * rowsPerPage) + index + 1}</TableCell>
                    <TableCell className='text-uppercase'>{structure.employee?.employee_code || "NA"}</TableCell>
                    <TableCell className='text-capitalize'>
                      {structure.employee?.name || "NA"}
                    </TableCell>
                    <TableCell>{getMonthName(structure.employee?.increment_month)}</TableCell>
                    <TableCell>
                      {structure.pay_matrix_cell?.pay_matrix_level?.name || 'NA'}
                    </TableCell>
                    <TableCell>
                      {structure.pay_matrix_cell ? `${structure.pay_matrix_cell.index} - ${structure.pay_matrix_cell.amount}` : 'NA'}
                    </TableCell>
                    <TableCell>
                      {dateFormat(structure.effective_from)} - {structure.effective_till ? dateFormat(structure.effective_till) : 'Present'}
                    </TableCell>
                    <TableCell align="center">
                      {
                        currentRoles.some(role => ['IT Admin',"Salary Processing Coordinator (NIOH)", "Salary Processing Coordinator (ROHC)"].includes(role)) && (
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => handleEdit(structure)}
                            style={{ marginRight: '8px' }}
                            startIcon={<Edit />}
                          >
                            Edit
                          </Button>
                        )}
                      <Button
                        variant="contained"
                        color="warning"
                        size="small"
                        startIcon={<History />}
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
        </div>
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
        firstRow={firstRow}
      />
    </>
  );
};

export default EmployeePayStructures;
