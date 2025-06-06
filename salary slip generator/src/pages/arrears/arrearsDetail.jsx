import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box,
    Typography,
    Grid,
    Paper,
    Divider,
    CircularProgress,
} from '@mui/material';
import { NavLink, useParams } from 'react-router-dom';
import { Button, Container } from 'reactstrap';
import { showArrear } from '../../redux/slices/arrearsSlice';

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

const ArrearsDetail = () => {
    const dispatch = useDispatch();
    const { id } = useParams();
    const data = useSelector((state) => state.arrears.arrear[0]);
    const { loading } = useSelector((state) => state.arrears);
    const { name } = useSelector((state) => state.auth.user.role);

    useEffect(() => {
        dispatch(showArrear(id));
    }, [dispatch]);

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
                            <div className='d-flex justify-content-between align-items-center'>
                                <Typography variant="h4" fontWeight={600} >
                                    Arrear Details (Pensioner ID: {data?.pensioner_id})
                                </Typography>

                                <NavLink to={`/${name.toLowerCase()}/arrears`}>
                                    <Button
                                        style={{ background: "#004080", color: '#fff' }}
                                        type="button"
                                    >
                                        Back
                                    </Button>
                                </NavLink>
                            </div>

                            <Section title="Arrear Period">
                                <LabelValue label="From Month" value={data?.from_month} />
                                <LabelValue label="To Month" value={data?.to_month} />
                                <LabelValue label="Payment Month" value={data?.payment_month} />
                            </Section>

                            <Section title="Arrear Amounts">
                                <LabelValue label="Basic Arrear" value={data?.basic_arrear} />
                                <LabelValue label="Additional Arrear" value={data?.additional_arrear} />
                                <LabelValue label="DR Percentage" value={data?.dr_percentage} />
                                <LabelValue label="DR Arrear" value={data?.dr_arrear} />
                                <LabelValue label="Total Arrear" value={data?.total_arrear} />
                            </Section>

                            <Section title="Remarks">
                                <LabelValue label="Remarks" value={data?.remarks} />
                            </Section>

                            <Section title="Audit Trail">
                                <LabelValue label="Added By" value={data?.added_by?.name} />
                                <LabelValue label="Edited By" value={data?.edited_by?.name} />
                                <LabelValue label="Created At" value={data?.created_at ? new Date(data.created_at).toLocaleString() : '—'} />
                                <LabelValue label="Updated At" value={data?.updated_at ? new Date(data.updated_at).toLocaleString() : '—'} />
                            </Section>
                        </Paper>
                    )}
                </Box>
            </Container>
        </>
    );
};

export default ArrearsDetail;