import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
} from "reactstrap";
import { Button } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  addLevelToAPI,
  fetchPayLevel,
  fetchPayLevelByCommission,
  updateLevelToAPI
} from "../../redux/slices/levelSlice";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import LevelFormModal from "Modal/LevelFormModal";
import { Box, CircularProgress } from "@mui/material";

function Commission({selectedCommissionId, commissionName}) {

  const dispatch = useDispatch();
  const { commissionLevels, loading } = useSelector((state) => state.levels);
  const [editingId, setEditingId] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [formOpen, setFormOpen] = useState(false);

  const toggleModal = () => {
    setFormOpen(!formOpen);
  };

  useEffect(() => {
    dispatch(fetchPayLevelByCommission(selectedCommissionId))
  }, [selectedCommissionId]);

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
      if (editingId) {
        const response = await dispatch(updateLevelToAPI({ id: editingId, ...values }));
        if (response.payload?.successMsg) {
          toast.success(response.payload.successMsg);
          dispatch(fetchPayLevel({ page: page + 1, limit: rowsPerPage }));
          setEditingId(null);
          resetForm();
          setFormOpen(false); // Close modal
        } else {
          toast.error(response.payload?.message || "Failed to update level.");
        }
      } else {
        const response = await dispatch(addLevelToAPI(values));
        if (response.payload?.successMsg) {
          toast.success(response.payload.successMsg);
          resetForm();
          setFormOpen(false); // Close modal
        } else {
          toast.error(response.payload?.message || "Failed to add level.");
        }
        dispatch(fetchPayLevel({ page: page + 1, limit: rowsPerPage }));
      }
    }
  });

  const handleEditLevel = (level) => {
    setEditingId(level.id);
    formik.setValues({
      pay_commission_id: selectedCommissionId,
      levelName: level.name,
      description: level.description
    });
    setFormOpen(true);
  };

  console.log("Selected Commission ID:", selectedCommissionId);
  return (
    <>
      {/* <Typography variant="h6" mb={2}>Pay Matrix Levels</Typography> */}
      <Row>
        <Button style={{ background: "#004080", color: "#fff", marginBottom: "1em" }} onClick={() => {
          setEditingId(null);
          formik.resetForm();
          toggleModal();
        }}>
          + Add Level
        </Button>

        <Col md={12}>
          <div className="container">
            {!selectedCommissionId ? (
              <p className="text-center text-muted">Please select a commission to view levels.</p>
            ) : loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <CircularProgress />
              </Box>
            ) : (
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover mb-0 align-middle text-center">
                    <thead>
                      <tr className="text-uppercase small text-muted">
                        <td style={{ fontWeight: "bold", color: "#000" }}>Level</td>
                        {commissionLevels.map((level) => (
                          <td key={level.id} style={{ fontWeight: "bold", color: "#000" }}>
                            {level.name}
                          </td>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {commissionLevels.length === 0 ? (
                        <tr>
                          <td colSpan="100%" className="text-center text-muted py-3">
                            No levels found for the selected commission.
                          </td>
                        </tr>
                      ) : (
                        (() => {
                          const maxRows = Math.max(
                            ...commissionLevels.map((level) => level.pay_matrix_cell.length)
                          );
                          const rows = [];
                          for (let rowIndex = 0; rowIndex < maxRows - 1; rowIndex++) {
                            rows.push(
                              <tr key={rowIndex}>
                                <td style={{ fontWeight: "bold" }}>{rowIndex + 1}</td>
                                {commissionLevels.map((level) => {
                                  const cell = level.pay_matrix_cell.find(
                                    (c) => c.index === rowIndex + 1
                                  );
                                  return (
                                    <td key={level.id + "-" + rowIndex}>
                                      {cell ? cell.amount : "-"}
                                    </td>
                                  );
                                })}
                              </tr>
                            );
                          }
                          return rows;
                        })()
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
        toggleModal={toggleModal}
        formik={formik}
        editingId={editingId}
        selectedCommissionId={selectedCommissionId}
        commissionName={commissionName}
      />

    </>
  );
}

export default Commission;