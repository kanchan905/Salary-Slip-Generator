import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { CardBody } from 'reactstrap';

const PensionerManagement = () => {
    const [pensioners, setPensioners] = useState([
        {
            name: 'Ravi Kumar',
            ppo: 'PPO123456',
            bank: 'SBI',
            account: '1234567890',
            lifeCert: 'Valid',
        },
        {
            name: 'Kanchan',
            ppo: '7686',
            bank: '',
            account: '',
            lifeCert: 'Expired',
        },
    ]);

    const [formData, setFormData] = useState({
        name: '',
        ppo: '',
        lifeCert: 'Valid',
        file: null,
    });

    const [selectedIndexes, setSelectedIndexes] = useState([]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: files ? files[0] : value,
        }));
    };

    const handleAdd = () => {
        if (!formData.name || !formData.ppo) return;

        const newEntry = {
            name: formData.name,
            ppo: formData.ppo,
            bank: '',
            account: '',
            lifeCert: formData.lifeCert,
        };

        setPensioners([...pensioners, newEntry]);
        setFormData({ name: '', ppo: '', lifeCert: 'Valid', file: null });
    };

    const handleCheckboxChange = (index) => {
        setSelectedIndexes((prev) =>
            prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
        );
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedIndexes(pensioners.map((_, i) => i));
        } else {
            setSelectedIndexes([]);
        }
    };

    const handleDeleteSelected = () => {
        const filtered = pensioners.filter((_, i) => !selectedIndexes.includes(i));
        setPensioners(filtered);
        setSelectedIndexes([]);
    };

    return (
        <>
            <div className='header bg-gradient-info pb-8 pt-8 pt-md-8'></div>

            <div className='container mt--7 bg-white card'>
                <h2 className="mb-3 mt-4 p-4">Pensioner Management</h2>

                <div className="p-4 mb-4">
                    <div className="mb-3">
                        <label className="form-label">Name</label>
                        <input
                            type="text"
                            className="form-control"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">PPO Number</label>
                        <input
                            type="text"
                            className="form-control"
                            name="ppo"
                            value={formData.ppo}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="mb-3 d-flex" style={{ gap: '10px' }}>
                        <label className="form-label">Life Certificate Status</label>
                        <select
                            className="form-select"
                            name="lifeCert"
                            value={formData.lifeCert}
                            onChange={handleChange}
                        >
                            <option value="Valid">Valid</option>
                            <option value="Expired">Expired</option>
                        </select>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Upload Documents</label>
                        <input type="file" className="form-control" name="file" onChange={handleChange} />
                    </div>

                    <button className="btn btn-primary" onClick={handleAdd}>
                        Add
                    </button>
                </div>
            </div>

            <CardBody>
                <div className="container mt-4">
                    <div className="card border-0 shadow-lg rounded-4">
                        <div className="card-header bg-white py-4 px-4 d-flex justify-content-between align-items-center">
                            <h4 className="mb-0 fw-bold text-primary">🧓 Pensioner Records</h4>
                            <button
                                className="btn btn-outline-danger btn-sm"
                                onClick={handleDeleteSelected}
                                disabled={selectedIndexes.length === 0}
                            >
                                <i className="bi bi-trash-fill me-1"></i>
                                Delete Selected ({selectedIndexes.length})
                            </button>
                        </div>

                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="table table-hover mb-0 align-middle text-center">
                                    <thead className="table-light">
                                        <tr className="text-uppercase small text-muted">
                                            <th>
                                                <input
                                                    type="checkbox"
                                                    onChange={handleSelectAll}
                                                    checked={
                                                        selectedIndexes.length === pensioners.length &&
                                                        pensioners.length > 0
                                                    }
                                                />
                                            </th>
                                            <th>Name</th>
                                            <th>PPO No.</th>
                                            <th>Bank</th>
                                            <th>Account</th>
                                            <th>Life Cert</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pensioners.map((p, index) => (
                                            <tr key={index} className="border-top">
                                                <td>
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedIndexes.includes(index)}
                                                        onChange={() => handleCheckboxChange(index)}
                                                    />
                                                </td>
                                                <td className="fw-medium text-dark">{p.name}</td>
                                                <td>{p.ppo}</td>
                                                <td>{p.bank || <span className="text-muted fst-italic">N/A</span>}</td>
                                                <td>{p.account || <span className="text-muted fst-italic">N/A</span>}</td>
                                                <td>
                                                    <span
                                                        className={`badge rounded-pill px-3 py-2 fs-6 ${p.lifeCert === 'Valid'
                                                            ? 'bg-success-subtle text-success'
                                                            : 'bg-danger-subtle text-danger'
                                                            }`}
                                                    >
                                                        {p.lifeCert}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="d-flex justify-content-center gap-2">
                                                        <button className="btn btn-outline-primary btn-sm rounded-pill px-3">
                                                            <i className="bi bi-pencil-square me-1"></i>Edit
                                                        </button>
                                                        <button className="btn btn-outline-danger btn-sm rounded-pill px-3">
                                                            <i className="bi bi-trash3 me-1"></i>Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </CardBody>
        </>
    );
};

export default PensionerManagement;
