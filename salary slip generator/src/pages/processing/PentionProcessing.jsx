import React, { useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import {
    Box,
    Button,
    Stepper,
    Step,
    StepLabel,
    Typography,
    TextField,
    Grid,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
} from '@mui/material';

const steps = [
    'Select Mode',
    'Pension Details',
    'Deductions',
    'Approve Pension',
    'Process Arrears',
];

const PensionProcessing = () => {
    const slipRef = useRef();
    const [activeStep, setActiveStep] = useState(0);
    const [formData, setFormData] = useState({
        mode: 'bulk',
        month: '',
        year: '',
        pensionerId: '',
        basicPension: 0,
        dr: 0,
        otherAllowances: 0,
        deductions: 0,
        approved: false,
        arrears: 0,
    });

    const grossPension =
        Number(formData.basicPension || 0) +
        Number(formData.dr || 0) +
        Number(formData.otherAllowances || 0) +
        Number(formData.arrears || 0);

    const netPension = grossPension - Number(formData.deductions || 0);

    const handleNext = () => {
        if (activeStep < steps.length - 1) {
            setActiveStep((prev) => prev + 1);
        }
    };

    const handleBack = () => {
        if (activeStep > 0) {
            setActiveStep((prev) => prev - 1);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: ['basicPension', 'dr', 'otherAllowances', 'deductions', 'arrears'].includes(name)
                ? Number(value) || 0
                : value,
        }));
    };

    const handlePrint = useReactToPrint({
        content: () => slipRef.current,
        documentTitle: `PensionSlip_${formData.pensionerId || 'Bulk'}_${formData.month}`,
    });

    const renderStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <Grid container spacing={2}>
                        <Grid size={{xs:12}}>
                            <FormControl fullWidth>
                                <InputLabel>Mode</InputLabel>
                                <Select name="mode" value={formData.mode} onChange={handleChange}>
                                    <MenuItem value="bulk">Bulk Pension Processing</MenuItem>
                                    <MenuItem value="individual">Individual Pension Processing</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        {formData.mode === 'bulk' ? (
                            <>
                                <Grid size={{xs:6}}>
                                    <TextField name="month" label="Month" value={new Date().getMonth()} fullWidth onChange={handleChange} />
                                </Grid>
                                <Grid size={{xs:6}}>
                                    <TextField name="year" label="Year" value={new Date().getFullYear()} fullWidth onChange={handleChange} />
                                </Grid>
                            </>
                        ) : (
                            <Grid size={{xs:6}}>
                                <TextField
                                    name="pensionerId"
                                    label="Pensioner ID"
                                    fullWidth
                                    onChange={handleChange}
                                />
                            </Grid>
                        )}
                    </Grid>
                );

            case 1:
                return (
                    <Grid container spacing={2}>
                        <Grid size={{xs:12}}>
                            <TextField name="basicPension" label="Basic Pension" fullWidth onChange={handleChange} />
                        </Grid>
                        <Grid size={{xs:12}}>
                            <TextField name="dr" label="DR (Dearness Relief)" fullWidth onChange={handleChange} />
                        </Grid>
                        <Grid size={{xs:12}}>
                            <TextField name="otherAllowances" label="Other Allowances" fullWidth onChange={handleChange} />
                        </Grid>
                    </Grid>
                );

            case 2:
                return (
                    <TextField
                        name="deductions"
                        label="Total Deductions"
                        fullWidth
                        onChange={handleChange}
                    />
                );

            case 3:
                return (
                    <Box>
                        <Typography variant="h6" mb={2}>Pension Slip Preview</Typography>
                        <Box
                            ref={slipRef}
                            sx={{
                                border: '1px solid #000',
                                borderRadius: '10px',
                                p: 3,
                                background: '#f5f5f5',
                            }}
                        >
                            <Typography align="center" fontWeight="bold" variant="h6">
                                Pension Slip
                            </Typography>

                            <Grid container justifyContent="space-between" sx={{ mb: 1 }}>
                                <Grid>Pensioner: {formData.pensionerId || 'N/A'}</Grid>
                                <Grid>Generated On: {new Date().toLocaleDateString()}</Grid>
                            </Grid>
                            <Typography>Month: {formData.month}</Typography>

                            <Grid container spacing={3} mt={2}>
                                <Grid size={{xs:6}}>
                                    <Typography fontWeight="bold">Earnings</Typography>
                                    <div>Basic Pension: ₹{formData.basicPension}</div>
                                    <div>DR: ₹{formData.dr}</div>
                                    <div>Other Allowances: ₹{formData.otherAllowances}</div>
                                    <div style={{ marginTop: 5 }}>Gross Pension: ₹{grossPension}</div>
                                </Grid>

                                <Grid size={{xs:6}}>
                                    <Typography fontWeight="bold">Deductions</Typography>
                                    <div>Total Deductions: ₹{formData.deductions}</div>
                                </Grid>
                            </Grid>

                            <Typography align="right" mt={2} fontWeight="bold">
                                Net Pension: ₹{netPension}
                            </Typography>
                        </Box>

                        <Button variant="contained" color="success" sx={{ mt: 2 }} onClick={handlePrint}>
                            Download PDF
                        </Button>
                    </Box>
                );

            case 4:
                return (
                    <TextField
                        name="arrears"
                        label="Arrears Amount"
                        fullWidth
                        onChange={handleChange}
                    />
                );

            default:
                return 'Unknown Step';
        }
    };

    return (
        <>
            <div className='header bg-gradient-info pb-8 pt-8 pt-md-8 main-head'></div>
            <Box sx={{ width: '80%', margin: 'auto', mt: 8, mb: 8 }}>
                <Typography variant="h5" gutterBottom fontWeight="bold">
                    🧓 Pension Processing
                </Typography>
                <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>

                <Box sx={{ mb: 3 }}>{renderStepContent(activeStep)}</Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button disabled={activeStep === 0} onClick={handleBack}>
                        Back
                    </Button>
                    {activeStep < steps.length - 1 ? (
                        <Button
                        className='btn text-white'
                        style={{background:'#004080'}}
                         onClick={handleNext}>
                            Next
                        </Button>
                    ) : (
                        <Button variant="contained" color="primary" onClick={() => alert('Pension Processed!')}>
                            Finish
                        </Button>
                    )}
                </Box>
            </Box>
        </>
    );
};

export default PensionProcessing;
