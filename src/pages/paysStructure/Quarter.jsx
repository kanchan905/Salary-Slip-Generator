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
    TextField,
    Typography
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
    const currentRoles = useSelector((state) =>
        state.auth.user?.roles?.map(role => role.name) || []
    );
    const dispatch = useDispatch();
    const {
        quarterList,
        totalCount,
        loading
    } = useSelector((state) => state.quarter);
    const [isOpen, setIsOpen] = React.useState(false);
    const [formMode, setFormMode] = React.useState('create');
    const [editId, setEditId] = React.useState(null);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [renderFunction, setRenderFunction] = React.useState(() => null);
    const [firstRow, setFirstRow] = React.useState({});
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

        if (isHistoryModalOpen) {
            setHistoryRecord([]);
            // setFirstRow({});
        }
    };



    const getTableConfig = (data, type) => {
        switch (type) {
            case "quarter":
                return {
                    head: [
                        "Sr. No.",
                        "Quarter No.",
                        "Type",
                        "License Fee",
                        "Added By",
                        "Edited By",
                        "Created At",
                        "Updated At"
                    ],
                    firstRow: (
                        <tr className="bg-green text-white">
                            <td>{1}</td>
                            <td>{data?.quarter_no ?? "-"}</td>
                            <td>{data?.type ?? "-"}</td>
                            <td>{data?.license_fee ?? "-"}</td>
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
                            <td>{index + 2}</td>
                            <td>{record?.quarter_no ?? "-"}</td>
                            <td>{record?.type ?? "-"}</td>
                            <td>{record?.license_fee ?? "-"}</td>
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
                };
            // You can add more like designation, pay scale, etc.
            default:
                return null;
        };
    }


    const handleHistoryShow = (id) => {
        dispatch(fetchQuarterShow(id)).then((action) => {
            const quarterData = action.payload?.data;
            if (!quarterData) {
                toast.error("Failed to fetch quarter details.");
                return;
            }
            const config = getTableConfig(quarterData, "quarter");
            setTableHead(config.head);
            setFirstRow(config.firstRow);
            setRenderFunction(() => config.renderRow);
            const history = quarterData.history;
            if (Array.isArray(history) && history.length > 0) {
                setHistoryRecord(history);
            } else {
                setHistoryRecord([]);
            }
            toggleHistoryModal();
        });
    };


    const [formData, setFormData] = React.useState({
        quarter_no: '',
        type: '',
        license_fee: '',
    });

    useEffect(() => {
        dispatch(fetchQuarterList({ page: page + 1, limit: rowsPerPage }));
    }, [dispatch, page, rowsPerPage]);


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


    const handleSubmit = (values, { setSubmitting, resetForm }) => {
        const payload = {
            quarter_no: values.quarter_no,
            type: values.type,
            license_fee: values.license_fee,
        };
        if (formMode === 'edit') {
            dispatch(updateQuarter({ formData: payload, id: editId }))
                .unwrap()
                .then(() => {
                    toast.success('Quarter updated successfully');
                    toggleModal();
                    dispatch(fetchQuarterList({ page: page + 1, limit: rowsPerPage }));
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
                    dispatch(fetchQuarterList({ page: page + 1, limit: rowsPerPage }));
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

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        const newRowsPerPage = parseInt(event.target.value);
        setRowsPerPage(newRowsPerPage);
        setPage(0); // Reset to first page when changing rows per page
    };

    return (
        <>
            <div className='header bg-gradient-info pb-8 pt-8 pt-md-8 main-head'></div>
            <div className="mt--7 mb-7 container-fluid">
                <Card className="card-stats mb-4 mb-lg-0">
                    <CardHeader>
                        <div className="d-flex justify-content-between align-items-center">
                            <Typography variant='h4'>Quarter</Typography>
                            {
                               currentRoles.some(role => ['IT Admin',"Salary Processing Coordinator (NIOH)", "Salary Processing Coordinator (ROHC)"].includes(role)) && (
                                    <Button
                                        style={{ background: "#004080", color: '#fff' }}
                                        type="button"
                                        onClick={() => toggleModal('create')}
                                    >
                                        + Add Quarter
                                    </Button>
                                )}
                        </div>
                    </CardHeader>
                    <CardBody>
                        {/* Data listing will go here */}
                        <div className="table-responsive">
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell style={{ fontWeight: "900" }}>Sr. No.</TableCell>
                                        <TableCell style={{ fontWeight: "900" }}>Alloted To </TableCell>
                                        <TableCell style={{ fontWeight: "900" }}>Occupant Institute</TableCell>
                                        <TableCell style={{ fontWeight: "900" }}>Quarter No</TableCell>
                                        <TableCell style={{ fontWeight: "900" }}>Type</TableCell>
                                        <TableCell style={{ fontWeight: "900" }}>License Fee</TableCell>
                                        <TableCell align="left" style={{ fontWeight: "900" }}>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {loading ? (
                                        <TableRow>
                                            <TableCell colSpan={6} align="center">
                                                <CircularProgress />
                                            </TableCell>
                                        </TableRow>
                                    ) : quarterList.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} align="center">No data available</TableCell>
                                        </TableRow>
                                    ) : (
                                        quarterList.map((row, index) => (
                                            <TableRow key={`quarter-${index}`}>
                                                <TableCell>{(page * rowsPerPage) + index + 1}</TableCell>
                                                <TableCell>{row.employee_quarter?.[0]?.employee?.name || 'This quarter is vacant'} - {row.employee_quarter?.[0]?.employee?.employee_code || "-"}</TableCell>
                                                <TableCell>{row.employee_quarter?.[0]?.employee?.institute || 'N/A'}</TableCell>
                                                <TableCell>{row.quarter_no}</TableCell>
                                                <TableCell>{row.type}</TableCell>
                                                <TableCell>{row.license_fee}</TableCell>
                                                <TableCell align="left">
                                                    {
                                                       currentRoles.some(role => ['IT Admin',"Salary Processing Coordinator (NIOH)", "Salary Processing Coordinator (ROHC)"].includes(role)) && (
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
                                                                <EditIcon />
                                                            </IconButton>
                                                        )}
                                                    <IconButton color="warning" aria-label="history" onClick={() => handleHistoryShow(row.id)}>
                                                        <HistoryIcon />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
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
                        </div>
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
                    firstRow={firstRow}
                />
            </div>
        </>
    );
}
