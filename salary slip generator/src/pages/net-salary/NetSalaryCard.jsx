import { Box, CircularProgress, Grid, Typography } from '@mui/material';
import React, { useEffect, useRef } from 'react';
import { Button } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { viewNetSalary } from '../../redux/slices/netSalarySlice';
import { useParams } from 'react-router-dom';

function NetSalaryCard() {
    const dispatch = useDispatch();
    const { id } = useParams();
    const slipRef = useRef();
    const { netSalaryData, loading } = useSelector((state) => state.netSalary);

    useEffect(() => {
        if (id) dispatch(viewNetSalary({ id }));
    }, [dispatch, id]);

    // if (loading || !netSalaryData) return <div>Loading...</div>;

    const data = netSalaryData;
    const pay = data.pay_slip;

    const grossSalary = pay?.total_pay || 0;
    const totalDeductions = data.deduction || 0;
    const netPay = data.net_amount || 0;

    const handlePrint = () => {
        window.print(); // Or use react-to-print library
    };

    return (
        <>
            <div className='header bg-gradient-info pb-8 pt-8 pt-md-8 main-head mb-4'></div>
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent:'center' }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Box className='container-fluid mt-4 mb-4'>
                    <div ref={slipRef}>
                        <Box
                            sx={{
                                border: '1px solid #000',
                                borderRadius: '10px',
                                p: 3,
                                background: '#f5f5f5',
                            }}
                        >
                            <Typography align="center" fontWeight="bold" variant="h6">
                                Salary Slip
                            </Typography>

                            <Grid container justifyContent="space-between" sx={{ mb: 1 }}>
                                <Grid>Employee ID: {data.employee_id || 'N/A'}</Grid>
                                <Grid>Generated On: {new Date(data.processing_date).toLocaleDateString()}</Grid>
                            </Grid>

                            <Typography>Month: {data.month}/{data.year}</Typography>

                            <Grid container spacing={3} mt={2}>
                                <Grid item xs={6}>
                                    <Typography fontWeight="bold">Earnings</Typography>
                                    <div>Basic: ₹{pay?.basic_pay || 0}</div>
                                    <div>DA: ₹{pay?.da_amount || 0}</div>
                                    <div>HRA: ₹{pay?.hra_amount || 0}</div>
                                    <div>TA: ₹{pay?.transport_amount || 0}</div>
                                    <div>Other: ₹{pay?.spacial_pay || 0}</div>
                                    <div style={{ marginTop: 5 }}>Gross Salary: ₹{grossSalary}</div>
                                </Grid>

                                <Grid item xs={6}>
                                    <Typography fontWeight="bold">Deductions</Typography>
                                    <div>Gpf: ₹0</div>
                                    <div>Nps: ₹0</div>
                                    <div>Income Tax: ₹0</div>
                                    <div>Prof Tax: ₹0</div>
                                    <div>Other: ₹{totalDeductions}</div>
                                    <div style={{ marginTop: 5 }}>Total Deductions: ₹{totalDeductions}</div>
                                </Grid>
                            </Grid>

                            <Typography align="right" mt={2} fontWeight="bold">
                                Net Pay: ₹{netPay}
                            </Typography>
                        </Box>
                    </div>
                    <Button color="success" className="mt-3" onClick={handlePrint}>
                        Download PDF
                    </Button>
                </Box>
            )}
        </>
    );
}

export default NetSalaryCard;
