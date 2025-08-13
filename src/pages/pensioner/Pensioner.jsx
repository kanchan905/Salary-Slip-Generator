import React, { useEffect, useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton,
  TablePagination, Box,
} from '@mui/material';
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
import ViewIcon from '@mui/icons-material/Visibility';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import { dateFormat } from "utils/helpers";




export default function Pensioner() {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate();
  const currentRoles = useSelector((state) =>
    state.auth.user?.roles?.map(role => role.name) || []
  );
  const dispatch = useDispatch();
  const pensionersData = useSelector((state) => state.pensioner.pensioners);
  const totalCount = useSelector((state) => state.pensioner.totalCount) || 0;
  const loading = useSelector((state) => state.pensioner.loading);
  const [renderFunction, setRenderFunction] = useState(() => null);
  const [historyRecord, setHistoryRecord] = useState([]);
  const [firstRow, setFirstRow] = useState({});
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
  const toggleHistoryModal = () => {
    setIsHistoryModalOpen(!isHistoryModalOpen)
    if (isHistoryModalOpen) setHistoryRecord([]);
    handleMenuClose()
  }

  const getTableConfig = (data) => ({
    head: [
      "Sr. No.",
      "Emp. Code",
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
      "Added By",
      "Edited By",
      "Created At",
      "Updated At"
    ],
    firstRow:
      <tr className="bg-green text-white">
        <td>{1}</td>
        <td>{data?.employee?.employee_code || "- -"}</td>
        <td>{data?.name}</td>
        <td>{dateFormat(data.dob)}</td>
        <td>{data.mobile_no}</td>
        <td>{data.email}</td>
        <td>{data.pan_number}</td>
        <td>{data.address}, {data.city}, {data.state}, {data.pin_code}</td>
        <td>{data.ppo_no || "NA"}</td>
        <td>{data.type_of_pension || "NA"}</td>
        <td>{data.relation || "NA"}</td>
        <td>{dateFormat(data.doj)}</td>
        <td>{dateFormat(data.dor)}</td>
        <td>{dateFormat(data.end_date) || "-"}</td>
        <td>{data.status}</td>
        <td>{data.added_by
          ? `${data.added_by.name || '-'}${data.added_by.roles && data.added_by.roles.length > 0 ? ' (' + data.added_by.roles.map(role => role.name).join(', ') + ')' : ''}`
          : 'NA'}</td>
        <td>{data.edited_by
          ? `${data.edited_by.name || '-'}${data.edited_by.roles && data.edited_by.roles.length > 0 ? ' (' + data.edited_by.roles.map(role => role.name).join(', ') + ')' : ''}`
          : 'NA'}</td>
        <td>{data.created_at ? new Date(data.created_at).toLocaleString() : '-'}</td>
        <td>{data.updated_at ? new Date(data.updated_at).toLocaleString() : '-'}</td>
      </tr>
    ,
    renderRow: (record, index) => (
      <tr key={index}>
        <td>{index + 2}</td>
        <td>{record?.employee?.employee_code || "- -"}</td>
        <td>{record?.name}</td>
        <td>{dateFormat(record.dob)}</td>
        <td>{record.mobile_no}</td>
        <td>{record.email}</td>
        <td>{record.pan_number}</td>
        <td>{record.address}, {record.city}, {record.state}, {record.pin_code}</td>
        <td>{record.ppo_no || "NA"}</td>
        <td>{record.type_of_pension || "NA"}</td>
        <td>{record.relation || "NA"}</td>
        <td>{dateFormat(record.doj)}</td>
        <td>{dateFormat(record.dor)}</td>
        <td>{dateFormat(record.end_date) || "-"}</td>
        <td>{record.status}</td>
        <td>{record.added_by
          ? `${record.added_by.name || '-'}${record.added_by.roles && record.added_by.roles.length > 0 ? ' (' + record.added_by.roles.map(role => role.name).join(', ') + ')' : ''}`
          : 'NA'}</td>
        <td>{record.edited_by
          ? `${record.edited_by.name || '-'}${record.edited_by.roles && record.edited_by.roles.length > 0 ? ' (' + record.edited_by.roles.map(role => role.name).join(', ') + ')' : ''}`
          : 'NA'}</td>
        <td>{record.created_at ? new Date(record.created_at).toLocaleString() : '-'}</td>
        <td>{record.updated_at ? new Date(record.updated_at).toLocaleString() : '-'}</td>
      </tr>
    )
  });

  const handleHistoryStatus = (id) => {
    handleMenuClose();
    dispatch(showPension(id)).then((res) => {
      const payload = res.payload
      const history = payload?.history;
      if (Array.isArray(history)) {
        const config = getTableConfig(payload);
        setHistoryRecord(history);
        setTableHead(config.head);
        setRenderFunction(() => config.renderRow);
        setFirstRow(config.firstRow);
        toggleHistoryModal();
      } else {
        setHistoryRecord([]);
      }
    });
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const [menuPensionerId, setMenuPensionerId] = useState(null);


  useEffect(() => {
    dispatch(fetchPensioners({ page: page + 1, limit: rowsPerPage, id: searchQuery }))
  }, [dispatch, page, rowsPerPage, searchQuery,])

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };


  const handleStatusChange = (id, data) => {
    dispatch(updateStatus({ id, value: { status: data } }))
  }

  const handleMenuClick = (event, id) => {
    setAnchorEl(event.currentTarget);
    setMenuPensionerId(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuPensionerId(null);
  };


  const handleView = (id) => {
    handleMenuClose();
    navigate(`/pensioner/view/${id}`);
  };

  return (
    <>
      <div className='header bg-gradient-info pb-8 pt-8 pt-md-8 main-head'></div>
      <div className="mt--7 mb-7 container-fluid">
        <Card className="shadow border-0">
          <CardHeader>
            <div className="d-flex justify-content-end align-items-center">
              {
                currentRoles.some(role => ['IT Admin', "Pensioners Operator"].includes(role)) && (
                  <Button
                    style={{ background: "#004080", color: '#fff' }}
                    type="button"
                    onClick={() => navigate(`/pensioner/add`)}
                  >
                    + Add
                  </Button>
                )
              }
            </div>
          </CardHeader>
          <CardBody>
            <div >
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <CircularProgress />
                </Box>
              ) : (
                <TableContainer component={Paper} style={{ boxShadow: 'none' }}>
                  <Table>
                    <TableHead>
                      <TableRow style={{ whiteSpace: 'nowrap' }}>
                        <TableCell style={{ fontWeight: "900" }}>Sr. No.</TableCell>
                        <TableCell style={{ fontWeight: "900" }}>PPO No.</TableCell>
                        <TableCell style={{ fontWeight: "900" }}>Emp. Code</TableCell>
                        <TableCell style={{ fontWeight: "900" }}>Name</TableCell>
                        <TableCell style={{ fontWeight: "900" }}>Pension Type</TableCell>
                        <TableCell style={{ fontWeight: "900" }}>DOR</TableCell>
                        <TableCell style={{ fontWeight: "900" }}>End Date</TableCell>
                        <TableCell style={{ fontWeight: "900" }}>Status</TableCell>
                        <TableCell align="right" style={{ fontWeight: "900" }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {pensionersData.length === 0 ? (
                        <TableRow>
                          <TableCell align="center" colSpan={9}>No data available</TableCell>
                        </TableRow>
                      ) : (
                        pensionersData.map((p, idx) => (
                          <TableRow key={p.id} style={{ whiteSpace: 'nowrap' }}>
                            <TableCell>{(page * rowsPerPage) + idx + 1}</TableCell>
                            <TableCell>{p.ppo_no || "- -"}</TableCell>
                            <TableCell>{p.employee?.employee_code || "- -"}</TableCell>
                            <TableCell className="text-capitalize">{p?.name || "NA"}</TableCell>
                            <TableCell>{p.type_of_pension}</TableCell>
                            <TableCell>{dateFormat(p.dor) || "NA"}</TableCell>
                            <TableCell>{dateFormat(p.end_date) || "NA"}</TableCell>
                            <TableCell>
                              { currentRoles.some(role => ['IT Admin', "Pensioners Operator"].includes(role)) ? (
                                <Select
                                  value={p.status || ""}
                                  onChange={(e) => handleStatusChange(p.id, e.target.value)}
                                  size="small"
                                >
                                  <MenuItem value="Active">Active</MenuItem>
                                  <MenuItem value="Inactive">Inactive</MenuItem>
                                </Select>
                              ) : (
                                <span>{p.status || "NA"}</span>
                              )}
                            </TableCell>
                            <TableCell align="right">
                              <IconButton onClick={(e) => handleMenuClick(e, p.id)}>
                                <MoreVertIcon />
                              </IconButton>
                              <Menu
                                anchorEl={anchorEl}
                                open={menuPensionerId === p.id}
                                onClose={handleMenuClose}
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                              >
                                <MenuItem onClick={() => handleView(p.id)}>
                                  <ViewIcon fontSize="small" /> View
                                </MenuItem>
                                <MenuItem onClick={() => handleHistoryStatus(p.id)}>
                                  <HistoryIcon fontSize="small" color="warning" /> History
                                </MenuItem>
                              </Menu>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
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
        firstRow={firstRow}
      />

    </>
  );
}
