import React from 'react';
import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Avatar, IconButton,
    Menu, MenuItem, TextField, Chip, Checkbox,
    TablePagination
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import 'bootstrap/dist/css/bootstrap.min.css';
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
} from "reactstrap";

const users = [
    {
        name: "Adam Trantow",
        company: "Mohr, Langworth and Hills",
        role: "UI Designer",
        verified: true,
        status: "Active",
        avatar: "https://i.pravatar.cc/150?img=1"
    },
    {
        name: "Angel Rolfson-Kulas",
        company: "Koch and Sons",
        role: "UI Designer",
        verified: true,
        status: "Active",
        avatar: "https://i.pravatar.cc/150?img=2"
    },
    {
        name: "Betty Hammes",
        company: "Waelchi – VonRueden",
        role: "UI Designer",
        verified: true,
        status: "Active",
        avatar: "https://i.pravatar.cc/150?img=3"
    },
    {
        name: "Billy Braun",
        company: "White, Cassin and Goldner",
        role: "UI Designer",
        verified: false,
        status: "Banned",
        avatar: "https://i.pravatar.cc/150?img=4"
    },
    {
        name: "Billy Stoltenberg",
        company: "Medhurst, Moore and Franey",
        role: "Leader",
        verified: true,
        status: "Banned",
        avatar: "https://i.pravatar.cc/150?img=5"
    }
];

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

    const handleMenuClick = (event, index) => {
        setAnchorEl(event.currentTarget);
        setMenuUserIndex(index);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setMenuUserIndex(null);
    };

    const toggleModal = (e) => {
        // e.preventDefault();
        setFormOpen(!formOpen);
        if (e === "defaultModal") {
            setFormOpen(!formOpen);
        }
    }

    const [formData, setFormData] = React.useState({
        username: '',
        password: '',
        email: '',
        institute: 'NIOH',
        role: 'Admin',
        status: 'Active',
    });

    const roles = ['Admin', 'Accounts Officer', 'Coordinator(NIOH)', 'Coordinator(ROHC)', 'Pensioner Operator', 'End User'];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
        // send formData to backend API
    };

    return (
        <>
            <div className='header bg-gradient-info pb-8 pt-8 pt-md-8'></div>
            <div className="mt--7 container-fluid">
                <Card className="card-stats mb-4 mb-lg-0" >
                    <CardHeader>
                        <div class="d-flex justify-content-between align-items-center">
                            <TextField placeholder="Search user..." />
                            <Button
                                className="mb-3"
                                color="primary"
                                type="button"
                                onClick={() => toggleModal()}
                            >
                                + Add User
                            </Button>
                        </div>
                    </CardHeader>
                    <CardBody>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell><Checkbox /></TableCell>
                                        <TableCell>Name</TableCell>
                                        <TableCell>Company</TableCell>
                                        <TableCell>Role</TableCell>
                                        <TableCell>Verified</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell align="right">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {users.map((user, idx) => (
                                        <TableRow key={idx}>
                                            <TableCell><Checkbox /></TableCell>
                                            <TableCell>
                                                <div className="d-flex align-items-center">
                                                    <Avatar src={user.avatar} className="me-2" />
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
                                                    <MenuItem onClick={handleClose}><EditIcon fontSize="small" /> Edit</MenuItem>
                                                    <MenuItem onClick={handleClose}><DeleteIcon fontSize="small" color="error" /> Delete</MenuItem>
                                                </Menu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <div className="d-flex justify-content-between align-items-center p-2">
                                <span>Rows per page:</span>
                                <TablePagination
                                    component="div"
                                    count={24}
                                    page={0}
                                    onPageChange={() => { }}
                                    rowsPerPage={5}
                                    onRowsPerPageChange={() => { }}
                                />
                            </div>
                        </TableContainer>
                    </CardBody>
                </Card>
                <Modal
                    className="modal-dialog-centered"
                    isOpen={formOpen}
                    toggle={() => toggleModal("defaultModal")}
                >
                    <div className='pt-4 pb-4 px-4'>
                        <Form onSubmit={handleSubmit} >
                            <h4 className="mb-4">Create User</h4>

                            {/* Username */}
                            <FormGroup>
                                <Label for="username">Username</Label>
                                <Input
                                    id="username"
                                    name="username"
                                    type="text"
                                    onChange={handleChange}
                                    required
                                />
                            </FormGroup>

                            {/* Password */}
                            <FormGroup>
                                <Label for="password">Password</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    onChange={handleChange}
                                    required
                                />
                            </FormGroup>

                            {/* Email */}
                            <FormGroup>
                                <Label for="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    onChange={handleChange}
                                    required
                                />
                            </FormGroup>

                            {/* Institute */}
                            <FormGroup>
                                <Label for="institute">Institute</Label>
                                <Input
                                    id="institute"
                                    type="select"
                                    name="institute"
                                    onChange={handleChange}
                                >
                                    <option value="NIOH">NIOH</option>
                                    <option value="ROHC">ROHC</option>
                                </Input>
                            </FormGroup>

                            {/* Role */}
                            <FormGroup>
                                <Label for="role">Role</Label>
                                <Input
                                    id="role"
                                    type="select"
                                    name="role"
                                    onChange={handleChange}
                                >
                                    {roles.map((role) => (
                                        <option key={role} value={role}>
                                            {role}
                                        </option>
                                    ))}
                                </Input>
                            </FormGroup>

                            {/* Status */}
                            <FormGroup>
                                <Label for="status">Status</Label>
                                <Input
                                    id="status"
                                    type="select"
                                    name="status"
                                    onChange={handleChange}
                                >
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </Input>
                            </FormGroup>

                            <Button color="primary" type="submit">
                                Create User
                            </Button>
                        </Form>
                    </div>
                </Modal>
            </div>
        </>
    );
}
