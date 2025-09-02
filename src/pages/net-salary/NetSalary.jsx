import React, { useEffect, useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    IconButton, TextField, TablePagination, Box, Menu, MenuItem, Grid,
    Select, FormControl, InputLabel, Button as MuiButton,
    Chip,
    Checkbox
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
    fetchNetSalary,
    createNetSalary,
    updateNetSalary,
    viewNetSalary,
    verifyNetSalary,
    finalizeNetSalary,
    releaseNetSalary,
} from '../../redux/slices/netSalarySlice';
import NetSalaryModal from '../../Modal/NetSalaryModal';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ViewIcon from '@mui/icons-material/Visibility';
import { useLocation, useNavigate } from 'react-router-dom';
import HistoryIcon from '@mui/icons-material/History';
import HistoryModal from 'Modal/HistoryModal';
import { months } from 'utils/helpers';
import { dateFormat } from 'utils/helpers';
import { fetchEmployees } from '../../redux/slices/employeeSlice';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';


export default function NetSalary() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const currentRoles = useSelector((state) =>
        state.auth.user?.roles?.map(role => role.name) || []
    );
    const employees = useSelector((state) => state.employee.employees) || [];
    const { netSalary, loading } = useSelector((state) => state.netSalary);
    const totalCount = useSelector((state) => state.netSalary.totalCount) || 0;
    const { error } = useSelector((state) => state.netSalary)
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedRow, setSelectedRow] = useState(null);
    const [formOpen, setFormOpen] = useState(false);
    const [formMode, setFormMode] = useState('create');
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState({
        employee_id: "",
        month: "",
        year: "",
        processing_date: "",
        net_amount: "",
        payment_date: "",
        employee_bank_id: "",
    });
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [renderFunction, setRenderFunction] = useState(() => null);
    const [historyRecord, setHistoryRecord] = useState([]);
    const [tableHead, setTableHead] = useState([
        "Sr. No.",
        "Head 1",
        "Head 2",
        "Head 3",
        "Head 4",
        "Head 5",
        "Head 6",
        "Head 7",
        "Head 8",
        "Head 9",
    ]);
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
    const [firstRow, setFirstRow] = useState(null);
    const [selectedIds, setSelectedIds] = useState([]);
    const canUserManageFinalization = currentRoles.some(role => ["Accounts Officer", "IT Admin"].includes(role));


    const statusChipColor = (status) => {
        switch (status) {
            case "YES": return "success";
            case "NO": return "error";
            default: return "default";
        }
    };

    // --- Filter State ---
    const [filters, setFilters] = useState({
        id: '',
        month: '',
        year: '',
        verification_status: '',
        finalize_status: '',
    });

    const toggleHistoryModal = () => {
        setIsHistoryModalOpen(!isHistoryModalOpen)
        if (isHistoryModalOpen) {
            setHistoryRecord([])
            setFirstRow(null);
        };
        handleClose();
    };

    const getTableConfig = (data, type) => {
        const mainPaySlip = data?.pay_slip;
        const mainDeduction = data?.deduction;

        const arrearTypes = [
            'DA Arrear',
            'HRA Arrear',
            'Pay Fixation Arrear',
            'CEA (Children Education Allowance)',
            'Honorarium',
            'NPA Arrear',
            'Uniform Arrear'
        ];

        const deductionRecoveryTypes = [
            'Income Tax Recovery',
            'Professional Tax Recovery',
            'License Fee Recovery',
            'NFCH Donation Recovery',
            'TA Recovery',
            'HRA Recovery',
            'Dies Non Recovery',
            'Pay Recovery',
            'NPS Recovery',
            'GIS Recovery',
            'LIC Recovery'
        ];

        const renderArrearCells = (paySlip) => {
            // It loops through our defined list of types, not the API data.
            return arrearTypes.map(arrearType => {
                // It finds the matching arrear from the pay slip data.
                const arrear = paySlip?.salary_arrears?.find(a => a.type === arrearType);

                // This is the key: It safely gets the amount OR defaults to '0'.
                const amount = arrear?.amount ?? '0';

                // Return the table cell.
                return <td className="amount-col" key={arrearType}>{amount}</td>;
            });
        };

        const renderDeductionRecoveryCells = (deduction) => {
            return deductionRecoveryTypes.map(recoveryType => {
                const recovery = deduction?.deduction_recoveries?.find(r => r.type === recoveryType);
                const amount = recovery?.amount ?? '0';
                return <td className="amount-col" key={recoveryType}>{amount}</td>;
            });
        };

        switch (type) {
            case "NetSalary":
                return {
                    head: [
                        "Sr. No.",
                        "Employee Code",
                        "Month",
                        "Year",
                        // --- Pay Slip Columns ---
                        "Basic Pay",
                        "DA Amount",
                        "HRA Amount",
                        "NPA Amount",
                        "Transport Amt",
                        "Uniform Amt",
                        "Govt Contribution",
                        "DA On TA",
                        "Spacial Pay Amount",
                        "DA 1",
                        "DA 2",
                        "LTC Leave Salary Amt",
                        ...arrearTypes,
                        "Total Pay",
                        // --- Deduction Columns ---
                        "Income Tax",
                        "Professional Tax",
                        "License Fee",
                        "NFCH Donation",
                        "GPF",
                        "Computer Loan paid",
                        "Computer Loan Remaining",
                        "GIS",
                        "LIC",
                        "Credit Society",
                        ...deductionRecoveryTypes,
                        "Total Deductions",
                        // --- Final Columns ---
                        "Net Amount",
                        "Processing Date",
                        "Payment Date",
                        "Added By",
                        "Edited By",
                        "Created At",
                        "Updated At"
                    ],
                    firstRow: (
                        <tr className="bg-green text-white">
                            <td>{1}</td>
                            <td>{data.employee?.employee_code || "N/A"}</td>
                            <td>{months.find((m) => m.value === data.month)?.label || 'N/A'}</td>
                            <td>{data.year || 'N/A'}</td>
                            {/* --- Pay Slip Data Cells --- */}
                            <td>{mainPaySlip?.basic_pay ?? '0'}</td>
                            <td>{mainPaySlip?.da_amount ?? '0'}</td>
                            <td>{mainPaySlip?.hra_amount ?? '0'}</td>
                            <td>{mainPaySlip?.npa_amount ?? '0'}</td>
                            <td>{mainPaySlip?.transport_amount ?? '0'}</td>
                            <td>{mainPaySlip?.uniform_rate_amount ?? '0'}</td>
                            <td>{mainPaySlip?.govt_contribution ?? '0'}</td>
                            <td>{mainPaySlip?.da_on_ta ?? '0'}</td>
                            <td>{mainPaySlip?.spacial_pay ?? '0'}</td>
                            <td>{mainPaySlip?.da_1 ?? '0'}</td>
                            <td>{mainPaySlip?.da_2 ?? '0'}</td>
                            <td>{mainPaySlip?.itc_leave_salary ?? '0'}</td>

                            {renderArrearCells(mainPaySlip)}

                            <td>{mainPaySlip?.total_pay ?? '0'}</td>
                            {/* --- Deduction Data Cells --- */}
                            <td>{mainDeduction?.income_tax ?? '0'}</td>
                            <td>{mainDeduction?.professional_tax ?? '0'}</td>
                            <td>{mainDeduction?.license_fee ?? '0'}</td>
                            <td>{mainDeduction?.nfch_donation ?? '0'}</td>
                            <td>{mainDeduction?.gpf ?? '0'}</td>
                            <td>{mainDeduction?.computer_advance_installment ?? '0'}</td>
                            <td>{mainDeduction?.computer_advance_balance ?? '0'}</td>
                            <td>{mainDeduction?.gis ?? '0'}</td>
                            <td>{mainDeduction?.lic ?? '0'}</td>
                            <td>{mainDeduction?.credit_society ?? '0'}</td>

                            {renderDeductionRecoveryCells(mainDeduction)}

                            <td>{mainDeduction?.total_deductions ?? '0'}</td>
                            {/* --- Final Data Cells --- */}
                            <td>{data.net_amount || "0"}</td>
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
                        const paySlip = record;
                        const deduction = record;


                        return (
                            <tr key={record.id || index}>
                                <td>{index + 2}</td>
                                <td>{record.employee?.employee_code || "N/A"}</td>
                                <td>{months.find((m) => m.value === record.month)?.label || 'N/A'}</td>
                                <td>{record.year || 'N/A'}</td>
                                {/* --- Pay Slip Data Cells --- */}
                                <td>{paySlip?.basic_pay ?? '0'}</td>
                                <td>{paySlip?.da_amount ?? '0'}</td>
                                <td>{paySlip?.hra_amount ?? '0'}</td>
                                <td>{paySlip?.npa_amount ?? '0'}</td>
                                <td>{paySlip?.transport_amount ?? '0'}</td>
                                <td>{paySlip?.uniform_rate_amount ?? '0'}</td>
                                <td>{paySlip?.govt_contribution ?? '0'}</td>
                                <td>{paySlip?.da_on_ta ?? '0'}</td>
                                <td>{paySlip?.spacial_pay ?? '0'}</td>
                                <td>{paySlip?.da_1 ?? '0'}</td>
                                <td>{paySlip?.da_2 ?? '0'}</td>
                                <td>{paySlip?.itc_leave_salary ?? '0'}</td>

                                {renderArrearCells(paySlip)}

                                <td>{paySlip?.total_pay ?? '0'}</td>
                                {/* --- Deduction Data Cells --- */}
                                <td>{deduction?.income_tax ?? '0'}</td>
                                <td>{deduction?.professional_tax ?? '0'}</td>
                                <td>{deduction?.license_fee ?? '0'}</td>
                                <td>{deduction?.nfch_donation ?? '0'}</td>
                                <td>{deduction?.gpf ?? '0'}</td>
                                <td>{deduction?.computer_advance_installment ?? '0'}</td>
                                <td>{deduction?.computer_advance_balance ?? '0'}</td>
                                <td>{deduction?.gis ?? '0'}</td>
                                <td>{deduction?.lic ?? '0'}</td>
                                <td>{deduction?.credit_society ?? '0'}</td>

                                {renderDeductionRecoveryCells(deduction)}

                                <td>{deduction?.total_deductions ?? '0'}</td>
                                {/* --- Final Data Cells --- */}
                                <td>{record.net_amount || "0"}</td>
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
                return { head: [], renderRow: () => null };
        }
    };


    const handleHistoryStatus = (id) => {
        handleClose(); // Close the actions menu

        // 1. Dispatch the action to fetch the data
        dispatch(viewNetSalary({ id })).then((res) => {
            const currentRecord = res.payload?.data;
            const history = currentRecord?.history;

            // 2. Check if the data is valid
            if (currentRecord && Array.isArray(history)) {

                // 3. Get the configuration (FIX 1: added "NetSalary")
                const config = getTableConfig(currentRecord, "NetSalary");

                // 4. Set all the state for the modal
                setFirstRow(config.firstRow);
                setHistoryRecord(history);
                setTableHead(config.head);
                setRenderFunction(() => config.renderRow);

                // 5. NOW, open the modal (FIX 2)
                setIsHistoryModalOpen(true);

            } else {
                // If fetching fails or data is empty, show a toast and don't open the modal
                toast.warn("No history found for this record.");
                setHistoryRecord([]);
                setFirstRow(null);
            }
        }).catch(err => {
            // It's good practice to catch potential errors from the dispatch
            toast.error("Failed to fetch history.");
        });
    };

    const fetchData = (currentFilters) => {
        const params = {
            page: page + 1,
            limit: rowsPerPage,
            id: filters.id ?? " ",
            ...(currentFilters || filters),
        };
        // Remove empty/all values before dispatching
        Object.keys(params).forEach(key => {
            if (params[key] === '' || params[key] === 'All') {
                delete params[key];
            }
        });
        dispatch(fetchNetSalary(params));
    };

    useEffect(() => {
        let activeFilters = { ...filters };
        const queryParams = new URLSearchParams(location.search);
        const monthFromQuery = queryParams.get('month');
        const yearFromQuery = queryParams.get('year');


        if (monthFromQuery && yearFromQuery) {
            activeFilters.month = monthFromQuery;
            activeFilters.year = yearFromQuery;
            setFilters(activeFilters);
            navigate(location.pathname, { replace: true });
        }

        const params = {
            page: page + 1,
            limit: rowsPerPage,
            ...activeFilters,
        };

        Object.keys(params).forEach(key => {
            if (params[key] === '' || params[key] === 'All' || params[key] === null) {
                delete params[key];
            }
        });

        dispatch(fetchNetSalary(params));

    }, [dispatch, page, rowsPerPage, location.search]);




    useEffect(() => {
        if (!location.search) {
            fetchData();
        }
    }, [dispatch, page, rowsPerPage]);

    // Fetch all employees on mount
    useEffect(() => {
        dispatch(fetchEmployees({ page: 1, limit: 1000, search: '', institute: '' }));
    }, [dispatch]);

    // --- Handlers for Filtering ---
    const handleFilterChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value,
        });
    };

    const handleClearFilters = () => {
        const clearedFilters = { id: '', month: '', year: '', verification_status: '', finalize_status: '' };
        setFilters(clearedFilters);
        setPage(0); // Reset page

        // Fetch with cleared filters
        dispatch(fetchNetSalary({ page: 1, limit: rowsPerPage }));
    };


    const handlePageChange = (_, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (e) => {
        setRowsPerPage(parseInt(e.target.value, 10));
        setPage(0);
    };


    const handleClose = () => {
        setAnchorEl(null);
        setSelectedRow(null)
    };

    const toggleModal = (mode) => {
        if (mode === 'create') {
            setFormData({
                employee_id: "",
                month: "",
                year: "",
                processing_date: "",
                net_amount: "",
                payment_date: "",
                employee_bank_id: "",
            });
            setFormMode('create');
        }
        setFormOpen(!formOpen);
    };


    const handleSubmit = (values, { setSubmitting, resetForm }) => {
        dispatch(updateNetSalary({ id: editId, values: values }))
            .unwrap()
            .then(() => {
                toast.success("NetSalary updated successfully");
                dispatch(fetchNetSalary({ page, limit: rowsPerPage, id: '' }));
            })
            .catch((err) => {
                const apiMsg =
                    err?.response?.data?.message ||
                    err?.message ||
                    'Failed to save net salary.';
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
        navigate(`/employee/net-salary/${id}`);
    }


    const handleSearch = () => {
        setPage(0);
        const params = {
            page: 1,
            limit: rowsPerPage,
            ...filters
        };
        // Clean up...
        Object.keys(params).forEach(key => { if (params[key] === '' || params[key] === 'All' || params[key] === null) delete params[key]; });
        dispatch(fetchNetSalary(params));
    };

    // Helper to determine current verification step and status field
    function getCurrentVerificationStep(row) {
        if (!row.salary_processing_status) return { step: "Salary Processing Coordinator", statusField: "salary_processing_status" };
        if (!row.ddo_status) return { step: "Drawing and Disbursing Officer", statusField: "ddo_status" };
        if (!row.section_officer_status) return { step: "Section Officer (Accounts)", statusField: "section_officer_status" };
        if (!row.account_officer_status) return { step: "Accounts Officer", statusField: "account_officer_status" };
        return { step: "Completed", statusField: null };
    }

    // Replace handleToggleStatus with step-based verification
    const handleStepVerification = (row, statusField) => {
        dispatch(verifyNetSalary({ selected_id: [row.id], statusField }))
            .unwrap()
            .then(() => {
                toast.success("NetSalary verified successfully");
                dispatch(fetchNetSalary({
                    page: 1,
                    limit: rowsPerPage,
                    ...filters,
                }));
            })
            .catch((err) => {
                const apiMsg =
                    err?.response?.data?.message ||
                    err?.message ||
                    'Failed to verify net salary.';
                toast.error(apiMsg);
            });
    };

    // Helper to check if user can verify at this step
    function canVerify(row) {

        if (currentRoles.includes("IT Admin")) {
            return true;
        }

        const { step } = getCurrentVerificationStep(row);

        if (step === "Salary Processing Coordinator" && currentRoles.some(role =>
            ["Salary Processing Coordinator (NIOH)", "Salary Processing Coordinator (ROHC)"].includes(role)
        )) return true;

        if (step === "Drawing and Disbursing Officer" && currentRoles.some(role =>
            ["Drawing and Disbursing Officer (NIOH)", "Drawing and Disbursing Officer (ROHC)"].includes(role)
        )) return true;

        if (step === "Section Officer (Accounts)" && currentRoles.includes("Section Officer (Accounts)")) return true;

        if (step === "Accounts Officer" && currentRoles.includes("Accounts Officer")) return true;

        return false;
    }



    const handleSelectAll = (event) => {
        if (event.target.checked) {
            const allIds = netSalary.map((row) => row.id);
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
        const slipsToVerify = netSalary.filter(row => canVerify(row) && selectedIds.includes(row.id));
        if (slipsToVerify.length === 0) {
            toast.warn("No eligible slips to verify for your role.");
            return;
        }
        const { statusField } = getCurrentVerificationStep(slipsToVerify[0]); // All should be at same step
        const ids = slipsToVerify.map(row => row.id);
        dispatch(verifyNetSalary({ selected_id: ids, statusField }))
            .unwrap()
            .then(() => {
                toast.success("Selected net salaries verified");
                fetchData();
                setSelectedIds([]);
            })
            .catch((err) => {
                toast.error("Verification failed");
            });
    };

    const getEmployeeCodeById = (id) => {
        const record = netSalary.find(item => item.id === id);
        return record?.employee?.employee_code || `ID ${id}`;
    };

    // --- NEW: Handlers for Finalize and Release ---
    const handleBulkFinalize = () => {
        if (selectedIds.length === 0) {
            toast.warn("Please select at least one record to finalize.");
            return;
        }
        dispatch(finalizeNetSalary({ selected_id: selectedIds }))
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

                fetchData(); // Refresh the table
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
        dispatch(releaseNetSalary({ selected_id: selectedIds }))
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

                fetchData(); // Refresh the table
                setSelectedIds([]); // Clear selection
            })
            .catch((err) => {
                const apiMsg = err?.response?.data?.message || err?.message || 'Release failed.';
                toast.error(apiMsg);
            });
    };


    return (
        <>
            <div className='header bg-gradient-info pb-8 pt-8 pt-md-8 main-head'></div>
            <div className="mt--7 mb-7 container-fluid">
                <Card className="card-stats mb-4 mb-lg-0">
                    <CardHeader>
                        <Box sx={{ p: 2, mb: 3, border: '1px solid #e0e0e0', borderRadius: '8px' }} className="cardheader-flex-group">
                            <div className="cardheader-flex-left w-75">
                                <Grid container spacing={2} alignItems="center">
                                    <Grid item size={{ xs: 6, md: 3 }} >
                                        <FormControl fullWidth size="small">
                                            <InputLabel>Employee</InputLabel>
                                            <Select
                                                name="id"
                                                value={filters.id}
                                                label="Emp Code"
                                                onChange={handleFilterChange}
                                            >
                                                <MenuItem value="All"><em>All</em></MenuItem>
                                                {employees.map((emp) => (
                                                    <MenuItem key={emp.id} value={emp.id}>
                                                        {emp.employee_code} - {emp.name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item size={{ xs: 6, md: 3 }}>
                                        <FormControl fullWidth size="small">
                                            <InputLabel>Month</InputLabel>
                                            <Select
                                                name="month"
                                                value={filters.month}
                                                label="Month"
                                                onChange={handleFilterChange}
                                            >
                                                <MenuItem value="All"><em>All</em></MenuItem>
                                                {months.map((month) => (
                                                    <MenuItem key={month.value} value={month.value}>
                                                        {month.label}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item size={{ xs: 6, md: 3 }}>
                                        <TextField
                                            fullWidth
                                            label="Year"
                                            name="year"
                                            value={filters.year}
                                            onChange={handleFilterChange}
                                            variant="outlined"
                                            size="small"
                                            type="text"
                                        />
                                    </Grid>
                                    {/* {
                                        currentRoles.some(role => ["Accounts Officer", "IT Admin"].includes(role)) && (
                                            <> */}
                                                <Grid item size={{ xs: 6, md: 3 }}>
                                                    <FormControl fullWidth size="small">
                                                        <InputLabel>Verification Status</InputLabel>
                                                        <Select
                                                            name="verification_status"
                                                            value={filters.verification_status}
                                                            label="Verification Status"
                                                            onChange={handleFilterChange}
                                                        >
                                                            <MenuItem value="All"><em>All</em></MenuItem>
                                                            <MenuItem value="1">Verified</MenuItem>
                                                            <MenuItem value="0">Not Verified</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item size={{ xs: 6, md: 3 }}>
                                                <FormControl fullWidth size="small">
                                                    <InputLabel>Finalization Status</InputLabel>
                                                    <Select
                                                        name="finalize_status"
                                                        value={filters.finalize_status}
                                                        label="Finalization Status"
                                                        onChange={handleFilterChange}
                                                    >
                                                        <MenuItem value="All"><em>All</em></MenuItem>
                                                        <MenuItem value="1">Finalized</MenuItem>
                                                        <MenuItem value="0">Not Finalized</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                            {/* </>
                                        )
                                    } */}

                                    <Grid item xs={12} md={3} container spacing={1} justifyContent="flex-start">
                                        <Grid item>
                                            <MuiButton variant="contained" onClick={handleSearch}>Search</MuiButton>
                                        </Grid>
                                        <Grid item>
                                            <MuiButton variant="outlined" onClick={handleClearFilters}>Clear</MuiButton>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </div>
                            {
                                <div className="d-flex flex-column" style={{ gap: '10px' }}>
                                    {currentRoles.some(role => ["Drawing and Disbursing Officer (ROHC)", "Drawing and Disbursing Officer (NIOH)", "Section Officer (Accounts)", "Accounts Officer", "Salary Processing Coordinator (NIOH)", "Salary Processing Coordinator (ROHC)"].includes(role)) && (
                                        <Grid>
                                            <MuiButton
                                                variant="contained"
                                                color="primary"
                                                disabled={selectedIds.length === 0}
                                                onClick={handleBulkStatusUpdate}
                                            >
                                                Verify
                                            </MuiButton>
                                        </Grid>
                                    )}

                                    {canUserManageFinalization && (
                                        <>
                                            <Grid item>
                                                <MuiButton
                                                    variant="contained"
                                                    color="secondary"
                                                    disabled={selectedIds.length === 0}
                                                    onClick={handleBulkFinalize}
                                                >
                                                    Finalize
                                                </MuiButton>
                                            </Grid>
                                            <Grid item>
                                                <MuiButton
                                                    variant="contained"
                                                    color="info"
                                                    disabled={selectedIds.length === 0}
                                                    onClick={handleBulkRelease}
                                                >
                                                    Release
                                                </MuiButton>
                                            </Grid>
                                        </>
                                    )}
                                </div>
                            }

                        </Box>
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
                                            <TableRow>
                                                {
                                                    currentRoles.some(role => ["Drawing and Disbursing Officer (ROHC)", "Drawing and Disbursing Officer (NIOH)", "Section Officer (Accounts)", "Accounts Officer", "Salary Processing Coordinator (NIOH)", "Salary Processing Coordinator (ROHC)", "IT Admin"].includes(role)) && (
                                                        <TableCell padding="checkbox">
                                                            <Checkbox
                                                                indeterminate={selectedIds?.length > 0 && selectedIds?.length < netSalary?.length}
                                                                checked={netSalary?.length > 0 && selectedIds?.length === netSalary?.length}
                                                                onChange={handleSelectAll}
                                                                inputProps={{ 'aria-label': 'select all rows' }}
                                                            />
                                                        </TableCell>
                                                    )}
                                                <TableCell style={{ fontWeight: "900" }}>Sr. No.</TableCell>
                                                <TableCell style={{ fontWeight: "900" }}>Emp Code</TableCell>
                                                <TableCell style={{ fontWeight: "900" }}>Name</TableCell>
                                                <TableCell style={{ fontWeight: "900" }}>Month</TableCell>
                                                <TableCell style={{ fontWeight: "900" }}>Year</TableCell>
                                                <TableCell style={{ fontWeight: "900" }}>Institute</TableCell>
                                                <TableCell style={{ fontWeight: "900" }}>Processing Date</TableCell>
                                                <TableCell style={{ fontWeight: "900" }}>Payment Date</TableCell>
                                                <TableCell style={{ fontWeight: "900" }}>Net Amount</TableCell>
                                                <TableCell style={{ fontWeight: "900" }}>Verified</TableCell>
                                                <TableCell style={{ fontWeight: "900" }}>Finalized</TableCell>
                                                <TableCell style={{ fontWeight: "900" }}>Released</TableCell>
                                                <TableCell style={{ fontWeight: "900" }}>Action</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {netSalary?.length === 0 ? (
                                                <TableRow>
                                                    <TableCell align="center" colSpan={currentRoles.some(role => ['IT Admin', "Section Officer (Accounts)", "Accounts Officer", "Salary Processing Coordinator (NIOH)", "Salary Processing Coordinator (ROHC)"].includes(role)) ? 10 : 9}>No data available</TableCell>
                                                </TableRow>
                                            ) : (
                                                <>
                                                    {netSalary?.map((row, idx) => (
                                                        <TableRow key={row.id}>
                                                            {
                                                                currentRoles.some(role => ["Drawing and Disbursing Officer (ROHC)", "Drawing and Disbursing Officer (NIOH)", "Section Officer (Accounts)", "Accounts Officer", "Salary Processing Coordinator (NIOH)", "Salary Processing Coordinator (ROHC)", "IT Admin"].includes(role)) && (
                                                                    <TableCell padding="checkbox">
                                                                        <Checkbox
                                                                            checked={selectedIds.includes(row.id)}
                                                                            onChange={() => handleSelect(row.id)}
                                                                            inputProps={{ 'aria-label': `select row ${row.id}` }}
                                                                        />
                                                                    </TableCell>
                                                                )}
                                                            <TableCell>{(page * rowsPerPage) + idx + 1}</TableCell>
                                                            <TableCell>{row?.employee?.employee_code}</TableCell>
                                                            <TableCell>{row.employee?.name}</TableCell>
                                                            <TableCell>
                                                                {months.find((m) => m.value === row.month)?.label || 'NA'}
                                                            </TableCell>
                                                            <TableCell>{row.year}</TableCell>
                                                            <TableCell>{row?.employee?.institute}</TableCell>
                                                            <TableCell>{dateFormat(row.processing_date)}</TableCell>
                                                            <TableCell>{dateFormat(row.payment_date)}</TableCell>
                                                            <TableCell>{row.net_amount}</TableCell>
                                                            {/* {
                                                                currentRoles.includes('IT Admin') && ( */}
                                                                    <TableCell>
                                                                        <Box display="flex" gap={1}>
                                                                            <CheckCircleIcon
                                                                                fontSize="small"
                                                                                sx={{ color: row.salary_processing_status === 1 ? 'green' : 'red' }}
                                                                                titleAccess="Salary Processing Coordinator"
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



                                                            {/* {
                                                                !currentRoles.includes('IT Admin') && (
                                                                    <TableCell>
                                                                        <Chip
                                                                            label={(() => {
                                                                                const { step, statusField } = getCurrentVerificationStep(row);
                                                                                if (step === "Completed") return "Verified";
                                                                                if (canVerify(row)) return "Verify";
                                                                                return "Pending";
                                                                            })()}
                                                                            variant="filled"
                                                                            color={(() => {
                                                                                const { step, statusField } = getCurrentVerificationStep(row);
                                                                                if (step === "Completed") return "success";
                                                                                if (canVerify(row)) return "primary";
                                                                                return "error";
                                                                            })()}
                                                                            onClick={() => {
                                                                                const { step, statusField } = getCurrentVerificationStep(row);
                                                                                if (canVerify(row) && statusField) handleStepVerification(row, statusField);
                                                                            }}
                                                                            style={{
                                                                                cursor: (() => {
                                                                                    const { step, statusField } = getCurrentVerificationStep(row);
                                                                                    return (canVerify(row) && statusField) ? 'pointer' : 'default';
                                                                                })()
                                                                            }}
                                                                        />
                                                                    </TableCell>
                                                                )
                                                            } */}

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
                                                                        currentRoles.some(role => ['IT Admin', 'Director', "Senior AO", "Administrative Officer", "Drawing and Disbursing Officer (ROHC)", "Drawing and Disbursing Officer (NIOH)", "Section Officer (Accounts)", "Accounts Officer", "Salary Processing Coordinator (NIOH)", "Salary Processing Coordinator (ROHC)"].includes(role)) && (
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
                <NetSalaryModal
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
    );
}
