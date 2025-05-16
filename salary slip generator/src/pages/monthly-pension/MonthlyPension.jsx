import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  TextField, TablePagination, Box
} from '@mui/material';
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
  monthlyPensionDetails,
  createMonthlyPension,
} from '../../redux/slices/monthlyPensionSlice';
import MonthlyPensionModal from '../../Modal/MonthlyPension';



export default function MonthlyPension() {
  const dispatch = useDispatch();
  const { monthlyPension, loading } = useSelector((state) => state.monthlypension);
  const { error } = useSelector((state) => state.monthlypension)
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    pensioner_id: '',
    month: '',
    basic_pension: '',
    commutation_amount: '',
    additional_pension: '',
    dr_id:'',
    dr_amount: '',
    medical_allowance: '',
    status:'',
    remarks: '',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    dispatch(monthlyPensionDetails());
  }, [dispatch]);

  const filteredData = monthlyPension.filter((item) =>
    item.pensioner?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.pensioner_id.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const paginatedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPage(0);
  };

  const handlePageChange = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };


  const toggleModal = () => {
    setFormOpen(!formOpen);
  };


  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    console.log(values)
    dispatch(createMonthlyPension(values))
      .unwrap()
      .then(() => {
        toast.success("Monthly Pension added");
        dispatch(monthlyPensionDetails());
      })
      .catch((err) => {
        const apiMsg =
          err?.response?.data?.message ||
          err?.message ||
          'Failed to save Monthly Pension.';
        toast.error(apiMsg);
      });
    resetForm();
    setFormOpen(false);
    setSubmitting(false);
  };

  return (
    <>
      <div className='header bg-gradient-info pb-8 pt-8 pt-md-8 main-head'></div>
      <div className="mt--7 mb-7 container-fluid">
        <Card className="card-stats mb-4 mb-lg-0">
          <CardHeader>
            <div className="d-flex justify-content-between align-items-center">
              <TextField placeholder="Pensioner id & name" onChange={handleSearchChange} />
              <Button style={{ background: "#004080", color: "#fff" }} onClick={() => toggleModal()}>
                + Add
              </Button>
            </div>
          </CardHeader>
          <CardBody>
            <div style={{ width: '100%', overflowX: 'auto' }} className="custom-scrollbar">
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <CircularProgress />
                </Box>
              ) : (
                <TableContainer component={Paper} style={{ boxShadow: "none", minWidth: 2000 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Pensioner ID</TableCell>
                        <TableCell>Pensioner Name</TableCell>
                        <TableCell>Month</TableCell>
                        <TableCell>Basic Pension</TableCell>
                        <TableCell>Commutation Amount</TableCell>
                        <TableCell>Additional Pension</TableCell>
                        <TableCell>Dr Amount</TableCell>
                        <TableCell>Medical Allowance</TableCell>
                        <TableCell>Total Pension</TableCell>
                        <TableCell>Total Recovery</TableCell>
                        <TableCell>Net Pension</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Add By</TableCell>
                        <TableCell>Edit By</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paginatedData.map((row, idx) => (
                        <TableRow key={row.id}>
                          <TableCell>{row.pensioner_id}</TableCell>
                          <TableCell>{row.pensioner?.name}</TableCell>
                          <TableCell>{row.month}</TableCell>
                          <TableCell>{row.basic_pension}</TableCell>
                          <TableCell>{row.commutation_amount}</TableCell>
                          <TableCell>{row.additional_pension}</TableCell>
                          <TableCell>{row.dr_amount}</TableCell>
                          <TableCell>{row.medical_allowance}</TableCell>
                          <TableCell>{row.total_pension}</TableCell>
                          <TableCell>{row.total_recovery}</TableCell>
                          <TableCell>{row.net_pension}</TableCell>
                          <TableCell>{row.status}</TableCell>
                          <TableCell>{row.added_by?.name}</TableCell>
                          <TableCell>{row.edited_by?.name}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </div>
            <TablePagination
              component="div"
              count={filteredData.length}
              page={page}
              onPageChange={handlePageChange}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </CardBody>
        </Card>
        <MonthlyPensionModal
          setFormOpen={setFormOpen}
          formOpen={formOpen}
          toggleModal={toggleModal}
          formData={formData}
          handleSubmit={handleSubmit}
        />
      </div>
    </>
  );
}
