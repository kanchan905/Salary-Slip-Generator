import React, { useEffect } from 'react';
import {
  Box, Typography, Grid, Paper, Divider, CircularProgress, Button
} from '@mui/material';
import { Container } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useParams } from 'react-router-dom';
import { ShowPensionRelated } from '../../redux/slices/pensionRelatedSlice';

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

const ShowPensionerRelatedInfo = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { pensionRelated, loading } = useSelector((state) => state.info);
  const record = pensionRelated.find((r) => r.id === parseInt(id));

  useEffect(() => {
    if (!record) dispatch(ShowPensionRelated(id));
  }, [dispatch, id, record]);

  return (
    <>
      <div className='header bg-gradient-info pb-8 pt-8 pt-md-8 main-head'></div>
      <Container className="mt--7 mb-7" fluid>
        <Box sx={{ position: 'relative', mt: -15, p: 3 }}>
          {loading || !record ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Paper elevation={4} sx={{ borderRadius: 4, p: 4 }}>
              <div className='d-flex justify-content-between align-items-center'>
                <Typography variant="h4" fontWeight={600} mb={3}>
                  Pensioner Related Info (ID: {record.id})
                </Typography>
                <NavLink to={`/pension-related-info`}>
                  <Button
                    style={{ background: "#004080", color: '#fff' }}
                    type="button"
                  >
                    Back
                  </Button>
                </NavLink>
              </div>

              <Section title="Pension Details">
                <LabelValue label="Pensioner ID" value={record.pensioner_id} />
                <LabelValue label="Basic Pension" value={record.basic_pension} />
                <LabelValue label="Commutation Amount" value={record.commutation_amount} />
                <LabelValue label="Additional Pension" value={record.additional_pension} />
                <LabelValue label="Medical Allowance" value={record.medical_allowance} />
                <LabelValue label="Total Arrear" value={record.total_arrear} />
                <LabelValue label="Effective From" value={record.effective_from} />
                <LabelValue label="Effective Till" value={record.effective_till || '—'} />
                <LabelValue label="Remarks" value={record.remarks} />
                <LabelValue label="Status" value={record.is_active ? 'Active' : 'Inactive'} />
              </Section>

              <Section title="Audit Info">
                <LabelValue label="Added By" value={record.added_by?.first_name || '—'} />
                <LabelValue label="Edited By" value={record.edited_by?.first_name || '—'} />
                <LabelValue label="Created At" value={new Date(record.created_at).toLocaleString()} />
                <LabelValue label="Updated At" value={new Date(record.updated_at).toLocaleString()} />
              </Section>
            </Paper>
          )}
        </Box>
      </Container>
    </>
  );
};

export default ShowPensionerRelatedInfo;
