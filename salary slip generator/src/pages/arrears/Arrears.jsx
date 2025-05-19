import React, { useEffect, useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton,
  TablePagination, TextField, Box
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import {
  Button,
  Card,
  CardHeader,
  CardBody,
} from "reactstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import CircularProgress from '@mui/material/CircularProgress';
import { fetchArrears } from "../../redux/slices/arrearsSlice";
import ArrearModal from "Modal/Arrears";

export default function Arrears() {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = useState(false);
  const toggle = () => setModalOpen(!modalOpen);
  const arrearsData = useSelector((state) => state.arrears.arrears || []);
  const totalCount = useSelector((state) => state.arrears.totalCount || 0);
  const [selectedArrearId, setSelectedArrearId] = useState(null);
  const loading = useSelector((state) => state.arrears.loading);
  const { name } = useSelector((state) => state.auth.user.role);
  
  useEffect(() => {
    dispatch(fetchArrears());
  }, [dispatch]);

  // const filteredArrears = arrearsData.filter(a =>
  //   a.pensioner_id?.toLowerCase().includes(searchQuery.toLowerCase())
  // );

  // const paginatedArrears = filteredArrears.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(0);
  };

   const handleToggleModal = (id = null) => {
    setSelectedArrearId(id);
    setModalOpen(!modalOpen);
  };


  return (
    <>
      <div className='header bg-gradient-info pb-8 pt-8 pt-md-8 main-head'></div>
      <div className="mt--7 mb-7 container-fluid">
        <Card className="shadow border-0">
          <CardHeader>
            <div className="d-flex justify-content-between align-items-center">
              <TextField
                placeholder="Search arrears by id"
                onChange={handleSearchChange}
                value={searchQuery}
              />
              <Button
                style={{ background: "#004080", color: '#fff' }}
                type="button"
                onClick={() => handleToggleModal(null)}
              >
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
                <TableContainer component={Paper} style={{ boxShadow: 'none', minWidth: 1500 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Pensioner ID</TableCell>
                        <TableCell>From Month</TableCell>
                        <TableCell>To Month</TableCell>
                        <TableCell>Payment Month</TableCell>
                        <TableCell>Basic Arrear</TableCell>
                        <TableCell>Additional Arrear</TableCell>
                        <TableCell>DR %</TableCell>
                        <TableCell>DR Arrear</TableCell>
                        <TableCell>Total Arrear</TableCell>
                        <TableCell>Added By</TableCell>
                        <TableCell>Edited By</TableCell>
                        <TableCell>Remarks</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {arrearsData?.map((a) => (
                        <TableRow key={a.id}>
                          <TableCell>{a.pensioner_id}</TableCell>
                          <TableCell>{a.from_month}</TableCell>
                          <TableCell>{a.to_month}</TableCell>
                          <TableCell>{a.payment_month}</TableCell>
                          <TableCell>{a.basic_arrear}</TableCell>
                          <TableCell>{a.additional_arrear}</TableCell>
                          <TableCell>{a.dr_percentage}</TableCell>
                          <TableCell>{a.dr_arrear}</TableCell>
                          <TableCell>{a.total_arrear}</TableCell>
                          <TableCell>{a.added_by?.name || 'null'}</TableCell>
                          <TableCell>{a.edited_by?.name || 'null'}</TableCell>
                          <TableCell>{a.remarks}</TableCell>
                          <TableCell align="right">
                            <IconButton onClick={() => handleToggleModal(a.id)}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </div>
            <div className="d-flex justify-content-end align-items-center p-2">
              <TablePagination
                component="div"
                count={totalCount}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </div>
          </CardBody>
        </Card>


        <ArrearModal
          isOpen={modalOpen}
          toggle={toggle}
          id={selectedArrearId}
        />

      </div>
    </>
  );
}
