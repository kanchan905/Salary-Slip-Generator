import React, { useEffect, useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    IconButton, TextField, TablePagination, Box, Menu, MenuItem
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
    fetchNetPension,
    showNetPension,
    updateNetPension,
} from '../../redux/slices/netPensionSlice';
import NetPensionModal from '../../Modal/NetPensionModal';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ViewIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';
import HistoryIcon from '@mui/icons-material/History';
import HistoryModal from 'Modal/HistoryModal';
import { months } from 'utils/helpers';

export default function NetPension() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { name } = useSelector((state) => state.auth.user.role);
    const { netPension, netPensionData, loading } = useSelector((state) => state.netPension);
    console.log('netPension',netPension)
    const totalCount = useSelector((state) => state.netPension.totalCount) || 0;
    const { error } = useSelector((state) => state.netSalary)
    const [anchorEl, setAnchorEl] = useState(null);
    const [menuIndex, setMenuIndex] = useState(null);
    const [formOpen, setFormOpen] = useState(false);
    const [formMode, setFormMode] = useState('create');
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState({
        pensioner_id: "",
        pensioner_bank_id: "",
        month: "",
        year: "",
        processing_date: "",
        payment_date: "",
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [renderFunction, setRenderFunction] = useState(() => null);
    const [historyRecord, setHistoryRecord] = useState([]);
    const [tableHead, setTableHead] = useState([
        "Sr. No.",
        "Head 1",
        "Head 2",
        "Head 3",
        "Head 4",
        "Head 5",
        "Head 6",
    ]);

    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
    const toggleHistoryModal = () => {
        setIsHistoryModalOpen(!isHistoryModalOpen)
        handleClose();
    };

    const getTableConfig = (type) => {
        switch (type) {
            case "status":
                return {
                    head: [
                        "Sr. No.",
                        "Employee Code",
                        "Month",
                        "Net Amount",
                        "Processing Date",
                        "Payment Date",
                        "Verified By",
                        "Added By",
                        "Edited By"
                    ],
                    renderRow: (record, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{record?.employee_id}</td>
                            <td>{months.find((m) => m.value === record.month)?.label || 'NA'}</td>
                            <td>{record.net_amount || "NA"}</td>
                            <td>{record.processing_date || "NA"}</td>
                            <td>{record.payment_date || "NA"}</td>
                            <td>{record.verified_by?.name}</td>
                            <td>{record.added_by?.name}</td>
                            <td>{record.edited_by?.name || "NA"}</td>
                        </tr>
                    ),
                };

            // You can add more like designation, pay scale, etc.

            default:
                return { head: [], renderRow: () => null };
        }
    };

    // Status History handlers
    const handleHistoryStatus = (id) => {
        console.log("Salary ID: ", id);
        dispatch(showNetPension(id));
    };

    useEffect(() => {
        if (netPensionData && netPensionData.history) {
            const config = getTableConfig("status");
            setHistoryRecord(netPensionData?.history || []);
            setTableHead(config.head);
            setRenderFunction(() => config.renderRow); // <- use useState to hold render function
            toggleHistoryModal();
        }
    }, [netPensionData]);


    useEffect(() => {
        dispatch(fetchNetPension({ page, limit: rowsPerPage }));
    }, [dispatch, searchQuery]);


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
                pensioner_id: "",
                pensioner_bank_id: "",
                month: "",
                year: "",
                processing_date: "",
                payment_date: "",
            });
            setFormMode('create');
        }
        setFormOpen(!formOpen);
    };

    const handleEdit = (row) => {
        setEditId(row.id);
        setFormMode('edit');
        setFormData({
            pensioner_id: row.pensioner_id || "",
            pensioner_bank_id: row.pensioner_bank_id || "",
            month: row.month || "",
            year: row.year || "",
            processing_date: row.processing_date || "",
            payment_date: row.payment_date || "",
        });
        setFormOpen(true);
        handleClose();
    };

    const handleSubmit = (values, { setSubmitting, resetForm }) => {
            dispatch(updateNetPension(values))
                .unwrap()
                .then(() => {
                    toast.success("NetSalary added");
                    dispatch(fetchNetPension({ page, limit: rowsPerPage }));
                })
                .catch((err) => {
                    const apiMsg =
                        err?.response?.data?.message ||
                        err?.message ||
                        'Failed to save pensioner.';
                    toast.error(apiMsg);
                });
        resetForm();
        setFormOpen(false);
        setEditId(null);
        setSubmitting(false);
    };

    const handleMenuClick = (event, index) => {
        setAnchorEl(event.currentTarget);
        setMenuIndex(index);
    };

    const handleView = (id) => {
        handleClose();
        navigate(`/${name.toLowerCase()}/employee/net-salary/${id}`);
    }

    const isValidAnchorEl = document.body.contains(anchorEl);

    console.log("Is valid anchorEl: ", isValidAnchorEl);
    return (
        <>
            <div className='header bg-gradient-info pb-8 pt-8 pt-md-8 main-head'></div>
            <div className="mt--7 mb-7 container-fluid">
                <Card className="card-stats mb-4 mb-lg-0">
                    <CardHeader>
                        <div className="d-flex justify-content-between align-items-center">
                            {/* <TextField placeholder="Employee Id" onChange={handleSearchChange} /> */}
                            {/* <Button style={{ background: "#004080", color: "#fff" }} onClick={() => toggleModal("create")}>
                                + Add
                            </Button> */}
                        </div>
                    </CardHeader>
                    <CardBody>
                        <div style={{ width: '100%', overflowX: 'auto' }} className="custom-scrollbar">
                            {loading ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <CircularProgress />
                                </Box>
                            ) : (
                                <TableContainer component={Paper} style={{ boxShadow: "none", minWidth: 1000 }}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Pensioner Id</TableCell>
                                                <TableCell>Month</TableCell>
                                                <TableCell>Year</TableCell>
                                                <TableCell>Net Pension</TableCell>
                                                <TableCell>Payment Date</TableCell>
                                                <TableCell>Verified</TableCell>
                                                <TableCell>Action</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {netPension?.data?.map((row, idx) => (
                                                <TableRow key={row.id}>
                                                    <TableCell>{row.pensioner_id}</TableCell>
                                                    <TableCell>{row.month}</TableCell>
                                                    <TableCell>{row.year}</TableCell>                                                   
                                                    <TableCell>{row.net_pension}</TableCell>
                                                    <TableCell>{row.payment_date}</TableCell>
                                                    <TableCell>{row.is_verified}</TableCell>
                                                    <TableCell align="left">
                                                        <IconButton onClick={(e) => handleMenuClick(e, idx)}>
                                                            <MoreVertIcon />
                                                        </IconButton>
                                                        <Menu
                                                            anchorEl={anchorEl}
                                                            open={Boolean(anchorEl)}
                                                            onClose={handleClose}
                                                            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                                                        >
                                                            <MenuItem
                                                                onClick={() => handleView(row.id)}
                                                            >
                                                                <ViewIcon fontSize="small" /> View
                                                            </MenuItem>
                                                            <MenuItem onClick={() => handleEdit(row)}>
                                                                <EditIcon fontSize="small" /> Edit
                                                            </MenuItem>
                                                            <MenuItem onClick={() => handleHistoryStatus(row.id)}>
                                                                <HistoryIcon fontSize="small" /> History
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
                <NetPensionModal
                    setFormOpen={setFormOpen}
                    formOpen={formOpen}
                    toggleModal={toggleModal}
                    formMode={formMode}
                    formData={formData}
                    handleChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
                    handleSubmit={handleSubmit}
                />
            </div>
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
