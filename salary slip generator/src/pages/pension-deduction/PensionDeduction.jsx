import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  IconButton, TextField, TablePagination, Box
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import {
  Button,
  Card,
  CardHeader,
  CardBody
} from "reactstrap";
import CircularProgress from '@mui/material/CircularProgress';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
  fetchPensionDeduction,
  createPensionDeduction,
  updatePensionDeduction,
} from '../../redux/slices/pensionDeductionSlice';
import PensionDeductionModal from '../../Modal/PensionDeductionModal';



export default function PensionDeduction() {
  const dispatch = useDispatch();
  const { pension, loading } = useSelector((state) => state.pensionDeduction);
  const totalCount = useSelector((state)=> state.pensionDeduction.totalCount) || 0;
  const { error } = useSelector((state) => state.pensionDeduction)
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuIndex, setMenuIndex] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState('create');
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    pension_id: '',
    deduction_type: '',
    amount: '',
    description: ''
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    dispatch(fetchPensionDeduction());
  }, [dispatch]);

  // const filteredData = pension.filter((item) =>
  //    item.deduction_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //    item.pension_id.toLowerCase().includes(searchQuery.toLowerCase())
  // );

  // const paginatedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPage(0);
  };

  const handlePageChange = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };


  const handleClose = () => {
    setAnchorEl(null);
    setMenuIndex(null);
  };

  const toggleModal = (mode) => {
    if (mode === 'create') {
      setFormData({
        pension_id: '',
        deduction_type: '',
        amount: '',
        description: ''
      });
      setFormMode('create');
    }
    setFormOpen(!formOpen);
  };

  const handleEdit = (row) => {
    setEditId(row.id);
    setFormMode('edit');
    setFormData({
      pension_id: row.pension_id,
      deduction_type: row.deduction_type,
      amount: row.amount,
      description:row.description
    });
    setFormOpen(true);
    handleClose();
  };

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    if (formMode === 'edit') {
      dispatch(updatePensionDeduction({ id: editId, values: values }))
        .unwrap()
        .then(() => {
          toast.success("PensionDeduction updated successfully");
          dispatch(fetchPensionDeduction());
        })
        .catch((err) => {
          const apiMsg =
            err?.response?.data?.message ||
            err?.message ||
            'Failed to save pensioner.';
          toast.error(apiMsg);
        });
    } else {
      dispatch(createPensionDeduction(values))
        .unwrap()
        .then(() => {
          toast.success("PensionDeduction added");
          dispatch(fetchPensionDeduction());
        })
        .catch((err) => {
          const apiMsg =
            err?.response?.data?.message ||
            err?.message ||
            'Failed to save pensioner.';
          toast.error(apiMsg);
        });
    }
    resetForm();
    setFormOpen(false);
    setEditId(null);
    setSubmitting(false);
  };

  return (
    <>
      <div className='header bg-gradient-info pb-8 pt-8 pt-md-8 main-head'></div>
      <div className="mt--7 mb-7 container-fluid">
        <Card className="card-stats mb-4 mb-lg-0">
          <CardHeader>
            <div className="d-flex justify-content-between align-items-center">
              <TextField placeholder="Id & Type" onChange={handleSearchChange} />
              <Button style={{ background: "#004080", color: "#fff" }} onClick={() => toggleModal("create")}>
                + Add
              </Button>
            </div>
          </CardHeader>
          <CardBody>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <CircularProgress />
              </Box>
            ) : (
              <TableContainer component={Paper} style={{ boxShadow: "none" }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Pension Id</TableCell>
                      <TableCell>Deduction Type</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell>Add By</TableCell>
                      <TableCell>Edit By</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pension.map((row, idx) => (
                      <TableRow key={row.id}>
                        <TableCell>{row.pension_id}</TableCell>
                        <TableCell>{row.deduction_type}</TableCell>
                        <TableCell>{row.amount}</TableCell>
                        <TableCell>{row.description}</TableCell>
                        <TableCell>{row.added_by?.name}</TableCell>
                        <TableCell>{row.edited_by?.name}</TableCell>
                        <TableCell align="left">
                          <IconButton onClick={() => handleEdit(row)}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <TablePagination
                  component="div"
                  count={totalCount}
                  page={page}
                  onPageChange={handlePageChange}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </TableContainer>
            )}
          </CardBody>
        </Card>
        <PensionDeductionModal
          setFormOpen={setFormOpen}
          formOpen={formOpen}
          toggleModal={toggleModal}
          formMode={formMode}
          formData={formData}
          handleChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
          handleSubmit={handleSubmit}
        />
      </div>
    </>
  );
}
