import React, { useEffect, useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, IconButton,
    Menu, MenuItem, TablePagination, TextField,
    Box,
    FormControl,
    InputLabel,
    Select
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
import CircularProgress from '@mui/material/CircularProgress';
import HistoryModal from 'Modal/HistoryModal';
import { dateFormat } from 'utils/helpers';
import useDebounce from '../../hooks/useDebounce';
import Chip from '@mui/material/Chip';


export default function EmployeeManagement() {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [menuUserIndex, setMenuUserIndex] = React.useState(null);
    const employees = useSelector((state) => state.employee.employees) || [];
    const employeeDetail = useSelector((state) => state.employee.EmployeeDetail) || {};
    const totalCount = useSelector((state) => state.employee.totalCount) || 0;
    const currentRoles = useSelector((state) =>
        state.auth.user?.roles?.map(role => role.name) || []
    );
    const { institute } = useSelector((state) => state.auth.user);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [searchQuery, setSearchQuery] = React.useState("");
    const [inputValue, setInputValue] = React.useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const loading = useSelector((state) => state.employee.loading);
    const [renderFunction, setRenderFunction] = React.useState(() => null);
    const [firstRow, setFirstRow] = useState(null);
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
    const [selectedInstitute, setSelectedInstitute] = React.useState("");
    const instituteList = [
        { id: "1", name: "NIOH" },
        { id: "2", name: "ROHC" },
        { id: "3", name: "BOTH" },
    ];

    const handleInstituteChange = (event) => {
        setSelectedInstitute(event.target.value);
        setPage(0);
    };

    // Define a function to get the color for each status
    const getStatusColor = (status) => {
        switch (status) {
            case "Active":
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
                "Retirement Date",
                "Joining Date",
                "Institute",
                "Credit Society Member",
                "GIS Eligibility",
                "GIS Number",
                "HRA Eligibility",
                "NPA Eligibility",
                "Uniform Allowance Eligibility",
                "Pension Scheme",
                "Pension Number",
                "PWD Status",
                "Added By",
                "Edited By",
                "Created At",
                "Updated At"
            ],
            firstRow:
                <tr className='bg-green text-white'>
                    <td>{1}</td>
                    <td className='text-uppercase'>{employeeDetail?.employee_code || "-"}</td>
                    <td className='text-capitalize'>{employeeDetail?.name || "-"}</td>
                    <td>{employeeDetail?.email ?? "-"}</td>
                    <td>{employeeDetail?.pancard ?? "-"}</td>
                    <td className='text-capitalize'>{employeeDetail?.gender ?? "-"}</td>
                    <td>{dateFormat(employeeDetail?.date_of_birth) ?? "-"}</td>
                    <td>{dateFormat(employeeDetail?.date_of_retirement) ?? "-"}</td>
                    <td>{dateFormat(employeeDetail?.date_of_joining) ?? "-"}</td>
                    <td>{employeeDetail?.institute || '-'}</td>
                    <td>{employeeDetail?.credit_society_member ? 'Yes' : 'No'}</td>
                    <td>{employeeDetail?.gis_eligibility ? 'Yes' : 'No'}</td>
                    <td>{employeeDetail?.gis_no}</td>
                    <td>{employeeDetail?.hra_eligibility ? 'Yes' : 'No'}</td>
                    <td>{employeeDetail?.npa_eligibility ? 'Yes' : 'No'}</td>
                    <td>{employeeDetail?.uniform_allowance_eligibility ? 'Yes' : 'No'}</td>
                    <td>{employeeDetail?.pension_scheme || '-'}</td>
                    <td>{employeeDetail?.pension_number || '-'}</td>
                    <td>{employeeDetail?.pwd_status ? 'Yes' : 'No'}</td>
                    <td>{employeeDetail?.added_by
                        ? `${employeeDetail.added_by.name || '-'}${employeeDetail.added_by.roles && employeeDetail.added_by.roles.length > 0 ? ' (' + employeeDetail.added_by.roles.map(role => role.name).join(', ') + ')' : ''}`
                        : 'NA'}</td>
                    <td>{employeeDetail?.edited_by
                        ? `${employeeDetail.edited_by.name || '-'}${employeeDetail.edited_by.roles && employeeDetail.edited_by.roles.length > 0 ? ' (' + employeeDetail.edited_by.roles.map(role => role.name).join(', ') + ')' : ''}`
                        : 'NA'}</td>
                    <td>{employeeDetail?.created_at ? new Date(employeeDetail.created_at).toLocaleString() : '-'}</td>
                    <td>{employeeDetail?.updated_at ? new Date(employeeDetail.updated_at).toLocaleString() : '-'}</td>
                </tr>
            ,
            renderRow: (record, index) => (
                <tr key={`employee-history${index}`}>
                    <td>{index + 2}</td>
                    <td className='text-uppercase'>{record?.employee_code || "-"}</td>
                    <td className='text-capitalize'>{record?.name || "-"}</td>
                    <td>{record?.email ?? "-"}</td>
                    <td>{record?.pancard ?? "-"}</td>
                    <td className='text-capitalize'>{record?.gender ?? "-"}</td>
                    <td>{dateFormat(record?.date_of_birth) ?? "-"}</td>
                    <td>{dateFormat(record?.date_of_retirement) ?? "-"}</td>
                    <td>{dateFormat(record?.date_of_joining) ?? "-"}</td>
                    <td>{record?.institute || '-'}</td>
                    <td>{record?.credit_society_member ? 'Yes' : 'No'}</td>
                    <td>{record?.gis_eligibility ? 'Yes' : 'No'}</td>
                    <td>{record?.gis_no}</td>
                    <td>{record?.hra_eligibility ? 'Yes' : 'No'}</td>
                    <td>{record?.npa_eligibility ? 'Yes' : 'No'}</td>
                    <td>{record?.uniform_allowance_eligibility ? 'Yes' : 'No'}</td>
                    <td>{record?.pension_scheme || '-'}</td>
                    <td>{record?.pension_number || '-'}</td>
                    <td>{record?.pwd_status ? 'Yes' : 'No'}</td>
                    <td>{record?.added_by
                        ? `${record.added_by.name || '-'}${record.added_by.roles && record.added_by.roles.length > 0 ? ' (' + record.added_by.roles.map(role => role.name).join(', ') + ')' : ''}`
                        : 'NA'}</td>
                    <td>{record?.edited_by
                        ? `${record.edited_by.name || '-'}${record.edited_by.roles && record.edited_by.roles.length > 0 ? ' (' + record.edited_by.roles.map(role => role.name).join(', ') + ')' : ''}`
                        : 'NA'}</td>
                    <td>{record?.created_at ? new Date(record.created_at).toLocaleString() : '-'}</td>
                    <td>{record?.updated_at ? new Date(record.updated_at).toLocaleString() : '-'}</td>
                </tr>
            ),
        }
    };




    useEffect(() => {
        dispatch(fetchEmployees({ page: page + 1, limit: rowsPerPage, search: searchQuery, institute: selectedInstitute }));
    }, [page, rowsPerPage, searchQuery, dispatch, selectedInstitute]);


    useEffect(() => {
        if (shouldOpenHistory && employeeDetail) {
            const config = getTableConfig();
            setHistoryRecord(employeeDetail?.history);
            setTableHead(config.head);
            setRenderFunction(() => config.renderRow);
            setFirstRow(config.firstRow);
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

    const debouncedSearch = useDebounce((value) => {
        setSearchQuery(value);
        setPage(0);
    }, 1000);

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
                        <div className="filter-row d-flex justify-content-between align-items-center flex-wrap">
                            <TextField
                                label="Search by name & code"
                                value={inputValue}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    debouncedSearch(value);
                                    setInputValue(value);
                                }}
                                className="filter-item"
                            />
                            {
                                institute === 'BOTH' && (
                                    <FormControl size="small" style={{ minWidth: 160 }} className="filter-item">
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
                                )
                            }
                            {
                                currentRoles.some(role => ['IT Admin', "Salary Processing Coordinator (NIOH)", "Salary Processing Coordinator (ROHC)"].includes(role)) && (
                                    <NavLink to={`/employee/add`} className="filter-item" style={{ width: 'auto' }}>
                                        <Button
                                            style={{ background: "#004080", color: '#fff' }}
                                            type="button"
                                            fullWidth
                                        >
                                            + Add Employee
                                        </Button>
                                    </NavLink>
                                )}
                        </div>
                    </CardHeader>
                    <CardBody>
                        <TableContainer component={Paper} style={{ boxShadow: 'none' }}>
                            <div className="table-responsive">
                                {loading ? (
                                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <CircularProgress />
                                    </Box>
                                ) : (<Table>
                                    <TableHead>
                                        <TableRow style={{ whiteSpace: "nowrap" }}>
                                            <TableCell style={{ fontWeight: "900" }}>Sr. No.</TableCell>
                                            <TableCell style={{ fontWeight: "900" }}>Emp. Code</TableCell>
                                            <TableCell style={{ fontWeight: "900" }}>Full Name</TableCell>
                                            <TableCell style={{ fontWeight: "900" }}>Gender</TableCell>
                                            <TableCell style={{ fontWeight: "900" }}>DOB</TableCell>
                                            <TableCell style={{ fontWeight: "900" }}>DOJ</TableCell>
                                            <TableCell style={{ fontWeight: "900" }}>Email</TableCell>
                                            <TableCell style={{ fontWeight: "900" }}>Status</TableCell>
                                            <TableCell style={{ fontWeight: "900" }}>Institute</TableCell>
                                            <TableCell align="right" style={{ fontWeight: "900" }}>Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            employees.length <= 0 ? (
                                                <TableRow>
                                                    <TableCell align="center" colSpan={9}>No data available</TableCell>
                                                </TableRow>
                                            ) : (
                                                employees.map((emp, idx) => (
                                                    <TableRow key={`employee-list${emp.id}`} style={{ whiteSpace: "nowrap" }}>
                                                        <TableCell>{(page * rowsPerPage) + idx + 1}</TableCell>
                                                        <TableCell className='text-uppercase'>{emp.employee_code || "- -"}</TableCell>
                                                        <TableCell className='text-capitalize'>{emp?.name || "NA"}</TableCell>
                                                        <TableCell sx={{ textTransform: 'capitalize' }}>{emp.gender}</TableCell>
                                                        <TableCell>{dateFormat(emp.date_of_birth)}</TableCell>
                                                        <TableCell>{dateFormat(emp.date_of_joining)}</TableCell>
                                                        <TableCell>{emp.email}</TableCell>
                                                        <TableCell>
                                                            <Chip
                                                                label={emp?.employee_status?.[0]?.status || "Unknown"}
                                                                color={getStatusColor(emp?.employee_status?.[0]?.status)}
                                                                variant="outlined"
                                                            />
                                                        </TableCell>
                                                        <TableCell>{emp.institute}</TableCell>
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
                                                                <MenuItem onClick={() => handleHistoryShow(emp.id)}>
                                                                    <HistoryIcon fontSize="small" /> History
                                                                </MenuItem>
                                                            </Menu>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )
                                        }
                                    </TableBody>
                                </Table>)}
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
                    </CardBody>
                </Card>

            </div>

            <HistoryModal
                isOpen={isHistoryModalOpen}
                toggle={toggleHistoryModal}
                tableHead={tableHead}
                historyRecord={historyRecord}
                firstRow={firstRow}
                renderRow={renderFunction}
            />
        </>
    );
}

<style>{`
  .table-responsive {
    width: 100%;
    overflow-x: auto;
  }
  .filter-row {
    gap: 1rem;
  }
  .filter-item {
    min-width: 160px;
  }
  @media (max-width: 768px) {
    .MuiTableCell-root, .MuiTableCell-head, .MuiTableCell-body {
      padding: 8px 4px;
      font-size: 12px;
      white-space: nowrap;
    }
    .filter-row {
      flex-direction: column !important;
      align-items: stretch !important;
      gap: 0.75rem;
    }
    .filter-item {
      width: 100% !important;
      min-width: 0 !important;
    }
  }
`}</style>
