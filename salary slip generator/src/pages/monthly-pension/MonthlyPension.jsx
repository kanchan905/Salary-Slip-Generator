import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  TablePagination, Box,
  IconButton
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
  monthlyPensionDetailShow,
  updateMonthlyPension,
} from '../../redux/slices/monthlyPensionSlice';
import MonthlyPensionModal from '../../Modal/MonthlyPension';
import HistoryIcon from '@mui/icons-material/History';
import HistoryModal from 'Modal/HistoryModal';
import ViewIcon from '@mui/icons-material/Visibility';
import { MenuItem } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import { useNavigate } from 'react-router-dom';

export default function MonthlyPension() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { monthlyPension, loading } = useSelector((state) => state.monthlypension);
  const totalCount = useSelector((state) => state.monthlypension.totalCount) || 0;
  const { error } = useSelector((state) => state.monthlypension);
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    pension_related_info_id: '',
    dr_id: '',
    remarks: '',
    status: '',
    pensioner_id: '',
    pensioner_bank_id: '',
    month: '',
    year: '',
    processing_date: '',
    payment_date: '',
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [renderFunction, setRenderFunction] = useState(() => null);
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
  const toggleHistoryModal = () => {
    setIsHistoryModalOpen(!isHistoryModalOpen);
    if (isHistoryModalOpen) setHistoryRecord([]);
    handleMenuClose();
  };
  const [modalOpen, setModalOpen] = useState(false);
  const { name } = useSelector((state) => state.auth.user.role);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuMothlyId, setMenuMonthlyId] = useState(null);
  const [mode, setMode] = useState('');

  const getTableConfig = (type) => {
    switch (type) {
      case "monthly":
        return {
          head: [
            "Sr. No.",
            "Pensioner Name",
            "PPO No.",
            "Basic Pension",
            "Additional Pension",
            "Net Pension",
            "DR %",
            "DR Amount",
            "Medical Allowance",
            "Total Arrear",
            "Total Pension",
            "Remarks",
            "Status",
            "Added By",
            "Edited By"
          ],
          renderRow: (record, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{record?.net_pension?.pensioner?.name ?? "NA"}</td>
              <td>{record?.net_pension?.pensioner?.ppo_no ?? "NA"}</td>
              <td>{record.basic_pension ?? "NA"}</td>
              <td>{record.additional_pension ?? "NA"}</td>
              <td>{record.net_pension?.net_pension ?? "NA"}</td>
              <td>{record?.dearness?.dr_percentage ?? "NA"}</td>
              <td>{record?.dr_amount ?? "NA"}</td>
              <td>{record?.medical_allowance || "NA"}</td>
              <td>{record?.total_arrear || "NA"}</td>
              <td>{record?.total_pension || "NA"}</td>
              <td>{record?.remarks || "NA"}</td>
              <td>{record?.status || "NA"}</td>
              <td>{record?.added_by?.name || "NA"}</td>
              <td>{record?.edited_by?.name || "NA"}</td>
            </tr>
          ),
        };
      default:
        return null;
    }
  };

  const handleHistoryStatus = (id) => {
    handleMenuClose();
    dispatch(monthlyPensionDetailShow(id)).then((res) => {
      const history = res.payload?.data.history || [];
      if (Array.isArray(history)) {
        const config = getTableConfig("monthly");
        setHistoryRecord(history);
        setTableHead(config.head);
        setRenderFunction(() => config.renderRow);
        toggleHistoryModal();
      } else {
        setHistoryRecord([]);
      }
    });
  };

  useEffect(() => {
    dispatch(monthlyPensionDetails());
  }, [dispatch]);

  const handlePageChange = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    if (mode === 'create') {
      console.log('creating..');
      dispatch(createMonthlyPension(values))
        .unwrap()
        .then(() => {
          toast.success(`Monthly Pension added`);
          dispatch(monthlyPensionDetails());
        })
        .catch((err) => {
          const apiMsg = err?.response?.data?.message || err?.message || 'Failed to save Monthly Pension.';
          toast.error(apiMsg);
        });
    }
    console.log('updating...');
    dispatch(updateMonthlyPension({ id: menuMothlyId, values }))
      .unwrap()
      .then(() => {
        toast.success(`Monthly Pension updated`);
        dispatch(monthlyPensionDetails());
      })
      .catch((err) => {
        const apiMsg = err?.response?.data?.message || err?.message || 'Failed to save Monthly Pension.';
        toast.error(apiMsg);
      });
    resetForm();
    setFormOpen(false);
    setSubmitting(false);

    console.log('updating')
  };

  const handleToggleModal = (id = null) => {
    if (id) {
      const record = monthlyPension.find(item => item.id === id);
      if (record) {
        setFormData(record);
        setMode("edit");
        setModalOpen(true);
        setMenuMonthlyId(id);
      } else {
        toast.error("Record not found");
      }
    } else {
      setFormData({
        pension_related_info_id: '',
        dr_id: '',
        remarks: '',
        status: '',
        pensioner_id: '',
        pensioner_bank_id: '',
        month: '',
        year: '',
        processing_date: '',
        payment_date: '',
      });
      setMode("create");
      setModalOpen(true);
      setMenuMonthlyId(null);
    }
    handleMenuClose()
    console.log('mode', mode)
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuMonthlyId(null);
  };

  const handleMenuClick = (event, id) => {
    setAnchorEl(event.currentTarget);
    setMenuMonthlyId(id);
  };

  const handleView = (id) => {
    handleMenuClose();
    navigate(`/${name.toLowerCase()}/pensioner/monthly-pension/view/${id}`);
  };

  const handleEdit = (id) => {
    handleMenuClose();
    handleToggleModal(id);
  };

  return (
    <>
      <div className='header bg-gradient-info pb-8 pt-8 pt-md-8 main-head'></div>
      <div className="mt--7 mb-7 container-fluid">
        <Card className="card-stats mb-4 mb-lg-0">
          <CardHeader>
            <div className="d-flex justify-content-end align-items-center">
              <Button style={{ background: "#004080", color: "#fff" }} onClick={() => handleToggleModal(null)}>
                + Add
              </Button>
            </div>
          </CardHeader>
          <CardBody>
            <div>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <CircularProgress />
                </Box>
              ) : (
                <TableContainer component={Paper} style={{ boxShadow: "none" }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Pensioner Name</TableCell>
                        <TableCell>PPO No.</TableCell>
                        <TableCell>Basic Pension</TableCell>
                        <TableCell>Net Pension</TableCell>
                        <TableCell>Total Arrear</TableCell>
                        <TableCell>Total Pension</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Action </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {monthlyPension && monthlyPension.length > 0 ? (
                        monthlyPension.map((row, idx) => (
                          <TableRow key={row.id}>
                            <TableCell>{row?.net_pension?.pensioner?.name ?? "NA"}</TableCell>
                            <TableCell>{row?.net_pension?.pensioner?.ppo_no ?? "NA"}</TableCell>
                            <TableCell>{row.basic_pension ?? "NA"}</TableCell>
                            <TableCell>{row.net_pension?.net_pension ?? "NA"}</TableCell>
                            <TableCell>{row.total_arrear ?? "NA"}</TableCell>
                            <TableCell>{row.total_pension ?? "NA"}</TableCell>
                            <TableCell>{row.status ?? "NA"}</TableCell>
                            <TableCell align="right">
                              <IconButton onClick={(e) => handleMenuClick(e, row.id)}>
                                <MoreVertIcon />
                              </IconButton>
                              <Menu
                                anchorEl={anchorEl}
                                open={menuMothlyId === row.id}
                                onClose={handleMenuClose}
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                              >
                                <MenuItem onClick={() => handleView(row.id)}>
                                  <ViewIcon fontSize="small" /> View
                                </MenuItem>
                                <MenuItem onClick={() => handleEdit(row.id)}>
                                  <EditIcon fontSize="small" /> Edit
                                </MenuItem>
                                <MenuItem onClick={() => handleHistoryStatus(row.id)}>
                                  <HistoryIcon fontSize="small" /> History
                                </MenuItem>
                              </Menu>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={15} align="center">
                            No data available
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </div>
            <TablePagination
              component="div"
              count={totalCount}
              page={page}
              onPageChange={handlePageChange}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </CardBody>
        </Card>
        <MonthlyPensionModal
          formOpen={modalOpen}
          toggleModal={handleToggleModal}
          formData={formData}
          handleSubmit={handleSubmit}
          setFormOpen={setModalOpen}
          mode={mode}
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
