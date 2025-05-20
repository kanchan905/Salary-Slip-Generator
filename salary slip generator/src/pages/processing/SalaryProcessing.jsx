import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useReactToPrint } from 'react-to-print';
import {
    nextStep,
    prevStep,
    updateField
} from '../../redux/slices/salarySlice';
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
import { Alert } from 'reactstrap';
import { fetchEmployeeBankdetail, fetchEmployees } from '../../redux/slices/employeeSlice';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const months = [
    { value: 'January', label: 'January' },
    { value: 'February', label: 'February' },
    { value: 'March', label: 'March' },
    { value: 'April', label: 'April' },
    { value: 'May', label: 'May' },
    { value: 'June', label: 'June' },
    { value: 'July', label: 'July' },
    { value: 'August', label: 'August' },
    { value: 'September', label: 'September' },
    { value: 'October', label: 'October' },
    { value: 'November', label: 'November' },
    { value: 'December', label: 'December' },
];
const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map((year) => ({
    value: year,
    label: year,
}));


const steps = [
    'Select Mode',
    'Employee Detail',
    'Deduction',
    'Finalize & Approve',
    'Process Arrears',
];

const SalaryProcessing = () => {
    const slipRef = useRef(null);
    const dispatch = useDispatch();
    const { activeStep, formData } = useSelector((state) => state.salary);
    const [errorMsg, setErrorMsg] = React.useState('');
    const [, setIsReady] = React.useState(false);
    const {hra,da,npa,otherAllowances,pf,tax} = useSelector((state) => state.salary.formData);
    const employees = useSelector((state) => state.employee.employees) || [];
    const employeeBank  = useSelector((state) => state.employee);
    const grossSalary = formData.basic + formData.hra + formData.da + formData.npa + formData.otherAllowances + formData.arrears;
    const totalDeductions = formData.pf + formData.tax;
    const netPay = grossSalary - totalDeductions;

    const handleChange = (e) => {
        dispatch(updateField({ name: e.target.name, value: e.target.value }));
    };

    useEffect(() => {
        dispatch(fetchEmployees({ page: 1, limit: 40, search: "" }));

        if (formData.employee_id) {
            console.log("2 employee id", formData.employee_id);
            dispatch(fetchEmployeeBankdetail({ employeeId: formData.employee_id }));
        }
    }, [dispatch, formData.employee_id]);

    useEffect(() => {
        if(slipRef?.current) {
            setIsReady(true);
        }
    },[slipRef]);


    const handlePrint = useReactToPrint({
        contentRef: slipRef,
        documentTitle: `SalarySlip_${formData.employeeId || 'Bulk'}_${formData.month}`,
        onPrintError: () => alert('Error printing the document. Please try again.'),
        onAfterPrint: () => alert('Document printed successfully!'),
    });
      

    const renderStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <Grid container spacing={2}>
                        <Grid size={{xs:12}}>
                            <FormControl fullWidth>
                                <TextField select name="mode" label="Mode" fullWidth value={formData.mode} onChange={handleChange}>
                                    <MenuItem value="bulk">Bulk Salary Processing</MenuItem>
                                    <MenuItem value="individual">Individual Salary Processing</MenuItem>
                                </TextField>
                            </FormControl>
                        </Grid>

                        {formData.mode === 'bulk' ? (
                            <>
                                <Grid size={{xs:12}} >
                                    <TextField select required name="month" label="Month" value={formData.month} fullWidth onChange={handleChange} >
                                        {months.map((month) => (
                                            <MenuItem key={month.value} value={month.value}>
                                                {month.label}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                                <Grid size={{xs:12}}>
                                    <TextField name="year" label="Year" value={formData.year} fullWidth onChange={handleChange} />
                                </Grid>
                                <Grid item xs={6}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker
                                        label="Processing Date"
                                        name="processing_date"
                                        value={formData.processing_date || null}
                                        onChange={(date) =>
                                            dispatch(updateField({ name: "processing_date", value: date }))
                                        }
                                        slotProps={{ textField: { fullWidth: true } }}
                                        />
                                    </LocalizationProvider>
                                </Grid>

                                <Grid item xs={6}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker
                                        label="Payment Date"
                                        name="payment_date"
                                        value={formData.payment_date || null}
                                        onChange={(date) =>
                                            dispatch(updateField({ name: "payment_date", value: date }))
                                        }
                                        slotProps={{ textField: { fullWidth: true } }}
                                        />
                                    </LocalizationProvider>
                                </Grid>
                            </>
                        ) : (
                            null
                        )}
                    </Grid>
                );
            case 1:
                return (
                    <Grid container spacing={2}>
                        <>
                        <Grid size={{xs:6}}>
                            <TextField select required name="employee_id" label="Employee" value={formData.employee_id} fullWidth onChange={handleChange} >
                                {
                                    employees.map((employee) => (
                                        <MenuItem key={employee.id} value={employee.id}>
                                            {employee.first_name} {employee.last_name}
                                        </MenuItem>
                                    ))
                                }
                            </TextField>
                        </Grid>
                        <Grid size={{xs:6}}>
                            <TextField select required name="employee_bank_id" label="Employee Bank" value={formData.employee_bank_id} fullWidth onChange={handleChange} >
                            {
                                Array.isArray(employeeBank?.employeeBank)
                                    ? employeeBank.employeeBank.map((bank) => (
                                        <MenuItem key={bank.id} value={bank.id}>
                                        {bank.bank_name} - {bank.branch_name}
                                        </MenuItem>
                                    ))
                                    : <MenuItem value="">No Bank Details Available</MenuItem>
                            }

                            </TextField>
                        </Grid>
                            <Grid size={{xs:12}} >
                            <TextField select required name="month" label="Month" value={formData.month} fullWidth onChange={handleChange} >
                                {months.map((month) => (
                                    <MenuItem key={month.value} value={month.value}>
                                        {month.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid size={{xs:12}}>
                            <TextField name="year" label="Year" value={formData.year} fullWidth onChange={handleChange} />
                        </Grid>
                        <Grid item xs={6}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                label="Processing Date"
                                name="processing_date"
                                value={formData.processing_date || null}
                                onChange={(date) =>
                                    dispatch(updateField({ name: "processing_date", value: date }))
                                }
                                slotProps={{ textField: { fullWidth: true } }}
                                />
                            </LocalizationProvider>
                        </Grid>

                        <Grid item xs={6}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                label="Payment Date"
                                name="payment_date"
                                value={formData.payment_date || null}
                                onChange={(date) =>
                                    dispatch(updateField({ name: "payment_date", value: date }))
                                }
                                slotProps={{ textField: { fullWidth: true } }}
                                />
                            </LocalizationProvider>
                        </Grid>
                        </>
                    </Grid>
                    
                );

            case 2:
                return (
                    <Grid container spacing={2}>
                        <Grid size={{xs:6}}>
                            <TextField name="basic" label="Basic Pay" fullWidth onChange={handleChange} />
                        </Grid>
                        <Grid size={{xs:6}}>
                            <TextField name="hra" label="HRA" fullWidth onChange={handleChange} value={hra} />
                        </Grid>
                        <Grid size={{xs:6}}>
                            <TextField name="da" label="DA" fullWidth onChange={handleChange} value={da} />
                        </Grid>
                        <Grid size={{xs:6}}>
                            <TextField name="npa" label="NPA" fullWidth onChange={handleChange} value={npa}/>
                        </Grid>
                        <Grid size={{xs:6}}>
                            <TextField name="otherAllowances" label="Other Allowances" fullWidth onChange={handleChange} value={otherAllowances} />
                        </Grid>
                    </Grid>
                );

            case 3:
                return (
                    <Grid container spacing={2}>
                        <Grid size={{xs:6}}>
                            <TextField name="pf" label="Provident Fund" fullWidth onChange={handleChange} value={pf} />
                        </Grid>
                        <Grid size={{xs:6}}>
                            <TextField name="tax" label="Tax" fullWidth onChange={handleChange} value={tax}/>
                        </Grid>
                    </Grid>
                );

            case 4:
                return (
                    <Box >
                        <Typography variant="h6" mb={2}>Salary Slip Preview</Typography>
                        <div ref={slipRef}>
                            <Box
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
                                    <Grid >Employee: {formData.employeeId || 'N/A'}</Grid>
                                    <Grid >Generated On: {new Date().toLocaleDateString()}</Grid>
                                </Grid>
                                <Typography>Month: {formData.month}</Typography>

                                <Grid container spacing={3} mt={2}>
                                    <Grid  xs={6}>
                                        <Typography fontWeight="bold">Earnings</Typography>
                                        <div>Basic: ₹{formData.basic || 0}</div>
                                        <div>Da: ₹{formData.da || 0}</div>
                                        <div>Hra: ₹{formData.hra || 0}</div>
                                        <div>Ta: ₹0</div>
                                        <div>Other: ₹{formData.otherAllowances || 0}</div>
                                        <div style={{ marginTop: 5 }}>Gross Salary: ₹{grossSalary}</div>
                                    </Grid>

                                    <Grid  xs={6}>
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
                        </div>
                        <Button variant="contained" color="success" sx={{ mt: 2 }} onClick={handlePrint}>
                            Download PDF
                        </Button>
                    </Box>
                );

            case 5:
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

    const validateStep = () => {
        const { mode, month, year, processing_date, employee_id, employee_bank_id, basic, hra, da } = formData;



        switch (activeStep) {

            case 0: 
                if (!month || !year) return { valid: false, message: 'Please select both month and year.' };
                return { valid: true };
            case 1:
                if (mode === 'individual' && !employee_id) return { valid: false, message: 'Please select an employee.' };
                return { valid: true };
            case 2: 
                if (basic <= 0) return { valid: false, message: 'Basic salary must be greater than 0.' };
                // if (hra > 0 || da > 0 || npa> 0 || otherAllowances > 0) return { valid: false, message: 'HRA and DA cannot be negative.' };
                return { valid: true };

            case 3: 
                if(pf <0 || tax < 0) return { valid: false, message: 'Deductions cannot be negative.' };
                break;

            case 4: 
                return { valid: true };

            default:
                return { valid: true };
        }
    };


    return (
        <>
            <div className='header bg-gradient-info pb-8 pt-8 pt-md-8 main-head'></div>
            <Box sx={{ width: '80%', margin: 'auto', mt: 8, mb: 8 }}>
                <Typography variant="h5" gutterBottom fontWeight="bold">💼 Salary Processing</Typography>

                <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>

                <Box sx={{ mb: 3 }}>{renderStepContent(activeStep)}</Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button disabled={activeStep === 0} onClick={() => dispatch(prevStep())}>
                        Back
                    </Button>
                    {activeStep < steps.length - 1 ? (
                        <Button
                        className='btn text-white'
                            style={{background:'#004080'}}
                            onClick={() => {
                                const { valid, message } = validateStep();
                                if (valid) {
                                    dispatch(nextStep());
                                    setErrorMsg('');
                                } else {
                                    setErrorMsg(message);
                                }
                            }}
                        >
                            Next
                        </Button>
                    ) : (
                        <Button variant="contained" color="primary" onClick={() => alert('Salary Processed!')}>
                            Finish
                        </Button>
                    )}
                </Box>
            </Box>
            {errorMsg && (
                <Alert severity="error" onClose={() => setErrorMsg('')} sx={{ mb: 2 }}>
                    {errorMsg}
                </Alert>
            )}

        </>
    );
};

export default SalaryProcessing;