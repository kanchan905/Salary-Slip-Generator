import React, { useEffect, useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    IconButton, TextField, TablePagination, Box
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
    fetchEmployeeLoan,
    createEmployeeLoan,
    updateEmployeeLoan,
} from '../../redux/slices/employeeLoanSlice';
import EmployeeLoanModal from '../../Modal/EmployeeLoan';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';



export default function EmployeeLoan() {
    const dispatch = useDispatch();
    const { loans, loading } = useSelector((state) => state.employeeLoan);
    const totalCount = useSelector((state) => state.employeeLoan.totalCount) || 0;
    const { error } = useSelector((state) => state.employeeLoan)
    const [menuIndex, setMenuIndex] = useState(null);
    const [formOpen, setFormOpen] = useState(false);
    const [formMode, setFormMode] = useState('create');
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState({
        employee_id: "",
        loan_type: "",
        loan_amount: "",
        interest_rate: "",
        sanctioned_date: "",
        total_installments: "",
        current_installment: "",
        remaining_balance: "",
        is_active: ""
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const navigate = useNavigate();
    const { name } = useSelector((state) => state.auth.user.role);


    useEffect(() => {
        dispatch(fetchEmployeeLoan({ id: searchQuery, page, limit: rowsPerPage }));
    }, [dispatch, searchQuery]);

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
                loan_type: "",
                loan_amount: "",
                interest_rate: "",
                sanctioned_date: "",
                total_installments: "",
                current_installment: "",
                remaining_balance: "",
                is_active: ""
            });
            setFormMode('create');
        }
        setFormOpen(!formOpen);
    };

    const handleEdit = (row) => {
        setEditId(row.id);
        setFormMode('edit');
        setFormData({
            employee_id: row.employee_id || '',
            loan_type: row.loan_type || '',
            loan_amount: row.loan_amount || '',
            interest_rate: row.interest_rate || '',
            sanctioned_date: row.sanctioned_date || '',
            total_installments: row.total_installments || '',
            current_installment: row.current_installment || '',
            remaining_balance: row.remaining_balance || '',
            is_active: row.is_active ?? 1,
        });
        setFormOpen(true);
        handleClose();
        console.log(formData);
    };

    const handleSubmit = (values, { setSubmitting, resetForm }) => {
        console.log(values)
        if (formMode === 'edit') {
            dispatch(updateEmployeeLoan({ id: editId, values: values }))
                .unwrap()
                .then(() => {
                    toast.success("EmployeeLoan updated successfully");
                    dispatch(fetchEmployeeLoan({ id: searchQuery, page, limit: rowsPerPage }));
                })
                .catch((err) => {
                    const apiMsg =
                        err?.response?.data?.message ||
                        err?.message ||
                        'Failed to save pensioner.';
                    toast.error(apiMsg);
                });
        } else {
            dispatch(createEmployeeLoan(values))
                .unwrap()
                .then(() => {
                    toast.success("EmployeeLoan added");
                    dispatch(fetchEmployeeLoan({ id: searchQuery, page, limit: rowsPerPage }));
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

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleView = (id) => {
        handleClose();
        navigate(`/employee-loan/view/${id}`);
    };

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
                        <div className="custom-scrollbar">
                            {loading ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <CircularProgress />
                                </Box>
                            ) : (
                                <TableContainer component={Paper} style={{ boxShadow: "none"}}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>                                              
                                                <TableCell style={{ fontWeight: "900" }}>Loan Type</TableCell>
                                                <TableCell style={{ fontWeight: "900" }}>Loan Amount</TableCell>
                                                <TableCell style={{ fontWeight: "900" }}>Interest Rate</TableCell>
                                                <TableCell style={{ fontWeight: "900" }}>Sanctioned Date</TableCell>
                                                <TableCell style={{ fontWeight: "900" }}>Total Installments</TableCell>
                                                <TableCell style={{ fontWeight: "900" }}>Current Installment</TableCell>                                               
                                                <TableCell style={{ fontWeight: "900" }}>Status</TableCell>                                              
                                                <TableCell style={{ fontWeight: "900" }}>Action</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {loans.map((row, idx) => (
                                                <TableRow key={row.id}>                                              
                                                    <TableCell>{row.loan_type}</TableCell>
                                                    <TableCell>{row.loan_amount}</TableCell>
                                                    <TableCell>{row.interest_rate}</TableCell>
                                                    <TableCell>{row.sanctioned_date}</TableCell>
                                                    <TableCell>{row.total_installments}</TableCell>
                                                    <TableCell>{row.current_installment}</TableCell>                                                  
                                                    <TableCell>{row.is_active ? 'Active' : 'Inactive'}</TableCell>                                                  
                                                    <TableCell align="left">
                                                        <IconButton onClick={handleMenuClick}>
                                                            <MoreVertIcon />
                                                        </IconButton>
                                                        <Menu
                                                            anchorEl={anchorEl}
                                                            open={Boolean(anchorEl)}
                                                            onClose={handleClose}
                                                            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                                                        >
                                                            <MenuItem onClick={()=> handleEdit(row)}>
                                                                <EditIcon fontSize="small" sx={{ mr: 1 }} /> Edit
                                                            </MenuItem>
                                                            <MenuItem onClick={()=> handleView(row.id)}>
                                                                <VisibilityIcon fontSize="small" sx={{ mr: 1 }} /> View
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
                <EmployeeLoanModal
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
