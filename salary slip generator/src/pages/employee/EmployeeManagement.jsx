import React, { useEffect } from 'react';
import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, IconButton,
    Menu, MenuItem, TablePagination, TextField,
    Box
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import HistoryIcon from '@mui/icons-material/History';
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
import { fetchEmployeeById, fetchEmployees } from '../../redux/slices/employeeSlice';
import HomeIcon from '@mui/icons-material/Home';
import CircularProgress from '@mui/material/CircularProgress';
import HistoryModal from 'Modal/HistoryModal';
import { dateFormat } from 'utils/helpers';


export default function EmployeeManagement() {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [menuUserIndex, setMenuUserIndex] = React.useState(null);
    const employees = useSelector((state) => state.employee.employees) || [];
    const employeeDetail = useSelector((state) => state.employee.EmployeeDetail) || {};
    const totalCount = useSelector((state) => state.employee.totalCount) || 0;
    const { name } = useSelector((state) => state.auth.user.role);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [searchQuery, setSearchQuery] = React.useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const loading = useSelector((state) => state.employee.loading);
    const [ renderFunction, setRenderFunction ] = React.useState(() => null);
    const [historyRecord, setHistoryRecord] = React.useState([]);
    const [tableHead, setTableHead] = React.useState([
        "Sr. No.",
        "Head 1",
        "Head 2",
        "Head 3",
        "Head 4",
        "Head 5",
        "Head 6",
    ]);
    const [isHistoryModalOpen, setIsHistoryModalOpen] = React.useState(false);
    const toggleHistoryModal = () => {
        setIsHistoryModalOpen(!isHistoryModalOpen);
        setHistoryRecord([]);
    };
    const [shouldOpenHistory, setShouldOpenHistory] = React.useState(false);
        
        
    const getTableConfig = () => {
        return {
            head: [
                "Sr. No.",
                "Employee Code",
                "Name",
                "Email",
                "Pan Number",
                "Gender",
                "DOB",
                "Joining Date",
                "Added By",
                "Edited By"
            ],
            renderRow: (record, index) => (
                <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{record?.employee_code ?? "-"}</td>
                    <td>{record?.first_name} {record?.last_name}</td>
                    <td>{record?.email ?? "-"}</td>
                    <td>{record?.pancard ?? "-"}</td>
                    <td className='text-capitalize'>{record?.gender ?? "-"}</td>
                    <td>{dateFormat(record?.date_of_birth)  ?? "-"}</td>
                    <td>{dateFormat(record?.date_of_joining)  ?? "-"}</td>
                    <td>{ record?.added_by?.name || "NA" }</td>
                    <td>{ record?.edited_by?.name }</td>
                </tr>
            ),
        }
    }
    


    useEffect(() => {
        dispatch(fetchEmployees({ page: page + 1, limit: rowsPerPage, search: searchQuery }));
    }, [page, rowsPerPage, searchQuery, dispatch]);


    useEffect(() => {
        if (shouldOpenHistory && employeeDetail) {
            const config = getTableConfig();
            setHistoryRecord(employeeDetail?.history);
            setTableHead(config.head);
            setRenderFunction(() => config.renderRow);
            setIsHistoryModalOpen(true);
            setShouldOpenHistory(false);
        }
    }, [employeeDetail, shouldOpenHistory]);


    const handleHistoryShow = (id) => {
        setHistoryRecord([]);
        setIsHistoryModalOpen(true);
        dispatch(fetchEmployeeById(id))
        .unwrap()
        .then(() => {
            setShouldOpenHistory(true);
        }); 
    }

    // close the menu when history modal is open
    useEffect(() => {
        if (isHistoryModalOpen) {
            handleClose();
        }
    }, [isHistoryModalOpen]);



    const handlePageChange = (event, value) => {
        setPage(value);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value); 
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

    const handleEdit = (emp) => {
        handleClose();
        navigate(`/employee/edit/${emp.id}`);
    };

    const handleView = (id) => {
        handleClose();
        navigate(`/employee/${id}`);
    }

    const handleQuarter = (id) => {
        handleClose();
        navigate(`/employee/${id}/quarter`);
    }


    return (
        <>
            <div className='header bg-gradient-info pb-8 pt-8 pt-md-8 main-head'></div>
            <div className="mt--7 mb-7 container-fluid">
                <Card className="shadow border-0">
                    <CardHeader>
                        <div className="d-flex justify-content-between align-items-center">
                            <TextField placeholder="Search employee..." onChange={handleSearchChange} />
                            <NavLink to={`/employee/add`}>
                                <Button
                                    style={{ background: "#004080",color:'#fff' }}
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
                                        <TableCell style={{ fontWeight: "900" }}>Emp Code</TableCell>
                                        <TableCell style={{ fontWeight: "900" }}>Full Name</TableCell>
                                        <TableCell style={{ fontWeight: "900" }}>Gender</TableCell>
                                        <TableCell style={{ fontWeight: "900" }}>DOB</TableCell>
                                        <TableCell style={{ fontWeight: "900" }}>Joining Date</TableCell>
                                        <TableCell style={{ fontWeight: "900" }}>Email</TableCell>
                                        <TableCell style={{ fontWeight: "900" }}>Pan Number</TableCell>
                                        <TableCell align="right" style={{ fontWeight: "900" }}>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {employees.map((emp, idx) => (
                                        <TableRow key={emp.id}>
                                            <TableCell>{emp.employee_code}</TableCell>
                                            <TableCell>{emp.first_name + " " + emp?.middle_name + " " + emp.last_name}</TableCell>
                                            <TableCell sx={{ textTransform: 'capitalize' }}>{emp.gender}</TableCell>
                                            <TableCell>{dateFormat(emp.date_of_birth)}</TableCell>
                                            <TableCell>{dateFormat(emp.date_of_joining)}</TableCell>
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
                                                    <MenuItem onClick={() => handleHistoryShow(emp.id)}>
                                                        <HistoryIcon fontSize="small" /> History
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
                                    count={totalCount}
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

            <HistoryModal 
                isOpen={isHistoryModalOpen}
                toggle={toggleHistoryModal}
                tableHead={tableHead}
                historyRecord={historyRecord}
                renderRow={renderFunction}
            />
        </>
    );
}
