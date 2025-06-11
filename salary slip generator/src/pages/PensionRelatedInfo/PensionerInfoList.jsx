import React, { useEffect, useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    IconButton, TablePagination, Box, Chip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import {
    Button,
    Card,
    CardHeader,
    CardBody
} from "reactstrap";
import CircularProgress from '@mui/material/CircularProgress';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
    fetchPensionRelated,
    CreatePensionRelated,
    UpdatePensionRelated,
    ShowPensionRelated,
} from '../../redux/slices/pensionRelatedSlice';
import PensionerInfoModal from '../../Modal/PensionerInfoModal';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VisibilityIcon from '@mui/icons-material/Visibility';
import HistoryIcon from '@mui/icons-material/History';
import HistoryModal from 'Modal/HistoryModal';
import { useNavigate } from 'react-router-dom';

export default function PensionerInfoList() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { pensionRelated, loading, totalCount } = useSelector((state) => state.info);
    const [formOpen, setFormOpen] = useState(false);
    const [formMode, setFormMode] = useState('create');
    const [editId, setEditId] = useState(null);
    const [menuAnchorEl, setMenuAnchorEl] = useState(null);
    const [menuRowId, setMenuRowId] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [formData, setFormData] = useState({
        pensioner_id: '',
        basic_pension: '',
        commutation_amount: '',
        effective_from: '',
        effective_till: '',
        additional_pension: '',
        medical_allowance: '',
        arrear_id: '',
        remarks: '',
        is_active: 1,
    });

    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
    const [historyRecord, setHistoryRecord] = useState([]);
    const [tableHead, setTableHead] = useState([]);
    const [renderFunction, setRenderFunction] = useState(() => null);

    const toggleHistoryModal = () => {
        setIsHistoryModalOpen(!isHistoryModalOpen);
        if (isHistoryModalOpen) setHistoryRecord([]);
        handleClose();
    };

    const getTableConfig = () => ({
        head: [
            "Sr. No.",
            "Basic Pension",
            "Commutation Amount",
            "Additional Pension",
            "Medical Allowance",
            "Total Arrear",
            "Effective From",
            "Effective Till",
            "Status",
        ],
        renderRow: (record, index) => (
            <tr key={index}>
                <td>{index + 1}</td>
                <td>{record?.basic_pension ?? 'NA'}</td>
                <td>{record?.commutation_amount ?? 'NA'}</td>
                <td>{record?.additional_pension ?? 'NA'}</td>
                <td>{record?.medical_allowance ?? 'NA'}</td>
                <td>{record?.total_arrear ?? 'NA'}</td>
                <td>{record?.effective_from ?? 'NA'}</td>
                <td>{record?.effective_till ?? 'NA'}</td>
                <td>{record?.is_active ? 'true' : 'false'}</td>
            </tr>
        ),
    });

    useEffect(() => {
        dispatch(fetchPensionRelated({ page: page, limit: rowsPerPage }));
    }, [dispatch,page,rowsPerPage]);

    const handleMenuClick = (e, id) => {
        setMenuAnchorEl(e.currentTarget);
        setMenuRowId(id);
    };

    const handleClose = () => {
        setMenuAnchorEl(null);
        setMenuRowId(null);
    };

    const toggleModal = (mode) => {
        if (mode === 'create') {
            setFormData({
                pensioner_id: '',
                basic_pension: '',
                commutation_amount: '',
                effective_from: '',
                effective_till: '',
                additional_pension: '',
                medical_allowance: '',
                arrear_id: '',
                total_arrear: '',
                remarks: '',
                is_active: 1,
            });
            setFormMode('create');
        }
        setFormOpen(!formOpen);
    };

    const handleEdit = (row) => {
        setEditId(row.id);
        setFormMode('edit');
        setFormData(row);
        setFormOpen(true);
        handleClose();
    };

    const handleSubmit = (values, { setSubmitting, resetForm }) => {
        const action = formMode === 'edit'
            ? UpdatePensionRelated({ id: editId, values })
            : CreatePensionRelated(values);

        dispatch(action)
            .unwrap()
            .then(() => {
                toast.success(`Pensioner Info ${formMode === 'edit' ? 'updated' : 'added'} successfully`);
                dispatch(fetchPensionRelated());
            })
            .catch((err) => {
                toast.error(err?.response?.data?.message || err?.message || 'Error occurred.');
            });

        resetForm();
        setFormOpen(false);
        setEditId(null);
        setSubmitting(false);
    };

    const handleView = (id) => {
        handleClose();
        navigate(`/pension-related-info/view/${id}`);
    };

    const handleHistoryStatus = (id) => {
        dispatch(ShowPensionRelated(id)).then((res) => {
            const history = res.payload?.history || [];
            const config = getTableConfig();
            setHistoryRecord(history);
            setTableHead(config.head);
            setRenderFunction(() => config.renderRow);
            toggleHistoryModal();
        });
    };

    return (
        <>
            <div className='header bg-gradient-info pb-8 pt-8 pt-md-8 main-head'></div>
            <div className="mt--7 mb-7 container-fluid">
                <Card className="card-stats mb-4 mb-lg-0">
                    <CardHeader>
                        <div className="d-flex justify-content-end align-items-center">
                            <Button style={{ background: "#004080", color: "#fff" }} onClick={() => toggleModal("create")}>
                                + Add
                            </Button>
                        </div>
                    </CardHeader>
                    <CardBody>
                        {loading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <CircularProgress />
                            </Box>
                        ) : (
                            <TableContainer component={Paper} style={{ boxShadow: "none" }}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell><b>Pensioner</b></TableCell>
                                            <TableCell><b>Basic Pension</b></TableCell>
                                            <TableCell><b>Commutation</b></TableCell>
                                            <TableCell><b>Additional</b></TableCell>
                                            <TableCell><b>Medical</b></TableCell>
                                            <TableCell><b>Total Arrear</b></TableCell>
                                            <TableCell><b>From</b></TableCell>
                                            <TableCell><b>Till</b></TableCell>
                                            <TableCell><b>Action</b></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {pensionRelated.map((row, idx) => (
                                            <TableRow key={row.id}>
                                                <TableCell>{row.pensioner?.first_name}</TableCell>
                                                <TableCell>{row.basic_pension}</TableCell>
                                                <TableCell>{row.commutation_amount}</TableCell>
                                                <TableCell>{row.additional_pension}</TableCell>
                                                <TableCell>{row.medical_allowance}</TableCell>
                                                <TableCell>{row.total_arrear}</TableCell>
                                                <TableCell>{row.effective_from}</TableCell>
                                                <TableCell>{row.effective_till || 'N/A'}</TableCell>
                                                <TableCell>
                                                    <IconButton onClick={(e) => handleMenuClick(e, row.id)}>
                                                        <MoreVertIcon />
                                                    </IconButton>
                                                    <Menu
                                                        anchorEl={menuAnchorEl}
                                                        open={menuRowId === row.id}
                                                        onClose={handleClose}
                                                        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                                                    >
                                                        <MenuItem onClick={() => { handleEdit(row); handleClose(); }}>
                                                            <EditIcon fontSize="small" sx={{ mr: 1 }} /> Edit
                                                        </MenuItem>
                                                        <MenuItem onClick={() => handleView(row.id)}>
                                                            <VisibilityIcon fontSize="small" sx={{ mr: 1 }} /> View
                                                        </MenuItem>
                                                        <MenuItem onClick={() => handleHistoryStatus(row.id)}>
                                                            <HistoryIcon fontSize="small" color='warning' sx={{ mr: 1 }} /> History
                                                        </MenuItem>
                                                    </Menu>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                <TablePagination
                                    component="div"
                                    count={totalCount}
                                    page={page}
                                    onPageChange={(_, newPage) => setPage(newPage)}
                                    rowsPerPage={rowsPerPage}
                                    onRowsPerPageChange={(e) => {
                                        setRowsPerPage(parseInt(e.target.value, 10));
                                        setPage(0);
                                    }}
                                />
                            </TableContainer>
                        )}
                    </CardBody>
                </Card>
                <PensionerInfoModal
                    formOpen={formOpen}
                    setFormOpen={setFormOpen}
                    toggleModal={toggleModal}
                    formData={formData}
                    formMode={formMode}
                    handleChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
                    handleSubmit={handleSubmit}
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
