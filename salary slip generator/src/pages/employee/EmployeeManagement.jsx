import React, { useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, IconButton,
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
} from "reactstrap";
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { deleteEmployee, deleteMultipleEmployees, toggleStatus } from '../../redux/slices/employeeSlice';
import { useNavigate } from 'react-router-dom';

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
    // const [ , setEditingId] = useState(null);
    const employees = useSelector((state)=> state.employee)
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [searchQuery, setSearchQuery] = React.useState("");
    const [selectedIndexes, setSelectedIndexes] = React.useState([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Filter users based on search query
    const filteredEmployees = employees.filter((user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const paginatedEmployees = filteredEmployees.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

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
        dispatch(deleteMultipleEmployees(selectedIndexes))
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

    const handleEdit = (emp) => {
        handleClose();
        navigate(`/admin/employee/edit/${emp.id}`);
    };

    const handleDelete = (id) => {
        dispatch(deleteEmployee(id))
        handleClose(); 
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedIndexes(paginatedEmployees.map((user) => user.id)); 
        } else {
            setSelectedIndexes([]);
        }
    };

    const handleRowSelect = (id) => {
        setSelectedIndexes((prevSelected) =>
            prevSelected.includes(id)
                ? prevSelected.filter((selectedId) => selectedId !== id) // Deselect
                : [...prevSelected, id] // Select
        );
    };

    const handleToggleStatus = (id) => {
        dispatch(toggleStatus(id));
    };

    return (
        <>
            <div className='header bg-gradient-info pb-8 pt-8 pt-md-8 main-head'></div>
            <div className="mt--7 mb-7 container-fluid">
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
                            <NavLink to='/admin/employee/add'>
                            <Button
                                // className="mb-3"
                                color="primary"
                                type="button"
                            >
                                + Add Employee
                            </Button>
                            </NavLink>
                        </div>
                    </CardHeader>
                    <CardBody>
                        <TableContainer component={Paper} style={{ boxShadow: 'none' }}>
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
                                                    onClick={() => handleToggleStatus(emp.id)}
                                                    style={{ cursor: 'pointer' }}
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
               
            </div>
        </>
    );
}