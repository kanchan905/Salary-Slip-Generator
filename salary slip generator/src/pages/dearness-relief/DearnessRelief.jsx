import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  IconButton, Menu, MenuItem, TablePagination, Box
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import HistoryIcon from '@mui/icons-material/History';
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
  fetchDearnessRelief,
  createDearnessRelief,
  updateDearnessRelief,
  fetchDearnessReliefShow,
} from '../../redux/slices/dearnessRelief';
import DearnessReliefModal from '../../Modal/DearnessRelief';
import ViewIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';
import HistoryModal from 'Modal/HistoryModal';



export default function DearnessRelief() {
  const dispatch = useDispatch();
  const { dearness, loading } = useSelector((state) => state.dearnessRelief);
  const totalCount = useSelector((state) => state.dearnessRelief.totalCount) || 0;
  const { error } = useSelector((state) => state.dearnessRelief)
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState('create');
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    effective_from: '',
    effective_to: '',
    dr_percentage: '',
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuReliefId, setMenuReliefId] = useState(null);
  const { name } = useSelector((state) => state.auth.user.role);
  const navigate = useNavigate();
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
    handleMenuClose();
  }

  
  const getTableConfig = (type) => {
    switch (type) {
    case "dear":
      return {
        head: [
          "Sr. No.",
          "Dearness Relief %",
          "Effective From",
          "Effective To",
          "Added By",
          "Edited By"
        ],
        renderRow: (record, index) => (
          <tr key={index}>
            <td>{index + 1}</td>
            <td>{record?.dr_percentage ?? "NA"}</td>
            <td>{record?.effective_from || "NA"}</td>
            <td>{record?.effective_to || "NA"}</td>
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

  const handleHistoryStatus = (id) => {
      handleMenuClose();
      dispatch(fetchDearnessReliefShow(id)).then((res) => {
        const history = res.payload?.history || [];
        if (Array.isArray(history)) {
          const config = getTableConfig("dear");
          setHistoryRecord(history);
          setTableHead(config.head);
          setRenderFunction(() => config.renderRow);
          toggleHistoryModal();
        }else {
        setHistoryRecord([]);
      } 
      });
    };


  useEffect(() => {
    dispatch(fetchDearnessRelief());
  }, [dispatch]);

  const handlePageChange = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };


  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuReliefId(null);
  };

  const toggleModal = (mode) => {
    if (mode === 'create') {
      setFormData({
        effective_from: '',
        effective_to: '',
        dr_percentage: '',
      });
      setFormMode('create');
    }
    setFormOpen(!formOpen);
  };

  const handleEdit = (row) => {
    setEditId(row.id);
    setFormMode('edit');
    setFormData({
      effective_from: row.effective_from,
      effective_to: row.effective_to,
      dr_percentage: row.dr_percentage,
    });
    setFormOpen(true);
    handleMenuClose();
  };

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    console.log(values)
    if (formMode === 'edit') {
      dispatch(updateDearnessRelief({ id: editId, values: values }))
        .unwrap()
        .then(() => {
          toast.success("DearnessRelief updated successfully");
          dispatch(fetchDearnessRelief());
        })
        .catch((err) => {
          const apiMsg =
            err?.response?.data?.message ||
            err?.message ||
            'Failed to save pensioner.';
          toast.error(apiMsg);
        });
    } else {
      dispatch(createDearnessRelief(values))
        .unwrap()
        .then(() => {
          toast.success("DearnessRelief added");
          dispatch(fetchDearnessRelief());
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
    setAnchorEl(event.currentTarget);
    setMenuReliefId(id);
  };

  const handleView = (id) => {
    handleMenuClose();
    navigate(`/${name.toLowerCase()}/pensioner/dearness-relief/view/${id}`);
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
                      <TableCell style={{ fontWeight: "900" }}>Sr. No.</TableCell>
                      <TableCell style={{ fontWeight: "900" }}>Dearness Relief %</TableCell>
                      <TableCell style={{ fontWeight: "900" }}>Effective From</TableCell>
                      <TableCell style={{ fontWeight: "900" }}>Effective To</TableCell>
                      <TableCell style={{ fontWeight: "900" }}>Dr Percentage</TableCell>
                      <TableCell style={{ fontWeight: "900" }}>Added By</TableCell>
                      <TableCell style={{ fontWeight: "900" }}>Edited By</TableCell>
                      <TableCell style={{ fontWeight: "900" }}>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dearness.map((row, idx) => (
                      <TableRow key={row.id}>
                        <TableCell>{idx + 1}</TableCell>
                        <TableCell>{row.dr_percentage ?? "NA"}</TableCell>
                        <TableCell>{row.effective_from || "NA"}</TableCell>
                        <TableCell>{row.effective_to || "NA"}</TableCell>
                        <TableCell>{row.dr_percentage ?? "NA"}</TableCell>
                        <TableCell>{row.added_by?.name || "NA"}</TableCell>
                        <TableCell>{row.edited_by?.name || "NA"}</TableCell>
                        <TableCell align="left">
                          <IconButton onClick={(e) => handleMenuClick(e, row.id)}>
                            <MoreVertIcon />
                          </IconButton>
                          <Menu
                            anchorEl={anchorEl}
                            open={menuReliefId === row.id}
                            onClose={handleMenuClose}
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                          >
                            <MenuItem onClick={() => handleView(row.id)}>
                              <ViewIcon fontSize="small" /> View
                            </MenuItem>
                            <MenuItem onClick={() => handleEdit(row)}>
                              <EditIcon fontSize="small" /> Edit
                            </MenuItem>
                            <MenuItem onClick={() => handleHistoryStatus(row.id)}>
                              <HistoryIcon fontSize="small"/> History
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
        <DearnessReliefModal
          setFormOpen={setFormOpen}
          formOpen={formOpen}
          toggleModal={toggleModal}
          formMode={formMode}
          formData={formData}
          handleChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
          handleSubmit={handleSubmit}
          dearness = {dearness}
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
