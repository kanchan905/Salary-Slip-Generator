import { 
    Button, 
    CircularProgress, 
    IconButton, 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TablePagination, 
    TableRow, 
    TextField 
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import HistoryIcon from '@mui/icons-material/History';
import QuarterModal from 'Modal/QuarterModal';
import React, { useEffect } from 'react';
import { 
    useDispatch, 
    useSelector 
} from 'react-redux';
import { toast } from 'react-toastify';
import { 
    Card, 
    CardBody, 
    CardHeader 
} from 'reactstrap';
import { 
    createQuarter, 
    fetchQuarterList, 
    fetchQuarterShow, 
    updateQuarter 
} from '../../redux/slices/quarterSlice';
import HistoryModal from 'Modal/HistoryModal';




export default function Quarter() {
    const dispatch = useDispatch();
    const { 
        quarterList, 
        quarterShow,
        totalCount, 
        loading 
    } = useSelector((state) => state.quarter);
    const [isOpen, setIsOpen] = React.useState(false);
    const [formMode, setFormMode] = React.useState('create');
    const [editId, setEditId] = React.useState(null);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
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
            case "quarter":
            return {
                head: [
                    "Sr. No.",
                    "Quarter No.",
                    "Type",
                    "License Fee",
                    "Added By",
                    "Edited By"
                ],
                renderRow: (record, index) => (
                    <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{record?.quarter_no ?? "-"}</td>
                    <td>{record?.type ?? "-"}</td>
                    <td>{record?.license_fee ?? "-"}</td>
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
        dispatch(fetchQuarterShow(id));
    }


    useEffect(() => {
        if ( shouldOpenHistory && quarterShow?.history) {
            const config = getTableConfig("quarter");
            setHistoryRecord(quarterShow?.history);
            setTableHead(config.head);
            setRenderFunction(() => config.renderRow);
            setIsHistoryModalOpen(true);
            setShouldOpenHistory(false);
            console.log("QuarterHistoryRecord: ", historyRecord);

        } 
    },[quarterShow, shouldOpenHistory]);


    const [formData, setFormData] = React.useState({
        quarter_no: '',
        type: '',
        license_fee: '',
    });

    useEffect(() => {
        // Fetch quarter list here if needed
        dispatch(fetchQuarterList({ page: 1, limit: totalCount || 40 })); // replace with actual fetch action
    }, [dispatch]);


    const toggleModal = (mode = 'create') => {
        if (mode === 'create') {
            setFormData({
                quarter_no: '',
                type: '',
                license_fee: '',
            });
            setFormMode('create');
            setEditId(null);
        }
        setIsOpen(prev => !prev);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (values, { setSubmitting, resetForm }) => {
        const payload = {
            quarter_no: values.quarter_no,
            type: values.type,
            license_fee: values.license_fee,
        };
        if (formMode === 'edit') {
            dispatch(updateQuarter({ formData: payload, id: editId })) // replace with actual update action
                .unwrap()
                .then(() => {
                    toast.success('Quarter updated successfully');
                    toggleModal();
                    dispatch(fetchQuarterList({ page: 1, limit: totalCount || 40 }));
                })
                .catch((err) => {
                    const apiMsg = err?.response?.data?.message || err?.message || 'Failed to update quarter.';
                    toast.error(apiMsg);
                })
                .finally(() => {
                    setSubmitting(false);
                    resetForm();
                });
        } else {
            
            dispatch(createQuarter(payload)) // replace with actual create action
                .unwrap()
                .then(() => {
                    toast.success('Quarter created successfully');
                    toggleModal();
                    dispatch(fetchQuarterList({ page: 1, limit: totalCount || 40 }));
                })
                .catch((err) => {
                    const apiMsg = err?.response?.data?.message || err?.message || 'Failed to create quarter.';
                    toast.error(apiMsg);
                })
                .finally(() => {
                    setSubmitting(false);
                    resetForm();
                });
        }
    };

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    const handleChangeRowsPerPage = (event) => {
        console.log("Events: ", parseInt(event.target.value));
        setRowsPerPage(parseInt(event.target.value));
        setPage(0);
    };

    console.log("TotalCount: ", totalCount);
    return (
        <>
            <div className='header bg-gradient-info pb-5 pt-8 pt-md-8 main-head'></div>
            <div className="mt--7 mb-7 container-fluid">
                <Card className="card-stats mb-4 mb-lg-0">
                    <CardHeader>
                        <div className="d-flex justify-content-between align-items-center">
                            <TextField placeholder="Search quarter..." />
                            <Button
                                style={{ background: "#004080", color: '#fff' }}
                                type="button"
                                onClick={() => toggleModal('create')}
                            >
                                + Add Quarter
                            </Button>
                        </div>
                    </CardHeader>
                    <CardBody>
                        {/* Data listing will go here */}
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>                                      
                                        <TableCell>Quarter No</TableCell>
                                        <TableCell>Type</TableCell>
                                        <TableCell>License Fee</TableCell>
                                        <TableCell align="left">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center">
                                            <CircularProgress />
                                        </TableCell>
                                    </TableRow>
                                    ) :
                                    quarterList.map((row, index) => (
                                        <TableRow key={row.id}>                                          
                                            <TableCell>{row.quarter_no}</TableCell>
                                            <TableCell>{row.type}</TableCell>
                                            <TableCell>{row.license_fee}</TableCell>
                                            <TableCell align="left">
                                                <IconButton 
                                                    color="primary" 
                                                    aria-label="edit" 
                                                    onClick={() => {
                                                        setFormData(row);
                                                        setEditId(row.id);
                                                        setFormMode('edit');
                                                        toggleModal('edit');
                                                    }}
                                                >
                                                    <EditIcon/>
                                                </IconButton>
                                                <IconButton color="warning" aria-label="history" onClick={() => handleHistoryShow(row.id)}>
                                                    <HistoryIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                }
                                </TableBody>
                            </Table>
                            <TablePagination
                                component="div"
                                count={totalCount}
                                page={page}
                                onPageChange={handlePageChange}
                                rowsPerPage={rowsPerPage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </TableContainer>
                    </CardBody>
                </Card>

                <QuarterModal
                    isOpen={isOpen}
                    toggle={() => toggleModal()}
                    form={formData} // ✅ fix here
                    onSubmit={handleSubmit}
                    mode={formMode}
                />

                <HistoryModal
                    isOpen={isHistoryModalOpen}
                    toggle={toggleHistoryModal}
                    tableHead={tableHead}
                    historyRecord={historyRecord}
                    renderRow={renderFunction}
                />
            </div>
        </>
    );
}
