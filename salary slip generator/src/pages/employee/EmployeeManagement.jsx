import React, { useEffect } from 'react';
import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, IconButton,
    Menu, MenuItem, TablePagination, TextField,
    Box
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import ViewIcon from '@mui/icons-material/Visibility';
import {
    Button,
    Card,
    CardHeader,
    CardBody,
} from "reactstrap";
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchEmployees } from '../../redux/slices/employeeSlice';
import HomeIcon from '@mui/icons-material/Home';
import CircularProgress from '@mui/material/CircularProgress';


export default function EmployeeManagement() {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [menuUserIndex, setMenuUserIndex] = React.useState(null);
    const employees = useSelector((state) => state.employee.employees) || [];
    const { name } = useSelector((state) => state.auth.user.role);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [searchQuery, setSearchQuery] = React.useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const loading = useSelector((state) => state.employee.loading);

    useEffect(() => {
        dispatch(fetchEmployees({ page: page + 1, limit: rowsPerPage, search: searchQuery }));
    }, [page, rowsPerPage, searchQuery, dispatch]);


    // Filter users based on search query
    const filteredEmployees = employees.filter(emp => emp.first_name && emp.first_name.toLowerCase().includes(searchQuery.toLowerCase()));


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
        navigate(`/${name.toLowerCase()}/employee/edit/${emp.id}`);
    };

    const handleView = (id) => {
        handleClose();
        navigate(`/${name.toLowerCase()}/employee/${id}`);
    }

    const handleQuarter = (id) => {
        handleClose();
        navigate(`/${name.toLowerCase()}/employee/${id}/quarter`);
    }


    return (
        <>
            <div className='header bg-gradient-info pb-8 pt-8 pt-md-8 main-head'></div>
            <div className="mt--7 mb-7 container-fluid">
                <Card className="shadow border-0">
                    <CardHeader>
                        <div className="d-flex justify-content-between align-items-center">
                            <TextField placeholder="Search user..." onChange={handleSearchChange} />
                            <NavLink to={`/${name.toLowerCase()}/employee/add`}>
                                <Button
                                    style={{ background: "#004080" }}
                                    type="button"
                                >
                                    + Add Employee
                                </Button>
                            </NavLink>
                        </div>
                    </CardHeader>
                    <CardBody>
                        <TableContainer component={Paper} style={{ boxShadow: 'none' }}>
                            {loading ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                    <CircularProgress />
                                </Box>
                            ) : (<Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Full Name</TableCell>
                                        <TableCell>Gender</TableCell>
                                        <TableCell>DOB</TableCell>
                                        <TableCell>Joining Date</TableCell>
                                        <TableCell>Email</TableCell>
                                        <TableCell>Pan Number</TableCell>
                                        <TableCell align="right">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {paginatedEmployees.map((emp, idx) => (
                                        <TableRow key={emp.id}>
                                            <TableCell>{emp.first_name + " " + emp.last_name}</TableCell>
                                            <TableCell>{emp.gender}</TableCell>
                                            <TableCell>{emp.date_of_birth}</TableCell>
                                            <TableCell>{emp.date_of_joining}</TableCell>
                                            <TableCell>{emp.email}</TableCell>
                                            <TableCell>{emp.pancard}</TableCell>
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
                                                    <MenuItem onClick={() => handleView(emp.id)}>
                                                        <ViewIcon fontSize="small" /> View
                                                    </MenuItem>
                                                    <MenuItem onClick={() => handleEdit(emp)}>
                                                        <EditIcon fontSize="small" /> Edit
                                                    </MenuItem>
                                                    <MenuItem onClick={() => handleQuarter(emp.id)}>
                                                        <HomeIcon fontSize="small" /> Quarter
                                                    </MenuItem>
                                                </Menu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>)}
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
