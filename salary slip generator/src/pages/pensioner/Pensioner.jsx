import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { CardBody } from 'reactstrap';

const PensionerManagement = () => {
  const [pensioners, setPensioners] = useState([
    { name: 'Ravi Kumar', ppo: 'PPO123456', bank: 'SBI', account: '1234567890', lifeCert: 'Valid' },
    { name: 'Kanchan', ppo: '7686', bank: '', account: '', lifeCert: 'Expired' },
  ]);
  const [formData, setFormData] = useState({ name: '', ppo: '', lifeCert: 'Valid', file: null });
  const [selectedIndexes, setSelectedIndexes] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({ ...prev, [name]: files ? files[0] : value }));
  };

  const handleAddOrUpdate = () => {
    if (!formData.name || !formData.ppo) return;
    const newEntry = { name: formData.name, ppo: formData.ppo, bank: '', account: '', lifeCert: formData.lifeCert };
    if (editIndex !== null) {
      const updated = [...pensioners];
      updated[editIndex] = newEntry;
      setPensioners(updated);
      setEditIndex(null);
    } else {
      setPensioners([...pensioners, newEntry]);
    }
    setFormData({ name: '', ppo: '', lifeCert: 'Valid', file: null });
  };

  const handleEdit = (index) => {
    setFormData(pensioners[index]);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    const updated = pensioners.filter((_, i) => i !== index);
    setPensioners(updated);
    setSelectedIndexes((prev) => prev.filter((i) => i !== index));
  };

  const handleCheckboxChange = (index) => {
    setSelectedIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIndexes(filteredData.map((_, i) => i));
    } else {
      setSelectedIndexes([]);
    }
  };

  const handleDeleteSelected = () => {
    const filtered = pensioners.filter((_, i) => !selectedIndexes.includes(i));
    setPensioners(filtered);
    setSelectedIndexes([]);
  };

  const filteredData = pensioners.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.ppo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <>
      <div className='header bg-gradient-info pb-8 pt-8 pt-md-8 main-head'></div>

      <div className='container mt--7 bg-white card'>
        <h2 className="mb-3 mt-4 p-4">Pensioner Management</h2>
        <div className="p-4 mb-4">
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} />
          </div>
          <div className="mb-3">
            <label className="form-label">PPO Number</label>
            <input type="text" className="form-control" name="ppo" value={formData.ppo} onChange={handleChange} />
          </div>
          <div className="mb-3 d-flex" style={{ gap: '10px' }}>
            <label className="form-label">Life Certificate Status</label>
            <select className="form-select" name="lifeCert" value={formData.lifeCert} onChange={handleChange}>
              <option value="Valid">Valid</option>
              <option value="Expired">Expired</option>
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">Upload Documents</label>
            <input type="file" className="form-control" name="file" onChange={handleChange} />
          </div>
          <button className="btn btn-primary" onClick={handleAddOrUpdate}>
            {editIndex !== null ? 'Update' : 'Add'}
          </button>
        </div>
      </div>

      <CardBody>
        <div className="container mt-4">
          <div className="card border-0 shadow-lg rounded-4">
            <div className="card-header bg-white py-4 px-4 d-flex justify-content-between align-items-center">
              <h4 className="mb-0 fw-bold text-primary">🧓 Pensioner Records</h4>
              <div className="d-flex gap-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by Name or PPO"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
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
                          checked={selectedIndexes.length === paginatedData.length && paginatedData.length > 0}
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
                    {paginatedData.map((p, index) => {
                      const realIndex = (currentPage - 1) * pageSize + index;
                      return (
                        <tr key={realIndex}>
                          <td>
                            <input
                              type="checkbox"
                              checked={selectedIndexes.includes(realIndex)}
                              onChange={() => handleCheckboxChange(realIndex)}
                            />
                          </td>
                          <td>{p.name}</td>
                          <td>{p.ppo}</td>
                          <td>{p.bank || <i className="text-muted">N/A</i>}</td>
                          <td>{p.account || <i className="text-muted">N/A</i>}</td>
                          <td>
                            <span
                              className={`badge px-3 py-2 fs-6 rounded-pill ${p.lifeCert === 'Valid'
                                ? 'bg-success-subtle text-success'
                                : 'bg-danger-subtle text-danger'
                                }`}
                            >
                              {p.lifeCert}
                            </span>
                          </td>
                          <td>
                            <div className="d-flex justify-content-center gap-2">
                              <button
                                className="btn btn-outline-primary btn-sm rounded-pill px-3"
                                onClick={() => handleEdit(realIndex)}
                              >
                                <i className="bi bi-pencil-square me-1"></i>Edit
                              </button>
                              <button
                                className="btn btn-outline-danger btn-sm rounded-pill px-3"
                                onClick={() => handleDelete(realIndex)}
                              >
                                <i className="bi bi-trash3 me-1"></i>Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="d-flex justify-content-center gap-2 p-3">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    className={`btn btn-sm ${i + 1 === currentPage ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardBody>
    </>
  );
};

export default PensionerManagement;
