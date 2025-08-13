import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box,
    Typography,
    Grid,
    Divider,
    Paper,
    CircularProgress,
} from '@mui/material';
import { NavLink, useParams } from 'react-router-dom';
import { Button, Container } from 'reactstrap';
import { showDeduction } from '../../redux/slices/deductionSlice';

const LabelValue = ({ label, value }) => (
    <Grid item xs={12} sm={6} md={4}>
        <Typography variant="subtitle2" color="text.secondary">{label}</Typography>
        <Typography variant="body1"  className="text-capitalize" fontWeight={500}>{value || '—'}</Typography>
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
    const { name } = useSelector((state) => state.auth.user.roles[0]);

    useEffect(() => {
        dispatch(showDeduction(id));
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
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <Typography variant="h4" fontWeight={600}>
                                    Pension Deduction Detail
                                </Typography>
                                <NavLink to={`/pensioner/pension-deduction`}>
                                    <Button
                                    style={{ background: "#004080", color: '#fff' }}
                                    type="button"
                                    >
                                    Back
                                    </Button>
                                </NavLink>
                            </div>
                            
                            <Section title="Pension Details">
                                <LabelValue label="Emp. Code" value={deduction?.net_pension?.pensioner?.employee?.employee_code || "- -"} />
                                <LabelValue label="PPO No." value={deduction?.net_pension?.pensioner?.ppo_no || "- -"} />
                                <LabelValue label="Pensioner Name" value={deduction?.net_pension?.pensioner?.name || "NA"} />
                            </Section>

                            <Section title="Deduction Breakdown">
                                <LabelValue label="Commutation Amount" value={deduction?.commutation_amount} />
                                <LabelValue label="Income Tax" value={deduction?.income_tax} />
                                <LabelValue label="Recovery" value={deduction?.recovery} />
                                <LabelValue label="Other Deductions" value={deduction?.other} />
                                <LabelValue label="Total Deduction" value={deduction?.amount} />
                                <LabelValue label="Description" value={deduction?.description} />
                            </Section>

                            <Section title="Audit Trail">
                                <LabelValue label="Added By" value={deduction?.added_by?.roles?.[0]?.name || "NA"} />
                                <LabelValue label="Edited By" value={deduction?.edited_by?.roles?.[0]?.name || "NA"} />
                            </Section>
                        </Paper>
                    )}
                </Box>
            </Container>
        </>
    );
};

export default ShowPensionDeduction;
