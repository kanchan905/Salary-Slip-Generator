import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Stepper, Step, StepLabel, Button,} from '@mui/material';
import UserCreation from './UserCreation';
import PersonalInfoForm from './PersonalInfoForm';
import PensionAndBenefits from './PensionAndBenefits';
import { nextUserStep, prevUserStep} from '../../redux/slices/memberStoreSlice';
import EmploymentDetails from './EmploymentDetails';
import BankAccountDetails from './BankAccountDetails';
import AdditionalInformation from './AdditionalInformation';
import { Card, CardBody, CardHeader } from 'reactstrap';

const steps = ['User Details', 'Personal Info', 'Employee Detail', ' Pension & Benefits', 'Bank Details', 'Additional'];

const UserCreationStepper = () => {
    const dispatch = useDispatch();
    const { activeStep } = useSelector((state) => state.memeberStore);

    const handleNext = () => dispatch(nextUserStep());
    const handleBack = () => dispatch(prevUserStep());

    const renderStepContent = (step) => {
        switch (step) {
            case 0:
                return <UserCreation onNext={handleNext} />;
            case 1:
                return <PersonalInfoForm onNext={handleNext} />;
            case 2:
                return <EmploymentDetails onNext={handleNext} />;
            case 3:
                return <PensionAndBenefits onNext={handleNext} />
            case 4:
                return <BankAccountDetails onNext={handleNext} />
            case 5:
                return <AdditionalInformation onNext={handleNext} />
            default:
                return null;
        }
    };

    return (
        <>
            <div className='header bg-gradient-info pb-8 pt-8 pt-md-8 main-head'></div>
            <div className="mt--7 mb-7 container-fluid">
                <Card className="card-stats  p-4" >
                    <CardHeader>
                        <Stepper activeStep={activeStep} alternativeLabel>
                            {steps.map((label) => (
                                <Step key={label}><StepLabel>{label}</StepLabel></Step>
                            ))}
                        </Stepper>
                    </CardHeader>
                    <CardBody>
                        <Box sx={{ mt: 4 }}>{renderStepContent(activeStep)}</Box>

                        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                            <Button disabled={activeStep === 0} onClick={handleBack}>Back</Button>
                        </Box>
                    </CardBody>
                </Card>
            </div>
        </>
    );
};

export default UserCreationStepper;
