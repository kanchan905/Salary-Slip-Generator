import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  IconButton, TextField, TablePagination, Box
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
  fetchPensionDeduction,
  createPensionDeduction,
  updatePensionDeduction,
  fetchPensionDeductionShow,
} from '../../redux/slices/pensionDeductionSlice';
import PensionDeductionModal from '../../Modal/PensionDeductionModal';
import HistoryIcon from '@mui/icons-material/History';
import HistoryModal from 'Modal/HistoryModal';



export default function PensionDeduction() {
  const dispatch = useDispatch();
  const { pension, showPension, loading } = useSelector((state) => state.pensionDeduction);
  const totalCount = useSelector((state)=> state.pensionDeduction.totalCount) || 0;
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuIndex, setMenuIndex] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState('create');
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    pension_id: '',
    deduction_type: '',
    amount: '',
    description: ''
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
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
  const toggleHistoryModal = () => setIsHistoryModalOpen(!isHistoryModalOpen);
  const [shouldOpenHistory, setShouldOpenHistory] = useState(false);
  
  const getTableConfig = (type) => {
    switch (type) {
      case "bank":
        return {
        head: [
          "Sr. No.",
          "Pension Name",
          "PPO No.",
          "Commutation Amount",
          "Income Tax",
          "Recovery",
          "Amount",  
          "Net Amount",
          "Other",
          "Description",
          "Added By",
          "Edited By"
        ],
        renderRow: (record, index) => (
          <tr key={index}>
            <td>{index + 1}</td>
            <td>{record?.net_pension?.pensioner?.name ?? "NA"}</td>
            <td>{record?.net_pension?.pensioner?.ppo_no ?? "NA"}</td>
            <td>{record.commutation_amount ?? "NA"}</td>
            <td>{record.income_tax || "NA"}</td>
            <td>{record.recovery || "NA"}</td>
            <td>{record.amount || "NA"}</td>
            <td>{record.net_pension?.net_pension || "NA"}</td>
            <td>{record.other || "NA"}</td>
            <td>{record.description || "NA"}</td>
            <td>{record.added_by?.name}</td>
            <td>{record.edited_by?.name || "NA"}</td>
          </tr>
        ),
      };
    
      // You can add more like designation, pay scale, etc.
      default:
        return { head: [], renderRow: () => null };
    }
  };
  
  const handleHistoryStatus = (id) => {
    setShouldOpenHistory(true); // only allow opening if this was user-triggered
    dispatch(fetchPensionDeductionShow(id));
  };

  useEffect(() => {
    if (shouldOpenHistory && showPension?.history) {
      const config = getTableConfig("bank");
      setHistoryRecord(showPension.history);
      setTableHead(config.head);
      setRenderFunction(() => config.renderRow);
      setIsHistoryModalOpen(true);
      setShouldOpenHistory(false); // reset the flag
    }
  }, [showPension, shouldOpenHistory]);


  useEffect(() => {
    dispatch(fetchPensionDeduction());
  }, [dispatch]);

  // const filteredData = pension.filter((item) =>
  //    item.deduction_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //    item.pension_id.toLowerCase().includes(searchQuery.toLowerCase())
  // );

  // const paginatedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPage(0);
  };

  const handlePageChange = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };


  const handleClose = () => {
    setAnchorEl(null);
    setMenuIndex(null);
  };

  const toggleModal = (mode) => {
    if (mode === 'create') {
      setFormData({
        pension_id: '',
        deduction_type: '',
        amount: '',
        description: ''
      });
      setFormMode('create');
    }
    setFormOpen(!formOpen);
  };

  const handleEdit = (row) => {
    console.log("handleEdit: ",row);
    setEditId(row.id);
    setFormMode('edit');
    setFormData({
      net_pension_id: row.net_pension_id,
      income_tax: row.income_tax,
      recovery: row.recovery,
      amount: row.amount,
      description:row.description,
      other: row.other
    });
    setFormOpen(true);
    handleClose();
  };

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    if (formMode === 'edit') {
      dispatch(updatePensionDeduction({ id: editId, values: values }))
        .unwrap()
        .then(() => {
          toast.success("PensionDeduction updated successfully");
          dispatch(fetchPensionDeduction());
        })
        .catch((err) => {
          const apiMsg =
            err?.response?.data?.message ||
            err?.message ||
            'Failed to save pensioner.';
          toast.error(apiMsg);
        });
    } else {
      dispatch(createPensionDeduction(values))
        .unwrap()
        .then(() => {
          toast.success("PensionDeduction added");
          dispatch(fetchPensionDeduction());
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

  return (
    <>
      <div className='header bg-gradient-info pb-8 pt-8 pt-md-8 main-head'></div>
      <div className="mt--7 mb-7 container-fluid">
        <Card className="card-stats mb-4 mb-lg-0">
          <CardHeader>
            <div className="d-flex justify-content-between align-items-center">
              <TextField placeholder="Id & Type" onChange={handleSearchChange} />
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
                      <TableCell>Sr. No.</TableCell>
                      <TableCell>Pensioner Name</TableCell>
                      <TableCell>PPO No.</TableCell>
                      <TableCell>Commutation Amount</TableCell>
                      <TableCell>Income Tax</TableCell>
                      <TableCell>Recovery</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Net Amount</TableCell>
                      <TableCell>Other</TableCell>
                      <TableCell>Add By</TableCell>
                      <TableCell>Edit By</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pension.map((row, idx) => (
                      <TableRow key={row.id}>
                        <TableCell>{idx + 1}</TableCell>
                        <TableCell>{row.net_pension?.pensioner?.name}</TableCell>
                        <TableCell>{row.net_pension?.pensioner?.ppo_no}</TableCell>
                        <TableCell>{row.commutation_amount ?? "NA"}</TableCell>
                        <TableCell>{row.income_tax ?? "NA"}</TableCell>
                        <TableCell>{row.recovery ?? "NA"}</TableCell>
                        <TableCell>{row.amount ?? "NA" }</TableCell>
                        <TableCell>{row.net_pension?.net_pension ?? "NA" }</TableCell>
                        <TableCell>{row.other ?? "NA" }</TableCell>
                        <TableCell>{row.added_by?.name ?? "NA"}</TableCell>
                        <TableCell>{row.edited_by?.name ?? "NA"}</TableCell>
                        <TableCell align="left">
                          <IconButton title='Edit' onClick={() => handleEdit(row)}>
                            <EditIcon fontSize="small" color='primary'/>
                          </IconButton>
                          <IconButton title='History View' onClick={() => handleHistoryStatus(row.id)}>
                            <HistoryIcon fontSize="small" color='warning'/>
                          </IconButton>
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
        <PensionDeductionModal
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
