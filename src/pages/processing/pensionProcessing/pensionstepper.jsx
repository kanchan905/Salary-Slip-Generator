import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Stepper, Step, StepLabel, Button, Typography } from '@mui/material';
import { Card, CardBody, CardHeader } from 'reactstrap';
import { NavLink, useNavigate } from 'react-router-dom';
import PensionMode from './PensionMode';
import MonthlyPension, { getTotalPension, formatCurrency } from 'pages/processing/pensionProcessing/MonthlyPension';
import PensionDeduction from 'pages/processing/pensionProcessing/DeductionPension';
import FinalizePension from 'pages/processing/pensionProcessing/FinalizePension';
import { toast } from 'react-toastify';
import { fetchNetPension } from '../../../redux/slices/netPensionSlice';
import { createMonthlyPension } from '../../../redux/slices/monthlyPensionSlice';
import { fetchPensioners } from '../../../redux/slices/pensionerSlice';
import { createBulkPension } from '../../../redux/slices/bulkSlice';
import dayjs from 'dayjs';
import { nextStep, prevStep, reset, validateStep, updatePensionField, bulkUpdateField } from '../../../redux/slices/pensionSlice';

const steps = [
    'Select Mode',
    'Monthly Pension',
    'Pension Deduction',
    'finalize',
];

const PensionStepper = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [mode, setmode] = useState('');
    const { activeStep, formData, bulkForm } = useSelector((state) => state.pension);
    const pensionersData = useSelector((state) => state.pensioner.pensioners);
    const { netPension } = useSelector((state) => state.netPension);

    useEffect(() => {
        dispatch(fetchPensioners({ page: 1, limit: 1000, id: '', search: '' }));
        dispatch(fetchNetPension({ page: 1, limit: 1000, month: '' ,year: '', ppo_no: '', user_id: ''}));
    }, [dispatch])


    const handleNext = () => {
        if (activeStep === 0 && mode == 'bulk') {
            handleSubmit();
            return;
        }
        else {
            const result = validateStep({ formData, activeStep });
            if (!result.valid) {
                toast.error(result.message);
                return;
            }

            if (activeStep === 1 && mode === 'individual') {
                const isDuplicate = netPension?.some(
                    slip =>
                        String(slip.month) === String(formData.month) &&
                        String(slip.year) === String(formData.year) &&
                        String(slip.pensioner_id) === String(formData.pensioner_id)
                );

                if (isDuplicate) {
                    toast.error('A payslip for this pensioner for the selected month and year already exists.');
                    return;
                }
            }

            if (mode == 'individual') {
                dispatch(nextStep());
            }
        }
    };

    const handleSubmit = async (e) => {
        if (e && e.preventDefault) e.preventDefault();

        try {
            if (mode === 'bulk') {
                const { month, year } = bulkForm;
                await dispatch(createBulkPension(bulkForm)).unwrap()
                    .then(() => {
                        toast.success('Bulk Pension submitted successfully!');
                        dispatch(reset());
                        navigate(`/net-pension?month=${month}&year=${year}`)
                    })
                    .catch((err) => {
                        const apiMsg = err?.data?.message || err?.message || err?.errorMsg || 'Failed to submit bulk pension.';
                        toast.error(apiMsg);
                    });

            } else {
                dispatch(createMonthlyPension(formData)).unwrap()
                    .then((res) => {
                        toast.success('Pension created');
                    })
                    .catch((err) => {
                        const apiMsg =
                            err?.response?.data?.message ||
                            err?.errorMsg ||
                            err?.message || 'Failed to save';
                        toast.error(apiMsg);
                    })
                dispatch(reset());
            }
        } catch (error) {
            toast.error('Failed to submit Pension.', error);
        }
    };




    const renderStepContent = (step) => {
        switch (step) {
            case 0: return <PensionMode onNext={handleNext} setmode={setmode} mode={mode} />;
            case 1: return <MonthlyPension onNext={handleNext} setmode={setmode} mode={mode} pensioners={pensionersData} />;
            case 2: return <PensionDeduction onNext={handleNext} />;
            case 3: return <FinalizePension onNext={handleNext} />;
            default: return null;
        }
    };

    return (
        <>
            <div className='header container-fluid bg-gradient-info pb-8 pt-8 pt-md-8 main-head d-flex align-items-center justify-content-between'>
                <Typography variant='h3' color='white'>Create Pension</Typography>
            </div>
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
                            <Button disabled={activeStep === 0} onClick={() => dispatch(prevStep())}>
                                Back
                            </Button>
                            <Button
                                variant="contained"
                                disabled={activeStep === 0 && !mode}
                                onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
                            >
                                {activeStep === steps.length - 1 ? 'Submit' : 'Next'}
                            </Button>

                        </Box>
                    </CardBody>
                </Card >
            </div>
        </>
    );
};

export default PensionStepper;
