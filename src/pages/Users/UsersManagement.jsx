import React, { useEffect } from 'react';
import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, IconButton,
    Menu, MenuItem, TextField, Chip,
    TablePagination,
    Box,
    FormControl,
    InputLabel,
    Select,
    capitalize
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
import useDebounce from 'hooks/useDebounce';
import UserHistoryModal from '../../Modal/UserHistoryModal';
import PasswordChangeModal from 'Modal/PasswordChangeModal';
import LockResetIcon from '@mui/icons-material/LockReset';
import RoleAssignAndRemoveModal from 'Modal/RoleAssignAndRemoveModal';


export default function UserTable() {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [menuUserIndex, setMenuUserIndex] = React.useState(null);
    const [formOpen, setFormOpen] = React.useState(false);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const dispatch = useDispatch();
    const users = useSelector((state) => state.user.users);
    const { institute } = useSelector((state) => state.auth.user);
    const totalCount = useSelector((state) => state.user.totalCount);
    const loading = useSelector((state) => state.user.loading);
    const [editId, setEditId] = React.useState(null);
    const errror = useSelector((state) => state.user.error);
    const [selectedInstitute, setSelectedInstitute] = React.useState("");
    const [searchTerm, setSearchTerm] = React.useState('');
    const [inputValue, setInputValue] = React.useState('');
    const [historyOpen, setHistoryOpen] = React.useState(false);
    const [selectedHistory, setSelectedHistory] = React.useState([]);
    const [currentUser, setCurrentUser] = React.useState(null);
    const currentRoles = useSelector((state) =>
        state.auth.user?.roles?.map(role => role.name) || []
    );
    const [passwordModalOpen, setPasswordModalOpen] = React.useState(false);
    const [passwordChangeUser, setPasswordChangeUser] = React.useState(null);
    const [roleModalOpen, setRoleModalOpen] = React.useState(false);
    const [roleAssignRemoveUser, setRoleAssignRemoveUser] = React.useState(null);
    const [selectedStatus, setSelectedStatus] = React.useState("")




    const instituteList = [
        { id: "1", name: "NIOH" },
        { id: "2", name: "ROHC" },
        { id: "3", name: "BOTH" },
    ];
    const statusList = [
        { id: "1", name: "Working", value: 0 },
        { id: "2", name: "Retired", value: 1 },
    ];

    const handleInstituteChange = (event) => {
        setSelectedInstitute(event.target.value);
        setPage(0);
    };

    const handleStatusFilter = (event) => {
        setSelectedStatus(event.target.value);
        setPage(0);
    };

    const debouncedSearch = useDebounce((value) => {
        setSearchTerm(value); // this will trigger the API call in useEffect
    }, 1000); // 30 seconds = 30000 ms

    useEffect(() => {
        dispatch(fetchUserData({
            page: page + 1,
            limit: rowsPerPage,
            search: searchTerm.trim(),
            institute: selectedInstitute,
            status: selectedStatus
        }))
    }, [dispatch, page, rowsPerPage, selectedInstitute, searchTerm, roleModalOpen, selectedStatus]);


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
        first_name: '',
        middle_name: '',
        last_name: '',
        employee_code: '',
        password: '',
        email: '',
        institute: '',
        roles: '',
        status: 'Working', // Add status field, default to Working
    });

    const getStatusColor = (status) => {
        switch (status) {
            case "Working":
                return "success"; // Green
            case "Suspended":
                return "warning"; // Yellow
            case "Resigned":
                return "default"; // Grey
            case "Retired":
                return "info"; // Blue
            case "On Leave":
                return "primary"; // Light Blue
            default:
                return "default"; // Default Grey
        }
    };

    const toggleModal = (mode) => {
        if (mode === "create") {
            setFormData({
                first_name: '',
                middle_name: '',
                last_name: '',
                employee_code: '',
                password: '',
                email: '',
                institute: '',
                roles: '',
                status: 'Working', // Reset status for create mode
            });
            setFormMode('create');
        }
        setFormOpen(!formOpen);
    };


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (values, { setSubmitting, resetForm }) => {
        const roles = [
            { id: 1, name: 'IT Admin' },
            { id: 2, name: "Director" },
            { id: 3, name: "Senior AO" },
            { id: 4, name: 'Administrative Officer' },
            { id: 5, name: 'Drawing and Disbursing Officer (NIOH)' },
            { id: 6, name: 'Drawing and Disbursing Officer (ROHC)' },
            { id: 7, name: 'Section Officer (Accounts)' },
            { id: 8, name: 'Accounts Officer' },
            { id: 9, name: 'Salary Processing Coordinator (NIOH)' },
            { id: 10, name: 'Salary Processing Coordinator (ROHC)' },
            { id: 11, name: "Pensioners Operator" },
            { id: 12, name: 'End Users' },
        ];

        const selectedRoles = roles.find(role => String(role.id) === String(values.roles));

        // Map status to is_retired
        const is_retired = values.status === 'Retired' ? 1 : 0;

        // Format values
        const formattedValues = {
            ...values,
            employee_code: values.employee_code?.toUpperCase() || "",
            first_name: capitalize(values.first_name),
            middle_name: capitalize(values.middle_name),
            last_name: capitalize(values.last_name),
            roles: [selectedRoles.name],
            is_retired, // Add is_retired for backend
        };
        delete formattedValues.status; // Remove status from payload


        if (formMode === 'edit') {
            const { password, ...rest } = formattedValues;
            dispatch(updateUserData({ formData: rest, id: editId })).unwrap()
                .then(() => {
                    toast.success('User updated successfully');
                    dispatch(fetchUserData({ page: page + 1, limit: rowsPerPage, search: "", institute: "", status:"" }));
                })
                .catch((err) => {
                    const apiMsg =
                        err?.response?.data?.message ||
                        err?.errorMsg ||
                        err?.message ||
                        'Failed to update user.';
                    toast.error(apiMsg);
                });

        } else {
            dispatch(createUserData(formattedValues)).unwrap()
                .then(() => {
                    toast.success('User created successfully');
                    dispatch(fetchUserData({ page: page + 1, limit: rowsPerPage, search: "", institute: "", status:"" }));
                })
                .catch((err) => {
                    const apiMsg =
                        err?.response?.data?.message ||
                        err?.errorMsg ||
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

    const rolesList = [
        { id: 1, name: 'IT Admin' },
        { id: 2, name: "Director" },
        { id: 3, name: "Senior AO" },
        { id: 4, name: 'Administrative Officer' },
        { id: 5, name: 'Drawing and Disbursing Officer (NIOH)' },
        { id: 6, name: 'Drawing and Disbursing Officer (ROHC)' },
        { id: 7, name: 'Section Officer (Accounts)' },
        { id: 8, name: 'Accounts Officer' },
        { id: 9, name: 'Salary Processing Coordinator (NIOH)' },
        { id: 10, name: 'Salary Processing Coordinator (ROHC)' },
        { id: 11, name: "Pensioners Operator" },
        { id: 12, name: 'End Users' },
    ];

    const handleEdit = (user) => {
        setEditId(user.id);
        handleClose();
        // Find the role id by name
        let roleId = '';
        if (user.roles && user.roles.length > 0) {
            const found = rolesList.find(r => r.name === user.roles[0].name);
            roleId = found ? String(found.id) : '';
        }
        setFormData({
            first_name: user.first_name || '',
            middle_name: user.middle_name || '',
            last_name: user.last_name || '',
            employee_code: user.employee_code || '',
            password: '',
            email: user.email || '',
            institute: user.institute || 'NIOH',
            roles: roleId,
            status: user.is_retired === 1 ? 'Retired' : 'Working', // Set status from is_retired
        });
        setFormMode('edit');
        setFormOpen(true);
    };

    const handleHistory = (user) => {
        setSelectedHistory(user.history || []);
        setCurrentUser(user);
        setHistoryOpen(true);
        handleClose();
    };


    const handleOpenPasswordModal = (user) => {
        setPasswordChangeUser(user);
        setPasswordModalOpen(true);
        handleClose(); // Close the three-dot menu
    };


    const handleClosePasswordModal = () => {
        setPasswordModalOpen(false);
        setPasswordChangeUser(null);
    };


    return (
        <>
            <div className='header bg-gradient-info pb-8 pt-8 pt-md-8 main-head'></div>
            <div className="mt--7 mb-7 container-fluid">
                <Card className="card-stats mb-4 mb-lg-0" >
                    <CardHeader>
                        <div className="container-fluid px-0">
                            <div className="row align-items-center g-2">
                                <div className="col-12 col-md-auto mb-2 mb-md-0">
                                    <h5 className="mb-0">User Management</h5>
                                </div>
                                {
                                    institute === 'BOTH' && (
                                        <div className="col-12 col-sm-6 col-md-auto mb-2 mb-md-0">
                                            <FormControl size="small" style={{ minWidth: 160, width: '100%' }} fullWidth>
                                                <InputLabel>Institute</InputLabel>
                                                <Select
                                                    value={selectedInstitute}
                                                    onChange={handleInstituteChange}
                                                    label="Institute"
                                                >
                                                    <MenuItem value="">ALL</MenuItem>
                                                    {instituteList.map((inst) => (
                                                        <MenuItem key={inst.id} value={inst.name}>
                                                            {inst.name}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </div>
                                    )
                                }
                                <div className="col-12 col-sm-6 col-md mb-2 mb-md-0">
                                    <TextField
                                        label="Search by Name & Code"
                                        size="small"
                                        variant="outlined"
                                        value={inputValue}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            setInputValue(value);     // Immediate update for UI
                                            debouncedSearch(value);   // immediate UI update
                                        }}
                                        style={{ width: '100%' }}
                                        fullWidth
                                    />
                                </div>
                                <div className="col-12 col-sm-6 col-md-auto mb-2 mb-md-0">
                                    <FormControl size="small" style={{ minWidth: 160, width: '100%' }} fullWidth>
                                        <InputLabel>Status</InputLabel>
                                        <Select
                                            value={selectedStatus}
                                            onChange={handleStatusFilter}
                                            label="Status"
                                        >
                                            <MenuItem value="">ALL</MenuItem>
                                            <MenuItem value="0">Working</MenuItem>
                                            <MenuItem value="1">Retired</MenuItem>
                                            {/* {statusList.map((inst) => (
                                                <MenuItem key={inst.id} value={inst.value}>
                                                    {inst.name}
                                                </MenuItem>
                                            ))} */}
                                        </Select>
                                    </FormControl>
                                </div>
                                {currentRoles.includes("IT Admin") && (
                                    <div className="col-12 col-md-auto">
                                        <Button
                                            style={{ background: "#004080", color: '#fff', width: '100%' }}
                                            type="button"
                                            onClick={() => toggleModal("create")}
                                        >
                                            + Add User
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardHeader>
                    <CardBody>
                        {loading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <CircularProgress />
                            </Box>
                        ) : (
                            <TableContainer component={Paper} style={{ boxShadow: "none" }}>
                                <div className="table-responsive">
                                    <Table>
                                        <TableHead>
                                            <TableRow style={{ whiteSpace: "nowrap" }}>
                                                <TableCell style={{ fontWeight: "900" }}>Sr. No.</TableCell>
                                                <TableCell style={{ fontWeight: "900" }}>Emp Code</TableCell>
                                                <TableCell style={{ fontWeight: "900" }}>Name</TableCell>
                                                <TableCell style={{ fontWeight: "900" }}>Role</TableCell>
                                                <TableCell style={{ fontWeight: "900" }}>Email</TableCell>
                                                <TableCell style={{ fontWeight: "900" }}>Institute</TableCell>
                                                <TableCell style={{ fontWeight: "900" }}>Status</TableCell>
                                                <TableCell align="right" style={{ fontWeight: "900" }}>Actions</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {users.length !== 0 ? users.map((user, idx) => (
                                                <TableRow key={idx} style={{ whiteSpace: "nowrap" }}>
                                                    <TableCell>{(page * rowsPerPage) + idx + 1}</TableCell>
                                                    <TableCell className='text-uppercase'>{user?.employee_code || "- -"}</TableCell>
                                                    <TableCell className='text-capitalize'>{user.name || "NA"}</TableCell>
                                                    <TableCell>
                                                        {Array.isArray(user?.roles) && user.roles.length > 0
                                                            ? user.roles.map(role => role.name).join(', ')
                                                            : "NA"}
                                                    </TableCell>
                                                    <TableCell>{user.email || "NA"}</TableCell>
                                                    <TableCell>{user.institute || "NA"}</TableCell>
                                                    <TableCell>{user.is_retired ? <Chip
                                                        label='Retired'
                                                        color={getStatusColor('Retired')}
                                                        variant="outlined"
                                                    /> : <Chip
                                                        label='Working'
                                                        color={getStatusColor('Working')}
                                                        variant="outlined"
                                                    />}

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
                                                            {currentRoles.includes("IT Admin") && (
                                                                <MenuItem onClick={() => handleEdit(user)}><EditIcon fontSize="small" /> Edit</MenuItem>
                                                            )}

                                                            {currentRoles.includes("IT Admin") && (
                                                                <MenuItem onClick={() => handleOpenPasswordModal(user)}>
                                                                    <LockResetIcon fontSize="small" style={{ marginRight: 8 }} /> Change Password
                                                                </MenuItem>
                                                            )}
                                                            
                                                            {currentRoles.includes("IT Admin") && (
                                                            <MenuItem onClick={() => {
                                                                setPasswordChangeUser(user);
                                                                setRoleAssignRemoveUser(user); // new state
                                                                setRoleModalOpen(true);       // new state
                                                                handleClose();
                                                            }}>
                                                                <i className="fa fa-user-tag" style={{ marginRight: 8 }} /> Manage Roles
                                                            </MenuItem>
                                                            )}

                                                            <MenuItem onClick={() => handleHistory(user)}>
                                                                <i className="fa fa-history" style={{ marginRight: 8 }} /> History
                                                            </MenuItem>
                                                        </Menu>
                                                    </TableCell>
                                                </TableRow>
                                            )) : (
                                                <TableRow>
                                                    <TableCell align='center' colSpan={7}>No users found</TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
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
                <UserHistoryModal
                    open={historyOpen}
                    onClose={() => setHistoryOpen(false)}
                    history={selectedHistory}
                    current={currentUser}
                />

                <PasswordChangeModal
                    open={passwordModalOpen}
                    onClose={handleClosePasswordModal}
                    user={passwordChangeUser}
                />

                <RoleAssignAndRemoveModal
                    open={roleModalOpen}
                    onClose={() => setRoleModalOpen(false)}
                    user={roleAssignRemoveUser}
                />

            </div>
        </>
    );
}
