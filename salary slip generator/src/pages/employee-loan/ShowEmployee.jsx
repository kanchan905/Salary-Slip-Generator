import React, { useEffect} from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Divider,
  CircularProgress,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, NavLink } from 'react-router-dom';
import { Button, Container } from 'reactstrap';
import { showEmployeeLoan } from '../../redux/slices/employeeLoanSlice';

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

const ShowEmployee = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const data = useSelector((state) => state.employeeLoan.showloan[0]);
  const { loading } = useSelector((state) => state.employeeLoan);
  const { name } = useSelector((state) => state.auth.user.role);

  useEffect(() => {
    dispatch(showEmployeeLoan({ id }));
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
                  Employee Loan Detail
                </Typography>
                <NavLink to={`/employee-loan`}>
                  <Button
                    style={{ background: "#004080", color: '#fff' }}
                    type="button"
                  >
                    Back
                  </Button>
                </NavLink>
              </div>

              <Section title="Loan Information">
                <LabelValue label="Loan Type" value={data?.loan_type} />
                <LabelValue label="Loan Amount" value={data?.loan_amount} />
                <LabelValue label="Interest Rate" value={data?.interest_rate} />
                <LabelValue label="Sanctioned Date" value={data?.sanctioned_date} />
                <LabelValue label="Total Installments" value={data?.total_installments} />
                <LabelValue label="Current Installment" value={data?.current_installment} />
                <LabelValue label="Remaining Balance" value={data?.remaining_balance} />
                <LabelValue label="Is Active" value={data?.is_active ? 'Active' : 'Inactive'} />
              </Section>

              <Section title="Employee Information">
                <LabelValue label="Name" value={`${data?.employee?.first_name} ${data?.employee?.middle_name} ${data?.employee?.middle_name} ${data?.employee?.last_name}`} />
                <LabelValue label="Gender" value={data?.employee?.gender} />
                <LabelValue label="Email" value={data?.employee?.email} />
                <LabelValue label="DOB" value={data?.employee?.date_of_birth} />
                <LabelValue label="Institute" value={data?.employee?.institute} />
                <LabelValue label="Pension Scheme" value={data?.employee?.pension_scheme} />
                <LabelValue label="PWD Status" value={data?.employee?.pwd_status ? 'Yes' : 'No'} />
                <LabelValue label="HRA Eligibility" value={data?.employee?.hra_eligibility ? 'Yes' : 'No'} />
                <LabelValue label="NPA Eligibility" value={data?.employee?.npa_eligibility ? 'Yes' : 'No'} />
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

export default ShowEmployee;
