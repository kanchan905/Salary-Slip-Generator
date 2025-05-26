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
  fetchDearnessRelief,
  createDearnessRelief,
  updateDearnessRelief,
} from '../../redux/slices/dearnessRelief';
import DearnessReliefModal from '../../Modal/DearnessRelief';



export default function DearnessRelief() {
  const dispatch = useDispatch();
  const { dearness, loading } = useSelector((state) => state.dearnessRelief);
  const totalCount = useSelector((state) => state.dearnessRelief.totalCount) || 0;
  const { error } = useSelector((state) => state.dearnessRelief)
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuIndex, setMenuIndex] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState('create');
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    effective_from: '',
    effective_to: '',
    dr_percentage: '',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    dispatch(fetchDearnessRelief());
  }, [dispatch]);

  // const filteredData = dearness.filter((item) =>
  //   String(item.dr_percentage).toLowerCase().includes(searchQuery.toLowerCase())
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
        effective_from: '',
        effective_to: '',
        dr_percentage: '',
      });
      setFormMode('create');
    }
    setFormOpen(!formOpen);
  };

  const handleEdit = (row) => {
    setEditId(row.id);
    setFormMode('edit');
    setFormData({
      effective_from: row.effective_from,
      effective_to: row.effective_to,
      dr_percentage: row.dr_percentage,
    });
    setFormOpen(true);
    handleClose();
  };

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    console.log(values)
    if (formMode === 'edit') {
      dispatch(updateDearnessRelief({ id: editId, values: values }))
        .unwrap()
        .then(() => {
          toast.success("DearnessRelief updated successfully");
          dispatch(fetchDearnessRelief());
        })
        .catch((err) => {
          const apiMsg =
            err?.response?.data?.message ||
            err?.message ||
            'Failed to save pensioner.';
          toast.error(apiMsg);
        });
    } else {
      dispatch(createDearnessRelief(values))
        .unwrap()
        .then(() => {
          toast.success("DearnessRelief added");
          dispatch(fetchDearnessRelief());
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
            <div className="d-flex justify-content-end align-items-center">
              {/* <TextField placeholder="dr percentage" onChange={handleSearchChange} /> */}
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
                      <TableCell>Effective From</TableCell>
                      <TableCell>Effective To</TableCell>
                      <TableCell>Dr Percentage</TableCell>
                      <TableCell>Add By</TableCell>
                      <TableCell>Edit By</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dearness.map((row, idx) => (
                      <TableRow key={row.id}>
                        <TableCell>{row.effective_from}</TableCell>
                        <TableCell>{row.effective_to}</TableCell>
                        <TableCell>{row.dr_percentage}</TableCell>
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
        <DearnessReliefModal
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
