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
    fetchDearnessAllowanceShow, 
    fetchGisEligibility, 
    fetchGisEligibilityShow, 
    fetchHouseRent, 
    fetchHouseRentShow, 
    fetchNonPracticing, 
    fetchNonPracticingShow, 
    fetchTransport, 
    fetchTransportShow, 
    fetchUniform, 
    fetchUniformShow, 
    updateDearnessAllowance,
    updateGisEligibility,
    updateHouseRent,
    updateNonPracticing,
    updateTransport,
    updateUniform
} from '../../redux/slices/allowenceSlice';
import HistoryModal from 'Modal/HistoryModal';

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
    const dearnessAllowanceShow = useSelector((state) => state.allowence.dearnessAllowance.dearnessAllowanceShow);
    const houseRentAllowanceShow = useSelector((state) => state.allowence.houseRent.houseRentAllowanceShow);
    const gisEligibilityShow = useSelector((state) => state.allowence.gisEligibility.gisEligibilityShow);
    const nonPracticingShow = useSelector((state) => state.allowence.nonPracticing.nonPracticingShow);
    const transportShow = useSelector((state) => state.allowence.transport.transportShow);
    const uniformShow = useSelector((state) => state.allowence.uniform.uniformShow);
    const { levels, totalCount } = useSelector((state) => state.levels);
    const [ renderFunction, setRenderFunction ] = React.useState(() => null);
    const [historyRecord, setHistoryRecord] = React.useState([]);
    const [tableHead, setTableHead] = React.useState([
        "Sr. No.",
        "Head 1",
        "Head 2",
        "Head 3",
        "Head 4",
        "Head 5",
        "Head 6",
    ]);
    const [isHistoryModalOpen, setIsHistoryModalOpen] = React.useState(false);
    const toggleHistoryModal = () => {
        setIsHistoryModalOpen(!isHistoryModalOpen);
        setHistoryRecord([]);
    };
    const [shouldOpenHistory, setShouldOpenHistory] = React.useState(false);
    
    const getTableConfig = (type) => {
        switch (type) {
            case "dearness":
            return {
                head: [
                    "Sr. No.",
                    "Rate %",
                    "PWD Rate %",
                    "Effective From",
                    "Effective Till",
                    "Added By",
                    "Edited By"
                ],
                renderRow: (record, index) => (
                    <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{record?.rate_percentage ?? "-"}</td>
                    <td>{record?.pwd_rate_percentage ?? "-"}</td>
                    <td>{record?.effective_from ?? "-"}</td>
                    <td>{record?.effective_till ?? "-"}</td>
                    <td>{record?.added_by?.name || "NA"}</td>
                    <td>{record?.edited_by?.name || "NA"}</td>
                    </tr>
                ),
            };

            case "houserent":
            return {
                head: [
                    "Sr. No.",
                    "City Class",
                    "Rate %",
                    "Effective From",
                    "Effective Till",
                    "Added By",
                    "Edited By"
                ],
                renderRow: (record, index) => (
                    <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{record?.city_class || "NA"}</td>
                    <td>{record?.rate_percentage || "NA"}</td>
                    <td>{record?.effective_from || "NA"}</td>
                    <td>{record?.effective_till || "NA"}</td>
                    <td>{record?.added_by?.name || "NA"}</td>
                    <td>{record?.edited_by?.name || "NA"}</td>
                    </tr>
                ),
            };

            case "nonpracticing":
            return {
                head: [
                    "Sr. No.",
                    "Applicable Post",
                    "Rate %",
                    "Effective From",
                    "Effective Till",
                    "Added By",
                    "Edited By"
                ],
                renderRow: (record, index) => (
                    <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{record?.applicable_post || "-"}</td>
                    <td>{record?.rate_percentage || "-"}</td>
                    <td>{record?.effective_from || "-"}</td>
                    <td>{record?.effective_till || "-"}</td>
                    <td>{record?.added_by?.name || "NA"}</td>
                    <td>{record?.edited_by?.name || "NA"}</td>
                    </tr>
                ),
            };
      
            case "transport":
            return {
                head: [
                    "Sr. No.",
                    "Pay level",
                    "Amount",
                    "Added By",
                    "Edited By"
                ],
                renderRow: (record, index) => (
                    <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{record?.pay_matrix_level || "-"}</td>
                    <td>{record?.amount || "-"}</td>
                    <td>{record?.added_by?.name || "NA"}</td>
                    <td>{record?.edited_by?.name || "NA"}</td>
                    </tr>
                ),
            };

            case "uniform":
            return {
                head: [
                    "Sr. No.",
                    "Applicable Post",
                    "Amount",
                    "Effective From",
                    "Effective Till",
                    "Added By",
                    "Edited By"
                ],
                renderRow: (record, index) => (
                    <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{record?.applicable_post ?? "-"}</td>
                        <td>{record?.amount || "NA"}</td>
                        <td>{record?.effective_from || "NA"}</td>
                        <td>{record?.effective_till || "NA"}</td>
                        <td>{record?.added_by?.name || "NA"}</td>
                        <td>{record?.edited_by?.name || "NA"}</td>
                    </tr>
                ),
            };

            case "giseligibility":
            return {
                head: [
                    "Sr. No.",
                    "Pay level",
                    "Scheme Category",
                    "Amount",
                    "Added By",
                    "Edited By"
                ],
                renderRow: (record, index) => (
                    <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{record?.pay_matrix_level || "NA"}</td>
                        <td>{record?.scheme_category || "NA"}</td>
                        <td>{record?.amount || "NA"}</td>
                        <td>{record?.added_by?.name || "NA"}</td>
                        <td>{record?.edited_by?.name || "NA"}</td>
                    </tr>
                ),
            };
          
          // You can add more like designation, pay scale, etc.
          default:
            return null;
        };

    }

    const handleHistoryShow = (id) => {
        setHistoryRecord([]);
        setShouldOpenHistory(true);
        console.log("__Id :", id);
        switch (currentType) {
            case "dearness" :
                dispatch(fetchDearnessAllowanceShow(id));
                break;

            case "houserent" :
                dispatch(fetchHouseRentShow(id));
                break;

            case "nonpracticing" :
                dispatch(fetchNonPracticingShow(id));
                break;

            case "transport" :
                dispatch(fetchTransportShow(id));
                break;

            case "uniform" :
                dispatch(fetchUniformShow(id));
                break;

            case "giseligibility" :
                dispatch(fetchGisEligibilityShow(id));
                break;

            default:
                console.warn("Unknown type passed to handleHistoryShow:", currentType);
                return;
        }
    }
    console.log("History Record: ",historyRecord);

    React.useEffect(() => {
        if ( currentType === "dearness" && shouldOpenHistory && dearnessAllowanceShow?.data.history) {
            const config = getTableConfig(currentType);
            setHistoryRecord(dearnessAllowanceShow?.data.history);
            setTableHead(config.head);
            setRenderFunction(() => config.renderRow);
            setIsHistoryModalOpen(true);
            setShouldOpenHistory(false);
            console.log("Dearness Allowance HistoryRecord: ", historyRecord);

        } else if(currentType === "houserent" && shouldOpenHistory && houseRentAllowanceShow?.history){
            const config = getTableConfig(currentType);
            setHistoryRecord(houseRentAllowanceShow?.history);
            setTableHead(config.head);
            setRenderFunction(() => config.renderRow);
            setIsHistoryModalOpen(true);
            setShouldOpenHistory(false);
            console.log("HouseRent HistoryRecord: ", historyRecord);

        } else if(currentType === "nonpracticing" && shouldOpenHistory && nonPracticingShow?.history){
            const config = getTableConfig(currentType);
            setHistoryRecord(nonPracticingShow?.history);
            setTableHead(config.head);
            setRenderFunction(() => config.renderRow);
            setIsHistoryModalOpen(true);
            setShouldOpenHistory(false);
            console.log("Non Practicing HistoryRecord: ", historyRecord);

        } else if(currentType === "transport" && shouldOpenHistory && transportShow?.history){
            const config = getTableConfig(currentType);
            setHistoryRecord(transportShow?.history);
            setTableHead(config.head);
            setRenderFunction(() => config.renderRow);
            setIsHistoryModalOpen(true);
            setShouldOpenHistory(false);
            console.log("Transport HistoryRecord: ", historyRecord);

        } else if(currentType === "uniform" && shouldOpenHistory && uniformShow?.history){
            const config = getTableConfig(currentType);
            setHistoryRecord(uniformShow?.history);
            setTableHead(config.head);
            setRenderFunction(() => config.renderRow);
            setIsHistoryModalOpen(true);
            setShouldOpenHistory(false);
            console.log("Uniform HistoryRecord: ", historyRecord);

        } else if(currentType === "giseligibility" && shouldOpenHistory && gisEligibilityShow?.history){
            console.log("GIS Eligibility: ", allowence?.gisEligibility);
            const config = getTableConfig(currentType);
            setHistoryRecord(gisEligibilityShow?.history);
            setTableHead(config.head);
            setRenderFunction(() => config.renderRow);
            setIsHistoryModalOpen(true);
            setShouldOpenHistory(false);
            console.log("GIS Eligibility HistoryRecord: ", historyRecord);
        }

    }, [ dearnessAllowanceShow, houseRentAllowanceShow, nonPracticingShow, transportShow, uniformShow, gisEligibilityShow, historyRecord, shouldOpenHistory]);
    

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
                                <IconButton color="warning" aria-label="history" onClick={() => handleHistoryShow(item.id)}>
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
                                <IconButton color="warning" aria-label="history" onClick={() => handleHistoryShow(item.id)}>
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
                                <IconButton color="warning" aria-label="history" onClick={() => handleHistoryShow(item.id)}>
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
                                <IconButton color="warning" aria-label="history" onClick={() => handleHistoryShow(item.id)}>
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
                                <IconButton color="warning" aria-label="history" onClick={() => handleHistoryShow(item.id)}>
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
                                <IconButton color="warning" aria-label="history" onClick={() => handleHistoryShow(item.id)}>
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
            <HistoryModal
                isOpen={isHistoryModalOpen}
                toggle={toggleHistoryModal}
                tableHead={tableHead}
                historyRecord={historyRecord}
                renderRow={renderFunction}
            />
        </>
    );
}