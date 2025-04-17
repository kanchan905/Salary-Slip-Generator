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
    'Salary Components',
    'Deductions',
    'Finalize & Approve',
    'Process Arrears',
];

const SalaryProcessing = () => {
    const slipRef = useRef();
    const [activeStep, setActiveStep] = useState(0);
    const [formData, setFormData] = useState({
        mode: 'bulk',
        month: '',
        year: '',
        employeeId: '',
        basic: 0,
        hra: 0,
        da: 0,
        otherAllowances: 0,
        pf: 0,
        tax: 0,
        approved: false,
        arrears: 0,
    });

    const grossSalary =
        Number(formData.basic || 0) +
        Number(formData.hra || 0) +
        Number(formData.da || 0) +
        Number(formData.otherAllowances || 0) +
        Number(formData.arrears || 0);

    const totalDeductions =
        Number(formData.pf || 0) +
        Number(formData.tax || 0);

    const netPay = grossSalary - totalDeductions;

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
            [name]: ['arrears', 'basic', 'hra', 'da', 'otherAllowances', 'pf', 'tax'].includes(name)
                ? Number(value) || 0
                : value,
        }));
    };

    const handlePrint = useReactToPrint({
        content: () => slipRef.current,
        documentTitle: `SalarySlip_${formData.employeeId || 'Bulk'}_${formData.month}`,
    });

    const renderStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Mode</InputLabel>
                                <Select name="mode" value={formData.mode} onChange={handleChange}>
                                    <MenuItem value="bulk">Bulk Salary Processing</MenuItem>
                                    <MenuItem value="individual">Individual Salary Processing</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        {formData.mode === 'bulk' ? (
                            <>
                                <Grid item xs={6}>
                                    <TextField name="month" label="Month" fullWidth onChange={handleChange} />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField name="year" label="Year" fullWidth onChange={handleChange} />
                                </Grid>
                            </>
                        ) : (
                            <Grid item xs={12}>
                                <TextField
                                    name="employeeId"
                                    label="Employee ID"
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
                        <Grid item xs={6}>
                            <TextField name="basic" label="Basic Pay" fullWidth onChange={handleChange} />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField name="hra" label="HRA" fullWidth onChange={handleChange} />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField name="da" label="DA" fullWidth onChange={handleChange} />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField name="otherAllowances" label="Other Allowances" fullWidth onChange={handleChange} />
                        </Grid>
                    </Grid>
                );

            case 2:
                return (
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <TextField name="pf" label="Provident Fund" fullWidth onChange={handleChange} />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField name="tax" label="Tax" fullWidth onChange={handleChange} />
                        </Grid>
                    </Grid>
                );

            case 3:
                return (
                    <Box>
                        <Typography variant="h6" mb={2}>Salary Slip Preview</Typography>
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
                                Salary Slip
                            </Typography>

                            <Grid container justifyContent="space-between" sx={{ mb: 1 }}>
                                <Grid item>Employee: {formData.employeeId || 'N/A'}</Grid>
                                <Grid item>Generated On: {new Date().toLocaleDateString()}</Grid>
                            </Grid>
                            <Typography>Month: {formData.month}</Typography>

                            <Grid container spacing={3} mt={2}>
                                <Grid item xs={6}>
                                    <Typography fontWeight="bold">Earnings</Typography>
                                    <div>Basic: ₹{formData.basic || 0}</div>
                                    <div>Da: ₹{formData.da || 0}</div>
                                    <div>Hra: ₹{formData.hra || 0}</div>
                                    <div>Ta: ₹0</div>
                                    <div>Other: ₹{formData.otherAllowances || 0}</div>
                                    <div style={{ marginTop: 5 }}>Gross Salary: ₹{grossSalary}</div>
                                </Grid>

                                <Grid item xs={6}>
                                    <Typography fontWeight="bold">Deductions</Typography>
                                    <div>Gpf: ₹0</div>
                                    <div>Nps: ₹0</div>
                                    <div>IncomeTax: ₹{formData.tax || 0}</div>
                                    <div>ProfTax: ₹0</div>
                                    <div>Other: ₹0</div>
                                    <div style={{ marginTop: 5 }}>Total Deductions: ₹{totalDeductions}</div>
                                </Grid>
                            </Grid>

                            <Typography align="right" mt={2} fontWeight="bold">
                                Net Pay: ₹{netPay}
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
            <div className='header bg-gradient-info pb-8 pt-8 pt-md-8'></div>
            <Box sx={{ width: '80%', margin: 'auto', mt: 8, mb: 8 }}>
                <Typography variant="h5" gutterBottom fontWeight="bold">
                    💼 Salary Processing
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
                        <Button variant="contained" onClick={handleNext}>
                            Next
                        </Button>
                    ) : (
                        <Button variant="contained" color="primary" onClick={() => alert('Salary Processed!')}>
                            Finish
                        </Button>
                    )}
                </Box>
            </Box>
        </>
    );
};

export default SalaryProcessing;