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
    fetchCredits,
    createCredit,
    updateCredit,
} from '../../redux/slices/creditSlice';
import CreditSocietyMemberModal from '../../Modal/CreditModal';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';


export default function CreditSocietyMember() {
    const dispatch = useDispatch();
    const { credits, loading } = useSelector((state) => state.societyMember);
    const totalCount = useSelector((state) => state.societyMember.totalCount) || 0;
    const { error } = useSelector((state) => state.societyMember)
    const [anchorEl, setAnchorEl] = useState(null);
    const [menuIndex, setMenuIndex] = useState(null);
    const [formOpen, setFormOpen] = useState(false);
    const [formMode, setFormMode] = useState('create');
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState({
        employee_id: '',
        society_name: '',
        membership_number: '',
        joining_date: '',
        relieving_date: '',
        monthly_subscription: '',
        entrance_fee: '',
        is_active: '',
        effective_from: '',
        effective_till: '',
        remark: ''
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [menuAnchorEl, setMenuAnchorEl] = useState(null);
    const [menuRowId, setMenuRowId] = useState(null);
    const { name } = useSelector((state) => state.auth.user.role);
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(fetchCredits({ id: searchQuery, page, limit: rowsPerPage }));
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
                employee_id: '',
                society_name: '',
                membership_number: '',
                joining_date: '',
                relieving_date: '',
                monthly_subscription: '',
                entrance_fee: '',
                is_active: '',
                effective_from: '',
                effective_till: '',
                remark: ''
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
            society_name: row.society_name || '',
            membership_number: row.membership_number || '',
            joining_date: row.joining_date || '',
            relieving_date: row.relieving_date || '',
            monthly_subscription: row.monthly_subscription || '',
            entrance_fee: row.entrance_fee || '',
            is_active: row.is_active ?? 1,
            effective_from: row.effective_from || '',
            effective_till: row.effective_till || '',
            remark: row.remark || ''
        });
        setFormOpen(true);
        handleClose();
    };

    const handleSubmit = (values, { setSubmitting, resetForm }) => {
        console.log(values)
        if (formMode === 'edit') {
            dispatch(updateCredit({ id: editId, values: values }))
                .unwrap()
                .then(() => {
                    toast.success("Credit Soceity Member updated successfully");
                    dispatch(fetchCredits({ id: searchQuery, page, limit: rowsPerPage }));
                })
                .catch((err) => {
                    const apiMsg =
                        err?.response?.data?.message ||
                        err?.message ||
                        'Failed to save pensioner.';
                    toast.error(apiMsg);
                });
        } else {
            dispatch(createCredit(values))
                .unwrap()
                .then(() => {
                    toast.success("Credit Soceity Member added");
                    dispatch(fetchCredits({ id: searchQuery, page, limit: rowsPerPage }));
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

    const handleMenuClick = (event, id) => {
        setMenuAnchorEl(event.currentTarget);
        setMenuRowId(id);
    };

    const handleMenuClose = () => {
        setMenuAnchorEl(null);
        setMenuRowId(null);
    };

    const handleView = (id) => {
    handleMenuClose();
    navigate(`/employee/credit-society-member/view/${id}`);
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
                                <TableContainer component={Paper} style={{ boxShadow: "none" }}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>                                               
                                                <TableCell style={{ fontWeight: "900" }}>Society Name</TableCell>
                                                <TableCell style={{ fontWeight: "900" }}>Membership Number</TableCell>
                                                <TableCell style={{ fontWeight: "900" }}>Joining Date</TableCell>
                                                <TableCell style={{ fontWeight: "900" }}>Relieving Date</TableCell>
                                                <TableCell style={{ fontWeight: "900" }}>Monthly Subscription</TableCell>                                             
                                                <TableCell style={{ fontWeight: "900" }}>Status</TableCell>
                                                <TableCell style={{ fontWeight: "900" }}>Action</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {credits.map((row, idx) => (
                                                <TableRow key={row.id}>                                                  
                                                    <TableCell>{row.society_name}</TableCell>
                                                    <TableCell>{row.membership_number}</TableCell>
                                                    <TableCell>{row.joining_date}</TableCell>
                                                    <TableCell>{row.relieving_date}</TableCell>
                                                    <TableCell>{row.monthly_subscription}</TableCell>                                                    
                                                    <TableCell>{row.is_active ? 'Active' : 'Inactive'}</TableCell>                                                                                     
                                                    <TableCell align="left">
                                                        <IconButton onClick={(e) => handleMenuClick(e, row.id)}>
                                                            <MoreVertIcon />
                                                        </IconButton>
                                                        <Menu
                                                            anchorEl={menuAnchorEl}
                                                            open={menuRowId === row.id}
                                                            onClose={handleMenuClose}
                                                            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                                                        >
                                                            <MenuItem onClick={() => { handleEdit(row); handleMenuClose(); }}>
                                                                <EditIcon fontSize="small" sx={{ mr: 1 }} /> Edit
                                                            </MenuItem>
                                                            <MenuItem onClick={() => handleView(row.id)}>
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
                <CreditSocietyMemberModal
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
