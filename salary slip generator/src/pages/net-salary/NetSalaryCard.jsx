import { Box, CircularProgress, Grid, Typography, Paper, Divider, Chip, Avatar } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { viewNetSalary } from '../../redux/slices/netSalarySlice';
import { useParams } from 'react-router-dom';
import PaySlipEditModal from '../../Modal/PaySlipEditModal';
import DeductionEditModal from '../../Modal/DeductionEditModal';
import { Button } from 'reactstrap';
import { updatePaySlip } from '../../redux/slices/paySlipSlice';
import { toast } from 'react-toastify';
import { updateDeduction } from '../../redux/slices/deductionSlice';


function NetSalaryCard() {
    const dispatch = useDispatch();
    const { id } = useParams();
    const { netSalaryData, loading } = useSelector((state) => state.netSalary);
    const [payslipForm, setPayslipForm] = useState({});
    const [deductionForm, setDeductionForm] = useState({});
    const [payModalOpen, setPayModalOpen] = useState(false);
    const [deductionModalOpen, setDeductionModalOpen] = useState(false);



    useEffect(() => {
        if (id) dispatch(viewNetSalary({ id }));
    }, [dispatch, id]);

    useEffect(() => {
        if (netSalaryData?.pay_slip) setPayslipForm(netSalaryData?.pay_slip);
        if (netSalaryData?.deduction) setDeductionForm(netSalaryData?.deduction);
    }, [netSalaryData]);

    // Save handlers for modals
    const handlePaySave = (data) => {
        console.log("Pay Slip Data:", data);
        dispatch(updatePaySlip({ id, pay_slip: data })).unwrap()
            .then(() => {
                toast.success("Pay Slip data update successfully");
                dispatch(viewNetSalary({ id }));
                setPayModalOpen(false);
            });
    };

    const handleDeductionSave = (data) => {
        dispatch(updateDeduction({ id: deductionForm.id, deduction: data })).unwrap()
            .then(() => {
                toast.success("Deduction data update successfully");
                dispatch(viewNetSalary({ id }));
                setDeductionModalOpen(false);
            }).catch((error) => {
                toast.error("Failed to update deduction data: " + error.message);
            });
    };


    return (
        <>
            <div className='header bg-gradient-info pb-8 pt-8 pt-md-8 main-head mb-4'></div>
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Box className='container-fluid mt-4 mb-4'>
                    <Paper elevation={3} sx={{ borderRadius: 3, p: 4, background: '#fff' }}>
                        <Typography align="center" fontWeight="bold" variant="h2" gutterBottom>
                            Net Salary
                        </Typography>

                        <Grid container justifyContent={'space-between'} mb={2}>
                            <Grid item xs={6}>
                                <Typography variant="body1">Employee ID: {netSalaryData?.employee_id || 'N/A'}</Typography>
                                <Typography variant="body1">Month: {netSalaryData?.month}/{netSalaryData?.year}</Typography>
                                <Typography variant="body1">Processing Date: {netSalaryData?.processing_date}</Typography>
                                <Typography variant="body1">Payment Date: {netSalaryData?.payment_date}</Typography>
                            </Grid>
                            <Grid item xs={12} md={4} textAlign="right">
                                <Chip
                                    label={netSalaryData?.is_verified ? "Verified" : "Not Verified"}
                                    color={netSalaryData?.is_verified ? "success" : "warning"}
                                    sx={{ fontWeight: 'bold', mb: 1 }}
                                />
                                <Typography variant="body2" color="text.secondary">
                                    Added by: {netSalaryData?.added_by?.name || 'N/A'}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Created: {new Date(netSalaryData?.created_at).toLocaleDateString()}
                                </Typography>
                            </Grid>
                        </Grid>

                        <Divider sx={{ my: 2 }} />

                        <Grid container sx={{ justifyContent: 'space-between' }} >
                            {/* Pay Slip */}
                            <Grid item xs={12} md={6} width={'40%'}>
                                <Box display="flex" alignItems="center" mb={1} gap={4}>
                                    <Typography variant="h4" fontWeight="bold" gutterBottom>Pay Slip</Typography>
                                    {/* <Button size="small" variant="outlined" onClick={() => setPayModalOpen(true)}>Edit</Button> */}
                                    <Button size="sm" color="primary" outline onClick={() => setPayModalOpen(true)}>Edit</Button>
                                </Box>
                                <Grid container spacing={8}>
                                    <Grid item xs={6}>
                                        {[
                                            ['Basic Pay', payslipForm?.basic_pay],
                                            ['DA', payslipForm?.da_amount],
                                            ['NPA', payslipForm?.npa_amount],
                                            ['HRA', payslipForm?.hra_amount],
                                            ['TA', payslipForm?.transport_amount],
                                            ['URA', payslipForm?.uniform_rate_amount],
                                            ['Pay Plus NPA', payslipForm?.pay_plus_npa],
                                        ].map(([label, value], index) => (
                                            <Typography key={index} variant="body2" gutterBottom>
                                                {label}: ₹{value || 0}
                                            </Typography>
                                        ))}
                                    </Grid>
                                    <Grid item xs={6}>
                                        {[
                                            ['Govt Contribution', payslipForm?.govt_contribution],
                                            ['DA On TA', payslipForm?.da_on_ta],
                                            ['Arrears', payslipForm?.arrears],
                                            ['Special Pay', payslipForm?.spacial_pay],
                                            ['DA 1', payslipForm?.da_1],
                                            ['DA 2', payslipForm?.da_2],
                                            ['ITC Leave Salary', payslipForm?.itc_leave_salary],
                                        ].map(([label, value], index) => (
                                            <Typography key={index} variant="body2" gutterBottom>
                                                {label}: ₹{value || 0}
                                            </Typography>
                                        ))}
                                    </Grid>
                                </Grid>
                                <Typography variant="subtitle1" fontWeight="bold" mt={2}>
                                    Gross Salary: ₹{payslipForm?.total_pay}
                                </Typography>
                            </Grid>

                            {/* Deductions */}
                            <Grid item xs={12} md={6} width={'50%'}>
                                <Box display="flex" alignItems="center" mb={1} gap={4}>
                                    <Typography variant="h4" fontWeight="bold" gutterBottom>Deductions</Typography>
                                    {/* <Button size="small" variant="outlined" onClick={() => setDeductionModalOpen(true)}>Edit</Button> */}
                                    <Button size="sm" color="danger" outline onClick={() => setDeductionModalOpen(true)}>Edit</Button>
                                </Box>
                                <Grid container spacing={4}>
                                    <Grid item xs={6}>
                                        {[
                                            ['Income Tax', deductionForm?.income_tax],
                                            ['Professional Tax', deductionForm?.professional_tax],
                                            ['License Fee', deductionForm?.license_fee],
                                            ['NFCH Donation', deductionForm?.nfch_donation],
                                            ['GPF', deductionForm?.gpf],
                                            ['Transport Allowance Recovery', deductionForm?.transport_allowance_recovery],
                                            ['HRA Recovery', deductionForm?.hra_recovery],
                                            ['Computer Advance', deductionForm?.computer_advance],
                                            ['Computer Advance Installment', deductionForm?.computer_advance_installment],
                                            ['LIC', deductionForm?.lic],
                                        ].map(([label, value], index) => (
                                            <Typography key={index} variant="body2" gutterBottom>
                                                {label}: ₹{value || 0}
                                            </Typography>
                                        ))}
                                    </Grid>
                                    <Grid item xs={6}>
                                        {[
                                            ['Inst No', deductionForm?.computer_advance_inst_no],
                                            ['Balance', deductionForm?.computer_advance_balance],
                                            ['Employee Contribution (10%)', deductionForm?.employee_contribution_10],
                                            ['Govt Contribution (14%) Recovery', deductionForm?.govt_contribution_14_recovery],
                                            ['Dies Non Recovery', deductionForm?.dies_non_recovery],
                                            ['Computer Advance Interest', deductionForm?.computer_advance_interest],
                                            ['GIS', deductionForm?.gis],
                                            ['Pay Recovery', deductionForm?.pay_recovery],
                                            ['NPS Recovery', deductionForm?.nps_recovery],
                                            ['Credit Society', deductionForm?.credit_society],
                                        ].map(([label, value], index) => (
                                            <Typography key={index} variant="body2" gutterBottom>
                                                {label}: ₹{value || 0}
                                            </Typography>
                                        ))}
                                    </Grid>
                                </Grid>
                                <Typography variant="subtitle1" fontWeight="bold" mt={2}>
                                    Total Deductions: ₹{deductionForm?.total_deductions}
                                </Typography>
                            </Grid>
                        </Grid>

                        <Divider sx={{ my: 3 }} />

                        {/* Net Pay Summary */}
                        <Box display="flex" justifyContent="flex-end" alignItems="center" mt={2}>
                            <Typography variant="h6" fontWeight="bold" sx={{ mr: 2 }}>
                                Net Pay:
                            </Typography>
                            <Chip
                                label={netSalaryData?.net_amount ? `₹${netSalaryData.net_amount.toLocaleString()}` : '₹0'}
                                color="success"
                                sx={{ fontSize: 18, height: 40, px: 2 }}
                            />
                        </Box>
                    </Paper>
                </Box>
            )}

            {/* Pay Slip Modal */}
            <PaySlipEditModal
                isOpen={payModalOpen}
                toggle={() => setPayModalOpen(false)}
                data={payslipForm}
                onSave={handlePaySave}
            />

            {/* Deduction Modal */}
            <DeductionEditModal
                isOpen={deductionModalOpen}
                toggle={() => setDeductionModalOpen(false)}
                data={deductionForm}
                onSave={handleDeductionSave}
                netSalaryId={netSalaryData?.id}
            />
        </>
    );
}

export default NetSalaryCard;