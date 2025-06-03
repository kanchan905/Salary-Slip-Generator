import React, { useEffect } from 'react';
import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, IconButton,
    Menu, MenuItem, TextField, Chip,
    TablePagination,
    Box
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import {
    Button,
    Card,
    CardHeader,
    CardBody,
} from "reactstrap";
import { useDispatch, useSelector } from 'react-redux';
import { changeUserStatus, createUserData, fetchUserData, updateUserData } from '../../redux/slices/userSlice';
import UserFormModal from "../../Modal/UserFormModal";
import CircularProgress from '@mui/material/CircularProgress';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';



const statusChipColor = (status) => {
    switch (status) {
        case "Active": return "success";
        case "Banned": return "error";
        default: return "default";
    }
};

export default function UserTable() {
    const navigate = useNavigate();
    const { name } = useSelector((state) => state.auth.user.role);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [menuUserIndex, setMenuUserIndex] = React.useState(null);
    const [formOpen, setFormOpen] = React.useState(false);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const dispatch = useDispatch();
    const users = useSelector((state) => state.user.users);
    const totalCount = useSelector((state) => state.user.totalCount);
    const loading = useSelector((state) => state.user.loading);
    const [editId, setEditId] = React.useState(null);
    const errror = useSelector((state) => state.user.error);

    useEffect(() => {
        dispatch(fetchUserData({ page: page, limit: rowsPerPage }))
    }, [dispatch, page, rowsPerPage]);

    const [formMode, setFormMode] = React.useState('create');

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleMenuClick = (event, index) => {
        setAnchorEl(event.currentTarget);
        setMenuUserIndex(index);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setMenuUserIndex(null);
    };

    const [formData, setFormData] = React.useState({
        name: '',
        password: '',
        email: '',
        institute: '',
        role_id: '',
    });

    const toggleModal = (mode) => {
        if (mode === "create") {
            setFormData({
                name: '',
                password: '',
                email: '',
                institute: '',
                role_id: '',
            });
            setFormMode('create');
        }
        setFormOpen(!formOpen);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (values, { setSubmitting, resetForm }) => {
        console.log("Edit User", values);
        if (formMode === 'edit') {
            const { password, ...rest } = values;
            dispatch(updateUserData({ formData: rest, id: editId })).unwrap()
                .then(() => {
                    toast.success('User updated successfully');
                    dispatch(fetchUserData({ page: page, limit: rowsPerPage }))
                })
                .catch((err) => {
                    const apiMsg =
                        err?.response?.data?.message ||
                        err?.message ||
                        err?.message ||
                        'Failed to update user.';
                    toast.error(apiMsg);
                });

        } else {
            dispatch(createUserData(values)).unwrap()
                .then(() => {
                    toast.success('User created successfully');
                    dispatch(fetchUserData({ page: page, limit: rowsPerPage }))
                })
                .catch((err) => {
                    const apiMsg =
                        err?.response?.data?.message ||
                        err?.message ||
                        err?.message ||
                        'Failed to create user.';
                    toast.error(apiMsg);
                });
        }
        resetForm();
        setFormOpen(false);
        setEditId(null);
        setSubmitting(false);
    };

    const handleEdit = (user) => {
        setEditId(user.id);
        handleClose();
        setFormData({
            name: user.name || '',
            password: '',
            email: user.email || '',
            institute: user.institute || 'NIOH',
            role_id: user.role_id || '',
        });
        setFormMode('edit');
        setFormOpen(true);
    };

    const handleToggleStatus = async (user) => {
        await dispatch(changeUserStatus({ id: user.id }));
        dispatch(fetchUserData({ page, limit: rowsPerPage }));
    };

    return (
        <>
            <div className='header bg-gradient-info pb-8 pt-8 pt-md-8 main-head'></div>
            <div className="mt--7 mb-7 container-fluid">
                <Card className="card-stats mb-4 mb-lg-0" >
                    <CardHeader>
                        <div className="d-flex justify-content-end align-items-center">
                            <Button
                                style={{ background: "#004080", color: '#fff' }}
                                type="button"
                                // onClick={() => toggleModal("create")}
                                onClick={()=> navigate(`/${name.toLowerCase()}/user`)}
                            >
                                + Add User
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
                                            <TableCell style={{ fontWeight: "900" }}>Role Name</TableCell>
                                            <TableCell style={{ fontWeight: "900" }}>Name</TableCell>
                                            <TableCell style={{ fontWeight: "900" }}>Email</TableCell>
                                            <TableCell style={{ fontWeight: "900" }}>Institute</TableCell>
                                            <TableCell style={{ fontWeight: "900" }}>Status</TableCell>
                                            <TableCell align="right" style={{ fontWeight: "900" }}>Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {users.map((user, idx) => (
                                            <TableRow key={idx}>
                                                <TableCell>{user?.role?.name}</TableCell>
                                                <TableCell>{user.name}</TableCell>
                                                <TableCell>{user.email}</TableCell>
                                                <TableCell>{user.institute}</TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={user.is_active ? 'Active' : 'Inactive'}
                                                        color={statusChipColor(user.is_active ? "Active" : "Inactive")}
                                                        variant="outlined"
                                                        size="small"
                                                        onClick={() => handleToggleStatus(user)}
                                                        style={{ cursor: 'pointer' }}
                                                    />
                                                </TableCell>
                                                <TableCell align="right">
                                                    <IconButton onClick={(e) => handleMenuClick(e, idx)}>
                                                        <MoreVertIcon />
                                                    </IconButton>
                                                    <Menu
                                                        anchorEl={anchorEl}
                                                        open={menuUserIndex === idx}
                                                        onClose={handleClose}
                                                        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                                                    >
                                                        <MenuItem onClick={() => handleEdit(user)}><EditIcon fontSize="small" /> Edit</MenuItem>
                                                    </Menu>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                <div className="d-flex justify-content-end align-items-center p-2">
                                    <TablePagination
                                        component="div"
                                        count={totalCount}
                                        page={page}
                                        onPageChange={handlePageChange}
                                        rowsPerPage={rowsPerPage}
                                        onRowsPerPageChange={handleChangeRowsPerPage}
                                    />
                                </div>
                            </TableContainer>
                        )}
                    </CardBody>
                </Card>

                <UserFormModal
                    formOpen={formOpen}
                    toggleModal={toggleModal}
                    formMode={formMode}
                    formData={formData}
                    handleChange={handleChange}
                    handleSubmit={handleSubmit}
                    setFormOpen={setFormOpen}
                />
            </div>
        </>
    );
}