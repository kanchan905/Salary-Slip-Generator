import React, { useEffect, useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    IconButton, TablePagination, Box,
    Chip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import HistoryIcon from '@mui/icons-material/History';
import {
    Button,
    Card,
    CardHeader,
    CardBody
} from "reactstrap";
import CircularProgress from '@mui/material/CircularProgress';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useNavigate } from 'react-router-dom';
import {
    addPayCommisions,
    fetchPayCommisions,
    fetchPayCommisionShow,
    updatePayCommisions
} from '../../redux/slices/payCommision';
import CommissionModal from 'Modal/CommissionModal';
import HistoryModal from 'Modal/HistoryModal';


export default function CommissionCreate() {
    const dispatch = useDispatch();
    const { payCommissions, singleCommission, loading } = useSelector((state) => state.payCommision);
    const totalCount = useSelector((state) => state.payCommision.totalCount) || 0;
    const { error } = useSelector((state) => state.employeeLoan);
    const [menuIndex, setMenuIndex] = useState(null);
    const currentRoles = useSelector((state) =>
        state.auth.user?.roles?.map(role => role.name) || []
    );
    const [formOpen, setFormOpen] = useState(false);
    const [formMode, setFormMode] = useState('create');
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState({
        commission_id: "",
        name: "",
        year: "",
        is_active: ""
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedRow, setSelectedRow] = useState(null);  // 👈 track which row is selected
    const navigate = useNavigate();
    const [renderFunction, setRenderFunction] = React.useState(() => null);
    const [historyRecord, setHistoryRecord] = React.useState([]);
    const [firstRow, setFirstRow] = useState({});
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
        setIsHistoryModalOpen(prev => !prev);
        if (isHistoryModalOpen) {
            setHistoryRecord([]);
        }
    };
    // const [shouldOpenHistory, setShouldOpenHistory] = React.useState(false);


    const getTableConfig = (data) => {
        return {
            head: [
                "Sr. No.",
                "Name",
                "Year",
                "Status",
                "Added By",
                "Edited By",
                "Created At",
                "Updated At"
            ],
            firstRow: (
                <tr className="bg-green text-white">
                    <td>{1}</td>
                    <td>{data?.name ?? "-"}</td>
                    <td>{data?.year ?? "-"}</td>
                    <td>
                        {data?.is_active
                            ? <Chip sx={{ backgroundColor: 'white', color: 'green' }} label="Active" size="small" />
                            : <Chip sx={{ backgroundColor: 'white', color: 'red' }} label="Inactive" size="small" />
                        }
                    </td>
                    <td className='text-capitalize'>{data?.added_by
                        ? `${data.added_by.name || '-'}${data.added_by.roles && data.added_by.roles.length > 0 ? ' (' + data.added_by.roles.map(role => role.name).join(', ') + ')' : ''}`
                        : 'NA'}</td>
                    <td className='text-capitalize'>{data?.edited_by
                        ? `${data.edited_by.name || '-'}${data.edited_by.roles && data.edited_by.roles.length > 0 ? ' (' + data.edited_by.roles.map(role => role.name).join(', ') + ')' : ''}`
                        : 'NA'}</td>
                    <td>{data?.created_at ? new Date(data.created_at).toLocaleString() : '-'}</td>
                    <td>{data?.updated_at ? new Date(data.updated_at).toLocaleString() : '-'}</td>
                </tr>
            ),
            renderRow: (record, index) => (
                <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{record?.name ?? "-"}</td>
                    <td>{record?.year ?? "-"}</td>
                    <td>{record?.is_active ? "Active" : "Inactive"}</td>
                    <td>{record?.added_by
                        ? `${record.added_by.name || '-'}${record.added_by.roles && record.added_by.roles.length > 0 ? ' (' + record.added_by.roles.map(role => role.name).join(', ') + ')' : ''}`
                        : 'NA'}</td>
                    <td>{record?.edited_by
                        ? `${record.edited_by.name || '-'}${record.edited_by.roles && record.edited_by.roles.length > 0 ? ' (' + record.edited_by.roles.map(role => role.name).join(', ') + ')' : ''}`
                        : 'NA'}</td>
                    <td>{record?.created_at ? new Date(record.created_at).toLocaleString() : '-'}</td>
                    <td>{record?.updated_at ? new Date(record.updated_at).toLocaleString() : '-'}</td>
                </tr>
            ),
        }
    }

    useEffect(() => {
        dispatch(fetchPayCommisions({ id: searchQuery, page, limit: rowsPerPage }));
    }, [dispatch, searchQuery, page, rowsPerPage]);



    const handlePageChange = (_, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (e) => {
        setRowsPerPage(parseInt(e.target.value, 10));
        setPage(0);
    };


    const handleClose = () => {
        setAnchorEl(null);
        setMenuIndex(null);
    };

    const toggleModal = (mode) => {
        if (mode === 'create') {
            setFormData({
                name: "",
                year: "",
                is_active: ""
            });
            setFormMode('create');
        }
        setFormOpen(!formOpen);
    };

    const handleEdit = (row) => {
        setEditId(row.id);
        setFormMode('edit');
        setFormData({
            name: row.name || '',
            year: row.year || '',
            is_active: row.is_active ?? 1
        });
        setFormOpen(true);
        handleClose();
    };

    const handleSubmit = (values, { setSubmitting, resetForm }) => {
        if (formMode === 'edit') {
            dispatch(updatePayCommisions({ id: editId, values: values }))
                .unwrap()
                .then(() => {
                    toast.success("Commission updated successfully");
                    dispatch(fetchPayCommisions({ id: searchQuery, page, limit: rowsPerPage }));
                })
                .catch((err) => {
                    const apiMsg =
                        err?.response?.data?.message ||
                        err?.message ||
                        'Failed to save commission.';
                    toast.error(apiMsg);
                });
        } else {
            dispatch(addPayCommisions(values))
                .unwrap()
                .then(() => {
                    toast.success("Commission added");
                    dispatch(fetchPayCommisions({ id: searchQuery, page, limit: rowsPerPage }));
                })
                .catch((err) => {
                    const apiMsg =
                        err?.response?.data?.message ||
                        err?.message ||
                        'Failed to save commission.';
                    toast.error(apiMsg);
                });
        }
        resetForm();
        setFormOpen(false);
        setEditId(null);
        setSubmitting(false);
    };

    const handleMenuClick = (event, row) => {
        setAnchorEl(event.currentTarget);
        setSelectedRow(row);  // 👈 store the clicked row here
    };


    const handleHistoryShow = (id) => {
        handleClose();
        dispatch(fetchPayCommisionShow(id)).then((action) => {
            const commissionData = action.payload;

            if (!commissionData) {
                toast.error("Failed to fetch commission details.");
                return;
            }

            const config = getTableConfig(commissionData);
            setTableHead(config.head);
            setFirstRow(config.firstRow);
            setRenderFunction(() => config.renderRow);

            const history = commissionData.history;
            if (Array.isArray(history) && history.length > 0) {
                setHistoryRecord(history);
            } else {
                setHistoryRecord([]);
            }

            toggleHistoryModal();
        });
    };


    return (
        <>
            <div className='header bg-gradient-info pb-8 pt-8 pt-md-8 main-head'></div>
            <div className="mt--7 mb-7 container-fluid">
                <Card className="card-stats mb-4 mb-lg-0">
                    <CardHeader>
                        <div className="d-flex justify-content-between align-items-center">
                            <h5 className="mb-0">Pay Commission</h5>
                            {
                               currentRoles.some(role => ['IT Admin',"Salary Processing Coordinator (NIOH)", "Salary Processing Coordinator (ROHC)"].includes(role)) && (
                                    <Button style={{ background: "#004080", color: "#fff" }} onClick={() => toggleModal("create")}>
                                        + Add
                                    </Button>
                                )
                            }
                        </div>
                    </CardHeader>
                    <CardBody>
                        <div className="custom-scrollbar">
                            {loading ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <CircularProgress />
                                </Box>
                            ) : (
                                <TableContainer component={Paper} style={{ boxShadow: "none" }}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell style={{ fontWeight: "900" }}>Sr. No.</TableCell>
                                                <TableCell style={{ fontWeight: "900" }}>Pay Commission</TableCell>
                                                <TableCell style={{ fontWeight: "900" }}>Year</TableCell>
                                                <TableCell style={{ fontWeight: "900" }}>Status</TableCell>
                                                <TableCell style={{ fontWeight: "900" }}>Action</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {payCommissions.length === 0 ? (
                                                <TableRow>
                                                    <TableCell align="center" colSpan={5}>No data available</TableCell>
                                                </TableRow>
                                            ) : (
                                                payCommissions.map((row, idx) => (
                                                    <TableRow key={row.id}>
                                                        <TableCell>{(page * rowsPerPage) + idx + 1}</TableCell>
                                                        <TableCell>{row.name}</TableCell>
                                                        <TableCell>{row.year}</TableCell>
                                                        <TableCell>{row.is_active ? <Chip label="Active" color='success' variant="outlined" size="small" /> : <Chip label="Inactive" color='error' variant="outlined" size="small" />}</TableCell>
                                                        <TableCell align="left">
                                                            <IconButton onClick={(e) => handleMenuClick(e, row)}>
                                                                <MoreVertIcon />
                                                            </IconButton>
                                                            <Menu
                                                                anchorEl={anchorEl}
                                                                open={Boolean(anchorEl)}
                                                                onClose={handleClose}
                                                                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                                                            >
                                                                {
                                                                   currentRoles.some(role => ['IT Admin',"Salary Processing Coordinator (NIOH)", "Salary Processing Coordinator (ROHC)"].includes(role)) && (
                                                                        <MenuItem onClick={() => { handleEdit(selectedRow) }}>
                                                                            <EditIcon fontSize="small" sx={{ mr: 1 }} /> Edit
                                                                        </MenuItem>
                                                                    )
                                                                }
                                                                <MenuItem onClick={() => { handleHistoryShow(selectedRow.id) }}>
                                                                    <HistoryIcon fontSize="small" sx={{ mr: 1 }} /> History
                                                                </MenuItem>
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
                            component="div"
                            count={totalCount}
                            page={page}
                            onPageChange={handlePageChange}
                            rowsPerPage={rowsPerPage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </CardBody>
                </Card>
                <CommissionModal
                    setFormOpen={setFormOpen}
                    formOpen={formOpen}
                    toggleModal={toggleModal}
                    formMode={formMode}
                    formData={formData}
                    handleChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
                    handleSubmit={handleSubmit}
                />

                <HistoryModal
                    isOpen={isHistoryModalOpen}
                    toggle={toggleHistoryModal}
                    tableHead={tableHead}
                    historyRecord={historyRecord}
                    renderRow={renderFunction}
                    firstRow={firstRow}
                />
            </div>
        </>
    );
}
