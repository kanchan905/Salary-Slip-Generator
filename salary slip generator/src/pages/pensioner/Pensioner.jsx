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
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { fetchPensioners, updateStatus } from "../../redux/slices/pensionerSlice";
import { Select, MenuItem } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';


export default function Pensioner() {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate();
  const { name } = useSelector((state) => state.auth.user.role);
  const dispatch = useDispatch();
  const pensionersData = useSelector((state) => state.pensioner.pensioners)
  const loading = useSelector((state) => state.pensioner.loading)


  useEffect(() => {
    dispatch(fetchPensioners())
  }, [dispatch, page, rowsPerPage])

  // Filter pensioners based on search query
  const filteredPensioners = pensionersData.filter(p =>
    p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.ppo_no?.toLowerCase().includes(searchQuery.toLowerCase())
  );



  const paginatedPensioners = filteredPensioners.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(0);
  };

  const handleStatusChange = (id, data) => {
    dispatch(updateStatus({ id, value: { status: data } }))
  }

  return (
    <>
      <div className='header bg-gradient-info pb-8 pt-8 pt-md-8 main-head'></div>
      <div className="mt--7 mb-7 container-fluid">
        <Card className="shadow border-0">
          <CardHeader>
            <div className="d-flex justify-content-between align-items-center">
              <TextField
                placeholder="Search pensioner..."
                onChange={handleSearchChange}
                value={searchQuery}
              />
              <Button
                style={{ background: "#004080", color: '#fff' }}
                type="button"
                onClick={() => navigate(`/${name.toLowerCase()}/pensioner/add`)}
              >
                + Add Pensioner
              </Button>
            </div>
          </CardHeader>
          <CardBody>
            <div style={{ width: '100%', overflowX: 'auto' }} className="custom-scrollbar">
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent:'center', alignItems:'center' }}>
                  <CircularProgress />
                </Box>
              ) : (
                <TableContainer component={Paper} style={{ boxShadow: 'none', minWidth: 1500 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Emp ID</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>PPO NO.</TableCell>
                        <TableCell>Pension Type</TableCell>
                        <TableCell>Relation</TableCell>
                        <TableCell>DOB</TableCell>
                        <TableCell>DOJ</TableCell>
                        <TableCell>DOR</TableCell>
                        <TableCell>End Date</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Mobile No.</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paginatedPensioners.map((p) => (
                        <TableRow key={p.id}>
                          <TableCell>{p.retired_employee_id}</TableCell>
                          <TableCell>{p.name}</TableCell>
                          <TableCell>{p.ppo_no}</TableCell>
                          <TableCell>{p.type_of_pension}</TableCell>
                          <TableCell>{p.relation}</TableCell>
                          <TableCell>{p.dob}</TableCell>
                          <TableCell>{p.doj}</TableCell>
                          <TableCell>{p.dor}</TableCell>
                          <TableCell>{p.end_date}</TableCell>
                          <TableCell>
                            <Select
                              value={p.status || ""}
                              onChange={(e) => handleStatusChange(p.id, e.target.value)}
                              size="small"
                            >
                              <MenuItem value="Active">Active</MenuItem>
                              <MenuItem value="Expired">Expired</MenuItem>
                              <MenuItem value="Suspended">Suspended</MenuItem>
                            </Select>
                          </TableCell>
                          <TableCell>{p.mobile_no}</TableCell>
                          <TableCell>{p.email}</TableCell>
                          <TableCell align="right">
                            <IconButton onClick={() => navigate(`/${name.toLowerCase()}/pensioner/edit/${p.id}`)}>
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
                count={filteredPensioners.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </div>
          </CardBody>
        </Card>
      </div>
    </>
  );
}