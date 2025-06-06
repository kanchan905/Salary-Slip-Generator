import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useReactToPrint } from 'react-to-print';
import {
    fetchDaData,
    fetchHraData,
    fetchNpaData,
    fetchUniformData,
    nextStep,
    prevStep,
    updateField,
    setDeductionField,
    setBasicPayAmount,
    setNpaAmount,
    setHraAmount,
    setDaAmount,
    setUniformAmount,
    fetchTransportData,
    setTransportRate,
    setGisDeduction,
    fetchGisData,
    reset,
    bulkUpdateField,
    resetBulkState
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
    MenuItem,
    FormControl,
    Divider,
    Autocomplete,
} from '@mui/material';
import { Alert } from 'reactstrap';
import { fetchEmployeeBankdetail, fetchEmployeeById, fetchEmployees } from '../../redux/slices/employeeSlice';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { fetchPayStructure } from '../../redux/slices/payStructureSlice';
import { addPaySlip, fetchPaySlips } from '../../redux/slices/paySlipSlice';
import dayjs from 'dayjs';
import { addDeduction } from '../../redux/slices/deductionSlice';
import { fetchEmployeeQuarterList } from '../../redux/slices/quarterSlice';
import { toast } from 'react-toastify';
import { createBulkSalry } from '../../redux/slices/bulkSlice';



const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
];


const steps = [
    'Select Mode',
    'Employee Detail',
    'Deduction',
    'Finalize',
];


