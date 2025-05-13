import React, { useEffect, useState } from 'react';
import { CardBody, CardHeader, Card } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { createEmployeeQuarter, fetchEmployeeQuarterList, updateEmployeeQuarter } from '../../redux/slices/quarterSlice'
import QuarterAllocateModal from 'Modal/QuarterAllocateModal';
import { useParams } from 'react-router-dom';
import Preloader from 'include/Preloader';

const PAGE_SIZE = 10;

function EmployeeQuarter() {
    const { id } = useParams();
    const [currentPage, setCurrentPage] = useState(1);
    const quarters = useSelector((state) => state.quarter.employeeQuarterList) || [];
    const totalPages = Math.max(1, Math.ceil(quarters.length / PAGE_SIZE));
    const dispatch = useDispatch();
    const [modalOpen, setModalOpen] = useState(false);
    const [editId, setEditId] = useState(null);
    const [form, setForm] = useState({
        quarter_id: '',
        date_of_allotment: '',
        date_of_occupation: '',
        date_of_leaving: '',
        is_current: false,
    });
    const updateStatus = useSelector((state) => state.quarter.updateStatus);
    const loading = useSelector((state) => state.quarter.loading);

    useEffect(() => {
        // if (updateStatus === 'succeeded') {
        //     dispatch(fetchEmployeeQuarterList({ page: currentPage, limit: PAGE_SIZE }));
        // }
        dispatch(fetchEmployeeQuarterList({ page: currentPage, limit: PAGE_SIZE }));
    }, [updateStatus, dispatch, currentPage,]);


    const handleUpdate = (id) => {
        const selectedQuarter = quarters.find((q) => q.id === id);
        if (selectedQuarter) {
            setForm({
                quarter_id: selectedQuarter.quarter_id || '',
                date_of_allotment: selectedQuarter.date_of_allotment || '',
                date_of_occupation: selectedQuarter.date_of_occupation || '',
                date_of_leaving: selectedQuarter.date_of_leaving || '',
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
            date_of_leaving: '',
            is_current: false,
        });
        setModalOpen(true);
    };

    const handleModalToggle = () => setModalOpen((prev) => !prev);

    const handleFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    // const handleFormSubmit = (e) => {
    //     e.preventDefault();
    //     const data = {
    //         employee_id: id,
    //         ...form,
    //         is_current: form.is_current ? 1 : 0,
    //     };
    //     if (editId) {
    //         dispatch(updateEmployeeQuarter({ id: editId, data }));
    //     } else {
    //         dispatch(createEmployeeQuarter(data));
    //     }
    //     setModalOpen(false);
    //     setForm({
    //         quarter_id: '',
    //         date_of_allotment: '',
    //         date_of_occupation: '',
    //         date_of_leaving: '',
    //         is_current: false,
    //     });
    // };


const handleFormSubmit = (values, { resetForm }) => {
    const data = {
        employee_id: id,
        ...values,
        is_current: values.is_current ? 1 : 0,
    };
    if (editId) {
        dispatch(updateEmployeeQuarter({ id: editId, data }));
    } else {
        dispatch(createEmployeeQuarter(data));
    }
    setModalOpen(false);
    resetForm();
};

    return (
        <>
            <div className='header bg-gradient-info pb-8 pt-8 pt-md-8 main-head'></div>
            <div className="mt--7 mb-7 container-fluid">
                <Card className="shadow border-0">
                    <CardHeader>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h3>Quarter Details</h3>
                            <button
                                style={{ background: "#004080" }}
                                className="btn btn-primary"
                                onClick={handleCreate}>
                                Allocate
                            </button>
                        </div>
                    </CardHeader>
                    <CardBody>
                         <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th>Quarter Number</th>
                                            <th>Allotment Date</th>
                                            <th>Occupatinon Date</th>
                                            <th>Leaving Date</th>
                                            <th>Status</th>
                                            <th>Allocated To</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paginatedQuarters?.map((q, idx) => (
                                            <tr key={idx}>
                                                <td>{q.quarter_id}</td>
                                                <td>{q.date_of_allotment}</td>
                                                <td>{q.date_of_occupation}</td>
                                                <td>{q.date_of_leaving}</td>
                                                <td>{q.is_current ? 'Active' : 'Inctive'}</td>
                                                <td>{q.addby?.name}</td>
                                                <td>
                                                    <button
                                                        className="btn btn-sm btn-info"
                                                        onClick={() => handleUpdate(q.id)}
                                                    >
                                                        Update
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {paginatedQuarters.length === 0 && (
                                            <tr>
                                                <td colSpan="5" className="text-center">
                                                    No quarters found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                                <div className="d-flex justify-content-between align-items-center mt-4">
                                    <button
                                        className="btn btn-light border border-secondary"
                                        //  style={{background:"#004080"}}
                                        disabled={currentPage === 1}
                                        onClick={() => setCurrentPage((p) => p - 1)}
                                    >
                                        Previous
                                    </button>
                                    <span>
                                        Page {currentPage} of {totalPages}
                                    </span>
                                    <button
                                        className="btn btn-light border border-secondary"
                                        disabled={currentPage === totalPages || quarters.length === 0}
                                        onClick={() => setCurrentPage((p) => p + 1)}
                                    >
                                        Next
                                    </button>
                                </div>
                    </CardBody>
                </Card>
            </div>

            {/* Modal  */}
            <QuarterAllocateModal
                isOpen={modalOpen}
                toggle={handleModalToggle}
                form={form}
                // onChange={handleFormChange}
                onSubmit={handleFormSubmit}
            />
        </>
    );
}

export default EmployeeQuarter;