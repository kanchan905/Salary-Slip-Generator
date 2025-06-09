import React, { useEffect, useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    IconButton, TextField, TablePagination, Box, Menu, MenuItem
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
    fetchNetSalary,
    createNetSalary,
    updateNetSalary,
    viewNetSalary,
} from '../../redux/slices/netSalarySlice';
import NetSalaryModal from '../../Modal/NetSalaryModal';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ViewIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';
import HistoryIcon from '@mui/icons-material/History';
import HistoryModal from 'Modal/HistoryModal';
import { months } from 'utils/helpers';

export default function NetSalary() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { name } = useSelector((state) => state.auth.user.role);
    const { netSalary, netSalaryData, loading } = useSelector((state) => state.netSalary);
    const totalCount = useSelector((state) => state.netSalary.totalCount) || 0;
    const { error } = useSelector((state) => state.netSalary)
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedRow, setSelectedRow] = useState(null);
    const [formOpen, setFormOpen] = useState(false);
    const [formMode, setFormMode] = useState('create');
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState({
        employee_id: "",
        month: "",
        year: "",
        processing_date: "",
        net_amount: "",
        payment_date: "",
        employee_bank_id: "",
    });
    const [searchQuery, setSearchQuery] = useState('');
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

    const getTableConfig = (type) => {
        switch (type) {
            case "NetSalary":
                return {
                    head: [
                        "Sr. No.",
                        "Employee Code",
                        "Month",
                        "Net Amount",
                        "Processing Date",
                        "Payment Date",
                        "Verified By",
                        "Added By",
                        "Edited By"
                    ],
                    renderRow: (record, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{record?.employee_id}</td>
                            <td>{months.find((m) => m.value === record.month)?.label || 'NA'}</td>
                            <td>{record.net_amount || "NA"}</td>
                            <td>{record.processing_date || "NA"}</td>
                            <td>{record.payment_date || "NA"}</td>
                            <td>{record.verified_by?.name}</td>
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
        handleClose();
        dispatch(viewNetSalary(id)).then((res) => {
          const history = res.payload?.history;
            if (Array.isArray(history)) {
          const config = getTableConfig("NetSalary");
          setHistoryRecord(history);
          setTableHead(config.head);
          setRenderFunction(() => config.renderRow);
          toggleHistoryModal();
        }else {
          setHistoryRecord([]);
        } 
        });
    };


    useEffect(() => {
        dispatch(fetchNetSalary({ id: searchQuery, page, limit: rowsPerPage }));
    }, [dispatch, searchQuery]);


    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setPage(0);
    };

    const handlePageChange = (_, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (e) => {
        setRowsPerPage(parseInt(e.target.value, 10));
        setPage(0);
    };


    const handleClose = () => {
        setAnchorEl(null);
        setSelectedRow(null)
    };

    const toggleModal = (mode) => {
        if (mode === 'create') {
            setFormData({
                employee_id: "",
                month: "",
                year: "",
                processing_date: "",
                net_amount: "",
                payment_date: "",
                employee_bank_id: "",
            });
            setFormMode('create');
        }
        setFormOpen(!formOpen);
    };

    const handleEdit = (row) => {
        setEditId(row.id)
        setFormMode('edit');
        setFormData({
            employee_id: row.employee_id || "",
            month: row.month || "",
            year: row.year || "",
            processing_date: row.processing_date || "",
            net_amount: row.net_amount || "",
            payment_date: row.payment_date || "",
            employee_bank_id: row.employee_bank_id || "",
        });
        setFormOpen(true);
        handleClose();
    };

    const handleSubmit = (values, { setSubmitting, resetForm }) => {
        if (formMode === 'edit') {
            dispatch(updateNetSalary({ id: editId, values: values }))
                .unwrap()
                .then(() => {
                    toast.success("NetSalary updated successfully");
                    dispatch(fetchNetSalary({ page, limit: rowsPerPage }));
                })
                .catch((err) => {
                    const apiMsg =
                        err?.response?.data?.message ||
                        err?.message ||
                        'Failed to save net salary.';
                    toast.error(apiMsg);
                });
        } else {
            dispatch(createNetSalary(values))
                .unwrap()
                .then(() => {
                    toast.success("NetSalary added");
                    dispatch(fetchNetSalary({ page, limit: rowsPerPage }));
                })
                .catch((err) => {
                    const apiMsg =
                        err?.response?.data?.message ||
                        err?.message ||
                        'Failed to save net salary.';
                    toast.error(apiMsg);
                });
        }
        resetForm();
        setFormOpen(false);
        setEditId(null);
        setSubmitting(false);
    };

    const handleMenuClick = (event, row) => {
        setAnchorEl(event.currentTarget);
        setSelectedRow(row);
    };

    const handleView = (id) => {
        handleClose();
        navigate(`/${name.toLowerCase()}/employee/net-salary/${id}`);
    }

    const isValidAnchorEl = document.body.contains(anchorEl);


    return (
        <>
            <div className='header bg-gradient-info pb-8 pt-8 pt-md-8 main-head'></div>
            <div className="mt--7 mb-7 container-fluid">
                <Card className="card-stats mb-4 mb-lg-0">
                    <CardHeader>
                        <div className="d-flex justify-content-between align-items-center">
                            <TextField placeholder="Employee Id" onChange={handleSearchChange} />
                            {/* <Button style={{ background: "#004080", color: "#fff" }} onClick={() => toggleModal("create")}>
                                + Add
                            </Button> */}
                        </div>
                    </CardHeader>
                    <CardBody>
                        <div className="custom-scrollbar">
                            {loading ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <CircularProgress />
                                </Box>
                            ) : (
                                <TableContainer component={Paper} style={{ boxShadow: "none" }}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell style={{ fontWeight: "900" }}>Month</TableCell>
                                                <TableCell style={{ fontWeight: "900" }}>Year</TableCell>
                                                <TableCell style={{ fontWeight: "900" }}>Processing Date</TableCell>
                                                <TableCell style={{ fontWeight: "900" }}>Net Amount</TableCell>
                                                <TableCell style={{ fontWeight: "900" }}>Payment Date</TableCell>
                                                <TableCell style={{ fontWeight: "900" }}>Bank Id</TableCell>
                                                <TableCell style={{ fontWeight: "900" }}>Action</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {netSalary.map((row, idx) => (
                                                <TableRow key={row.id}>
                                                    <TableCell>{row.month}</TableCell>
                                                    <TableCell>{row.year}</TableCell>
                                                    <TableCell>{row.processing_date}</TableCell>
                                                    <TableCell>{row.net_amount}</TableCell>
                                                    <TableCell>{row.payment_date}</TableCell>
                                                    <TableCell>{row.employee_bank_id}</TableCell>
                                                    <TableCell align="left">
                                                        <IconButton onClick={(e) => handleMenuClick(e, row)}>
                                                            <MoreVertIcon />
                                                        </IconButton>
                                                        <Menu
                                                            anchorEl={anchorEl}
                                                            open={selectedRow === row}
                                                            onClose={handleClose}
                                                            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                                                        >
                                                            <MenuItem
                                                                onClick={() => handleView(row.id)}
                                                            >
                                                                <ViewIcon fontSize="small" /> View
                                                            </MenuItem>
                                                            <MenuItem onClick={() => handleEdit(selectedRow)}>
                                                                <EditIcon fontSize="small" /> Edit
                                                            </MenuItem>
                                                            <MenuItem onClick={() => handleHistoryStatus(row.id)}>
                                                                <HistoryIcon fontSize="small" /> History
                                                            </MenuItem>
                                                        </Menu>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
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
                <NetSalaryModal
                    setFormOpen={setFormOpen}
                    formOpen={formOpen}
                    toggleModal={toggleModal}
                    formMode={formMode}
                    formData={formData}
                    handleChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
                    handleSubmit={handleSubmit}
                />
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
