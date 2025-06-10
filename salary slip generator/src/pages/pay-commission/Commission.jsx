import React, { useState, useEffect } from "react";
import {
  FormGroup,
  Form,
  Input,
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
import { TablePagination } from "@mui/material";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";

function Commission(selectedCommissionId) {

  const dispatch = useDispatch();
  const { levels, totalCount, commissionLevels, loading, error } = useSelector((state) => state.levels);
  const [editingId, setEditingId] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  



  useEffect(() => {
    // dispatch(fetchPayLevel({ page: page + 1, limit: rowsPerPage }));
    dispatch(fetchPayLevelByCommission(selectedCommissionId))
  }, [selectedCommissionId]);

  const formik = useFormik({
    initialValues: {
      levelName: '',
      description: '',
    },
    validationSchema: Yup.object({
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
        } else {
          toast.error(response.payload?.message || "Failed to update level.");
        }
      } else {
        const response = await dispatch(addLevelToAPI(values));
        if (response.payload?.successMsg) {
          toast.success(response.payload.successMsg);
          resetForm();
        } else {
          toast.error(response.payload?.message || "Failed to add level.");
        }
        dispatch(fetchPayLevel({ page: page + 1, limit: rowsPerPage }));
      }
    }
  });


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  console.log("Commission Levels:", commissionLevels);
  return (
    <>
      {/* <Typography variant="h6" mb={2}>Pay Matrix Levels</Typography> */}
      <Row>
        <Col md={12}>
          <Form onSubmit={formik.handleSubmit}>
            <Row>
              <Col>
                <FormGroup>
                  <Input
                    name="levelName"
                    placeholder="Level Name"
                    value={formik.values.levelName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  // invalid={formik.touched.levelName && formik.errors.levelName ? true : false}
                  />
                  {formik.touched.levelName && formik.errors.levelName && (
                    <div className="text-danger">{formik.errors.levelName}</div>
                  )}
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col>
                <FormGroup>
                  <Input
                    name="description"
                    placeholder="Description"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    invalid={formik.touched.description && formik.errors.description ? true : false}
                  />
                  {formik.touched.description && formik.errors.description && (
                    <div className="text-danger">{formik.errors.description}</div>
                  )}
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col>
                <FormGroup>
                  <Button
                    style={{ background: "#004080", color: '#fff' }}
                    type="submit"
                  >
                    {editingId ? "Update Level" : "Add Level"}
                  </Button>
                  {editingId && (
                    <Button
                      type="button"
                      color="secondary"
                      onClick={() => {
                        formik.setValues({ levelName: "", description: "" });
                        setEditingId(null);
                      }}
                    >
                      Cancel
                    </Button>
                  )}
                </FormGroup>
              </Col>
            </Row>
          </Form>
        </Col>
        <Col md={12}>
            <div className="container">
              {/* <div className="card border-0 rounded-4">
                <div className=" bg-white pt-0 pb-4 px-4 d-flex justify-content-between align-items-center">
                  <h4 className="mb-0 fw-bold text-primary">Pay Level list</h4>
                  <input
                    type="text"
                    className="form-control w-25"
                    placeholder="Search by Name or Description"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div> */}

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

                <TablePagination
                  component="div"
                  count={totalCount}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </div>

            </div>
        </Col>
      </Row>

    </>
  );
}

export default Commission;