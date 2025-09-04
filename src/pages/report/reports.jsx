import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, FormGroup, Form } from 'react-bootstrap';
import {
    Card, CardContent, Typography, Button, Grid, TextField, Box, Collapse
} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import SummarizeIcon from '@mui/icons-material/Summarize';
import DownloadIcon from '@mui/icons-material/Download';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { fetchEmployees } from '../../redux/slices/employeeSlice';
import { fetchPensioners } from '../../redux/slices/pensionerSlice';
import { fetchReports } from '../../redux/slices/reportsSlice';
import { toast } from 'react-toastify';

const ReportsDashboard = () => {
    const dispatch = useDispatch();
    // const currentYear = new Date().getFullYear();
    const user = useSelector((state) => state.auth.user);
    const currentRoles = useSelector((state) =>
        state.auth.user?.roles?.map(role => role.name) || []
    );
    const isEndUser = currentRoles.includes("End Users");


    // Fetch employees and pensioners on mount
    useEffect(() => {
        dispatch(fetchEmployees({ page: 1, limit: 1000, search: '', institute: '' }));
        dispatch(fetchPensioners({ page: 1, limit: 1000, id: '', search: '' }));
    }, [dispatch]);

    const employeesData = useSelector((state) => state.employee.employees) || [];
    const pensioners = useSelector((state) => state.pensioner.pensioners) || [];
    const employees = employeesData?.filter(emp => emp?.user?.is_retired === 0);
  

    // ⬇️ Separate loading per report type
    const [loading, setLoading] = useState({
        all: false,
        employee: false,
        pensioner: false
    });

    const initialFilters = {
        all: { startMonth: '', startYear: '', endMonth: '', endYear: '' },
        employee: { startMonth: '', startYear: '', endMonth: '', endYear: '', employeeId: '' },
        pensioner: { startMonth: '', startYear: '', endMonth: '', endYear: '', pensionerId: '' }
    };
    const [filters, setFilters] = useState({ ...initialFilters });

    const [showFilters, setShowFilters] = useState({ all: false, employee: false, pensioner: false });

    const handleFilterChange = useCallback((type, field, value) => {
        setFilters(prev => ({
            ...prev,
            [type]: {
                ...prev[type],
                [field]: value
            }
        }));
    }, []); // Wrapped in useCallback

    // This is the CORRECTLY placed useEffect
    useEffect(() => {
        // The condition now goes INSIDE the hook
        if (isEndUser && user?.employee_code && employees?.length > 0) {
            const currentUserEmployee = employees.find(
                emp => String(emp.employee_code) === String(user.employee_code)
            );

            if (currentUserEmployee) {
                handleFilterChange('employee', 'employeeId', currentUserEmployee.id);
            }
        }
    }, [isEndUser, user, employees, handleFilterChange]);


    const handleReset = (type) => {
        const newFiltersForType = { ...initialFilters[type] };

        // If resetting employee filter and user is an End User, keep their ID
        if (type === 'employee' && isEndUser && user?.employee_code && employees?.length > 0) {
            const currentUserEmployee = employees.find(
                emp => String(emp.employee_code) === String(user.employee_code)
            );
            if (currentUserEmployee) {
                newFiltersForType.employeeId = currentUserEmployee.id;
            }
        }

        setFilters(prev => ({ ...prev, [type]: newFiltersForType }));
    };

    const toggleFilter = (type) => {
        setShowFilters(prev => ({ ...prev, [type]: !prev[type] }));
    };

    const handleExport = async (format = 'Excel', type = 'all') => {
        setLoading(prev => ({ ...prev, [type]: true }));

        try {
            const filterData = filters[type];

            const result = await dispatch(fetchReports({
                format,
                type,
                startMonth: filterData.startMonth,
                startYear: filterData.startYear,
                endMonth: filterData.endMonth,
                endYear: filterData.endYear,
                employeeId: filterData.employeeId,
                pensionerId: filterData.pensionerId,
            })).unwrap();

            const blob = new Blob([result.data], { type: result.data.type });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;

            // Add report type prefix to filename
            let filename = result.filename;
            if (type === 'all') {
                filename = `All-${result.filename}`;
            } else if (type === 'employee') {
                // Get employee name for filename
                const selectedEmployee = employees.find(emp => String(emp.id) === String(filterData.employeeId));
                const employeeName = selectedEmployee ? `${selectedEmployee.first_name} ${selectedEmployee.middle_name || ''} ${selectedEmployee.last_name}`.trim().replace(/\s+/g, '_') : '';
                filename = `${employeeName}-${result.filename}`;
            } else if (type === 'pensioner') {
                // Get pensioner name for filename
                const selectedPensioner = pensioners.find(pen => String(pen.id) === String(filterData.pensionerId));
                const pensionerName = selectedPensioner ? `${selectedPensioner.first_name} ${selectedPensioner.middle_name || ''} ${selectedPensioner.last_name}`.trim().replace(/\s+/g, '_') : '';
                filename = `Pensioner-${pensionerName}-${result.filename}`;
            }

            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

            toast.success('Report downloaded successfully!');
        } catch (error) {
            toast.error(error.message || 'Failed to download the report.');
        } finally {
            setLoading(prev => ({ ...prev, [type]: false }));
        }
    };

    const months = [
        { value: '', label: 'Select Month' },
        { value: 1, label: 'January' }, { value: 2, label: 'February' },
        { value: 3, label: 'March' }, { value: 4, label: 'April' },
        { value: 5, label: 'May' }, { value: 6, label: 'June' },
        { value: 7, label: 'July' }, { value: 8, label: 'August' },
        { value: 9, label: 'September' }, { value: 10, label: 'October' },
        { value: 11, label: 'November' }, { value: 12, label: 'December' },
    ];

    // const years = [
    //     { value: '', label: 'Select Year' },
    //     ...Array.from({ length: 3 }, (_, i) => ({
    //         value: currentYear - 3  + i,
    //         label: (currentYear - 3  + i).toString()
    //     })),
    //      { value: currentYear, label: currentYear.toString() },
    // ];

    const minYear = 2025;
    const currentYear = new Date().getFullYear();
    const years = [];

    // Add a default "Select Year" option
    years.push({ value: '', label: 'Select Year' });

    // Add years from minYear to currentYear
    for (let year = minYear; year <= currentYear; year++) {
        years.push({ value: year, label: year.toString() });
    }


    const renderCard = ({ type, title, color, extraFieldKey, icon }) => {
        const isEmployeeFieldDisabled = type === 'employee' && isEndUser;
        return (
            <Box mb={5}>
                <Card sx={{ backgroundColor: color, borderRadius: '16px', overflow: 'hidden', position: 'relative' }}>
                    {/* Filter Section */}
                    <Collapse in={showFilters[type]}>
                        <Box p={3} sx={{ borderBottom: '1px solid #ddd', backgroundColor: '#fff', }}>
                            <Grid container spacing={2}>
                                {['startMonth', 'startYear', 'endMonth', 'endYear'].map((key, i) => (
                                    <Grid item xs={12} md={3} key={i}>
                                        <FormGroup>
                                            <Form.Label>
                                                {key.includes('Month')
                                                    ? key.includes('start') ? 'Start Month' : 'End Month'
                                                    : key.includes('start') ? 'Start Year' : 'End Year'} *
                                            </Form.Label>
                                            <Form.Select
                                                value={filters[type][key]}
                                                onChange={(e) => handleFilterChange(type, key, parseInt(e.target.value) || '')}
                                                className={!filters[type][key] ? 'border-danger' : ''}
                                            >
                                                {(key.includes('Month') ? months : years).map((opt) => (
                                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                ))}
                                            </Form.Select>
                                        </FormGroup>
                                    </Grid>
                                ))}
                                {extraFieldKey && (
                                    <Grid item xs={12} md={4}>
                                        {extraFieldKey === 'employeeId' ? (
                                            !isEndUser && (
                                                <Autocomplete
                                                    options={employees}
                                                    getOptionLabel={(option) => `${option.first_name} ${option.middle_name || ''} ${option.last_name} - ${option.employee_code}`}
                                                    value={employees.find(emp => String(emp.id) === String(filters[type][extraFieldKey])) || null}
                                                    onChange={(_, newValue) => {
                                                        handleFilterChange(type, extraFieldKey, newValue ? newValue.id : '');
                                                    }}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            label="Employee"
                                                            variant="outlined"
                                                            fullWidth
                                                            sx={{ width: 400 }}
                                                            disabled={isEmployeeFieldDisabled}
                                                        />
                                                    )}
                                                    isOptionEqualToValue={(option, value) => String(option.id) === String(value.id)}
                                                    sx={{ width: 400 }}
                                                />
                                            )
                                        ) : (
                                            <Autocomplete
                                                options={pensioners}
                                                getOptionLabel={(option) => `${option.first_name} ${option.middle_name || ''} ${option.last_name} - ${option.ppo_no || option.id}`}
                                                value={pensioners.find(pen => String(pen.id) === String(filters[type][extraFieldKey])) || null}
                                                onChange={(_, newValue) => {
                                                    handleFilterChange(type, extraFieldKey, newValue ? newValue.id : '');
                                                }}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="Pensioner"
                                                        variant="outlined"
                                                        fullWidth
                                                        sx={{ width: 400 }}
                                                    />
                                                )}
                                                isOptionEqualToValue={(option, value) => String(option.id) === String(value.id)}
                                                sx={{ width: 400 }}
                                            />
                                        )}
                                    </Grid>
                                )}
                            </Grid>
                            <Box display="flex" justifyContent="flex-end" mt={2}>
                                <Button
                                    variant="outlined"
                                    sx={{ width: 120, fontWeight: 'bold' }}
                                    onClick={() => handleReset(type)}
                                >
                                    Reset
                                </Button>
                            </Box>
                        </Box>
                    </Collapse>

                    {/* Header */}
                    <Box sx={{
                        backgroundColor: color,
                        px: 3,
                        py: 2,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        color: '#fff',
                    }}>
                        <Typography variant="h6">
                            {icon} {title}
                        </Typography>
                        <Button onClick={() => toggleFilter(type)} sx={{ backgroundColor: '#fff' }}>
                            <MoreVertIcon /> Filter
                        </Button>
                    </Box>

                    {/* Export */}
                    <CardContent>
                        <Box display="flex" gap={2}>
                            <Button
                                variant="contained"
                                sx={{
                                    mt: 1,
                                    backgroundColor: '#f9f9f9',
                                    color: color,
                                    width: '100%',
                                    fontWeight: 'bold'
                                }}
                                startIcon={<DownloadIcon />}
                                onClick={() => {
                                    if (type === 'employee') {
                                        const f = filters.employee;
                                        if (!f.employeeId || !f.startMonth || !f.startYear || !f.endMonth || !f.endYear) {
                                            toast.warning('Please select Employee & Time duration');
                                            setShowFilters(prev => ({ ...prev, employee: true }));
                                            return;
                                        }
                                    }
                                    // if (type === 'pensioner') {
                                    //     const f = filters.pensioner;
                                    //     if (!f.pensionerId || !f.startMonth || !f.startYear || !f.endMonth || !f.endYear) {
                                    //         toast.warning('Please select Pensioner & Time duration');
                                    //         setShowFilters(prev => ({ ...prev, pensioner: true }));
                                    //         return;
                                    //     }
                                    // }
                                    handleExport('Excel', type);
                                }}
                                disabled={loading[type]}
                            >
                                {
                                    loading[type]
                                        ? 'Downloading...'
                                        : (type === 'employee' && (!filters.employee.employeeId || !filters.employee.startMonth || !filters.employee.startYear || !filters.employee.endMonth || !filters.employee.endYear))
                                            ? 'Select Employee & Time'
                                            : (type === 'pensioner' && (!filters.pensioner.pensionerId || !filters.pensioner.startMonth || !filters.pensioner.startYear || !filters.pensioner.endMonth || !filters.pensioner.endYear))
                                                ? 'Select Pensioner & Time'
                                                : 'Export Excel'
                                }
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        )
    };

    return (
        <>
            <div className='header bg-gradient-info pb-8 pt-8 pt-md-8 main-head'></div>
            <Container className="mt-5 mb-5">
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography variant="h4" fontWeight="bold">📊 Reports</Typography>
                </Box>

                {!currentRoles.some(role => ['End Users', 'Pensioners Operator'].includes(role)) && (
                    renderCard({ type: 'all', title: 'All Reports', color: '#3498db', icon: <SummarizeIcon /> })
                )}
                {!currentRoles.some(role => ['Pensioners Operator'].includes(role)) && (
                    renderCard({ type: 'employee', title: 'Employee Report', color: '#16a085', icon: <SummarizeIcon />, extraFieldKey: 'employeeId' })
                )}

                {!currentRoles.some(role => ['End Users', "Salary Processing Coordinator (NIOH)", "Salary Processing Coordinator (ROHC)"].includes(role)) && (
                    renderCard({ type: 'pensioner', title: 'Pensioner Report', color: '#e67e22', icon: <SummarizeIcon />, extraFieldKey: 'pensionerId' })
                )}
            </Container>
        </>
    );
};

export default ReportsDashboard;

