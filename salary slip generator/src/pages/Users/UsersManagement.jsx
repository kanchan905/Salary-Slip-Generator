import React from 'react';
import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, IconButton,
    Menu, MenuItem, TextField, Chip, Checkbox,
    TablePagination
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {
    Button,
    Card,
    CardHeader,
    CardBody,
    Modal,
    Form,
    FormGroup,
    Input,
    Label,
    Row,
    Col,
} from "reactstrap";



const statusChipColor = (status) => {
    switch (status) {
        case "Active": return "success";
        case "Banned": return "error";
        default: return "default";
    }

};

export default function UserTable() {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [menuUserIndex, setMenuUserIndex] = React.useState(null);
    const [formOpen, setFormOpen] = React.useState(false);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [searchQuery, setSearchQuery] = React.useState("");
    const [users, setUsers] = React.useState([
        {
            name: "John Doe",
            company: "NIOH",
            role: "Admin",
            verified: true,
            status: "Active",
            avatar: "https://i.pravatar.cc/150?img=10",
        },
        {
            name: "Jane Smith",
            company: "ROHC",
            role: "Accounts Officer",
            verified: false,
            status: "Inactive",
            avatar: "https://i.pravatar.cc/150?img=20",
        },
        {
            name: "Michael Johnson",
            company: "NIOH",
            role: "Coordinator(NIOH)",
            verified: true,
            status: "Active",
            avatar: "https://i.pravatar.cc/150?img=30",
        },
        {
            name: "Emily Davis",
            company: "ROHC",
            role: "Pensioner Operator",
            verified: false,
            status: "Banned",
            avatar: "https://i.pravatar.cc/150?img=40",
        },
        {
            name: "Chris Brown",
            company: "NIOH",
            role: "End User",
            verified: true,
            status: "Active",
            avatar: "https://i.pravatar.cc/150?img=50",
        },
    ]);
    const [selectedIndexes, setSelectedIndexes] = React.useState([]);



    // Filter users based on search query
    const filteredUsers = users.filter((user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const paginatedUsers = filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    const [formMode, setFormMode] = React.useState('create');
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedIndexes(paginatedUsers.map((user) => user.name));
        } else {
            setSelectedIndexes([]);
        }
    };
    const handleRowSelect = (userName) => {
        setSelectedIndexes((prevSelected) =>
            prevSelected.includes(userName)
                ? prevSelected.filter((name) => name !== userName) // Deselect
                : [...prevSelected, userName] // Select
        );
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value); // Update search query
        setPage(0); // Reset to the first page when searching
    };

    const handlePageChange = (event, value) => {
        setPage(value);
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

    const toggleModal = (mode) => {
        if (mode === "create") {
            setFormData({
                username: '',
                password: '',
                email: '',
                institute: 'NIOH',
                role: 'Admin',
                status: 'Active',
            });
            setFormMode('create');
        }
        // e.preventDefault();
        setFormOpen(!formOpen);
        // if (e === "defaultModal") {
        //     setFormOpen(!formOpen);
        // }
    }

    const [formData, setFormData] = React.useState({
        username: '',
        password: '',
        email: '',
        institute: 'NIOH',
        role: 'Admin',
        status: 'Active',
    });

    const roles = ['IT Admin', 'Administrative Officer', 'Accounts Officer', 'Salary Coordinator - NIOH', 'Salary Coordinator - ROHC', 'Pension Coordinator','End Users'];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // send formData to backend API
        // Create a new user object from formData
        const newUser = {
            name: formData.username,
            company: formData.institute,
            role: formData.role,
            verified: false, // Default to false for new users
            status: formData.status,
            avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70) + 1}` // Random avatar
        };
        // Add the new user to the users array
        setUsers((prevUsers) => [...prevUsers, newUser]);
        // Reset the form and close the modal
        setFormData({
            username: '',
            password: '',
            email: '',
            institute: 'NIOH',
            role: 'Admin',
            status: 'Active',
        });
        setFormOpen(false);
    };


    const handleDeleteSelected = () => {
        const filtered = users.filter((user) => !selectedIndexes.includes(user.name));
        setUsers(filtered);
        setSelectedIndexes([]);
    };

    const handleDeleteUser = (name) => {
        setUsers((prevUsers) => prevUsers.filter((user) => user.name !== name));
        handleClose(); // Close the menu after deletion
    };

    const handleEdit = (user) => {
        handleClose();
        setFormData({
            username: user.name || '',
            password: '',
            email: '',
            institute: user.institute || 'NIOH',
            role: user.role || 'Admin',
            status: user.status || 'Active',
        });
        setFormMode('edit');
        // setEditingId(emp.id);
        setFormOpen(true);
    };

    const handleToggleStatus = (userName) => {
        setUsers((prevUsers) =>
            prevUsers.map((user) =>
                user.name === userName
                    ? { ...user, status: user.status === "Active" ? "Inactive" : "Active" }
                    : user
            )
        );
    };

    return (
        <>
            <div className='header bg-gradient-info pb-8 pt-8 pt-md-8 main-head'></div>
            <div className="mt--7 mb-7 container-fluid">
                <Card className="card-stats mb-4 mb-lg-0" >
                    <CardHeader>
                        <div className="d-flex justify-content-between align-items-center">
                            <TextField placeholder="Search user..." onChange={handleSearchChange} />
                            <button
                                className="btn btn-outline-danger btn-sm"
                                onClick={handleDeleteSelected}
                                disabled={selectedIndexes.length === 0}
                            >
                                <i className="bi bi-trash-fill me-1"></i>
                                Delete Selected ({selectedIndexes.length})
                            </button>
                            <Button
                                // className="mb-3"
                                color="primary"
                                type="button"
                                onClick={() => toggleModal("create")}
                            >
                                + Add User
                            </Button>
                        </div>
                    </CardHeader>
                    <CardBody>
                        <TableContainer component={Paper} style={{ boxShadow: "none" }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell><Checkbox
                                            onChange={handleSelectAll}
                                            checked={
                                                selectedIndexes.length === paginatedUsers.length &&
                                                paginatedUsers.length > 0
                                            } /></TableCell>
                                        <TableCell>Name</TableCell>
                                        <TableCell>Institute</TableCell>
                                        <TableCell>Role</TableCell>
                                        <TableCell>Verified</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell align="right">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {paginatedUsers.map((user, idx) => (
                                        <TableRow key={idx}>
                                            <TableCell><Checkbox checked={selectedIndexes.includes(user.name)}
                                                onChange={() => handleRowSelect(user.name)}
                                            /></TableCell>
                                            <TableCell>
                                                <div className="d-flex align-items-center">
                                                    {user.name}
                                                </div>
                                            </TableCell>
                                            <TableCell>{user.company}</TableCell>
                                            <TableCell>{user.role}</TableCell>
                                            <TableCell>
                                                {user.verified ? (
                                                    <Chip label="✔" color="success" size="small" />
                                                ) : "-"}
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={user.status}
                                                    color={statusChipColor(user.status)}
                                                    variant="outlined"
                                                    size="small"
                                                    onClick={() => handleToggleStatus(user.name)}
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
                                                    <MenuItem onClick={() => handleDeleteUser(user.name)}><DeleteIcon fontSize="small" color="error" /> Delete</MenuItem>
                                                </Menu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <div className="d-flex justify-content-end align-items-center p-2">
                                <TablePagination
                                    component="div"
                                    count={filteredUsers.length}
                                    page={page}
                                    onPageChange={handlePageChange}
                                    rowsPerPage={rowsPerPage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                />
                            </div>
                        </TableContainer>
                    </CardBody>
                </Card>
                <Modal
                    className="modal-dialog-centered"
                    isOpen={formOpen}
                    toggle={() => toggleModal("defaultModal")}
                    scrollable={true} 
                >
                    <div className='pt-4 pb-4 px-4'>
                        <Form onSubmit={handleSubmit}>
                            <h4 className="mb-4">{formMode === 'edit' ? "Edit User" : "Create User"}</h4>

                            <Row>
                                {/* Username */}
                                <Col md="6">
                                    <FormGroup>
                                        <Label for="username">Username</Label>
                                        <Input
                                            id="username"
                                            name="username"
                                            type="text"
                                            value={formData.username}
                                            onChange={handleChange}
                                            required
                                        />
                                    </FormGroup>
                                </Col>

                                {/* Password */}
                                <Col md="6">
                                    <FormGroup>
                                        <Label for="password">Password</Label>
                                        <Input
                                            id="password"
                                            name="password"
                                            type="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>

                            <Row>
                                {/* Email */}
                                <Col md="6">
                                    <FormGroup>
                                        <Label for="email">Email</Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </FormGroup>
                                </Col>

                                {/* Institute */}
                                <Col md="6">
                                    <FormGroup>
                                        <Label for="institute">Institute</Label>
                                        <Input
                                            id="institute"
                                            type="select"
                                            name="institute"
                                            value={formData.institute}
                                            onChange={handleChange}
                                        >
                                            <option value="NIOH">NIOH</option>
                                            <option value="ROHC">ROHC</option>
                                        </Input>
                                    </FormGroup>
                                </Col>
                            </Row>

                            <Row>
                                {/* Role */}
                                <Col md="6">
                                    <FormGroup>
                                        <Label for="role">Role</Label>
                                        <Input
                                            id="role"
                                            type="select"
                                            name="role"
                                            value={formData.role}
                                            onChange={handleChange}
                                        >
                                            {roles.map((role) => (
                                                <option key={role} value={role}>
                                                    {role}
                                                </option>
                                            ))}
                                        </Input>
                                    </FormGroup>
                                </Col>

                                {/* Status */}
                                <Col md="6">
                                    <FormGroup>
                                        <Label for="status">Status</Label>
                                        <Input
                                            id="status"
                                            type="select"
                                            name="status"
                                            value={formData.status}
                                            onChange={handleChange}
                                        >
                                            <option value="Active">Active</option>
                                            <option value="Inactive">Inactive</option>
                                        </Input>
                                    </FormGroup>
                                </Col>
                            </Row>

                            <Button color="primary" type="submit" className='mt-2'>
                              Save
                            </Button>
                            <Button color="secondary" className='mt-2' onClick={()=>setFormOpen(false)}>
                              cancel
                            </Button>
                        </Form>
                    </div>
                </Modal>
            </div>
        </>
    );
}
