import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { addBankdetails, addDesignation, addEmploeeStatus, fetchEmployeeById, updateDesignation, updateEmployeeBankdetail, updateEmployeeStatus } from '../../redux/slices/employeeSlice';
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Container,
  Row,
  Col,
  Table,
} from "reactstrap";
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import StatusModal from 'Modal/statusModal';
import BankModal from 'Modal/EmployeeBank';
import DesignationModal from 'Modal/DesignationModal';
import Preloader from 'include/Preloader';


function EmployeeDetail() {
  const { id } = useParams();
  const data = useSelector((state) => state.employee.EmployeeDetail) || null;
  const dispatch = useDispatch();


  // Add state for managing status modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('create');
  const [selectedStatus, setSelectedStatus] = useState({
    status: '',
    effective_from: '',
    effective_till: '',
    remarks: '',
    order_reference: '',
  });

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const handleCreateStatus = () => {
    setModalType('create');
    setSelectedStatus(null);
    toggleModal();
  };

  const handleUpdateStatus = () => {
    setModalType('update');
    console.log('status', selectedStatus)
    setSelectedStatus(selectedStatus);
    toggleModal();
  };

  const handleSave = () => {
    if (modalType === 'create') {
      const statusDataWithId = { ...selectedStatus, employee_id: id };
      dispatch(addEmploeeStatus(statusDataWithId));
    } else if (modalType === 'update') {
      console.log('status', selectedStatus)
      dispatch(updateEmployeeStatus({ employeeId: id, statusData: selectedStatus }));
    }
    toggleModal();
  };


  // Add state for managing bank details modal
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);
  const [bankModalType, setBankModalType] = useState('create');
  const [selectedBank, setSelectedBank] = useState({
    bank_name: '',
    branch_name: '',
    account_number: '',
    ifsc_code: '',
    is_active: false,
    effective_from: '',
  });

  const toggleBankModal = () => setIsBankModalOpen(!isBankModalOpen);

  const handleCreateBank = () => {
    setBankModalType('create');
    setSelectedBank({
      bank_name: '',
      branch_name: '',
      account_number: '',
      ifsc_code: '',
      is_active: false,
      effective_from: '',
    });
    toggleBankModal();
  };

  const handleUpdateBank = (bank) => {
    setBankModalType('update');
    setSelectedBank(bank);
    toggleBankModal();
  };

  const handleSaveBank = () => {
    if (bankModalType === 'create') {
      const newBankData = { ...selectedBank, is_active: selectedBank.is_active ? 1 : 0, employee_id: id };
      // console.log('Creating bank details:', newBankData);
      dispatch(addBankdetails(newBankData));
    } else if (bankModalType === 'update') {
      // const updatedBankData = { ...selectedBank, employee_id: id };
      console.log('Updating bank details:', selectedBank);

      dispatch(updateEmployeeBankdetail({ bankData: selectedBank, employeeId: id }));
    }
    toggleBankModal();
  };


  // Add state for managing designation modal
  const [isDesignationModalOpen, setIsDesignationModalOpen] = useState(false);
  const [designationModalType, setDesignationModalType] = useState('create');
  const [selectedDesignation, setSelectedDesignation] = useState({
    designation: '',
    cadre: '',
    job_group: '',
    effective_from: '',
    effective_till: '',
    promotion_order_no: ''
  });

  // Toggle designation modal
  const toggleDesignationModal = () => setIsDesignationModalOpen(!isDesignationModalOpen);

  // Handle creating a new designation
  const handleCreateDesignation = () => {
    setDesignationModalType('create');
    setSelectedDesignation({
      designation: '',
      cadre: '',
      job_group: '',
      effective_from: '',
      effective_till: '',
      promotion_order_no: ''
    });
    toggleDesignationModal();
  };

  // Handle editing an existing designation
  const handleUpdateDesignation = (designation) => {
    setDesignationModalType('update');
    setSelectedDesignation(designation);
    toggleDesignationModal();
  };

  // Handle saving the designation
  const handleSaveDesignation = () => {
    if (designationModalType === 'create') {
      const newDesignationData = { ...selectedDesignation, employee_id: id };
      dispatch(addDesignation(newDesignationData));
    } else if (designationModalType === 'update') {
      dispatch(updateDesignation({ designationData: selectedDesignation, employeeId: id }));
    }
    toggleDesignationModal();
  };


  useEffect(() => {
    dispatch(fetchEmployeeById(id));
  }, []);

  if (!data) {
    return <Preloader/>
  }

  return (
    <>
      <div className='header bg-gradient-info pb-8 pt-8 pt-md-8 main-head'></div>

      <Container className="mt--7 mb-7" fluid>
        <Row>
          {/* Employee Profile Section */}
          <Col xl="4">
            <Card className="card-profile custom-scrollbar">
              <CardBody
                className="p-0 {data.gender}"
                style={{
                  maxHeight: '400px',
                  overflowY: 'auto',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '10px',
                }}
              >
                <div className="text-center p-4 bg-white shadow-md rounded-xl max-w-xl mx-auto">
                  <h3 className="text-2xl font-bold mb-3">
                    {data.first_name} {data.last_name}
                    {/* <span className="text-sm text-gray-500 font-normal">, {data.gender}</span> */}
                    <p className="text-md text-gray-500 font-normal">{data.gender}</p>
                  </h3>

                  <div className="text-gray-700 text-sm mb-2">
                    <i className="ni location_pin mr-1" />
                    <strong>Email:</strong> {data.email}
                  </div>

                  <div className="text-gray-700 text-sm mb-2">
                    <i className="ni business_briefcase-24 mr-1" />
                    <strong>Pension Scheme:</strong> {data.pension_scheme}
                  </div>

                  <div className="text-gray-700 text-sm mb-4">
                    <i className="ni education_hat mr-1" />
                    <strong>PAN:</strong> {data.pancard}
                  </div>

                  <hr className="my-4 border-gray-300" />

                  <div className="text-left text-sm text-gray-700 leading-relaxed space-y-1">
                    <p><strong>Date of Birth:</strong> {data.date_of_birth}</p>
                    <p><strong>Date of Joining:</strong> {data.date_of_joining}</p>
                    <p><strong>Retirement Date:</strong> {data.date_of_retirement || 'N/A'}</p>
                    <p><strong>PWD Status:</strong> {data.pwd_status ? 'Yes' : 'No'}</p>
                    <p><strong>Pension Number:</strong> {data.pension_number || 'N/A'}</p>
                    <p><strong>GIS Eligibility:</strong> {data.gis_eligibility ? 'Yes' : 'No'}</p>
                    <p><strong>GIS Number:</strong> {data.gis_no || 'N/A'}</p>
                    <p><strong>Credit Society Member:</strong> {data.credit_society_member ? 'Yes' : 'No'}</p>
                    <p><strong>Increment Month:</strong> {data.increment_month || 'N/A'}</p>
                    <p><strong>Uniform Allowance Eligibility:</strong> {data.uniform_allowance_eligibility ? 'Yes' : 'No'}</p>
                    <p><strong>HRA Eligibility:</strong> {data.hra_eligibility ? 'Yes' : 'No'}</p>
                    <p><strong>NPA Eligibility:</strong> {data.npa_eligibility ? 'Yes' : 'No'}</p>
                    <p><strong>Added By:</strong> {data?.addby?.name || 'N/A'}</p>
                    <p><strong>Edited By:</strong> {data?.editby?.name || 'N/A'}</p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>

          {/* Employee Details Section */}
          <Col xl="8">
            <Card className="shadow">
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col xs="8">
                    <h3 className="mb-0">Employee Details</h3>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody className='custom-scrollbar'
                style={{
                  height: '500px', // Set a fixed height
                  overflowY: 'auto', // Enable vertical scrolling
                  backgroundColor: '#f8f9fa',
                  borderRadius: '10px',
                }}
              >
                <h6 className="heading-small text-muted mb-4">History Data</h6>

                {/* Employee Status */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="heading-small text-muted mb-0">Status</h6>
                  <div
                    className="d-flex justify-content-center align-items-center rounded-circle"
                    style={{
                      width: '40px',
                      height: '40px',
                      cursor: 'pointer',
                      backgroundColor: '#004080',
                    }}
                    onClick={handleCreateStatus}
                  >
                    <AddIcon style={{ color: 'white' }} fontSize="small" />
                  </div>
                </div>
                <Table className="align-items-center table-flush custom-table" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th>Status</th>
                      <th>Effective From</th>
                      <th>Effective Till</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(data?.employee_status) && data.employee_status.map((status) => (
                      <tr key={status.id}>
                        <td>{status.status}</td>
                        <td>{status.effective_from}</td>
                        <td>{status.effective_till || "Present"}</td>
                        <td>
                          <EditIcon fontSize="small" onClick={() => handleUpdateStatus(status.employee_id)} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>

                {/* Employee Bank Details */}
                <div className="d-flex justify-content-between align-items-center mb-3 mt-5">
                  <h6 className="heading-small text-muted mb-0">Bank Details</h6>
                  <div
                    className="d-flex justify-content-center align-items-center rounded-circle"
                    style={{
                      width: '40px',
                      height: '40px',
                      cursor: 'pointer',
                      backgroundColor: '#004080',
                    }}
                    onClick={handleCreateBank}
                  >
                    <AddIcon style={{ color: 'white' }} fontSize="small" />
                  </div>
                </div>
                <Table className="align-items-center table-flush custom-table" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th>Bank Name</th>
                      <th>Branch Name</th>
                      <th>Account Number</th>
                      <th>IFSC Code</th>
                      <th>status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.employee_bank.map((bank) => (
                      <tr key={bank.id}>
                        <td>{bank.bank_name}</td>
                        <td>{bank.branch_name}</td>
                        <td>{bank.account_number}</td>
                        <td>{bank.ifsc_code}</td>
                        <td>{bank.is_active ? 'Active' : 'Not Active'}</td>
                        <td>
                          <EditIcon fontSize="small" onClick={() => handleUpdateBank(bank)} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>

                {/* Employee Designation */}
                <div className="d-flex justify-content-between align-items-center mb-3 mt-5">
                  <h6 className="heading-small text-muted mb-0">Designation</h6>
                  <div
                    className="d-flex justify-content-center align-items-center rounded-circle"
                    style={{
                      width: '40px',
                      height: '40px',
                      cursor: 'pointer',
                      backgroundColor: '#004080',
                    }}
                    onClick={handleCreateDesignation}
                  >
                    <AddIcon style={{ color: 'white' }} fontSize="small" />
                  </div>
                </div>
                <Table className="align-items-center table-flush custom-table" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th>Designation</th>
                      <th>Cadre</th>
                      <th>Job Group</th>
                      <th>Effective From</th>
                      <th>Effective Till</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.employee_designation.map((designation) => (
                      <tr key={designation.id}>
                        <td>{designation.designation}</td>
                        <td>{designation.cadre}</td>
                        <td>{designation.job_group}</td>
                        <td>{designation.effective_from}</td>
                        <td>{designation.effective_till || "Present"}</td>
                        <td>
                          <EditIcon fontSize="small" onClick={() => handleUpdateDesignation(designation)} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>


      {/* Modal for Create/Update Status */}
      <StatusModal
        isOpen={isModalOpen}
        toggle={toggleModal}
        modalType={modalType}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        handleSave={handleSave}
      />

      <BankModal
        isOpen={isBankModalOpen}
        toggle={toggleBankModal}
        modalType={bankModalType}
        selectedBank={selectedBank}
        setSelectedBank={setSelectedBank}
        handleSave={handleSaveBank}
      />

      {/* // Add Designation Modal */}
      <DesignationModal
        isOpen={isDesignationModalOpen}
        toggle={toggleDesignationModal}
        modalType={designationModalType}
        selectedDesignation={selectedDesignation}
        setSelectedDesignation={setSelectedDesignation}
        handleSave={handleSaveDesignation}
      />
    </>
  );
}

export default EmployeeDetail;