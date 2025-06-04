import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Stepper, Step, StepLabel, Button, Typography, Paper } from '@mui/material';
import UserCreation from './UserCreation';
import PersonalInfoForm from './PersonalInfoForm';
import PensionAndBenefits from './PensionAndBenefits';
import { nextUserStep, prevUserStep, resetUserForm } from '../../redux/slices/memberStoreSlice';
import EmploymentDetails from './EmploymentDetails';
import BankAccountDetails from './BankAccountDetails';
import AdditionalInformation from './AdditionalInformation';

const steps = ['User Details', 'Personal Info', 'Employee Detail', ' Pension & Benefits', 'Bank Details', 'Additional'];

const UserCreationStepper = () => {
    const dispatch = useDispatch();
    const { activeStep} = useSelector((state) => state.memeberStore);

    const handleNext = () => dispatch(nextUserStep());
    const handleBack = () => dispatch(prevUserStep());
    const handleReset = () => dispatch(resetUserForm());

    const renderStepContent = (step) => {
        switch (step) {
            case 0:
                return <UserCreation onNext={handleNext} />;
            case 1:
                return <PersonalInfoForm onNext={handleNext} />;
            case 3:
                return <EmploymentDetails onNext={handleNext} />;
            case 4:
                return <PensionAndBenefits onNext={handleNext} />
            case 5:
                return <BankAccountDetails onNext={handleNext} />
            case 6:
                return <AdditionalInformation onNext={handleNext} />
            default:
                return null;
        }
    };

    return (
        <>
        <div className='header bg-gradient-info pb-8 pt-8 pt-md-8 main-head'></div>
            <Box sx={{ width: '100%', maxWidth: 900, mx: 'auto', mt: 4 }}>
                <Paper sx={{ p: 3 }}>
                    <Typography variant="h5" gutterBottom>User Onboarding</Typography>
                    <Stepper activeStep={activeStep} alternativeLabel>
                        {steps.map((label) => (
                            <Step key={label}><StepLabel>{label}</StepLabel></Step>
                        ))}
                    </Stepper>

                    <Box sx={{ mt: 4 }}>{renderStepContent(activeStep)}</Box>

                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                        <Button disabled={activeStep === 0} onClick={handleBack}>Back</Button>
                    </Box>
                </Paper>
            </Box>
        </>
    );
};

export default UserCreationStepper;
