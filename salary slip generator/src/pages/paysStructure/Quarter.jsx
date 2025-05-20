import { Box, Button, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
import QuarterModal from 'Modal/QuarterModal';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Card, CardBody, CardHeader } from 'reactstrap';
import { createQuarter, fetchQuarterList, updateQuarter } from '../../redux/slices/quarterSlice';

export default function Quarter() {
    const dispatch = useDispatch();
    const { quarterList, totalCount, loading } = useSelector((state) => state.quarter);
    const [isOpen, setIsOpen] = React.useState(false);
    const [formMode, setFormMode] = React.useState('create');
    const [editId, setEditId] = React.useState(null);

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
                                        <TableCell>Sr. No.</TableCell>
                                        <TableCell>Quarter No</TableCell>
                                        <TableCell>Type</TableCell>
                                        <TableCell>License Fee</TableCell>
                                        <TableCell align="right">Actions</TableCell>
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
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{row.quarter_no}</TableCell>
                                            <TableCell>{row.type}</TableCell>
                                            <TableCell>{row.license_fee}</TableCell>
                                            <TableCell align="right">
                                                <Button
                                                    onClick={() => {
                                                        setFormData(row);
                                                        setEditId(row.id);
                                                        setFormMode('edit');
                                                        toggleModal('edit');
                                                    }}
                                                >
                                                    Edit
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                }
                                </TableBody>
                            </Table>
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


            </div>
        </>
    );
}
