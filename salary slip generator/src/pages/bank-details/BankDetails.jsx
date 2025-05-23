import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  IconButton, Menu, MenuItem, TextField, Chip, TablePagination, Box
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
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
  fetchBankDetails,
  createBankDetail,
  updateBankDetail,
  toggleBankDetailStatus
} from '../../redux/slices/bankSlice';
import BankFormModal from '../../Modal/BankFormModal';

const statusChipColor = (status) => status ? "success" : "error";

export default function BankDetails() {
  const dispatch = useDispatch();
  const { bankdetails, loading } = useSelector((state) => state.bankdetail);
  const totalCount = useSelector((state) => state.bankdetail.totalCount) || 0;
  const { error } = useSelector((state) => state.bankdetail)
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuIndex, setMenuIndex] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState('create');
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    pensioner_id: '',
    bank_name: '',
    branch_name: '',
    account_no: '',
    ifsc_code: ''
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    dispatch(fetchBankDetails());
  }, [dispatch]);

  // const filteredData = bankdetails.filter((item) =>
  //   String(item.pensioner_id).toLowerCase().includes(searchQuery.toLowerCase()) ||
  //   item.pensioner?.name.toLowerCase().includes(searchQuery.toLowerCase())
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

  const handleMenuClick = (e, idx) => {
    setAnchorEl(e.currentTarget);
    setMenuIndex(idx);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setMenuIndex(null);
  };

  const toggleModal = (mode) => {
    if (mode === 'create') {
      setFormData({
        pensioner_id: '',
        bank_name: '',
        branch_name: '',
        account_no: '',
        ifsc_code: ''
      });
      setFormMode('create');
    }
    setFormOpen(!formOpen);
  };

  const handleEdit = (row) => {
    setEditId(row.id);
    setFormMode('edit');
    setFormData({
      pensioner_id: row.pensioner_id,
      bank_name: row.bank_name,
      branch_name: row.branch_name,
      account_no: row.account_no,
      ifsc_code: row.ifsc_code
    });
    setFormOpen(true);
    handleClose();
  };

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    console.log(values)
    if (formMode === 'edit') {
      dispatch(updateBankDetail({ id: editId, values: values }))
        .unwrap()
        .then(() => {
          toast.success("Bank detail updated successfully");
        })
        .catch((err) => {
          const apiMsg =
            err?.response?.data?.message ||
            err?.message ||
            'Failed to save pensioner.';
          toast.error(apiMsg);
        });
    } else {
      dispatch(createBankDetail(values))
        .unwrap()
        .then(() => {
          toast.success("Bank detail added");
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

  const handleToggleStatus = async (row) => {
    await dispatch(toggleBankDetailStatus({ id: row.id }));
  };

  return (
    <>
      <div className='header bg-gradient-info pb-8 pt-8 pt-md-8 main-head'></div>
      <div className="mt--7 mb-7 container-fluid">
        <Card className="card-stats mb-4 mb-lg-0">
          <CardHeader>
            <div className="d-flex justify-content-between align-items-center">
              <TextField placeholder="pensioner id & name" onChange={handleSearchChange} />
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
                      <TableCell>Pensioner ID</TableCell>
                      <TableCell>Pensioner Name</TableCell>
                      <TableCell>Bank Name</TableCell>
                      <TableCell>Branch Name</TableCell>
                      <TableCell>Account No</TableCell>
                      <TableCell>IFSC</TableCell>
                      <TableCell>Add By</TableCell>
                      <TableCell>Edit By</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {bankdetails.map((row, idx) => (
                      <TableRow key={row.id}>
                        <TableCell>{row.pensioner_id}</TableCell>
                        <TableCell>{row.pensioner?.name}</TableCell>
                        <TableCell>{row.bank_name}</TableCell>
                        <TableCell>{row.branch_name}</TableCell>
                        <TableCell>{row.account_no}</TableCell>
                        <TableCell>{row.ifsc_code}</TableCell>
                        <TableCell>{row.added_by?.name}</TableCell>
                        <TableCell>{row.edited_by?.name}</TableCell>
                        <TableCell>
                          <Chip
                            label={row.is_active ? 'Active' : 'Inactive'}
                            color={statusChipColor(row.is_active ? "Active" : "Inactive")}
                            variant="outlined"
                            size="small"
                            onClick={() => handleToggleStatus(row)}
                            style={{ cursor: 'pointer' }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <IconButton onClick={(e) => handleMenuClick(e, idx)}>
                            <MoreVertIcon />
                          </IconButton>
                          <Menu anchorEl={anchorEl} open={menuIndex === idx} onClose={handleClose}>
                            <MenuItem onClick={() => handleEdit(row)}>
                              <EditIcon fontSize="small" /> Edit
                            </MenuItem>
                          </Menu>
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
        <BankFormModal
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
