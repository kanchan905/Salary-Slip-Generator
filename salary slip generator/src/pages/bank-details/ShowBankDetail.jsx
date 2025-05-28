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
import { useParams } from 'react-router-dom';
import { Container } from 'reactstrap';
import { showBankDetail } from '../../redux/slices/bankSlice';

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

const ShowBankDetail = () => {
    const dispatch = useDispatch();
    const { id } = useParams();
    const data = useSelector((state) => state.bankdetail.showBank); 
    const { loading } = useSelector((state) => state.bankdetail);

    useEffect(() => {
        dispatch(showBankDetail(id));
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
                            <Typography variant="h4" fontWeight={600} mb={3}>
                                Bank Details (Pensioner ID: {data?.pensioner_id})
                            </Typography>

                            <Section title="Bank Information">
                                <LabelValue label="Bank Name" value={data?.bank_name} />
                                <LabelValue label="Branch Name" value={data?.branch_name} />
                                <LabelValue label="Account Number" value={data?.account_no} />
                                <LabelValue label="IFSC Code" value={data?.ifsc_code} />
                                <LabelValue label="Is Active" value={data?.is_active ? 'Yes' : 'No'} />
                            </Section>

                            <Section title="Audit Trail">
                                <LabelValue label="Added By" value={data?.added_by} />
                                <LabelValue label="Edited By" value={data?.edited_by} />
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

export default ShowBankDetail;