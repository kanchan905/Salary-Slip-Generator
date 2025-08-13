import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Stepper, Step, StepLabel, Button, Typography } from '@mui/material';
import { nextPensionerStep, prevPensionerStep } from '../../redux/slices/pensionerStoreSlice';
import PensionerPersonalDetails from './PensionerPersonalDetails';
import PensionerServiceDetails from './PensionerServiceDetails';
import PensionerBankDetails from './pensionerBankDetails';
import PensionPayDetails from './PensionPayDetails';
import PensionerContactAddress from './PensionerContactAddress';
import { Card, CardBody, CardHeader } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import PensionerInfoDetails from './PensionerInfoDetails';

const steps = [
  'Personal Details',
  'Service Details',
  'Pension & Pay Details',
  'Contact & Address Details',
  'Bank Details',
  'Additional Info',
];

const PensionerStepper = () => {
  const dispatch = useDispatch();
  const { activeStep } = useSelector((state) => state.pensionerStore);

  const handleNext = () => dispatch(nextPensionerStep());
  const handleBack = () => dispatch(prevPensionerStep());

  const renderStepContent = (step) => {
    switch (step) {
      case 0: return <PensionerPersonalDetails onNext={handleNext} />;
      case 1: return <PensionerServiceDetails onNext={handleNext} />;
      case 2: return <PensionPayDetails onNext={handleNext} />;
      case 3: return <PensionerContactAddress onNext={handleNext} />;
      case 4:  return <PensionerBankDetails onNext={handleNext}/>;
      case 5: return <PensionerInfoDetails onNext={handleNext}/>;
      default: return null;
    }
  };

  return (
    <>
      <div className='header container-fluid bg-gradient-info pb-8 pt-8 pt-md-8 main-head d-flex align-items-center justify-content-between'>
        <Typography variant='h3' color='white'>Create Pensioner</Typography>
        <NavLink to="/pensioners" className="btn btn-white">Back</NavLink>
      </div>
      <div className="mt--7 mb-7 container-fluid">
        <Card className="card-stats  p-4" >
          <CardHeader>
            <div className="responsive-stepper" style={{ overflowX: 'auto', width: '100%' }}>
              <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((label) => (
                  <Step key={label}><StepLabel>{label}</StepLabel></Step>
                ))}
              </Stepper>
            </div>
          </CardHeader>
          <CardBody>
            <Box sx={{ mt: 4 }}>{renderStepContent(activeStep)}</Box>

            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
              <Button disabled={activeStep === 0} onClick={handleBack}>Back</Button>
            </Box>
          </CardBody>
        </Card >
      </div>
    </>
  );
};

export default PensionerStepper;
