import React, { useEffect, useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    IconButton, TextField, TablePagination, Box,
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
import { addPayCommisions, fetchPayCommisions, fetchPayCommisionShow, updatePayCommisions } from '../../redux/slices/payCommision';
import CommissionModal from 'Modal/CommissionModal';
import HistoryModal from 'Modal/HistoryModal';


export default function CommissionCreate() {
    const dispatch = useDispatch();
    const { payCommissions, singleCommission, loading } = useSelector((state) => state.payCommision);
    const totalCount = useSelector((state) => state.payCommision.totalCount) || 0;
    const { error } = useSelector((state) => state.employeeLoan)
    const [menuIndex, setMenuIndex] = useState(null);
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
    
    
    const getTableConfig = () => {
        return {
            head: [
                "Sr. No.",
                "Name",
                "Year",
                "Status",
                "Added By",
                "Edited By"
            ],
            renderRow: (record, index) => (
                <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{record?.name ?? "-"}</td>
                    <td>{record?.year ?? "-"}</td>
                    <td>{record?.is_active ? "Active" : "Inactive"}</td>
                    <td>{ record?.added_by?.name || "NA" }</td>
                    <td>{ record?.edited_by?.name }</td>
                </tr>
            ),
        }
    }

    useEffect(() => {
        dispatch(fetchPayCommisions({ id: searchQuery, page, limit: rowsPerPage }));
    }, [dispatch, searchQuery, page, rowsPerPage]);

    useEffect(() => {
        if (shouldOpenHistory && singleCommission) {
            const config = getTableConfig();
            setHistoryRecord(singleCommission?.history);
            setTableHead(config.head);
            setRenderFunction(() => config.renderRow);
            setIsHistoryModalOpen(true);
            setShouldOpenHistory(false);
        }
    }, [singleCommission, shouldOpenHistory]);



    // const filteredData = dearness.filter((item) =>
    //   String(item.dr_percentage).toLowerCase().includes(searchQuery.toLowerCase())
    // );

    // const paginatedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setPage(0);
    };

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
            console.log("Edit Values", values);
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
        setHistoryRecord([]);
        setIsHistoryModalOpen(true);
        dispatch(fetchPayCommisionShow(id))
        .unwrap()
        .then(() => {
            setShouldOpenHistory(true);
        }); 
    }



    return (
        <>
            <div className='header bg-gradient-info pb-8 pt-8 pt-md-8 main-head'></div>
            <div className="mt--7 mb-7 container-fluid">
                <Card className="card-stats mb-4 mb-lg-0">
                    <CardHeader>
                        <div className="d-flex justify-content-between align-items-center">
                            <h5 className="mb-0">Pay Commission</h5>
                            <Button style={{ background: "#004080", color: "#fff" }} onClick={() => toggleModal("create")}>
                                + Add
                            </Button>
                        </div>
                    </CardHeader>
                    <CardBody>
                        <div className="custom-scrollbar">
                            {loading ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <CircularProgress />
                                </Box>
                            ) : (
                                <TableContainer component={Paper} style={{ boxShadow: "none"}}>
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
                                            {payCommissions.map((row, idx) => (
                                                <TableRow key={row.id}>                                              
                                                    <TableCell>{idx + 1}</TableCell>
                                                    <TableCell>{row.name}</TableCell>
                                                    <TableCell>{row.year}</TableCell>
                                                    <TableCell>{row.is_active ? <Chip label="Active" color='success' variant="outlined" size="small"/> : <Chip label="Inactive" color='error' variant="outlined" size="small" /> }</TableCell>                                                  
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
                                                            <MenuItem onClick={() => { handleEdit(selectedRow); handleClose(); }}>
                                                                <EditIcon fontSize="small" sx={{ mr: 1 }} /> Edit
                                                            </MenuItem>
                                                            <MenuItem onClick={() => { handleHistoryShow(selectedRow.id); handleClose(); }}>
                                                                <HistoryIcon fontSize="small" sx={{ mr: 1 }} /> History
                                                            </MenuItem>
                                                        </Menu>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
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
                />
            </div>
        </>
    );
}
