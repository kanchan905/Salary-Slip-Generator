import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
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
  NavLink as RSNavLink,
  TabContent,
  TabPane,
  FormGroup
} from "reactstrap";
import EditIcon from '@mui/icons-material/Edit';
import HistoryIcon from '@mui/icons-material/History';
import AddIcon from '@mui/icons-material/Add';
import StatusModal from 'Modal/statusModal';
import BankModal from 'Modal/EmployeeBank';
import DesignationModal from 'Modal/DesignationModal';
import { Box, CircularProgress, IconButton } from '@mui/material';
import HistoryModal from 'Modal/HistoryModal';
import { toast } from 'react-toastify';
import { dateFormat } from 'utils/helpers';
import EmployeeQuarterPanel from './EmployeeQuarterPanel';

function EmployeeDetail() {
  const { id } = useParams();
  const data = useSelector((state) => state.employee.EmployeeDetail) || null;
  const { loading, error } = useSelector((state) => state.employee.loading);
  const dispatch = useDispatch();
  const currentRoles = useSelector((state) =>
    state.auth.user?.roles?.map(role => role.name) || []
  );
  const navigate = useNavigate()
  // Move designationList selector to top level
  const designationList = useSelector((state) => state.memeberStore?.designationList) || [];


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
    is_active: true,
    effective_from: '',
  });

  const [isDesignationModalOpen, setIsDesignationModalOpen] = useState(false);
  const [firstRow, setFirstRow] = useState(null);
  const [designationModalType, setDesignationModalType] = useState('create');
  const [renderFunction, setRenderFunction] = useState(() => null);
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
  const [editId, setEditId] = useState(null);
  const [statusData, setStatusData] = useState({});
  const [designantionData, setDesignationData] = useState({});
  const [bankData, setBankData] = useState({});

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

  const getTableConfig = (data, type) => {
    switch (type) {
      case "status":
        return {
          head: [
            "Sr. No.",
            "Status",
            "Effective From",
            "Effective Till",
            "Remarks",
            "Order Reference",
            "Added By",
            "Edited By",
            "Created At",
            "Updated At"
          ],
          firstRow:
            <tr className='bg-green text-white'>
              <td>{1}</td>
              <td>{data.status}</td>
              <td>{dateFormat(data.effective_from)}</td>
              <td>{dateFormat(data.effective_till) || "Present"}</td>
              <td>{data.remarks || "NA"}</td>
              <td>{data.order_reference || "NA"}</td>
              <td>{data.added_by
                ? `${data.added_by.name || '-'}${data.added_by.roles && data.added_by.roles.length > 0 ? ' (' + data.added_by.roles.map(role => role.name).join(', ') + ')' : ''}`
                : 'NA'}</td>
              <td>{data.edited_by
                ? `${data.edited_by.name || '-'}${data.edited_by.roles && data.edited_by.roles.length > 0 ? ' (' + data.edited_by.roles.map(role => role.name).join(', ') + ')' : ''}`
                : 'NA'}</td>
              <td>{data.created_at ? new Date(data.created_at).toLocaleString() : '-'}</td>
              <td>{data.updated_at ? new Date(data.updated_at).toLocaleString() : '-'}</td>
            </tr>
          ,
          renderRow: (record, index) => (
            <tr key={index}>
              <td>{index + 2}</td>
              <td>{record.status}</td>
              <td>{dateFormat(record.effective_from)}</td>
              <td>{dateFormat(record.effective_till) || "Present"}</td>
              <td>{record.remarks || "NA"}</td>
              <td>{record.order_reference || "NA"}</td>
              <td>{record.added_by
                ? `${record.added_by.name || '-'}${record.added_by.roles && record.added_by.roles.length > 0 ? ' (' + record.added_by.roles.map(role => role.name).join(', ') + ')' : ''}`
                : 'NA'}</td>
              <td>{record.edited_by
                ? `${record.edited_by.name || '-'}${record.edited_by.roles && record.edited_by.roles.length > 0 ? ' (' + record.edited_by.roles.map(role => role.name).join(', ') + ')' : ''}`
                : 'NA'}</td>
              <td>{record.created_at ? new Date(record.created_at).toLocaleString() : '-'}</td>
              <td>{record.updated_at ? new Date(record.updated_at).toLocaleString() : '-'}</td>
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
            "Status",
            "Added By",
            "Edited By",
            "Created At",
            "Updated At"
          ],
          firstRow:
            <tr className='bg-green text-white'>
              <td>{1}</td>
              <td className='text-capitalize'>{data.bank_name} - {data.branch_name}</td>
              <td>{data.ifsc_code}</td>
              <td>{data.account_number}</td>
              <td>{data.is_active ? 'Active' : 'Inactive'}</td>
              <td>{data.added_by
                ? `${data.added_by.name || '-'}${data.added_by.roles && data.added_by.roles.length > 0 ? ' (' + data.added_by.roles.map(role => role.name).join(', ') + ')' : ''}`
                : 'NA'}</td>
              <td>{data.edited_by
                ? `${data.edited_by.name || '-'}${data.edited_by.roles && data.edited_by.roles.length > 0 ? ' (' + data.edited_by.roles.map(role => role.name).join(', ') + ')' : ''}`
                : 'NA'}</td>
              <td>{data.created_at ? new Date(data.created_at).toLocaleString() : '-'}</td>
              <td>{data.updated_at ? new Date(data.updated_at).toLocaleString() : '-'}</td>
            </tr>
          ,
          renderRow: (record, index) => (
            <tr key={index}>
              <td>{index + 2}</td>
              <td className='text-capitalize'>{record.bank_name} - {record.branch_name}</td>
              <td>{record.ifsc_code}</td>
              <td>{record.account_number}</td>
              <td>{data.is_active ? 'Active' : 'Inactive'}</td>
              <td>{record.added_by
                ? `${record.added_by.name || '-'}${record.added_by.roles && record.added_by.roles.length > 0 ? ' (' + record.added_by.roles.map(role => role.name).join(', ') + ')' : ''}`
                : 'NA'}</td>
              <td>{record.edited_by
                ? `${record.edited_by.name || '-'}${record.edited_by.roles && record.edited_by.roles.length > 0 ? ' (' + record.edited_by.roles.map(role => role.name).join(', ') + ')' : ''}`
                : 'NA'}</td>
              <td>{record.created_at ? new Date(record.created_at).toLocaleString() : '-'}</td>
              <td>{record.updated_at ? new Date(record.updated_at).toLocaleString() : '-'}</td>
            </tr>
          ),
        };
      case "designation":
        return {
          head: [
            "Sr. No.",
            "Cadre",
            "Designation",
            "Job Group",
            "Effective From",
            "Effective Till",
            "Added By",
            "Edited By",
            "Created At",
            "Updated At"
          ],
          firstRow:
            <tr className='bg-green text-white'>
              <td>{1}</td>
              <td>{data.cadre}</td>
              <td>{data.designation}</td>
              <td className='text-capitalize'>{data.job_group}</td>
              <td>{dateFormat(data.effective_from)}</td>
              <td>{dateFormat(data.effective_till) || "Present"}</td>
              <td>{data.added_by
                ? `${data.added_by.name || '-'}${data.added_by.roles && data.added_by.roles.length > 0 ? ' (' + data.added_by.roles.map(role => role.name).join(', ') + ')' : ''}`
                : 'NA'}</td>
              <td>{data.edited_by
                ? `${data.edited_by.name || '-'}${data.edited_by.roles && data.edited_by.roles.length > 0 ? ' (' + data.edited_by.roles.map(role => role.name).join(', ') + ')' : ''}`
                : 'NA'}</td>
              <td>{data.created_at ? new Date(data.created_at).toLocaleString() : '-'}</td>
              <td>{data.updated_at ? new Date(data.updated_at).toLocaleString() : '-'}</td>
            </tr>
          ,
          renderRow: (record, index) => (
            <tr key={index}>
              <td>{index + 2}</td>
              <td>{record.cadre}</td>
              <td>{record.designation}</td>
              <td className='text-capitalize'>{record.job_group}</td>
              <td>{dateFormat(record.effective_from)}</td>
              <td>{dateFormat(record.effective_till) || "Present"}</td>
              <td>{record.added_by
                ? `${record.added_by.name || '-'}${record.added_by.roles && record.added_by.roles.length > 0 ? ' (' + record.added_by.roles.map(role => role.name).join(', ') + ')' : ''}`
                : 'NA'}</td>
              <td>{record.edited_by
                ? `${record.edited_by.name || '-'}${record.edited_by.roles && record.edited_by.roles.length > 0 ? ' (' + record.edited_by.roles.map(role => role.name).join(', ') + ')' : ''}`
                : 'NA'}</td>
              <td>{record.created_at ? new Date(record.created_at).toLocaleString() : '-'}</td>
              <td>{record.updated_at ? new Date(record.updated_at).toLocaleString() : '-'}</td>
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
    setEditId(status.id)
  };


  const handleHistoryStatus = (status_id) => {
    dispatch(fetchEmployeeStatus(status_id))
      .unwrap()
      .then((payload) => {
        // Pass the fresh `payload` directly to the config function
        const config = getTableConfig(payload, "status");

        setHistoryRecord(payload?.history || []);
        setTableHead(config.head);
        setRenderFunction(() => config.renderRow);
        setFirstRow(config.firstRow); // This is now built with fresh data
        // setStatusData(payload); // This line is no longer needed for the modal
        setIsHistoryModalOpen(true);
      })
      .catch((err) => {
        toast.error("Could not load history data.");
      });
  };


  const handleHistoryBank = (bank_id) => {
    dispatch(fetchEmployeeBankdetailStatus(bank_id))
      .unwrap()
      .then((payload) => {
        // Pass the fresh `payload` directly
        const config = getTableConfig(payload, "bank");

        setHistoryRecord(payload?.history || []);
        setTableHead(config.head);
        setRenderFunction(() => config.renderRow);
        setFirstRow(config.firstRow); // Built with fresh data
        // setBankData(payload); // No longer needed for the modal
        setIsHistoryModalOpen(true);
      })
      .catch((err) => {
        toast.error("Could not load bank history data.");
      });
  };

  const handleHistoryDesignation = (designation_id) => {

    dispatch(fetchEmployeeDesignationStatus(designation_id))
      .unwrap()
      .then((payload) => {
        // Pass the fresh `payload` directly
        const config = getTableConfig(payload, "designation");

        setHistoryRecord(payload?.history || []);
        setTableHead(config.head);
        setRenderFunction(() => config.renderRow);
        setFirstRow(config.firstRow); // Built with fresh data
        // setDesignationData(payload); // No longer needed for the modal
        setIsHistoryModalOpen(true);
      })
      .catch((err) => {
        toast.error("Could not load designation history data.");
      });
  };


  const handleSave = () => {
    if (modalType === 'create') {
      const statusDataWithId = { ...selectedStatus, employee_id: id };
      dispatch(addEmploeeStatus(statusDataWithId)).unwrap()
        .then(() => {
          toast.success("Sucessfully added");
          dispatch(fetchEmployeeById(id));
        }).catch((err) => {
          const apiMsg =
            err?.message || err?.errorMsg || "Failed to save info.";
          toast.error(apiMsg);
        });
    } else if (modalType === 'update') {
      dispatch(updateEmployeeStatus({ employeeId: editId, statusData: selectedStatus })).unwrap()
        .then(() => {
          toast.success("Sucessfully Updated");
          dispatch(fetchEmployeeById(id));
        }).catch((err) => {
          const apiMsg =
            err?.message || err?.errorMsg || "Failed to save info.";
          toast.error(apiMsg);
        });
      setEditId(null)
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
      is_active: true,
      effective_from: '',
    });
    toggleBankModal();
  };
  const handleUpdateBank = (bank) => {
    setBankModalType('update');
    setSelectedBank(bank);
    toggleBankModal();
    setEditId(bank.id)
  };
  const handleSaveBank = () => {
    if (bankModalType === 'create') {
      const newBankData = { ...selectedBank, is_active: selectedBank.is_active ? 1 : 0, employee_id: id };

      dispatch(addBankdetails(newBankData)).unwrap()
        .then(() => {
          toast.success("Sucessfully added");
          dispatch(fetchEmployeeById(id));
        }).catch((err) => {
          const apiMsg =
            err?.response?.data?.message || err?.message || err?.errorMsg || "Failed to save info.";
          toast.error(apiMsg);
        });
    } else if (bankModalType === 'update') {
      const updatedBankData = {
        ...selectedBank,
        is_active: selectedBank.is_active ? 1 : 0,
      };
      dispatch(updateEmployeeBankdetail({ bankData: updatedBankData, employeeId: editId })).unwrap()
        .then(() => {
          toast.success("Successfully updated");
          dispatch(fetchEmployeeById(id));
        }).catch((err) => {
          const apiMsg =
            err?.response?.data?.message || err?.message || err?.errorMsg || "Failed to save info.";
          toast.error(apiMsg);
        });
      setEditId(null)
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
    // Find the group for the current designation
    let group = '';
    for (const g of designationList) {
      if (g.options && g.options.includes(designation.designation)) {
        group = g.name;
        break;
      }
    }
    setSelectedDesignation({
      ...designation,
      designation_group: group
    });
    toggleDesignationModal();
    setEditId(designation.id)
  };
  const handleSaveDesignation = () => {
    if (designationModalType === 'create') {
      const newDesignationData = { ...selectedDesignation, employee_id: id };
      dispatch(addDesignation(newDesignationData)).unwrap()
        .then(() => {
          toast.success("Sucessfully added");
          dispatch(fetchEmployeeById(id));
        }).catch((err) => {
          const apiMsg =
            err?.response?.data?.message || err?.message || err?.errorMsg || "Failed to save info.";
          toast.error(apiMsg);
        });
    } else if (designationModalType === 'update') {
      dispatch(updateDesignation({ designationData: selectedDesignation, employeeId: editId })).unwrap()
        .then(() => {
          toast.success("Sucessfully added")
          dispatch(fetchEmployeeById(id));
        }).catch((err) => {
          const apiMsg =
            err?.response?.data?.message || err?.message || err?.errorMsg || "Failed to save info.";
          toast.error(apiMsg);
        });
      setEditId(null);
    }
    toggleDesignationModal();
  };

  useEffect(() => {
    dispatch(fetchEmployeeById(id));
  }, [dispatch, id]);

  const capitalize = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const handleEdit = (data) => {
    navigate(`/employee/edit/${data?.id}`);
  };

  const getMonthName = (monthNumber) => {
    if (!monthNumber) return "N/A";
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    // If monthNumber is already a string, parse it to int
    const index = parseInt(monthNumber, 10) - 1;
    return monthNames[index] || "N/A";
  };

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
              <Col xl="4" className='detail-height'>
                <Card className="shadow-lg border-0 rounded-3 height custom-scrollbar">
                  <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 1 }}>
                    {
                      currentRoles.some(role => ['IT Admin', "Salary Processing Coordinator (NIOH)", "Salary Processing Coordinator (ROHC)"].includes(role)) && (
                        <IconButton size="small" onClick={() => handleEdit(data)}>
                          <EditIcon />
                        </IconButton>
                      )

                    }
                  </div>
                  <CardBody className="text-center p-4">
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
                        textTransform: "uppercase"
                      }}
                    >
                      {data.first_name?.[0]}{data.last_name?.[0]}
                    </div>
                    <h2 className="font-bold text-2xl mb-1 text-capitalize">
                      {data.name || "-"}
                    </h2>
                    <span className="badge bg-info text-white mb-2">{data.gender}</span>
                    <div className="text-gray-600 mb-2">{data.email}</div>
                    <div className="flex flex-wrap justify-center mb-3" style={{ gap: '3px' }}>
                      <span className="badge bg-light text-dark mr-2">DOB: {dateFormat(data.date_of_birth)}</span>
                      <span className="badge bg-light text-dark mr-2">DOJ: {dateFormat(data.date_of_joining)}</span>
                      <span className="badge bg-light text-dark">Retirement: {dateFormat(data.date_of_retirement) || "N/A"}</span>
                    </div>
                    <hr />
                    <div className="text-left text-sm mt-3 space-y-1">
                      <p><strong>Emp Code:</strong> {data.employee_code}</p>
                      <p><strong>Institute:</strong> {data.institute}</p>
                      <p><strong>Pension Scheme:</strong> {data.pension_scheme}</p>
                      <p><strong>PAN Number:</strong> {data.pancard}</p>
                      <p><strong>PWD Status:</strong> {data.pwd_status ? 'Yes' : 'No'}</p>
                      <p><strong>Pension Number:</strong> {data.pension_number || 'N/A'}</p>
                      <p><strong>GIS Eligibility:</strong> {data.gis_eligibility ? 'Yes' : 'No'}</p>
                      <p><strong>GIS Number:</strong> {data.gis_no || 'N/A'}</p>
                      <p><strong>Credit Society Member:</strong> {data.credit_society_member ? 'Yes' : 'No'}</p>
                      <p><strong>Increment Month:</strong> {getMonthName(data.increment_month)}</p>
                      <p><strong>Uniform Allowance Eligibility:</strong> {data.uniform_allowance_eligibility ? 'Yes' : 'No'}</p>
                      <p><strong>HRA Eligibility:</strong> {data.hra_eligibility ? 'Yes' : 'No'}</p>
                      <p><strong>NPA Eligibility:</strong> {data.npa_eligibility ? 'Yes' : 'No'}</p>
                      <p><strong>Added By:</strong> {data.added_by
                        ? `${data.added_by.name || '-'}${data.added_by.roles && data.added_by.roles.length > 0 ? ' (' + data.added_by.roles.map(role => role.name).join(', ') + ')' : ''}`
                        : 'NA'}</p>
                      <p><strong>Edited By:</strong> {data.edited_by
                        ? `${data.edited_by.name || '-'}${data.edited_by.roles && data.edited_by.roles.length > 0 ? ' (' + data.edited_by.roles.map(role => role.name).join(', ') + ')' : ''}`
                        : 'NA'}</p>
                    </div>
                  </CardBody>
                </Card>
              </Col>
              {/* Tabbed Details */}
              <Col xl="8" className='detail-height'>
                <Card className="shadow-lg border-0 rounded-3 height" >
                  <CardHeader className="bg-white border-0 pb-0 ">
                    <div className="container-fluid px-0 grids p-0 d-flex justify-content-between align-items-center">
                      <Nav tabs className="border-0 flex-column flex-md-row w-100 desktop-tabs-row">
                        <NavItem>
                          <RSNavLink
                            className={activeTab === "1" ? "active" : ""}
                            onClick={() => toggleTab("1")}
                            style={{ cursor: 'pointer' }}
                          >
                            Status
                          </RSNavLink>
                        </NavItem>
                        <NavItem>
                          <RSNavLink
                            className={activeTab === "2" ? "active" : ""}
                            onClick={() => toggleTab("2")}
                            style={{ cursor: 'pointer' }}
                          >
                            Bank
                          </RSNavLink>
                        </NavItem>
                        <NavItem>
                          <RSNavLink
                            className={activeTab === "3" ? "active" : ""}
                            onClick={() => toggleTab("3")}
                            style={{ cursor: 'pointer' }}
                          >
                            Designation
                          </RSNavLink>
                        </NavItem>
                        <NavItem>
                          <RSNavLink
                            className={activeTab === "4" ? "active" : ""}
                            onClick={() => toggleTab("4")}
                            style={{ cursor: 'pointer' }}
                          >
                            Quarter Allocation
                          </RSNavLink>
                        </NavItem>
                      </Nav>
                      <div className="col-12 col-md-3 text-md-end mb-2 mb-md-0 order-2 order-md-1">
                        <NavLink to={`/employee-management`} className="btn btn-primary w-100 w-md-auto mt-2 mt-md-0" style={{ background: "#004080", color: '#fff' }}>
                          Back
                        </NavLink>
                      </div>
                    </div>
                  </CardHeader>
                  <CardBody className="p-4" style={{ backgroundColor: '#f8f9fa', borderRadius: '10px'}}>
                    <TabContent activeTab={activeTab}>
                      {/* Status Tab */}
                      <TabPane tabId="1">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <h5>Status</h5>
                          {
                           currentRoles.some(role => ['IT Admin', "Salary Processing Coordinator (NIOH)", "Salary Processing Coordinator (ROHC)"].includes(role)) && (
                              <Button color="primary" size="sm" onClick={handleCreateStatus}>
                                <AddIcon fontSize="small" /> Add
                              </Button>
                            )
                          }
                        </div>
                        <div className="table-responsive">
                          <Table striped bordered hover responsive>
                            <thead>
                              <tr>
                                <th style={{ fontWeight: "900", fontSize: "13px" }}>Status</th>
                                <th style={{ fontWeight: "900", fontSize: "13px" }}>From</th>
                                <th style={{ fontWeight: "900", fontSize: "13px" }}>Till</th>
                                <th style={{ fontWeight: "900", fontSize: "13px" }}>Remarks</th>
                                <th style={{ fontWeight: "900", fontSize: "13px" }}>Order Reference</th>
                                <th style={{ fontWeight: "900", fontSize: "13px" }}>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {Array.isArray(data?.employee_status) && data.employee_status.length !== 0 ? (
                                data.employee_status.map((status) => (
                                  <tr key={status.id}>
                                    <td>{status.status || "-"}</td>
                                    <td>{dateFormat(status.effective_from)}</td>
                                    <td>{dateFormat(status.effective_till) || "Present"}</td>
                                    <td>{status.remarks || 'N/A'}</td>
                                    <td>{status.order_reference || 'N/A'}</td>
                                    <td>
                                      {  currentRoles.some(role => ['IT Admin', "Salary Processing Coordinator (NIOH)", "Salary Processing Coordinator (ROHC)"].includes(role)) && (
                                        <Button color="link" size="sm" onClick={() => handleUpdateStatus(status)}>
                                          <EditIcon fontSize="small" />
                                        </Button>
                                      )}
                                      <Button color="link" size="sm" onClick={() => handleHistoryStatus(status?.id)}>
                                        <HistoryIcon fontSize="small" />
                                      </Button>
                                    </td>
                                  </tr>
                                ))) : (
                                <tr>
                                  <td align="center" colSpan={6}>No status data found</td>
                                </tr>
                              )}
                            </tbody>
                          </Table>
                        </div>
                      </TabPane>
                      {/* Bank Tab */}
                      <TabPane tabId="2">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <h5>Bank Details</h5>
                          {
                            currentRoles.some(role => ['IT Admin', "Salary Processing Coordinator (NIOH)", "Salary Processing Coordinator (ROHC)"].includes(role)) && (
                              <Button color="primary" size="sm" onClick={handleCreateBank}>
                                <AddIcon fontSize="small" /> Add
                              </Button>
                            )
                          }
                        </div>
                        <div className="table-responsive">
                          <Table striped bordered hover responsive>
                            <thead>
                              <tr style={{ whiteSpace: "nowrap" }}>
                                <th style={{ fontWeight: "900", fontSize: "13px" }}>Bank Name</th>
                                <th style={{ fontWeight: "900", fontSize: "13px" }}>Branch</th>
                                <th style={{ fontWeight: "900", fontSize: "13px" }}>Account</th>
                                <th style={{ fontWeight: "900", fontSize: "13px" }}>IFSC</th>
                                <th style={{ fontWeight: "900", fontSize: "13px" }}>Status</th>
                                <th style={{ fontWeight: "900", fontSize: "13px" }}>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {Array.isArray(data?.employee_bank) && data.employee_bank.length !== 0 ? (
                                data.employee_bank.map((bank) => (
                                  <tr key={bank.id} style={{ whiteSpace: "nowrap" }}>
                                    <td>{bank.bank_name}</td>
                                    <td>{bank.branch_name}</td>
                                    <td>{bank.account_number}</td>
                                    <td>{bank.ifsc_code}</td>
                                    <td>
                                      <span className={bank.is_active ? "badge bg-success text-white" : "badge bg-danger text-white"}>
                                        {bank.is_active ? "Active" : "Inactive"}
                                      </span>
                                    </td>
                                    <td>
                                      { currentRoles.some(role => ['IT Admin', "Salary Processing Coordinator (NIOH)", "Salary Processing Coordinator (ROHC)"].includes(role)) && (
                                        <Button color="link" size="sm" onClick={() => handleUpdateBank(bank)}>
                                          <EditIcon fontSize="small" />
                                        </Button>
                                      )}
                                      <Button color="link" size="sm" onClick={() => handleHistoryBank(bank?.id)}>
                                        <HistoryIcon fontSize="small" />
                                      </Button>
                                    </td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td align="center" colSpan={6}>No bank data found</td>
                                </tr>
                              )}
                            </tbody>
                          </Table>
                        </div>
                      </TabPane>
                      {/* Designation Tab */}
                      <TabPane tabId="3">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <h5>Designation History</h5>
                          {
                             currentRoles.some(role => ['IT Admin', "Salary Processing Coordinator (NIOH)", "Salary Processing Coordinator (ROHC)"].includes(role)) && (
                              <Button color="primary" size="sm" onClick={handleCreateDesignation}>
                                <AddIcon fontSize="small" /> Add
                              </Button>
                            )
                          }
                        </div>
                        <div className="table-responsive">
                          <Table striped bordered hover responsive>
                            <thead>
                              <tr>
                                <th style={{ fontWeight: "900", fontSize: "13px" }}>Cadre</th>
                                <th style={{ fontWeight: "900", fontSize: "13px" }}>Designation</th>
                                <th style={{ fontWeight: "900", fontSize: "13px" }}>Job Group</th>
                                <th style={{ fontWeight: "900", fontSize: "13px" }}>From</th>
                                <th style={{ fontWeight: "900", fontSize: "13px" }}>Till</th>
                                <th style={{ fontWeight: "900", fontSize: "13px" }}>Promotion Order No.</th>
                                <th style={{ fontWeight: "900", fontSize: "13px" }}>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {Array.isArray(data?.employee_designation) && data.employee_designation.length !== 0 ? (
                                data.employee_designation.map(designation => (
                                  <tr key={designation.id}>
                                    <td>{designation.cadre}</td>
                                    <td>{designation.designation}</td>
                                    <td>{designation.job_group}</td>
                                    <td>{dateFormat(designation.effective_from)}</td>
                                    <td>{dateFormat(designation.effective_till) || "Present"}</td>
                                    <td>{designation.promotion_order_no || "N/A"}</td>
                                    <td>
                                      {
                                        currentRoles.some(role => ['IT Admin', "Salary Processing Coordinator (NIOH)", "Salary Processing Coordinator (ROHC)"].includes(role)) && (
                                          <Button color="link" size="sm" onClick={() => handleUpdateDesignation(designation)}>
                                            <EditIcon fontSize="small" />
                                          </Button>
                                        )
                                      }
                                      <Button color="link" size="sm" onClick={() => handleHistoryDesignation(designation?.id)}>
                                        <HistoryIcon fontSize="small" />
                                      </Button>
                                    </td>
                                  </tr>
                                )
                                )) :
                                (
                                  <tr>
                                    <td align='center' colSpan={7}>No designation found</td>
                                  </tr>
                                )}
                            </tbody>
                          </Table>
                        </div>
                      </TabPane>
                      {/* Quarter Tab */}
                      <TabPane tabId="4">
                        <EmployeeQuarterPanel empQuarter={Array.isArray(data?.employee_quarter) && data.employee_quarter} isHraEligible={data?.hra_eligibility} />
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
        firstRow={firstRow}
      />
    </>
  );
}

export default EmployeeDetail;
