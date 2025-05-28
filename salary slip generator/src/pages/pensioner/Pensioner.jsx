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
import { fetchPensioners, showPension, updateStatus } from "../../redux/slices/pensionerSlice";
import { Select, MenuItem } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import HistoryIcon from '@mui/icons-material/History';
import HistoryModal from 'Modal/HistoryModal';


export default function Pensioner() {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate();
  const { name } = useSelector((state) => state.auth.user.role);
  const dispatch = useDispatch();
  const pensionersData = useSelector((state) => state.pensioner.pensioners);
  const pensionerShow = useSelector((state) => state.pensioner.pensionerShow);
  const totalCount = useSelector((state) => state.pensioner.totalCount) || 0;
  const loading = useSelector((state) => state.pensioner.loading);
  const [ renderFunction, setRenderFunction ] = useState(() => null);
  const [historyRecord, setHistoryRecord] = useState([]);
  const [tableHead, setTableHead] = useState([
    "Sr. No.",
    "Head 1",
    "Head 2",
    "Head 3",
    "Head 4",
    "Head 5",
    "Head 6",
  ]);
  
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const toggleHistoryModal = () => setIsHistoryModalOpen(!isHistoryModalOpen);
      
  const getTableConfig = (type) => {
    switch (type) {
      case "pensioner":
        return {
          head: [
            "Sr. No.",
            "Name",
            "Date Of Birth",
            "Mobile No.",
            "Email",
            "Pan No.",
            "Address",
            "PPO No.",
            "Pension Type",
            "Relation",
            "Date Of Joining",
            "Date Of Retirement",
            "End Date",
            "Status",
            "Pay level",
            "Equivalent Level",
            "Pay Commission",
            "Added By",
            "Edited By"
          ],
          renderRow: (record, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{record?.name}</td>
              <td>{record.dob}</td>
              <td>{record.mobile_no}</td>
              <td>{record.email}</td>
              <td>{record.pan_number}</td>
              <td>{record.address}, {record.city}, {record.state}, {record.pin_code}</td>
              <td>{record.ppo_no || "NA"}</td>
              <td>{record.type_of_pension || "NA"}</td>
              <td>{record.relation || "NA"}</td>
              <td>{record.doj}</td>
              <td>{record.dor}</td>
              <td>{record.end_date}</td>
              <td>{record.status}</td>
              <td>{record.pay_level || "NA"}</td>
              <td>{record.equivalent_level || "NA"}</td>
              <td>{record.pay_commission || "NA"}</td>
              <td>{record.added_by?.name}</td>
              <td>{record.edited_by?.name || "NA"}</td>
            </tr>
          ),
        };

  
    // You can add more like designation, pay scale, etc.
              
    default:
      return { head: [], renderRow: () => null };
    }
  };
  
  // Status History handlers
  const handleHistoryStatus = (id) => {
    dispatch(showPension(id));
  };
        
  useEffect(() => {
    console.log("Updated pensionerShow: ", pensionerShow);
    if (pensionerShow && Array.isArray(pensionerShow.history)) {
      const config = getTableConfig("pensioner");
      setHistoryRecord(pensionerShow.history);
      setTableHead(config.head);
      setRenderFunction(() => config.renderRow);
      toggleHistoryModal();
    }
  }, [pensionerShow]);

  useEffect(() => {
    dispatch(fetchPensioners())
  }, [dispatch, page, rowsPerPage])

  // Filter pensioners based on search query
  // const filteredPensioners = pensionersData.filter(p =>
  //   p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //   p.ppo_no?.toLowerCase().includes(searchQuery.toLowerCase())
  // );



  // const paginatedPensioners = filteredPensioners.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

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
                placeholder="pensioner name or ppo"
                onChange={handleSearchChange}
                value={searchQuery}
              />
              <Button
                style={{ background: "#004080", color: '#fff' }}
                type="button"
                onClick={() => navigate(`/${name.toLowerCase()}/pensioner/add`)}
              >
                + Add
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
                      {pensionersData.map((p) => (
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
                            <IconButton onClick={() => handleHistoryStatus(p.id)}>
                              <HistoryIcon fontSize="small" />
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
      </div>
      <HistoryModal
        isOpen={isHistoryModalOpen}
        toggle={toggleHistoryModal}
        tableHead={tableHead}
        historyRecord={historyRecord}
        renderRow={renderFunction}
      />

    </>
  );
}