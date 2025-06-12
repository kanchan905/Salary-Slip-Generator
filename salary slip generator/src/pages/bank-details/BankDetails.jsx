import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  IconButton, Menu, MenuItem, TextField, Chip, TablePagination, Box
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import HistoryIcon from '@mui/icons-material/History';
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
  fetchBankDetails,
  createBankDetail,
  updateBankDetail,
  toggleBankDetailStatus,
  fetchBankShow
} from '../../redux/slices/bankSlice';
import BankFormModal from '../../Modal/BankFormModal';
import ViewIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';
import HistoryModal from 'Modal/HistoryModal';
import { fetchPensioners } from '../../redux/slices/pensionerSlice';

const statusChipColor = (status) => status ? "success" : "error";

export default function BankDetails() {
  const dispatch = useDispatch();
  const { bankdetails, loading } = useSelector((state) => state.bankdetail);
  const totalCount = useSelector((state) => state.bankdetail.totalCount) || 0;
  const { error } = useSelector((state) => state.bankdetail)
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState('create');
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    pensioner_id: '',
    bank_name: '',
    branch_name: '',
    account_no: '',
    ifsc_code: ''
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { name } = useSelector((state) => state.auth.user.role);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuBankDetailId, setMenuBankDetailId] = useState(null);
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
  const {pensioners} = useSelector((state) => state.pensioner);

  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const toggleHistoryModal = () => {
    setIsHistoryModalOpen(!isHistoryModalOpen);
    if (isHistoryModalOpen) setHistoryRecord([]);
    handleMenuClose();
  }

  const getTableConfig = (type) => {
    switch (type) {
      case "bank":
        return {
          head: [
            "Sr. No.",
            "Bank Name",
            "Branch Name",
            "Account No",
            "IFSC Code",
            "Status",
            "Added By",
            "Edited By"
          ],
          renderRow: (record, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{record?.bank_name}</td>
              <td>{record.branch_name || "NA"}</td>
              <td>{record.account_no || "NA"}</td>
              <td>{record.ifsc_code || "NA"}</td>
              <td>
                <Chip
                  label={record.is_active ? 'Active' : 'Inactive'}
                  color={record.is_active ? 'success' : 'error'}
                  variant="outlined"
                  size="small"
                />
              </td>
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

  const handleHistoryStatus = (id) => {
    handleMenuClose();
    dispatch(fetchBankShow(id)).then((res) => {
      const history = res.payload?.history || [];
      if (Array.isArray(history)) {
        const config = getTableConfig("bank");
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
    dispatch(fetchBankDetails({ page: page, limit: rowsPerPage, id: searchQuery }));
    dispatch(fetchPensioners({page:'1',limit:'1000',id:''}))
  }, [dispatch, page, rowsPerPage, searchQuery]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPage(0);
  };

  const handlePageChange = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const handleMenuClick = (event, id) => {
    setAnchorEl(event.currentTarget);
    setMenuBankDetailId(id);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuBankDetailId(null);
  };

  const toggleModal = (mode) => {
    if (mode === 'create') {
      setFormData({
        pensioner_id: '',
        bank_name: '',
        branch_name: '',
        account_no: '',
        ifsc_code: ''
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
      bank_name: row.bank_name,
      branch_name: row.branch_name,
      account_no: row.account_no,
      ifsc_code: row.ifsc_code
    });
    setFormOpen(true);
    handleMenuClose();
  };

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    if (formMode === 'edit') {
      dispatch(updateBankDetail({ id: editId, values: values }))
        .unwrap()
        .then(() => {
          dispatch(fetchBankDetails({ page: '', limit: '', id: '' }));
          toast.success("Bank detail updated successfully");
        })
        .catch((err) => {
          const apiMsg =
            err?.response?.data?.message ||
            err?.message ||
            'Bank detail updatation failed.';
          toast.error(apiMsg);
        });
    } else {
      dispatch(createBankDetail(values))
        .unwrap()
        .then(() => {
          dispatch(fetchBankDetails({ page: '', limit: '', id: '' }));
          toast.success("Bank detail added");
        })
        .catch((err) => {
          const apiMsg =
            err?.response?.data?.message ||
            err?.message ||
            'Failed to add bank detail.';
          toast.error(apiMsg);
        });
    }
    resetForm();
    setFormOpen(false);
    setEditId(null);
    setSubmitting(false);
  };

  const handleToggleStatus = async (row) => {
    dispatch(toggleBankDetailStatus({ id: row?.id })).unwrap()
      .then(() => {
        dispatch(fetchBankDetails({ page: '', limit: '', id: '' }));
        toast.success("Bank status updated");
      })
      .catch((err) => {
        const apiMsg =
          err?.response?.data?.message ||
          err?.message ||
          'Bank status Updatation Failed.';
        toast.error(apiMsg);
      });;
  };

  const handleView = (id) => {
    handleMenuClose();
    navigate(`/pensioner/bank-detail/view/${id}`);
  };



  return (
    <>
      <div className='header bg-gradient-info pb-8 pt-8 pt-md-8 main-head'></div>
      <div className="mt--7 mb-7 container-fluid">
        <Card className="card-stats mb-4 mb-lg-0">
          <CardHeader>
            <div className="d-flex justify-content-end align-items-center">
              {/* <TextField placeholder="pensioner id" onChange={handleSearchChange} /> */}
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
                      <TableCell style={{ fontWeight: "900" }}>Pensioner Name</TableCell>
                      <TableCell style={{ fontWeight: "900" }}>Bank Name</TableCell>
                      <TableCell style={{ fontWeight: "900" }}>Branch Name</TableCell>
                      <TableCell style={{ fontWeight: "900" }}>Account No</TableCell>
                      <TableCell style={{ fontWeight: "900" }}>IFSC</TableCell>
                      <TableCell style={{ fontWeight: "900" }}>Status</TableCell>
                      <TableCell align="right" style={{ fontWeight: "900" }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {bankdetails.map((row, idx) => (
                      <TableRow key={row.id}>                   
                        <TableCell>{row.pensioner?.first_name} {row.pensioner?.middle_name} {row.pensioner?.last_name}</TableCell>
                        <TableCell>{row.bank_name}</TableCell>
                        <TableCell>{row.branch_name}</TableCell>
                        <TableCell>{row.account_no}</TableCell>
                        <TableCell>{row.ifsc_code}</TableCell>
                        <TableCell>
                          <Chip
                            label={row.is_active ? 'Active' : 'Inactive'}
                            color={statusChipColor(row.is_active ? "Active" : "Inactive")}
                            variant="outlined"
                            size="small"
                            onClick={() => handleToggleStatus(row)}
                            style={{ cursor: 'pointer' }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <IconButton onClick={(e) => handleMenuClick(e, row.id)}>
                            <MoreVertIcon />
                          </IconButton>
                          <Menu
                            anchorEl={anchorEl}
                            open={menuBankDetailId === row.id}
                            onClose={handleMenuClose}
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                          >
                            <MenuItem onClick={() => handleEdit(row)}>
                              <EditIcon fontSize="small" color='primary' /> Edit
                            </MenuItem>
                            <MenuItem onClick={() => handleHistoryStatus(row.id)}>
                              <HistoryIcon fontSize="small" color='warning' /> History
                            </MenuItem>
                            <MenuItem onClick={() => handleView(row.pensioner_id)}>
                              <ViewIcon fontSize="small" /> View
                            </MenuItem>
                          </Menu>
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
        <BankFormModal
          setFormOpen={setFormOpen}
          formOpen={formOpen}
          toggleModal={toggleModal}
          formMode={formMode}
          formData={formData}
          handleChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
          handleSubmit={handleSubmit}
          pensioners={pensioners}
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
