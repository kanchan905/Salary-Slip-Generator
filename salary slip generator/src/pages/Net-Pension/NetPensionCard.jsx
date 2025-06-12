import { Box, CircularProgress, Grid, Typography, Paper, Divider, Chip } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useParams } from 'react-router-dom';
import { showNetPension } from '../../redux/slices/netPensionSlice'; // Adjust path as needed
import { Button } from 'reactstrap';

function NetPensionCard() {
    const dispatch = useDispatch();
    const { id } = useParams();
    const { netPensionData, loading } = useSelector((state) => state.netPension);
    const [monthlyPension, setMonthlyPension] = useState({});
    const [deduction, setDeduction] = useState({});

    useEffect(() => {
        if (id) dispatch(showNetPension({ id }));
    }, [dispatch, id]);

    useEffect(() => {
        if (netPensionData?.monthly_pension) setMonthlyPension(netPensionData?.monthly_pension);
        if (netPensionData?.pensioner_deduction) setDeduction(netPensionData?.pensioner_deduction);
    }, [netPensionData]);

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
                        <div className='d-flex justify-content-between align-items-center mb-4' >
                            <Typography align="center" fontWeight="bold" variant="h2" gutterBottom sx={{ width: '90%' }}>
                                Net Pension
                            </Typography>
                            <NavLink to={`/net-pension`} sx={{ width: '10%' }}>
                                <Button
                                    style={{ background: "#004080", color: '#fff' }}
                                    type="button"
                                >
                                    Back
                                </Button>
                            </NavLink>
                        </div>

                        <Grid container justifyContent={'space-between'} mb={2}>
                            <Grid item xs={6}>
                                <Typography variant="body1">Emp Code: {netPensionData?.employee_code || 'N/A'}</Typography>
                                <Typography variant="body1">Name: {netPensionData?.pensioner.first_name} {netPensionData?.pensioner.middle_name} {netPensionData?.pensioner.last_name}</Typography>
                                <Typography variant="body1">Month: {netPensionData?.month}/{netPensionData?.year}</Typography>
                                <Typography variant="body1">Processing Date: {netPensionData?.processing_date}</Typography>
                                <Typography variant="body1">Payment Date: {netPensionData?.payment_date}</Typography>
                                <Typography variant="body1">DOR: {netPensionData?.pensioner?.dor || 'N/A'}</Typography>
                            </Grid>

                            <Grid item xs={6}>
                                <Typography variant="body1">Mobile No.: {netPensionData?.pensioner.mobile_no}</Typography>
                                <Typography variant="body1">Bank Name: {netPensionData?.pensioner_bank.bank_name}</Typography>
                                <Typography variant="body1">Branch Name: {netPensionData?.pensioner_bank.branch_name}</Typography>
                                <Typography variant="body1">Account No.: {netPensionData?.pensioner_bank.account_no}</Typography>
                                <Typography variant="body1">IFSC Code: {netPensionData?.pensioner_bank.ifsc_code}</Typography>
                            </Grid>
                        </Grid>

                        <Divider sx={{ my: 2 }} />

                        <Grid container justifyContent={'space-between'}>
                            {/* Monthly Pension */}
                            <Grid item xs={12} md={6}>
                                <Typography variant="h4" fontWeight="bold" gutterBottom>Monthly Pension</Typography>
                                <Typography variant="body2">Basic Pension: ₹{monthlyPension?.basic_pension || 0}</Typography>
                                <Typography variant="body2">Additional Pension: ₹{monthlyPension?.additional_pension || 0}</Typography>
                                <Typography variant="body2">Dearness Relief: ₹{monthlyPension?.dr_amount || 0}</Typography>
                                <Typography variant="body2">Medical Allowance: ₹{monthlyPension?.medical_allowance || 0}</Typography>
                                <Typography variant="body2">Total Arrear: ₹{monthlyPension?.total_arrear || 0}</Typography>
                                <Typography variant="subtitle1" fontWeight="bold" mt={2}>
                                    Total Pension: ₹{monthlyPension?.total_pension || 0}
                                </Typography>
                                <Typography variant="body2">Remarks: {monthlyPension?.remarks || 'N/A'}</Typography>
                            </Grid>

                            {/* Deductions */}
                            <Grid item xs={12} md={6}>
                                <Typography variant="h4" fontWeight="bold" gutterBottom>Deductions</Typography>
                                <Typography variant="body2">Commutation Amount: ₹{deduction?.commutation_amount || 0}</Typography>
                                <Typography variant="body2">Income Tax: ₹{deduction?.income_tax || 0}</Typography>
                                <Typography variant="body2">Recovery: ₹{deduction?.recovery || 0}</Typography>
                                <Typography variant="body2">Other Deductions: ₹{deduction?.other || 0}</Typography>
                                <Typography variant="subtitle1" fontWeight="bold" mt={2}>
                                    Total Deductions: ₹{deduction?.amount || 0}
                                </Typography>
                                <Typography variant="body2">Description: {deduction?.description || 'N/A'}</Typography>
                            </Grid>
                        </Grid>

                        <Divider sx={{ my: 3 }} />

                    
                        <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                            <Box display="flex" justifyContent={"space-between"} alignItems="center">
                                <Typography variant="h6" fontWeight="bold" sx={{ mr: 2 }}>
                                    Added by: {netPensionData?.added_by?.name || 'N/A'}
                                </Typography>
                                <Chip
                                    label={netPensionData?.is_verified ? "Verified" : "Not Verified"}
                                    color={netPensionData?.is_verified ? "success" : "warning"}
                                    sx={{ fontWeight: 'bold', mb: 1 }}
                                />
                            </Box>
                            <Box display="flex" justifyContent={"space-between"} alignItems="center">
                                <Typography variant="h6" fontWeight="bold" sx={{ mr: 2 }}>
                                    Net Pension:
                                </Typography>
                                <Chip
                                    label={`₹${netPensionData?.net_pension?.toLocaleString() || 0}`}
                                    color="success"
                                    sx={{ fontSize: 18, height: 40, px: 2 }}
                                />
                            </Box>
                        </Box>
                    </Paper>
                </Box>
            )}
        </>
    );
}

export default NetPensionCard;