const SalaryProcessing = () => {
    const slipRef = useRef(null);
    const dispatch = useDispatch();
    const [mode, setmode] = useState('');
    const { formData, activeStep, deductionForm, bulkForm } = useSelector((state) => state.salary);
    const [errorMsg, setErrorMsg] = React.useState('');
    const [, setIsReady] = React.useState(false);
    const { basic_pay, npa_amount, hra_amount, da_amount, uniform_amount, transport_amount, gis_deduction } = useSelector((state) => state.salary);
    const employees = useSelector((state) => state.employee.employees) || [];
    const employeeBank = useSelector((state) => state.employee);
    const { payStructure } = useSelector((state) => state.payStructure);
    const { npaList } = useSelector((state) => state.salary)
    const { hraList } = useSelector((state) => state.salary)
    const { daList } = useSelector((state) => state.salary)
    const { uniformList } = useSelector((state) => state.salary)
    const { transportList } = useSelector((state) => state.salary)
    const { gisList } = useSelector((state) => state.salary)
    const quarters = useSelector((state) => state.quarter.employeeQuarterList) || [];
    const filterPayStructure = payStructure.filter((structure) => structure?.employee_id === formData.employee_id);
    const isHraEligible = filterPayStructure.length > 0 && filterPayStructure[0]?.employee?.hra_eligibility;
    const isUniformEligible = filterPayStructure.length > 0 && filterPayStructure[0]?.employee?.uniform_allowance_eligibility;
    const { error } = useSelector((state) => state.bulk);
    const { EmployeeDetail } = useSelector((state) => state.employee);
    const [employeeId, setEmployeeId] = useState(null);

    const handleChange = (e) => {
        if (activeStep === 1) {
            dispatch(updateField({ name: e.target.name, value: e.target.value }));
        }
        if (activeStep === 2) {
            dispatch(setDeductionField({ name: e.target.name, value: e.target.value }));
        }
    };

    useEffect(() => {
        dispatch(fetchEmployees({ page: 1, limit: 40, search: "" }));
        dispatch(fetchPaySlips({ page: 1, limit: 40, search: "" }));
        dispatch(fetchPayStructure({ page: 1, limit: 10, search: "" }));
        if (formData.employee_id) {
            setEmployeeId(formData.employee_id)
            dispatch(fetchEmployeeBankdetail({ employeeId: formData.employee_id }));
            dispatch(fetchEmployeeById(employeeId))
        }
        dispatch(fetchNpaData({ page: 1, limit: 100 }));
        dispatch(fetchHraData({ page: 1, limit: 100 }))
        dispatch(fetchDaData({ page: 1, limit: 100 }))
        dispatch(fetchUniformData({ page: 1, limit: 100 }))
        dispatch(fetchTransportData({ page: 1, limit: 100 }))
        dispatch(fetchEmployeeQuarterList({ page: 1, limit: 100 }));
        dispatch(fetchGisData({ page: 1, limit: 100 }))
    }, [dispatch, formData.employee_id]);

    useEffect(() => {
        if (slipRef?.current) {
            setIsReady(true);
        }
    }, [slipRef]);


    useEffect(() => {
        const structure = payStructure.find((s) => s?.employee_id === formData.employee_id);
        if (structure) {
            const amount = structure?.pay_matrix_cell?.amount || 0;

            if (amount !== undefined) {
                dispatch(setBasicPayAmount(amount));
            }

            const npaItem = npaList.find((npa) => npa.id === formData.npa_rate_id);
            const npaRate = npaItem?.rate_percentage;

            if (basic_pay !== undefined && npaRate !== undefined) {
                dispatch(setNpaAmount({ basic_pay: amount, npaRate: npaRate }));
            }

            // HRA
            const hraItem = hraList.find(hra => hra.id === formData.hra_rate_id);
            const quarterItem = quarters.find(quarter => quarter.employee_id === structure?.employee.id);

            // If quarter is occupied, HRA is always 0
            if (quarterItem?.is_occupied) {
                dispatch(setHraAmount({ basic_pay: amount, hra_percentage: 0 }));
            }
            // Else use selected HRA rate if available
            else if (hraItem?.rate_percentage !== undefined) {
                dispatch(setHraAmount({ basic_pay: amount, hra_percentage: hraItem.rate_percentage }));
            }
            // Else fallback to 27%
            else {
                dispatch(setHraAmount({ basic_pay: amount, hra_percentage: 27 }));
            }


            // DA
            const daItem = daList.find(da => da.id === formData.da_rate_id);
            if (daItem?.rate_percentage !== undefined) {
                dispatch(setDaAmount({ basic_pay: amount, da_percentage: daItem.rate_percentage, npa_amount }));
            }

            // Uniform
            const uniformItem = uniformList.find(u => u.id === formData.uniform_rate_id);
            const uniformRate = structure?.employee?.uniform_allowance_eligibility
                ? (uniformItem?.amount)
                : (0)
            dispatch(setUniformAmount({ basic_pay: amount, uniform_percentage: uniformRate }));


            //Transport
            const transportItem = transportList.find((transport) =>
                transport.pay_matrix_level == structure?.pay_matrix_cell?.matrix_level_id
            );

            const transportRate = structure?.employee?.pwd_status
                ? (transportItem?.amount || 0) * 2
                : transportItem?.amount || 0;

            dispatch(setTransportRate(transportRate));

            //credit society member
            const creditEligible = filterPayStructure.length > 0 && filterPayStructure[0]?.employee?.credit_society_member;

            if (!creditEligible) {
                dispatch(setDeductionField({ name: 'credit_society_membership', value: 0 }));
            }

            //Gis eligibility
            const gisEligible = filterPayStructure.length > 0 && filterPayStructure[0]?.employee?.gis_eligibility;
            const gisItem = gisList.find(gis => gis?.pay_matrix_level == filterPayStructure[0]?.pay_matrix_cell?.matrix_level_id);
            const gisRate = gisEligible ? (gisItem?.amount) : (0);
            dispatch(setGisDeduction(gisRate));
        }
    }, [formData.employee_id, formData.npa_rate_id, formData.hra_rate_id, formData.da_rate_id, formData.uniform_rate_id, payStructure, dispatch]);



    const handlePrint = useReactToPrint({
        contentRef: slipRef,
        documentTitle: `SalarySlip_${formData.employee_id || 'Bulk'}_${formData.month}`,
        onPrintError: () => alert('Error printing the document. Please try again.'),
        onAfterPrint: () => alert('Document printed successfully!'),
    });

    const handleSubmit = async (e) => {
        if (e && e.preventDefault) e.preventDefault();

        try {
            if (mode === 'bulk') {
                await dispatch(createBulkSalry(bulkForm)).unwrap()
                    .then(() => {
                        toast.success('Bulk Deductions submitted successfully!');
                        dispatch(resetBulkState());
                    })
                    .catch((err) => {
                        const apiMsg = err?.data?.message || err?.message || err?.errorMsg || 'Failed to submit bulk deductions.';
                        toast.error(apiMsg);
                    });

            } else {
                const { mode, ...cleanFormData } = formData;
                // 1. Submit the payslip and get the net_salary_id
                const paySlipResponse = await dispatch(addPaySlip(cleanFormData));
                const net_salary_id = paySlipResponse?.payload?.data?.net_salary_id;

                if (!net_salary_id) {
                    throw new Error("Net Salary ID not returned from payslip response");
                }

                // 2. Prepare and submit deduction form with net_salary_id
                const deductionPayload = {
                    ...deductionForm,
                    net_salary_id,
                };

                await dispatch(addDeduction(deductionPayload));

                // 3. Show success toast
                toast.success('Payslip and Deductions submitted successfully!');
                dispatch(reset());
            }
        } catch (error) {
            toast.error('Failed to submit payslip or deductions.');
        }
    };



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
            if (mode == 'individual') {
                dispatch(nextStep());
            }
        }
    };


    const renderStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12 }}>
                            <FormControl fullWidth>
                                <TextField select name="mode" label="Mode" fullWidth value={mode} onChange={(e) => setmode(e.target.value)}>
                                    <MenuItem value="bulk" >Bulk Salary Processing</MenuItem>
                                    <MenuItem value="individual">Individual Salary Processing</MenuItem>
                                </TextField>
                            </FormControl>
                        </Grid>

                        {
                            mode === 'bulk' ? (
                                <>
                                    <Grid size={{ xs: 12 }} >
                                        <TextField select required name="month" label="Month" value={bulkForm.month} fullWidth onChange={(e) => dispatch(bulkUpdateField({ name: 'month', value: e.target.value }))} >
                                            {months.map((month) => (
                                                <MenuItem key={month.value} value={month.value}>
                                                    {month.label}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Grid>
                                    <Grid size={{ xs: 12 }}>
                                        <TextField name="year" label="Year" value={bulkForm.year} fullWidth onChange={(e) => dispatch(bulkUpdateField({ name: 'year', value: e.target.value }))} />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DatePicker
                                                label="Processing Date"
                                                name="processing_date"
                                                value={bulkForm.processing_date ? dayjs(bulkForm.processing_date) : null}
                                                onChange={(date) =>
                                                    dispatch(bulkUpdateField({ name: "processing_date", value: date }))
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
                                                value={bulkForm.payment_date ? dayjs(bulkForm.payment_date) : null}
                                                onChange={(date) =>
                                                    dispatch(bulkUpdateField({ name: "payment_date", value: date }))
                                                }
                                                slotProps={{ textField: { fullWidth: true } }}
                                            />
                                        </LocalizationProvider>
                                    </Grid>
                                </>
                            ) : (
                                null
                            )
                        }
                    </Grid>
                );
            case 1:
                return (
                    <Grid container spacing={2}>
                        <>
                            <Grid size={{ xs: 4 }}>
                                <Autocomplete
                                    options={employees}
                                    getOptionLabel={(option) =>
                                        `${option.first_name} ${option.last_name} - (${option.id})`
                                    }
                                    value={employees.find(emp => emp.id === formData.employee_id) || null}
                                    onChange={(_, newValue) => {
                                        dispatch(updateField({ name: 'employee_id', value: newValue ? newValue.id : '' }));
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            required
                                            label="Employee"
                                            name="employee_id"
                                            fullWidth
                                        />
                                    )}
                                    isOptionEqualToValue={(option, value) => option.id === value.id}
                                />
                            </Grid>
                            <Grid size={{ xs: 4 }}>
                                <TextField select required name="employee_bank_id" className='text-capitalize' label="Employee Bank" value={formData.employee_bank_id} fullWidth onChange={handleChange} >
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
                            <Grid size={{ xs: 4 }} >
                                <TextField select required name="pay_structure_id" label="Pay Structure" value={formData.pay_structure_id} fullWidth onChange={handleChange} >
                                    {filterPayStructure.map((data) => (
                                        <MenuItem key={data.id} value={data.id}>
                                            {`${data?.pay_matrix_cell?.pay_matrix_level?.name}`.padStart(2, '0')} - {data?.pay_matrix_cell?.index} - {data?.pay_matrix_cell?.amount}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid size={{ xs: 4 }} >
                                <TextField select required name="month" label="Month" value={formData.month} fullWidth onChange={handleChange} >
                                    {months.map((month) => (
                                        <MenuItem key={month.value} value={month.value}>
                                            {month.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            <Grid size={{ xs: 4 }}>
                                <TextField name="year" label="Year*" value={formData.year} fullWidth onChange={handleChange} />
                            </Grid>

                            <Grid size={{ xs: 4 }}>
                                {
                                    filterPayStructure.length > 0 && filterPayStructure[0]?.employee?.npa_eligibility ? (
                                        <TextField select required name="npa_rate_id" className='text-capitalize' label="NPA RATE%" value={formData.npa_rate_id} fullWidth onChange={handleChange} >
                                            {
                                                Array.isArray(npaList)
                                                    ? npaList.map((npa) => (
                                                        <MenuItem key={npa.id} value={npa.id}>
                                                            {npa.rate_percentage}
                                                        </MenuItem>
                                                    ))
                                                    : <MenuItem value="">No NPA Details Available</MenuItem>
                                            }
                                        </TextField>
                                    ) : (
                                        <TextField name="npa_rate_id" label="NPA RATE*" value={formData.npa_rate_id} fullWidth onChange={handleChange} />
                                    )
                                }
                            </Grid>

                            <Grid size={{ xs: 4 }}>
                                {
                                    filterPayStructure.length > 0 && filterPayStructure[0]?.employee?.hra_eligibility ? (
                                        <TextField select required name="hra_rate_id" className='text-capitalize' label="HRA RATE%*" value={formData.hra_rate_id} fullWidth onChange={handleChange} >
                                            {
                                                Array.isArray(hraList)
                                                    ? hraList.map((hra) => (
                                                        <MenuItem key={hra.id} value={hra.id}>
                                                            {hra.rate_percentage}
                                                        </MenuItem>
                                                    ))
                                                    : <MenuItem value="">No hra Details Available</MenuItem>
                                            }
                                        </TextField>
                                    ) : (
                                        <TextField name="hra_rate_id" label="HRA RATE" value={hra_amount} fullWidth onChange={handleChange} disabled />
                                    )
                                }
                            </Grid>

                            <Grid size={{ xs: 4 }}>
                                <TextField select required name="da_rate_id" className='text-capitalize' label="DA RATE%" value={formData.da_rate_id} fullWidth onChange={handleChange} >
                                    {
                                        Array.isArray(daList)
                                            ? daList.map((da) => (
                                                <MenuItem key={da.id} value={da.id}>
                                                     {da.rate_percentage}
                                                </MenuItem>
                                            ))
                                            : <MenuItem value="">No da Details Available</MenuItem>
                                    }
                                </TextField>
                            </Grid>

                            <Grid size={{ xs: 4 }}>
                                {
                                    filterPayStructure.length > 0 && filterPayStructure[0]?.employee?.uniform_allowance_eligibility ? (
                                        <TextField select required name="uniform_rate_id" className='text-capitalize' label="UNIFORM RATE*" value={formData.uniform_rate_id} fullWidth onChange={handleChange} >
                                            {
                                                Array.isArray(uniformList)
                                                    ? uniformList.map((uniform) => (
                                                        <MenuItem key={uniform.id} value={uniform.id}>
                                                            Post {uniform.applicable_post} && Rate {uniform.amount}
                                                        </MenuItem>
                                                    ))
                                                    : <MenuItem value="">No uniform Details Available</MenuItem>
                                            }
                                        </TextField>
                                    ) : (
                                        <TextField name="uniform_rate_id" label="UNIFORM RATE" value={uniform_amount} fullWidth onChange={handleChange} disabled />
                                    )
                                }
                            </Grid>

                            <Grid size={{ xs: 4 }}>
                                <TextField name="pay_plus_npa" label="PAY PLUS NPA Amount" value={formData.pay_plus_npa} fullWidth onChange={handleChange} />
                            </Grid>
                            <Grid size={{ xs: 4 }}>
                                <TextField name="govt_contribution" label="GOVT Contribution Amount" value={formData.govt_contribution} fullWidth onChange={handleChange} />
                            </Grid>
                            <Grid size={{ xs: 4 }}>
                                <TextField name="arrears" label="Arrears Amount" value={formData.arrears} fullWidth onChange={handleChange} />
                            </Grid>
                            <Grid size={{ xs: 4 }}>
                                <TextField name="spacial_pay" label="Spacial Pay Amount" value={formData.spacial_pay} fullWidth onChange={handleChange} />
                            </Grid>
                            <Grid size={{ xs: 4 }}>
                                <TextField name="da_1" label="DA_1 Amount" value={formData.da_1} fullWidth onChange={handleChange} />
                            </Grid>
                            <Grid size={{ xs: 4 }}>
                                <TextField name="da_2" label="DA_2 Amount" value={formData.da_2} fullWidth onChange={handleChange} />
                            </Grid>
                            <Grid size={{ xs: 4 }}>
                                <TextField name="itc_leave_salary" label="ITC Leave Salary Amount" value={formData.itc_leave_salary} fullWidth onChange={handleChange} />
                            </Grid>
                            <Grid item xs={4}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        label="Processing Date*"
                                        name="processing_date"
                                        value={formData.processing_date ? dayjs(formData.processing_date) : null}
                                        onChange={(date) => {
                                            const isoDate = date ? date.toISOString() : '';
                                            dispatch(updateField({ name: 'processing_date', value: isoDate }));
                                        }}
                                        slotProps={{ textField: { fullWidth: true } }}
                                    />
                                </LocalizationProvider>
                            </Grid>

                            <Grid item xs={4}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        label="Payment Date*"
                                        name="payment_date"
                                        value={formData.payment_date ? dayjs(formData.payment_date) : null}
                                        onChange={(date) => {
                                            const isoDate = date ? date.toISOString() : '';
                                            dispatch(updateField({ name: 'payment_date', value: isoDate }));
                                        }}
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
                        <Grid size={{ xs: 4 }}>
                            <TextField name="income_tax" label="Income Tax (if any)" fullWidth onChange={handleChange} value={deductionForm.income_tax ?? ''} />
                        </Grid>
                        <Grid size={{ xs: 4 }}>
                            <TextField name="professional_tax" label="Professional Tax (if any)" fullWidth onChange={handleChange} value={deductionForm.professional_tax} />
                        </Grid>
                        <Grid size={{ xs: 4 }}>
                            <TextField name="license_fee" label="License Fee (if any)" fullWidth onChange={handleChange} value={deductionForm.license_fee} />
                        </Grid>
                        <Grid size={{ xs: 4 }}>
                            <TextField name="nfch_donation" label="NFCH Donation (if any)" fullWidth onChange={handleChange} value={deductionForm.nfch_donation} />
                        </Grid>
                        <Grid size={{ xs: 4 }}>
                            <TextField name="gpf" label="gpf (if any)" fullWidth onChange={handleChange} value={deductionForm.gpf} />
                        </Grid>
                        <Grid size={{ xs: 4 }}>
                            <TextField name="transport_allowance_recovery" label="Transport Allowance Recovery (if any)" fullWidth onChange={handleChange} value={deductionForm.transport_allowance_recovery} />
                        </Grid>
                        <Grid size={{ xs: 4 }}>
                            <TextField name="hra_recovery" label="HRA Recovery (if any)" fullWidth onChange={handleChange} value={deductionForm.hra_recovery} />
                        </Grid>
                        <Grid size={{ xs: 4 }}>
                            <TextField name="computer_advance" label="Computer Advance (if any)" fullWidth onChange={handleChange} value={deductionForm.computer_advance} />
                        </Grid>
                        <Grid size={{ xs: 4 }}>
                            <TextField name="computer_advance_installment" label="computer Advance Installment (if any)" fullWidth onChange={handleChange} value={deductionForm.computer_advance_installment} />
                        </Grid>
                        <Grid size={{ xs: 4 }}>
                            <TextField name="computer_advance_inst_no" label="Computer Advance Inst No (if any)" fullWidth onChange={handleChange} value={deductionForm.computer_advance_inst_no} />
                        </Grid>
                        <Grid size={{ xs: 4 }}>
                            <TextField name="computer_advance_balance" label="computer_advance_balance (if any)" fullWidth onChange={handleChange} value={deductionForm.computer_advance_balance} />
                        </Grid>
                        <Grid size={{ xs: 4 }}>
                            <TextField name="employee_contribution_10" label="Employee Contribution_10 (if any)" fullWidth onChange={handleChange} value={deductionForm.employee_contribution_10} />
                        </Grid>
                        <Grid size={{ xs: 4 }}>
                            <TextField name="govt_contribution_14_recovery" label="GOVT Contribution_14 Recovery (if any)" fullWidth onChange={handleChange} value={deductionForm.govt_contribution_14_recovery} />
                        </Grid>
                        <Grid size={{ xs: 4 }}>
                            <TextField name="dies_non_recovery" label="Dies NON Recovery (if any)" fullWidth onChange={handleChange} value={deductionForm.dies_non_recovery} />
                        </Grid>
                        <Grid size={{ xs: 4 }}>
                            <TextField name="computer_advance_interest" label="Computer Advance Interest (if any)" fullWidth onChange={handleChange} value={deductionForm.computer_advance_interest} />
                        </Grid>
                        <Grid size={{ xs: 4 }}>
                            <TextField name="pay_recovery" label="Pay Recovery (if any)" fullWidth onChange={handleChange} value={deductionForm.pay_recovery} />
                        </Grid>
                        <Grid size={{ xs: 4 }}>
                            <TextField name="nps_recovery" label="NPS Recovery (if any)" fullWidth onChange={handleChange} value={deductionForm.nps_recovery} />
                        </Grid>
                        <Grid size={{ xs: 4 }}>
                            <TextField name="lic" label="lic (if any)" fullWidth onChange={handleChange} value={deductionForm.lic} />
                        </Grid>
                        {
                            filterPayStructure.length > 0 && filterPayStructure[0].employee?.credit_society_member ? (
                                <Grid size={{ xs: 4 }}>
                                    <TextField name="credit_society_membership" label="Credit Society Membership" fullWidth onChange={handleChange} value={deductionForm.credit_society_membership} />
                                </Grid>
                            ) : (
                                <Grid size={{ xs: 4 }}>
                                    <TextField name="credit_society_membership" label="Credit Society Membership" value={0} fullWidth onChange={handleChange} disabled />
                                </Grid>
                            )
                        }
                    </Grid>
                );

            case 3:
                const matrix = filterPayStructure.find(p => p.employee?.id === formData.employee_id)?.pay_matrix_cell;
                const monthLabel = months.find(m => m.value === formData.month)?.label || formData.month; 

                const earnings = [
                    ['Basic Pay', basic_pay],
                    ['HRA Amount', hra_amount],
                    ['DA Amount', da_amount],
                    ['NPA Amount', npa_amount],
                    ['Uniform Amount', uniform_amount],
                    ['Transport Amount', transport_amount],
                    ['Pay Plus NPA', formData.pay_plus_npa],
                    ['Govt Contribution', formData.govt_contribution],
                    ['Arrears', formData.arrears],
                    ['Special Pay', formData.spacial_pay],
                    ['DA-1', formData.da_1],
                    ['DA-2', formData.da_2],
                    ['ITC Leave Salary', formData.itc_leave_salary],
                ];

                const deductions = [
                    ['Income Tax', deductionForm.income_tax],
                    ['Professional Tax', deductionForm.professional_tax],
                    ['License Fee', deductionForm.license_fee],
                    ['NFCH Donation', deductionForm.nfch_donation],
                    ['GPF', deductionForm.gpf],
                    ['Transport Allowance Recovery', deductionForm.transport_allowance_recovery],
                    ['HRA Recovery', deductionForm.hra_recovery],
                    ['Computer Advance', deductionForm.computer_advance],
                    ['Advance Installment', deductionForm.computer_advance_installment],
                    ['Advance Inst No', deductionForm.computer_advance_inst_no],
                    ['Advance Balance', deductionForm.computer_advance_balance],
                    ['Employee Contribution 10%', deductionForm.employee_contribution_10],
                    ['Govt Contribution 14% Recovery', deductionForm.govt_contribution_14_recovery],
                    ['Dies Non Recovery', deductionForm.dies_non_recovery],
                    ['Advance Interest', deductionForm.computer_advance_interest],
                    ['Pay Recovery', deductionForm.pay_recovery],
                    ['NPS Recovery', deductionForm.nps_recovery],
                    ['LIC', deductionForm.lic],
                    ['Credit Society Membership', deductionForm.credit_society_membership],
                    ['GIS', gis_deduction],
                ];


                const totalEarnings =
                    Number(basic_pay || 0) +
                    Number(hra_amount || 0) +
                    Number(da_amount || 0) +
                    Number(npa_amount || 0) +
                    Number(uniform_amount || 0) +
                    Number(transport_amount || 0) +
                    Number(formData.pay_plus_npa || 0) +
                    Number(formData.govt_contribution || 0) +
                    Number(formData.arrears || 0) +
                    Number(formData.spacial_pay || 0) +
                    Number(formData.da_1 || 0) +
                    Number(formData.da_2 || 0) +
                    Number(formData.itc_leave_salary || 0);

                const totalDeductionsCalc =
                    Number(deductionForm.income_tax || 0) +
                    Number(deductionForm.professional_tax || 0) +
                    Number(deductionForm.license_fee || 0) +
                    Number(deductionForm.nfch_donation || 0) +
                    Number(deductionForm.gpf || 0) +
                    Number(deductionForm.transport_allowance_recovery || 0) +
                    Number(deductionForm.hra_recovery || 0) +
                    Number(deductionForm.computer_advance || 0) +
                    Number(deductionForm.computer_advance_installment || 0) +
                    Number(deductionForm.computer_advance_inst_no || 0) +
                    Number(deductionForm.computer_advance_balance || 0) +
                    Number(deductionForm.employee_contribution_10 || 0) +
                    Number(deductionForm.govt_contribution_14_recovery || 0) +
                    Number(deductionForm.dies_non_recovery || 0) +
                    Number(deductionForm.computer_advance_interest || 0) +
                    Number(deductionForm.pay_recovery || 0) +
                    Number(deductionForm.nps_recovery || 0) +
                    Number(deductionForm.lic || 0) +
                    Number(deductionForm.credit_society_membership || 0) +
                    Number(gis_deduction || 0);

                const netPayCalc = totalEarnings - totalDeductionsCalc;
                const half = Math.ceil(deductions.length / 2);
                const leftDeductions = deductions.slice(0, half);
                const rightDeductions = deductions.slice(half);

                return (
                    <Box ref={slipRef} sx={{ p: 4, borderRadius: 3, backgroundColor: '#fff', maxWidth: 850, mx: 'auto', fontFamily: 'Inter, sans-serif', boxShadow: 3 }}>
                        <Typography variant="h5" align="center" fontWeight="bold">XYZ Company</Typography>
                        <Typography variant="body2" align="center" color="text.secondary">India</Typography>
                        <Typography variant="subtitle1" align="center" sx={{ mt: 1, mb: 3 }}>Pay Slip for the period of {monthLabel} {formData.year}</Typography>

                        <Divider sx={{ mb: 3 }} />

                        <Grid container sx={{ justifyContent: 'space-between' }}>
                            <Grid item xs={6}>
                                <Typography fontWeight="bold" gutterBottom>Employee Details</Typography>
                                <Typography><strong>Name:</strong> {EmployeeDetail?.first_name} {EmployeeDetail?.last_name}</Typography>
                                <Typography>
                                    <strong>Designation:</strong>
                                    {EmployeeDetail?.employee_designation?.map((des, index) => (
                                        <span key={index}> {des.designation}, </span>
                                    ))}
                                </Typography>
                                 <Typography>
                                    <strong>Cadre:</strong>
                                    {EmployeeDetail?.employee_designation?.map((des, index) => (
                                        <span key={index}> {des.cadre}, </span>
                                    ))}
                                </Typography>
                                <Typography><strong>Gender:</strong> {EmployeeDetail?.gender}</Typography>
                                <Typography><strong>Date of Birth:</strong> {EmployeeDetail?.date_of_birth || 'N/A'}</Typography>
                                <Typography><strong>Date of Joining:</strong> {EmployeeDetail?.date_of_joining || 'N/A'}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography fontWeight="bold" gutterBottom>Payroll Details</Typography>
                                <Typography><strong>Institute:</strong> {EmployeeDetail?.institute || 'N/A'}</Typography>
                                <Typography><strong>Email:</strong> {EmployeeDetail?.email || 'N/A'}</Typography>
                                <Typography><strong>Bank A/C:</strong> {formData.employee_bank_id || 'N/A'}</Typography>
                                <Typography><strong>Pay Level:</strong> {matrix?.pay_matrix_level?.name || 'N/A'}</Typography>
                                <Typography><strong>Pay Index:</strong> {matrix?.index} | ₹{matrix?.amount}</Typography>
                            </Grid>
                        </Grid>

                        <Divider sx={{ mb: 3, mt: 3 }} />

                        <Grid container sx={{ mt: 3, justifyContent: 'space-between' }}>
                            <Grid item xs={6} sx={{ width: '25%' }}>
                                <Typography fontWeight="bold" gutterBottom sx={{ color: '#007BFF', textAlign: 'center' }}>Earnings</Typography>
                                {earnings.map(([label, value]) => (
                                    <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                        <Typography>{label}</Typography>
                                        <Typography>₹{value || 0}</Typography>
                                    </Box>
                                ))}
                                <Divider sx={{ my: 1 }} />
                                <Typography fontWeight="bold" display="flex" justifyContent="space-between">
                                    <span>Gross Salary</span><span>₹{totalEarnings}</span>
                                </Typography>
                            </Grid>

                            <Grid item xs={6}>
                                <Typography fontWeight="bold" gutterBottom sx={{ color: '#D32F2F', textAlign: 'center' }}>Deductions</Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        {leftDeductions.map(([label, value]) => (
                                            <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                                <Typography>{label}</Typography>
                                                <Typography>₹{value || 0}</Typography>
                                            </Box>
                                        ))}
                                    </Grid>
                                    <Grid item xs={6}>
                                        {rightDeductions.map(([label, value]) => (
                                            <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                                <Typography>{label}</Typography>
                                                <Typography>₹{value || 0}</Typography>
                                            </Box>
                                        ))}
                                    </Grid>
                                </Grid>
                                <Divider sx={{ my: 1 }} />
                                <Typography fontWeight="bold" display="flex" justifyContent="space-between">
                                    <span>Total Deductions</span><span>₹{totalDeductionsCalc}</span>
                                </Typography>
                            </Grid>
                        </Grid>

                        <Typography align="right" variant="h3" sx={{ mt: 3 }}><strong>Net Pay:</strong> ₹{netPayCalc}</Typography>

                        <Box sx={{ textAlign: 'center', mt: 4 }}>
                            <Button variant="contained" color="primary" onClick={handlePrint}>DOWNLOAD PDF</Button>
                        </Box>
                    </Box>
                );
        }
    };

    const validateStep = ({ formData, activeStep }) => {
        const {
            pay_structure_id,
            npa_rate_id,
            hra_rate_id,
            da_rate_id,
            uniform_rate_id,
            employee_id,
            month,
            year,
            processing_date,
            employee_bank_id,
            payment_date,
        } = formData;

        switch (activeStep) {
            case 1:
                if (!employee_id) {
                    return { valid: false, message: 'Employee is required.' };
                }

                if (!pay_structure_id) {
                    return { valid: false, message: 'Pay structure must be selected.' };
                }

                if (!month || !year) {
                    return { valid: false, message: 'Please select both month and year.' };
                }

                if (!npa_rate_id) {
                    return { valid: false, message: 'NPA rate must be selected.' };
                }

                if (isHraEligible && !hra_rate_id) {
                    return { valid: false, message: 'HRA rate must be selected.' };
                }

                if (!da_rate_id) {
                    return { valid: false, message: 'DA rate must be selected.' };
                }

                if (isUniformEligible && !uniform_rate_id) {
                    return { valid: false, message: 'Uniform rate must be selected.' };
                }

                if (!processing_date) {
                    return { valid: false, message: 'Processing date is required.' };
                }

                if (!employee_bank_id) {
                    return { valid: false, message: 'Employee bank must be selected.' };
                }

                if (!payment_date) {
                    return { valid: false, message: 'Payment date is required.' };
                }

                return { valid: true };

            default:
                return { valid: true };
        }
    };


    return (
        <>
            <div className='header bg-gradient-info pb-8 pt-8 pt-md-8 main-head'></div>
            <form onSubmit={handleSubmit}>
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
                        <Button
                            variant="contained"
                            onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
                        >
                            {activeStep === steps.length - 1 ? 'Submit' : 'Next'}
                        </Button>

                    </Box>
                </Box>
                {errorMsg && (
                    <Alert severity="error" onClose={() => setErrorMsg('')} sx={{ mb: 2 }}>
                        {errorMsg}
                    </Alert>
                )}

            </form>

        </>
    );
};

export default SalaryProcessing;