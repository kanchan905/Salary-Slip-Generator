import React, { useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Avatar, IconButton,
    Menu, MenuItem, Chip, Checkbox,
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
    CardTitle,
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
    const [editingId, setEditingId] = useState(null);
    const [employees, setEmployees] = useState([
        {
            id: 1,
            name: 'Anita Sharma',
            email: 'anita@example.com',
            designation: 'Clerk',
            department: 'Finance',
            status: 'Active',
            institute: 'NIOH',
            doj: '2022-04-15',
            bankAccount: '1234567890',
            ifsc: 'SBIN0001234',
            quarter: 'No',
        },
        {
            id: 2,
            name: 'Ravi Verma',
            email: 'ravi@example.com',
            designation: 'Officer',
            department: 'HR',
            status: 'Inactive',
            institute: 'ROHC',
            doj: '2021-08-10',
            bankAccount: '9876543210',
            ifsc: 'ICIC0005678',
            quarter: 'Yes',
        },
    ]);


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

    const initialFormState = {
        name: '',
        email: '',
        designation: '',
        department: '',
        institute: 'NIOH',
        doj: '',
        bankAccount: '',
        ifsc: '',
        quarter: 'No',
        status: 'Active',
        document: null,
    };

    const [formData, setFormData] = useState(initialFormState);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData({ ...formData, [name]: files ? files[0] : value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingId) {
            // Update existing employee
            setEmployees((prev) =>
                prev.map((emp) =>
                    emp.id === editingId ? { ...emp, ...formData, id: editingId } : emp
                )
            );
        } else {
            // Add new employee
            const newEmployee = {
                ...formData,
                id: Date.now(),
            };
            setEmployees([...employees, newEmployee]);
        }

        setFormOpen(false);
        setEditingId(null);
        setFormData(initialFormState);
    };

    const handleEdit = (emp) => {
        setFormData(emp);
        setEditingId(emp.id);
        setFormOpen(true);
    };

    const handleDelete = (id) => {
        const confirm = window.confirm('Are you sure you want to delete this employee?');
        if (confirm) {
            setEmployees(employees.filter((emp) => emp.id !== id));
        }
    };

    return (
        <>
            <div className='header bg-gradient-info pb-8 pt-8 pt-md-8'></div>
            <div className="mt--7 container-fluid">
                <Card className="shadow border-0">
                    <CardHeader>
                        <div class="d-flex justify-content-between align-items-center mb-4">
                            <CardTitle className="text-uppercase text-muted mb-0">Employees</CardTitle>
                            <Button color="primary" size="lg" type="button" onClick={() => toggleModal()}>
                                + Add Employee
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
                                                    <MenuItem onClick={()=> handleDelete(employees.id)}><DeleteIcon fontSize="small" color="error" /> Delete</MenuItem>
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
                        <Form onSubmit={handleSubmit}>
                            <h4 className="mb-4">Create Employee</h4>

                            {/* Full Name */}
                            <FormGroup>
                                <Label for="name">Full Name</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    type="text"
                                    value={formData.name}
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
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </FormGroup>

                            {/* Designation */}
                            <FormGroup>
                                <Label for="designation">Designation</Label>
                                <Input
                                    id="designation"
                                    name="designation"
                                    type="text"
                                    value={formData.designation}
                                    onChange={handleChange}
                                />
                            </FormGroup>

                            {/* Department */}
                            <FormGroup>
                                <Label for="department">Department</Label>
                                <Input
                                    id="department"
                                    name="department"
                                    type="text"
                                    value={formData.department}
                                    onChange={handleChange}
                                />
                            </FormGroup>

                            {/* Institute */}
                            <FormGroup>
                                <Label for="institute">Institute</Label>
                                <Input
                                    id="institute"
                                    name="institute"
                                    type="select"
                                    value={formData.institute}
                                    onChange={handleChange}
                                >
                                    <option value="NIOH">NIOH</option>
                                    <option value="ROHC">ROHC</option>
                                </Input>
                            </FormGroup>

                            {/* Date of Joining */}
                            <FormGroup>
                                <Label for="doj">Date of Joining</Label>
                                <Input
                                    id="doj"
                                    name="doj"
                                    type="date"
                                    value={formData.doj}
                                    onChange={handleChange}
                                />
                            </FormGroup>

                            {/* Bank Account Number */}
                            <FormGroup>
                                <Label for="bankAccount">Bank Account Number</Label>
                                <Input
                                    id="bankAccount"
                                    name="bankAccount"
                                    type="text"
                                    value={formData.bankAccount}
                                    onChange={handleChange}
                                />
                            </FormGroup>

                            {/* IFSC Code */}
                            <FormGroup>
                                <Label for="ifsc">IFSC Code</Label>
                                <Input
                                    id="ifsc"
                                    name="ifsc"
                                    type="text"
                                    value={formData.ifsc}
                                    onChange={handleChange}
                                />
                            </FormGroup>

                            {/* Quarter Allotted */}
                            <FormGroup>
                                <Label for="quarter">Quarter Allotted</Label>
                                <Input
                                    id="quarter"
                                    name="quarter"
                                    type="select"
                                    value={formData.quarter}
                                    onChange={handleChange}
                                >
                                    <option value="No">No</option>
                                    <option value="Yes">Yes</option>
                                </Input>
                            </FormGroup>

                            {/* Status */}
                            <FormGroup>
                                <Label for="status">Status</Label>
                                <Input
                                    id="status"
                                    name="status"
                                    type="select"
                                    value={formData.status}
                                    onChange={handleChange}
                                >
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </Input>
                            </FormGroup>

                            {/* Document Upload */}
                            <FormGroup>
                                <Label for="document">Upload Document</Label>
                                <Input
                                    id="document"
                                    name="document"
                                    type="file"
                                    onChange={handleChange}
                                />
                            </FormGroup>

                            <Button color="primary" type="submit">
                                Save
                            </Button>
                        </Form>
                    </div>
                </Modal>
            </div>
        </>
    );
}
