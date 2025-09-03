import React, { useEffect, useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    IconButton, TextField, TablePagination, Box, Menu, MenuItem,
    Chip,
    Select,
    Grid,
    InputLabel,
    FormControl,
    Checkbox,
} from '@mui/material';
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
    fetchNetPension,
    finalizeNetPension,
    releaseNetPension,
    showNetPension,
    updateNetPension,
    verifyNetPension,
    verifyNetPensionAdmin,
} from '../../redux/slices/netPensionSlice';
import NetPensionModal from '../../Modal/NetPensionModal';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ViewIcon from '@mui/icons-material/Visibility';
import { useLocation, useNavigate } from 'react-router-dom';
import HistoryIcon from '@mui/icons-material/History';
import HistoryModal from 'Modal/HistoryModal';
import { months } from 'utils/helpers';
import { dateFormat } from 'utils/helpers';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { fetchPensioners } from '../../redux/slices/pensionerSlice';
import Preloader from 'include/Preloader';
import { setIsReleasing } from '../../redux/slices/netSalarySlice';


export default function NetPension() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const currentRoles = useSelector((state) =>
        state.auth.user?.roles?.map(role => role.name) || []
    );
    const { netPension, loading } = useSelector((state) => state.netPension);
      const {isReleasing } = useSelector((state) => state.netSalary);
    const totalCount = useSelector((state) => state.netPension?.totalCount) || 0;
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedRow, setSelectedRow] = useState(null);
    const [formOpen, setFormOpen] = useState(false);
    const [formMode, setFormMode] = useState('create');
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState({
        pensioner_id: "",
        pensioner_bank_id: "",
        month: "",
        year: "",
        processing_date: "",
        payment_date: "",
    });
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [renderFunction, setRenderFunction] = useState(() => () => null);
    const [tableHead, setTableHead] = useState([]);
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
    const [historyRecord, setHistoryRecord] = useState([]);
    const [firstRow, setFirstRow] = useState(null);
    const [filters, setFilters] = useState({
        month: '',
        year: '',
        ppo_no: '',
        user_id: '',
        is_verified: '',
    });
    const [selectedIds, setSelectedIds] = useState([]);
    const canUserManageFinalization = currentRoles.some(role => ["Accounts Officer", "IT Admin"].includes(role));
    const { pensioners } = useSelector((state) => state.pensioner);
    // const [isReleasing, setIsReleasing] = useState(false);


    const toggleHistoryModal = () => {
        setIsHistoryModalOpen(!isHistoryModalOpen);
        if (isHistoryModalOpen) {
            setHistoryRecord([]);
            setFirstRow(null);
        }
        handleClose();
    };

    const ARREAR_TYPES = [
        'Pay Arrear',
        'Commutational Arrear',
        'Additional Pension Arrear',
        'Medical Arrear',
        'DA Arrear',
        'Other'
    ];

    const renderArrearCells = (monthlyPension) => {
        // It loops through our defined list of types, not the API data.
        return ARREAR_TYPES.map(arrearType => {
            // It finds the matching arrear from the pay slip data.
            const arrear = monthlyPension?.arrears?.find(a => a.type === arrearType);

            // This is the key: It safely gets the amount OR defaults to '0'.
            const amount = arrear?.amount ?? '0';

            // Return the table cell.
            return <td className="amount-col" key={arrearType}>{amount}</td>;
        });
    };


    const getTableConfig = (data, type) => {
        const monthlyPension = data?.monthly_pension;
        const pensionerDeduction = data?.pensioner_deduction;

        switch (type) {
            case "NetPension":
                return {
                    head: [
                        "Sr. No.", "PPO No", "Month", "Year",
                        // Monthly Pension Details
                        "Basic Pension", "Additional Pension", "DR Amount", "Medical Allowance", 'Pay Arrear',
                        'Commutational Arrear',
                        'Additional Pension Arrear',
                        'Medical Arrear',
                        'DA Arrear',
                        'Other', "Total Pension",
                        // Deduction Details
                        "Commutation", "Income Tax", "Recovery", "Other Deduction", "Total Deductions",
                        // Final Details
                        "Net Pension", "Processing Date", "Payment Date", "Added By", "Edited By", "Created At", "Updated At"
                    ],
                    firstRow: (
                        <tr className="bg-green text-white">
                            <td>{1}</td>
                            <td>{data.pensioner?.ppo_no || "N/A"}</td>
                            <td>{months.find((m) => m.value === data.month)?.label || 'N/A'}</td>
                            <td>{data.year || 'N/A'}</td>
                            {/* Monthly Pension Data */}
                            <td>{monthlyPension?.basic_pension ?? '0'}</td>
                            <td>{monthlyPension?.additional_pension ?? '0'}</td>
                            <td>{monthlyPension?.dr_amount ?? '0'}</td>
                            <td>{monthlyPension?.medical_allowance ?? '0'}</td>
                            {renderArrearCells(monthlyPension)}
                            <td>{monthlyPension?.total_pension ?? '0'}</td>
                            {/* Deduction Data */}
                            <td>{pensionerDeduction?.commutation_amount ?? '0'}</td>
                            <td>{pensionerDeduction?.income_tax ?? '0'}</td>
                            <td>{pensionerDeduction?.recovery ?? '0'}</td>
                            <td>{pensionerDeduction?.other ?? '0'}</td>
                            <td>{pensionerDeduction?.amount ?? '0'}</td>
                            {/* Final Data */}
                            <td>{data.net_pension || "0"}</td>
                            <td>{dateFormat(data.processing_date) || "N/A"}</td>
                            <td>{dateFormat(data.payment_date) || "N/A"}</td>
                            <td>{data.added_by
                                ? `${data.added_by.name || '-'}${data.added_by.roles && data.added_by.roles.length > 0 ? ' (' + data.added_by.roles.map(role => role.name).join(', ') + ')' : ''}`
                                : 'N/A'}</td>
                            <td>{data.edited_by
                                ? `${data.edited_by.name || '-'}${data.edited_by.roles && data.edited_by.roles.length > 0 ? ' (' + data.edited_by.roles.map(role => role.name).join(', ') + ')' : ''}`
                                : 'N/A'}</td>
                            <td>{data.created_at ? new Date(data.created_at).toLocaleString() : '-'}</td>
                            <td>{data.updated_at ? new Date(data.updated_at).toLocaleString() : '-'}</td>
                        </tr>
                    ),
                    renderRow: (record, index) => {
                        const monthlyPension = record?.monthly_pension;
                        const pensionerDeduction = record?.pensioner_deduction;

                        return (
                            <tr key={record.id || index}>
                                <td>{index + 2}</td>
                                <td>{data.pensioner?.ppo_no || "N/A"}</td>
                                <td>{months.find((m) => m.value === record.month)?.label || 'N/A'}</td>
                                <td>{record.year || 'N/A'}</td>
                                {/* Monthly Pension Data */}
                                <td>{monthlyPension ? monthlyPension[0]?.basic_pension ?? '0' : '0'}</td>
                                <td>{monthlyPension ? monthlyPension[0]?.additional_pension ?? '0' : '0'}</td>
                                <td>{monthlyPension ? monthlyPension[0]?.dr_amount ?? '0' : '0'}</td>
                                <td>{monthlyPension ? monthlyPension[0]?.medical_allowance ?? '0' : '0'}</td>
                                {renderArrearCells(monthlyPension)}
                                <td>{monthlyPension ? monthlyPension[0]?.total_pension ?? '0' : '0'}</td>
                                {/* Deduction Data */}
                                <td>{pensionerDeduction ? pensionerDeduction[0]?.commutation_amount ?? '0' : '0'}</td>
                                <td>{pensionerDeduction ? pensionerDeduction[0]?.income_tax ?? '0' : '0'}</td>
                                <td>{pensionerDeduction ? pensionerDeduction[0]?.recovery ?? '0' : '0'}</td>
                                <td>{pensionerDeduction ? pensionerDeduction[0]?.other ?? '0' : '0'}</td>
                                <td>{pensionerDeduction ? pensionerDeduction[0]?.amount ?? '0' : '0'}</td>
                                {/* Final Data from history record */}
                                <td>{record.net_pension || "0"}</td>
                                <td>{dateFormat(record.processing_date) || "N/A"}</td>
                                <td>{dateFormat(record.payment_date) || "N/A"}</td>
                                <td>{record.added_by
                                    ? `${record.added_by.name || '-'}${record.added_by.roles && record.added_by.roles.length > 0 ? ' (' + record.added_by.roles.map(role => role.name).join(', ') + ')' : ''}`
                                    : 'N/A'}</td>
                                <td>{record.edited_by
                                    ? `${record.edited_by.name || '-'}${record.edited_by.roles && record.edited_by.roles.length > 0 ? ' (' + record.edited_by.roles.map(role => role.name).join(', ') + ')' : ''}`
                                    : 'N/A'}</td>
                                <td>{record.created_at ? new Date(record.created_at).toLocaleString() : '-'}</td>
                                <td>{record.updated_at ? new Date(record.updated_at).toLocaleString() : '-'}</td>
                            </tr>
                        );
                    },
                };
            default:
                return { head: [], firstRow: null, renderRow: () => null };
        }
    };


    const handleHistoryStatus = (id) => {
        handleClose();

        dispatch(showNetPension({ id })).then((res) => {
            const currentRecord = res.payload;
            const history = currentRecord?.history;


            if (currentRecord && Array.isArray(history)) {
                const config = getTableConfig(currentRecord, "NetPension");
                setFirstRow(config.firstRow);
                setHistoryRecord(history);
                setTableHead(config.head);
                setRenderFunction(() => config.renderRow);
                setIsHistoryModalOpen(true);

            } else {
                toast.warn("No history found for this record.");
                setHistoryRecord([]);
                setFirstRow(null);
            }
        }).catch(err => {
            toast.error("Failed to fetch history.");
        });
    };


    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const monthFromUrl = params.get('month');
        const yearFromUrl = params.get('year');
        const ppoNoFromUrl = params.get('ppo_no');
        const userIdFromUrl = params.get('user_id');
        const verificationStatusFromUrl = params.get('is_verified');
        const initialFilters = {
            month: monthFromUrl || filters.month,
            year: yearFromUrl || filters.year,
            ppo_no: ppoNoFromUrl || filters.ppo_no,
            user_id: userIdFromUrl || filters.user_id,
            is_verified: verificationStatusFromUrl || filters.is_verified,
        };


        if (monthFromUrl || yearFromUrl) {
            setFilters(initialFilters);
        }

        dispatch(fetchNetPension({
            page: page + 1,
            limit: rowsPerPage,
            ...initialFilters
        }));
        dispatch(fetchPensioners({ page: '1', limit: 1000, id: '', search: '' }));
    }, [dispatch, page, rowsPerPage, location.search]);


    const handlePageChange = (_, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (e) => {
        setRowsPerPage(parseInt(e.target.value, 10));
        setPage(0);
    };


    const handleClose = () => {
        setAnchorEl(null);
        setSelectedRow(null);
    };

    const toggleModal = (mode) => {
        if (mode === 'create') {
            setFormData({
                pensioner_id: "",
                pensioner_bank_id: "",
                month: "",
                year: "",
                processing_date: "",
                payment_date: "",
            });
            setFormMode('create');
        }
        setFormOpen(!formOpen);
    };



    const handleSubmit = (values, { setSubmitting, resetForm }) => {
        dispatch(updateNetPension({ id: editId, values }))
            .unwrap()
            .then(() => {
                toast.success("NetPension updated");
                dispatch(fetchNetPension({ page, limit: rowsPerPage, month: '', year: '', ppo_no: '', user_id: '', is_verified: '' }));
            })
            .catch((err) => {
                const apiMsg =
                    err?.response?.data?.message ||
                    err?.message ||
                    'Failed to save net pension.';
                toast.error(apiMsg);
            });
        resetForm();
        setFormOpen(false);
        setEditId(null);
        setSubmitting(false);
    };

    const handleMenuClick = (event, row) => {
        setAnchorEl(event.currentTarget);
        setSelectedRow(row);
    };

    const handleView = (id) => {
        handleClose();
        navigate(`/net-pension/view/${id}`);
    }


    // Helper to determine current verification step and status field
    function getCurrentVerificationStep(row) {
        if (!row.pensioner_operator_status) return { step: "Pensioners Operator", statusField: "pensioner_operator_status" };
        if (!row.ddo_status) return { step: "Drawing and Disbursing Officer", statusField: "ddo_status" };
        if (!row.section_officer_status) return { step: "Section Officer (Accounts)", statusField: "section_officer_status" };
        if (!row.account_officer_status) return { step: "Accounts Officer", statusField: "account_officer_status" };
        return { step: "Completed", statusField: null };
    }

    // Helper to check if user can verify at this step
    function canVerify(row) {
        if (currentRoles.includes("IT Admin")) {
            return true;
        }
        const { step } = getCurrentVerificationStep(row);
        if (step === "Pensioners Operator" && currentRoles.some(role => ["Pensioners Operator"].includes(role))) return true;
        if (step === "Drawing and Disbursing Officer" && currentRoles.some(role => ["Drawing and Disbursing Officer (NIOH)"].includes(role))) return true;
        if (step === "Section Officer (Accounts)" && currentRoles.some(role => ["Section Officer (Accounts)"].includes(role))) return true;
        if (step === "Accounts Officer" && currentRoles.some(role => ["Accounts Officer"].includes(role))) return true;
        return false;
    }

    // Replace handleToggleStatus with step-based verification
    const handleStepVerification = (row, statusField) => {
        dispatch(verifyNetPension({ selected_id: [row.id], statusField }))
            .unwrap()
            .then(() => {
                toast.success("NetPension verified successfully");
                dispatch(fetchNetPension({ page: page + 1, limit: rowsPerPage, ...filters }));
            })
            .catch((err) => {
                const apiMsg =
                    err?.response?.data?.message ||
                    err?.message ||
                    'Failed to verify net pension.';
                toast.error(apiMsg);
            });
    };

    const handleSelectAll = (event) => {
        if (event.target.checked) {
            const allIds = netPension.map((row) => row.id);
            setSelectedIds(allIds);
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelect = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    // Update handleBulkStatusUpdate to only verify slips at the current user's step
    const handleBulkStatusUpdate = () => {
        // Only verify those at the current user's step
        const slipsToVerify = netPension.filter(row => canVerify(row) && selectedIds.includes(row.id));
        if (slipsToVerify.length === 0) {
            toast.warn("No eligible slips to verify for your role.");
            return;
        }
        const { statusField } = getCurrentVerificationStep(slipsToVerify[0]);
        const ids = slipsToVerify.map(row => row.id);
        dispatch(verifyNetPension({ selected_id: ids, statusField }))
            .unwrap()
            .then(() => {
                toast.success("Selected net pensions verified");
                setSelectedIds([]);
                dispatch(fetchNetPension({ page: page + 1, limit: rowsPerPage, ...filters }));
            })
            .catch(() => toast.error("Verification failed"));
    };

    const handleClearFilters = () => {
        setFilters({ month: '', year: '', ppo_no: '', user_id: '', is_verified: '' });
        setPage(0);
        navigate('/net-pension');
    };

    const handleSearch = () => {
        setPage(0);
        const queryString = new URLSearchParams(filters).toString();
        navigate(`/net-pension?${queryString}`);
    };

    const getEmployeeCodeById = (id) => {
        const record = netPension.find(item => item.id === id);
        return record?.employee?.employee_code || `ID ${id}`;
    };

    // --- NEW: Handlers for Finalize and Release ---
    const handleBulkFinalize = () => {
        if (selectedIds.length === 0) {
            toast.warn("Please select at least one record to finalize.");
            return;
        }
        dispatch(finalizeNetPension({ selected_id: selectedIds }))
            .unwrap()
            .then((response) => {
                // Check if the response has the expected structure
                if (response && response.success && response.skipped && response.errors) {
                    const successCount = response.success.length;
                    const skippedCount = response.skipped.length;
                    const errorCount = response.errors.length;

                    // 1. Show SUCCESS messages
                    if (successCount > 0) {
                        const successCodes = response.success.map(id => getEmployeeCodeById(id)).join(', ');
                        toast.success(`${successCount} record(s) finalized successfully: ${successCodes}`);
                    }

                    // 2. Show SKIPPED (Warning) messages
                    if (skippedCount > 0) {
                        const skippedCodes = response.skipped.map(id => getEmployeeCodeById(id)).join(', ');
                        toast.warn(`${skippedCount} record(s) were skipped (already finalized or not fully verified): ${skippedCodes}`);
                    }

                    // 3. Show ERROR messages
                    if (errorCount > 0) {
                        // Create a formatted list for the toast
                        const ErrorToast = ({ messages }) => (
                            <div>
                                <strong>{`Finalization failed for ${errorCount} record(s):`}</strong>
                                <ul style={{ paddingLeft: '20px', margin: '5px 0 0 0' }}>
                                    {messages.map((msg, index) => (
                                        <li key={index}>{msg}</li>
                                    ))}
                                </ul>
                            </div>
                        );
                        // Display the errors in a single, more readable toast
                        toast.error(<ErrorToast messages={response.errors} />, {
                            autoClose: 10000 // Give user more time to read errors
                        });
                    }

                    // If nothing was processed at all
                    if (successCount === 0 && skippedCount === 0 && errorCount === 0) {
                        toast.info("No records were processed.");
                    }
                } else {
                    // Fallback for an unexpected response structure
                    toast.success("Finalization request completed.");
                }

                dispatch(fetchNetPension({ page: page + 1, limit: rowsPerPage, ...filters })); // Refresh the table
                setSelectedIds([]); // Clear selection
            })
            .catch((err) => {
                const apiMsg = err?.response?.data?.message || err?.message || 'Finalization failed.';
                toast.error(apiMsg);
            });
    };

    const handleBulkRelease = () => {
        if (selectedIds.length === 0) {
            toast.warn("Please select at least one record to release.");
            return;
        }
        // setIsReleasing(true);
        dispatch(setIsReleasing(true));
        dispatch(releaseNetPension({ selected_id: selectedIds }))
            .unwrap()
            .then((response) => {
                // Check if the response has the expected structure
                if (response && response.success && response.skipped && response.errors) {
                    const successCount = response.success.length;
                    const skippedCount = response.skipped.length;
                    const errorCount = response.errors.length;

                    if (successCount > 0) {
                        const successCodes = response.success.map(id => getEmployeeCodeById(id)).join(', ');
                        toast.success(`${successCount} record(s) released successfully: ${successCodes}`);
                    }

                    if (skippedCount > 0) {
                        const skippedCodes = response.skipped.map(id => getEmployeeCodeById(id)).join(', ');
                        toast.warn(`${skippedCount} record(s) were skipped (not finalized or already released): ${skippedCodes}`);
                    }

                    if (errorCount > 0) {
                        const ErrorToast = ({ messages }) => (
                            <div>
                                <strong>{`Release failed for ${errorCount} record(s):`}</strong>
                                <ul style={{ paddingLeft: '20px', margin: '5px 0 0 0' }}>
                                    {messages.map((msg, index) => (
                                        <li key={index}>{msg}</li>
                                    ))}
                                </ul>
                            </div>
                        );
                        toast.error(<ErrorToast messages={response.errors} />, {
                            autoClose: 10000
                        });
                    }

                    if (successCount === 0 && skippedCount === 0 && errorCount === 0) {
                        toast.info("No records were processed.");
                    }
                } else {
                    toast.success("Release request completed.");
                }

                dispatch(fetchNetPension({ page: page + 1, limit: rowsPerPage, ...filters })); // Refresh the table
                setSelectedIds([]); // Clear selection
            })
            .catch((err) => {
                const apiMsg = err?.response?.data?.message || err?.message || 'Release failed.';
                toast.error(apiMsg);
            })
            .finally(() => {
                // setIsReleasing(false);
                dispatch(setIsReleasing(false));
            });
    };


    return (
        <>
            {
                !isReleasing && (
                    <>
                        <div className='header bg-gradient-info pb-8 pt-8 pt-md-8 main-head'></div>
                        <div className="mt--7 mb-7 container-fluid">
                            <Card className="card-stats mb-4 mb-lg-0">
                                <CardHeader>
                                    <Box sx={{ p: 2, mb: 3, border: '1px solid #e0e0e0', borderRadius: '8px' }} className="cardheader-flex-group">
                                        <div className="cardheader-flex-left w-75">
                                            <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
                                                <Grid item size={{ xs: 6, md: 3 }} >
                                                    <FormControl fullWidth size="small">
                                                        <InputLabel>{"Month"}</InputLabel>
                                                        <Select
                                                            name="month"
                                                            value={filters.month}
                                                            label="Month"
                                                            onChange={(e) => setFilters({ ...filters, month: e.target.value })}
                                                        >
                                                            <MenuItem value="">All</MenuItem>
                                                            {months.map((month) => (
                                                                <MenuItem key={month.value} value={month.value}>
                                                                    {month.label}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item size={{ xs: 6, md: 3 }} >
                                                    <TextField
                                                        label="Year"
                                                        name="year"
                                                        type="text"
                                                        size="small"
                                                        fullWidth
                                                        value={filters.year}
                                                        onChange={(e) => setFilters({ ...filters, year: e.target.value })}
                                                    />
                                                </Grid>
                                                <Grid item size={{ xs: 6, md: 3 }} >
                                                    <TextField
                                                        label="PPO No"
                                                        name="ppo_no"
                                                        type="text"
                                                        size="small"
                                                        fullWidth
                                                        value={filters.ppo_no}
                                                        onChange={(e) => setFilters({ ...filters, ppo_no: e.target.value })}
                                                    />
                                                </Grid>
                                                <Grid item size={{ xs: 6, md: 3 }} >
                                                    <FormControl fullWidth size="small">
                                                        <InputLabel>Pensioner</InputLabel>
                                                        <Select
                                                            name="user_id"
                                                            value={filters.user_id}
                                                            label="Pensioner"
                                                            onChange={(e) => setFilters({ ...filters, user_id: e.target.value })}
                                                        >
                                                            <MenuItem value="All"><em>All</em></MenuItem>
                                                            {pensioners.map((pensioner) => (
                                                                <MenuItem key={pensioner.id} value={pensioner.user_id}>
                                                                    {pensioner.ppo_no} - {pensioner.name}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item size={{ xs: 6, md: 3 }}>
                                                    <FormControl fullWidth size="small">
                                                        <InputLabel>Verification Status</InputLabel>
                                                        <Select
                                                            name="is_verified"
                                                            value={filters.is_verified}
                                                            label="Verification Status"
                                                            onChange={(e) => setFilters({ ...filters, is_verified: e.target.value })}
                                                        >
                                                            <MenuItem value="All"><em>All</em></MenuItem>
                                                            <MenuItem value="1">Verified</MenuItem>
                                                            <MenuItem value="0">Not Verified</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item >
                                                    <Button style={{ background: "#004080", color: '#fff' }} onClick={handleSearch}>
                                                        Search
                                                    </Button>
                                                </Grid>
                                                <Grid item >
                                                    <Button color="secondary" onClick={handleClearFilters} className="ml-2">
                                                        Clear
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        </div>
                                        {
                                            <div className="d-flex flex-column" style={{ gap: '10px' }}>
                                                {currentRoles.some(role => ["Section Officer (Accounts)", "Accounts Officer", "Pensioners Operator", "Drawing and Disbursing Officer (NIOH)"].includes(role)) && (
                                                    <Button
                                                        variant="contained"
                                                        style={{ background: "#004080", color: '#fff' }}
                                                        disabled={selectedIds.length === 0}
                                                        onClick={handleBulkStatusUpdate}
                                                        fullWidth
                                                    >
                                                        Verify
                                                    </Button>
                                                )}

                                                {canUserManageFinalization && (
                                                    <>
                                                        <Button
                                                            variant="contained"
                                                            color="primary"
                                                            disabled={selectedIds.length === 0}
                                                            onClick={handleBulkFinalize}
                                                        >
                                                            Finalize
                                                        </Button>
                                                        <Button
                                                            variant="contained"
                                                            color="info"
                                                            disabled={selectedIds.length === 0 || isReleasing}
                                                            onClick={handleBulkRelease}
                                                        >
                                                            {isReleasing ? 'Releasing...' : 'Release'}
                                                        </Button>
                                                    </>
                                                )}

                                            </div>
                                        }
                                    </Box>
                                </CardHeader>
                                <CardBody>
                                    <div>
                                        {loading ? (
                                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                <CircularProgress />
                                            </Box>
                                        ) : (
                                            <TableContainer component={Paper} style={{ boxShadow: "none" }}>
                                                <Table>
                                                    <TableHead>
                                                        <TableRow style={{ whiteSpace: "nowrap" }}>
                                                            {
                                                                currentRoles.some(role => ["Section Officer (Accounts)", "Accounts Officer", "Pensioners Operator", "Drawing and Disbursing Officer (NIOH)", "IT Admin"].includes(role)) && (
                                                                    <TableCell padding="checkbox">
                                                                        <Checkbox
                                                                            indeterminate={selectedIds.length > 0 && selectedIds.length < netPension.length}
                                                                            checked={netPension.length > 0 && selectedIds.length === netPension.length}
                                                                            onChange={handleSelectAll}
                                                                        />
                                                                    </TableCell>
                                                                )}
                                                            <TableCell style={{ fontWeight: "900" }}>Sr. No.</TableCell>
                                                            <TableCell style={{ fontWeight: "900" }}>PPO NO.</TableCell>
                                                            <TableCell style={{ fontWeight: "900" }}>Pensioner</TableCell>
                                                            <TableCell style={{ fontWeight: "900" }}>Month</TableCell>
                                                            <TableCell style={{ fontWeight: "900" }}>Year</TableCell>
                                                            <TableCell style={{ fontWeight: "900" }}>Net Pension</TableCell>
                                                            <TableCell style={{ fontWeight: "900" }}>Payment Date</TableCell>
                                                            <TableCell style={{ fontWeight: "900" }}>Verified</TableCell>
                                                            <TableCell style={{ fontWeight: "900" }}>Finalized</TableCell>
                                                            <TableCell style={{ fontWeight: "900" }}>Released</TableCell>
                                                            <TableCell style={{ fontWeight: "900" }}>Action</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {netPension.length === 0 ? (
                                                            <TableRow>
                                                                <TableCell align="center" colSpan={currentRoles.some(role => ['IT Admin', "Section Officer (Accounts)", "Pensioners Operator"].includes(role)) ? 10 : 9}>No data available</TableCell>
                                                            </TableRow>
                                                        ) : (
                                                            <>
                                                                {netPension.map((row, idx) => (
                                                                    <TableRow key={row.id} style={{ whiteSpace: "nowrap" }}>
                                                                        {
                                                                            currentRoles.some(role => ["Section Officer (Accounts)", "Accounts Officer", "Pensioners Operator", "Drawing and Disbursing Officer (NIOH)", "IT Admin"].includes(role)) && (
                                                                                <TableCell padding="checkbox">
                                                                                    <Checkbox
                                                                                        checked={selectedIds.includes(row.id)}
                                                                                        onChange={() => handleSelect(row.id)}
                                                                                    />
                                                                                </TableCell>
                                                                            )}
                                                                        <TableCell>{(page * rowsPerPage) + idx + 1}</TableCell>
                                                                        <TableCell>{row.pensioner?.ppo_no || "- -"}</TableCell>
                                                                        <TableCell>{row.pensioner?.name || "NA"}</TableCell>
                                                                        <TableCell>
                                                                            {months.find((m) => m.value === row.month)?.label || 'NA'}
                                                                        </TableCell>
                                                                        <TableCell>{row.year}</TableCell>
                                                                        <TableCell>{row.net_pension}</TableCell>
                                                                        <TableCell>{dateFormat(row.payment_date)}</TableCell>
                                                                        {/* {
                                                                currentRoles.includes('IT Admin') && ( */}
                                                                        <TableCell>
                                                                            <Box display="flex" gap={1}>
                                                                                <CheckCircleIcon
                                                                                    fontSize="small"
                                                                                    sx={{ color: row.pensioner_operator_status === 1 ? 'green' : 'red' }}
                                                                                    titleAccess="Pensioner Operator"
                                                                                />
                                                                                <CheckCircleIcon
                                                                                    fontSize="small"
                                                                                    sx={{ color: row.ddo_status === 1 ? 'green' : 'red' }}
                                                                                    titleAccess="Drawing and Disbursing Officer"
                                                                                />
                                                                                <CheckCircleIcon
                                                                                    fontSize="small"
                                                                                    sx={{ color: row.section_officer_status === 1 ? 'green' : 'red' }}
                                                                                    titleAccess="Section Officer"
                                                                                />
                                                                                <CheckCircleIcon
                                                                                    fontSize="small"
                                                                                    sx={{ color: row.account_officer_status === 1 ? 'green' : 'red' }}
                                                                                    titleAccess="Accounts Officer"
                                                                                />
                                                                            </Box>
                                                                        </TableCell>
                                                                        {/* )
                                                            } */}

                                                                        {/* {!currentRoles.includes('IT Admin') && (
                                                                <TableCell
                                                                    onClick={canVerify(row) && getCurrentVerificationStep(row).statusField ? () => handleStepVerification(row, getCurrentVerificationStep(row).statusField) : undefined}
                                                                    style={{ cursor: canVerify(row) && getCurrentVerificationStep(row).statusField ? 'pointer' : 'default' }}
                                                                >
                                                                    {(() => {
                                                                        const { step, statusField } = getCurrentVerificationStep(row);
                                                                        if (step === "Completed") return <Chip variant='filled' label="Verified" color='success' />;
                                                                        if (canVerify(row)) return <Chip variant='filled' label="Verify" color='primary' />;
                                                                        return <Chip variant='filled' label="Pending" color='error' />;
                                                                    })()}
                                                                </TableCell>
                                                            )} */}

                                                                        <TableCell>
                                                                            <Box display="flex" gap={1}>
                                                                                <CheckCircleIcon
                                                                                    fontSize="small"
                                                                                    sx={{ color: row.is_finalize === 1 ? 'green' : 'red' }}
                                                                                    titleAccess="Salary Processing Coordinator"
                                                                                />
                                                                            </Box>
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            <Box display="flex" gap={1}>
                                                                                <CheckCircleIcon
                                                                                    fontSize="small"
                                                                                    sx={{ color: row.is_verified === 1 ? 'green' : 'red' }}
                                                                                    titleAccess="Salary Processing Coordinator"
                                                                                />
                                                                            </Box>
                                                                        </TableCell>

                                                                        <TableCell align="left">
                                                                            <IconButton onClick={(e) => handleMenuClick(e, row)}>
                                                                                <MoreVertIcon />
                                                                            </IconButton>
                                                                            <Menu
                                                                                anchorEl={anchorEl}
                                                                                open={selectedRow === row}
                                                                                onClose={handleClose}
                                                                                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                                                                            >
                                                                                {
                                                                                    currentRoles.some(role => ['IT Admin', 'Director', "Senior AO", "Administrative Officer", "Section Officer (Accounts)", "Accounts Officer", "Pensioners Operator", "Drawing and Disbursing Officer (NIOH)"].includes(role)) && (
                                                                                        <MenuItem
                                                                                            onClick={() => handleView(row.id)}
                                                                                        >
                                                                                            <ViewIcon fontSize="small" /> View
                                                                                        </MenuItem>
                                                                                    )}
                                                                                <MenuItem onClick={() => handleHistoryStatus(row.id)}>
                                                                                    <HistoryIcon fontSize="small" /> History
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
                            <NetPensionModal
                                setFormOpen={setFormOpen}
                                formOpen={formOpen}
                                toggleModal={toggleModal}
                                formMode={formMode}
                                formData={formData}
                                handleChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
                                handleSubmit={handleSubmit}
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
                )
            }


        </>
    );
}
