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
  const { name } = useSelector((state) => state.auth.user.roles[0]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [mode, setMode] = useState('');
  const [editingId, setEditingId] = useState(null);

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
            "Gross Pension",
            "Remarks",
            "Status",
            "Added By",
            "Edited By"
          ],
          renderRow: (record, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td className='text-capitalize'>{record?.net_pension?.pensioner?.name ?? "NA"}</td>
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
              <td>{record?.added_by?.roles?.[0]?.name || "NA"}</td>
              <td>{record?.edited_by?.roles?.[0]?.name || "NA"}</td>
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
    dispatch(monthlyPensionDetails({ page: page + 1, limit: rowsPerPage }));
  }, [dispatch, page, rowsPerPage]);

  const handlePageChange = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };


  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    if (mode === 'create') {
      dispatch(createMonthlyPension(values))
        .unwrap()
        .then(() => {
          toast.success(`Monthly Pension added`);
          dispatch(monthlyPensionDetails());
          resetForm();
          setModalOpen(false);
        })
        .catch((err) => {
          const apiMsg = err?.response?.data?.message || err?.message || 'Failed to save Monthly Pension.';
          toast.error(apiMsg);
        })
        .finally(() => setSubmitting(false));
    } else if (mode === 'edit') {
      const { pension_related_info_id, dr_id, status, remarks, net_pension_id } = values;
      dispatch(updateMonthlyPension({ id: editingId, values: { pension_related_info_id, dr_id, status, remarks, net_pension_id } }))
        .unwrap()
        .then(() => {
          toast.success(`Monthly Pension updated`);
          dispatch(monthlyPensionDetails());
          resetForm();
          setModalOpen(false);
        })
        .catch((err) => {
          const apiMsg = err?.response?.data?.message || err?.message || 'Failed to update Monthly Pension.';
          toast.error(apiMsg);
        })
        .finally(() => setSubmitting(false));
    }
  };

  const handleToggleModal = (id = null) => {
    if (id) {
      const record = monthlyPension.find(item => item.id === id);
      if (record) {
        setFormData({
          pension_related_info_id: record.pension_rel_info_id || '',
          dr_id: record.dr_id || '',
          remarks: record.remarks || '',
          status: record.status || '',
          net_pension_id: record.net_pension_id || '',
          pensioner_id: record.pension_related_info.pensioner_id || '',
        }
        );
        setMode("edit");
        setEditingId(id);
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
      setEditingId(null)
    }
    setModalOpen(true);
    handleMenuClose();
  };


  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuClick = (event, id) => {
    setAnchorEl(event.currentTarget);
    setEditingId(id)
  };

  const handleView = (id) => {
    handleMenuClose();
    navigate(`/pensioner/monthly-pension/view/${id}`);
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
              {
                ['IT Admin','Pension Coordinator'].includes(name) && (
                  <Button style={{ background: "#004080", color: "#fff" }} onClick={() => handleToggleModal(null)}>
                    + Add
                  </Button>
                )
              }
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
                      <TableRow style={{whiteSpace: "nowrap"}}>
                        <TableCell style={{ fontWeight: "900" }}>Sr. No.</TableCell>
                        <TableCell style={{ fontWeight: "900" }}>Emp. Code</TableCell>
                        <TableCell style={{ fontWeight: "900" }}>Pensioner Name</TableCell>
                        <TableCell style={{ fontWeight: "900" }}>PPO No.</TableCell>
                        <TableCell style={{ fontWeight: "900" }}>Basic Pension</TableCell>
                        <TableCell style={{ fontWeight: "900" }}>Total Arrear</TableCell>
                        <TableCell style={{ fontWeight: "900" }}>Gross Pension</TableCell>
                        <TableCell style={{ fontWeight: "900" }}>Status</TableCell>
                        <TableCell style={{ fontWeight: "900" }}>Action </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {monthlyPension && monthlyPension.length > 0 ? (
                        monthlyPension.map((row, idx) => (
                          <TableRow key={row.id} style={{whiteSpace: "nowrap"}}>
                            <TableCell>{(page * rowsPerPage) + idx + 1}</TableCell>
                            <TableCell className='text-uppsercase'>{row.net_pension?.pensioner?.employee?.employee_code || "- -"}</TableCell>
                            <TableCell className='text-capitalize'>{row?.net_pension?.pensioner?.name || "NA"}</TableCell>
                            <TableCell>{row?.net_pension?.pensioner?.ppo_no ?? "NA"}</TableCell>
                            <TableCell>{row.basic_pension ?? "NA"}</TableCell>
                            <TableCell>{row.total_arrear ?? "NA"}</TableCell>
                            <TableCell>{row.total_pension ?? "NA"}</TableCell>
                            <TableCell>{row.status ?? "NA"}</TableCell>
                            <TableCell align="right">
                              <IconButton onClick={(e) => handleMenuClick(e, row.id)}>
                                <MoreVertIcon />
                              </IconButton>
                              <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleMenuClose}
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                                PaperProps={{
                                  style: {
                                    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
                                    border: '1px solid #e0e0e0',
                                  },
                                }}
                              >
                                <MenuItem onClick={() => handleView(row.id)}>
                                  <ViewIcon fontSize="small" /> View
                                </MenuItem>
                                {
                                   ['IT Admin','Pension Coordinator'].includes(name) && (
                                    <MenuItem onClick={() => handleEdit(row.id)}>
                                      <EditIcon fontSize="small" /> Edit
                                    </MenuItem>
                                  )
                                }
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
          setFormData={setFormData}
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
      <style>{`
  .table-responsive {
    width: 100%;
    overflow-x: auto;
  }
  .filter-row {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }
  .filter-item {
    min-width: 160px;
  }
  @media (max-width: 768px) {
    .table-responsive {
      overflow-x: auto;
    }
    .filter-row {
      flex-direction: column !important;
      align-items: stretch !important;
      gap: 0.75rem;
    }
    .filter-item {
      width: 100% !important;
      min-width: 0 !important;
    }
  }
`}</style>
    </>
  );
}
