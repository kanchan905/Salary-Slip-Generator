import * as React from 'react';
import {
    Box,
    Tabs,
    Tab,
    TextField,
    MenuItem,
    Button,
    Grid,
    Paper,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TablePagination,
    CircularProgress,
    IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import HistoryIcon from '@mui/icons-material/History';
import { Row } from 'reactstrap';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { fetchPayLevel } from '../../redux/slices/levelSlice';
import { 
    addDearnessAllowance, 
    addGisEligibility, 
    addHouseRent, 
    addNonPracticing, 
    addTransport, 
    addUniform, 
    fetchDearnessAllowance, 
    fetchGisEligibility, 
    fetchHouseRent, 
    fetchNonPracticing, 
    fetchTransport, 
    fetchUniform, 
    updateDearnessAllowance,
    updateGisEligibility,
    updateHouseRent,
    updateNonPracticing,
    updateTransport,
    updateUniform
} from '../../redux/slices/allowenceSlice';

const ALLOWANCE_TYPES = [
    'Dearness',
    'House Rent',
    'Non Practicing',
    'Transport',
    'Uniform',
    'GIS Eligibility',
];


const initialFormValues = {
    id: '',
    rate_percentage: '',
    pwd_rate_percentage: '',
    city_class: '',
    applicable_post: '',
    transport_type: '',
    transport_amount: '',
    amount: '',
    effective_from: '',
    effective_till: '',
    notification_ref: '',
    pay_level: '',
    gis_amount: '',
    pay_matrix_level: '',
    scheme_category: '',
};


export default function AllowanceForm() {
    const dispatch = useDispatch();
    const [value, setValue] = React.useState(0);
    const [formData, setFormData] = React.useState({});
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [editMode, setEditMode] = React.useState(false);
    const currentType = ALLOWANCE_TYPES[value].toLowerCase().replace(/\s/g, '');
    const allowence = useSelector((state) => state.allowence);
    const { levels, totalCount } = useSelector((state) => state.levels);

    React.useEffect(() => {
        if (currentType === 'dearness') {
            dispatch(fetchDearnessAllowance({ page: page + 1, limit: rowsPerPage }));
        } else if (currentType === 'houserent') {
            dispatch(fetchHouseRent({ page: page + 1, limit: rowsPerPage }));
        } else if (currentType === 'nonpracticing') {
            dispatch(fetchNonPracticing({ page: page + 1, limit: rowsPerPage }));
        } else if (currentType === 'transport'){
            dispatch(fetchTransport({ page: page + 1, limit: rowsPerPage }));
        } else if (currentType === 'uniform'){
            dispatch(fetchUniform({ page: page + 1, limit: rowsPerPage }));
        } else if (currentType === 'giseligibility'){
            dispatch(fetchGisEligibility({ page: page + 1, limit: rowsPerPage }));
        }
        dispatch(fetchPayLevel({ page: 1, limit: totalCount }));
    }, [dispatch, currentType, page, rowsPerPage]);


   const handlePageChange = (event, value) => {
        setPage(value);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value));
        setPage(0);
    };

    const formik = useFormik({
        initialValues: initialFormValues,
        onSubmit: async (values, { resetForm }) => {
            let action;
            const isUpdate = !!values.id;
            console.log("Current Type: ", currentType);
            try{
                switch (currentType) {
                    case 'dearness':
                        action = isUpdate
                            ? await dispatch(updateDearnessAllowance({ id: values.id, data: values }))
                            : await dispatch(addDearnessAllowance({ type: currentType, data: values }));
                        break;
                    case 'houserent':
                        action = isUpdate
                            ? await dispatch(updateHouseRent({ id: values.id, type: currentType, data: values }))
                            : await dispatch(addHouseRent({ type: currentType, data: values }));
                        break;
                    case 'nonpracticing':
                        action = isUpdate
                            ? await dispatch(updateNonPracticing({ id: values.id, type: currentType, data: values }))
                            : await dispatch(addNonPracticing({ type: currentType, data: values }));
                        break;
                    case 'transport':
                        action = isUpdate
                            ? await dispatch(updateTransport({ id: values.id, type: currentType, data: values }))
                            : await dispatch(addTransport({ type: currentType, data: values }));
                        break;
                    case 'uniform':
                        action = isUpdate
                            ? await dispatch(updateUniform({ id: values.id, type: currentType, data: values }))
                            : await dispatch(addUniform({ type: currentType, data: values }));
                        break;
                    case 'giseligibility':
                        action = isUpdate
                            ? await dispatch(updateGisEligibility({ id: values.id, type: currentType, data: values }))
                            : await dispatch(addGisEligibility({ type: currentType, data: values }));
                            console.log("Action: ", action);
                            if(action?.meta?.requestStatus === 'fulfilled'){
                                toast.success(action.payload?.successMsg);  
                                setEditMode(false);
                            } else{
                                toast.error(action.payload?.message);  
                            }
                            // Add more allowance types if needed
                            default:
                                console.warn('Unknown allowance type:', currentType);
                                return;
                            }
                            // Check if fulfilled
                if (addDearnessAllowance.fulfilled.match(action) ||
                    updateDearnessAllowance.fulfilled.match(action) ||
                    addHouseRent.fulfilled.match(action) ||
                    updateHouseRent.fulfilled.match(action) ||
                    addNonPracticing.fulfilled.match(action) ||
                    updateNonPracticing.fulfilled.match(action) ||
                    addTransport.fulfilled.match(action) ||
                    updateTransport.fulfilled.match(action) ||
                    addUniform.fulfilled.match(action) ||
                    updateUniform.fulfilled.match(action) ||
                    addGisEligibility.fulfilled.match(action) ||
                    updateGisEligibility.fulfilled.match(action)) {
                    toast.success(action.payload.successMsg || 'Allowance added successfully');
                    setEditMode(false);
                    resetForm();
                }
            } catch (error){
                toast.error('Something went wrong');
            }
            // If thunk returned rejected
            if (action?.error) {
            toast.error(action.payload?.message || 'Failed to add allowance');
            }
        }
    });

    const handleEdit = (item) => {
        setEditMode(true);
        console.log("Item: ", item);
        formik.setValues({
            id: item.id || '',
            rate_percentage: item.rate_percentage || '',
            pwd_rate_percentage: item.pwd_rate_percentage || '',
            city_class: item.city_class || '',
            applicable_post: item.applicable_post || '',
            transport_type: item.transport_type || '',
            transport_amount: item.amount || '',
            amount: item.amount || '',
            effective_from: item.effective_from || '',
            effective_till: item.effective_till || '',
            notification_ref: item.notification_ref || '',
            gis_amount: item.amount || '',
            pay_matrix_level: item.pay_matrix_level || '',
            scheme_category: item.scheme_category || '',
        });
    };


    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };


    const handleHistoryShow = () => {
        
    }

    const renderFields = () => {
        switch (ALLOWANCE_TYPES[value]) {
            case 'Dearness':
                return (
                    <>
                        <Grid item xs={12} sm={6}>
                            <TextField name="rate_percentage" label="Rate %" type="number" fullWidth onChange={formik.handleChange} value={formik.values.rate_percentage} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField name="pwd_rate_percentage" label="PWD Rate %" type="number" fullWidth onChange={formik.handleChange} value={formik.values.pwd_rate_percentage} />
                        </Grid>
                    </>
                );
            case 'House Rent':
                return (
                    <>
                        <Grid item xs={12} sm={6} sx={{ minWidth: "120px"}}>
                            <TextField select name="city_class" label="City Class" fullWidth value={formik.values.city_class} onChange={formik.handleChange}>
                                {['X', 'Y', 'Z'].map((opt) => (
                                <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField name="rate_percentage" label="Rate %" fullWidth type="number" onChange={formik.handleChange} value={formik.values.rate_percentage} />
                        </Grid>
                    </>
                );
            case 'Non Practicing':
                return (
                    <>
                        <Grid item xs={12} sm={6}>
                            <TextField name="applicable_post" label="Applicable Post" fullWidth onChange={formik.handleChange} value={formik.values.applicable_post} />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField name="rate_percentage" label="Rate %" fullWidth type="number" onChange={formik.handleChange} value={formik.values.rate_percentage} />
                        </Grid>
                    </>
                );
            case 'Transport':
                return (
                    <>
                        <Grid item xs={12} sm={6}  sx={{ minWidth: "180px"}}>
                            <TextField select name="pay_matrix_level" label="Pay Matrix Level" fullWidth value={formik.values.pay_matrix_level} onChange={formik.handleChange}>
                                {levels.map((opt) => (
                                <MenuItem key={opt.id} value={opt.name}>{opt.name}</MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField name="transport_amount" label="Amount" fullWidth type="number" onChange={formik.handleChange} value={formik.values.transport_amount} />
                        </Grid>
                    </>
                );
            case 'Uniform':
                return (
                    <>
                        <Grid item xs={12} sm={6}>
                            <TextField name="applicable_post" label="Applicable Post" fullWidth onChange={formik.handleChange} value={formik.values.applicable_post} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField name="amount" label="Amount" fullWidth type="number" onChange={formik.handleChange} value={formik.values.amount} />
                        </Grid>
                    </>
                );
            case 'GIS Eligibility':
                return (
                    <>
                        <Grid item xs={12} sm={6}  sx={{ minWidth: "180px"}}>
                            <TextField select name="pay_matrix_level" label="Pay Matrix Level" fullWidth value={formik.values.pay_matrix_level} onChange={formik.handleChange}>
                                {levels.map((opt) => (
                                <MenuItem key={opt.id} value={opt.name}>{opt.name}</MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6} sx={{ minWidth: "180px"}}>
                            <TextField select name="scheme_category" label="Scheme Category" fullWidth value={formik.values.scheme_category} onChange={formik.handleChange}>
                                {[' A', 'B', 'C', 'D'].map((opt) => (
                                <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField name="gis_amount" label="Amount" fullWidth type="number" onChange={formik.handleChange} value={formik.values.gis_amount} />
                        </Grid>
                    </>
                );
            default:
                return null;
        }
    };
    
    const renderTableRows = () => {
        switch (ALLOWANCE_TYPES[value]) {
            case 'Dearness':
            return (
                <>
                <Table>
                    <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                        <TableRow>
                            <TableCell><b>Sr. No.</b></TableCell>
                            <TableCell><b>Rate %</b></TableCell>
                            <TableCell><b>PWD Rate %</b></TableCell>
                            <TableCell><b>Effective from</b></TableCell>
                            <TableCell><b>Effective till</b></TableCell>
                            <TableCell><b>Actions</b></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {allowence.dearnessAllowance?.loading ? (
                        <TableRow>
                            <TableCell colSpan={6} align="center">
                                <CircularProgress />
                            </TableCell>
                        </TableRow>
                        ) : allowence.dearnessAllowance?.list?.length > 0 ? (
                        allowence.dearnessAllowance.list.map((item, index) => (
                            <TableRow key={item.id || index}>
                            <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                            <TableCell>{item.rate_percentage || '-'}</TableCell>
                            <TableCell>{item.pwd_rate_percentage || '-'}</TableCell>
                            <TableCell>{item.effective_from || '-'}</TableCell>
                            <TableCell>{item.effective_till || '-'}</TableCell>
                            <TableCell>
                                <IconButton color="primary" aria-label="edit" onClick={() => handleEdit(item)}>
                                  <EditIcon/>
                                </IconButton>
                                <IconButton color="warning" aria-label="history" onClick={() => (item.id)}>
                                  <HistoryIcon />
                                </IconButton>
                            </TableCell>
                            </TableRow>
                        ))
                        ) : (
                        <TableRow>
                            <TableCell colSpan={6} align="center">
                            No records found.
                            </TableCell>
                        </TableRow>
                        )}

                    </TableBody>
                </Table>
                <TablePagination
                    component="div"
                    count={allowence.dearnessAllowance?.totalCount}
                    page={page}
                    onPageChange={handlePageChange}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
                </>
            );

            case 'House Rent':
            return (
                <>
                <Table>
                    <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                        <TableRow>
                            <TableCell><b>Sr. No.</b></TableCell>
                            <TableCell><b>City Class</b></TableCell>
                            <TableCell><b>Rate %</b></TableCell>
                            <TableCell><b>Effective from</b></TableCell>
                            <TableCell><b>Effective till</b></TableCell>
                            <TableCell><b>Actions</b></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {allowence.houseRent?.loading ? (
                        <TableRow>
                            <TableCell colSpan={6} align="center">
                            <CircularProgress />
                            </TableCell>
                        </TableRow>
                        ) : allowence.houseRent?.list?.length > 0 ? (
                        allowence.houseRent.list.map((item, index) => (
                            <TableRow key={item.id || index}>
                            <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                            <TableCell>{item.city_class || '-'}</TableCell>
                            <TableCell>{item.rate_percentage || '-'}</TableCell>
                            <TableCell>{item.effective_from || '-'}</TableCell>
                            <TableCell>{item.effective_till || '-'}</TableCell>
                            <TableCell>
                                <IconButton color="primary" aria-label="edit" onClick={() => handleEdit(item)}>
                                  <EditIcon/>
                                </IconButton>
                                <IconButton color="warning" aria-label="history" onClick={() => (item.id)}>
                                  <HistoryIcon />
                                </IconButton>
                            </TableCell>
                            </TableRow>
                        ))
                        ) : (
                        <TableRow>
                            <TableCell colSpan={6} align="center">
                            No records found.
                            </TableCell>
                        </TableRow>
                        )}

                    </TableBody>
                </Table>
                <TablePagination
                    component="div"
                    count={allowence.houseRent?.totalCount}
                    page={page}
                    onPageChange={handlePageChange}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
                </>
            );

            case 'Non Practicing':
            return (
                <>
                <Table>
                    <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                        <TableRow>
                            <TableCell><b>Sr. No.</b></TableCell>
                            <TableCell><b>Applicable Post</b></TableCell>
                            <TableCell><b>Rate %</b></TableCell>
                            <TableCell><b>Effective from</b></TableCell>
                            <TableCell><b>Effective till</b></TableCell>
                            <TableCell><b>Actions</b></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                       {allowence.nonPracticing?.loading ? (
                        <TableRow>
                            <TableCell colSpan={6} align="center">
                            <CircularProgress />
                            </TableCell>
                        </TableRow>
                        ) : allowence.nonPracticing?.list?.length > 0 ? (
                        allowence.nonPracticing.list.map((item, index) => (
                            <TableRow key={item.id || index}>
                            <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                            <TableCell>{item.applicable_post || '-'}</TableCell>
                            <TableCell>{item.rate_percentage || '-'}</TableCell>
                            <TableCell>{item.effective_from || '-'}</TableCell>
                            <TableCell>{item.effective_till || '-'}</TableCell>
                            <TableCell>
                                <IconButton color="primary" aria-label="edit" onClick={() => handleEdit(item)}>
                                  <EditIcon/>
                                </IconButton>
                                <IconButton color="warning" aria-label="history" onClick={() => (item.id)}>
                                  <HistoryIcon />
                                </IconButton>
                            </TableCell>
                            </TableRow>
                        ))
                        ) : (
                        <TableRow>
                            <TableCell colSpan={6} align="center">
                            No records found.
                            </TableCell>
                        </TableRow>
                        )}

                    </TableBody>
                </Table>
                <TablePagination
                    component="div"
                    count={allowence.nonPracticing?.totalCount}
                    page={page}
                    onPageChange={handlePageChange}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
                </>
            );

            case 'Transport':
            return (
                <>
                <Table>
                    <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                        <TableRow>
                            <TableCell><b>Sr. No.</b></TableCell>
                            <TableCell><b>Pay level</b></TableCell>
                            <TableCell><b>Amount</b></TableCell>
                            <TableCell><b>Actions</b></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                       {allowence.transport?.loading ? (
                        <TableRow>
                            <TableCell colSpan={4} align="center">
                            <CircularProgress />
                            </TableCell>
                        </TableRow>
                        ) : allowence.transport?.list?.length > 0 ? (
                        allowence.transport.list.map((item, index) => (
                            <TableRow key={item.id || index}>
                            <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                            <TableCell>{item.pay_matrix_level || '-'}</TableCell>
                            <TableCell>{item.amount || '-'}</TableCell>
                            <TableCell>
                                <IconButton color="primary" aria-label="edit" onClick={() => handleEdit(item)}>
                                  <EditIcon/>
                                </IconButton>
                                <IconButton color="warning" aria-label="history" onClick={() => (item.id)}>
                                  <HistoryIcon />
                                </IconButton>
                            </TableCell>
                            </TableRow>
                        ))
                        ) : (
                        <TableRow>
                            <TableCell colSpan={4} align="center">
                            No records found.
                            </TableCell>
                        </TableRow>
                        )}

                    </TableBody>
                </Table>
                <TablePagination
                    component="div"
                    count={allowence.transport?.totalCount}
                    page={page}
                    onPageChange={handlePageChange}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
                </>
            );

            case 'Uniform':
            return (
                <>
                <Table>
                    <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                        <TableRow>
                            <TableCell><b>Sr. No.</b></TableCell>
                            <TableCell><b>Applicable Post</b></TableCell>
                            <TableCell><b>Amount</b></TableCell>
                            <TableCell><b>Effective from</b></TableCell>
                            <TableCell><b>Effective till</b></TableCell>
                            <TableCell><b>Actions</b></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                       {allowence.uniform?.loading ? (
                        <TableRow>
                            <TableCell colSpan={6} align="center">
                            <CircularProgress />
                            </TableCell>
                        </TableRow>
                        ) : allowence.uniform?.list?.length > 0 ? (
                        allowence.uniform.list.map((item, index) => (
                            <TableRow key={item.id || index}>
                            <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                            <TableCell>{item.applicable_post || '-'}</TableCell>
                            <TableCell>{item.amount || '-'}</TableCell>
                            <TableCell>{item.effective_from || '-'}</TableCell>
                            <TableCell>{item.effective_till || '-'}</TableCell>
                            <TableCell>
                                <IconButton color="primary" aria-label="edit" onClick={() => handleEdit(item)}>
                                  <EditIcon/>
                                </IconButton>
                                <IconButton color="warning" aria-label="history" onClick={() => (item.id)}>
                                  <HistoryIcon />
                                </IconButton>
                            </TableCell>
                            </TableRow>
                        ))
                        ) : (
                        <TableRow>
                            <TableCell colSpan={6} align="center">
                            No records found.
                            </TableCell>
                        </TableRow>
                        )}

                    </TableBody>
                </Table>
                <TablePagination
                    component="div"
                    count={allowence.uniform?.list.length}
                    page={page}
                    onPageChange={handlePageChange}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
                </>
            );
            
            case 'GIS Eligibility':
            return (
                <>
                <Table>
                    <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                        <TableRow>
                            <TableCell><b>Sr. No.</b></TableCell>
                            <TableCell><b>Matrix level</b></TableCell>
                            <TableCell><b>Scheme Category</b></TableCell>
                            <TableCell><b>Amount</b></TableCell>
                            <TableCell><b>Actions</b></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {allowence.gisEligibility?.loading ? (
                        <TableRow>
                            <TableCell colSpan={6} align="center">
                            <CircularProgress />
                            </TableCell>
                        </TableRow>
                        ) : allowence.gisEligibility?.list?.length > 0 ? (
                        allowence.gisEligibility.list.map((item, index) => (
                            <TableRow key={item.id || index}>
                            <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                            <TableCell>{item.pay_matrix_level || '-'}</TableCell>
                            <TableCell>{item.scheme_category || '-'}</TableCell>
                            <TableCell>{item.amount || '-'}</TableCell>
                            <TableCell>
                                <IconButton color="primary" aria-label="edit" onClick={() => handleEdit(item)}>
                                  <EditIcon/>
                                </IconButton>
                                <IconButton color="warning" aria-label="history" onClick={() => (item.id)}>
                                  <HistoryIcon />
                                </IconButton>
                            </TableCell>
                            </TableRow>
                        ))
                        ) : (
                        <TableRow>
                            <TableCell colSpan={6} align="center">
                            No records found.
                            </TableCell>
                        </TableRow>
                        )}

                    </TableBody>
                </Table>
                <TablePagination
                    component="div"
                    count={allowence.gisEligibility?.totalCount}
                    page={page}
                    onPageChange={handlePageChange}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
                </>
            );
            default:
            return (
                <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell colSpan={6}>No records found</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            );
        }
    };



    return (
        <>
            <div className='header bg-gradient-info pb-5 pt-8 pt-md-8 main-head'>
                <Box sx={{ maxWidth: { xs: '80%', sm: '90%' }, margin:'auto'}}>
                    <Tabs
                        value={value}
                        onChange={(e, newValue) => setValue(newValue)}
                        variant="scrollable"
                        scrollButtons="auto"
                        TabIndicatorProps={{ sx: { height: 3 } }}
                    >
                        {ALLOWANCE_TYPES.map((label, index) => (
                        <Tab key={index} label={label} sx={{ flex: '0 0 33.33%', color:'white' }} />
                        ))}
                    </Tabs>
                </Box>
            </div>
            <Box sx={{ width: '100%', bgcolor: 'background.paper', p: 3, pt:8, pb:8, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        
                <Paper sx={{ p: 3, width: '100%', maxWidth:{xs: '80%', sm: '90%'  }}}>
                    <form onSubmit={formik.handleSubmit} className="mb-5">
                        <Grid container spacing={2}>
                            {renderFields()}
                            {
                                (currentType !== "transport" && currentType !== "giseligibility") && (
                                <>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        name="effective_from"
                                        label="Effective From"
                                        type="date"
                                        fullWidth
                                        InputLabelProps={{ shrink: true }}
                                        onChange={formik.handleChange}
                                        value={formik.values.effective_from}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        name="effective_till"
                                        label="Effective Till"
                                        type="date"
                                        fullWidth
                                        InputLabelProps={{ shrink: true }}
                                        onChange={formik.handleChange}
                                        value={formik.values.effective_till}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        name="notification_ref"
                                        label="Notification Ref"
                                        fullWidth
                                        onChange={formik.handleChange}
                                        value={formik.values.notification_ref}
                                    />
                                </Grid>
                                </> )

                            }
                        </Grid>
                        <Row className='m-0 mt-4'>
                            <Grid item xs={12}>
                                <Button
                                    style={{ background: "#004080", color: '#fff' }}
                                    type="submit"
                                >
                                    {editMode ? "Update" : "Submit"}
                                </Button>
                                {editMode && (
                                    <Button
                                        type="button"
                                        color="secondary"
                                        onClick={() => {
                                            formik.resetForm();
                                            setEditMode(false);
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                )}
                            </Grid>
                        </Row>
                    </form>

                    <TableContainer component={Paper} variant="outlined">
                        {renderTableRows()}
                       
                    </TableContainer>
                
                </Paper>
            </Box>

        </>
    );
}