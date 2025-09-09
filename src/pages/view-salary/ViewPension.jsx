import React, { useEffect, useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    IconButton, TextField, TablePagination, Box, Menu, MenuItem, Grid,
    Select, FormControl, InputLabel, Button as MuiButton,
    Chip,
} from '@mui/material';
import {
    Card,
    CardHeader,
    CardBody
} from "reactstrap";
import CircularProgress from '@mui/material/CircularProgress';
import { useDispatch, useSelector } from 'react-redux';
import { fetchViewPension } from '../../redux/slices/viewPensionSlice';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ViewIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';
import { months } from 'utils/helpers';


export default function ViewPension() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // --- State from the NEW viewPension slice ---
    const { viewPension, loading, totalCount } = useSelector((state) => state.viewPension);
    console.log("viewPension data:", viewPension);


    // --- Component State ---
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedRow, setSelectedRow] = useState(null);
    const [page, setPage] = useState(0); 
    const [rowsPerPage, setRowsPerPage] = useState(10);

   
    const [filters, setFilters] = useState({
        month: '',
        year: '',
    });

    const statusChipColor = (status) => {
        return status ? "success" : "error";
    };

   
    const fetchData = (currentFilters = filters, currentPage = page) => {
        const params = {
            page: currentPage + 1, 
            limit: rowsPerPage,
            month: currentFilters.month,
            year: currentFilters.year,
        };

        Object.keys(params).forEach(key => {
            if (params[key] === '' || params[key] === 'All' || params[key] === null) {
                delete params[key];
            }
        });
        
        dispatch(fetchViewPension(params));
    };

    // Fetch data on initial load and when pagination changes
    useEffect(() => {
        fetchData(filters, page);
    }, [dispatch, page, rowsPerPage, filters]);
    
    // --- Filter and Action Handlers ---
    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleSearch = () => {
        setPage(0); 
        fetchData(filters, 0);
    };

    const handleClearFilters = () => {
        const clearedFilters = {  month: '', year: '' };
        setFilters(clearedFilters);
        setPage(0);
        fetchData(clearedFilters, 0);
    };

    const handlePageChange = (_, newPage) => setPage(newPage);
    
    const handleChangeRowsPerPage = (e) => {
        setRowsPerPage(parseInt(e.target.value, 10));
        setPage(0);
    };

    const handleMenuClick = (event, row) => {
        setAnchorEl(event.currentTarget);
        setSelectedRow(row);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setSelectedRow(null);
    };

    const handleView = (id) => {
        handleClose();
        navigate(`/net-pension/view/${id}`);
    };
    

    return (
        <>
            <div className='header bg-gradient-info pb-8 pt-8 pt-md-8 main-head'></div>
            <div className="mt--7 mb-7 container-fluid">
                <Card className="card-stats mb-4 mb-lg-0">
                    <CardHeader>
                        <Box sx={{ p: 2, mb: 3, border: '1px solid #e0e0e0', borderRadius: '8px' }} >
                            <Grid container spacing={2} alignItems="center">
                                <Grid item size={{ xs: 6, md:4 }}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel>Month</InputLabel>
                                        <Select name="month" value={filters.month} label="Month" onChange={handleFilterChange}>
                                            <MenuItem value="All"><em>All</em></MenuItem>
                                            {months.map((month) => (
                                                <MenuItem key={month.value} value={month.value}>{month.label}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item size={{ xs: 6, md:4 }}>
                                    <TextField fullWidth label="Year" name="year" value={filters.year} onChange={handleFilterChange} variant="outlined" size="small" type="text" />
                                </Grid>
                                <Grid item  container spacing={1} justifyContent="flex-start">
                                    <Grid item><MuiButton variant="contained" onClick={handleSearch}>Search</MuiButton></Grid>                                   
                                </Grid>
                                <Grid item  container spacing={1} justifyContent="flex-start">                                   
                                    <Grid item><MuiButton variant="outlined" onClick={handleClearFilters}>Clear</MuiButton></Grid>
                                </Grid>
                            </Grid>                         
                        </Box>
                    </CardHeader>
                    <CardBody>
                        <div className="custom-scrollbar">
                            {loading ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 5 }}>
                                    <CircularProgress />
                                </Box>
                            ) : (
                                <TableContainer component={Paper} style={{ boxShadow: "none" }}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell style={{ fontWeight: "900" }}>Sr. No.</TableCell>                                               
                                                <TableCell style={{ fontWeight: "900" }}>PPO No.</TableCell>
                                                <TableCell style={{ fontWeight: "900" }}>Name</TableCell>
                                                <TableCell style={{ fontWeight: "900" }}>Month</TableCell>
                                                <TableCell style={{ fontWeight: "900" }}>Year</TableCell>
                                                <TableCell style={{ fontWeight: "900" }}>Net Pension</TableCell>
                                                <TableCell style={{ fontWeight: "900" }}>Verified</TableCell>
                                                <TableCell style={{ fontWeight: "900" }}>Action</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {viewPension?.length === 0 ? (
                                                <TableRow>
                                                    <TableCell align="center" colSpan={8}>No data available</TableCell>
                                                </TableRow>
                                            ) : (
                                                viewPension?.map((row,index) => (
                                                    <TableRow key={row.id}>
                                                        <TableCell>{(page * rowsPerPage) + index + 1}</TableCell>                                                 
                                                        <TableCell>{row?.pensioner?.ppo_no}</TableCell>
                                                        <TableCell>{row.pensioner?.name}</TableCell>
                                                        <TableCell>{months.find((m) => m.value === row.month)?.label || 'NA'}</TableCell>
                                                        <TableCell>{row.year}</TableCell>
                                                        <TableCell>{row.net_amount}</TableCell>
                                                        <TableCell>
                                                            <Chip label={row.is_verified ? 'YES' : 'NO'} color={statusChipColor(row.is_verified)} variant="outlined" size="small"  />
                                                        </TableCell>
                                                        <TableCell align="left">
                                                            <IconButton onClick={(e) => handleMenuClick(e, row)}><MoreVertIcon /></IconButton>
                                                            <Menu anchorEl={anchorEl} open={selectedRow === row} onClose={handleClose}>
                                                               <MenuItem onClick={() => handleView(row.id)}><ViewIcon fontSize="small" sx={{ mr: 1 }} /> View</MenuItem>                                 
                                                            </Menu>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}
                        </div>
                        <TablePagination
                            component="div" count={viewPension?.length === 0 ? 0 : totalCount} page={page} onPageChange={handlePageChange}
                            rowsPerPage={rowsPerPage} onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </CardBody>
                </Card>
            </div>           
        </>
    );
}