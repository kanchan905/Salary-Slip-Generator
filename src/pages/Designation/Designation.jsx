import React, { useEffect, useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, IconButton,
    Menu, MenuItem, TextField, Chip,
    TablePagination, Box
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import {
    Button,
    Card,
    CardHeader,
    CardBody,
} from "reactstrap";
import { useDispatch, useSelector } from 'react-redux';
import { 
    fetchDesignations, 
    createDesignation, 
    updateDesignation
} from '../../redux/slices/designationSlice';
import DesignationFormModal from '../../Modal/DesignationFormModal';
import CircularProgress from '@mui/material/CircularProgress';
import { toast } from 'react-toastify';
import useDebounce from '../../hooks/useDebounce';

export default function Designation() {
    const [anchorEl, setAnchorEl] = useState(null);
    const [menuIndex, setMenuIndex] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedDesignation, setSelectedDesignation] = useState(null);
    const [modalType, setModalType] = useState('create');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [inputValue, setInputValue] = useState('');

    const dispatch = useDispatch();
    const { designations, loading } = useSelector((state) => state.designation);
    const currentRoles = useSelector((state) =>
        state.auth.user?.roles?.map(role => role.name) || []
    );

    const debouncedSearch = useDebounce((value) => {
        setSearchTerm(value);
    }, 1000);

    useEffect(() => {
        dispatch(fetchDesignations());
    }, [dispatch]);


    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleMenuClick = (event, index) => {
        setAnchorEl(event.currentTarget);
        setMenuIndex(index);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setMenuIndex(null);
    };

    const openCreateModal = () => {
        setModalType('create');
        setSelectedDesignation(null);
        setModalOpen(true);
    };

    const openEditModal = (designation) => {
        setModalType('edit');
        setSelectedDesignation(designation);
        setModalOpen(true);
        handleClose();
    };

    const handleSave = (formData) => {
        if (modalType === 'create') {
            dispatch(createDesignation(formData))
                .unwrap()
                .then(() => {
                    toast.success('Designation created successfully');
                    dispatch(fetchDesignations());
                    setModalOpen(false);
                })
                .catch((err) => {
                    const apiMsg = err?.response?.data?.message || err?.message || 'Failed to create designation';
                    toast.error(apiMsg);
                });
        } else {
            dispatch(updateDesignation({ id: selectedDesignation.id, designationData: formData }))
                .unwrap()
                .then(() => {
                    toast.success('Designation updated successfully');
                    dispatch(fetchDesignations());
                    setModalOpen(false);
                })
                .catch((err) => {
                    const apiMsg = err?.response?.data?.message || err?.message || 'Failed to update designation';
                    toast.error(apiMsg);
                });
        }
    };

    // Filter designations based on search across name and options
    const filteredDesignations = (Array.isArray(designations) ? designations : []).filter(designation => {
        const term = searchTerm.toLowerCase();
        const nameMatch = designation.name?.toLowerCase().includes(term);
        const optionsMatch = Array.isArray(designation.options) && designation.options.some(opt => (opt || '').toLowerCase().includes(term));
        return !term || nameMatch || optionsMatch;
    });

    const paginatedDesignations = filteredDesignations.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    return (
        <>
            <div className='header bg-gradient-info pb-8 pt-8 pt-md-8 main-head'></div>
            <div className="mt--7 mb-7 container-fluid">
                <Card className="card-stats mb-4 mb-lg-0">
                    <CardHeader>
                        <div className="container-fluid px-0">
                            <div className="row align-items-center g-2">
                                <div className="col-12 col-md-auto mb-2 mb-md-0">
                                    <h5 className="mb-0">Designation Management</h5>
                                </div>
                                
                                <div className="col-12 col-sm-6 col-md mb-2 mb-md-0">
                                    <TextField
                                        label="Search by Name or Options"
                                        size="small"
                                        variant="outlined"
                                        value={inputValue}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            setInputValue(value);
                                            debouncedSearch(value);
                                        }}
                                        style={{ width: '100%' }}
                                        fullWidth
                                    />
                                </div>
                                
                                {currentRoles.includes("IT Admin") && (
                                    <div className="col-12 col-md-auto">
                                        <Button
                                            style={{ background: "#004080", color: '#fff', width: '100%' }}
                                            type="button"
                                            onClick={openCreateModal}
                                        >
                                            + Add Designation
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardHeader>
                    
                    <CardBody>
                        {loading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
                                <CircularProgress />
                            </Box>
                        ) : (
                            <TableContainer component={Paper} style={{ boxShadow: "none" }}>
                                <div className="table-responsive">
                                    <Table>
                                        <TableHead>
                                            <TableRow style={{ whiteSpace: "nowrap" }}>
                                                <TableCell style={{ fontWeight: "900" }}>Sr. No.</TableCell>
                                                <TableCell style={{ fontWeight: "900" }}>Designation Name</TableCell>
                                                <TableCell style={{ fontWeight: "900" }}>Options</TableCell>
                                                {/* <TableCell style={{ fontWeight: "900" }}>Created At</TableCell> */}
                                                <TableCell align="right" style={{ fontWeight: "900" }}>Actions</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {paginatedDesignations.length > 0 ? paginatedDesignations.map((designation, idx) => (
                                                <TableRow key={designation.id || idx} style={{ whiteSpace: "nowrap" }}>
                                                    <TableCell>{(page * rowsPerPage) + idx + 1}</TableCell>
                                                    <TableCell className='text-capitalize'>
                                                        {designation.name || "N/A"}
                                                    </TableCell>
                                                    <TableCell>
                                                        {Array.isArray(designation.options) && designation.options.length > 0 ? (
                                                            <div className="d-flex flex-wrap gap-1">
                                                                {designation.options.map((opt, i) => (
                                                                    <Chip key={i} label={opt} size="small" style={{ marginRight: 6, marginBottom: 6 }} />
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            'N/A'
                                                        )}
                                                    </TableCell>
                                                    {/* <TableCell>
                                                        {designation.created_at ? 
                                                            new Date(designation.created_at).toLocaleDateString() : 
                                                            "N/A"
                                                        }
                                                    </TableCell> */}
                                                    <TableCell align="right">
                                                        <IconButton onClick={(e) => handleMenuClick(e, idx)}>
                                                            <MoreVertIcon />
                                                        </IconButton>
                                                        <Menu
                                                            anchorEl={anchorEl}
                                                            open={menuIndex === idx}
                                                            onClose={handleClose}
                                                            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                                                        >
                                                            {currentRoles.includes("IT Admin") && (
                                                                <MenuItem onClick={() => openEditModal(designation)}>
                                                                    <EditIcon fontSize="small" style={{ marginRight: 8 }} />
                                                                    Edit
                                                                </MenuItem>
                                                            )}
                                                        </Menu>
                                                    </TableCell>
                                                </TableRow>
                                            )) : (
                                                <TableRow>
                                                    <TableCell align='center' colSpan={5}>
                                                        {filteredDesignations.length === 0 && searchTerm ? 
                                                            'No designations found matching your search' : 
                                                            'No designations found'
                                                        }
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                                
                                {filteredDesignations.length > 0 && (
                                    <div className="d-flex justify-content-end align-items-center p-2">
                                        <TablePagination
                                            component="div"
                                            count={filteredDesignations.length}
                                            page={page}
                                            onPageChange={handlePageChange}
                                            rowsPerPage={rowsPerPage}
                                            onRowsPerPageChange={handleChangeRowsPerPage}
                                        />
                                    </div>
                                )}
                            </TableContainer>
                        )}
                    </CardBody>
                </Card>

                {/* Designation Form Modal */}
                <DesignationFormModal
                    isOpen={modalOpen}
                    toggle={() => setModalOpen(false)}
                    modalType={modalType}
                    designation={selectedDesignation}
                    onSave={handleSave}
                />
            </div>
        </>
    );
}
