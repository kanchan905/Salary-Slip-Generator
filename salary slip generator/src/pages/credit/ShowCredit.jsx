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
import { showCredit } from '../../redux/slices/creditSlice';

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

const ShowCredit = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const data = useSelector((state) => state.societyMember.showcredit[0]); 
  const { loading } = useSelector((state) => state.societyMember);

  useEffect(() => {
    dispatch(showCredit({ id }));
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
                Credit Society Member Detail (ID: {data?.id})
              </Typography>

              <Section title="Membership Info">
                <LabelValue label="Society Name" value={data?.society_name} />
                <LabelValue label="Membership Number" value={data?.membership_number} />
                <LabelValue label="Joining Date" value={data?.joining_date} />
                <LabelValue label="Relieving Date" value={data?.relieving_date} />
                <LabelValue label="Monthly Subscription" value={data?.monthly_subscription} />
                <LabelValue label="Entrance Fee" value={data?.entrance_fee} />
                <LabelValue label="Status" value={data?.is_active ? 'Active' : 'Inactive'} />
                <LabelValue label="Effective From" value={data?.effective_from} />
                <LabelValue label="Effective Till" value={data?.effective_till} />
                <LabelValue label="Remark" value={data?.remark} />
              </Section>

              <Section title="Employee Info">
                <LabelValue label="Employee ID" value={data?.employee?.id} />
                <LabelValue label="Name" value={`${data?.employee?.first_name} ${data?.employee?.last_name}`} />
                <LabelValue label="Gender" value={data?.employee?.gender} />
                <LabelValue label="Email" value={data?.employee?.email} />
                <LabelValue label="Pancard" value={data?.employee?.pancard} />
                <LabelValue label="Institute" value={data?.employee?.institute} />
              </Section>

              <Section title="Audit Trail">
                <LabelValue label="Added By" value={data?.added_by} />
                <LabelValue label="Edited By" value={data?.edited_by ?? '—'} />
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

export default ShowCredit;
