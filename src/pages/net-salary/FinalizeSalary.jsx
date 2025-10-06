import React, { useEffect, useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, Box,
    Grid,
    InputLabel,
    Select,
    MenuItem,
    FormControl,
    Button,
} from '@mui/material';
import {
    Card,
    CardBody,
    CardHeader
} from "reactstrap";
import CircularProgress from '@mui/material/CircularProgress';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchNetSalary,
} from '../../redux/slices/netSalarySlice';
import { months } from 'utils/helpers';
import { dateFormat } from 'utils/helpers';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
// Removed react-bootstrap FormControl to avoid conflict with MUI FormControl


export default function FinalizeSalary() {
    const dispatch = useDispatch();
    const currentRoles = useSelector((state) =>
        state.auth.user?.roles?.map(role => role.name) || []
    );
    const { netSalary, loading } = useSelector((state) => state.netSalary);
    const totalCount = useSelector((state) => state.netSalary.totalCount) || 0;
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [filters, setFilters] = useState({
        month: '',
        year: '',
    });

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 10 }, (_, index) => String(currentYear - index));



    useEffect(() => {
        const params = {
            page: page + 1,
            limit: rowsPerPage,
            finalize_status: 1,
            month: filters.month,
            year: filters.year,
            is_verified: '',
            employee_id: '',
        };
        dispatch(fetchNetSalary(params));
    }, [dispatch, page, rowsPerPage, filters]);


    const handlePageChange = (_, newPage) => setPage(newPage);

    const handleChangeRowsPerPage = (e) => {
        setRowsPerPage(parseInt(e.target.value, 10));
        setPage(0);
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const handleSearch = () => {
        const params = {
            page: page + 1,
            limit: rowsPerPage,
            finalize_status: 1,
            month: filters.month,
            year: filters.year,
            is_verified: '',
            employee_id: '',
        };
        dispatch(fetchNetSalary(params));
    };

    const handleClearFilters = () => {
        setFilters({ month: '', year: '' });
        setPage(0);
        setRowsPerPage(10);
        dispatch(fetchNetSalary({
            page: 1,
            limit: 10,
            finalize_status: 1,
            month: '',
            year: '',
            is_verified: '',
            employee_id: '',
        }));
    };

    return (
        <>
            <div className='header bg-gradient-info pb-8 pt-8 pt-md-8 main-head'></div>
            <div className="mt--7 mb-7 container-fluid">
                <Card className="card-stats mb-4 mb-lg-0">
                    <CardHeader>
                        <Box sx={{ p: 2, mb: 3, border: '1px solid #e0e0e0', borderRadius: '8px' }} className="cardheader-flex-group">
                            <div className="cardheader-flex-left w-75">
                                <Grid container spacing={2} alignItems="center">
                                    <Grid item size={{ xs: 6, md: 3 }}>
                                        <FormControl fullWidth size="small">
                                            <InputLabel id="month-label">Month</InputLabel>
                                            <Select
                                                labelId="month-label"
                                                name="month"
                                                value={filters.month}
                                                onChange={handleFilterChange}
                                                label="Month"
                                            >
                                                <MenuItem value=""><em>All</em></MenuItem>
                                                {months.map((month) => (
                                                    <MenuItem key={month.value} value={month.value}>
                                                        {month.label}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item size={{ xs: 6, md: 3 }}>
                                        <FormControl fullWidth size="small">
                                            <InputLabel id="year-label">Year</InputLabel>
                                            <Select
                                                labelId="year-label"
                                                name="year"
                                                value={filters.year}
                                                onChange={handleFilterChange}
                                                label="Year"
                                            >
                                                <MenuItem value=""><em>All</em></MenuItem>
                                                {years.map((yearOption) => (
                                                    <MenuItem key={yearOption} value={yearOption}>
                                                        {yearOption}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} md={3} container spacing={1}>
                                        <Grid item>
                                            <Button variant="contained" onClick={handleSearch}>Search</Button>
                                        </Grid>
                                        <Grid item>
                                            <Button variant="outlined" onClick={handleClearFilters}>Clear</Button>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </div>
                        </Box>
                    </CardHeader>
                    <CardBody>
                        <div className="custom-scrollbar">
                            {(loading) ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                                    <CircularProgress />

                                </Box>
                            ) : (
                                <TableContainer component={Paper} style={{ boxShadow: "none" }}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell style={{ fontWeight: "900" }}>Sr. No.</TableCell>
                                                <TableCell style={{ fontWeight: "900" }}>Emp Code</TableCell>
                                                <TableCell style={{ fontWeight: "900" }}>Name</TableCell>
                                                <TableCell style={{ fontWeight: "900" }}>Month</TableCell>
                                                <TableCell style={{ fontWeight: "900" }}>Year</TableCell>
                                                <TableCell style={{ fontWeight: "900" }}>Institute</TableCell>
                                                <TableCell style={{ fontWeight: "900" }}>Processing Date</TableCell>
                                                <TableCell style={{ fontWeight: "900" }}>Payment Date</TableCell>
                                                <TableCell style={{ fontWeight: "900" }}>Net Amount</TableCell>
                                                <TableCell style={{ fontWeight: "900" }}>Finalized</TableCell>
                                                <TableCell style={{ fontWeight: "900" }}>Basic Pay</TableCell>
                                                <TableCell style={{ fontWeight: "900" }}>DA Amount</TableCell>
                                                <TableCell style={{ fontWeight: "900" }}>HRA Amount</TableCell>
                                                <TableCell style={{ fontWeight: "900" }}>NPA Amount</TableCell>
                                                <TableCell style={{ fontWeight: "900" }}>Transport Amount</TableCell>
                                                <TableCell style={{ fontWeight: "900" }}>Uniform Rate Amount</TableCell>
                                                <TableCell style={{ fontWeight: "900" }}>GOVT Contribution</TableCell>
                                                <TableCell style={{ fontWeight: "900" }}>DA on TA</TableCell>
                                                <TableCell style={{ fontWeight: "900" }}>Special Pay</TableCell>
                                                <TableCell style={{ fontWeight: "900" }}>DA 1</TableCell>
                                                <TableCell style={{ fontWeight: "900" }}>DA 2</TableCell>
                                                <TableCell style={{ fontWeight: "900" }}>LTC Leave Salary</TableCell>
                                                <TableCell style={{ fontWeight: "900" }}>Total Pay</TableCell>
                                                <TableCell style={{ fontWeight: "900" }}>Income Tax</TableCell>
                                                <TableCell style={{ fontWeight: "900" }}>Professional Tax</TableCell>
                                                <TableCell style={{ fontWeight: "900" }}>License Fee</TableCell>
                                                <TableCell style={{ fontWeight: "900" }}>NFCH Donation</TableCell>
                                                <TableCell style={{ fontWeight: "900" }}>GPF</TableCell>
                                                <TableCell style={{ fontWeight: "900" }}>Employee Contribution</TableCell>
                                                <TableCell style={{ fontWeight: "900" }}>GOVT Contribution</TableCell>
                                                <TableCell style={{ fontWeight: "900" }}>GIS</TableCell>
                                                <TableCell style={{ fontWeight: "900" }}>LIC</TableCell>
                                                <TableCell style={{ fontWeight: "900" }}>Credit Society</TableCell>
                                                <TableCell style={{ fontWeight: "900" }}>Total Deduction</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {netSalary?.length === 0 ? (
                                                <TableRow>
                                                    <TableCell align="center" colSpan={currentRoles.some(role => ['IT Admin', "Section Officer (Accounts)", "Accounts Officer", "Salary Processing Coordinator (NIOH)", "Salary Processing Coordinator (ROHC)"].includes(role)) ? 10 : 9}>No data available</TableCell>
                                                </TableRow>
                                            ) : (
                                                <>
                                                    {netSalary?.map((row, idx) => (
                                                        <TableRow key={row.id}>
                                                            <TableCell>{(page * rowsPerPage) + idx + 1}</TableCell>
                                                            <TableCell>{row?.employee?.employee_code}</TableCell>
                                                            <TableCell>{row.employee?.name}</TableCell>
                                                            <TableCell>
                                                                {months.find((m) => m.value === row.month)?.label || 'NA'}
                                                            </TableCell>
                                                            <TableCell>{row.year}</TableCell>
                                                            <TableCell>{row?.employee?.institute}</TableCell>
                                                            <TableCell>{dateFormat(row.processing_date)}</TableCell>
                                                            <TableCell>{dateFormat(row.payment_date)}</TableCell>
                                                            <TableCell>{row.net_amount}</TableCell>
                                                            <TableCell>
                                                                <Box display="flex" gap={1}>
                                                                    <CheckCircleIcon
                                                                        fontSize="small"
                                                                        sx={{ color: row.is_finalize === 1 ? 'green' : 'red' }}
                                                                        titleAccess="Salary Processing Coordinator"
                                                                    />
                                                                </Box>
                                                            </TableCell>
                                                            <TableCell>{row?.pay_slip?.basic_pay || 0}</TableCell>
                                                            <TableCell>{row?.pay_slip?.da_amount || 0}</TableCell>
                                                            <TableCell>{row?.pay_slip?.hra_amount || 0}</TableCell>
                                                            <TableCell>{row?.pay_slip?.npa_amount || 0}</TableCell>
                                                            <TableCell>{row?.pay_slip?.transport_amount || 0}</TableCell>
                                                            <TableCell>{row?.pay_slip?.uniform_rate_amount || 0}</TableCell>
                                                            <TableCell>{row?.pay_slip?.govt_contribution || 0}</TableCell>
                                                            <TableCell>{row?.pay_slip?.da_on_ta || 0}</TableCell>
                                                            <TableCell>{row?.pay_slip?.special_pay || 0}</TableCell>
                                                            <TableCell>{row?.pay_slip?.da_1 || 0}</TableCell>
                                                            <TableCell>{row?.pay_slip?.da_2 || 0}</TableCell>
                                                            <TableCell>{row?.pay_slip?.itc_leave_salary || 0}</TableCell>
                                                            <TableCell>{row?.pay_slip?.total_pay || 0}</TableCell>
                                                            <TableCell>{row?.pay_slip?.income_tax || 0}</TableCell>
                                                            <TableCell>{row?.pay_slip?.professional_tax || 0}</TableCell>
                                                            <TableCell>{row?.pay_slip?.license_fee || 0}</TableCell>
                                                            <TableCell>{row?.pay_slip?.nfch_donation || 0}</TableCell>
                                                            <TableCell>{row?.pay_slip?.gpf || 0}</TableCell>
                                                            <TableCell>{row?.pay_slip?.employee_contribution_10 || 0}</TableCell>
                                                            <TableCell>{row?.pay_slip?.govt_contribution_14_recovery || 0}</TableCell>
                                                            <TableCell>{row?.pay_slip?.gis || 0}</TableCell>
                                                            <TableCell>{row?.pay_slip?.lic || 0}</TableCell>
                                                            <TableCell>{row?.pay_slip?.credit_society || 0}</TableCell>
                                                            <TableCell>{row?.pay_slip?.total_deductions || 0}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                </>
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}
                        </div>
                        <TablePagination
                            component="div"
                            count={totalCount}
                            page={page}
                            onPageChange={handlePageChange}
                            rowsPerPage={rowsPerPage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </CardBody>
                </Card>
            </div>
        </>
    );
}
