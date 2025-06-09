import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box,
    Typography,
    Grid,
    Divider,
    Avatar,
    Paper,
    CircularProgress,
} from '@mui/material';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import { NavLink, useParams } from 'react-router-dom';
import { Button, Container } from 'reactstrap';
import { monthlyPensionDetailShow } from '../../redux/slices/monthlyPensionSlice';

const LabelValue = ({ label, value }) => (
    <Grid item xs={12} sm={6} md={4}>
        <Typography variant="subtitle2" color="text.secondary">{label}</Typography>
        <Typography variant="body1" fontWeight={500}>{value ?? '—'}</Typography>
    </Grid>
);

const Section = ({ title, children }) => (
    <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>{title}</Typography>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={3}>{children}</Grid>
    </Box>
);

const ShowMonthlyPension = () => {
    const dispatch = useDispatch();
    const { id } = useParams();
    const data = useSelector((state) => state.monthlypension.showMonthyPension);
    const loading = useSelector((state) => state.monthlypension.loading);
    const { name } = useSelector((state) => state.auth.user.role);

    useEffect(() => {
        dispatch(monthlyPensionDetailShow(id));
    }, [dispatch, id]);

    return (
        <>
            <div className='header bg-gradient-info pb-8 pt-8 pt-md-8 main-head'></div>
            <Container className="mt--7 mb-7" fluid>
                <Box sx={{ position: 'relative', mt: -15, p: 3 }}>
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <Paper elevation={4} sx={{ borderRadius: 4, p: 4 }}>
                            <Box display="flex" alignItems="center" gap={2} mb={3} justifyContent={'end'}>
                                {/* <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                                    <MonetizationOnIcon fontSize="large" />
                                </Avatar>
                                <Box>
                                    <Typography variant="h4" fontWeight={600}>Monthly Pension Details</Typography>
                                    <Typography variant="subtitle1" color="text.secondary">Status: {data?.status}</Typography>
                                </Box> */}
                                <NavLink to={`/pensioner/monthly-pension`}>
                                    <Button
                                        style={{ background: "#004080", color: '#fff' }}
                                        type="button"
                                    >
                                        Back
                                    </Button>
                                </NavLink>
                            </Box>

                            <Section title="Pension Components">
                                <LabelValue label="Basic Pension" value={data?.basic_pension} />
                                <LabelValue label="Additional Pension" value={data?.additional_pension} />
                                <LabelValue label="DR Amount" value={data?.dr_amount} />
                                <LabelValue label="Medical Allowance" value={data?.medical_allowance} />
                                <LabelValue label="Total Arrear" value={data?.total_arrear} />
                                <LabelValue label="Total Pension" value={data?.total_pension} />
                                <LabelValue label="Remarks" value={data?.remarks} />
                            </Section>

                            <Section title="Audit Trail">
                                <LabelValue label="Added By" value={data?.added_by?.name} />
                                <LabelValue label="Edited By" value={data?.edited_by?.name} />
                                <LabelValue label="Created At" value={new Date(data?.created_at).toLocaleString()} />
                                <LabelValue label="Updated At" value={new Date(data?.updated_at).toLocaleString()} />
                            </Section>
                        </Paper>
                    )}
                </Box>
            </Container>
        </>
    );
};

export default ShowMonthlyPension;
