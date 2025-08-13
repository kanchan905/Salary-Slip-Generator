import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Stepper, Step, StepLabel, Button, Typography } from '@mui/material';
import UserCreation from './UserCreation';
import PensionAndBenefits from './PensionAndBenefits';
import { nextUserStep, prevUserStep, initialState, updateEmployeeFormFields, resetemployeeForm } from '../../redux/slices/memberStoreSlice';
import EmploymentDetails from './EmploymentDetails';
import BankAccountDetails from './BankAccountDetails';
import AdditionalInformation from './AdditionalInformation';
import { Card, CardBody, CardHeader } from 'reactstrap';
import { NavLink, useNavigate } from 'react-router-dom';
import { storeEmployee } from '../../redux/slices/employeeSlice';
import { toast } from 'react-toastify';

const steps = ['User Details', 'Employee Detail', 'Allowance & Benefits', 'Bank Details', 'Additional'];

const UserCreationStepper = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { activeStep } = useSelector((state) => state.memeberStore);
    // Use local state for the whole form
    const [formState, setFormState] = useState(initialState.employeeForm);
    // Ref to access current step's save method
    const stepRef = useRef();

    // Move to next step and update form state
    const handleNext = (stepValues) => {
        setFormState(prev => ({ ...prev, ...stepValues }));
        dispatch(nextUserStep());
    };
    // Move to previous step, but first save current values
    const handleBack = async () => {
        if (stepRef.current && stepRef.current.saveCurrentValues) {
            const currentValues = await stepRef.current.saveCurrentValues();
            setFormState(prev => ({ ...prev, ...currentValues }));
        }
        dispatch(prevUserStep());
    };

    // On final submit, update Redux and reset, and actually create the employee
    const handleSubmitAll = async (finalValues) => {
        try {
            const allValues = { ...formState, ...finalValues };
            setFormState(allValues);
            // Actually create the employee
            const result = await dispatch(storeEmployee(allValues)).unwrap();
            toast.success(result?.successMsg || 'Employee Added Successfully');
            dispatch(resetemployeeForm());
            navigate('/employee-management');
        } catch (err) {
            toast.error(
                err?.data?.message ||
                err?.response?.data?.message ||
                err?.errorMsg ||
                err?.message ||
                'Failed to add employee'
            );
        }
    };

    const renderStepContent = (step) => {
        switch (step) {
            case 0:
                return <UserCreation ref={stepRef} values={formState} onNext={handleNext} />;
            case 1:
                return <EmploymentDetails ref={stepRef} values={formState} onNext={handleNext} />;
            case 2:
                return <PensionAndBenefits ref={stepRef} values={formState} onNext={handleNext} />;
            case 3:
                return <BankAccountDetails ref={stepRef} values={formState} onNext={handleNext} />;
            case 4:
                return <AdditionalInformation ref={stepRef} values={formState} onSubmitAll={handleSubmitAll} />;
            default:
                return null;
        }
    };

    return (
        <>
            <div className='header container-fluid bg-gradient-info pb-8 pt-8 pt-md-8 main-head d-flex align-items-center justify-content-between' >
                <Typography variant='h3' color='white'>Create Employee</Typography>
                <NavLink to="/employee-management" className="btn btn-white">Back</NavLink>
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
                </Card>
            </div>
        </>
    );
};

export default UserCreationStepper;
