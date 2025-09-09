import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import html2pdf from 'html2pdf.js';
import { months, dateFormat } from 'utils/helpers';
import {
    Box,
    CircularProgress,
    Typography,
    Paper,
    Button,
    Stack,
    IconButton,
    Chip,
} from '@mui/material';
import {
    Download as DownloadIcon,
    ArrowBack as ArrowBackIcon,
    CheckCircle as CheckCircleIcon,
    Cancel as CancelIcon,
    Edit as EditIcon,
} from '@mui/icons-material';
import { finalizeNetPension, releaseNetPension, showNetPension, verifyNetPension, verifyNetPensionAdmin } from '../../redux/slices/netPensionSlice';
import logo from '../../assets/img/images/slip-header.png';
import '../../assets/css/custom.css';
import MonthlyPensionModal from '../../Modal/MonthlyPension';
import { updateMonthlyPension } from '../../redux/slices/monthlyPensionSlice';
import { updatePensionDeduction } from '../../redux/slices/pensionDeductionSlice';
import PensionDeductionModal from '../../Modal/PensionDeductionModal';
import niohfooter from '../../assets/img/images/nioh-footer.jpeg'
import { setIsReleasing } from '../../redux/slices/netSalarySlice';
import Preloader from 'include/Preloader';

function NetPensionCard() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const pdfContainerRef = useRef();
    const { netPensionData, loading } = useSelector((state) => state.netPension);
    const { user } = useSelector((state) => state.auth);
    const [isMonthlyModalOpen, setMonthlyModalOpen] = useState(false);
    const [isDeductionModalOpen, setDeductionModalOpen] = useState(false);
    const currentRoles = useSelector((state) =>
        state.auth.user?.roles?.map(role => role.name) || []
    );
    const { isReleasing } = useSelector((state) => state.netSalary);
    // const [isReleasing, setIsReleasing] = useState(false);

    useEffect(() => {
        if (id) {
            dispatch(showNetPension({ id }));
        }
    }, [dispatch, id]);

    const handleToggleStatus = () => {
        dispatch(verifyNetPension([netPensionData.id])).unwrap()
            .then(() => {
                toast.success("Net Pension status updated successfully");
                dispatch(showNetPension({ id }));
            })
            .catch((err) => {
                toast.error(err?.message || 'Failed to update status.');
            });
    };

    const handleDownloadPdf = () => {
        const element = pdfContainerRef.current;
        if (!element) return;
        const opt = {
            margin: 0,
            filename: `PensionSlip_${netPensionData?.pensioner?.employee?.employee_code}_${netPensionData?.month}_${netPensionData?.year}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true, windowWidth: element.scrollWidth, windowHeight: element.scrollHeight },
            jsPDF: { unit: 'px', format: [element.offsetWidth, element.offsetHeight], orientation: 'portrait', hotfixes: ['px_scaling'] }
        };
        html2pdf().from(element).set(opt).save();
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!netPensionData) {
        return (
            <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h5">Pension Slip Not Found</Typography>
                <Button startIcon={<ArrowBackIcon />} sx={{ mt: 2 }} variant="contained" onClick={() => navigate('/net-pension')}>
                    Go Back
                </Button>
            </Box>
        );
    }

    // --- Data Mapping & Calculations for Display ---
    const { pensioner, monthly_pension, pensioner_deduction, pensioner_bank } = netPensionData;
    const hasRole = (...roles) => currentRoles.some(role => roles.includes(role));
    const canEdit = hasRole(
        'IT Admin',
        'Section Officer (Accounts)',
        'Accounts Officer',
        'Drawing and Disbursing Officer (NIOH)',
        'Pensioners Operator'
    );
    const monthLabel = months.find(m => m.value == netPensionData.month)?.label || netPensionData.month;
    const formatCurrency = (val) => (Number(val) || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    const totalPension = monthly_pension?.total_pension || 0;
    const totalDeductions = pensioner_deduction?.amount || 0;


    const handleSave = (updateAction, successMessage, payload, modalSetter) => {
        dispatch(updateAction(payload)).unwrap()
            .then(() => {
                toast.success(successMessage);
                dispatch(showNetPension({ id }));
                modalSetter(false);
            })
            .catch((err) => {
                toast.error(err.message || "An error occurred.");
            });
    };

    const handleMonthlySave = (valuesFromModal) => {
        const payload = { id: netPensionData.monthly_pension.id, values: valuesFromModal };
        handleSave(updateMonthlyPension, "Monthly Pension updated successfully", payload, setMonthlyModalOpen);
    };

    const handleDeductionSave = (valuesFromModal) => {
        const originalData = netPensionData.pensioner_deduction;

        // As per the "disabled field" issue, manually add the non-editable ID
        const finalValues = {
            ...valuesFromModal,
            net_pension_id: originalData.net_pension_id,
        };

        const payload = { id: originalData.id, values: finalValues };
        handleSave(updatePensionDeduction, "Deductions updated successfully", payload, setDeductionModalOpen);
    };

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
        const { step } = getCurrentVerificationStep(row);
        if (step === "Pensioners Operator" && currentRoles.includes("Pensioners Operator")) return true;
        if (step === "Drawing and Disbursing Officer" && currentRoles.includes("Drawing and Disbursing Officer (NIOH)")) return true;
        if (step === "Section Officer (Accounts)" && currentRoles.includes("Section Officer (Accounts)")) return true;
        if (step === "Accounts Officer" && currentRoles.includes("Accounts Officer")) return true;
        return false;
    }

    // Step-based verification handler
    const handleStepVerification = (row, statusField) => {
        dispatch(verifyNetPension({ selected_id: [row.id], statusField }))
            .unwrap()
            .then(() => {
                toast.success("NetPension verified successfully");
                dispatch(showNetPension({ id: row.id }));
            })
            .catch((err) => {
                toast.error(err?.errorMsg || 'Failed to verify net pension.');
            });
    };

    // Get current verification step and statusField for this slip
    const { step, statusField } = getCurrentVerificationStep(netPensionData);

    // Map userRole to their status field
    // THIS IS THE CORRECTED CODE
    function getUserStatusField(roles) {
        for (const role of roles) {
            if (role === "Pensioners Operator") return "pensioner_operator_status";
            if (role.includes("Drawing and Disbursing Officer")) return "ddo_status";
            if (role === "Section Officer (Accounts)") return "section_officer_status";
            if (role === "Accounts Officer") return "account_officer_status";
        }
        return null;
    }

    const userStatusField = getUserStatusField(currentRoles);
    const hasUserVerified = userStatusField && netPensionData[userStatusField];

    function handleAdminVerify() {
        const statusPayload = {
            pensioner_operator_status: 1,
            ddo_status: 1,
            section_officer_status: 1,
            account_officer_status: 1,
        };

        const payload = { selected_id: [netPensionData.id], ...statusPayload };

        dispatch(verifyNetPensionAdmin(payload))
            .unwrap()
            .then(() => {
                toast.success("All statuses verified successfully");
                dispatch(showNetPension({ id: netPensionData.id }));
            })
            .catch((err) => {
                toast.error(err?.errorMsg || 'Failed to verify net pension.');
            });
    }

    function userHasRoleForStep(field) {
        switch (field) {
            case "pensioner_operator_status":
                return currentRoles.some(r => ["Pensioners Operator", "IT Admin"].includes(r));
            case "ddo_status":
                return currentRoles.some(r => ["Drawing and Disbursing Officer (NIOH)", "IT Admin"].includes(r));
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


    const handleStepFinalization = (row) => {
        dispatch(finalizeNetPension({ selected_id: [row.id] }))
            .unwrap()
            .then(() => {
                toast.success("NetPension finalized successfully");
                dispatch(showNetPension({ id: row.id }));
            })
            .catch((err) => {
                toast.error(err || 'Failed to finalize net pension.');
            });
    };

    const handleStepRelease = (row) => {
        // setIsReleasing(true);
        dispatch(setIsReleasing(true))
        dispatch(releaseNetPension({ selected_id: [row.id] }))
            .unwrap()
            .then(() => {
                toast.success("NetPension released successfully");
                dispatch(showNetPension({ id: row.id }));
            })
            .catch((err) => {
                toast.error(err || 'Failed to release net pension.');
            })
            .finally(() => {
                // setIsReleasing(false);
                dispatch(setIsReleasing(false))
            });
    };



    // --- START: REVISED LOGIC FOR PENSION EDIT BUTTONS ---

    // 1. Define the pension verification workflow
    const pensionVerificationWorkflow = [
        { statusField: "pensioner_operator_status", roles: ["Pensioners Operator"] },
        { statusField: "ddo_status", roles: ["Drawing and Disbursing Officer (NIOH)"] },
        { statusField: "section_officer_status", roles: ["Section Officer (Accounts)"] },
        { statusField: "account_officer_status", roles: ["Accounts Officer"] }
    ];

    // 2. Get the current active step's status field (already defined above)
    // const { step, statusField } = getCurrentVerificationStep(netPensionData);

    // 3. Determine if the current user should see the edit buttons
    let canSeeEditButtons = false;
    const isITAdmin = currentRoles.includes("IT Admin");
    // Check if all four verification steps are completed.
    const allStepsVerified =
        netPensionData?.pensioner_operator_status &&
        netPensionData?.ddo_status &&
        netPensionData?.section_officer_status &&
        netPensionData?.account_officer_status;
    // Check if the current user has the role to finalize or release.
    // const canManageFinalization =
    //     currentRoles.includes("Accounts Officer") || currentRoles.includes("IT Admin");

    // Find the configuration for the *current active step*
    const currentStepConfig = pensionVerificationWorkflow.find(s => s.statusField === statusField);

    if (currentStepConfig) {
        // Check if the logged-in user has one of the roles for this specific active step
        const userHasRoleForCurrentStep = currentRoles.some(userRole =>
            currentStepConfig.roles.includes(userRole)
        );
        // User can see buttons if they have the role for the current step, or if they are an IT Admin.
        canSeeEditButtons = userHasRoleForCurrentStep || isITAdmin;
    } else {
        // If workflow is complete, only IT Admin can still see the buttons for corrections.
        canSeeEditButtons = isITAdmin;
    }


    return (
        <>
            {
                !isReleasing && (
                    <>
                        <div className='header bg-gradient-info pb-8 pt-8 pt-md-8 main-head'></div>

                        <Box sx={{ p: 3 }} >
                            {
                                <Paper elevation={3} sx={{ mb: 3, p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: 2, background: '#f8fafc' }}>
                                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#1976d2' }}>Verification Steps</Typography>
                                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center" alignItems="center">
                                        {[
                                            { label: "Pensioners Operator", field: "pensioner_operator_status", timestampField: "pensioner_operator_date" },
                                            { label: "Drawing and Disbursing Officer", field: "ddo_status", timestampField: "ddo_date" },
                                            { label: "Section Officer (Accounts)", field: "section_officer_status", timestampField: "section_officer_date" },
                                            { label: "Accounts Officer", field: "account_officer_status", timestampField: "account_officer_date" },
                                        ].map(({ label, field, timestampField }) => {
                                            const isButtonClickable =
                                                !netPensionData[field] &&      // 1. Must NOT be verified
                                                field === statusField &&      // 2. Must be the current step's turn
                                                userHasRoleForStep(field);    // 3. User must have the correct role

                                            const verificationTime = formatTimestamp(netPensionData[timestampField]);

                                            return (
                                                <Box key={field} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                                                    <Button
                                                        variant="contained"
                                                        color={netPensionData[field] ? "success" : "error"}
                                                        startIcon={netPensionData[field] ? <CheckCircleIcon /> : <CancelIcon />}
                                                        onClick={isButtonClickable ? () => !netPensionData[field] && handleStepVerification(netPensionData, field) : null}
                                                        // onClick={() => handleAdminVerify(field)}
                                                        sx={{
                                                            minWidth: 240,
                                                            fontWeight: 500,
                                                            // Improved cursor logic
                                                            cursor: isButtonClickable ? 'pointer' : (netPensionData[field] ? 'default' : 'not-allowed')
                                                        }}
                                                    >
                                                        {label} {netPensionData[field] ? "Verified" : "Verify"}
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
                            {/* --- Action Bar (Adapted from PaySlipPage) --- */}
                            <Paper elevation={2} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
                                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
                                    <IconButton onClick={() => {
                                        if (currentRoles.includes("End Users")) {
                                            navigate('/my-salary')
                                        }
                                        else {
                                            navigate('/net-pension')
                                        }
                                    }}>
                                        <ArrowBackIcon />
                                    </IconButton>
                                    <Typography variant="h5" sx={{ flexGrow: 1 }}>Pension Slip Details</Typography>

                                    {/* --- UPDATED: Edit buttons with revised logic --- */}
                                    {!netPensionData?.is_finalize && currentRoles.some(role => ['IT Admin', "Accounts Officer", 'Pensioners Operator', 'Drawing and Disbursing Officer (NIOH)', 'Section Officer (Accounts)'].includes(role)) && (
                                        <>
                                            <Button
                                                variant="outlined"
                                                startIcon={<EditIcon />}
                                                onClick={() => setMonthlyModalOpen(true)}
                                            // disabled={areButtonsDisabled}
                                            >
                                                Pension
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
                                        currentRoles.includes("IT Admin") && !allStepsVerified && (
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

                                    {/* In the action bar, only show the verify button for the correct role and step */}
                                    {canVerify(netPensionData) && statusField && !allStepsVerified && (
                                        <Button
                                            variant="contained"
                                            color="success"
                                            startIcon={<CheckCircleIcon />}
                                            onClick={() => handleStepVerification(netPensionData, statusField)}
                                        >
                                            Verify
                                        </Button>
                                    )}

                                    {/* Only show the finalize button for the correct role and step */}
                                    {currentRoles.some(role => ['IT Admin', "Accounts Officer"].includes(role)) && (
                                        <>
                                            {
                                                !netPensionData?.is_finalize && (
                                                    <Button
                                                        variant="contained"
                                                        color="secondary"
                                                        startIcon={netPensionData?.is_finalize ? <CheckCircleIcon /> : <CancelIcon />}
                                                        onClick={() => handleStepFinalization(netPensionData)}
                                                        disabled={!allStepsVerified}
                                                    >
                                                        {netPensionData?.is_finalize ? "Finalized" : "Finalize"}
                                                    </Button>

                                                )
                                            }

                                            {
                                                !netPensionData?.is_verified && (
                                                    <Button
                                                        variant="contained"
                                                        color="info"
                                                        startIcon={netPensionData?.is_verified ? <CheckCircleIcon /> : <CancelIcon />}
                                                        onClick={() => handleStepRelease(netPensionData)}
                                                        disabled={!netPensionData?.is_finalize }
                                                    >
                                                        {netPensionData?.is_verified ? "Released" : "Release"}
                                                    </Button>
                                                )
                                            }
                                        </>
                                    )}

                                    <Button variant="contained" color="primary" startIcon={<DownloadIcon />} onClick={handleDownloadPdf}>
                                        Download
                                    </Button>
                                </Stack>
                            </Paper>


                            {/* --- Redesigned Pension Slip Body --- */}
                            <div className="salary-slip-container" ref={pdfContainerRef}>
                                <div className="salary-slip">
                                    <div className="slip-header">
                                        <div className="logo-section">
                                            <img src={logo} alt="NIOH Logo" className="slip-logo w-100" />
                                        </div>
                                    </div>
                                    <div className="slip-title">
                                        पेंशन पर्ची / PENSION SLIP for {monthLabel} {netPensionData.year}
                                    </div>
                                    <div className="employee-info">
                                        <table className="info-table">
                                            <tbody>
                                                <tr>
                                                    <td className="info-label">पीपीओ नंबर / PPO No.</td>
                                                    <td className="info-value">{pensioner?.ppo_no || 'N/A'}</td>
                                                    <td className="info-label">नाम / Name</td>
                                                    <td className="info-value">{pensioner?.name || 'N/A'}</td>
                                                </tr>
                                                <tr>
                                                    <td className="info-label">संबंध / relation</td>
                                                    <td className="info-value">{pensioner?.relation || 'N/A'}</td>
                                                    <td className="info-label">पेंशन प्रकार / Pension Type</td>
                                                    <td className="info-value">{pensioner?.type_of_pension || 'N/A'}</td>
                                                </tr>
                                                <tr>
                                                    <td className="info-label">मोबाइल नंबर / MoBILE No.</td>
                                                    <td className="info-value">{pensioner?.mobile_no}</td>
                                                    <td className="info-label">टिप्पणियाँ / remarks</td>
                                                    <td className="info-value">{monthly_pension?.remarks}</td>
                                                </tr>
                                                <tr>
                                                    <td className="info-label">ईमेल / Gmail</td>
                                                    <td className="info-value">{pensioner?.email || 'N/A'}</td>
                                                    <td className="info-label"></td>
                                                    <td className="info-value"></td>
                                                </tr>
                                                {/* <tr>
                                        <td className='info-label'>बैंक खाता संख्या / Bank Account Number</td>
                                        <td className="info-value">{pensioner_bank?.account_no || 'N/A'}</td>
                                        <td></td>
                                        <td></td>
                                    </tr> */}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="salary-details">
                                        <table className="salary-table">
                                            <thead>
                                                <tr>
                                                    <th style={{ width: '40%' }}>पेंशन विवरण / PENSION DETAILS</th>
                                                    <th style={{ width: '10%' }}>राशि / AMOUNT (₹)</th>
                                                    <th style={{ width: '40%' }}>कटौती / DEDUCTIONS</th>
                                                    <th style={{ width: '10%' }}>राशि / AMOUNT (₹)</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {(() => {

                                                    // 1. Define the earnings and deductions as lists of objects.
                                                    const earnings = [
                                                        { label: 'मूल पेंशन / Basic Pension', value: monthly_pension?.basic_pension },

                                                        { label: 'अतिरिक्त पेंशन / Additional Pension', value: monthly_pension?.additional_pension },
                                                        { label: 'महंगाई राहत / Dearness Relief', value: monthly_pension?.dr_amount },
                                                        { label: 'चिकित्सा भत्ता / Medical Allowance', value: monthly_pension?.medical_allowance },
                                                        { label: 'कुल बकाया / Total Arrear', value: monthly_pension?.total_arrear },
                                                    ];

                                                    (monthly_pension.arrears || []).forEach(arrear => {
                                                        if (Number(arrear.amount) > 0) {
                                                            earnings.push({
                                                                label: `बकाया / ${arrear.type || 'N/A'}`,
                                                                value: arrear.amount
                                                            });
                                                        }
                                                    })

                                                    const deductions = [
                                                        { label: 'आयकर / Income Tax', value: pensioner_deduction?.income_tax },
                                                        { label: 'रिकवरी / Recovery', value: pensioner_deduction?.recovery },
                                                        { label: 'परिवर्तनीय पेंशन / Commutation Pension', value: pensioner_deduction?.commutation_amount },
                                                        { label: 'अन्य / Other', value: pensioner_deduction?.other },
                                                    ];

                                                    // 2. Filter out any items with a value of 0 or less.
                                                    const visibleEarnings = earnings.filter(item => Number(item.value) > 0);
                                                    const visibleDeductions = deductions.filter(item => Number(item.value) > 0);

                                                    // 3. Determine the number of rows needed for the table body.
                                                    const numRows = Math.max(visibleEarnings.length, visibleDeductions.length);

                                                    // 4. Dynamically generate the table rows.
                                                    return Array.from({ length: numRows }).map((_, index) => {
                                                        const earning = visibleEarnings[index];   // The earning for this row, if it exists.
                                                        const deduction = visibleDeductions[index]; // The deduction for this row, if it exists.

                                                        return (
                                                            <tr key={index}>
                                                                {/* Earning Label and Amount */}
                                                                <td>{earning ? earning.label : ''}</td>
                                                                <td className="amount-col">{earning ? formatCurrency(earning.value) : ''}</td>

                                                                {/* Deduction Label and Amount */}
                                                                <td>{deduction ? deduction.label : ''}</td>
                                                                <td className="amount-col">{deduction ? formatCurrency(deduction.value) : ''}</td>
                                                            </tr>
                                                        );
                                                    });
                                                })()}

                                                {/* The total row should always be displayed */}
                                                <tr className="total-row">
                                                    <td><strong>कुल पेंशन / TOTAL PENSION</strong></td>
                                                    <td className="amount-col"><strong>{formatCurrency(totalPension)}</strong></td>
                                                    <td><strong>कुल कटौती / TOTAL DEDUCTIONS</strong></td>
                                                    <td className="amount-col"><strong>{formatCurrency(totalDeductions)}</strong></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="net-pay" style={{ fontSize: '1.2rem', padding: '15px 10px' }}>
                                        <strong>कुल देय पेंशन / NET PENSION PAYABLE:   ₹ {formatCurrency(netPensionData?.net_pension)}</strong>
                                    </div>
                                    <div className="slip-footer">
                                        <p><strong>यह कंप्यूटर जनरेटेड डॉक्यूमेंट है और इसमें हस्ताक्षर की आवश्यकता नहीं है</strong></p>
                                        <p><strong>This is a computer-generated document and does not require a signature</strong></p>
                                    </div>
                                    <footer className="border-top pt-3 pb-3 bg-white">
                                        <div className="container">
                                            <div className="row">
                                                {/* Left Section */}
                                                <div className="col-md-6">
                                                    <p className="mb-1 fs-14">मेघानी नगर, अहमदाबाद</p>
                                                    <p className="mb-1 fs-14">गुजरात, 380016, भारत</p>
                                                    <p className="mb-0 fs-14">
                                                        <span>Meghaninagar</span>, Ahmedabad,
                                                        <p >  Gujarat – 380016, India</p>
                                                    </p>
                                                </div>

                                                {/* Right Section */}
                                                <div className="col-md-6 text-md-right">
                                                    <p className="mb-1 fs-14">
                                                        Tel: +91-79-22688700, 22686351
                                                    </p>
                                                    {/* <p className="mb-1 fs-14">
                                            Fax: +91-79-22686110
                                        </p>
                                        <p className="mb-1 fs-14">
                                            PS to Director: +91-79-22688709, 22686340
                                        </p>
                                        <p className="mb-0 fs-14">
                                            <a href="mailto:director-nioh@gov.in">
                                                director-nioh@gov.in
                                            </a>{" "}
                                            |{" "}
                                            <a href="https://nioh.org" target="_blank" rel="noreferrer">
                                                https://nioh.org
                                            </a>
                                        </p> */}
                                                </div>
                                            </div>
                                        </div>
                                    </footer>
                                </div>
                            </div>
                        </Box>

                        {/* --- Modals (Preserved) --- */}
                        <MonthlyPensionModal
                            isOpen={isMonthlyModalOpen}
                            toggle={() => setMonthlyModalOpen(false)}
                            data={monthly_pension || {}}
                            onSave={handleMonthlySave}
                        />

                        <PensionDeductionModal
                            isOpen={isDeductionModalOpen}
                            toggle={() => setDeductionModalOpen(false)}
                            data={pensioner_deduction || {}}
                            onSave={handleDeductionSave}
                            netPensionRecord={netPensionData}
                        />
                    </>
                )
            }


          {isReleasing && (<Preloader audience="pensioners" />)}
        </>
    );
}

export default NetPensionCard;