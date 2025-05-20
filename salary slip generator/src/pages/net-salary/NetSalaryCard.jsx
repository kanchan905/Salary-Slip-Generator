import { Box, CircularProgress, Grid, Typography, Paper, Divider } from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { viewNetSalary } from '../../redux/slices/netSalarySlice';
import { useParams } from 'react-router-dom';

function NetSalaryCard() {
    const dispatch = useDispatch();
    const { id } = useParams();
    const { netSalaryData, loading } = useSelector((state) => state.netSalary);

    useEffect(() => {
        if (id) dispatch(viewNetSalary({ id }));
    }, [dispatch, id]);

    const data = netSalaryData;
    const pay = data?.pay_slip;
    const deduction = data?.deduction;

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
                        <Typography align="center" fontWeight="bold" variant="h5" gutterBottom>
                            Net Salary
                        </Typography>

                        <Grid container spacing={2} mb={2}>
                            <Grid item xs={6}>
                                <Typography variant="body1">Employee ID: <b>{data?.employee_id || 'N/A'}</b></Typography>
                                <Typography variant="body1">Month: <b>{data?.month}/{data?.year}</b></Typography>
                            </Grid>
                            <Grid item xs={6} textAlign="right">
                                <Typography variant="body1">Processing Date: <b>{data?.processing_date}</b></Typography>
                                <Typography variant="body1">Payment Date: <b>{data?.payment_date}</b></Typography>
                            </Grid>
                        </Grid>

                        <Divider sx={{ my: 2 }} />

                        <Grid container spacing={4}>
                            {/* Pay Slip */}
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6" fontWeight="bold" gutterBottom>Pay Slip</Typography>
                                <Grid container spacing={1}>
                                    <Grid item xs={6}>
                                        {[
                                            ['Basic Pay', pay?.basic_pay],
                                            ['DA', pay?.da_amount],
                                            ['NPA', pay?.npa_amount],
                                            ['HRA', pay?.hra_amount],
                                            ['TA', pay?.transport_amount],
                                            ['URA', pay?.uniform_rate_amount],
                                            ['Pay Plus NPA', pay?.pay_plus_npa],
                                        ].map(([label, value], index) => (
                                            <Typography key={index} variant="body2" gutterBottom>
                                                {label}: ₹{value || 0}
                                            </Typography>
                                        ))}
                                    </Grid>
                                    <Grid item xs={6}>
                                        {[
                                            ['Govt Contribution', pay?.govt_contribution],
                                            ['DA On TA', pay?.da_on_ta],
                                            ['Arrears', pay?.arrears],
                                            ['Special Pay', pay?.spacial_pay],
                                            ['DA 1', pay?.da_1],
                                            ['DA 2', pay?.da_2],
                                            ['ITC Leave Salary', pay?.itc_leave_salary],
                                        ].map(([label, value], index) => (
                                            <Typography key={index} variant="body2" gutterBottom>
                                                {label}: ₹{value || 0}
                                            </Typography>
                                        ))}
                                    </Grid>
                                </Grid>
                                <Typography variant="subtitle1" fontWeight="bold" mt={2}>
                                    Gross Salary: ₹{pay?.total_pay}
                                </Typography>
                            </Grid>

                            {/* Deductions */}
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6" fontWeight="bold" gutterBottom>Deductions</Typography>
                                <Grid container spacing={1}>
                                    <Grid item xs={6}>
                                        {[
                                            ['Income Tax', deduction?.income_tax],
                                            ['Professional Tax', deduction?.professional_tax],
                                            ['License Fee', deduction?.license_fee],
                                            ['NFCH Donation', deduction?.nfch_donation],
                                            ['GPF', deduction?.gpf],
                                            ['Transport Allowance Recovery', deduction?.transport_allowance_recovery],
                                            ['HRA Recovery', deduction?.hra_recovery],
                                            ['Computer Advance', deduction?.computer_advance],
                                            ['Computer Advance Installment', deduction?.computer_advance_installment],
                                            ['LIC', deduction?.lic],
                                        ].map(([label, value], index) => (
                                            <Typography key={index} variant="body2" gutterBottom>
                                                {label}: ₹{value || 0}
                                            </Typography>
                                        ))}
                                    </Grid>
                                    <Grid item xs={6}>
                                        {[
                                            ['Inst No', deduction?.computer_advance_inst_no],
                                            ['Balance', deduction?.computer_advance_balance],
                                            ['Employee Contribution (10%)', deduction?.employee_contribution_10],
                                            ['Govt Contribution (14%) Recovery', deduction?.govt_contribution_14_recovery],
                                            ['Dies Non Recovery', deduction?.dies_non_recovery],
                                            ['Computer Advance Interest', deduction?.computer_advance_interest],
                                            ['GIS', deduction?.gis],
                                            ['Pay Recovery', deduction?.pay_recovery],
                                            ['NPS Recovery', deduction?.nps_recovery],
                                            ['Credit Society', deduction?.credit_society],
                                        ].map(([label, value], index) => (
                                            <Typography key={index} variant="body2" gutterBottom>
                                                {label}: ₹{value || 0}
                                            </Typography>
                                        ))}
                                    </Grid>
                                </Grid>
                                <Typography variant="subtitle1" fontWeight="bold" mt={2}>
                                    Total Deductions: ₹{deduction?.total_deductions}
                                </Typography>
                            </Grid>
                        </Grid>

                        <Divider sx={{ my: 3 }} />

                        <Typography align="right" fontWeight="bold" variant="h6">
                            Net Pay: ₹{data?.net_amount}
                        </Typography>
                    </Paper>
                </Box>
            )}
        </>
    );
}

export default NetSalaryCard;
