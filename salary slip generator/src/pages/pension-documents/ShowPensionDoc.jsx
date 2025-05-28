import React, { useEffect } from 'react';
import {
    Box, Typography, Grid, Paper, Divider, Chip, CircularProgress, Button
} from '@mui/material';
import { Container } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { showPensionDocument } from '../../redux/slices/pensionDocumentSlice';

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

const ShowPensionDoc = () => {
    const dispatch = useDispatch();
    const { id } = useParams();
    const { showdocument, loading } = useSelector((state) => state.pensionDocument);


    useEffect(() => {
        dispatch(showPensionDocument({ id }));
    }, [dispatch, id]);

    return (
        <>
            <div className='header bg-gradient-info pb-8 pt-8 pt-md-8 main-head'></div>
            <Container className="mt--7 mb-7" fluid>
                <Box sx={{ position: 'relative', mt: -15, p: 3 }}>
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <Paper elevation={4} sx={{ borderRadius: 4, p: 4 }}>
                            <Typography variant="h4" fontWeight={600} mb={3}>
                                Pension Document Detail (ID: {showdocument?.id})
                            </Typography>

                            <Section title="Document Info">
                                <LabelValue label="Pensioner ID" value={showdocument?.pensioner_id} />
                                <LabelValue label="Document Type" value={showdocument?.document_type} />
                                <LabelValue label="Document Number" value={showdocument?.document_number} />
                                <LabelValue label="Issue Date" value={showdocument?.issue_date} />
                                <LabelValue label="Expiry Date" value={showdocument?.expiry_date} />
                                <LabelValue label="Upload Date" value={showdocument?.upload_date} />
                                <LabelValue
                                    label="File"
                                    value={
                                        showdocument?.file_path
                                            ? (
                                                <a
                                                    href={`${process.env.REACT_APP_IMAGE_FILAPI}/${showdocument.file_path}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    View Document
                                                </a>
                                            )
                                            : '—'
                                    }
                                />
                            </Section>

                            <Section title="Audit Info">
                                <LabelValue label="Added By" value={showdocument?.added_by?.name} />
                                <LabelValue label="Edited By" value={showdocument?.edited_by?.name || '—'} />
                                <LabelValue label="Created At" value={new Date(showdocument?.created_at).toLocaleString()} />
                                <LabelValue label="Updated At" value={new Date(showdocument?.updated_at).toLocaleString()} />
                            </Section>
                        </Paper>
                    )}
                </Box>
            </Container>
        </>
    );
};

export default ShowPensionDoc;
