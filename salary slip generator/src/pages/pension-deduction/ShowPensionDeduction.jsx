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
import { showDeduction } from '../../redux/slices/deductionSlice';

const LabelValue = ({ label, value }) => (
    <Grid item xs={12} sm={6} md={4}>
        <Typography variant="subtitle2" color="text.secondary">{label}</Typography>
        <Typography variant="body1" fontWeight={500}>{value || '—'}</Typography>
    </Grid>
);

const Section = ({ title, children }) => (
    <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>{title}</Typography>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={3}>{children}</Grid>
    </Box>
);

const ShowPensionDeduction = () => {
    const dispatch = useDispatch();
    const { id } = useParams();
    const { deduction, loading } = useSelector((state) => state.deduction);
    const { name } = useSelector((state) => state.auth.user.role);

    useEffect(() => {
        dispatch(showDeduction(id));
    }, [dispatch, id]);

    console.log(deduction)
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
                                {/* <div className='d-flex justify-content-between align-items-center'>
                                    <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                                        <MonetizationOnIcon fontSize="large" />
                                    </Avatar>
                                    <Box>
                                        <Typography variant="h4" fontWeight={600}>{deduction?.net_pension?.pensioner?.first_name}</Typography>
                                        <Typography variant="subtitle1" color="text.secondary">PPO No: {deduction?.net_pension?.pensioner?.ppo_no}</Typography>
                                    </Box>
                                </div> */}
                                <NavLink to={`/pensioner/pension-deduction`}>
                                    <Button
                                        style={{ background: "#004080", color: '#fff' }}
                                        type="button"
                                    >
                                        Back
                                    </Button>
                                </NavLink>
                            </Box>

                            <Section title="Deduction Breakdown">
                                <LabelValue label="Commutation Amount" value={deduction?.commutation_amount} />
                                <LabelValue label="Income Tax" value={deduction?.income_tax} />
                                <LabelValue label="Recovery" value={deduction?.recovery} />
                                <LabelValue label="Other Deductions" value={deduction?.other} />
                                <LabelValue label="Total Amount" value={deduction?.amount} />
                                <LabelValue label="Description" value={deduction?.description} />
                            </Section>

                            <Section title="Audit Trail">
                                <LabelValue label="Added By" value={deduction?.added_by?.name} />
                                <LabelValue label="Edited By" value={deduction?.edited_by?.name} />
                                <LabelValue label="Created At" value={new Date(deduction?.created_at).toLocaleString()} />
                                <LabelValue label="Updated At" value={new Date(deduction?.updated_at).toLocaleString()} />
                            </Section>
                        </Paper>
                    )}
                </Box>
            </Container>
        </>
    );
};

export default ShowPensionDeduction;
