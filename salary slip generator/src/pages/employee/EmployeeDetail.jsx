import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  addBankdetails,
  addDesignation,
  addEmploeeStatus,
  fetchEmployeeBankdetailStatus,
  fetchEmployeeById,
  fetchEmployeeDesignationStatus,
  fetchEmployeeStatus,
  updateDesignation,
  updateEmployeeBankdetail,
  updateEmployeeStatus
} from '../../redux/slices/employeeSlice';
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Container,
  Row,
  Col,
  Table,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane
} from "reactstrap";
import EditIcon from '@mui/icons-material/Edit';
import HistoryIcon from '@mui/icons-material/History';
import AddIcon from '@mui/icons-material/Add';
import StatusModal from 'Modal/statusModal';
import BankModal from 'Modal/EmployeeBank';
import DesignationModal from 'Modal/DesignationModal';
import { Box, CircularProgress } from '@mui/material';
import HistoryModal from 'Modal/HistoryModal';

function EmployeeDetail() {
  const { id } = useParams();
  const data = useSelector((state) => state.employee.EmployeeDetail) || null;
  const historyStatus = useSelector((state) => state.employee.employeeStatus) || null;
  const historyBank = useSelector((state) => state.employee.bankStatus) || null;
  const historyDesignation = useSelector((state) => state.employee.designationStatus) || null;
  const loading = useSelector((state) => state.employee.loading);
  const dispatch = useDispatch();


  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('create');
  const [selectedStatus, setSelectedStatus] = useState({
    status: '',
    effective_from: '',
    effective_till: '',
    remarks: '',
    order_reference: '',
  }); 

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

  const [isDesignationModalOpen, setIsDesignationModalOpen] = useState(false);
  const [designationModalType, setDesignationModalType] = useState('create');
  const [ renderFunction, setRenderFunction ] = useState(() => null);
  const [selectedDesignation, setSelectedDesignation] = useState({
    designation: '',
    cadre: '',
    job_group: '',
    effective_from: '',
    effective_till: '',
    promotion_order_no: ''
  });
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const toggleHistoryModal = () => setIsHistoryModalOpen(!isHistoryModalOpen);

  // Tab state
  const [activeTab, setActiveTab] = useState('1');
  const toggleTab = tab => { if (activeTab !== tab) setActiveTab(tab); };

  // Status modal handlers
  const toggleModal = () => setIsModalOpen(!isModalOpen);
  const handleCreateStatus = () => {
    setModalType('create');
    setSelectedStatus({
      status: '',
      effective_from: '',
      effective_till: '',
      remarks: '',
      order_reference: '',
    });
    toggleModal();
  };

  const getTableConfig = (type) => {
    switch (type) {
      case "status":
        return {
          head: [
            "Sr. No.",
            "Status",
            "Effective From",
            "Effective Till",
            "Remarks",
            "Added By",
            "Edited By"
          ],
          renderRow: (record, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>
                <span className={`badge ${record.status === 'Active' ? 'bg-success text-white' : 'bg-danger text-white'}`}>{record.status}</span>
              </td>
              <td>{record.effective_from}</td>
              <td>{record.effective_till || "NA"}</td>
              <td>{record.remarks || "NA"}</td>
              <td>{record.added_by?.name}</td>
              <td>{record.edited_by?.name || "NA"}</td>
            </tr>
          ),
        };

      case "bank":
        return {
          head: [
            "Sr. No.",
            "Bank Name",
            "IFSC",
            "Account Number",
            "Effective From",
            "Effective Till",
            "Added By",
            "Edited By",
          ],
          renderRow: (record, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td className='text-capitalize'>{record.bank_name} - {record.branch_name}</td>
              <td>{record.ifsc_code}</td>
              <td>{record.account_number}</td>
              <td>{record.effective_from}</td>
              <td>{record.effective_till || "NA"}</td>
              <td>{record.added_by?.name}</td>
              <td>{record.edited_by?.name || "NA"}</td>
            </tr>
          ),
        };
      case "designation":
        return {
          head: [
            "Sr. No.",
            "Job Group",
            "Cadre",
            "Designation",
            "Effective From",
            "Effective Till",
            "Added By",
            "Edited By",
          ],
          renderRow: (record, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td className='text-capitalize'>{record.job_group}</td>
              <td>{record.cadre}</td>
              <td>{record.designation}</td>
              <td>{record.effective_from}</td>
              <td>{record.effective_till || "NA"}</td>
              <td>{record.added_by?.name || "NA"}</td>
              <td>{record.edited_by?.name || "NA"}</td>
            </tr>
          ),
        };

      // You can add more like designation, pay scale, etc.
      
      default:
        return { head: [], renderRow: () => null };
    }
  };


  const handleUpdateStatus = (status) => {
    setModalType('update');
    setSelectedStatus(status);
    toggleModal();
  };

  // Status History handlers
  const handleHistoryStatus = (employeeID) => {
    console.log("Employee ID: ", employeeID);
    dispatch(fetchEmployeeStatus(employeeID));
  };
  
  useEffect(() => {
    if (historyStatus && historyStatus.history) {
      const config = getTableConfig("status");
      setHistoryRecord(historyStatus?.history || []);
      setTableHead(config.head);
      setRenderFunction(() => config.renderRow); // <- use useState to hold render function
      toggleHistoryModal();
    }
  }, [historyStatus]);

const handleHistoryBank = (employeeID) => {
  console.log("Employee ID for Bank History: ", historyBank);
  dispatch(fetchEmployeeBankdetailStatus(employeeID));
  const config = getTableConfig("bank");
  setHistoryRecord(historyBank?.history || []);
  setTableHead(config.head);
  setRenderFunction(() => config.renderRow);
  toggleHistoryModal();
};

const handleHistoryDesignation = (employeeID) => {
  console.log("Employee ID for Designation History: ", historyDesignation);
  dispatch(fetchEmployeeDesignationStatus(employeeID));
  const config = getTableConfig("designation");
  setHistoryRecord(historyDesignation?.history || []);
  setTableHead(config.head);
  setRenderFunction(() => config.renderRow);
  toggleHistoryModal();
};


  const handleSave = () => {
    if (modalType === 'create') {
      const statusDataWithId = { ...selectedStatus, employee_id: id };
      dispatch(addEmploeeStatus(statusDataWithId));
    } else if (modalType === 'update') {
      dispatch(updateEmployeeStatus({ employeeId: id, statusData: selectedStatus }));
    }
    toggleModal();
  };

  // Bank modal handlers
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
      dispatch(addBankdetails(newBankData));
    } else if (bankModalType === 'update') {
      dispatch(updateEmployeeBankdetail({ bankData: selectedBank, employeeId: id }));
    }
    toggleBankModal();
  };

  // Designation modal handlers
  const toggleDesignationModal = () => setIsDesignationModalOpen(!isDesignationModalOpen);
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
  const handleUpdateDesignation = (designation) => {
    setDesignationModalType('update');
    setSelectedDesignation(designation);
    toggleDesignationModal();
  };
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
  }, [dispatch, id]);


  return (
    <>
      <div className="header bg-gradient-info pb-8 pt-8 main-head"></div>
      <Container className="mt--7 mb-7" fluid>
        <Row className="justify-content-center">
          {loading || !data ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              {/* Profile Card */}
              <Col xl="4" className="mb-4">
                <Card className="shadow-lg border-0 rounded-3">
                  <CardBody className="text-center p-5 custom-scrollbar"
                    style={{
                      maxHeight: '550px',
                      overflowY: 'auto',
                    }}
                  >
                    <div
                      style={{
                        width: 100,
                        height: 100,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #4f8cff 60%, #6a82fb 100%)',
                        margin: '0 auto 1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 40,
                        color: '#fff',
                      }}
                    >
                      {data.first_name?.[0]}{data.last_name?.[0]}
                    </div>
                    <h2 className="font-bold text-2xl mb-1">
                      {data.first_name} {data.last_name}
                    </h2>
                    <span className="badge bg-info text-white mb-2">{data.gender}</span>
                    <div className="text-gray-600 mb-2">{data.email}</div>
                    <div className="flex flex-wrap justify-center mb-3" style={{gap:'3px'}}>
                      <span className="badge bg-light text-dark mr-2">DOB: {data.date_of_birth}</span>
                      <span className="badge bg-light text-dark mr-2">DOJ: {data.date_of_joining}</span>
                      <span className="badge bg-light text-dark">Retirement: {data.date_of_retirement || "N/A"}</span>
                    </div>
                    <hr />
                    <div className="text-left text-sm mt-3 space-y-1">
                      <p><strong>Pension Scheme:</strong> {data.pension_scheme}</p>
                      <p><strong>PAN:</strong> {data.pancard}</p>
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
                  </CardBody>
                </Card>
              </Col>
              {/* Tabbed Details */}
              <Col xl="8">
                <Card className="shadow-lg border-0 rounded-3">
                  <CardHeader className="bg-white border-0 pb-0">
                    <Nav tabs className="border-0">
                      <NavItem>
                        <NavLink
                          className={activeTab === "1" ? "active" : ""}
                          onClick={() => toggleTab("1")}
                          style={{ cursor: 'pointer' }}
                        >
                          Status
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          className={activeTab === "2" ? "active" : ""}
                          onClick={() => toggleTab("2")}
                          style={{ cursor: 'pointer' }}
                        >
                          Bank
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          className={activeTab === "3" ? "active" : ""}
                          onClick={() => toggleTab("3")}
                          style={{ cursor: 'pointer' }}
                        >
                          Designation
                        </NavLink>
                      </NavItem>
                    </Nav>
                  </CardHeader>
                  <CardBody className="p-4" style={{ backgroundColor: '#f8f9fa', borderRadius: '10px', minHeight: 500 }}>
                    <TabContent activeTab={activeTab}>
                      {/* Status Tab */}
                      <TabPane tabId="1">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <h5>Status History</h5>
                          <Button color="primary" size="sm" onClick={handleCreateStatus}>
                            <AddIcon fontSize="small" /> Add
                          </Button>
                        </div>
                        <Table striped bordered hover responsive>
                          <thead>
                            <tr>
                              <th>Status</th>
                              <th>From</th>
                              <th>Till</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Array.isArray(data?.employee_status) && data.employee_status.map(status => (
                              <tr key={status.id}>
                                <td>{status.status}</td>
                                <td>{status.effective_from}</td>
                                <td>{status.effective_till || "Present"}</td>
                                <td>
                                  <Button color="link" size="sm" onClick={() => handleUpdateStatus(status)}>
                                    <EditIcon fontSize="small" />
                                  </Button>
                                  <Button color="link" size="sm" onClick={() => handleHistoryStatus(status?.employee_id)}>
                                    <HistoryIcon fontSize="small" />
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </TabPane>
                      {/* Bank Tab */}
                      <TabPane tabId="2">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <h5>Bank Details</h5>
                          <Button color="primary" size="sm" onClick={handleCreateBank}>
                            <AddIcon fontSize="small" /> Add
                          </Button>
                        </div>
                        <Table striped bordered hover responsive>
                          <thead>
                            <tr>
                              <th>Bank Name</th>
                              <th>Branch</th>
                              <th>Account #</th>
                              <th>IFSC</th>
                              <th>Status</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Array.isArray(data?.employee_bank) && data.employee_bank.map(bank => (
                              <tr key={bank.id}>
                                <td>{bank.bank_name}</td>
                                <td>{bank.branch_name}</td>
                                <td>{bank.account_number}</td>
                                <td>{bank.ifsc_code}</td>
                                <td>
                                  <span className={bank.is_active ? "badge bg-success" : "badge bg-secondary"}>
                                    {bank.is_active ? "Active" : "Inactive"}
                                  </span>
                                </td>
                                <td>
                                  <Button color="link" size="sm" onClick={() => handleUpdateBank(bank)}>
                                    <EditIcon fontSize="small" />
                                  </Button>
                                  <Button color="link" size="sm" onClick={() => handleHistoryBank(bank?.employee_id)}>
                                    <HistoryIcon fontSize="small" />
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </TabPane>
                      {/* Designation Tab */}
                      <TabPane tabId="3">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <h5>Designation History</h5>
                          <Button color="primary" size="sm" onClick={handleCreateDesignation}>
                            <AddIcon fontSize="small" /> Add
                          </Button>
                        </div>
                        <Table striped bordered hover responsive>
                          <thead>
                            <tr>
                              <th>Designation</th>
                              <th>Cadre</th>
                              <th>Job Group</th>
                              <th>From</th>
                              <th>Till</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Array.isArray(data?.employee_designation) && data.employee_designation.map(designation => (
                              <tr key={designation.id}>
                                <td>{designation.designation}</td>
                                <td>{designation.cadre}</td>
                                <td>{designation.job_group}</td>
                                <td>{designation.effective_from}</td>
                                <td>{designation.effective_till || "Present"}</td>
                                <td>
                                  <Button color="link" size="sm" onClick={() => handleUpdateDesignation(designation)}>
                                    <EditIcon fontSize="small" />
                                  </Button>
                                  <Button color="link" size="sm" onClick={() => handleHistoryDesignation(designation?.employee_id)}>
                                    <HistoryIcon fontSize="small" />
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </TabPane>
                    </TabContent>
                  </CardBody>
                </Card>
              </Col>
            </>
          )}
        </Row>
      </Container>
      {/* Modals */}
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
      <DesignationModal
        isOpen={isDesignationModalOpen}
        toggle={toggleDesignationModal}
        modalType={designationModalType}
        selectedDesignation={selectedDesignation}
        setSelectedDesignation={setSelectedDesignation}
        handleSave={handleSaveDesignation}
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

export default EmployeeDetail;