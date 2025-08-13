import React, { useEffect, useState } from 'react';
import { CardBody, CardHeader, Card, Button } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { createEmployeeQuarter, fetchEmployeeQuarterList, fetchEmployeeQuarterShow, fetchQuarterList, updateEmployeeQuarter } from '../../redux/slices/quarterSlice'
import QuarterAllocateModal from 'Modal/QuarterAllocateModal';
import { NavLink, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import CircularProgress from '@mui/material/CircularProgress';
import { Box } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import HistoryIcon from '@mui/icons-material/History';
import HistoryModal from 'Modal/HistoryModal';
import { dateFormat } from 'utils/helpers';

const PAGE_SIZE = 10;

function EmployeeQuarter() {
    const { id } = useParams();
    const [currentPage, setCurrentPage] = useState(1);
    const quarters = useSelector((state) => state.quarter.employeeQuarterList) || [];
    const employeeQuarterShow = useSelector((state) => state.quarter.employeeQuarterShow);
    const totalPages = Math.max(1, Math.ceil(quarters.length / PAGE_SIZE));
    const dispatch = useDispatch();
    const [modalOpen, setModalOpen] = useState(false);
    const [editId, setEditId] = useState(null);
    const [form, setForm] = useState({
        quarter_id: '',
        date_of_allotment: '',
        date_of_occupation: '',
        date_of_leaving: '',
        is_occupied: '',
        is_current: false,
    });
    const [renderFunction, setRenderFunction] = React.useState(() => null);
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

    const updateStatus = useSelector((state) => state.quarter.updateStatus);
    const loading = useSelector((state) => state.quarter.loading);
    const error = useSelector((state) => state.quarter.error);
    const { quarterList } = useSelector((state) => state.quarter);
    const { name } = useSelector((state) => state.auth.user.roles[0]);
    const filterQuarter = quarters.filter(q =>
        quarterList.includes(q.id)
    );
  


    useEffect(() => {
        if (quarterList && quarters) {

            const filterQuarter = quarters.filter(q =>
                quarterList.includes(q.id)
            );

        }
    }, [quarterList, quarters]);


    useEffect(() => {
        dispatch(fetchEmployeeQuarterList({ page: currentPage, limit: PAGE_SIZE }));
        dispatch(fetchQuarterList({ page: '', limit: '' }))
    }, [updateStatus, dispatch, currentPage]);


    const handleUpdate = (id) => {
        const selectedQuarter = quarters.find((q) => q.id === id);
        if (selectedQuarter) {
            setForm({
                quarter_id: selectedQuarter.quarter_id || '',
                date_of_allotment: selectedQuarter.date_of_allotment || '',
                date_of_occupation: selectedQuarter.date_of_occupation || '',
                // date_of_leaving: selectedQuarter.date_of_leaving || '',
                is_occupied: selectedQuarter.is_occupied || '',
                is_current: !!selectedQuarter.is_current,
            });
            setEditId(id);
            setModalOpen(true);
        }
    };

    const paginatedQuarters = quarters.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    );

    const handleCreate = () => {
        setEditId(null);
        setForm({
            quarter_id: '',
            date_of_allotment: '',
            date_of_occupation: '',
            date_of_leaving: null,
            is_occupied: '',
            is_current: false,
        });
        setModalOpen(true);
    };

    const handleModalToggle = () => setModalOpen((prev) => !prev);

    const handleFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleFormSubmit = (values, { resetForm }) => {
        const data = {
            employee_id: id,
            ...values,
            is_current: values.is_current ? 1 : 0,
        };
        if (editId) {
           
            dispatch(updateEmployeeQuarter({ id: editId, data }))
                .unwrap()
                .then(() => {
                    toast.success('Quarter updated successfully!');
                })
                .catch((err) => {
                    const apiMsg =
                        err?.response?.data?.message ||
                        err?.message ||
                        err?.errorMsg ||
                        'Failed to update quarter.';
                    toast.error(apiMsg);
                });
        } else {
            dispatch(createEmployeeQuarter(data))
                .unwrap()
                .then(() => {
                    dispatch(fetchEmployeeQuarterList({ page: currentPage, limit: PAGE_SIZE }));
                    toast.success('Quarter allocated successfully!');
                }).catch((err) => {
                    const apiMsg =
                        err?.response?.data?.message ||
                        err?.message ||
                        err?.message ||
                        'Failed to allocate quarter.';
                    toast.error(apiMsg);
                });
        }
        setModalOpen(false);
        resetForm();
    };

    const getTableConfig = (type) => {
        switch (type) {
            case "quarter":
                return {
                    head: [
                        "Sr. No.",
                        "Quarter No.",
                        "Allotment Date",
                        "Occupation Date",
                        "Leaving Date",
                        "Added By",
                        "Edited By",
                        "Created At",
                        "Updated At"
                    ],
                    renderRow: (record, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{record?.quarter?.quarter_no ?? "-"}</td>
                            <td>{dateFormat(record?.date_of_allotment) ?? "-"}</td>
                            <td>{dateFormat(record?.date_of_occupation) ?? "-"}</td>
                            <td>{dateFormat(record?.date_of_leaving) ?? "-"}</td>
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

    const handleHistoryStatus = (id) => {
        setHistoryRecord([]);
        setShouldOpenHistory(true);
        dispatch(fetchEmployeeQuarterShow(id))
        if (shouldOpenHistory && employeeQuarterShow?.history) {
            const config = getTableConfig("quarter");
            setHistoryRecord(employeeQuarterShow?.history);
            setTableHead(config.head);
            setRenderFunction(() => config.renderRow);
            setIsHistoryModalOpen(true);
            setShouldOpenHistory(false);
        }
    }



    return (
        <>
            <div className='header bg-gradient-info pb-8 pt-8 pt-md-8 main-head'></div>
            <div className="mt--7 mb-7 container-fluid">
                <Card className="shadow border-0">
                    <CardHeader>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h3>Quarter Details</h3>
                            <div>
                                {
                                    name == 'IT Admin' && (
                                        <button
                                            style={{ background: "#004080" }}
                                            className="btn btn-primary"
                                            onClick={handleCreate}>
                                            Allocate
                                        </button>
                                    )
                                }
                                <NavLink to={`/employee-management`}>
                                    <Button
                                        style={{ background: "#004080", color: '#fff' }}
                                        type="button"
                                    >
                                        Back
                                    </Button>
                                </NavLink>
                            </div>
                        </div>
                    </CardHeader>
                    <CardBody>
                        {loading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <CircularProgress />
                            </Box>
                        ) : (
                            <>
                                <div className="table-responsive">
                                    <table className="table table-bordered">
                                        <thead>
                                            <tr>
                                                <th style={{ fontWeight: "bolder" }}>Sr.No.</th>
                                                <th style={{ fontWeight: "bolder" }}>Quarter Number</th>
                                                <th style={{ fontWeight: "bolder" }}>Allotment Date</th>
                                                <th style={{ fontWeight: "bolder" }}>Occupation Date</th>
                                                <th style={{ fontWeight: "bolder" }}>Leaving Date</th>
                                                <th style={{ fontWeight: "bolder" }}>Status</th>
                                                <th style={{ fontWeight: "bolder" }}>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {paginatedQuarters?.map((q, idx) => (
                                                <tr key={idx}>
                                                    <td>{idx + 1}</td>
                                                    <td>{q.quarter?.quarter_no}</td>
                                                    <td>{dateFormat(q.date_of_allotment)}</td>
                                                    <td>{dateFormat(q.date_of_occupation)}</td>
                                                    <td>{dateFormat(q.date_of_leaving)}</td>
                                                    <td>{q.is_current ? 'Active' : 'Inctive'}</td>
                                                    <td>
                                                        {
                                                            ['IT Admin', 'Salary Coordinator - NIOH', 'Salary Coordinator - ROHC'].includes(name) && (
                                                                <button
                                                                    title='Edit'
                                                                    className="btn btn-sm btn-info"
                                                                    onClick={() => handleUpdate(q.id)}
                                                                >
                                                                    <EditIcon />
                                                                </button>
                                                            )
                                                        }
                                                        <button
                                                            title='History'
                                                            className="btn btn-sm btn-warning"
                                                            onClick={() => handleHistoryStatus(q.id)}
                                                        >
                                                            <HistoryIcon />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {paginatedQuarters.length === 0 && (
                                                <tr>
                                                    <td colSpan="7" className="text-center">
                                                        No quarters found.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="d-flex justify-content-between align-items-center mt-4">
                                    <button
                                        className="btn btn-primary border border-secondary"
                                        disabled={currentPage === 1}
                                        onClick={() => setCurrentPage((p) => p - 1)}
                                    >
                                        Previous
                                    </button>
                                    <span>
                                        Page {currentPage} of {totalPages}
                                    </span>
                                    <button
                                        className="btn btn-primary border border-secondary"
                                        disabled={currentPage === totalPages || quarters.length === 0}
                                        onClick={() => setCurrentPage((p) => p + 1)}
                                    >
                                        Next
                                    </button>
                                </div>
                            </>
                        )}
                    </CardBody>
                </Card>
            </div>

            {/* Modal  */}
            <QuarterAllocateModal
                isOpen={modalOpen}
                toggle={handleModalToggle}
                form={form}
                onSubmit={handleFormSubmit}
                quarterList={filterQuarter}
            />

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

export default EmployeeQuarter;
