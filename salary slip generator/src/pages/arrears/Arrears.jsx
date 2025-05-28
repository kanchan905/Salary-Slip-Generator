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
import { fetchArrears, fetchArrearsShow } from "../../redux/slices/arrearsSlice";
import ArrearModal from "Modal/Arrears";
<<<<<<< Updated upstream
import HistoryIcon from '@mui/icons-material/History';
import HistoryModal from "Modal/HistoryModal";
=======
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import ViewIcon from '@mui/icons-material/Visibility';
import {  MenuItem } from '@mui/material';
>>>>>>> Stashed changes

export default function Arrears() {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = useState(false);
  const toggle = () => setModalOpen(!modalOpen);
  const arrearsData = useSelector((state) => state.arrears.arrears || []);
  const showArrear = useSelector((state) => state.arrears.showArrear);
  const totalCount = useSelector((state) => state.arrears.totalCount || 0);
  const [selectedArrearId, setSelectedArrearId] = useState(null);
  const loading = useSelector((state) => state.arrears.loading);
  const { name } = useSelector((state) => state.auth.user.role);
<<<<<<< Updated upstream
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
      case "arrear":
        return {
          head: [
            "Sr. No.",
            "Pensioner ID",
            "From Month",
            "To Month",
            "Payment Month",
            "Basic Arrear",
            "Additional Arrear",
            "DR %",
            "DR Arrear",
            "Total Arrear",
            "Remarks",
            "Added By",
            "Edited By"
          ],
          renderRow: (record, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{record.pensioner_id}</td>
              <td>{record.from_month}</td>
              <td>{record.to_month}</td>
              <td>{record.payment_month}</td>
              <td>{record.basic_arrear}</td>
              <td>{record.additional_arrear}</td>
              <td>{record.dr_percentage}</td>
              <td>{record.dr_arrear}</td>
              <td>{record.total_arrear}</td>
              <td>{record.remarks || "NA"}</td>
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
    dispatch(fetchArrearsShow(id));
  };
          
  useEffect(() => {
    console.log("Updated Arrears: ", showArrear);
    if (showArrear && Array.isArray(showArrear.history)) {
      const config = getTableConfig("arrear");
      setHistoryRecord(showArrear.history);
      setTableHead(config.head);
      setRenderFunction(() => config.renderRow);
      toggleHistoryModal();
    }
  }, [showArrear]);

  console.log("Show Arrears: ", historyRecord);
=======
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuArrearId, setMenuArrearId] = useState(null);
>>>>>>> Stashed changes


  useEffect(() => {
    dispatch(fetchArrears({ page: page, limit: rowsPerPage, id: searchQuery }));
  }, [dispatch, page, rowsPerPage, searchQuery]);

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

  const handleMenuClick = (event, id) => {
    setAnchorEl(event.currentTarget);
    setMenuArrearId(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuArrearId(null);
  };

  const handleEdit = (id) => {
    handleMenuClose();
    handleToggleModal(id);
  };

  const handleView = (id) => {
    handleMenuClose();
    navigate(`/${name.toLowerCase()}/arrears/view/${id}`);
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
            <div className="custom-scrollbar">
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <CircularProgress />
                </Box>
              ) : (
                <TableContainer component={Paper} style={{ boxShadow: 'none'}}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Pensioner ID</TableCell>
                        <TableCell>From Month</TableCell>
                        <TableCell>To Month</TableCell>
                        <TableCell>Payment Month</TableCell>
                        <TableCell>DR %</TableCell>
                        <TableCell>DR Arrear</TableCell>
                        <TableCell>Total Arrear</TableCell>
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
                          <TableCell>{a.dr_percentage}</TableCell>
                          <TableCell>{a.dr_arrear}</TableCell>
                          <TableCell>{a.total_arrear}</TableCell>
                          <TableCell align="right">
                            <IconButton onClick={(e) => handleMenuClick(e, a.id)}>
                              <MoreVertIcon />
                            </IconButton>
<<<<<<< Updated upstream
                            <IconButton onClick={() => handleHistoryStatus(a.id)}>
                              <HistoryIcon fontSize="small" />
                            </IconButton>
=======
                            <Menu
                              anchorEl={anchorEl}
                              open={menuArrearId === a.id}
                              onClose={handleMenuClose}
                              anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                            >
                              <MenuItem onClick={() => handleView(a.id)}>
                                <ViewIcon fontSize="small" /> View
                              </MenuItem>
                              <MenuItem onClick={() => handleEdit(a.id)}>
                                <EditIcon fontSize="small" /> Edit
                              </MenuItem>
                            </Menu>
>>>>>>> Stashed changes
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

        <HistoryModal
          isOpen={isHistoryModalOpen}
          toggle={toggleHistoryModal}
          tableHead={tableHead}
          historyRecord={historyRecord}
          renderRow={renderFunction}
        />
      </div>
    </>
  );
}
