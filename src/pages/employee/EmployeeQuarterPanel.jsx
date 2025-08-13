import React, { useEffect, useState } from 'react';
import { Button, Table, FormGroup } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { createEmployeeQuarter, fetchEmployeeQuarterList, fetchEmployeeQuarterShow, fetchQuarterList, updateEmployeeQuarter } from '../../redux/slices/quarterSlice'
import QuarterAllocateModal from 'Modal/QuarterAllocateModal';
import { NavLink, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import EditIcon from '@mui/icons-material/Edit';
import HistoryIcon from '@mui/icons-material/History';
import HistoryModal from 'Modal/HistoryModal';
import { dateFormat } from 'utils/helpers';
import { fetchEmployeeById } from '../../redux/slices/employeeSlice';

const PAGE_SIZE = 10;

function EmployeeQuarterPanel({ empQuarter, isHraEligible }) {
    const { id } = useParams();
    const [currentPage, setCurrentPage] = useState(1);
    // const quarters = useSelector((state) => state.quarter.employeeQuarterList) || [];
    const employeeQuarterShow = useSelector((state) => state.quarter.employeeQuarterShow);
    const totalPages = Math.max(1, Math.ceil(employeeQuarterShow?.length / PAGE_SIZE));
    const dispatch = useDispatch();
    const [modalOpen, setModalOpen] = useState(false);
    const [editId, setEditId] = useState(null);
    const [quarterData, setQuarterData] = useState({});
    const [firstRow, setFirstRow] = useState(null);
    const [form, setForm] = useState({
        employee_id: '',
        quarter_id: '',
        date_of_allotment: '',
        date_of_occupation: '',
        date_of_leaving: '',
        is_occupied: '',
        is_current: '',
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

    const updateStatus = useSelector((state) => state.quarter.updateStatus);
    const loading = useSelector((state) => state.quarter.loading);
    const error = useSelector((state) => state.quarter.error);
    const currentRoles = useSelector((state) =>
            state.auth.user?.roles?.map(role => role.name) || []
        );
    const quarters = useSelector((state) => state.quarter.employeeQuarterList) || [];
    const { quarterList } = useSelector((state) => state.quarter);
    let filterQuarter = quarterList.filter(q =>
        quarters.every(ql => q.id !== ql.quarter_id && !q.is_occupied)
    );




    useEffect(() => {
        dispatch(fetchEmployeeQuarterList({ page: currentPage, limit: PAGE_SIZE }));
        dispatch(fetchQuarterList({ page: '1', limit: '1000' }))
    }, [updateStatus, dispatch, currentPage, empQuarter]);



    const handleUpdate = (quarter_id) => {
        const selectedQuarter = empQuarter.find((q) => q.id === quarter_id);

        if (selectedQuarter) {
            setForm({
                employee_id: id,
                quarter_id: selectedQuarter.quarter_id || selectedQuarter.quarter?.id || '',
                date_of_allotment: selectedQuarter.date_of_allotment || '',
                date_of_occupation: selectedQuarter.date_of_occupation || '',
                date_of_leaving: selectedQuarter.date_of_leaving || '',
                is_occupied: !!selectedQuarter.is_occupied,
                is_current: !!selectedQuarter.is_current,
            });
            setEditId(quarter_id); // ✅ use quarter_id, not employee id
            setModalOpen(true);
        }
    };


    // const paginatedQuarters = employeeQuarterShow?.slice(
    //     (currentPage - 1) * PAGE_SIZE,
    //     currentPage * PAGE_SIZE
    // );

    const handleCreate = () => {
        setEditId(null);
        setForm({
            employee_id: id,
            quarter_id: '',
            date_of_allotment: '',
            date_of_occupation: '',
            date_of_leaving: '',
            is_occupied: false,
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
            is_occupied: values.is_occupied ? 1 : 0,
            is_current: values.is_current ? 1 : 0,
        };
        if (editId) {
            dispatch(updateEmployeeQuarter({ id: editId, data }))
                .unwrap()
                .then((res) => {
                    if (res?.errorMsg) {
                        toast.error(res.errorMsg);
                    } else {
                        toast.success(res.successMsg || 'Quarter updated successfully!');
                        setModalOpen(false);
                        resetForm();
                        dispatch(fetchEmployeeById(id));
                    }
                })
                .catch((err) => {
                    console.log(err)
                    const apiMsg =
                        err?.response?.data?.message ||
                        err?.message ||
                        err?.errorMsg ||
                        'Failed to update quarter.';
                    toast.error(err);
                });
        } else {
            dispatch(createEmployeeQuarter(data))
                .unwrap()
                .then((res) => {
                    if (res?.errorMsg) {
                        toast.error(res.errorMsg);
                    } else {
                        dispatch(fetchEmployeeQuarterList({ page: currentPage, limit: PAGE_SIZE }));
                        toast.success(res.successMsg || 'Quarter allocated successfully!');
                        setModalOpen(false);
                        resetForm();
                        dispatch(fetchEmployeeById(id));
                    }
                }).catch((err) => {
                    const apiMsg =
                        err?.response?.data?.message ||
                        err?.message ||
                        err?.message ||
                        'Failed to allocate quarter.';
                    toast.error(err);
                });
        }
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
                        "Status",
                        "Added By",
                        "Edited By",
                        "Created At",
                        "Updated At"
                    ],
                    firstRow: 
                        <tr className='bg-green text-white'>
                            <td>{1}</td>
                            <td>{quarterData?.quarter?.quarter_no || "-"}</td>
                            <td>{dateFormat(quarterData?.date_of_allotment) || "-"}</td>
                            <td>{dateFormat(quarterData?.date_of_occupation) || "-"}</td>
                            <td>{dateFormat(quarterData?.date_of_leaving) || "-"}</td>
                            <td>{quarterData?.is_occupied ? "Occupied" : "Vacant"}</td>
                            <td>{quarterData?.added_by
                                ? `${quarterData.added_by.name || '-'}${quarterData.added_by.roles && quarterData.added_by.roles.length > 0 ? ' (' + quarterData.added_by.roles.map(role => role.name).join(', ') + ')' : ''}`
                                : 'NA'}</td>
                            <td>{quarterData?.edited_by
                                ? `${quarterData.edited_by.name || '-'}${quarterData.edited_by.roles && quarterData.edited_by.roles.length > 0 ? ' (' + quarterData.edited_by.roles.map(role => role.name).join(', ') + ')' : ''}`
                                : 'NA'}</td>
                            <td>{quarterData?.created_at ? new Date(quarterData.created_at).toLocaleString() : '-'}</td>
                            <td>{quarterData?.updated_at ? new Date(quarterData.updated_at).toLocaleString() : '-'}</td>
                        </tr>
                    ,
                    renderRow: (record, index) => (
                        <tr key={index}>
                            <td>{index + 2}</td>
                            <td>{record?.quarter?.quarter_no || "-"}</td>
                            <td>{dateFormat(record?.date_of_allotment) || "-"}</td>
                            <td>{dateFormat(record?.date_of_occupation) || "-"}</td>
                            <td>{dateFormat(record?.date_of_leaving) || "-"}</td>
                            <td>{record?.is_occupied ? "Occupied" : "Vacant"}</td>
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
        dispatch(fetchEmployeeQuarterShow(id))
        .unwrap()
        .then((payload) => {
            const config = getTableConfig("quarter");
            setHistoryRecord(payload?.history || []);
            setTableHead(config.head);
            setRenderFunction(() => config.renderRow);
            setFirstRow(config.firstRow);
            setQuarterData(payload);
            setIsHistoryModalOpen(true);
        }).catch((err) => {
            toast.error("Could not load quarter history data.");
        })
    }

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h5>Quarter Allocation</h5>
                    {
                       !isHraEligible && currentRoles.some(role => ['IT Admin', "Salary Processing Coordinator (NIOH)", "Salary Processing Coordinator (ROHC)"].includes(role)) && (
                        <Button color="primary" size="sm" onClick={handleCreate}>
                            Allocate
                        </Button>
                    )
                }
                
            </div>
            <div className="table-responsive">
                <Table striped bordered hover responsive>
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
                        {empQuarter?.length !== 0 ? empQuarter?.map((q, idx) => (
                            <tr key={idx}>
                                <td>{idx + 1}</td>
                                <td>{q.quarter?.quarter_no || "-"}</td>
                                <td>{dateFormat(q.date_of_allotment)}</td>
                                <td>{dateFormat(q.date_of_occupation)}</td>
                                <td>{dateFormat(q.date_of_leaving)}</td>
                                <td>{q.is_occupied ? 'Occupied' : 'Vacant'}</td>
                                <td>{
                                   currentRoles.some(role => ['IT Admin', "Salary Processing Coordinator (NIOH)","Salary Processing Coordinator (ROHC)"].includes(role)) && (
                                        <Button color="link" size="sm" onClick={() => handleUpdate(q.id)}>
                                            <EditIcon fontSize="small" />
                                        </Button>
                                    )}
                                    <Button color="link" size="sm" onClick={() => handleHistoryStatus(q.id)}>
                                        <HistoryIcon fontSize='small' />
                                    </Button>
                                </td>
                            </tr>
                        )) :
                            (
                                <tr>
                                    <td align='center' colSpan={7}>No quarter found</td>
                                </tr>
                            )
                        }
                    </tbody>
                </Table>
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
                firstRow={firstRow}
            />
        </>
    );
}

export default EmployeeQuarterPanel;
