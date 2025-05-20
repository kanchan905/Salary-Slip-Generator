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
} from '../../redux/slices/netSalarySlice';
import NetSalaryModal from '../../Modal/NetSalaryModal';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ViewIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';

export default function NetSalary() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { name } = useSelector((state) => state.auth.user.role);
    const { netSalary, loading } = useSelector((state) => state.netSalary);
    const totalCount = useSelector((state) => state.netSalary.totalCount) || 0;
    const { error } = useSelector((state) => state.netSalary)
    const [anchorEl, setAnchorEl] = useState(null);
    const [menuIndex, setMenuIndex] = useState(null);
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

    useEffect(() => {
        dispatch(fetchNetSalary({id: searchQuery, page, limit: rowsPerPage }));
    }, [dispatch,searchQuery]);

    // const filteredData = dearness.filter((item) =>
    //   String(item.dr_percentage).toLowerCase().includes(searchQuery.toLowerCase())
    // );

    // const paginatedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

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
        setMenuIndex(null);
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
        setEditId(row.id);
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
        console.log(values)
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
                        'Failed to save pensioner.';
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
                        'Failed to save pensioner.';
                    toast.error(apiMsg);
                });
        }
        resetForm();
        setFormOpen(false);
        setEditId(null);
        setSubmitting(false);
    };

    const handleMenuClick = (event, index) => {
        setAnchorEl(event.currentTarget);
        setMenuIndex(index);
    };

    const handleView = (id) => {
        handleClose();
        navigate(`/${name.toLowerCase()}/employee/net-salary/${id}`);
    }

    return (
        <>
            <div className='header bg-gradient-info pb-8 pt-8 pt-md-8 main-head'></div>
            <div className="mt--7 mb-7 container-fluid">
                <Card className="card-stats mb-4 mb-lg-0">
                    <CardHeader>
                        <div className="d-flex justify-content-between align-items-center">
                            <TextField placeholder="Employee Id" onChange={handleSearchChange} />
                            <Button style={{ background: "#004080", color: "#fff" }} onClick={() => toggleModal("create")}>
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
                                <TableContainer component={Paper} style={{ boxShadow: "none", minWidth: 1500 }}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Employee Id</TableCell>
                                                <TableCell>Month</TableCell>
                                                <TableCell>Year</TableCell>
                                                <TableCell>Processing Date</TableCell>
                                                <TableCell>Net Amount</TableCell>
                                                <TableCell>Payment Date</TableCell>
                                                <TableCell>Bank Id</TableCell>
                                                <TableCell>Varified By</TableCell>
                                                <TableCell>Add By</TableCell>
                                                <TableCell>Edit By</TableCell>
                                                <TableCell>Action</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {netSalary.map((row, idx) => (
                                                <TableRow key={row.id}>
                                                    <TableCell>{row.employee_id}</TableCell>
                                                    <TableCell>{row.month}</TableCell>
                                                    <TableCell>{row.year}</TableCell>
                                                    <TableCell>{row.processing_date}</TableCell>
                                                    <TableCell>{row.net_amount}</TableCell>
                                                    <TableCell>{row.payment_date}</TableCell>
                                                    <TableCell>{row.employee_bank_id}</TableCell>
                                                    <TableCell>{row.varifyby?.name}</TableCell>
                                                    <TableCell>{row.addby?.name}</TableCell>
                                                    <TableCell>{row.editby?.name}</TableCell>
                                                    <TableCell align="left">
                                                        <IconButton onClick={(e) => handleMenuClick(e, idx)}>
                                                            <MoreVertIcon />
                                                        </IconButton>
                                                        <Menu
                                                            anchorEl={anchorEl}
                                                            open={menuIndex === idx}
                                                            onClose={handleClose}
                                                            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                                                        >
                                                            <MenuItem
                                                            onClick={() => handleView(row.id)}
                                                            >
                                                                <ViewIcon fontSize="small" /> View
                                                            </MenuItem>
                                                            <MenuItem onClick={() => handleEdit(row)}>
                                                                <EditIcon fontSize="small" /> Edit
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
        </>
    );
}
