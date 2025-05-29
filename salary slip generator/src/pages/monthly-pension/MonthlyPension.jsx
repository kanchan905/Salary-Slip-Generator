import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  TextField, TablePagination, Box,
  IconButton
} from '@mui/material';
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
  monthlyPensionDetails,
  createMonthlyPension,
  monthlyPensionDetailShow,
} from '../../redux/slices/monthlyPensionSlice';
import MonthlyPensionModal from '../../Modal/MonthlyPension';
import HistoryIcon from '@mui/icons-material/History';
import HistoryModal from 'Modal/HistoryModal';



export default function MonthlyPension() {
  const dispatch = useDispatch();
  const { monthlyPension, showMonthyPension, loading } = useSelector((state) => state.monthlypension);
  const totalCount = useSelector((state) => state.monthlypension.totalCount) || 0;
  const { error } = useSelector((state) => state.monthlypension)
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    pensioner_id: '',
    month: '',
    basic_pension: '',
    commutation_amount: '',
    additional_pension: '',
    dr_id:'',
    dr_amount: '',
    medical_allowance: '',
    status:'',
    remarks: '',
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
            "Pensioner Name",
            "PPO No.",
            "Basic Pension",
            "Additional Pension",
            "Net Pension",
            "DR %",
            "DR Amount",
            "Medical Allowance",
            "Total Arrear",
            "Total Pension",
            "Remarks",
            "Status",
            "Added By",
            "Edited By"
          ],
          renderRow: (record, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{record?.net_pension?.pensioner?.name ?? "NA"}</td>
              <td>{record?.net_pension?.pensioner?.ppo_no ?? "NA"}</td>
              <td>{record.basic_pension ?? "NA"}</td>
              <td>{record.additional_pension ?? "NA"}</td>
              <td>{record.net_pension?.net_pension ?? "NA"}</td>
              <td>{record?.dearness?.dr_percentage ?? "NA"}</td>
              <td>{record?.dr_amount ?? "NA"}</td>
              <td>{record?.medical_allowance || "NA"}</td>
              <td>{record?.total_arrear || "NA"}</td>
              <td>{record?.total_pension || "NA"}</td>
              <td>{record?.remarks || "NA"}</td>
              <td>{record?.status || "NA"}</td>
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
    setShouldOpenHistory(true);
    dispatch(monthlyPensionDetailShow(id));
  };
    
  useEffect(() => {
    if (shouldOpenHistory && showMonthyPension?.history) {
      const config = getTableConfig("bank");
      setHistoryRecord(showMonthyPension.history);
      setTableHead(config.head);
      setRenderFunction(() => config.renderRow);
      setIsHistoryModalOpen(true);
      setShouldOpenHistory(false);
    }
  }, [showMonthyPension, shouldOpenHistory]);


  useEffect(() => {
    dispatch(monthlyPensionDetails());
  }, [dispatch]);

  // const filteredData = monthlyPension.filter((item) =>
  //   item.pensioner?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //   item.pensioner_id.toLowerCase().includes(searchQuery.toLowerCase())
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


  const toggleModal = () => {
    setFormOpen(!formOpen);
  };


  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    console.log(values)
    dispatch(createMonthlyPension(values))
      .unwrap()
      .then(() => {
        toast.success("Monthly Pension added");
        dispatch(monthlyPensionDetails());
      })
      .catch((err) => {
        const apiMsg =
          err?.response?.data?.message ||
          err?.message ||
          'Failed to save Monthly Pension.';
        toast.error(apiMsg);
      });
    resetForm();
    setFormOpen(false);
    setSubmitting(false);
  };

  return (
    <>
      <div className='header bg-gradient-info pb-8 pt-8 pt-md-8 main-head'></div>
      <div className="mt--7 mb-7 container-fluid">
        <Card className="card-stats mb-4 mb-lg-0">
          <CardHeader>
            <div className="d-flex justify-content-between align-items-center">
              <TextField placeholder="Pensioner id & name" onChange={handleSearchChange} />
              <Button style={{ background: "#004080", color: "#fff" }} onClick={() => toggleModal()}>
                + Add
              </Button>
            </div>
          </CardHeader>
          <CardBody>
            <div style={{ width: '100%', overflowX: 'auto' }} className="custom-scrollbar">
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <CircularProgress />
                </Box>
              ) : (
                <TableContainer component={Paper} style={{ boxShadow: "none", minWidth: 2000 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Sr.No.</TableCell>
                        <TableCell>Pensioner Name</TableCell>
                        <TableCell>PPO No.</TableCell>
                        <TableCell>Basic Pension</TableCell>
                        <TableCell>Commutation Amount</TableCell>
                        <TableCell>Additional Pension</TableCell>
                        <TableCell>Net Pension</TableCell>
                        <TableCell>DR %</TableCell>
                        <TableCell>DR Amount</TableCell>
                        <TableCell>Medical Allowance</TableCell>
                        <TableCell>Total Arrear</TableCell>
                        <TableCell>Total Pension</TableCell>
                        <TableCell>Remarks</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Action </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {monthlyPension && monthlyPension.length > 0 ? (
                        monthlyPension.map((row, idx) => (
                          <TableRow key={row.id}>
                            <TableCell>{idx + 1}</TableCell>
                            <TableCell>{row?.net_pension?.pensioner?.name ?? "NA"}</TableCell>
                            <TableCell>{row?.net_pension?.pensioner?.ppo_no ?? "NA"}</TableCell>
                            <TableCell>{row.basic_pension ?? "NA"}</TableCell>
                            <TableCell>{row.commutation_amount ?? "NA"}</TableCell>
                            <TableCell>{row.additional_pension ?? "NA"}</TableCell>
                            <TableCell>{row.net_pension?.net_pension ?? "NA"}</TableCell>
                            <TableCell>{row.dearness?.dr_percentage ?? "NA"}</TableCell>
                            <TableCell>{row.dr_amount ?? "NA"}</TableCell>
                            <TableCell>{row.medical_allowance ?? "NA"}</TableCell>
                            <TableCell>{row.total_arrear ?? "NA"}</TableCell>
                            <TableCell>{row.total_pension ?? "NA"}</TableCell>
                            <TableCell>{row.remarks ?? "NA"}</TableCell>
                            <TableCell>{row.status ?? "NA"}</TableCell>
                            <TableCell>
                              <IconButton title='History' onClick={() => handleHistoryStatus(row.id)}>
                                <HistoryIcon fontSize="small" color="warning" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={15} align="center">
                            No data available
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>

                  </Table>
                </TableContainer>
              )}
            </div>
            <TablePagination
              component="div"
              count={totalCount}
              page={page}
              onPageChange={handlePageChange}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </CardBody>
        </Card>
        <MonthlyPensionModal
          setFormOpen={setFormOpen}
          formOpen={formOpen}
          toggleModal={toggleModal}
          formData={formData}
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
