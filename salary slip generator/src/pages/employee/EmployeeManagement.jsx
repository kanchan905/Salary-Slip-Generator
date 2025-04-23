import React, { useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Avatar, IconButton,
    Menu, MenuItem, Chip, Checkbox,
    TablePagination,
    TextField
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
} from "reactstrap";

const statusChipColor = (status) => {
    switch (status) {
        case "Active": return "success";
        case "Inactive": return "warning";
        default: return "default";
    }
};

export default function EmployeeManagement() {
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
        {
            id: 3,
            name: 'Priya Singh',
            email: 'priya@example.com',
            designation: 'Manager',
            department: 'IT',
            status: 'Active',
            institute: 'NIOH',
            doj: '2020-01-20',
            bankAccount: '1122334455',
            ifsc: 'HDFC0001234',
            quarter: 'Yes',
        },
        {
            id: 4,
            name: 'Amit Kumar',
            email: 'amit@example.com',
            designation: 'Analyst',
            department: 'Finance',
            status: 'Active',
            institute: 'ROHC',
            doj: '2019-11-05',
            bankAccount: '5566778899',
            ifsc: 'AXIS0005678',
            quarter: 'No',
        },
        {
            id: 5,
            name: 'Neha Gupta',
            email: 'neha@example.com',
            designation: 'Executive',
            department: 'Marketing',
            status: 'Inactive',
            institute: 'NIOH',
            doj: '2023-03-15',
            bankAccount: '9988776655',
            ifsc: 'PNB0001234',
            quarter: 'No',
        },
        {
            id: 6,
            name: 'Vikram Mehta',
            email: 'vikram@example.com',
            designation: 'Supervisor',
            department: 'Operations',
            status: 'Active',
            institute: 'ROHC',
            doj: '2022-07-25',
            bankAccount: '6677889900',
            ifsc: 'BOB0005678',
            quarter: 'Yes',
        },
        {
            id: 7,
            name: 'Kavita Joshi',
            email: 'kavita@example.com',
            designation: 'Consultant',
            department: 'Legal',
            status: 'Active',
            institute: 'NIOH',
            doj: '2021-05-10',
            bankAccount: '3344556677',
            ifsc: 'UBIN0001234',
            quarter: 'No',
        },
        {
            id: 8,
            name: 'Rahul Tiwari',
            email: 'rahul@example.com',
            designation: 'Engineer',
            department: 'IT',
            status: 'Inactive',
            institute: 'ROHC',
            doj: '2020-09-30',
            bankAccount: '2233445566',
            ifsc: 'YESB0005678',
            quarter: 'Yes',
        },
        {
            id: 9,
            name: 'Sneha Roy',
            email: 'sneha@example.com',
            designation: 'Specialist',
            department: 'HR',
            status: 'Active',
            institute: 'NIOH',
            doj: '2023-01-15',
            bankAccount: '7788990011',
            ifsc: 'IND0001234',
            quarter: 'No',
        },
        {
            id: 10,
            name: 'Arjun Das',
            email: 'arjun@example.com',
            designation: 'Technician',
            department: 'Maintenance',
            status: 'Inactive',
            institute: 'ROHC',
            doj: '2018-12-20',
            bankAccount: '4455667788',
            ifsc: 'CANB0005678',
            quarter: 'Yes',
        },
        {
            id: 11,
            name: 'Meera Nair',
            email: 'meera@example.com',
            designation: 'HR Specialist',
            department: 'HR',
            status: 'Active',
            institute: 'NIOH',
            doj: '2024-02-10',
            bankAccount: '5566778890',
            ifsc: 'SBIN0009876',
            quarter: 'No',
        },
    ]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [searchQuery, setSearchQuery] = React.useState("");
    const [selectedIndexes, setSelectedIndexes] = React.useState([]);

    // Filter users based on search query
    const filteredEmployees = employees.filter((user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const paginatedEmployees = filteredEmployees.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

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

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value); // Update search query
        setPage(0); // Reset to the first page when searching
    };

    const handleDeleteSelected = () => {
        const filtered = employees.filter((employee) => !selectedIndexes.includes(employee.id));
        setEmployees(filtered);
        setSelectedIndexes([]);
    };


    const handleMenuClick = (event, index) => {
        setAnchorEl(event.currentTarget);
        setMenuUserIndex(index);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setMenuUserIndex(null);
    };

    const toggleModal = (e) => {
        if (e === "create") {
            setFormData({
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
            });
        }
        setFormOpen(!formOpen);
        if (e === "defaultModal") {
            setFormOpen(!formOpen);
        }
    };

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
        setEmployees((prevEmployee) => prevEmployee.filter((employee) => employee.id !== id));
        handleClose(); // Close the menu after deletion
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedIndexes(paginatedEmployees.map((user) => user.id)); // Use `id` instead of `name`
        } else {
            setSelectedIndexes([]);
        }
    };

    const handleRowSelect = (id) => {
        setSelectedIndexes((prevSelected) =>
            prevSelected.includes(id)
                ? prevSelected.filter((id) => id !== id) // Deselect
                : [...prevSelected, id] // Select
        );
    };



    return (
        <>
            <div className='header bg-gradient-info pb-8 pt-8 pt-md-8'></div>
            <div className="mt--7 container-fluid">
                <Card className="shadow border-0">
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
                                className="mb-3"
                                color="primary"
                                type="button"
                                onClick={() => toggleModal("create")}
                            >
                                + Add Employee
                            </Button>
                        </div>
                    </CardHeader>
                    <CardBody>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell><Checkbox 
                                         onChange={handleSelectAll}
                                         checked={
                                             selectedIndexes.length === paginatedEmployees.length &&
                                             paginatedEmployees.length > 0
                                         }
                                        /></TableCell>
                                        <TableCell>Name</TableCell>
                                        <TableCell>Designation</TableCell>
                                        <TableCell>Department</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Quarter</TableCell>
                                        <TableCell align="right">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {paginatedEmployees.map((emp, idx) => (
                                        <TableRow key={emp.id}>
                                            <TableCell><Checkbox checked={selectedIndexes.includes(emp.id)}
                                                onChange={() => handleRowSelect(emp.id)} /></TableCell>
                                            <TableCell>{emp.name}</TableCell>
                                            <TableCell>{emp.designation}</TableCell>
                                            <TableCell>{emp.department}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={emp.status}
                                                    color={statusChipColor(emp.status)}
                                                    variant="outlined"
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>{emp.quarter}</TableCell>
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
                                                    <MenuItem onClick={() => handleEdit(emp)}>
                                                        <EditIcon fontSize="small" /> Edit
                                                    </MenuItem>
                                                    <MenuItem onClick={() => handleDelete(emp.id)}>
                                                        <DeleteIcon fontSize="small" color="error" /> Delete
                                                    </MenuItem>
                                                </Menu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <div className="d-flex justify-content-end align-items-center p-2">
                                <TablePagination
                                    component="div"
                                    count={filteredEmployees.length}
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
                    toggle={toggleModal}
                >
                    <div className='pt-4 pb-4 px-4'>
                        <Form onSubmit={handleSubmit}>
                            <h4 className="mb-4">{formData.name ? 'Edit Employee' : 'Create Employee'}</h4>
                            {/* Form Fields */}
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