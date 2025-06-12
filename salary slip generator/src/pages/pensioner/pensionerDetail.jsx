import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    Divider,
    Avatar,
    Paper,
    CircularProgress,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import { showPensioner } from '../../redux/slices/pensionerSlice';
import { NavLink, useParams } from 'react-router-dom';
import { Button, Container } from 'reactstrap';

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

const PensionerDetail = () => {
    const dispatch = useDispatch();
    const { id } = useParams();
    const data = useSelector((state) => state.pensioner.pensioner);
    const { loading } = useSelector((state) => state.pensioner);
    const { name } = useSelector((state) => state.auth.user.role);

    useEffect(() => {
        dispatch(showPensioner(id));
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
                            <Box display="flex" alignItems="center" gap={2} mb={3} justifyContent={'space-between'}>
                                <Box className='d-flex justify-content-between align-items-center'>
                                <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56,marginRight:4 }}>
                                    <PersonIcon fontSize="large" />
                                </Avatar>
                                <Box>
                                    <Typography variant="h4" fontWeight={600}>{data?.first_name} {data?.middle_name} {data?.last_name} </Typography>
                                    <Typography variant="subtitle1" color="text.secondary">PPO No: {data?.ppo_no}</Typography>
                                </Box>
                                </Box>
                                <NavLink to={`/pensioners`}>
                                    <Button
                                        style={{ background: "#004080", color: '#fff' }}
                                        type="button"
                                    >
                                        Back
                                    </Button>
                                </NavLink>
                            </Box>

                            <Section title="Basic Information">
                                <LabelValue label="Type of Pension" value={data?.type_of_pension} />
                                <LabelValue label="Relation" value={data?.relation} />
                                <LabelValue label="Status" value={data?.status} />
                            </Section>

                            <Section title="Dates">
                                <LabelValue label="Date of Birth" value={data?.dob} />
                                <LabelValue label="Date of Joining" value={data?.doj} />
                                <LabelValue label="Date of Retirement" value={data?.dor} />
                                <LabelValue label="Pension End Date" value={data?.end_date} />
                            </Section>

                            <Section title="Financial Details">
                                <LabelValue label="PAN Number" value={data?.pan_number} />
                                <LabelValue label="Pay Level" value={data?.pay_level} />
                                <LabelValue label="Pay Commission" value={data?.pay_commission} />
                                <LabelValue label="Equivalent Level" value={data?.equivalent_level} />
                            </Section>

                            <Section title="Contact Details">
                                <LabelValue label="Mobile Number" value={data?.mobile_no} />
                                <LabelValue label="Email Address" value={data?.email} />
                            </Section>

                            <Section title="Address">
                                <LabelValue
                                    label="Complete Address"
                                    value={`${data?.address}, ${data?.city}, ${data?.state} - ${data?.pin_code}`}
                                />
                            </Section>

                            <Section title="Audit Trail">
                                <LabelValue label="Added By" value={data?.added_by?.name} />
                                <LabelValue label="Edited By" value={data?.edited_by?.name} />
                            </Section>

                        </Paper>
                    )}
                </Box>
            </Container>
        </>
    );
};

export default PensionerDetail;
