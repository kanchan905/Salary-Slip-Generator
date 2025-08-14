import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    fetchDaData,
    fetchHraData,
    fetchNpaData,
    fetchUniformData,
    nextStep,
    prevStep,
    updateField,
    setDeductionField,
    fetchTransportData,
    fetchGisData,
    reset,
    bulkUpdateField,
    resetBulkState,
    setCalculatedAmounts,
    resetForNewEmployee,
} from '../../redux/slices/salarySlice';
import {
    Box, Button, Stepper, Step, StepLabel, Typography, TextField,
    Grid, MenuItem, FormControl, Autocomplete,
} from '@mui/material';
import { fetchEmployeeBankdetail, fetchEmployeeById, fetchEmployees } from '../../redux/slices/employeeSlice';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { fetchPayStructure } from '../../redux/slices/payStructureSlice';
import { addPaySlip, fetchPaySlips } from '../../redux/slices/paySlipSlice';
import dayjs from 'dayjs';
import { fetchEmployeeQuarterList } from '../../redux/slices/quarterSlice';
import { toast } from 'react-toastify';
import { createBulkSalry } from '../../redux/slices/bulkSlice';
import { salaryMonths as months } from 'utils/helpers';
import { fetchNetSalary } from '../../redux/slices/netSalarySlice';
import html2pdf from 'html2pdf.js';
import logo from '../../assets/img/images/slip-header.png';
import '../../assets/css/custom.css';
import { useNavigate } from 'react-router-dom';
import { fetchNpsContribution, selectLatestGovtRate, selectLatestEmployeeRate } from '../../redux/slices/npsContributionSlice';
import { fetchGpfContribution } from '../../redux/slices/gpfContributionSlice';
import { customRound, getMonthName } from 'utils/helpers';
import rohcheader from '../../assets/img/images/rohcheader.png'

const steps = [
    'Select Mode',
    'Employee Detail',
    'Deduction',
    'Finalize',
];

