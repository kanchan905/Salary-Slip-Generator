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

    useEffect(() => {
        dispatch(fetchCredits({ id: searchQuery, page, limit: rowsPerPage }));
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
            society_name: row.society_name ||'',
            membership_number: row.membership_number ||'',
            joining_date: row.joining_date ||'',
            relieving_date:row.relieving_date || '',
            monthly_subscription: row.monthly_subscription ||'',
            entrance_fee: row.entrance_fee ||'',
            is_active: row.is_active?? 1,
            effective_from:row.effective_from || '',
            effective_till: row.effective_till ||'',
            remark: row.remark ||''
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
                                                <TableCell>Id</TableCell>
                                                <TableCell>Society Name</TableCell>
                                                <TableCell>Membership Number</TableCell>
                                                <TableCell>Joining Date</TableCell>
                                                <TableCell>Relieving Date</TableCell>
                                                <TableCell>Monthly Subscription</TableCell>
                                                <TableCell>Entrance Fee</TableCell>
                                                <TableCell>Status</TableCell>
                                                <TableCell>Effective From</TableCell>
                                                <TableCell>Effective Till</TableCell>
                                                <TableCell>Remark</TableCell>
                                                <TableCell>Add By</TableCell>
                                                <TableCell>Edit By</TableCell>
                                                <TableCell>Action</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {credits.map((row, idx) => (
                                                <TableRow key={row.id}>
                                                    <TableCell>{row.employee_id}</TableCell>
                                                    <TableCell>{row.society_name}</TableCell>
                                                    <TableCell>{row.membership_number}</TableCell>
                                                    <TableCell>{row.joining_date}</TableCell>
                                                    <TableCell>{row.relieving_date}</TableCell>
                                                    <TableCell>{row.monthly_subscription}</TableCell>
                                                    <TableCell>{row.entrance_fee}</TableCell>
                                                    <TableCell>{row.is_active ? 'Active' : 'Inactive'}</TableCell>
                                                    <TableCell>{row.effective_from}</TableCell>
                                                    <TableCell>{row.effective_till}</TableCell>
                                                    <TableCell>{row.remark}</TableCell>
                                                    <TableCell>{row.added_by?.name}</TableCell>
                                                    <TableCell>{row.edited_by?.name}</TableCell>
                                                    <TableCell align="left">
                                                        <IconButton onClick={() => handleEdit(row)}>
                                                            <EditIcon fontSize="small" />
                                                        </IconButton>
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
