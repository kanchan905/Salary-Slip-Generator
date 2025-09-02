import React, { useEffect, useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    IconButton, TextField, TablePagination, Box,
    Chip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import {
    Button,
    Card,
    CardHeader,
    CardBody
} from "reactstrap";
import CircularProgress from '@mui/material/CircularProgress';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
    fetchEmployeeLoan,
    createEmployeeLoan,
    updateEmployeeLoan,
    fetchSingleEmployeeLoan,
} from '../../redux/slices/employeeLoanSlice';
import EmployeeLoanModal from '../../Modal/EmployeeLoan';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';
import { dateFormat } from 'utils/helpers';
import { History } from '@mui/icons-material';
import HistoryModal from 'Modal/HistoryModal';
import { fetchEmployees } from '../../redux/slices/employeeSlice';

const statusChipColor = (status) => {
    switch (status) {
        case "Active": return "success";
        case "Inactive": return "error";
        default: return "default";
    }
};

export default function EmployeeLoan() {
    const dispatch = useDispatch();
    const employees = useSelector((state) => state.employee.employees) || [];
    const employeeLoading = useSelector((state) => state.employee.loading);
    // const { loans, singleLoan, loading } = useSelector((state) => state.employeeLoan);
    const { loans, loading } = useSelector((state) => state.employeeLoan);
    const totalCount = useSelector((state) => state.employeeLoan.totalCount) || 0;
    const { error } = useSelector((state) => state.employeeLoan)
    const [menuIndex, setMenuIndex] = useState(null);
    const [formOpen, setFormOpen] = useState(false);
    const [formMode, setFormMode] = useState('create');
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState({
        employee_id: "",
        loan_type: "",
        loan_amount: "",
        interest_rate: "",
        sanctioned_date: "",
        total_installments: "",
        current_installment: "",
        remaining_balance: "",
        is_active: ""
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [menuRowId, setMenuRowId] = useState(null); // Track which row's menu is open
    const navigate = useNavigate();
    const [renderFunction, setRenderFunction] = React.useState(() => null);
    const [historyRecord, setHistoryRecord] = React.useState([]);
    const [firstRow, setFirstRow] = useState({});
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
    const currentRoles = useSelector((state) =>
        state.auth.user?.roles?.map(role => role.name) || []
    );

    const toggleHistoryModal = () => {
        setIsHistoryModalOpen(!isHistoryModalOpen);

        if (isHistoryModalOpen) {
            setHistoryRecord([]);
            // setFirstRow({});
        }
    };

    // const [shouldOpenHistory, setShouldOpenHistory] = React.useState(false);


    const getTableConfig = (data) => {
        return {
            head: [
                "Sr. No.",
                "Employee Name",
                "Loan Type",
                "Loan Amount",
                // "Interest Rate",
                "Sanctioned Date",
                "Total Installments",
                "Current Installment",
                "Remaining Balance",
                "Status",
                "Added By",
                "Edited By",
                "Created At",
                "Updated At"
            ],
            firstRow: (
                <tr className="bg-green text-white">
                    <td>{1}</td>
                    <td>{data?.employee?.name || "- -"} </td>
                    <td>{data?.loan_type ?? "-"}</td>
                    <td>{data?.loan_amount ?? "-"}</td>
                    {/* <td>{data?.interest_rate ?? "-"}</td> */}
                    <td>{dateFormat(data?.sanctioned_date) ?? "-"}</td>
                    <td>{data?.total_installments ?? "-"}</td>
                    <td>{data?.current_installment ?? "-"}</td>
                    <td>{data?.remaining_balance ?? "-"}</td>
                    <td>
                        {data?.is_active
                            ? <Chip sx={{ backgroundColor: 'white', color: 'green' }} label="Active" size="small" />
                            : <Chip sx={{ backgroundColor: 'white', color: 'red' }} label="Inactive" size="small" />
                        }
                    </td>
                    <td className='text-capitalize'>{data?.added_by
                        ? `${data.added_by.name || '-'}${data.added_by.roles && data.added_by.roles.length > 0 ? ' (' + data.added_by.roles.map(role => role.name).join(', ') + ')' : ''}`
                        : 'NA'}</td>
                    <td className='text-capitalize'>{data?.edited_by
                        ? `${data.edited_by.name || '-'}${data.edited_by.roles && data.edited_by.roles.length > 0 ? ' (' + data.edited_by.roles.map(role => role.name).join(', ') + ')' : ''}`
                        : 'NA'}</td>
                    <td>{data?.created_at ? new Date(data.created_at).toLocaleString() : '-'}</td>
                    <td>{data?.updated_at ? new Date(data.updated_at).toLocaleString() : '-'}</td>
                </tr>
            ),
            renderRow: (record, index) => (
                <tr key={index}>
                    <td>{index + 2}</td>
                    <td className='text-capitalize'>{record?.employee?.name || "- -"} </td>
                    <td>{record?.loan_type ?? "-"}</td>
                    <td>{record?.loan_amount ?? "-"}</td>
                    {/* <td>{record?.interest_rate ?? "-"}</td> */}
                    <td>{dateFormat(record?.sanctioned_date) ?? "-"}</td>
                    <td>{record?.total_installments ?? "-"}</td>
                    <td>{record?.current_installment ?? "-"}</td>
                    <td>{record?.remaining_balance ?? "-"}</td>
                    <td>{record?.is_active ? <Chip variant='outlined' color='success' label="Active" /> : <Chip variant='outlined' color='error' label="Inactive" />}</td>
                    <td className='text-capitalize'>{record?.added_by
                        ? `${record.added_by.name || '-'}${record.added_by.roles && record.added_by.roles.length > 0 ? ' (' + record.added_by.roles.map(role => role.name).join(', ') + ')' : ''}`
                        : 'NA'}</td>
                    <td className='text-capitalize'>{record?.edited_by
                        ? `${record.edited_by.name || '-'}${record.edited_by.roles && record.edited_by.roles.length > 0 ? ' (' + record.edited_by.roles.map(role => role.name).join(', ') + ')' : ''}`
                        : 'NA'}</td>
                    <td>{record?.created_at ? new Date(record.created_at).toLocaleString() : '-'}</td>
                    <td>{record?.updated_at ? new Date(record.updated_at).toLocaleString() : '-'}</td>
                </tr>
            ),
        }
    }

    useEffect(() => {
        dispatch(fetchEmployees({ page: 1, limit: 1000, search: "", institute: "" }));
        dispatch(fetchEmployeeLoan({ id: searchQuery, page: page + 1, limit: rowsPerPage }));
    }, [dispatch, searchQuery, page, rowsPerPage]);

    // Separate useEffect to ensure employees are loaded on component mount
    useEffect(() => {
        if (employees.length === 0) {
            dispatch(fetchEmployees({ page: 1, limit: 1000, search: "", institute: "" }));
        }
    }, [dispatch, employees.length]);


    const handleHistoryShow = (id) => {
        handleClose();
        dispatch(fetchSingleEmployeeLoan(id)).then((action) => {
            // Support both {data: {...}} and just {...}
            const loanData = action.payload?.data || action.payload;
            if (!loanData) {
                toast.error("Failed to fetch loan details.");
                return;
            }
            const config = getTableConfig(loanData);
            setTableHead(config.head);
            setFirstRow(config.firstRow);
            setRenderFunction(() => config.renderRow);
            const history = loanData.history;
            setHistoryRecord(Array.isArray(history) ? history : []);
            toggleHistoryModal();
        });
    };

    useEffect(() => {
        if (isHistoryModalOpen) {
            handleClose();
        }
    }, [isHistoryModalOpen]);


    const handlePageChange = (_, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (e) => {
        setRowsPerPage(parseInt(e.target.value, 10));
        setPage(0);
    };


    const handleClose = () => {
        setAnchorEl(null);
        setMenuRowId(null);
    };

    const toggleModal = (mode) => {
        if (mode === 'create') {
            setFormData({
                employee_id: "",
                loan_type: "",
                loan_amount: "",
                interest_rate: "",
                sanctioned_date: "",
                total_installments: "",
                current_installment: "",
                remaining_balance: "",
                is_active: ""
            });
            setFormMode('create');
        }
        setFormOpen(!formOpen);
    };

    const handleEdit = (row) => {
        dispatch(fetchSingleEmployeeLoan(row.id)).then((action) => {
            const loan = action.payload;
            if (!loan) {
                toast.error("Failed to fetch loan details.");
                return;
            }
            setEditId(row.id);
            setFormMode('edit');
            setFormData({
                employee_id: loan.employee_id || '',
                loan_type: loan.loan_type || '',
                loan_amount: loan.loan_amount ?? 0,
                interest_rate: loan.interest_rate ?? 0,
                sanctioned_date: loan.sanctioned_date || '',
                total_installments: loan.total_installments ?? 0,
                current_installment: loan.current_installment ?? 0,
                remaining_balance: loan.remaining_balance ?? 0,
                is_active: loan.is_active ?? 1,
            });
            setFormOpen(true);
            handleClose();
        });
    };

    const handleSubmit = (values, { setSubmitting, resetForm }) => {
        if (formMode === 'edit') {
            dispatch(updateEmployeeLoan({ id: editId, values: values }))
                .unwrap()
                .then(() => {
                    toast.success("EmployeeLoan updated successfully");
                    dispatch(fetchEmployeeLoan({ id: searchQuery, page, limit: rowsPerPage }));
                })
                .catch((err) => {
                    const apiMsg =
                        err?.response?.data?.message ||
                        err?.message ||
                        'Failed to save info.';
                    toast.error(apiMsg);
                });
        } else {
            dispatch(createEmployeeLoan(values))
                .unwrap()
                .then(() => {
                    toast.success("EmployeeLoan added");
                    dispatch(fetchEmployeeLoan({ id: searchQuery, page, limit: rowsPerPage }));
                })
                .catch((err) => {
                    const apiMsg =
                        err?.response?.data?.message ||
                        err?.message ||
                        'Failed to save info.';
                    toast.error(apiMsg);
                });
        }
        resetForm();
        setFormOpen(false);
        setEditId(null);
        setSubmitting(false);
    };

    const handleMenuClick = (event, rowId) => {
        setAnchorEl(event.currentTarget);
        setMenuRowId(rowId);
    };

    const handleView = (id) => {
        handleClose();
        navigate(`/employee-loan/view/${id}`);
    };

    return (
        <>
            <div className='header bg-gradient-info pb-8 pt-8 pt-md-8 main-head'></div>
            <div className="mt--7 mb-7 container-fluid">
                <Card className="card-stats mb-4 mb-lg-0">
                    <CardHeader>
                        <div className="d-flex justify-content-between align-items-center">
                            <h5 className="mb-0">Employee Loan</h5>
                            {
                               currentRoles.some(role => ['IT Admin',"Salary Processing Coordinator (NIOH)", "Salary Processing Coordinator (ROHC)"].includes(role)) && (
                                    <Button style={{ background: "#004080", color: "#fff" }} onClick={() => toggleModal("create")}>
                                        + Add
                                    </Button>
                                )}
                        </div>
                    </CardHeader>
                    <CardBody>
                        <div className="custom-scrollbar">
                            {loading ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <CircularProgress />
                                </Box>
                            ) : (
                                <TableContainer component={Paper} style={{ boxShadow: "none" }}>
                                    <Table>
                                        <TableHead>
                                            <TableRow style={{ whiteSpace: "nowrap" }}>
                                                <TableCell style={{ fontWeight: "900" }}>Sr. No.</TableCell>
                                                <TableCell style={{ fontWeight: "900" }}>Emp. Code</TableCell>
                                                <TableCell style={{ fontWeight: "900" }}>Name</TableCell>
                                                <TableCell style={{ fontWeight: "900" }}>Type</TableCell>
                                                <TableCell style={{ fontWeight: "900" }}>Amount</TableCell>
                                                <TableCell style={{ fontWeight: "900" }}>Remaining Balance</TableCell>
                                                <TableCell style={{ fontWeight: "900" }}>Sanctioned Date</TableCell>
                                                <TableCell style={{ fontWeight: "900" }}>Total Installments</TableCell>
                                                <TableCell style={{ fontWeight: "900" }}>Current Installment</TableCell>
                                                <TableCell style={{ fontWeight: "900" }}>Status</TableCell>
                                                <TableCell style={{ fontWeight: "900" }}>Action</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {loans.length === 0 ? (
                                                <TableRow>
                                                    <TableCell align="center" colSpan={11}>No data available</TableCell>
                                                </TableRow>
                                            ) : (
                                                <>
                                                    {loans.map((row, idx) => (
                                                        <TableRow key={row.id} style={{ whiteSpace: "nowrap" }}>
                                                            {/* Use idx + 1 for serial number */}
                                                            <TableCell>{(page * rowsPerPage) + idx + 1}</TableCell>
                                                            <TableCell className='text-uppercase' style={{ whiteSpace: "nowrap" }}>{row?.employee?.employee_code || "- -"}</TableCell>
                                                            <TableCell className='text-capitalize' style={{ whiteSpace: "nowrap" }}>{row?.employee?.first_name} {row?.employee?.middle_name} {row?.employee?.last_name}</TableCell>
                                                            <TableCell>{row?.loan_type}</TableCell>
                                                            <TableCell>{row?.loan_amount}</TableCell>
                                                            <TableCell>{row?.remaining_balance}</TableCell>
                                                            <TableCell>{dateFormat(row?.sanctioned_date)}</TableCell>
                                                            <TableCell>{row?.total_installments}</TableCell>
                                                            <TableCell>{row?.current_installment}</TableCell>
                                                            <TableCell>
                                                                <Chip
                                                                    label={row.is_active ? 'Active' : 'Inactive'}
                                                                    color={statusChipColor(row.is_active ? "Active" : "Inactive")}
                                                                    variant="outlined"
                                                                    size="small"
                                                                />
                                                            </TableCell>
                                                            <TableCell align="left">
                                                                <IconButton onClick={e => handleMenuClick(e, row.id)}>
                                                                    <MoreVertIcon />
                                                                </IconButton>
                                                                <Menu
                                                                    anchorEl={anchorEl}
                                                                    open={Boolean(anchorEl) && menuRowId === row.id}
                                                                    onClose={handleClose}
                                                                    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                                                                >
                                                                    {
                                                                       currentRoles.some(role => ['IT Admin',"Salary Processing Coordinator (NIOH)", "Salary Processing Coordinator (ROHC)"].includes(role)) && (
                                                                            <MenuItem onClick={() => handleEdit(row)}>
                                                                                <EditIcon fontSize="small" sx={{ mr: 1 }} /> Edit
                                                                            </MenuItem>
                                                                        )}
                                                                    <MenuItem onClick={() => handleView(row.id)}>
                                                                        <VisibilityIcon fontSize="small" sx={{ mr: 1 }} /> View
                                                                    </MenuItem>
                                                                    <MenuItem onClick={() => handleHistoryShow(row.id)}>
                                                                        <History fontSize="small" sx={{ mr: 1 }} /> History
                                                                    </MenuItem>
                                                                </Menu>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </>
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}
                        </div>
                        <TablePagination
                            component="div"
                            count={totalCount}
                            page={page}
                            onPageChange={handlePageChange}
                            rowsPerPage={rowsPerPage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </CardBody>
                </Card>
                <EmployeeLoanModal
                    employees={employees}
                    setFormOpen={setFormOpen}
                    formOpen={formOpen}
                    toggleModal={toggleModal}
                    formMode={formMode}
                    formData={formData}
                    handleChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
                    handleSubmit={handleSubmit}
                    employeeLoading={employeeLoading}
                />
            </div>

            <HistoryModal
                isOpen={isHistoryModalOpen}
                toggle={toggleHistoryModal}
                tableHead={tableHead}
                historyRecord={historyRecord}
                renderRow={renderFunction}
                firstRow={firstRow}
            />
        </>
    );
}