const SalaryProcessing = () => {
    const navigate = useNavigate();
    const slipRef = useRef(null);
    const dispatch = useDispatch();
    const [mode, setmode] = useState('');

    // REFINED: All form data, including calculated amounts, is now in `formData`
    const { formData, activeStep, bulkForm } = useSelector((state) => state.salary);
    const {
        basic_pay,
        npa_amount,
        da_amount,
        hra_amount,
        uniform_rate_amount,
        transport_amount,
        da_on_ta,
        gis,
        license_fee
    } = formData;
    const employees = useSelector((state) => state.employee.employees) || [];
    const { employeeBank, EmployeeDetail } = useSelector((state) => state.employee);
    const { payStructure } = useSelector((state) => state.payStructure);
    const { npaList, hraList, daList, uniformList, transportList, gisList } = useSelector((state) => state.salary);
    const quarters = useSelector((state) => state.quarter.employeeQuarterList) || [];
    const { netSalary } = useSelector((state) => state.netSalary);
    const { npsContribution } = useSelector((state) => state.npsContribution);

    const [nonRetired, setNonRetired] = useState([]);
    const [dynamicObjects, setDynamicObjects] = useState([]);
    const [newObject, setNewObject] = useState({ type: '', amount: '' });
    const [deductionDynamicObjects, setDeductionDynamicObjects] = useState([]);
    const [deductionObject, setDeductionObject] = useState({ type: '', amount: '' });
    const [selectNext, setSelectNext] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false); // Add loading state
    const [calculationComplete, setCalculationComplete] = useState(false); // Track calculation completion
    const [EditMode, SetEditMode] = useState(false);


    // console.log("FormData: ", formData);
    // console.log("Payst: ", payStructure);

    const typeOptions = [
        'NPA Arrear',
        'DA Arrear',
        'HRA Arrear',
        'TA Arrear',
        'DA on TA Arrear',
        'NPS-Government contribution(14%) Arrear',
        'Uniform Arrear',
        'LTC Arrear',
        'PAY FIXATION  Arrear',
        'Honorarium Arrear',
        'CEA(CHILD EDUCATION ALLOWANCE)',
        'NPS -Employee contribution(10%) Arrear',
        'GPF Arrear',
        'Income Tax Arrear',
        'Professional Tax Arrear',
        'License fee Arrear',
        'NFCH donation Arrear',
        'LIC Arrear',
        'Credit society Arrear',
        'Employee loan Arrear',

    ];
    const typeDeduction = [
        'NPA Recovery',
        'DA recovery',
        'HRA Recovery',
        'TA Recovery',
        'DA on TA Recovery',
        'NPS-Government contribution(14%) Recovery',
        'Uniform Recovery',
        'LTC Recovery',
        'PAY FIXATION Recovery',
        'Honorarium Recovery',
        'CEA(CHILD EDUCATION ALLOWANCE) Recovery',
        'NPS -Employee contribution(10%) Recovery',
        'GPF Recovery',
        'Income Tax Recovery',
        'Professional Tax Recovery',
        'License Fee Recovery',
        'NFCH Donation Recovery',
        'LIC Recovery',
        'Credit society Recovery',
        'Employee loan Recovery',
        'Dies non recovery',
        'HPL (Half Pay Leave) Recovery',
        'EOL (Extraordinary Leave) Recovery',
        'CCL (Child Care Leave) Recovery',
        'Briefcase Recovery',

    ];

    const govtContributionRate = useSelector(selectLatestGovtRate);
    const employeeContributionRate = useSelector(selectLatestEmployeeRate);

    const formatCurrency = (val) => (Number(val) || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    const filterPayStructure = payStructure.filter((structure) => structure?.employee_id === formData.employee_id);
    const isHraEligible = filterPayStructure.length > 0 && filterPayStructure[0]?.employee?.hra_eligibility;
    const isUniformEligible = filterPayStructure.length > 0 && filterPayStructure[0]?.employee?.uniform_allowance_eligibility;
    const creditEligible = filterPayStructure.length > 0 && filterPayStructure[0]?.employee?.credit_society_member;
    const isQuarterOccupied = quarters.some(q => q.employee_id === formData.employee_id && Number(q.is_occupied) === 1);

    // Fetch initial data once on component mount
    useEffect(() => {
        dispatch(fetchEmployees({ page: 1, limit: 1000, search: "", institute: "" }));
        dispatch(fetchPayStructure({ page: 1, limit: 1000, search: "" }));
        dispatch(fetchNpaData()); dispatch(fetchHraData()); dispatch(fetchDaData());
        dispatch(fetchUniformData()); dispatch(fetchTransportData()); dispatch(fetchGisData());
        dispatch(fetchEmployeeQuarterList({ page: 1, limit: 1000 }));
        dispatch(fetchGpfContribution());

        const now = new Date();
        const currentMonth = (now.getMonth() + 1).toString().padStart(2, '0');
        const currentYear = now.getFullYear().toString();
        const today = dayjs().format('YYYY-MM-DD');

        dispatch(updateField({ name: 'month', value: currentMonth }));
        dispatch(updateField({ name: 'year', value: currentYear }));
        dispatch(updateField({ name: 'processing_date', value: today }));
        dispatch(bulkUpdateField({ name: 'month', value: currentMonth }));
        dispatch(bulkUpdateField({ name: 'year', value: currentYear }));
        dispatch(bulkUpdateField({ name: 'processing_date', value: today }));
    }, [dispatch]);

    useEffect(() => {
        if (employees.length > 0) {
            setNonRetired(employees.filter(emp => emp.employee_status?.some(s => s.status !== 'Retired' && s.status !== 'Resigned')));
        }
    }, [employees]);



    useEffect(() => {
        if (formData.employee_id) {
            dispatch(fetchEmployeeBankdetail({ employeeId: formData.employee_id }));
            dispatch(fetchEmployeeById(formData.employee_id));
            dispatch(fetchNetSalary({ page: '1', limit: '1000', id: formData.employee_id, month: '', year: '' }));
        }
    }, [dispatch, formData.employee_id]);

    useEffect(() => {
        if (EmployeeDetail?.pension_scheme === 'NPS') {
            dispatch(fetchNpsContribution({ type: 'GOVT' }));
            dispatch(fetchNpsContribution({ type: 'Employee' }));
        }
    }, [dispatch, EmployeeDetail?.pension_scheme]);



    // Effect for pre-filling form fields based on fetched/calculated data
    useEffect(() => {
        // Pre-fill bank
        if (EmployeeDetail && employeeBank?.length > 0) {
            const activeBank = employeeBank.find(bank => bank.is_active === 1);
            if (activeBank && activeBank.id !== formData.employee_bank_id) {
                dispatch(updateField({ name: 'employee_bank_id', value: activeBank.id }));
            }
        }

        // Pre-fill pay structure
        if (filterPayStructure.length > 0 && filterPayStructure[0].id !== formData.pay_structure_id) {
            dispatch(updateField({ name: 'pay_structure_id', value: filterPayStructure[0].id }));
        }

        // Pre-fill rate IDs
        if (isHraEligible && hraList.length > 0 && !formData.hra_rate_id) dispatch(updateField({ name: 'hra_rate_id', value: hraList[0].id }));
        if (EmployeeDetail?.npa_eligibility && npaList.length > 0 && !formData.npa_rate_id) dispatch(updateField({ name: 'npa_rate_id', value: npaList[0].id }));
        if (daList.length > 0 && !formData.da_rate_id) dispatch(updateField({ name: 'da_rate_id', value: daList[0].id }));
        if (isUniformEligible && uniformList.length > 0 && !formData.uniform_rate_id) dispatch(updateField({ name: 'uniform_rate_id', value: uniformList[0].id }));

        // Pre-fill transport rate
        const structure = filterPayStructure[0];
        if (structure && transportList.length > 0) {
            const transportItem = transportList.find(t => t.pay_matrix_level == structure.pay_matrix_cell?.pay_matrix_level?.name);
            if (transportItem && transportItem.id !== formData.transport_rate_id) {
                dispatch(updateField({ name: 'transport_rate_id', value: transportItem.id }));
            }

        }
    }, [dispatch, EmployeeDetail, employeeBank, filterPayStructure, hraList, npaList, daList, uniformList, transportList, isHraEligible, isUniformEligible]);

    // Prefill Rate IDs based on eligibility
    useEffect(() => {
        if (!EmployeeDetail || filterPayStructure.length === 0 || transportList.length === 0 || daList.length === 0) {
            return;
        }

        if (isHraEligible && hraList.length > 0 && !formData.hra_rate_id) dispatch(updateField({ name: 'hra_rate_id', value: hraList[0].id }));
        if (EmployeeDetail?.npa_eligibility && npaList.length > 0 && !formData.npa_rate_id) dispatch(updateField({ name: 'npa_rate_id', value: npaList[0].id }));
        if (daList.length > 0 && !formData.da_rate_id) dispatch(updateField({ name: 'da_rate_id', value: daList[0].id }));
        if (isUniformEligible && uniformList.length > 0 && !formData.uniform_rate_id) dispatch(updateField({ name: 'uniform_rate_id', value: uniformList[0].id }));

        const structure = payStructure.find((s) => s.employee_id === formData.employee_id);

        if (structure && transportList.length > 0) {
            const transportItem = transportList.find(t => t.pay_level == structure.pay_matrix_cell?.pay_matrix_level?.name);
            if (transportItem && transportItem.id !== formData.transport_rate_id) {
                dispatch(updateField({ name: 'transport_rate_id', value: transportItem.id }));
            }
        }
    }, [dispatch, EmployeeDetail, payStructure, formData.employee_id, isHraEligible, isUniformEligible, hraList, npaList, daList, uniformList, transportList]);


    // useEffect(() => {
    //     if (calculationComplete && selectNext && isProcessing) {
    //         console.log("Calculation completed, proceeding to next step");
    //     }
    // }, [calculationComplete, selectNext, isProcessing]);

    // *** CENTRALIZED CALCULATION ENGINE ***
    useEffect(() => {
        const structure = payStructure.find((s) => s.employee_id === formData.employee_id);
        console.log("Structure:", structure);
        console.log("NPS Rates - Govt:", govtContributionRate, "Employee:", employeeContributionRate);
        console.log("SelectNext triggered:", selectNext);

        // Check for basic required data - only return if absolutely essential data is missing
        if (!structure || !EmployeeDetail) {
            console.log("Missing essential data - structure or EmployeeDetail");
            return;
        }

        console.log("Proceeding with calculation - will handle missing rate data gracefully");

        const calculatedPayload = {};
        const local_basic_pay = EditMode  ? Number(formData.basic_pay) : structure?.pay_matrix_cell?.amount;
        calculatedPayload.basic_pay = local_basic_pay;

        // Handle NPA calculation - use available data or default to 0
        let local_npa_amount = 0;
        if (structure?.employee?.npa_eligibility && npaList.length > 0) {
            const npaItem = npaList.find((npa) => npa.id === formData.npa_rate_id);
            const npaRate = npaItem?.rate_percentage || 0;
            const threshold = 237500;
            if (npaRate > 0) {
                const npa_calc = customRound((local_basic_pay * npaRate) / 100);
                const defaultNpa = (local_basic_pay < threshold && local_basic_pay + npa_calc > threshold) ? (threshold - local_basic_pay) : npa_calc;
                local_npa_amount =  defaultNpa;
                if (local_basic_pay >= threshold) local_npa_amount = 0;
            }
        }
        calculatedPayload.npa_amount = local_npa_amount;

        const local_payPlusNpa = local_basic_pay + local_npa_amount;
        calculatedPayload.pay_plus_npa = (local_payPlusNpa > 237500 && local_basic_pay < 237500) ? 237500 : local_payPlusNpa;

        // Handle DA calculation - use available data or default to 0
        let daRate = 0;
        if (daList.length > 0) {
            const daItem = daList.find((da) => da.id === formData.da_rate_id);
            daRate = daItem?.rate_percentage || 0;
        }
        const defaultDa = customRound((calculatedPayload.pay_plus_npa) * daRate / 100);
        calculatedPayload.da_amount =  defaultDa;

        // Handle HRA calculation - use available data or default to 0
        let hraRate = 0;
        if (isHraEligible && !isQuarterOccupied && hraList.length > 0) {
            const hraItem = hraList.find((hra) => hra.id === formData.hra_rate_id);
            hraRate = hraItem?.rate_percentage || 0;
        }
        const defaultHra = customRound((calculatedPayload.pay_plus_npa) * hraRate / 100);
        calculatedPayload.hra_amount =  defaultHra;

        // Handle Uniform calculation - use available data or default to 0
        let uniformAmount = 0;
        if (isUniformEligible && uniformList.length > 0) {
            const uniformItem = uniformList.find((u) => u.id === formData.uniform_rate_id);
            uniformAmount = uniformItem?.amount || 0;
        }
        calculatedPayload.uniform_rate_amount =  EditMode ? Number(formData.uniform_rate_amount) : uniformAmount;

        // Handle Transport calculation - use available data or default to 0
        let transportBaseAmount = 0;
        if (transportList.length > 0) {
            const transportItem = transportList.find((t) => t.id === formData.transport_rate_id);
            transportBaseAmount = transportItem?.amount || 0;
        }
        const defaultTa = structure?.employee?.pwd_status ? transportBaseAmount * 2 : transportBaseAmount;
        calculatedPayload.transport_amount =  EditMode ? Number(formData.transport_amount) : defaultTa;

        const defaultDaonTa = customRound((calculatedPayload.transport_amount * daRate) / 100);
        calculatedPayload.da_on_ta = EditMode ? Number(formData.da_on_ta) : defaultDaonTa;

        // Handle GIS calculation - use available data or default to 0
        let gisAmount = 0;
        if (gisList.length > 0) {
            const gisItem = gisList.find((gis) => gis.pay_matrix_level == structure?.pay_matrix_cell?.pay_matrix_level?.name);
            gisAmount = gisItem?.amount || 0;
        }
        const deafultgis = structure?.employee?.gis_eligibility ? gisAmount : 0;
        calculatedPayload.gis = EditMode ? Number(formData.gis) : deafultgis;

        if (isQuarterOccupied) {
            const occupiedQuarter = quarters.find(q => q.employee_id === formData.employee_id && Number(q.is_occupied) === 1);
            const defaultLicenseFee = occupiedQuarter ? (occupiedQuarter.quarter?.license_fee || 0) : 0;
            calculatedPayload.license_fee =  EditMode ? Number(formData.license_fee) : defaultLicenseFee;
        } else {
            calculatedPayload.license_fee = EditMode ? Number(formData.license_fee) : 0;
        }

        if (EmployeeDetail.pension_scheme === 'NPS') {
            // Check if NPS rates are available before calculating
            if (govtContributionRate === null || employeeContributionRate === null || npsContribution?.loading) {
                console.log("NPS rates not yet available or loading, skipping NPS calculation");
                calculatedPayload.employee_contribution_10 = 0;
                calculatedPayload.govt_contribution_14_recovery = 0;
                calculatedPayload.govt_contribution = 0;
                calculatedPayload.gpf = 0;
            } else {
                const npsBase = local_basic_pay + local_npa_amount + calculatedPayload.da_amount;
                const defaultEmpContr = customRound((employeeContributionRate / 100) * npsBase);
                calculatedPayload.employee_contribution_10 =  defaultEmpContr;
                const govtContribution = customRound((govtContributionRate / 100) * npsBase);
                calculatedPayload.govt_contribution_14_recovery =  govtContribution;
                calculatedPayload.govt_contribution = govtContribution;
                calculatedPayload.gpf = 0;
                console.log("NPS calculation successful - Govt Contribution:", govtContribution);
            }
        } else if (EmployeeDetail.pension_scheme === 'GPF') {
            // calculatedPayload.gpf = customRound((formData.gpf / 100) * (calculatedPayload.pay_plus_npa));
            calculatedPayload.employee_contribution_10 = 0;
            calculatedPayload.govt_contribution_14_recovery = 0;
            calculatedPayload.govt_contribution = 0;
        }

        // Calculate total earnings from the payload we've built
        const totalEarnings = [
            calculatedPayload.basic_pay, calculatedPayload.npa_amount, calculatedPayload.da_amount,
            calculatedPayload.hra_amount, calculatedPayload.uniform_rate_amount, calculatedPayload.transport_amount,
            calculatedPayload.da_on_ta, calculatedPayload.govt_contribution,
            Number(formData.spacial_pay) || 0, // Include user-entered values
            Number(formData.da_1) || 0,
            Number(formData.da_2) || 0,
            Number(formData.itc_leave_salary) || 0,
            ...dynamicObjects.map((obj) => Number(obj.amount) || 0)
        ].reduce((sum, val) => sum + (Number(val) || 0), 0);

        calculatedPayload.total_pay = totalEarnings;

        // Calculate total deductions from the payload and user-entered fields
        const totalDeductions = [
            calculatedPayload.gis, calculatedPayload.license_fee,
            formData.gpf, calculatedPayload.employee_contribution_10,
            calculatedPayload.govt_contribution_14_recovery,
            Number(formData.income_tax) || 0, // Include user-entered values
            Number(formData.professional_tax) || 0,
            Number(formData.nfch_donation) || 0,
            Number(formData.lic) || 0,
            Number(formData.credit_society_membership) || 0,
            Number(formData.computer_advance_installment) || 0,
            ...deductionDynamicObjects.map((obj) => Number(obj.amount) || 0)
        ].reduce((sum, val) => sum + (Number(val) || 0), 0);

        console.log("Total Deductions:", totalDeductions);

        calculatedPayload.total_deductions = totalDeductions;

        // Calculate and add net_amount to the payload
        calculatedPayload.net_amount = totalEarnings - totalDeductions;

        // Prefill processing date with the current date
        const today = dayjs().format('YYYY-MM-DD');
        calculatedPayload.processing_date = today;
        dispatch(bulkUpdateField({ name: 'processing_date', value: today }))

        dispatch(setCalculatedAmounts(calculatedPayload));
        // setSelectNext(false)
        setCalculationComplete(true);

        console.log("Calculation completed successfully:", calculatedPayload);

        // If this was triggered by selectNext, we can now proceed
        if (selectNext) {
            console.log("Calculation completed after selectNext, ready to proceed");
        }
    }, [
        // Core data triggers
        formData.employee_id, formData.pay_structure_id,
        payStructure, EmployeeDetail, quarters, npaList, hraList, daList,
        uniformList, transportList, gisList, isQuarterOccupied,
        govtContributionRate, employeeContributionRate, npsContribution,

        // Rate ID triggers
        formData.npa_rate_id, formData.hra_rate_id, formData.da_rate_id,
        formData.uniform_rate_id, formData.transport_rate_id,

        
        // User manual input triggers
        formData.basic_pay, formData.npa_amount, formData.da_amount,
        formData.hra_amount, formData.uniform_rate_amount,
        formData.transport_amount, formData.da_on_ta, formData.gis,
        formData.license_fee,
        

        // Deduction triggers that are also used in calculation
        formData.gpf, formData.employee_contribution_10,
        formData.income_tax, formData.professional_tax, formData.nfch_donation,
        formData.lic, formData.credit_society_membership,
        formData.computer_advance_installment,

        formData.govt_contribution_14_recovery, formData.govt_contribution,
        formData.employee_contribution_10,

        // Other state triggers
        dispatch,selectNext,
    ]);

    const handleDownloadPdf = () => {
        const element = slipRef.current;
        if (!element) return;
        const elementWidth = element.offsetWidth;
        const elementHeight = element.offsetHeight;
        const orientation = elementWidth > elementHeight ? 'l' : 'p';
        const opt = {
            margin: 0,
            filename: `PaySlip_${EmployeeDetail?.employee_code}_${formData.month}_${formData.year}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true, windowWidth: elementWidth, windowHeight: elementHeight },
            jsPDF: { unit: 'px', format: [elementWidth, elementHeight], orientation: orientation, hotfixes: ['px_scaling'] }
        };
        html2pdf().from(element).set(opt).save();
    };


    // Generic handler for user-editable fields
    const handleChange = (e) => {
        const { name, value } = e.target;
        SetEditMode(true);

        if (activeStep === 2) {
            dispatch(setDeductionField({ name, value }));
        } else {
            dispatch(updateField({ name, value }));
        }
    };

    // ... handleSubmit, handleNext, dynamic object functions are unchanged ...

    const handleSubmit = async (e) => {
        e?.preventDefault();
        if (mode === 'bulk') {
            const { month, year } = bulkForm;
            await dispatch(createBulkSalry(bulkForm)).unwrap()
                .then(() => {
                    toast.success('Bulk salary processing initiated successfully!');
                    dispatch(resetBulkState());
                    navigate(`/net-salary?month=${month}&year=${year}`)
                })
                .catch((err) => {
                    toast.error(err);
                })
        } else {
            const payload = { ...formData, salary_arrears: dynamicObjects, deduction_recoveries: deductionDynamicObjects }
            await dispatch(addPaySlip(payload)).unwrap()
                .then(() => {
                    toast.success('Payslip created successfully!');
                    dispatch(reset());
                })
                .catch((err) => {
                    toast.error(err);
                })
        }
    };


    useEffect(() => {
        if (calculationComplete && selectNext && isProcessing) {
            console.log("All clear! Calculations are done, proceeding to final validation and next step.");

            // Perform final checks that rely on newly calculated data
            const isDuplicate = netSalary?.some(
                slip =>
                    slip.employee_id === formData.employee_id && // Ensure check is for the same employee
                    slip.month === formData.month &&
                    slip.year === formData.year
            );

            if (isDuplicate) {
                toast.error('A payslip for this employee for the selected month and year already exists.');
                setIsProcessing(false); // Reset state
                setSelectNext(false);
                return;
            }

            if (formData.processing_date && EmployeeDetail?.date_of_joining) {
                const processingDate = new Date(formData.processing_date);
                const joiningDate = new Date(EmployeeDetail.date_of_joining);

                if (processingDate < joiningDate) {
                    toast.error("Processing date cannot be before the employee's joining date.");
                    setIsProcessing(false); // Reset state
                    setSelectNext(false);
                    return;
                }
            }

            // If all checks pass, finally move to the next step
            dispatch(nextStep());

            // Reset flags for the next operation
            setIsProcessing(false);
            setSelectNext(false);
        }
    }, [calculationComplete, selectNext, isProcessing, dispatch, formData, EmployeeDetail, netSalary]);


    const handleNext = async () => {
        if (isProcessing) {
            console.log("Already processing, please wait...");
            return;
        }


        if (activeStep === 0 && mode === 'bulk') {
            handleSubmit();
            return;
        }


        const result = validateStep({ formData, activeStep });
        if (!result.valid) {
            toast.error(result.message);
            return;
        }


        setIsProcessing(true);
        setCalculationComplete(false);
        setSelectNext(true);


        if (activeStep !== 1 && mode === 'individual') {
            dispatch(nextStep());
            setIsProcessing(false);
            setSelectNext(false);
        }
    };


    // Function to handle adding a new object
    const handleAddObject = () => {
        if (newObject.type && newObject.amount) {
            setDynamicObjects([...dynamicObjects, newObject]);
            setNewObject({ type: '', amount: '' }); // Reset input fields
        } else {
            toast.error('Please select a type and enter a amount.');
        }
    };

    // Function to handle removing an object
    const handleRemoveObject = (index) => {
        const updatedObjects = dynamicObjects.filter((_, i) => i !== index);
        setDynamicObjects(updatedObjects);
    };

    // Function to handle adding a new object
    const handleAddDeductionObject = () => {
        if (deductionObject.type && deductionObject.amount) {
            setDeductionDynamicObjects([...deductionDynamicObjects, deductionObject]);
            setDeductionObject({ type: '', amount: '' }); // Reset input fields
        } else {
            toast.error('Please select a type and enter a amount.');
        }
    };

    // Function to handle removing an object
    const handleRemoveDeductionObject = (index) => {
        const updatedObjects = deductionDynamicObjects.filter((_, i) => i !== index);
        setDeductionDynamicObjects(updatedObjects);
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
                                    <Grid item size={{ xs: 12 }} >
                                        <TextField label="Month" value={months.find(m => m.value === bulkForm.month)?.label || ''} fullWidth disabled />
                                    </Grid>
                                    <Grid item size={{ xs: 12 }}>
                                        <TextField label="Year" value={bulkForm.year || ''} fullWidth disabled />
                                    </Grid>
                                    <Grid item size={{ xs: 6 }}>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DatePicker
                                                label="Processing Date"
                                                format="DD-MM-YYYY"
                                                name="processing_date"
                                                value={bulkForm.processing_date ? dayjs(bulkForm.processing_date) : null}
                                                onChange={(date) => {
                                                    const formatted = date ? dayjs(date).format('YYYY-MM-DD') : '';
                                                    dispatch(bulkUpdateField({ name: "processing_date", value: formatted }))
                                                }}
                                                minDate={dayjs()}
                                                slotProps={{
                                                    textField: {
                                                        fullWidth: true,
                                                        name: 'processing_date',
                                                    },
                                                }}
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
                    <>
                        <Grid container spacing={2}>
                            <Grid item size={{ xs: 4 }}>
                                <Autocomplete
                                    options={nonRetired}
                                    getOptionLabel={(option) => `${option?.name || "NA"} - (${option.employee_code})`}
                                    value={nonRetired.find(emp => emp.id === formData.employee_id) || null}
                                    onChange={(_, newValue) => {
                                        // This will clear all old data and set the new employee ID
                                        dispatch(resetForNewEmployee(newValue ? newValue.id : null));

                                        // Also clear dynamic arrears/deductions when employee changes
                                        setDynamicObjects([]);
                                        setDeductionDynamicObjects([]);
                                        SetEditMode(false);
                                    }}
                                    renderInput={(params) => <TextField {...params} required label="Employee" fullWidth />}
                                    isOptionEqualToValue={(option, value) => option.id === value.id}
                                />
                            </Grid>
                            <Grid item size={{ xs: 4 }}><TextField label="Status" value={EmployeeDetail?.employee_status?.[0].status || ''} fullWidth disabled /></Grid>
                            <Grid item size={{ xs: 4 }}>
                                <TextField select required name="employee_bank_id" label="Employee Bank" value={formData.employee_bank_id || ''} fullWidth onChange={handleChange}>
                                    {employeeBank?.filter(b => b.is_active === 1).map(b => (
                                        <MenuItem key={b.id} value={b.id}>{b.bank_name} - {b.account_number}</MenuItem>
                                    )) ?? <MenuItem value="">No Active Bank</MenuItem>}
                                </TextField>
                            </Grid>
                            <Grid item size={{ xs: 4 }}>
                                <TextField select required name="pay_structure_id" label="Pay Structure" value={formData.pay_structure_id || ''} fullWidth onChange={handleChange}>
                                    {filterPayStructure.map((data) => (
                                        <MenuItem key={data.id} value={data.id}>{`${data.pay_matrix_cell?.pay_matrix_level?.name} - ${data.pay_matrix_cell?.index} - ${data.pay_matrix_cell?.amount}`}</MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item size={{ xs: 4 }}><TextField label="Basic Pay" value={formData.basic_pay} name='basic_pay' fullWidth onChange={handleChange} /></Grid>
                            <Grid item size={{ xs: 4 }}><TextField label="Month" value={months.find(m => m.value === formData.month)?.label || ''} fullWidth disabled /></Grid>
                            <Grid item size={{ xs: 4 }}><TextField label="Year" value={formData.year || ''} fullWidth disabled /></Grid>

                            <Grid item size={{ xs: 4 }}>
                                <TextField select required name="npa_rate_id" label="NPA Rate %" value={formData.npa_rate_id || ''} fullWidth onChange={handleChange} disabled={!EmployeeDetail?.npa_eligibility}>
                                    {npaList.map((npa) => (<MenuItem key={npa.id} value={npa.id}>{npa.rate_percentage}</MenuItem>))}
                                </TextField>
                            </Grid>
                            <Grid item size={{ xs: 4 }}><TextField label="NPA Amount" name='npa_amount' value={formData.npa_amount} fullWidth onChange={handleChange} disabled={!EmployeeDetail?.npa_eligibility} /></Grid>

                            <Grid item size={{ xs: 4 }}>
                                <TextField select required name="hra_rate_id" label="HRA Rate %" value={formData.hra_rate_id || ''} fullWidth onChange={handleChange} disabled={!isHraEligible || isQuarterOccupied}>
                                    {hraList.map((hra) => (<MenuItem key={hra.id} value={hra.id}>{`${hra.city_class} - ${hra.rate_percentage}%`}</MenuItem>))}
                                </TextField>
                            </Grid>
                            <Grid item size={{ xs: 4 }}><TextField label="HRA Amount" name='hra_amount' value={formData.hra_amount} fullWidth onChange={handleChange} disabled={!isHraEligible || isQuarterOccupied} /></Grid>

                            <Grid item size={{ xs: 4 }}>
                                <TextField select required name="da_rate_id" label="DA Rate %" value={formData.da_rate_id || ''} fullWidth onChange={handleChange}>
                                    {daList.map((da) => (<MenuItem key={da.id} value={da.id}>{da.rate_percentage}</MenuItem>))}
                                </TextField>
                            </Grid>
                            <Grid item size={{ xs: 4 }}><TextField label="DA Amount" name='da_amount' value={formData.da_amount} fullWidth onChange={handleChange} /></Grid>

                            <Grid item size={{ xs: 4 }}>
                                <TextField select required name="uniform_rate_id" label="Uniform Allowance" value={formData.uniform_rate_id || ''} fullWidth onChange={handleChange} disabled={!isUniformEligible}>
                                    {uniformList.map((u) => (<MenuItem key={u.id} value={u.id}>Post {u.applicable_post} - ₹{u.amount}</MenuItem>))}
                                </TextField>
                            </Grid>
                            <Grid item size={{ xs: 4 }}><TextField label="Uniform Amount" name='uniform_rate_amount' value={formData.uniform_rate_amount} fullWidth onChange={handleChange} /></Grid>

                            <Grid item size={{ xs: 4 }}>
                                <TextField select required name="transport_rate_id" label="Transport Allowance" value={formData.transport_rate_id || ''} fullWidth onChange={handleChange}>
                                    {transportList.map((t) => (<MenuItem key={t.id} value={t.id}>Level {t.pay_matrix_level} - ₹{t.amount}</MenuItem>))}
                                </TextField>
                            </Grid>
                            <Grid item size={{ xs: 4 }}><TextField label="Transport Amount" name='transport_amount' value={formData.transport_amount} fullWidth onChange={handleChange} /></Grid>
                            <Grid item size={{ xs: 4 }}><TextField label="DA on TA" name='da_on_ta' value={formData.da_on_ta || '0'} fullWidth onChange={handleChange} /></Grid>
                            {EmployeeDetail?.pension_scheme === 'NPS' && (
                                <Grid item size={{ xs: 4 }}>
                                    <TextField
                                        label={`NPS Govt Contribution`}
                                        name='govt_contribution'
                                        value={npsContribution?.loading ? 'Loading...' : formData.govt_contribution}
                                        fullWidth
                                        disabled={npsContribution?.loading}
                                        onChange={handleChange}
                                    />
                                </Grid>
                            )}

                            <Grid item size={{ xs: 4 }}><TextField name="spacial_pay" label="Special Pay" value={formData.spacial_pay || ''} fullWidth onChange={handleChange} /></Grid>
                            <Grid item size={{ xs: 4 }}><TextField name="da_1" label="DA 1" value={formData.da_1 || ''} fullWidth onChange={handleChange} /></Grid>
                            <Grid item size={{ xs: 4 }}><TextField name="da_2" label="DA 2" value={formData.da_2 || ''} fullWidth onChange={handleChange} /></Grid>
                            <Grid item size={{ xs: 4 }}><TextField name="itc_leave_salary" label="LTC Leave Salary" value={formData.itc_leave_salary || ''} fullWidth onChange={handleChange} /></Grid>
                            <Grid item size={{ xs: 4 }}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        label="Processing Date"
                                        format="DD-MM-YYYY"
                                        name="processing_date"
                                        value={formData.processing_date ? dayjs(formData.processing_date) : dayjs()}
                                        onChange={(date) => {
                                            const formatted = date ? dayjs(date).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD');
                                            dispatch(updateField({ name: "processing_date", value: formatted }))
                                        }}
                                        slotProps={{
                                            textField: {
                                                fullWidth: true,
                                                name: 'processing_date',
                                                required: true,
                                                helperText: "Select the processing date for this salary"
                                            },
                                        }}
                                    />
                                </LocalizationProvider>
                            </Grid>
                            <Grid item size={{ xs: 4 }}>
                                <TextField label="Remarks" name="remarks" fullWidth value={formData.remarks} onChange={handleChange} />
                            </Grid>

                        </Grid>
                        <Box sx={{ mb: 4, mt: 4 }}>
                            <Typography variant="h3" gutterBottom>
                                Additional Arrears
                            </Typography>
                            <Grid container spacing={2} sx={{ alignItems: 'center' }}>
                                <Grid item size={{ xs: 4 }}>
                                    <TextField
                                        select
                                        label="Type"
                                        value={newObject.type}
                                        onChange={(e) => setNewObject({ ...newObject, type: e.target.value })}
                                        fullWidth
                                    >
                                        {typeOptions.map((type, index) => (
                                            <MenuItem key={index} value={type}>
                                                {type}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                                <Grid item size={{ xs: 4 }}>
                                    <TextField
                                        label="Value (₹)"
                                        type="text"
                                        value={newObject.amount}
                                        onChange={(e) => setNewObject({ ...newObject, amount: e.target.value })}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item size={{ xs: 2 }}>
                                    <Button variant="contained" color="primary" onClick={handleAddObject} fullWidth>
                                        Add More
                                    </Button>
                                </Grid>
                            </Grid>

                            {/* Display the list of added objects */}
                            {dynamicObjects.length > 0 && (
                                <Box sx={{ mt: 2 }}>
                                    <Typography variant="subtitle1" gutterBottom>
                                        Added Items
                                    </Typography>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <thead>
                                            <tr>
                                                <th style={{ border: '1px solid #ccc', padding: '8px' }}>Type</th>
                                                <th style={{ border: '1px solid #ccc', padding: '8px' }}>Value (₹)</th>
                                                <th style={{ border: '1px solid #ccc', padding: '8px' }}>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {dynamicObjects.map((obj, index) => (
                                                <tr key={index}>
                                                    <td style={{ border: '1px solid #ccc', padding: '8px' }}>{obj.type}</td>
                                                    <td style={{ border: '1px solid #ccc', padding: '8px' }}>{obj.amount}</td>
                                                    <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                                                        <Button
                                                            variant="outlined"
                                                            color="secondary"
                                                            onClick={() => handleRemoveObject(index)}
                                                        >
                                                            Remove
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </Box>
                            )}
                        </Box>

                    </>
                );
            case 2:
                return (
                    <>
                        <Grid container spacing={2}>
                            {EmployeeDetail?.pension_scheme === 'NPS' ? (
                                <>
                                    <Grid item size={{ xs: 4 }}>
                                        <TextField
                                            label={`NPS Employee Contribution`}
                                            fullWidth
                                            value={npsContribution?.loading ? 'Loading...' : (formData.employee_contribution_10 || 0)}
                                            disabled={npsContribution?.loading}
                                        />
                                    </Grid>
                                    <Grid item size={{ xs: 4 }}>
                                        <TextField
                                            label={`NPS Govt Contribution`}
                                            fullWidth
                                            value={npsContribution?.loading ? 'Loading...' : (formData.govt_contribution_14_recovery || 0)}
                                            disabled={npsContribution?.loading}
                                        />
                                    </Grid>
                                </>
                            ) : (
                                <Grid item size={{ xs: 4 }}><TextField name="gpf" label="GPF Deduction" fullWidth value={formData.gpf} onChange={handleChange} /></Grid>
                            )}
                            <Grid item size={{ xs: 4 }}><TextField name="income_tax" label="Income Tax" fullWidth onChange={handleChange} value={formData.income_tax || ''} /></Grid>
                            <Grid item size={{ xs: 4 }}><TextField name="professional_tax" label="Professional Tax" fullWidth onChange={handleChange} value={formData.professional_tax || ''} /></Grid>
                            <Grid item size={{ xs: 4 }}><TextField name="license_fee" label="License Fee" fullWidth onChange={handleChange} value={formData.license_fee} /></Grid>
                            <Grid item size={{ xs: 4 }}><TextField name="nfch_donation" label="NFCH Donation" fullWidth onChange={handleChange} value={formData.nfch_donation || ''} /></Grid>
                            <Grid item size={{ xs: 4 }}><TextField name="lic" label="LIC" fullWidth onChange={handleChange} value={formData.lic || ''} /></Grid>
                            <Grid item size={{ xs: 4 }}><TextField name="gis" label="GIS" fullWidth onChange={handleChange} value={formData.gis} /></Grid>
                            {
                                EmployeeDetail?.employee_loan.length > 0 ? (
                                    <>
                                        <Grid item size={{ xs: 4 }}>
                                            <TextField name="computer_advance_installment" label="Computer Loan Installment" fullWidth onChange={handleChange} value={formData.computer_advance_installment || ''} />
                                        </Grid>
                                        {/* <Grid item size={{ xs: 4 }}>
                                                <TextField name="computer_advance_balance" label="Computer Loan Remaining Balance" fullWidth disabled value={formData.computer_advance_balance || ''} />
                                            </Grid> */}
                                    </>
                                )
                                    : ''
                            }

                            <Grid item size={{ xs: 4 }}>
                                <TextField name="credit_society_membership" label="Credit Society Membership" fullWidth onChange={handleChange} value={formData.credit_society_membership} disabled={!creditEligible} />
                            </Grid>
                        </Grid>

                        <Box sx={{ mb: 4, mt: 4 }}>
                            <Typography variant="h3" gutterBottom>
                                Additional Recovery
                            </Typography>
                            <Grid container spacing={2} sx={{ alignItems: 'center' }}>
                                <Grid item size={{ xs: 4 }}>
                                    <TextField
                                        select
                                        label="Type"
                                        value={deductionObject.type}
                                        onChange={(e) => setDeductionObject({ ...deductionObject, type: e.target.value })}
                                        fullWidth
                                    >
                                        {typeDeduction.map((type, index) => (
                                            <MenuItem key={index} value={type}>
                                                {type}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                                <Grid item size={{ xs: 4 }}>
                                    <TextField
                                        label="Value (₹)"
                                        type="text"
                                        value={deductionObject.amount}
                                        onChange={(e) => setDeductionObject({ ...deductionObject, amount: e.target.value })}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item size={{ xs: 2 }}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleAddDeductionObject}
                                        fullWidth
                                    >
                                        Add More
                                    </Button>
                                </Grid>
                            </Grid>

                            {/* Display the list of added deductions */}
                            {deductionDynamicObjects.length > 0 && (
                                <Box sx={{ mt: 2 }}>
                                    <Typography variant="subtitle1" gutterBottom>
                                        Added Items
                                    </Typography>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <thead>
                                            <tr>
                                                <th style={{ border: '1px solid #ccc', padding: '8px' }}>Type</th>
                                                <th style={{ border: '1px solid #ccc', padding: '8px' }}>Value (₹)</th>
                                                <th style={{ border: '1px solid #ccc', padding: '8px' }}>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {deductionDynamicObjects.map((obj, index) => (
                                                <tr key={index}>
                                                    <td style={{ border: '1px solid #ccc', padding: '8px' }}>{obj.type}</td>
                                                    <td style={{ border: '1px solid #ccc', padding: '8px' }}>{obj.amount}</td>
                                                    <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                                                        <Button
                                                            variant="outlined"
                                                            color="secondary"
                                                            onClick={() => handleRemoveDeductionObject(index)}
                                                        >
                                                            Remove
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </Box>
                            )}
                        </Box>
                    </>
                );
            case 3:

                const {
                    basic_pay, npa_amount, pay_plus_npa, da_amount, govt_contribution,
                    hra_amount, transport_amount, da_on_ta, spacial_pay, da_1, da_2,
                    itc_leave_salary, uniform_rate_amount, income_tax, professional_tax,
                    license_fee, nfch_donation, gpf, employee_contribution_10,
                    govt_contribution_14_recovery, gis, computer_advance_installment,
                    lic, credit_society_membership
                } = formData;

                // Total earnings are now just for display purposes, summing up the state values
                const totalEarnings = [
                    basic_pay, npa_amount, govt_contribution, hra_amount, da_amount,
                    transport_amount, da_on_ta, spacial_pay, da_1, da_2,
                    itc_leave_salary, uniform_rate_amount,
                    ...dynamicObjects.map((obj) => Number(obj.amount) || 0)
                ].reduce((sum, val) => sum + (Number(val) || 0), 0);

                // Total deductions (excluding LIC/Credit Society which are shown separately)
                const totalDeductionsCalc = [
                    income_tax, professional_tax, license_fee, nfch_donation, gpf,
                    employee_contribution_10, govt_contribution_14_recovery,
                    gis, computer_advance_installment,
                    ...deductionDynamicObjects.map((obj) => Number(obj.amount) || 0)
                ].reduce((sum, val) => sum + (Number(val) || 0), 0);

                // This is the net pay before the "additional deductions" section
                const netPayCalc = totalEarnings - totalDeductionsCalc;

                // These are considered separate for display on the payslip
                const totalAdditionalDeductions = (Number(lic) || 0) + (Number(credit_society_membership) || 0);

                // The final net pay is read directly from the state
                const finalNetPay = netPayCalc - totalAdditionalDeductions;

                const monthLabel = months.find(m => m.value == formData.month)?.label || formData.month;
                const matrix = filterPayStructure.find(p => p.id === formData.pay_structure_id)?.pay_matrix_cell;

                return (
                    <>
                        <div className="salary-slip-container" ref={slipRef}>
                            <div className="salary-slip">
                                <div className="slip-header">
                                    <div className="logo-section">
                                        {
                                            EmployeeDetail?.institute === 'NIOH' || EmployeeDetail?.institute === 'BOTH' ? (
                                                <img src={logo} alt="NIOH Logo" className="slip-logo w-100" />
                                            ) : null
                                        }

                                        {
                                            EmployeeDetail?.institute === 'ROHC' ? (
                                                <img src={rohcheader} alt="ROHC Logo" className="slip-logo w-100" />
                                            ) : null
                                        }

                                        {/* <div className="org-name">
                                            <h1>आई.सी.एम.आर.- राष्ट्रीय व्यावसायिक स्वास्थ्य संस्थान</h1>
                                            <h2>ICMR- National Institute Of Occupational Health</h2>
                                            <p>अहमदाबाद - 380016 भारत / Ahmedabad - 380016 India</p>
                                            <p className="who-text">व्यावसायिक स्वास्थ्य के लिए डब्ल्यूएचओ का सहयोग केंद्र</p>
                                            <p className="who-text">WHO Collaborating Center for Occupational Health</p>
                                        </div> */}
                                    </div>
                                </div>
                                <div className="slip-title">
                                    वेतन पर्ची / SALARY SLIP for {monthLabel} {formData.year}
                                </div>
                                <div className="employee-info">
                                    <table className="info-table">
                                        <tbody>
                                            <tr>
                                                <td className="info-label">कर्मचारी कोड / Emp. Code</td>
                                                <td className="info-value">{EmployeeDetail?.employee_code || 'N/A'}</td>
                                                <td className="info-label">नाम / Name</td>
                                                <td className="info-value">{EmployeeDetail?.name || 'N/A'}</td>
                                            </tr>
                                            <tr>
                                                <td className="info-label">पद / Designation</td>
                                                <td className="info-value">
                                                    {EmployeeDetail?.employee_designation?.[0]?.designation || 'N/A'}
                                                </td>
                                                <td className="info-label">वर्ग-कैडर / Group-Cadre</td>
                                                <td className="info-value">
                                                    {EmployeeDetail?.employee_designation?.[0]?.job_group}/{EmployeeDetail?.employee_designation?.[0]?.cadre || 'N/A'}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="info-label">मैट्रिक्स लैवल / Pay Level</td>
                                                <td className="info-value">{matrix?.pay_matrix_level?.name || 'N/A'}</td>
                                                <td className="info-label">पे इंडेक्स / Pay Index</td>
                                                <td className="info-value">{matrix ? `${matrix.index} | ₹${matrix.amount}` : 'N/A'}</td>
                                            </tr>
                                            <tr>
                                                <td className="info-label">ईमेल / Gmail</td>
                                                <td className="info-value">{EmployeeDetail?.email || 'N/A'}</td>
                                                <td className="info-label">लिंग / Gender</td>
                                                <td className="info-value">{EmployeeDetail?.gender || 'N/A'}</td>
                                            </tr>

                                            <tr>
                                                <td className="info-label">संस्थान / Institute</td>
                                                <td className="info-value">{EmployeeDetail?.institute || 'N/A'}</td>
                                                <td className="info-label">वृद्धि महीने / Inc. Month</td>
                                                <td className="info-value">{getMonthName(EmployeeDetail?.increment_month)}</td>
                                            </tr>
                                            <tr>
                                                <td className="info-label">पेंशन योजना / Pension Scheme</td>
                                                <td className="info-value">{EmployeeDetail?.pension_scheme}</td>
                                                <td className="info-label">पेंशन नंबर / pension_number</td>
                                                <td className="info-value">{EmployeeDetail?.pension_number}</td>
                                            </tr>
                                            <tr>
                                                <td className="info-label">स्थिति / status</td>
                                                <td className="info-value">{EmployeeDetail?.employee_status?.[0].status}</td>
                                                <td className="info-label">टिप्पणियाँ / remarks </td>
                                                <td className="info-value">{formData.remarks}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className="salary-details">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0px' }}>
                                        {/* Earnings Table */}
                                        <div style={{ flex: 1 }}>
                                            <table className="salary-table">
                                                <thead>
                                                    <tr>
                                                        <th style={{ width: '70%' }}>आय विवरण / EARNINGS</th>
                                                        <th style={{ width: '30%' }}>राशि / AMOUNT (₹)</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {basic_pay > 0 && (
                                                        <tr>
                                                            <td>मूल वेतन / Basic Pay</td>
                                                            <td className="amount-col">{formatCurrency(basic_pay)}</td>
                                                        </tr>
                                                    )}
                                                    {npa_amount > 0 && (
                                                        <tr>
                                                            <td>एन पी ए / NPA</td>
                                                            <td className="amount-col">{formatCurrency(npa_amount)}</td>
                                                        </tr>
                                                    )}
                                                    {pay_plus_npa > 0 && basic_pay > 0 && (
                                                        <tr>
                                                            <td>पे + एन पी ए / PAY + NPA</td>
                                                            <td className="amount-col">{formatCurrency(pay_plus_npa)}</td>
                                                        </tr>
                                                    )}
                                                    {da_amount > 0 && (
                                                        <tr>
                                                            <td>महंगाई भत्ता / Dearness Allowance</td>
                                                            <td className="amount-col">{formatCurrency(da_amount)}</td>
                                                        </tr>
                                                    )}
                                                    {Number(formData.govt_contribution) > 0 && (
                                                        <tr>
                                                            <td>{`${govtContributionRate}% सरकारी योगदान / Government Contribution`}</td>
                                                            <td className="amount-col">{formatCurrency(formData.govt_contribution)}</td>
                                                        </tr>
                                                    )}
                                                    {hra_amount > 0 && (
                                                        <tr>
                                                            <td>मकान किराया भत्ता / HRA</td>
                                                            <td className="amount-col">{formatCurrency(hra_amount)}</td>
                                                        </tr>
                                                    )}
                                                    {transport_amount > 0 && (
                                                        <tr>
                                                            <td>यात्रा भत्ता / Transport Allowance</td>
                                                            <td className="amount-col">{formatCurrency(transport_amount)}</td>
                                                        </tr>
                                                    )}
                                                    {da_on_ta > 0 && (
                                                        <tr>
                                                            <td>DA on T.A.</td>
                                                            <td className="amount-col">{formatCurrency(da_on_ta)}</td>
                                                        </tr>
                                                    )}
                                                    {Number(formData.spacial_pay) > 0 && (
                                                        <tr>
                                                            <td>विशेष वेतन / Special Pay</td>
                                                            <td className="amount-col">{formatCurrency(formData.spacial_pay)}</td>
                                                        </tr>
                                                    )}
                                                    {Number(formData.da_1) > 0 && (
                                                        <tr>
                                                            <td>महंगाई भत्ता / D.A.1</td>
                                                            <td className="amount-col">{formatCurrency(formData.da_1)}</td>
                                                        </tr>
                                                    )}
                                                    {Number(formData.da_2) > 0 && (
                                                        <tr>
                                                            <td>महंगाई भत्ता / D.A.2</td>
                                                            <td className="amount-col">{formatCurrency(formData.da_2)}</td>
                                                        </tr>
                                                    )}
                                                    {Number(formData.itc_leave_salary) > 0 && (
                                                        <tr>
                                                            <td>एलटीसी छुट्टी वेतन / LTC Leave Salary</td>
                                                            <td className="amount-col">{formatCurrency(formData.itc_leave_salary)}</td>
                                                        </tr>
                                                    )}
                                                    {uniform_rate_amount > 0 && (
                                                        <tr>
                                                            <td>वर्दी भत्ता / Uniform Allowance</td>
                                                            <td className="amount-col">{formatCurrency(uniform_rate_amount)}</td>
                                                        </tr>
                                                    )}

                                                    {/* Add dynamic earnings */}
                                                    {dynamicObjects.map((obj, index) => (
                                                        Number(obj.amount) > 0 && (
                                                            <tr key={index}>
                                                                <td>{obj.type}</td>
                                                                <td className="amount-col">{formatCurrency(obj.amount)}</td>
                                                            </tr>
                                                        )
                                                    ))}

                                                    <tr className="total-row">
                                                        <td><strong>कुल आय / TOTAL EARNINGS</strong></td>
                                                        <td className="amount-col"><strong>{formatCurrency(totalEarnings)}</strong></td>
                                                    </tr>

                                                </tbody>
                                            </table>
                                        </div>

                                        {/* Deductions Table */}
                                        <div style={{ flex: 1 }}>
                                            <table className="salary-table">
                                                <thead>
                                                    <tr>
                                                        <th style={{ width: '70%' }}>कटौती विवरण / DEDUCTIONS</th>
                                                        <th style={{ width: '30%' }}>राशि / AMOUNT (₹)</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {Number(formData.income_tax) > 0 && (
                                                        <tr>
                                                            <td>आयकर / Income Tax</td>
                                                            <td className="amount-col">{formatCurrency(formData.income_tax)}</td>
                                                        </tr>
                                                    )}
                                                    {Number(formData.professional_tax) > 0 && (
                                                        <tr>
                                                            <td>व्यवसाय कर / Professional Tax</td>
                                                            <td className="amount-col">{formatCurrency(formData.professional_tax)}</td>
                                                        </tr>
                                                    )}
                                                    {license_fee > 0 && (
                                                        <tr>
                                                            <td>लाइसेंस फीस / License Fee</td>
                                                            <td className="amount-col">{formatCurrency(license_fee)}</td>
                                                        </tr>
                                                    )}
                                                    {Number(formData.nfch_donation) > 0 && (
                                                        <tr>
                                                            <td>दान / NFCH Donation</td>
                                                            <td className="amount-col">{formatCurrency(formData.nfch_donation)}</td>
                                                        </tr>
                                                    )}
                                                    {Number(formData.gpf) > 0 && (
                                                        <tr>
                                                            <td>सा.भ.नि./GPF</td>
                                                            <td className="amount-col">{formatCurrency(formData.gpf)}</td>
                                                        </tr>
                                                    )}
                                                    {Number(formData.employee_contribution_10) > 0 && (
                                                        <tr>
                                                            <td>NPS Employee Contribution</td>
                                                            <td className="amount-col">{formatCurrency(formData.employee_contribution_10)}</td>
                                                        </tr>
                                                    )}
                                                    {Number(formData.govt_contribution_14_recovery) > 0 && (
                                                        <tr>
                                                            <td>{`${govtContributionRate}% सरकारी योगदान रिकवरी / Govt. Contribution Rec.`}</td>
                                                            <td className="amount-col">{formatCurrency(formData.govt_contribution_14_recovery)}</td>
                                                        </tr>
                                                    )}
                                                    {gis > 0 && (
                                                        <tr>
                                                            <td>समूह बीमा योजना / GIS</td>
                                                            <td className="amount-col">{formatCurrency(gis)}</td>
                                                        </tr>
                                                    )}
                                                    {Number(formData.computer_advance_installment) > 0 && (
                                                        <tr>
                                                            <td>कंप्यूटर ऋण किस्त / Computer Loan Installment </td>
                                                            <td className="amount-col">{formatCurrency(formData.computer_advance_installment)}</td>
                                                        </tr>
                                                    )}

                                                    {/* Add dynamic deductions */}
                                                    {deductionDynamicObjects.map((obj, index) => (
                                                        Number(obj.amount) > 0 && (
                                                            <tr key={index}>
                                                                <td>{obj.type}</td>
                                                                <td className="amount-col">{formatCurrency(obj.amount)}</td>
                                                            </tr>
                                                        )
                                                    ))}

                                                    <tr className="total-row">
                                                        <td><strong>कुल कटौती / TOTAL DEDUCTIONS</strong></td>
                                                        <td className="amount-col"><strong>{formatCurrency(totalDeductionsCalc)}</strong></td>
                                                    </tr>

                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>

                                <div className="net-pay">
                                    शुद्ध वेतन / NET PAY (BEFORE ADDL. DEDUCTIONS): ₹ {formatCurrency(netPayCalc)}
                                </div>
                                <div className="additional-deductions">
                                    <h3>अतिरिक्त कटौती / ADDITIONAL DEDUCTIONS</h3>
                                    <table className="deduction-table">
                                        <tbody>
                                            <tr>
                                                <td>जीवन बीमा निगम / LIC</td>
                                                <td className="amount">₹ {formatCurrency(formData.lic)}</td>
                                            </tr>
                                            <tr>
                                                <td>क्रेडिट सोसायटी / Credit Society</td>
                                                <td className="amount">₹ {formatCurrency(formData.credit_society_membership)}</td>
                                            </tr>
                                            <tr style={{ background: '#f0f0f0' }}>
                                                <td><strong>कुल अतिरिक्त कटौती / Total Additional Deductions</strong></td>
                                                <td className="amount"><strong>₹ {formatCurrency(totalAdditionalDeductions)}</strong></td>
                                            </tr>
                                            <tr style={{ background: '#e0e0e0' }}>
                                                <td><strong>अंतिम शुद्ध वेतन / FINAL NET PAY</strong></td>
                                                <td className="amount"><strong>₹ {formatCurrency(finalNetPay)}</strong></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className="slip-footer">
                                    <p><strong>यह कंप्यूटर जनरेटेड डॉक्यूमेंट है और इसमें हस्ताक्षर की आवश्यकता नहीं है</strong></p>
                                    <p><strong>This is a computer-generated document and does not require a signature</strong></p>
                                    <hr style={{ margin: '10px 0', border: 0, borderTop: '1px solid #000' }} />
                                    <p>Generated on: {new Date().toLocaleDateString('en-IN')} | ICMR-NIOH Payroll System</p>
                                </div>
                            </div>
                        </div>

                        <Box sx={{ textAlign: 'center', m: 4 }}>
                            <Button variant="contained" color="primary" onClick={handleDownloadPdf}>DOWNLOAD PDF</Button>
                        </Box>
                    </>

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
        } = formData;

        const { credit_society_membership, gpf } = formData;

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

                if (EmployeeDetail?.npa_eligibility && (npa_rate_id === null || npa_rate_id === undefined || npa_rate_id === '')) {
                    return { valid: false, message: 'NPA rate must be selected for eligible employees.' };
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

                if (!formData?.processing_date) {
                    return { valid: false, message: 'Processing date is required.' };
                }

                if (!employee_bank_id) {
                    return { valid: false, message: 'Employee bank must be selected.' };
                }


                return { valid: true };

            case 2:
                if (creditEligible && (credit_society_membership === null || credit_society_membership === undefined || credit_society_membership === '')) {
                    return { valid: false, message: 'Credit society membership is required for eligible employees.' };
                }


                if (EmployeeDetail?.pension_scheme === 'GPF' && !gpf) {
                    return { valid: false, message: 'GPF is required.' };
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
                        {steps.map((label) => <Step key={label}><StepLabel>{label}</StepLabel></Step>)}
                    </Stepper>
                    <Box sx={{ mb: 3 }}>{renderStepContent(activeStep)}</Box>
                    {/* Show Gross Salary as text above navigation buttons only for Step 1 */}
                    {activeStep === 1 && (
                        <Box sx={{ mb: 2, textAlign: 'right' }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                                Gross Salary: ₹ {formatCurrency([
                                    basic_pay,
                                    npa_amount,
                                    da_amount,
                                    formData.govt_contribution,
                                    hra_amount,
                                    uniform_rate_amount,
                                    transport_amount,
                                    formData.spacial_pay,
                                    formData.da_1,
                                    formData.da_2,
                                    formData.itc_leave_salary,
                                    da_on_ta,
                                    ...dynamicObjects.map((obj) => Number(obj.amount) || 0),
                                ].reduce((sum, val) => sum + (Number(val) || 0), 0))}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Total earnings before deductions
                            </Typography>
                        </Box>
                    )}
                    {/* Show Total Deductions as text above navigation buttons only for Step 2 */}
                    {activeStep === 2 && (
                        <Box sx={{ mb: 2, textAlign: 'right' }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#d32f2f' }}>
                                Total Deductions: ₹ {formatCurrency([
                                    formData.income_tax,
                                    formData.professional_tax,
                                    license_fee,
                                    formData.nfch_donation,
                                    formData.gpf,
                                    formData.employee_contribution_10,
                                    formData.govt_contribution_14_recovery,
                                    gis,
                                    formData.computer_advance_installment,
                                    formData.lic,
                                    formData.credit_society_membership,
                                    ...deductionDynamicObjects.map((obj) => Number(obj.amount) || 0),
                                ].reduce((sum, val) => sum + (Number(val) || 0), 0))}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Sum of all deductions before additional deductions
                            </Typography>
                        </Box>
                    )}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Button disabled={activeStep === 0 || isProcessing} onClick={() => {
                            dispatch(prevStep());
                            setSelectNext(false);
                        }}>Back</Button>
                        <Button
                            variant="contained"
                            type="button" // Prevent form submission
                            disabled={(activeStep === 0 && !mode) || isProcessing}
                            onClick={(e) => {
                                e.preventDefault(); // Prevent form submission
                                if (activeStep === steps.length - 1) {
                                    handleSubmit();
                                } else {
                                    handleNext();
                                }
                            }}>
                            {isProcessing ? 'Processing...' : (activeStep === steps.length - 1 ? 'Submit' : 'Next')}
                        </Button>
                    </Box>
                </Box>
            </form>
        </>
    );

};

export default SalaryProcessing;
