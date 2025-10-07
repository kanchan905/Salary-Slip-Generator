import React, { useEffect, useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, Box,
} from '@mui/material';
import {
    Card,
    CardBody,
    CardHeader
} from "reactstrap";
import CircularProgress from '@mui/material/CircularProgress';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchNetPension,
} from '../../redux/slices/netPensionSlice';
import { useLocation } from 'react-router-dom';
import { months } from 'utils/helpers';
import { dateFormat } from 'utils/helpers';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { fetchPensioners } from '../../redux/slices/pensionerSlice';
import { Tab } from 'react-bootstrap';
import { InputLabel, Select, MenuItem, FormControl, Grid, Button } from '@mui/material';


export default function FinalizePension() {
    const dispatch = useDispatch();
    const location = useLocation();
    const currentRoles = useSelector((state) =>
        state.auth.user?.roles?.map(role => role.name) || []
    );
    const { netPension, loading } = useSelector((state) => state.netPension);
    const totalCount = useSelector((state) => state.netPension?.totalCount) || 0;
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [filters, setFilters] = useState({
        month: '',
        year: '',
    });

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 10 }, (_, index) => String(currentYear - index));

    useEffect(() => {
        dispatch(fetchNetPension({
            page: page + 1,
            limit: rowsPerPage,
            month: filters.month,
            year: filters.year,
            ppo_no: '',
            user_id: ''
        }));
        dispatch(fetchPensioners({ page: '1', limit: 1000, id: '', search: '' }));
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
        dispatch(fetchNetPension({
            page: page + 1,
            limit: rowsPerPage,
            month: filters.month,
            year: filters.year,
            ppo_no: '',
            user_id: '',
        }));
    };

    const handleClearFilters = () => {
        setFilters({ month: '', year: '' });
        setPage(0);
        setRowsPerPage(10);
        dispatch(fetchNetPension({
            page: 1,
            limit: 10,
            month: '',
            year: '',
            ppo_no: '',
            user_id: '',
        }));
    };

    return (
        <>
            <div className='header bg-gradient-info pb-8 pt-8 pt-md-8 main-head'></div>
            <div className="mt--7 mb-7 container-fluid">
                <Card className="card-stats mb-4 mb-lg-0">
                    <CardHeader>
                        <Box sx={{ p: 2, mb: 3, border: '1px solid #e0e0e0', borderRadius: '8px' }}>
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
                        </Box>
                    </CardHeader>
                    <CardBody>
                        <div>
                            {loading ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <CircularProgress />
                                </Box>
                            ) : (
                                <TableContainer component={Paper} style={{ boxShadow: "none" }}>
                                    <Table>
                                        <TableHead>
                                            <TableRow style={{ whiteSpace: "nowrap" }}>
                                                <TableCell style={{ fontWeight: "900" }}>Sr. No.</TableCell>
                                                <TableCell style={{ fontWeight: "900" }}>PPO NO.</TableCell>
                                                <TableCell style={{ fontWeight: "900" }}>Pensioner</TableCell>
                                                <TableCell style={{ fontWeight: "900" }}>Month</TableCell>
                                                <TableCell style={{ fontWeight: "900" }}>Year</TableCell>
                                                <TableCell style={{ fontWeight: "900" }}>Net Pension</TableCell>
                                                {/* <TableCell style={{ fontWeight: "900" }}>Payment Date</TableCell> */}
                                                <TableCell style={{ fontWeight: "900" }}>Finalized</TableCell>
                                                {/* <TableCell style={{ fontWeight: "900" }}>Basic Pension</TableCell>
                                                <TableCell style={{ fontWeight: "900" }}>Additional Pension</TableCell>
                                                <TableCell style={{ fontWeight: "900" }}>DR Amount</TableCell>
                                                <TableCell style={{ fontWeight: "900" }}>Medical Allowance</TableCell>
                                                <TableCell style={{ fontWeight: "900" }}>Total Pension</TableCell>
                                                <TableCell style={{ fontWeight: "900" }}>Commutation Amount</TableCell>
                                                <TableCell style={{ fontWeight: "900" }}>Income Tax</TableCell>
                                                <TableCell style={{ fontWeight: "900" }}>Total Deduction</TableCell> */}
                                            </TableRow>
                                        </TableHead>
                                        <TableBody> 
                                            {netPension.length === 0 ? (
                                                <TableRow>
                                                    <TableCell align="center" colSpan={currentRoles.some(role => ['IT Admin', "Section Officer (Accounts)", "Pensioners Operator"].includes(role)) ? 10 : 9}>No data available</TableCell>
                                                </TableRow>
                                            ) : (
                                                <>
                                                    {netPension
                                                    .filter(row => row.is_finalize === 1)
                                                    .map((row, idx) => (
                                                        <TableRow key={row.id} style={{ whiteSpace: "nowrap" }}>
                                                            <TableCell>{(page * rowsPerPage) + idx + 1}</TableCell>
                                                            <TableCell>{row.pensioner?.ppo_no || "- -"}</TableCell>
                                                            <TableCell>{row.pensioner?.name || "NA"}</TableCell>
                                                            <TableCell>
                                                                {months.find((m) => m.value === row.month)?.label || 'NA'}
                                                            </TableCell>
                                                            <TableCell>{row.year}</TableCell>
                                                            <TableCell>{row.net_pension}</TableCell>
                                                            {/* <TableCell>{dateFormat(row.payment_date)}</TableCell> */}
                                                            <TableCell>
                                                                <Box display="flex" gap={1}>
                                                                    <CheckCircleIcon
                                                                        fontSize="small"
                                                                        sx={{ color: row.is_finalize === 1 ? 'green' : 'red' }}
                                                                        titleAccess="Salary Processing Coordinator"
                                                                    />
                                                                </Box>
                                                            </TableCell>
                                                            {/* <TableCell>{row?.monthly_pension?.basic_pension || 0}</TableCell>
                                                            <TableCell>{row?.monthly_pension?.additional_pension || 0}</TableCell>
                                                            <TableCell>{row?.monthly_pension?.dr_amount || 0}</TableCell>
                                                            <TableCell>{row?.monthly_pension?.medical_allowance || 0}</TableCell>
                                                            <TableCell>{row?.monthly_pension?.total_pension || 0}</TableCell>
                                                            <TableCell>{row?.pensioner_deduction?.commutation_amount || 0}</TableCell>
                                                            <TableCell>{row?.pensioner_deduction?.income_tax || 0}</TableCell>
                                                            <TableCell>{row?.pensioner_deduction?.amount || 0}</TableCell> */}
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
