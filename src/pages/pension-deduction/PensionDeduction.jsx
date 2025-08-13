import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  IconButton, TablePagination, Box,
  Typography
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
  fetchPensionDeduction,
  createPensionDeduction,
  updatePensionDeduction,
  fetchPensionDeductionShow,
} from '../../redux/slices/pensionDeductionSlice';
import PensionDeductionModal from '../../Modal/PensionDeductionModal';
import HistoryIcon from '@mui/icons-material/History';
import HistoryModal from 'Modal/HistoryModal';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';





export default function PensionDeduction() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pension, loading } = useSelector((state) => state.pensionDeduction);
  const totalCount = useSelector((state) => state.pensionDeduction.totalCount) || 0;
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuIndex, setMenuIndex] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState('create');
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    net_pension_id: '',
    income_tax: '',
    description: '',
    recovery: '',
    other: ''
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
    setIsHistoryModalOpen(!isHistoryModalOpen)
     if (isHistoryModalOpen) setHistoryRecord([]);
    handleClose();
  };
  const { name } = useSelector((state) => state.auth.user.roles[0]);
  

  const getTableConfig = (type) => {
    switch (type) {
      case "deduction":
        return {
          head: [
            "Sr. No.",
            "Pension Name",
            "PPO No.",
            "Commutation Amount",
            "Income Tax",
            "Recovery",
            "Total Deduction",
            "Other",
            "Description",
            "Added By",
            "Edited By"
          ],
          renderRow: (record, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{record?.net_pension?.pensioner?.first_name ?? "NA"}</td>
              <td>{record?.net_pension?.pensioner?.ppo_no ?? "NA"}</td>
              <td>{record.commutation_amount ?? "NA"}</td>
              <td>{record.income_tax || "NA"}</td>
              <td>{record.recovery || "NA"}</td>
              <td>{record.amount || "NA"}</td>             
             <td>{record.other || "NA"}</td>
              <td>{record.description || "NA"}</td>
              <td>{record.added_by?.roles?.[0]?.name || "NA"}</td>
              <td>{record.edited_by?.roles?.[0]?.name || "NA"}</td>
            </tr>
          ),
        };

      // You can add more like designation, pay scale, etc.
      default:
        return { head: [], renderRow: () => null };
    }
  };

  const handleHistoryStatus = (id) => {
    handleClose();
    dispatch(fetchPensionDeductionShow(id)).then((res) => {
      const history = res.payload?.data.history || [];
      if (Array.isArray(history)) {
        const config = getTableConfig("deduction");
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
    dispatch(fetchPensionDeduction({ page: page + 1, limit: rowsPerPage }));
  }, [dispatch, page, rowsPerPage]);

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
        net_pension_id: '',
        income_tax: '',
        description: '',
        recovery: '',
        other: ''
      });
      setFormMode('create');
    }
    setFormOpen(!formOpen);
  };

  const handleEdit = (row) => {
    setEditId(row.id);
    setFormMode('edit');
    setFormData({
      net_pension_id: row.net_pension_id,
      income_tax: row.income_tax,
      recovery: row.recovery,
      description: row.description,
      other: row.other
    });
    setFormOpen(true);
    handleClose();
  };

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    if (formMode === 'edit') {
      dispatch(updatePensionDeduction({ id: editId, values: values }))
        .unwrap()
        .then(() => {
          toast.success("PensionDeduction updated successfully");
          dispatch(fetchPensionDeduction());
        })
        .catch((err) => {
          const apiMsg =
            err?.response?.data?.message ||
            err?.message ||
            'Failed to save pensioner.';
          toast.error(apiMsg);
        });
    } else {
      dispatch(createPensionDeduction(values))
        .unwrap()
        .then(() => {
          toast.success("PensionDeduction added");
          dispatch(fetchPensionDeduction());
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

  const handleView = (id) => {
    handleClose();
    navigate(`/pensioner/pension-deduction/view/${id}`);
  };

  const handleMenuClick = (event, id) => {
    setAnchorEl(event.currentTarget);
    setMenuIndex(id);
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
                  <Button style={{ background: "#004080", color: "#fff" }} onClick={() => toggleModal("create")}>
                    + Add
                  </Button>
                )
              }
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
                    <TableRow style={{ whiteSpace: "nowrap" }}>
                      <TableCell style={{ fontWeight: "900" }}>Sr. No.</TableCell>
                      <TableCell style={{ fontWeight: "900" }}>Emp. Code</TableCell>
                      <TableCell style={{ fontWeight: "900" }}>Pensioner Name</TableCell>
                      <TableCell style={{ fontWeight: "900" }}>PPO No.</TableCell>
                      <TableCell style={{ fontWeight: "900" }}>Commutation Amount</TableCell>
                      <TableCell style={{ fontWeight: "900" }}>Income Tax</TableCell>
                      <TableCell style={{ fontWeight: "900" }}>Recovery</TableCell>
                      <TableCell style={{ fontWeight: "900" }}>Total Deduction</TableCell>
                      <TableCell style={{ fontWeight: "900" }}>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pension.length === 0 ? (
                      <TableRow>
                        <TableCell align="center" colSpan={9}>No data available</TableCell>
                      </TableRow>
                    ) : (
                      <>
                        {pension.map((row, idx) => (
                          <TableRow key={row.id}>
                            <TableCell>{(page * rowsPerPage) + idx + 1}</TableCell>
                            <TableCell>{row.net_pension?.pensioner?.employee?.employee_code || "- -"}</TableCell>
                            <TableCell>{row.net_pension?.pensioner?.name || "NA"}</TableCell>
                            <TableCell>{row.net_pension?.pensioner?.ppo_no}</TableCell>
                            <TableCell>{row.commutation_amount ?? "NA"}</TableCell>
                            <TableCell>{row.income_tax ?? "NA"}</TableCell>
                            <TableCell>{row.recovery ?? "NA"}</TableCell>
                            <TableCell>{row.amount ?? "NA"}</TableCell>
                            <TableCell align="left">
                              <IconButton onClick={(e) => handleMenuClick(e, row.id)}>
                                <MoreVertIcon />
                              </IconButton>
                              <Menu
                                anchorEl={anchorEl}
                                open={menuIndex === row.id}
                                onClose={handleClose}
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                              >
                                {['IT Admin','Pension Coordinator'].includes(name) && (
                                  <MenuItem onClick={() => handleEdit(row)}>
                                    <EditIcon fontSize="small" sx={{ mr: 1 }} /> Edit
                                  </MenuItem>
                                )}
                                <MenuItem onClick={() => handleView(row.id)}>
                                  <VisibilityIcon fontSize="small" sx={{ mr: 1 }} /> View
                                </MenuItem>
                                <MenuItem onClick={() => handleHistoryStatus(row.id)}>
                                  <HistoryIcon fontSize="small" color='warning' sx={{ mr: 1 }} /> History
                                </MenuItem>
                              </Menu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </>
                    )}
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
        <PensionDeductionModal
          setFormOpen={setFormOpen}
          formOpen={formOpen}
          toggleModal={toggleModal}
          formMode={formMode}
          formData={formData}
          handleChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
          handleSubmit={handleSubmit}
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
