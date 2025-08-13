import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
    showPensioner,
} from '../../redux/slices/pensionerSlice';
import {
    createBankDetail,
    updateBankDetail,
    toggleBankDetailStatus,
    fetchBankShow
} from '../../redux/slices/bankSlice';
import {
    fetchPensionRelated,
    CreatePensionRelated,
    UpdatePensionRelated,
    ShowPensionRelated,
} from '../../redux/slices/pensionRelatedSlice';
import {
    fetchPensionDocument,
    createPensionDocument,
    updatePensionDocument,
    fetchPensionDocumentShow,
} from '../../redux/slices/pensionDocumentSlice';
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
import { Box, CircularProgress, IconButton } from '@mui/material';
import HistoryModal from 'Modal/HistoryModal'; // Re-usable
import { toast } from 'react-toastify';
import { dateFormat } from 'utils/helpers';
import BankFormModal from '../../Modal/BankFormModal';
import PensionerInfoModal from '../../Modal/PensionerInfoModal';
import PensionDocumentModal from '../../Modal/PensionDocumentModal';

export default function PensionerDetail() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Main data and loading state
    const data = useSelector((state) => state.pensioner.pensioner) || null;
    const { loading } = useSelector((state) => state.pensioner);
    const currentRoles = useSelector((state) =>
        state.auth.user?.roles?.map(role => role.name) || []
    );

    // Tab state
    const [activeTab, setActiveTab] = useState('1');
    const toggleTab = tab => { if (activeTab !== tab) setActiveTab(tab); };

    // Modal states
    const [isBankModalOpen, setIsBankModalOpen] = useState(false);
    const [isPensionInfoModalOpen, setIsPensionInfoModalOpen] = useState(false);
    const [isPensionDocumentOpen, setIsPensionDocumentOpen] = useState(false);
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);


    // Data states for modals
    const [modalType, setModalType] = useState('create');
    const [editId, setEditId] = useState(null);
    const [selectedBank, setSelectedBank] = useState(null);
    const [selectedPensionInfo, setSelectedPensionInfo] = useState(null);
    const [selectedPensionDocument, setSelectedPensionDocument] = useState(null);

    // History modal states
    const [historyRecord, setHistoryRecord] = useState([]);
    const [tableHead, setTableHead] = useState([]);
    const [renderFunction, setRenderFunction] = useState(() => null);
    const [firstRow, setFirstRow] = useState(null);
    const [bankData, setBankData] = useState({});
    const [pensionInfoData, setPensionInfoData] = useState({});
    const [documentData, setDocumentData] = useState({});

    useEffect(() => {
        if (id) {
            dispatch(showPensioner(id));
        }
    }, [dispatch, id]);

    // --- Table & History Configuration ---
    const getTableConfig = (data, type) => {
        switch (type) {
            case "bank":
                return {
                    head: ["Sr. No.", "Bank Name", "IFSC", "Account Number", "Status", "Added By", "Edited By", "Created At", "Updated At"],
                    firstRow:
                        <tr className='bg-green text-white'>
                            <td>{1}</td>
                            <td className='text-capitalize'>{data.bank_name} - {data.branch_name}</td>
                            <td>{data.ifsc_code}</td>
                            <td>{data.account_no}</td>
                            <td>
                                <span className={data.is_active ? "badge bg-success text-white" : "badge bg-danger text-white"}>
                                    {data.is_active ? "Active" : "Inactive"}
                                </span>
                            </td>
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
                            <td>{record.account_no}</td>
                            <td>
                                <span className={record.is_active ? "badge bg-success text-white" : "badge bg-danger text-white"}>
                                    {record.is_active ? "Active" : "Inactive"}
                                </span>
                            </td>
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
            case "pensionInfo":
                return {
                    head: ["Sr. No.", "Basic Pension", "Commutation Amount", "Additional Pension", "Medical Allowance", "Is Active",  "Effective From", "Effective Till", "Added By", "Edited By", "Created At", "Updated At"],
                    firstRow:
                        <tr className='bg-green text-white'>
                            <td>{1}</td>
                            <td>{data.basic_pension}</td>
                            <td>{data.commutation_amount}</td>
                            <td>{data.additional_pension}</td>
                            <td>{data.medical_allowance}</td>
                            <td>{data.is_active ? 'Active' : 'Inactive'}</td>
                            <td>{dateFormat(data.effective_from)}</td>
                            <td>{dateFormat(data.effective_till) || 'N/A'}</td>
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
                            <td>{record.basic_pension}</td>
                            <td>{record.commutation_amount}</td>
                            <td>{record.additional_pension}</td>
                            <td>{record.medical_allowance}</td>
                            <td>{record.is_active ? 'Active' : 'Inactive'}</td>
                            <td>{dateFormat(record.effective_from)}</td>
                            <td>{dateFormat(record.effective_till) || 'N/A'}</td>
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

            case "document":
                return {
                    head: ["Sr. No.", "Document Type", "Document Number", "Issue Date", "Expiry Date", "Added By", "Edited By", "Created At", "Updated At"],
                    firstRow:
                        <tr className='bg-green text-white'>
                            <td>{1}</td>
                            <td>{data.document_type}</td>
                            <td>{data.document_number || 'N/A'}</td>
                            <td>{dateFormat(data.issue_date)}</td>
                            <td>{dateFormat(data.expiry_date) || 'N/A'}</td>
                            <td>{data.addedd_by
                                ? `${data.addedd_by.name || '-'}${data.addedd_by.roles && data.addedd_by.roles.length > 0 ? ' (' + data.addedd_by.roles.map(role => role.name).join(', ') + ')' : ''}`
                                : 'N/A'}</td>
                            <td>{data.edited_by
                                ? `${data.edited_by.name || '-'}${data.edited_by.roles && data.edited_by.roles.length > 0 ? ' (' + data.edited_by.roles.map(role => role.name).join(', ') + ')' : ''}`
                                : 'N/A'}</td>
                            <td>{data.created_at ? new Date(data.created_at).toLocaleString() : '-'}</td>
                            <td>{data.updated_at ? new Date(data.updated_at).toLocaleString() : '-'}</td>
                        </tr>
                    ,
                    renderRow: (record, index) => (
                        <tr key={index}>
                            <td>{index + 2}</td>
                            <td>{record.document_type}</td>
                            <td>{record.document_number || 'N/A'}</td>
                            <td>{dateFormat(record.issue_date)}</td>
                            <td>{dateFormat(record.expiry_date) || 'N/A'}</td>
                            <td>{record.addedd_by
                                ? `${record.addedd_by.name || '-'}${record.addedd_by.roles && record.addedd_by.roles.length > 0 ? ' (' + record.addedd_by.roles.map(role => role.name).join(', ') + ')' : ''}`
                                : 'N/A'}</td>
                            <td>{record.edited_by
                                ? `${record.edited_by.name || '-'}${record.edited_by.roles && record.edited_by.roles.length > 0 ? ' (' + record.edited_by.roles.map(role => role.name).join(', ') + ')' : ''}`
                                : 'N/A'}</td>
                            <td>{record.created_at ? new Date(record.created_at).toLocaleString() : '-'}</td>
                            <td>{record.updated_at ? new Date(record.updated_at).toLocaleString() : '-'}</td>
                        </tr>
                    ),
                };
            default:
                return { head: [], renderRow: () => null };
        }
    };

    // --- Generic Handlers ---
    const handleEdit = () => {
        navigate(`/pensioner/edit/${data?.id}`);
    };
    const toggleHistoryModal = () => setIsHistoryModalOpen(!isHistoryModalOpen);

    // --- Bank Details Handlers ---
    const toggleBankModal = () => setIsBankModalOpen(!isBankModalOpen);

    const handleCreateBank = () => {
        setModalType('create');
        setSelectedBank({
            pensioner_id: id, bank_name: '', branch_name: '', account_no: '', ifsc_code: '', is_active: true
        });
        toggleBankModal();
    };

    const handleUpdateBank = (bank) => {
        setModalType('update');
        setEditId(bank.id);
        setSelectedBank(bank);
        toggleBankModal();
    };

    // In PensionerDetail.js

    const handleSaveBank = (bankData) => {
        const payload = { ...bankData, pensioner_id: id };

        const action = modalType === 'create'
            ? createBankDetail(payload)
            : updateBankDetail({ id: editId, values: payload });

        dispatch(action).unwrap()
            .then(() => {
                toast.success(`Bank details ${modalType === 'create' ? 'created' : 'updated'} successfully`);
                dispatch(showPensioner(id));
                toggleBankModal();
            })
            .catch(err => {
                const errorMessage = err.errors
                    ? Object.values(err.errors).flat().join(' ')
                    : err.message || "Failed to save bank details.";
                toast.error(errorMessage);
            });
    };

    const handleHistoryBank = (bankId) => {
        dispatch(fetchBankShow(bankId)).unwrap()
            .then((payload) => {
                const config = getTableConfig(payload?.data, "bank");
                setHistoryRecord(payload?.data?.history || []);
                setTableHead(config.head);
                setRenderFunction(() => config.renderRow);
                setIsHistoryModalOpen(true);
                setFirstRow(config.firstRow);
                setBankData(payload?.data);
            })
            .catch(err => toast.error("Could not load bank history."));
    };

    const handleToggleStatus = async (bank) => {
        dispatch(toggleBankDetailStatus({ id: bank?.id })).unwrap()
            .then(() => {
                // dispatch(fetchba({ page: '', limit: '', id: '' }));
                dispatch(showPensioner(id))
                toast.success("Bank status updated");
            })
            .catch((err) => {
                const apiMsg =
                    err?.response?.data?.message ||
                    err?.message ||
                    'Bank status Updatation Failed.';
                toast.error(apiMsg);
            });;
    };


    // --- Pension Info Handlers ---
    const togglePensionInfoModal = () => setIsPensionInfoModalOpen(!isPensionInfoModalOpen);

    const handleCreatePensionInfo = () => {
        setModalType('create');
        setSelectedPensionInfo({
            basic_pension: '',
            commutation_amount: '',
            additional_pension: '',
            medical_allowance: '',
            effective_from: '',
            effective_till: '',
            is_active: 1,
        });
        togglePensionInfoModal();
    };

    const handleUpdatePensionInfo = (info) => {
        setModalType('update');
        setEditId(info.id);
        setSelectedPensionInfo(info);
        togglePensionInfoModal();
    };

    const handleSavePensionInfo = (infoData) => {
        const payload = { ...infoData, pensioner_id: id };

        const action = modalType === 'create'
            ? CreatePensionRelated(payload)
            : UpdatePensionRelated({ id: editId, values: payload });

        dispatch(action).unwrap()
            .then(() => {
                toast.success(`Pension info ${modalType === 'create' ? 'created' : 'updated'} successfully`);
                dispatch(showPensioner(id));
                togglePensionInfoModal();
            })
            .catch(err => {
                const errorMessage = err.errors ? Object.values(err.errors).flat().join(' ') : (err.message || err.errorMsg || `Failed to save pension info.`);
                toast.error(errorMessage);
            });
    };


    const handleHistoryPensionInfo = (infoId) => {
        dispatch(ShowPensionRelated(infoId)).unwrap()
            .then((payload) => {
                const config = getTableConfig(payload, "pensionInfo");
                setHistoryRecord(payload.history || []);
                setTableHead(config.head);
                setRenderFunction(() => config.renderRow);
                setFirstRow(config.firstRow);
                setPensionInfoData(payload);
                setIsHistoryModalOpen(true);
            })
            .catch(err => toast.error("Could not load pension info history."));
    };


    // --- Pension Document Handlers
    const toggleDocumentModal = () => setIsPensionDocumentOpen(!isPensionDocumentOpen);

    const handleCreateDocument = () => {
        setModalType('create');
        setSelectedPensionDocument({
            document_type: '',
            document_number: '',
            issue_date: '',
            expiry_date: '',
            file: null
        });
        toggleDocumentModal();
    };

    const handleUpdateDocument = (doc) => {
        setModalType('update');
        setEditId(doc.id);
        setSelectedPensionDocument(doc);
        toggleDocumentModal();
    };


    // In PensionerDetail.js

    const handleSaveDocument = (docData) => {
        const payload = { ...docData, pensioner_id: id };

        const action = modalType === 'create'
            ? createPensionDocument(payload)
            : updatePensionDocument({ id: editId, values: payload });

        dispatch(action).unwrap()
            .then(() => {
                toast.success(`pensioner documents = ${modalType === 'create' ? 'created' : 'updated'} successfully`);
                dispatch(showPensioner(id));
                toggleDocumentModal();
            })
            .catch(err => {
                const errorMessage = err.errors
                    ? Object.values(err.errors).flat().join(' ')
                    : err.message || "Failed to save document details.";
                toast.error(errorMessage);
            });
    };

    const handleHistoryDocument = (docId) => {
        dispatch(fetchPensionDocumentShow(docId)).unwrap()
            .then((payload) => {
                const config = getTableConfig(payload, "document");
                setHistoryRecord(payload.data?.history || []);
                setTableHead(config.head);
                setRenderFunction(() => config.renderRow);
                setFirstRow(config.firstRow);
                setDocumentData(payload?.data);
                setIsHistoryModalOpen(true);
            })
            .catch(err => toast.error("Could not load document history."));
    };



    return (
        <>
            <div className="header bg-gradient-info pb-8 pt-8 main-head"></div>
            <Container className="mt--7 mb-7" fluid>
                <Row className="justify-content-center">
                    {loading || !data ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <>
                            {/* Left Profile Card */}
                            <Col xl="4">
                                <Card className="shadow-lg border-0 rounded-3">
                                    <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 1 }}>
                                        {
                                             currentRoles.some(role => ['IT Admin', "Pensioners Operator"].includes(role)) && (
                                                <IconButton size="small" onClick={handleEdit}>
                                                    <EditIcon />
                                                </IconButton>
                                            )
                                        }
                                    </div>
                                    <CardBody className="text-center p-4 custom-scrollbar" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                                        <div style={{ width: 100, height: 100, borderRadius: '50%', textTransform: 'capitalize', background: 'linear-gradient(135deg, #6a82fb 0%, #4f8cff 100%)', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, color: '#fff' }}>
                                            {data.name?.[0]}
                                        </div>
                                        <h2 className="font-bold text-2xl text-capitalize mb-1">{data?.name}</h2>
                                        <span className={`badge ${data.status === 'Active' ? 'bg-success' : 'bg-warning'} text-white mb-2`}>{data.status}</span>
                                        <p className="text-gray-600 mb-2">{data?.email}</p>
                                        <div className="flex flex-wrap justify-center mb-3" style={{ gap: '3px' }}>
                                            <span className="badge bg-light text-dark mr-2">DOB: {dateFormat(data.dob)}</span>
                                            <span className="badge bg-light text-dark mr-2">DOJ: {dateFormat(data.doj)}</span>
                                            <span className="badge bg-light text-dark">Retirement: {dateFormat(data.dor) || "N/A"}</span>
                                        </div>
                                        <hr />
                                        <div className="text-left text-sm mt-3 space-y-1">
                                            <p><strong>Emp Code:</strong> {data?.employee?.employee_code}</p>
                                            <p><strong>PPO No:</strong> {data.ppo_no}</p>
                                            <p><strong>PAN:</strong> {data.pan_number}</p>
                                            <p><strong>Pension Type:</strong> {data.type_of_pension}</p>
                                            <p><strong>Relation:</strong> {data.relation}</p>
                                            <p><strong>Pension End:</strong> {dateFormat(data.end_date) || 'N/A'}</p>
                                            <p><strong>Pay Commission at Retirement:</strong> {data.pay_commission_at_retirement || 'N/A'}</p>
                                            <p><strong>Last Drawn Salary:</strong> {data.last_drawn_salary || 'N/A'}</p>
                                            <p><strong>NPA:</strong> {data.NPA || 'N/A'}</p>
                                            <p><strong>HRA:</strong> {data.HRA || 'N/A'}</p>
                                            <p><strong>Special Pay:</strong> {data.special_pay || 'N/A'}</p>
                                            <p><strong>Start Date:</strong> {data.start_date}</p>
                                            <p><strong>Mobile:</strong> {data.mobile_no}</p>
                                            <p><strong>Address:</strong> {`${data.address}, ${data.city}, ${data.state} - ${data.pin_code}`}</p>
                                            <hr />
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

                            {/* Right Tabbed Details */}
                            <Col xl="8">
                                <Card className="shadow-lg border-0 rounded-3 height">
                                    <CardHeader className="bg-white border-0 pb-0">
                                        <div className="container-fluid px-0 grids p-0 d-flex justify-content-between align-items-center">
                                            <Nav tabs className="border-0">
                                                <NavItem>
                                                    <RSNavLink className={activeTab === "1" ? "active" : ""} onClick={() => toggleTab("1")} style={{ cursor: 'pointer' }}>Bank Accounts</RSNavLink>
                                                </NavItem>
                                                <NavItem>
                                                    <RSNavLink className={activeTab === "2" ? "active" : ""} onClick={() => toggleTab("2")} style={{ cursor: 'pointer' }}>Pension Details</RSNavLink>
                                                </NavItem>
                                                <NavItem>
                                                    <RSNavLink className={activeTab === "3" ? "active" : ""} onClick={() => toggleTab("3")} style={{ cursor: 'pointer' }}>Pension Document</RSNavLink>
                                                </NavItem>
                                            </Nav>
                                            <div className="col-12 col-md-3 text-md-end mb-2 mb-md-0">
                                                <NavLink to={`/pensioners`} className="btn btn-primary w-100 w-md-auto" style={{ background: "#004080", color: '#fff' }}>Back</NavLink>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardBody className="p-4" style={{ backgroundColor: '#f8f9fa', borderRadius: '10px', minHeight: 500 }}>
                                        <TabContent activeTab={activeTab}>
                                            {/* Bank Tab */}
                                            <TabPane tabId="1">
                                                <div className="d-flex justify-content-between align-items-center mb-3">
                                                    <h5>Bank Accounts</h5>
                                                    {
                                                       currentRoles.some(role => ['IT Admin', "Pensioners Operator"].includes(role)) && (
                                                            <Button color="primary" size="sm" onClick={handleCreateBank}><AddIcon fontSize="small" /> Add</Button>
                                                        )
                                                    }
                                                </div>
                                                <div className="table-responsive">
                                                    <Table striped bordered hover responsive>
                                                        <thead><tr><th>Bank Name</th><th>Branch Name</th><th>Account</th><th>IFSC</th><th>Status</th><th>Actions</th></tr></thead>
                                                        <tbody>
                                                            {data.bank_account?.length > 0 ? data.bank_account.map(bank => (
                                                                <tr key={bank.id}>
                                                                    <td>{bank.bank_name}</td>
                                                                    <td>{bank.branch_name}</td>
                                                                    <td>{bank.account_no}</td>
                                                                    <td>{bank.ifsc_code}</td>
                                                                    <td><span className={bank.is_active ? "badge bg-success text-white" : "badge bg-danger text-white"} style={{ cursor: 'pointer' }} onClick={() => handleToggleStatus(bank)}>{bank.is_active ? "Active" : "Inactive"}</span></td>
                                                                    <td>
                                                                        {
                                                                          currentRoles.some(role => ['IT Admin', "Pensioners Operator"].includes(role))  && (
                                                                                <Button color="link" size="sm" onClick={() => handleUpdateBank(bank)}><EditIcon fontSize="small" /></Button>
                                                                            )
                                                                        }
                                                                        <Button color="link" size="sm" onClick={() => handleHistoryBank(bank.id)}><HistoryIcon fontSize="small" /></Button>
                                                                    </td>
                                                                </tr>
                                                            )) : (<tr><td align="center" colSpan={6}>No bank data found</td></tr>)}
                                                        </tbody>
                                                    </Table>
                                                </div>
                                            </TabPane>

                                            {/* Pension Details Tab */}
                                            <TabPane tabId="2">
                                                <div className="d-flex justify-content-between align-items-center mb-3">
                                                    <h5>Pension Details</h5>
                                                    {
                                                       currentRoles.some(role => ['IT Admin', "Pensioners Operator"].includes(role)) && (
                                                            <Button color="primary" size="sm" onClick={handleCreatePensionInfo}><AddIcon fontSize="small" /> Add</Button>
                                                        )
                                                    }
                                                </div>
                                                <div className="table-responsive">
                                                    <Table striped bordered hover responsive>
                                                        <thead>
                                                            <tr>
                                                                <th>Basic Pension</th>
                                                                <th>Commutation Amount</th>
                                                                <th>Additional Pension</th>
                                                                <th>Medical Allowance</th>
                                                                <th>Status</th>
                                                                <th>Effective From</th>
                                                                <th>Effective Till</th>
                                                                <th>Actions</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {data.pension_related_info ? data.pension_related_info.map(info => (
                                                                <tr key={info.id}>
                                                                    <td>{info.basic_pension}</td>
                                                                    <td>{info.commutation_amount}</td>
                                                                    <td>{info.additional_pension}</td>
                                                                    <td>{info.medical_allowance}</td>
                                                                    <td><span className={info.is_active ? "badge bg-success text-white" : "badge bg-danger text-white"} style={{ cursor: 'pointer' }}>{info.is_active ? 'Active' : 'Inactive'}</span></td>
                                                                    <td>{dateFormat(info.effective_from)}</td>
                                                                    <td>{dateFormat(info.effective_till) || 'N/A'}</td>
                                                                    <td>
                                                                        {
                                                                           currentRoles.some(role => ['IT Admin', "Pensioners Operator"].includes(role)) && (
                                                                                <>
                                                                                    <Button color="link" size="sm" onClick={() => handleUpdatePensionInfo(info)}><EditIcon fontSize="small" /></Button>

                                                                                </>
                                                                            )

                                                                        }
                                                                        <Button color="link" size="sm" onClick={() => handleHistoryPensionInfo(info.id)}><HistoryIcon fontSize="small" /></Button>
                                                                    </td>
                                                                </tr>
                                                            )) : (<tr><td align="center" colSpan={9}>No pension information found</td></tr>)}
                                                        </tbody>
                                                    </Table>
                                                </div>
                                            </TabPane>

                                            {/* Document Details Tab */}
                                            <TabPane tabId="3">
                                                <div className="d-flex justify-content-between align-items-center mb-3">
                                                    <h5>Document Details</h5>
                                                    {
                                                       currentRoles.some(role => ['IT Admin', "Pensioners Operator"].includes(role)) && (
                                                            <Button color="primary" size="sm" onClick={handleCreateDocument}><AddIcon fontSize="small" /> Add</Button>
                                                        )
                                                    }

                                                </div>
                                                <div className="table-responsive">
                                                    <Table striped bordered hover responsive>
                                                        <thead><tr><th>Document Type</th><th>Document Number</th><th>Issue Date</th><th>Expiry Date</th><th>File</th><th>Actions</th></tr></thead>
                                                        <tbody>
                                                            {data?.document ? [data?.document].map(doc => (
                                                                <tr key={doc.id}>
                                                                    <td>{doc.document_type}</td>
                                                                    <td>{doc.document_number}</td>
                                                                    <td>{dateFormat(doc.issue_date)}</td>
                                                                    <td>{dateFormat(doc.expiry_date)}</td>
                                                                    <td>{
                                                                        doc?.file_path
                                                                            ? (
                                                                                <a
                                                                                    href={`${process.env.REACT_APP_IMAGE_FILAPI}/${doc.file_path}`}
                                                                                    target="_blank"
                                                                                    rel="noopener noreferrer"
                                                                                >
                                                                                    View Document
                                                                                </a>
                                                                            )
                                                                            : '—'
                                                                    }</td>
                                                                    <td>
                                                                        {
                                                                          currentRoles.some(role => ['IT Admin', "Pensioners Operator"].includes()) && (
                                                                                <>
                                                                                    <Button color="link" size="sm" onClick={() => handleUpdateDocument(doc)}><EditIcon fontSize="small" /></Button>

                                                                                </>
                                                                            )
                                                                        }
                                                                        <Button color="link" size="sm" onClick={() => handleHistoryDocument(doc.id)}><HistoryIcon fontSize="small" /></Button>
                                                                    </td>
                                                                </tr>
                                                            )) : (<tr><td align="center" colSpan={6}>No pension documents found</td></tr>)}
                                                        </tbody>
                                                    </Table>
                                                </div>
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
            {isBankModalOpen && (
                <BankFormModal
                    isOpen={isBankModalOpen}
                    toggle={toggleBankModal}
                    modalType={modalType}
                    selectedBank={selectedBank}
                    handleSave={handleSaveBank}
                />
            )}

            {isPensionInfoModalOpen && (
                <PensionerInfoModal
                    isOpen={isPensionInfoModalOpen}
                    toggle={togglePensionInfoModal}
                    modalType={modalType}
                    selectedInfo={selectedPensionInfo}
                    handleSave={handleSavePensionInfo}
                />
            )}


            {isPensionDocumentOpen && (
                <PensionDocumentModal
                    isOpen={isPensionDocumentOpen}
                    toggle={toggleDocumentModal}
                    modalType={modalType}
                    selectedDocument={selectedPensionDocument}
                    handleSave={handleSaveDocument}
                />
            )}

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
