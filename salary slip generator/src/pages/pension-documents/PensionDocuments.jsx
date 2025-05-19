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
  fetchPensionDocument,
  createPensionDocument,
  updatePensionDocument,
} from '../../redux/slices/pensionDocumentSlice';
import PensionDocumentModal from '../../Modal/PensionDocumentModal';



export default function PensionDocuments() {
  const dispatch = useDispatch();
  const { document, loading } = useSelector((state) => state.pensionDocument);
  const totalCount = useSelector((state) => state.pensionDocument.totalCount) || 0;
  const { error } = useSelector((state) => state.pensionDocument)
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuIndex, setMenuIndex] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState('create');
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    pensioner_id: '',
    document_type: '',
    document_number: '',
    issue_date: '',
    expiry_date: '',
    file: ''
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    dispatch(fetchPensionDocument());
  }, [dispatch]);

  // const filteredData = document.filter((item) =>
  //   item.document_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //   item.pensioner_id.toLowerCase().includes(searchQuery.toLowerCase())
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
        pensioner_id: '',
        document_type: '',
        document_number: '',
        issue_date: '',
        expiry_date: '',
        file: ''
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
      document_type: row.document_type,
      document_number: row.document_number,
      issue_date: row.issue_date,
      expiry_date:row.expiry_date,
      file:row.file
    });
    setFormOpen(true);
    handleClose();
  };

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    if (formMode === 'edit') {
      dispatch(updatePensionDocument({ id: editId, values: values }))
        .unwrap()
        .then(() => {
          toast.success("PensionDeduction updated successfully");
          dispatch(fetchPensionDocument());
        })
        .catch((err) => {
          const apiMsg =
            err?.response?.data?.message ||
            err?.message ||
            'Failed to save pensioner.';
          toast.error(apiMsg);
        });
    } else {
      dispatch(createPensionDocument(values))
        .unwrap()
        .then(() => {
          toast.success("PensionDeduction added");
          dispatch(fetchPensionDocument());
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
                      <TableCell>Pensioner Id</TableCell>
                      <TableCell>Document Type</TableCell>
                      <TableCell>Document Number</TableCell>
                      <TableCell>Issue Date</TableCell>
                      <TableCell>Expiry Date</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {document.map((row, idx) => (
                      <TableRow key={row.id}>
                        <TableCell>{row.pensioner_id}</TableCell>
                        <TableCell>{row.document_type}</TableCell>
                        <TableCell>{row.document_number}</TableCell>
                        <TableCell>{row.issue_date}</TableCell>
                        <TableCell>{row.expiry_date}</TableCell>                        
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
        <PensionDocumentModal
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
