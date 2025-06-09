import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  IconButton, TablePagination, Box,
  Chip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import {
  Button,
  Card,
  CardHeader,
  CardBody
} from "reactstrap";
import CircularProgress from '@mui/material/CircularProgress';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
  fetchPensionDocument,
  createPensionDocument,
  updatePensionDocument,
  fetchPensionDocumentShow,
} from '../../redux/slices/pensionDocumentSlice';
import PensionDocumentModal from '../../Modal/PensionDocumentModal';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';
import HistoryIcon from '@mui/icons-material/History';
import HistoryModal from 'Modal/HistoryModal';
import { GetApp } from '@mui/icons-material';
import { BASE_URL } from 'utils/helpers';



export default function PensionDocuments() {
  const dispatch = useDispatch();
  const { document, loading } = useSelector((state) => state.pensionDocument);
  const totalCount = useSelector((state) => state.pensionDocument.totalCount) || 0;
  const { error } = useSelector((state) => state.pensionDocument)
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState('create');
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    pensioner_id: '',
    document_type: '',
    document_number: '',
    issue_date: '',
    expiry_date: '',
    file: ''
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [menuRowId, setMenuRowId] = useState(null);
  const navigate = useNavigate();
  const { name } = useSelector((state) => state.auth.user.role);
  const [ renderFunction, setRenderFunction ] = useState(() => null);
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
      
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const toggleHistoryModal = () => {
    setIsHistoryModalOpen(!isHistoryModalOpen);
    if (isHistoryModalOpen) setHistoryRecord([]);
    handleClose();
  }
    

  const getTableConfig = (type) => {
    switch (type) {
    case "document":
      return {
        head: [
          "Sr. No.",
          "Document Type",
          "Document Number",
          "Issue Date",
          "Expiry Date",
          "File",
          "Added By",
          "Edited By"
        ],
        renderRow: (record, index) => (
          <tr key={index}>
            <td>{index + 1}</td>
            <td>{record?.document_type ?? "NA"}</td>
            <td>{record?.document_number || "NA"}</td>
            <td>{record?.issue_date || "NA"}</td>
            <td>{record?.expiry_date || "NA"}</td>
            <td>
              {record?.file_path ? (
                <a
                  href={`${BASE_URL}/${record.file_path}`}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: "none" }}
                >
                  <Chip
                    icon={<GetApp />}
                    color="primary"
                    label="Download"
                    style={{ cursor: "pointer" }}
                  />
                </a>
              ) : (
                <Chip label="No File" color="default" />
              )}
            </td>
            <td>{record?.added_by?.name || "NA"}</td>
            <td>{record?.edited_by?.name || "NA"}</td>
          </tr>
        ),
      };
  
      // You can add more like designation, pay scale, etc.
      default:
        return null;
    }
  };
  
  useEffect(() => {
    dispatch(fetchPensionDocument());
  }, [dispatch]);
  
  const handleHistoryStatus = (id) => {
      handleClose();
      dispatch(fetchPensionDocumentShow(id)).then((res) => {
        const history = res.payload?.history || [];
        if (Array.isArray(history)) {
          const config = getTableConfig("document");
          setHistoryRecord(history);
          setTableHead(config.head);
          setRenderFunction(() => config.renderRow);
          toggleHistoryModal();
        }else {
        setHistoryRecord([]);
      } 
      });
    };

  const handlePageChange = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };


  const handleClose = () => {
    setMenuAnchorEl(null);
    setMenuRowId(null);
  };

  const toggleModal = (mode) => {
    if (mode === 'create') {
      setFormData({
        pensioner_id: '',
        document_type: '',
        document_number: '',
        issue_date: '',
        expiry_date: '',
        file: ''
      });
      setFormMode('create');
    }
    setFormOpen(!formOpen);
  };

  const handleEdit = (row) => {
    setEditId(row.id);
    setFormMode('edit');
    setFormData({
      pensioner_id: row.pensioner_id,
      document_type: row.document_type,
      document_number: row.document_number,
      issue_date: row.issue_date,
      expiry_date: row.expiry_date,
      file: row.file
    });
    setFormOpen(true);
    handleClose();
  };

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    if (formMode === 'edit') {
      dispatch(updatePensionDocument({ id: editId, values: values }))
        .unwrap()
        .then(() => {
          toast.success("PensionDeduction updated successfully");
          dispatch(fetchPensionDocument());
        })
        .catch((err) => {
          const apiMsg =
            err?.response?.data?.message ||
            err?.message ||
            'Failed to save pensioner.';
          toast.error(apiMsg);
        });
    } else {
      dispatch(createPensionDocument(values))
        .unwrap()
        .then(() => {
          toast.success("PensionDeduction added");
          dispatch(fetchPensionDocument());
        })
        .catch((err) => {
          const apiMsg =
            err?.response?.data?.message ||
            err?.message ||
            'Failed to save pensioner.';
          toast.error(apiMsg);
        });
    }
    resetForm();
    setFormOpen(false);
    setEditId(null);
    setSubmitting(false);
  };

  const handleMenuClick = (event, id) => {
    setMenuAnchorEl(event.currentTarget);
    setMenuRowId(id);
  };

  const handleView = (id) => {
    handleClose();
    navigate(`/pension-documents/view/${id}`);
  };


  return (
    <>
      <div className='header bg-gradient-info pb-8 pt-8 pt-md-8 main-head'></div>
      <div className="mt--7 mb-7 container-fluid">
        <Card className="card-stats mb-4 mb-lg-0">
          <CardHeader>
            <div className="d-flex justify-content-end align-items-center">
              <Button style={{ background: "#004080", color: "#fff" }} onClick={() => toggleModal("create")}>
                + Add
              </Button>
            </div>
          </CardHeader>
          <CardBody>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <CircularProgress />
              </Box>
            ) : (
              <TableContainer component={Paper} style={{ boxShadow: "none" }}>
                <Table>
                  <TableHead>
                    <TableRow>                   
                      <TableCell style={{ fontWeight: "900" }}>Document Type</TableCell>
                      <TableCell style={{ fontWeight: "900" }}>Document Number</TableCell>
                      <TableCell style={{ fontWeight: "900" }}>Issue Date</TableCell>
                      <TableCell style={{ fontWeight: "900" }}>Expiry Date</TableCell>
                      <TableCell style={{ fontWeight: "900" }}>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {document.map((row, idx) => (
                      <TableRow key={row.id}>                       
                        <TableCell>{row.document_type}</TableCell>
                        <TableCell>{row.document_number}</TableCell>
                        <TableCell>{row.issue_date}</TableCell>
                        <TableCell>{row.expiry_date}</TableCell>
                        <TableCell align="left">
                          <IconButton onClick={(e) => handleMenuClick(e, row.id)}>
                            <MoreVertIcon />
                          </IconButton>
                          <Menu
                            anchorEl={menuAnchorEl}
                            open={menuRowId === row.id}
                            onClose={handleClose}
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                          >
                            <MenuItem onClick={() => { handleEdit(row); handleClose(); }}>
                              <EditIcon fontSize="small" sx={{ mr: 1 }} /> Edit
                            </MenuItem>
                            <MenuItem onClick={() => handleView(row.id)}>
                              <VisibilityIcon fontSize="small" sx={{ mr: 1 }} /> View
                            </MenuItem>
                            <MenuItem onClick={() => handleHistoryStatus(row.id)}>
                              <HistoryIcon fontSize="small" color='warning' sx={{ mr: 1 }}/> History
                            </MenuItem>
                          </Menu>
                        </TableCell>
                      </TableRow>
                    ))}
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
              </TableContainer>
            )}
          </CardBody>
        </Card>
        <PensionDocumentModal
          setFormOpen={setFormOpen}
          formOpen={formOpen}
          toggleModal={toggleModal}
          formMode={formMode}
          formData={formData}
          handleChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
          handleSubmit={handleSubmit}
        />

        <HistoryModal
          isOpen={isHistoryModalOpen}
          toggle={toggleHistoryModal}
          tableHead={tableHead}
          historyRecord={historyRecord}
          renderRow={renderFunction}
        />
      </div>
    </>
  );
}
