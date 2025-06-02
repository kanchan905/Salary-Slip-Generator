import React, { useEffect } from "react";
import {
  Button,
  FormGroup,
  Label,
  Col,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
} from "reactstrap";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import {
  createArrear,
  fetchArrears,
  updateArrear,
} from "../redux/slices/arrearsSlice";
import { toast } from "react-toastify";

const initialValues = {
  pensioner_id: "",
  from_month: "",
  to_month: "",
  payment_month: "",
  basic_arrear: "",
  additional_arrear: "",
  dr_percentage: "",
  dr_arrear: "",
  total_arrear: "",
  remarks: "",
  added_by: "",
  edited_by: "",
};

const validationSchema = Yup.object({
  pensioner_id: Yup.string().required("Pensioner ID is required"),
  from_month: Yup.date().required("From Month is required"),
  to_month: Yup.date()
    .min(Yup.ref("from_month"), "To Month cannot be before From Month")
    .required("To Month is required"),
  payment_month: Yup.date().required("Payment Month is required"),
  basic_arrear: Yup.number()
    .typeError("Basic Arrear must be a number")
    .required("Basic Arrear is required"),
  additional_arrear: Yup.number()
    .typeError("Additional Arrear must be a number")
    .required("Additional Arrear is required"),
  dr_percentage: Yup.number()
    .typeError("DR Percentage must be a number")
    .required("DR Percentage is required"),
  dr_arrear: Yup.number()
    .typeError("DR Arrear must be a number")
    .required("DR Arrear is required"),
  total_arrear: Yup.number()
    .typeError("Total Arrear must be a number")
    .required("Total Arrear is required"),
  remarks: Yup.string(),
  added_by: Yup.string(),
  edited_by: Yup.string(),
});

export default function ArrearsFormModal({ isOpen, toggle, id, pensioners, dearness }) {
  const dispatch = useDispatch();
  const arrears = useSelector((state) => state.arrears.arrears);

  useEffect(() => {
    dispatch(fetchArrears());
  }, [dispatch]);

  const arrearToEdit = id
    ? arrears.find((a) => String(a.id) === String(id))
    : null;

  const pickFields = (source, keys) =>
    keys.reduce((obj, key) => {
      obj[key] = source[key] || "";
      return obj;
    }, {});
  const allowedFields = [
    "pensioner_id",
    "from_month",
    "to_month",
    "payment_month",
    "basic_arrear",
    "additional_arrear",
    "dr_percentage",
    "dr_arrear",
    "total_arrear",
    "remarks",
  ];
  const formInitialValues = arrearToEdit
    ? { ...initialValues, ...pickFields(arrearToEdit, allowedFields) }
    : initialValues;

  const onSubmit = (values, { setSubmitting }) => {
    if (id) {
      dispatch(updateArrear({ id, values }))
        .unwrap()
        .then(() => {
          toggle();
          dispatch(fetchArrears({ page: '', limit: '', id: '' }));
          toast.success("Successfully updated arrear");
        })
        .catch((err) => {
          const apiMsg =
            err?.response?.data?.message || err?.message || "Failed to save arrear.";
          toast.error(apiMsg);
        });
    } else {
      dispatch(createArrear(values))
        .unwrap()
        .then(() => {
          toggle();
          dispatch(fetchArrears({ page: '', limit: '', id: '' }));
          toast.success("Successfully added arrear");
        })
        .catch((err) => {
          const apiMsg =
            err?.response?.data?.message || err?.message || "Failed to save arrear.";
          toast.error(apiMsg);
        });
    }
    setSubmitting(false);
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg" backdrop="static" centered>
      <ModalHeader toggle={toggle}>{id ? "Edit Arrear" : "Add Arrear"}</ModalHeader>
      <Formik
        initialValues={formInitialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        enableReinitialize
      >
        {({ isSubmitting }) => (
          <Form>
            <ModalBody>
              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label for="pensioner_id">Pensioner ID</Label>
                    {/* <Field name="pensioner_id" className="form-control" /> */}
                    <Field as={Input} type="select" id="pensioner_id" name="pensioner_id" disabled={arrearToEdit !== id}>
                      <option value="">Select Pensioner</option>
                      {pensioners?.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.name}-{(p.ppo)}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="pensioner_id"
                      component="p"
                      className="text-danger"
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="from_month">From Month</Label>
                    <Field name="from_month" type="date" className="form-control" />
                    <ErrorMessage
                      name="from_month"
                      component="p"
                      className="text-danger"
                    />
                  </FormGroup>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label for="to_month">To Month</Label>
                    <Field name="to_month" type="date" className="form-control" />
                    <ErrorMessage
                      name="to_month"
                      component="p"
                      className="text-danger"
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="payment_month">Payment Month</Label>
                    <Field
                      name="payment_month"
                      type="date"
                      className="form-control"
                    />
                    <ErrorMessage
                      name="payment_month"
                      component="p"
                      className="text-danger"
                    />
                  </FormGroup>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label for="basic_arrear">Basic Arrear</Label>
                    <Field
                      name="basic_arrear"
                      type="number"
                      className="form-control"
                    />
                    <ErrorMessage
                      name="basic_arrear"
                      component="p"
                      className="text-danger"
                    />
                  </FormGroup>
                </Col>

                <Col md={6}>
                  <FormGroup>
                    <Label for="additional_arrear">Additional Arrear</Label>
                    <Field
                      name="additional_arrear"
                      type="number"
                      className="form-control"
                    />
                    <ErrorMessage
                      name="additional_arrear"
                      component="p"
                      className="text-danger"
                    />
                  </FormGroup>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label for="dr_percentage">DR Percentage</Label>
                    <Field as={Input} type="select" id="dr_percentage" name="dr_percentage" >
                      <option value="">Select DR</option>
                      {dearness?.map(p => (
                        <option key={p.id} value={p.dr_percentage}>
                          {p.dr_percentage}%
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="dr_percentage"
                      component="p"
                      className="text-danger"
                    />
                  </FormGroup>
                </Col>

                <Col md={6}>
                  <FormGroup>
                    <Label for="dr_arrear">DR Arrear</Label>
                    <Field
                      name="dr_arrear"
                      type="number"
                      className="form-control"
                    />
                    <ErrorMessage
                      name="dr_arrear"
                      component="p"
                      className="text-danger"
                    />
                  </FormGroup>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label for="total_arrear">Total Arrear</Label>
                    <Field
                      name="total_arrear"
                      type="number"
                      className="form-control"
                    />
                    <ErrorMessage
                      name="total_arrear"
                      component="p"
                      className="text-danger"
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="remarks">Remarks</Label>
                    <Field name="remarks" className="form-control" />
                    <ErrorMessage
                      name="remarks"
                      component="p"
                      className="text-danger"
                    />
                  </FormGroup>
                </Col>
              </Row>
            </ModalBody>

            <ModalFooter>
              <Button color="primary" type="submit" disabled={isSubmitting}>
                {id ? "Update" : "Add"}
              </Button>
              <Button color="secondary" type="button" onClick={toggle}>
                Cancel
              </Button>
            </ModalFooter>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}
