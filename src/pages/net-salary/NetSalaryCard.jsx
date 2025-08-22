// This file is for salary slip verification, not pension. No changes needed for pension verification flow.
import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import html2pdf from 'html2pdf.js';
import { months } from 'utils/helpers';
import {
    Box,
    CircularProgress,
    Typography,
    Paper,
    Button,
    Stack,
    IconButton,
    Chip
} from '@mui/material';
import {
    Download as DownloadIcon,
    ArrowBack as ArrowBackIcon,
    Edit as EditIcon,
    CheckCircle as CheckCircleIcon,
    Cancel as CancelIcon,
} from '@mui/icons-material';
import { finalizeNetSalary, releaseNetSalary, verifyNetSalary, verifyNetSalaryAdmin, viewNetSalary } from '../../redux/slices/netSalarySlice';
import { updatePaySlip } from '../../redux/slices/paySlipSlice';
import { updateDeduction } from '../../redux/slices/deductionSlice';
import PaySlipEditModal from '../../Modal/PaySlipEditModal';
import DeductionEditModal from '../../Modal/DeductionEditModal';
import logo from '../../assets/img/images/slip-header.png';
import { fetchPayStructure } from '../../redux/slices/payStructureSlice';
import { fetchNpsContribution, selectLatestEmployeeRate, selectLatestGovtRate } from '../../redux/slices/npsContributionSlice';
import '../../assets/css/custom.css';
import { getMonthName } from '../../utils/helpers';
import rohcheader from '../../assets/img/images/rohcheader.png'


