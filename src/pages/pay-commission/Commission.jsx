import React, { useState, useEffect } from "react";
import { Row, Col, Button, FormGroup } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  addLevelToAPI,
  fetchPayLevelByCommission,
  updateLevelToAPI
} from "../../redux/slices/levelSlice";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import LevelFormModal from "Modal/LevelFormModal";
import { Box, CircularProgress, IconButton, TextField } from "@mui/material";
import { Cancel, Save } from "@mui/icons-material";
import { updateCellToAPI } from "../../redux/slices/levelCellSlice";
import MatrixCellFormModal from "Modal/MatrixCellFormModal";

function Commission({ selectedCommissionId, commissionName }) {
  const dispatch = useDispatch();
  const { commissionLevels, loading } = useSelector((state) => state.levels);
  const [editingId, setEditingId] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingCell, setEditingCell] = useState({ levelId: null, rowIndex: null });
  const [cellValue, setCellValue] = useState('');
  const [cellData, setCellData] = useState(null);
  const [cellModalOpen, setCellModalOpen] = useState(false);
  const currentRoles = useSelector((state) =>
    state.auth.user?.roles?.map(role => role.name) || []
  );

  const toggleLevelModal = () => {
    setFormOpen(!formOpen);
  };

  const toggleCellModal = () => {
    setCellModalOpen(!cellModalOpen);
  };

  const handleCellAdded = () => {
    if (selectedCommissionId) {
      dispatch(fetchPayLevelByCommission(selectedCommissionId));
    }
  };

  useEffect(() => {
    if (selectedCommissionId) {
      dispatch(fetchPayLevelByCommission(selectedCommissionId));
    }
  }, [dispatch, selectedCommissionId]);

  const formik = useFormik({
    initialValues: {
      pay_commission_id: selectedCommissionId,
      levelName: '',
      description: '',
    },
    validationSchema: Yup.object({
      pay_commission_id: Yup.string().required('Commission ID is required'),
      levelName: Yup.string().required('Level name is required'),
      description: Yup.string().required('Description is required'),
    }),
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      let response;
      if (editingId) {
        response = await dispatch(updateLevelToAPI({ id: editingId, ...values }));
      } else {
        response = await dispatch(addLevelToAPI(values));
      }

      if (response.payload?.successMsg) {
        toast.success(response.payload.successMsg);
        dispatch(fetchPayLevelByCommission(selectedCommissionId));
        resetForm();
        setEditingId(null);
        setFormOpen(false);
      } else {
        toast.error(response.payload?.message || "Operation failed.");
      }
    }
  });



  const handleCellEdit = (levelId, rowIndex, cellData) => {
    setEditingCell({ levelId, rowIndex });
    setCellData(cellData);
    setCellValue(cellData.amount || '');
  };

  const handleCellSave = async () => {
    if (!cellData || !editingCell.levelId) return;

    try {
      await dispatch(updateCellToAPI({
        id: cellData.id,
        index: cellData.index,
        amount: Number(cellValue),
        matrix_level_id: cellData.matrix_level_id
      })).unwrap();

      toast.success("Cell updated successfully!");

      dispatch(fetchPayLevelByCommission(selectedCommissionId));

      handleEditClose();
    } catch (error) {
      toast.error(error.message || "Failed to update cell.");
    }
  };

  const handleEditClose = () => {
    setEditingCell({ levelId: null, rowIndex: null });
    setCellValue('');
    setCellData(null);
  };

  const maxRows = commissionLevels?.length > 0
    ? Math.max(0, ...commissionLevels.flatMap(level => level.pay_matrix_cell.map(c => c.index)))
    : 0;

  const tableRows = [];

  for (let rowIndex = 1; rowIndex <= maxRows; rowIndex++) {
    tableRows.push(
      <tr key={rowIndex}>
        <td style={{ fontWeight: "bold", fontSize: '14px', color: "#000" }}>{rowIndex}</td>
        {commissionLevels.map((level) => {
          const cell = level.pay_matrix_cell.find(c => c.index === rowIndex);
          const isEditing = editingCell.levelId === level.id && editingCell.rowIndex === rowIndex;

          return (
            <>
              <td key={`${level.id}-${rowIndex}`} style={{ cursor: cell ? "pointer" : "default" }}>
                {isEditing ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <TextField
                      type="text"
                      value={cellValue}
                      onChange={(e) => setCellValue(e.target.value)}
                      size="small"
                      style={{ width: '100px', marginRight: '0.5rem' }}
                      autoFocus
                    />
                    {
                     currentRoles.includes('IT Admin') && (
                        <IconButton color="success" size="small" onClick={handleCellSave}>
                          <Save />
                        </IconButton>
                      )}
                    <IconButton color="error" size="small" onClick={handleEditClose}>
                      <Cancel />
                    </IconButton>
                  </div>
                ) : (
                  <span onClick={() => cell && handleCellEdit(level.id, rowIndex, cell)}>
                    {cell ? cell.amount : "-"}
                  </span>
                )}
              </td>
            </>
          );
        })}
      </tr>
    );
  }

  return (
    <>
      {
        currentRoles.some(role => ['IT Admin',"Salary Processing Coordinator (NIOH)", "Salary Processing Coordinator (ROHC)"].includes(role)) && (
          <Row>
            <Col xs="auto">
              <Button color="primary" style={{ background: "#004080", color: "#fff", marginBottom: "1em" }} onClick={() => {
                setEditingId(null);
                formik.resetForm();
                toggleLevelModal();
              }}>
                + Add Level
              </Button>
            </Col>
            <Col xs="auto">
              <Button color="primary" style={{ background: "#004080", color: "#fff", marginBottom: "1em" }} onClick={toggleCellModal}>
                + Add Cell
              </Button>
            </Col>
          </Row>
        )}
      <Row>
        <Col md={12}>
          <div className="container-fluid p-0">
            {!selectedCommissionId ? (
              <p className="text-center text-muted">Please select a commission to view levels.</p>
            ) : loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
                <CircularProgress />
              </Box>
            ) : (
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover mb-0 align-middle text-center">
                    <thead>
                      <tr className="text-uppercase small text-muted">
                        <th style={{ fontWeight: "bold", color: "#000", fontSize: '14px' }}>Level</th>
                        {commissionLevels.map((level) => (
                          <th key={level.id} style={{ fontWeight: "bold", color: "#000", fontSize: '14px' }}>
                            {level.name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {commissionLevels.length === 0 ? (
                        <tr>
                          <td colSpan={commissionLevels.length + 1} className="text-center text-muted py-3">
                            No levels found for the selected commission.
                          </td>
                        </tr>
                      ) : maxRows === 0 ? (
                        <tr>
                          <td colSpan={commissionLevels.length + 1} className="text-center text-muted py-3">
                            No cells found for these levels.
                          </td>
                        </tr>
                      ) : (
                        tableRows
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </Col>
      </Row>

      <LevelFormModal
        formOpen={formOpen}
        toggleModal={toggleLevelModal}
        formik={formik}
        editingId={editingId}
        selectedCommissionId={selectedCommissionId}
        commissionName={commissionName}
      />

      <MatrixCellFormModal
        formOpen={cellModalOpen}
        toggleModal={toggleCellModal}
        commissionLevels={commissionLevels}
        onSuccess={handleCellAdded} // Pass the refresh handler to the modal
      />
    </>
  );
}

export default Commission;