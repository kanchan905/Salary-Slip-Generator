import React, { useState, useEffect } from "react";
import {
  FormGroup,
  Form,
  Input,
  Row,
  Col,
  CardBody
} from "reactstrap";
import { Button } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  addLevelToAPI,
  fetchPayLevel,
  updateLevelToAPI
} from "../../redux/slices/levelSlice";
import { TablePagination, Typography } from "@mui/material";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";

function PayLevel() {

  const dispatch = useDispatch();
  const { levels, totalCount } = useSelector((state) => state.levels);

  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);


  const pageSize = 10;

  useEffect(() => {
    dispatch(fetchPayLevel({ page: page + 1, limit: rowsPerPage }));
  }, [dispatch, page, rowsPerPage]);


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

  const filteredLevels = levels?.filter(lvl => {
    const name = lvl?.name || "";
    const description = lvl?.description || "";
    return name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      description.toLowerCase().includes(searchQuery.toLowerCase());
  });


  const handleEdit = (level) => {
    formik.setValues({ levelName: level.name, description: level.description });
    setEditingId(level.id);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  
  return (
    <>
      <Typography variant="h6" mb={2}>Pay Matrix Levels</Typography>
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

      <CardBody>
        <div className="container mt-4">
          <div className="card border-0 rounded-4">
            <div className="card-header bg-white py-4 px-4 d-flex justify-content-between align-items-center">
              <h4 className="mb-0 fw-bold text-primary">Pay Level list</h4>
              <input
                type="text"
                className="form-control w-25"
                placeholder="Search by Name or Description"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0 align-middle text-center">
                <thead className="table-light">
                  <tr className="text-uppercase small text-muted">
                    <th>Level</th>
                    <th>Description</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {levels.map((level) => (
                    <tr key={level.id}>
                      <td>{level.name}</td>
                      <td>{level.description}</td>
                      <td>
                        <Button
                          size="sm"
                          color="warning"
                          onClick={() => handleEdit(level)}
                        >
                          Edit
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {levels.length === 0 && (
                    <tr><td colSpan="4">No data found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            

            <TablePagination
              rowsPerPageOptions={[5, 10, 20, 50]}
              component="div"
              count={totalCount}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />

          </div>
        </div>
      </CardBody>
    </>
  );
}

export default PayLevel;