export default function PaySlipPage() {
    const { payStructure } = useSelector((state) => state.payStructure);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const pdfContainerRef = useRef();
    const govtContributionRate = useSelector(selectLatestGovtRate);
    const employeeContributionRate = useSelector(selectLatestEmployeeRate);
    const currentRoles = useSelector((state) =>
        state.auth.user?.roles?.map(role => role.name) || []
    );

    useEffect(() => {
        dispatch(fetchNpsContribution({ type: 'GOVT' }));
        dispatch(fetchNpsContribution({ type: 'Employee' }));
    }, [dispatch]);


    useEffect(() => {
        dispatch(fetchPayStructure({ page: 1, limit: 1000, search: "" }));
    }, [dispatch]);

    const { netSalaryData, loading } = useSelector((state) => state.netSalary);


    const [isPayModalOpen, setPayModalOpen] = useState(false);
    const [isDeductionModalOpen, setDeductionModalOpen] = useState(false);

    useEffect(() => {
        if (id) {
            dispatch(viewNetSalary({ id }));
        }
    }, [dispatch, id]);

    // --- Event Handlers (Preserved) ---
    const handleSave = (updateAction, successMessage, data, modalSetter) => {
        dispatch(updateAction(data)).unwrap()
            .then(() => {
                toast.success(successMessage);
                dispatch(viewNetSalary({ id }));
                modalSetter(false);
            })
            .catch((err) => {
                toast.error(err.message || "An error occurred.");
            });
    };

    const handlePaySave = (data) => {
        handleSave(updatePaySlip, "Pay Slip updated successfully", { id: netSalaryData.pay_slip.id, pay_slip: data }, setPayModalOpen);
    };

    const handleDeductionSave = (data) => {
        handleSave(updateDeduction, "Deductions updated successfully", { id: netSalaryData.deduction.id, deduction: data }, setDeductionModalOpen);
    };

    // Helper to determine current verification step and status field
    function getCurrentVerificationStep(row) {
        if (!row.salary_processing_status) return { step: "Salary Processing Coordinator", statusField: "salary_processing_status" };
        if (!row.ddo_status) return { step: "Drawing and Disbursing Officer", statusField: "ddo_status" };
        if (!row.section_officer_status) return { step: "Section Officer (Accounts)", statusField: "section_officer_status" };
        if (!row.account_officer_status) return { step: "Accounts Officer", statusField: "account_officer_status" };
        return { step: "Completed", statusField: null };
    }

    // Helper to check if user can verify at this step
    function canVerify(row) {
        const { step } = getCurrentVerificationStep(row);
        // Use .some() to check if any of the user's roles match the required roles for the step
        if (step === "Salary Processing Coordinator" && currentRoles.some(r => ["Salary Processing Coordinator (NIOH)", "Salary Processing Coordinator (ROHC)"].includes(r))) return true;
        if (step === "Drawing and Disbursing Officer" && currentRoles.some(r => r.includes("Drawing and Disbursing Officer"))) return true;
        if (step === "Section Officer (Accounts)" && currentRoles.includes("Section Officer (Accounts)")) return true;
        if (step === "Accounts Officer" && currentRoles.includes("Accounts Officer")) return true;
        return false;
    }

    function canFinalize(row) {
        const { step } = getCurrentVerificationStep(row);
        // Check if user can finalize at this step
        if (step === "Accounts Officer" && currentRoles.includes("Accounts Officer")) return true;
        if (currentRoles.includes("IT Admin")) return true;
        return false;
    }

    function canRelease(row) {
        const { step } = getCurrentVerificationStep(row);
        // Check if user can release at this step
        if (step === "Accounts Officer" && currentRoles.includes("Accounts Officer")) return true;
        if (currentRoles.includes("IT Admin")) return true;
        return false;
    }

    // Replace handleToggleStatus with step-based verification
    const handleStepVerification = (row, statusField) => {
        dispatch(verifyNetSalary({ selected_id: [row.id], statusField }))
            .unwrap()
            .then(() => {
                toast.success("NetSalary verified successfully");
                dispatch(viewNetSalary({ id: row.id }));
            })
            .catch((err) => {
                toast.error(err || 'Failed to verify net salary.');
            });
    };

    const handleStepFinalization = (row) => {
        dispatch(finalizeNetSalary({ selected_id: [row.id] }))
            .unwrap()
            .then(() => {
                toast.success("NetSalary finalized successfully");
                dispatch(viewNetSalary({ id: row.id }));
            })
            .catch((err) => {
                toast.error(err || 'Failed to finalize net salary.');
            });
    };

    const handleStepRelease = (row) => {
        dispatch(releaseNetSalary({ selected_id: [row.id] }))
            .unwrap()
            .then(() => {
                toast.success("NetSalary released successfully");
                dispatch(viewNetSalary({ id: row.id }));
            })
            .catch((err) => {
                toast.error(err || 'Failed to release net salary.');
            });
    };

    const handleDownloadPdf = () => {
        const element = pdfContainerRef.current;
        if (!element) return;
        const opt = {
            margin: 0,
            filename: `PaySlip_${netSalaryData?.employee?.employee_code}_${netSalaryData?.month}_${netSalaryData?.year}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true, windowWidth: element.scrollWidth, windowHeight: element.scrollHeight },
            jsPDF: { unit: 'px', format: [element.offsetWidth, element.offsetHeight], orientation: 'portrait', hotfixes: ['px_scaling'] }
        };
        html2pdf().from(element).set(opt).save();
    };

    // Map userRole to their status field
    function getUserStatusField(roles) { // Function now accepts an array of roles
        for (const role of roles) { // Loop through each role the user has
            if (["Salary Processing Coordinator (NIOH)", "Salary Processing Coordinator (ROHC)"].includes(role)) return "salary_processing_status";
            if (role.includes("Drawing and Disbursing Officer")) return "ddo_status";
            if (role === "Section Officer (Accounts)") return "section_officer_status";
            if (role === "Accounts Officer") return "account_officer_status";
        }
        return null; // Return null if no matching role is found
    }

    function handleAdminVerify() {
        const statusPayload = {
            salary_processing_status: 1,
            ddo_status: 1,
            section_officer_status: 1,
            account_officer_status: 1,
        };

        const payload = { selected_id: [netSalaryData.id], ...statusPayload };

        dispatch(verifyNetSalaryAdmin(payload))
            .unwrap()
            .then(() => {
                toast.success("All statuses verified successfully");
                dispatch(viewNetSalary({ id: netSalaryData.id }));
            })
            .catch((err) => {
                toast.error(err || 'Failed to verify net salary.');
            });
    }

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!netSalaryData) {
        return (
            <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h5">Payslip Not Found</Typography>
                <Button startIcon={<ArrowBackIcon />} sx={{ mt: 2 }} variant="contained" onClick={() => navigate('/net-salary')}>
                    Go Back
                </Button>
            </Box>
        );
    }

    // --- Data Mapping & Calculations for Display ---
    const { pay_slip: payslipForm, deduction: deductionForm, employee } = netSalaryData;
    const authRoles = [
        'IT Admin',
        "Drawing and Disbursing Officer (ROHC)",
        "Drawing and Disbursing Officer (NIOH)",
        "Section Officer (Accounts)",
        "Accounts Officer",
        "Salary Processing Coordinator (NIOH)",
        "Salary Processing Coordinator (ROHC)",
    ];
    const canEdit = currentRoles.some(role => authRoles.includes(role));
    const monthLabel = months.find(m => m.value == netSalaryData.month)?.label || netSalaryData.month;
    const matrix = payStructure.find(p => p?.id === payslipForm?.pay_structure_id)?.pay_matrix_cell;
    const formatCurrency = (val) => (Number(val) || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    // Get current verification step and statusField for this slip
    const { step, statusField } = getCurrentVerificationStep(netSalaryData);
    const userStatusField = getUserStatusField(currentRoles);
    const hasUserVerified = userStatusField && netSalaryData[userStatusField];
    // Check if all four verification steps are completed.
    const allStepsVerified =
        netSalaryData?.salary_processing_status &&
        netSalaryData?.ddo_status &&
        netSalaryData?.section_officer_status &&
        netSalaryData?.account_officer_status;


    // Check if the current user has the role to finalize or release.
    const canManageFinalization =
        currentRoles.includes("Accounts Officer") || currentRoles.includes("IT Admin");


    const totalEarnings = (netSalaryData?.pay_slip?.total_pay || 0)
    const totalAdditionalDeductions = (Number(deductionForm?.lic) || 0) + (Number(deductionForm?.credit_society) || 0);
    const totalDeductionsCalc = (netSalaryData?.deduction?.total_deductions || 0) - totalAdditionalDeductions;
    const netPayCalc = totalEarnings - totalDeductionsCalc;
    // const totalAdditionalDeductions = (Number(deductionForm?.lic) || 0) + (Number(deductionForm?.credit_society) || 0);
    const finalNetPay = netPayCalc - totalAdditionalDeductions;


    function userHasRoleForStep(field) {
        switch (field) {
            case "salary_processing_status":
                return currentRoles.some(r => ["Salary Processing Coordinator (NIOH)", "Salary Processing Coordinator (ROHC)", "IT Admin"].includes(r));
            case "ddo_status":
                return currentRoles.some(r => ["Drawing and Disbursing Officer (NIOH)", "Drawing and Disbursing Officer (ROHC)", "IT Admin"].includes(r));
            case "section_officer_status":
                return currentRoles.some(r => ["Section Officer (Accounts)", "IT Admin"].includes(r));
            case "account_officer_status":
                return currentRoles.some(r => ["Accounts Officer", "IT Admin"].includes(r));
            default:
                return false;
        }
    }

    // NEW: Helper function to format timestamps
    const formatTimestamp = (timestamp) => {
        if (!timestamp) return null;
        try {
            return new Date(timestamp).toLocaleString('en-IN', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
            });
        } catch (error) {
            return "Invalid Date";
        }
    };



    // --- START: REVISED LOGIC FOR EDIT BUTTONS ---

    // 1. Define the verification workflow structure (no change here)
    const verificationWorkflow = [
        { statusField: "salary_processing_status", roles: ["Salary Processing Coordinator (NIOH)", "Salary Processing Coordinator (ROHC)"] },
        { statusField: "ddo_status", roles: ["Drawing and Disbursing Officer (NIOH)", "Drawing and Disbursing Officer (ROHC)"] },
        { statusField: "section_officer_status", roles: ["Section Officer (Accounts)"] },
        { statusField: "account_officer_status", roles: ["Accounts Officer"] }
    ];
    let canSeeEditButtons = false;
    const isITAdmin = currentRoles.includes("IT Admin");
    const currentStepConfig = verificationWorkflow.find(s => s.statusField === statusField);

    if (currentStepConfig) {
        const userHasRoleForCurrentStep = currentRoles.some(userRole =>
            currentStepConfig.roles.includes(userRole)
        );
        canSeeEditButtons = userHasRoleForCurrentStep || isITAdmin;
    } else {
        canSeeEditButtons = isITAdmin;
    }

    const areButtonsDisabled = isITAdmin ? false : hasUserVerified;

    return (
        <>
            <div className='header bg-gradient-info pb-8 pt-8 pt-md-8 main-head'></div>
            <Box sx={{ p: 3 }} >
                {
                    <Paper elevation={3} sx={{ mb: 3, p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: 2, background: '#f8fafc' }}>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#1976d2' }}>Verification Steps</Typography>
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center" alignItems="center">
                            {[
                                { label: "Salary Processing Coordinator", field: "salary_processing_status", timestampField: "salary_processing_date" },
                                { label: "Drawing and Disbursing Officer", field: "ddo_status", timestampField: "ddo_date" },
                                { label: "Section Officer (Accounts)", field: "section_officer_status", timestampField: "section_officer_date" },
                                { label: "Accounts Officer", field: "account_officer_status", timestampField: "account_officer_date" },
                            ].map(({ label, field, timestampField }) => {
                                const isButtonClickable =
                                    !netSalaryData[field] &&      // 1. Must NOT be verified
                                    field === statusField &&      // 2. Must be the current step's turn
                                    userHasRoleForStep(field);    // 3. User must have the correct role

                                const verificationTime = formatTimestamp(netSalaryData[timestampField]);

                                return (
                                    <Box key={field} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                                        <Button
                                            variant="contained"
                                            color={netSalaryData[field] ? "success" : "error"}
                                            startIcon={netSalaryData[field] ? <CheckCircleIcon /> : <CancelIcon />}
                                            onClick={isButtonClickable ? () => handleStepVerification(netSalaryData, field) : null}
                                            sx={{
                                                minWidth: 240,
                                                fontWeight: 500,
                                                // Improved cursor logic
                                                cursor: isButtonClickable ? 'pointer' : (netSalaryData[field] ? 'default' : 'not-allowed')
                                            }}
                                        >
                                            {label} {netSalaryData[field] ? "Verified" : "Verify"}
                                        </Button>
                                        {/* UPDATED: Conditionally render the formatted timestamp */}
                                        {verificationTime && (
                                            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                                                {verificationTime}
                                            </Typography>
                                        )}
                                    </Box>
                                )
                            })}
                        </Stack>
                    </Paper>
                }
            </Box>

            <Box sx={{ p: 3 }}>
                {/* --- Action Bar (Preserved) --- */}
                <Paper elevation={2} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
                        <IconButton onClick={() => {
                            if (currentRoles.length === 1 && currentRoles[0] === "End Users") {
                                navigate('/my-salary')
                            }
                            else {
                                navigate('/net-salary')
                            }
                        }}>
                            <ArrowBackIcon />
                        </IconButton>
                        <Typography variant="h5" sx={{ flexGrow: 1 }}>
                            Pay Slip Details
                        </Typography>

                        {!netSalaryData?.is_finalize && (
                            <>
                                <Button
                                    variant="outlined"
                                    startIcon={<EditIcon />}
                                    onClick={() => setPayModalOpen(true)}
                                // disabled={areButtonsDisabled}
                                >
                                    Earnings
                                </Button>
                                <Button
                                    variant="outlined"
                                    startIcon={<EditIcon />}
                                    onClick={() => setDeductionModalOpen(true)}
                                // disabled={areButtonsDisabled}
                                >
                                    Deductions
                                </Button>
                            </>
                        )}
                        {
                            currentRoles.includes("IT Admin") && (
                                <Button
                                    variant="contained"
                                    color="success"
                                    startIcon={<CheckCircleIcon />}
                                    onClick={handleAdminVerify}
                                    sx={{ m: 1 }}
                                >
                                    Verify All
                                </Button>
                            )}

                        {/* Only show the verify button for the correct role and step */}
                        {canVerify(netSalaryData) && statusField && (
                            <Button
                                variant="contained"
                                color="success"
                                startIcon={<CheckCircleIcon />}
                                onClick={() => handleStepVerification(netSalaryData, statusField)}
                            >
                                Verify
                            </Button>
                        )}

                        {/* Only show the finalize button for the correct role and step */}
                        {canManageFinalization && (
                            <>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    startIcon={netSalaryData?.is_finalize ? <CheckCircleIcon /> : <CancelIcon />}
                                    onClick={() => handleStepFinalization(netSalaryData)}
                                    disabled={!allStepsVerified}
                                >
                                    {netSalaryData?.is_finalize ? "Finalized" : "Finalize"}
                                </Button>

                                <Button
                                    variant="contained"
                                    color="info"
                                    startIcon={netSalaryData?.is_verified ? <CheckCircleIcon /> : <CancelIcon />}
                                    onClick={() => handleStepRelease(netSalaryData)}
                                    disabled={!netSalaryData?.is_finalize}
                                >
                                    {netSalaryData?.is_verified ? "Released" : "Release"}
                                </Button>
                            </>
                        )}

                        <Button variant="contained" color="primary" startIcon={<DownloadIcon />} onClick={handleDownloadPdf}>
                            Download
                        </Button>
                    </Stack>
                </Paper>

                {/* --- Redesigned Payslip Body --- */}
                <div className="salary-slip-container" ref={pdfContainerRef}>
                    <div className="salary-slip">
                        <div className="slip-header">
                            <div className="logo-section">
                                {
                                    netSalaryData?.employee?.institute === 'NIOH' || netSalaryData?.employee?.institute === 'BOTH' ? (
                                        <img src={logo} alt="NIOH Logo" className="slip-logo w-100" />
                                    ) : null
                                }

                                {
                                    netSalaryData?.employee?.institute === 'ROHC' ? (
                                        <img src={rohcheader} alt="ROHC Logo" className="slip-logo w-100" />
                                    ) : null
                                }
                                {/* <div className="org-name">
                                    <h1>आई.सी.एम.आर.- राष्ट्रीय व्यावसायिक स्वास्थ्य संस्थान</h1>
                                    <h2>ICMR- National Institute Of Occupational Health</h2>
                                    <p>अहमदाबाद - 380016 भारत / Ahmedabad - 380016 India</p>
                                    <p className="who-text">व्यावसायिक स्वास्थ्य के लिए डब्ल्यूएचओ का सहयोग केंद्र</p>
                                    <p className="who-text">WHO Collaborating Center for Occupational Health</p>
                                </div> */}
                            </div>
                        </div>
                        <div className="slip-title">
                            वेतन पर्ची / SALARY SLIP for {monthLabel} {netSalaryData.year}
                        </div>
                        <div className="employee-info">
                            <table className="info-table">
                                <tbody>
                                    <tr>
                                        <td className="info-label">कर्मचारी कोड / Emp. Code</td>
                                        <td className="info-value">{employee?.employee_code || 'N/A'}</td>
                                        <td className="info-label">नाम / Name</td>
                                        <td className="info-value">{employee?.name || 'N/A'}</td>
                                    </tr>
                                    <tr>
                                        <td className="info-label">पद / Designation</td>
                                        <td className="info-value">{employee?.employee_designation?.[0]?.designation || 'N/A'}</td>
                                        <td className="info-label">वर्ग-कैडर / Group-Cadre</td>
                                        <td className="info-value">{employee?.employee_designation?.[0]?.job_group}/{employee?.employee_designation?.[0]?.cadre || 'N/A'}</td>
                                    </tr>
                                    <tr>
                                        <td className="info-label">मैट्रिक्स लैवल / Pay Level</td>
                                        <td className="info-value">{matrix?.pay_matrix_level?.name || 'N/A'}</td>
                                        <td className="info-label">पे इंडेक्स / Pay Index</td>
                                        <td className="info-value">{matrix ? `${matrix.index} | ₹${matrix.amount}` : 'N/A'}</td>
                                    </tr>
                                    <tr>
                                        <td className="info-label">ईमेल / Gmail</td>
                                        <td className="info-value">{netSalaryData?.employee?.email || 'N/A'}</td>
                                        <td className="info-label">लिंग / Gender</td>
                                        <td className="info-value">{employee?.gender || 'N/A'}</td>
                                    </tr>
                                    <tr>
                                        <td className="info-label">संस्थान / Institute</td>
                                        <td className="info-value">{netSalaryData?.employee?.institute || 'N/A'}</td>
                                        <td className="info-label">वृद्धि महीने / Inc. Month</td>
                                        <td className="info-value">{getMonthName(netSalaryData?.employee?.increment_month)}</td>
                                    </tr>
                                    <tr>
                                        <td className="info-label">पेंशन योजना / Pension Scheme</td>
                                        <td className="info-value">{netSalaryData?.employee?.pension_scheme}</td>
                                        <td className="info-label">पेंशन नंबर / pension_number</td>
                                        <td className="info-value">{netSalaryData?.employee?.pension_number}</td>
                                    </tr>
                                    <tr>
                                        <td className="info-label">स्थिति / status</td>
                                        <td className="info-value">{netSalaryData?.employee?.employee_status?.[0].status}</td>
                                        <td className="info-label">टिप्पणियाँ / remarks </td>
                                        <td className="info-value">{netSalaryData?.remarks}</td>
                                    </tr>

                                    <tr>
                                        <td className='info-label'>बैंक खाता संख्या / Bank Account Number</td>
                                        <td className='info-value'>{netSalaryData?.employee_bank?.account_number || 'N/A'}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="salary-details">
                            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0px' }}>
                                {/* Earnings Table */}
                                <div style={{ flex: 1 }}>
                                    <table className="salary-table">
                                        <thead>
                                            <tr>
                                                <th style={{ width: '70%' }}>आय विवरण / EARNINGS</th>
                                                <th style={{ width: '30%' }}>राशि / AMOUNT (₹)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Number(payslipForm?.basic_pay) > 0 && (
                                                <tr>
                                                    <td>मूल वेतन / Basic Pay</td>
                                                    <td className="amount-col">{formatCurrency(payslipForm?.basic_pay)}</td>
                                                </tr>
                                            )}
                                            {Number(payslipForm?.npa_amount) > 0 && (
                                                <tr>
                                                    <td>एन पी ए / NPA</td>
                                                    <td className="amount-col">{formatCurrency(payslipForm?.npa_amount)}</td>
                                                </tr>
                                            )}
                                            {Number(payslipForm?.basic_pay) > 0 && (
                                                <tr>
                                                    <td>पे + एन पी ए / PAY + NPA</td>
                                                    <td className="amount-col">{formatCurrency(payslipForm?.basic_pay + payslipForm?.npa_amount) || 0}</td>
                                                </tr>
                                            )}
                                            {Number(payslipForm?.da_amount) > 0 && (
                                                <tr>
                                                    <td>महंगाई भत्ता / Dearness Allowance</td>
                                                    <td className="amount-col">{formatCurrency(payslipForm?.da_amount)}</td>
                                                </tr>
                                            )}
                                            {Number(payslipForm?.govt_contribution) > 0 && (
                                                <tr>
                                                    <td>{govtContributionRate}% सरकारी योगदान / Government Contribution</td>
                                                    <td className="amount-col">{formatCurrency(payslipForm?.govt_contribution)}</td>
                                                </tr>
                                            )}
                                            {Number(payslipForm?.hra_amount) > 0 && (
                                                <tr>
                                                    <td>मकान किराया भत्ता / HRA</td>
                                                    <td className="amount-col">{formatCurrency(payslipForm?.hra_amount)}</td>
                                                </tr>
                                            )}
                                            {Number(payslipForm?.transport_amount) > 0 && (
                                                <tr>
                                                    <td>यात्रा भत्ता / Transport Allowance</td>
                                                    <td className="amount-col">{formatCurrency(payslipForm?.transport_amount)}</td>
                                                </tr>
                                            )}
                                            {Number(payslipForm?.da_on_ta) > 0 && (
                                                <tr>
                                                    <td>DA on T.A.</td>
                                                    <td className="amount-col">{formatCurrency(payslipForm?.da_on_ta)}</td>
                                                </tr>
                                            )}
                                            {Number(payslipForm?.spacial_pay) > 0 && (
                                                <tr>
                                                    <td>विशेष वेतन / Special Pay</td>
                                                    <td className="amount-col">{formatCurrency(payslipForm?.spacial_pay)}</td>
                                                </tr>
                                            )}
                                            {Number(payslipForm?.da_1) > 0 && (
                                                <tr>
                                                    <td>महंगाई भत्ता / D.A.1</td>
                                                    <td className="amount-col">{formatCurrency(payslipForm?.da_1)}</td>
                                                </tr>
                                            )}
                                            {Number(payslipForm?.da_2) > 0 && (
                                                <tr>
                                                    <td>महंगाई भत्ता / D.A.2</td>
                                                    <td className="amount-col">{formatCurrency(payslipForm?.da_2)}</td>
                                                </tr>
                                            )}
                                            {Number(payslipForm?.itc_leave_salary) > 0 && (
                                                <tr>
                                                    <td>एलटीसी छुट्टी वेतन / LTC Leave Salary</td>
                                                    <td className="amount-col">{formatCurrency(payslipForm?.itc_leave_salary)}</td>
                                                </tr>
                                            )}
                                            {Number(payslipForm?.uniform_rate_amount) > 0 && (
                                                <tr>
                                                    <td>वर्दी भत्ता / Uniform Allowance</td>
                                                    <td className="amount-col">{formatCurrency(payslipForm?.uniform_rate_amount)}</td>
                                                </tr>
                                            )}

                                            {/* Add dynamic earnings */}
                                            {payslipForm?.salary_arrears?.map((obj, index) => (
                                                Number(obj.amount) > 0 && (
                                                    <tr key={index}>
                                                        <td>{obj.type}</td>
                                                        <td className="amount-col">{formatCurrency(obj.amount)}</td>
                                                    </tr>
                                                )
                                            ))}

                                            <tr className="total-row">
                                                <td><strong>कुल आय / TOTAL EARNINGS</strong></td>
                                                <td className="amount-col"><strong>{formatCurrency(totalEarnings)}</strong></td>
                                            </tr>

                                        </tbody>
                                    </table>
                                </div>

                                {/* Deductions Table */}
                                <div style={{ flex: 1 }}>
                                    <table className="salary-table">
                                        <thead>
                                            <tr>
                                                <th style={{ width: '70%' }}>कटौती विवरण / DEDUCTIONS</th>
                                                <th style={{ width: '30%' }}>राशि / AMOUNT (₹)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Number(deductionForm?.income_tax) > 0 && (
                                                <tr>
                                                    <td>आयकर / Income Tax</td>
                                                    <td className="amount-col">{formatCurrency(deductionForm?.income_tax)}</td>
                                                </tr>
                                            )}
                                            {Number(deductionForm?.professional_tax) > 0 && (
                                                <tr>
                                                    <td>व्यवसाय कर / Professional Tax</td>
                                                    <td className="amount-col">{formatCurrency(deductionForm?.professional_tax)}</td>
                                                </tr>
                                            )}
                                            {Number(deductionForm?.license_fee) > 0 && (
                                                <tr>
                                                    <td>लाइसेंस फीस / License Fee</td>
                                                    <td className="amount-col">{formatCurrency(deductionForm?.license_fee)}</td>
                                                </tr>
                                            )}
                                            {Number(deductionForm?.nfch_donation) > 0 && (
                                                <tr>
                                                    <td>दान / NFCH Donation</td>
                                                    <td className="amount-col">{formatCurrency(deductionForm?.nfch_donation)}</td>
                                                </tr>
                                            )}
                                            {Number(deductionForm?.gpf) > 0 && (
                                                <tr>
                                                    <td>सा.भ.नि./GPF</td>
                                                    <td className="amount-col">{formatCurrency(deductionForm?.gpf)}</td>
                                                </tr>
                                            )}
                                            {Number(deductionForm?.employee_contribution_10) > 0 && (
                                                <tr>
                                                    <td>{employeeContributionRate}% NPS Employee Contribution</td>
                                                    <td className="amount-col">{formatCurrency(deductionForm?.employee_contribution_10)}</td>
                                                </tr>
                                            )}
                                            {Number(deductionForm?.govt_contribution_14_recovery) > 0 && (
                                                <tr>
                                                    <td>{govtContributionRate}%  सरकारी योगदान रिकवरी / Govt. Contribution Rec.</td>
                                                    <td className="amount-col">{formatCurrency(deductionForm?.govt_contribution_14_recovery)}</td>
                                                </tr>
                                            )}
                                            {Number(deductionForm?.gis) > 0 && (
                                                <tr>
                                                    <td>समूह बीमा योजना / GIS</td>
                                                    <td className="amount-col">{formatCurrency(deductionForm?.gis)}</td>
                                                </tr>
                                            )}
                                            {Number(deductionForm?.computer_advance_installment) > 0 && (
                                                <tr>
                                                    <td>कंप्यूटर ऋण किस्त / Computer Advance Installment</td>
                                                    <td className="amount-col">{formatCurrency(deductionForm?.computer_advance_installment)}</td>
                                                </tr>
                                            )}

                                            {/* Add dynamic deductions */}
                                            {deductionForm?.deduction_recoveries?.map((obj, index) => (
                                                Number(obj.amount) > 0 && (
                                                    <tr key={index}>
                                                        <td>{obj.type}</td>
                                                        <td className="amount-col">{formatCurrency(obj.amount)}</td>
                                                    </tr>
                                                )
                                            ))}

                                            <tr className="total-row">
                                                <td><strong>कुल कटौती / TOTAL DEDUCTIONS</strong></td>
                                                <td className="amount-col"><strong>{formatCurrency(totalDeductionsCalc)}</strong></td>
                                            </tr>

                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>


                        <div className="net-pay">
                            शुद्ध वेतन / NET PAY (BEFORE ADDL. DEDUCTIONS): ₹ {formatCurrency(netPayCalc)}
                        </div>
                        <div className="additional-deductions">
                            <h3>अतिरिक्त कटौती / ADDITIONAL DEDUCTIONS</h3>
                            <div className="table-responsive">
                                <table className="deduction-table">
                                    <tbody>
                                        <tr>
                                            <td>जीवन बीमा निगम / LIC</td>
                                            <td className="amount">₹ {formatCurrency(deductionForm?.lic)}</td>
                                        </tr>
                                        <tr>
                                            <td>क्रेडिट सोसायटी / Credit Society</td>
                                            <td className="amount">₹ {formatCurrency(deductionForm?.credit_society)}</td>
                                        </tr>
                                        <tr style={{ background: '#f0f0f0' }}>
                                            <td><strong>कुल अतिरिक्त कटौती / Total Additional Deductions</strong></td>
                                            <td className="amount"><strong>₹ {formatCurrency(totalAdditionalDeductions)}</strong></td>
                                        </tr>
                                        <tr style={{ background: '#e0e0e0' }}>
                                            <td><strong>अंतिम शुद्ध वेतन / FINAL NET PAY</strong></td>
                                            <td className="amount"><strong>₹ {formatCurrency(finalNetPay)}</strong></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="slip-footer">
                            <p><strong>This is a computer-generated document and does not require a signature.</strong></p>
                        </div>
                    </div>
                </div>
            </Box>

            {/* --- Modals (Preserved) --- */}
            <PaySlipEditModal
                isOpen={isPayModalOpen}
                toggle={() => setPayModalOpen(false)}
                data={payslipForm || {}}
                employee={netSalaryData?.employee}
                onSave={handlePaySave}
            />
            <DeductionEditModal
                isOpen={isDeductionModalOpen}
                toggle={() => setDeductionModalOpen(false)}
                data={deductionForm || {}}
                onSave={handleDeductionSave}
                employee={netSalaryData?.employee}
                netSalaryId={netSalaryData?.id}
            />
        </>
    );
}



