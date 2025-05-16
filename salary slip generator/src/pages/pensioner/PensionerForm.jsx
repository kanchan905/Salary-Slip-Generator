import React, { useEffect } from "react";
import {
  Button,
  FormGroup,
  Label,
  Col,
  Row,
  Card,
  CardBody,
  CardHeader,
} from "reactstrap";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createPensioner, fetchPensioners, updatePensioner } from "../../redux/slices/pensionerSlice";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

const initialValues = {
  ppo_no: "",
  name: "",
  type_of_pension: "",
  retired_employee_id: "",
  relation: "",
  dob: "",
  doj: "",
  dor: "",
  end_date: "",
  status: "",
  pan_number: "",
  pay_level: "",
  pay_commission: "",
  equivalent_level: "",
  address: "",
  city: "",
  state: "",
  pin_code: "",
  mobile_no: "",
  email: "",
};

const validationSchema = Yup.object({
  ppo_no: Yup.string().required("PPO No is required"),
  name: Yup.string().required("Name is required"),
  type_of_pension: Yup.string()
    .oneOf(["Regular", "Family"], "Select a valid pension")
    .required("Type of Pension is required"),
  retired_employee_id: Yup.string().required("Retired Employee ID is required"),
  relation: Yup.string()
    .oneOf(["Self", "Spouse", "Son", "Daughter", "Other"], "Select a valid relation")
    .required("Relation is required"),
  dob: Yup.date().required("Date of Birth is required"),
  doj: Yup.date().required("Date of Joining is required"),
  dor: Yup.date().required("Date of Retirement is required"),
  end_date: Yup.date()
    .min(Yup.ref('dor'), 'End Date should be after Date of Retirement')
    .required('End Date is required'),
  status: Yup.string()
    .oneOf(["Active", "Expired", "Suspended"], 'select a valid status')
    .required("Status is required"),
  pan_number: Yup.string()
    .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN format")
    .required("PAN Number is required"),
  pay_level: Yup.string().required("Pay Level is required"),
  pay_commission: Yup.string().required("Pay Commission is required"),
  equivalent_level: Yup.string().required("Equivalent Level is required"),
  address: Yup.string().required("Address is required"),
  city: Yup.string().required("City is required"),
  state: Yup.string().required("State is required"),
  pin_code: Yup.string()
    .matches(/^\d{6,8}$/, "Invalid Pin Code")
    .required("Pin Code is required"),
  mobile_no: Yup.string()
    .matches(/^\+?\d{10,15}$/, "Invalid Mobile Number")
    .required("Mobile Number is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
});

export default function PensionerForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const error = useSelector((state) => state.pensioner.loading)
  const { id } = useParams();
  const pensioners = useSelector((state) => state.pensioner.pensioners);
  const { name } = useSelector((state) => state.auth.user.role);

  useEffect(() => {
    dispatch(fetchPensioners())
  }, [dispatch])


  // Find pensioner by id if editing
  const pensionerToEdit = id
    ? pensioners.find((p) => String(p.id) === String(id))
    : null;

  // Use pensioner data as initial values if editing, otherwise use default
  const pickFields = (source, keys) =>
  keys.reduce((obj, key) => {
    obj[key] = source[key] || "";
    return obj;
  }, {});
  const allowedFields = ["ppo_no", "name", "type_of_pension", "retired_employee_id","relation","dob","doj","dor","end_date","status","pan_number","pay_level","pay_commission","equivalent_level","address","city","state","pin_code","mobile_no","email"];
  const formInitialValues = pensionerToEdit
    ? { ...initialValues, ...pickFields(pensionerToEdit, allowedFields) }
    : initialValues;

  

  const onSubmit = (values, { setSubmitting }) => {
    if (id) {
      dispatch(updatePensioner({ id, values })).unwrap()
        .then(() => {
          toast.success("Successfully updated");
          navigate(`/${name.toLowerCase()}/pensioners`);
        })
        .catch((err) => {
          const apiMsg =
            err?.response?.data?.message ||
            err?.message ||
            'Failed to save pensioner.';
          toast.error(apiMsg);
        });
    } else {
      dispatch(createPensioner(values)).unwrap()
        .then(() => {
          toast.success("Successfully added");
          navigate(`/${name.toLowerCase()}/pensioners`);
        })
        .catch((err) => {
          const apiMsg =
            err?.response?.data?.message ||
            err?.message ||
            'Failed to save pensioner.';
          toast.error(apiMsg);
        });
    }
    setSubmitting(false);
  };

  return (
    <>
      <div className="header bg-gradient-info pb-8 pt-8 pt-md-8 main-head"></div>
      <div className="container mt-5">
        <Card className="shadow border-0">
          <CardHeader>
            <h3>{id ? "Edit Pensioner" : "Add Pensioner"}</h3>
          </CardHeader>
          <CardBody>
            <Formik
              initialValues={formInitialValues}
              // enableReinitialize={true}
              validationSchema={validationSchema}
              onSubmit={onSubmit}
            >
              {({ isSubmitting }) => (
                <Form>
                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="ppo_no">PPO No</Label>
                        <Field name="ppo_no" className="form-control" />
                        <ErrorMessage name="ppo_no" component="p" className="text-danger" />
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="name">Name</Label>
                        <Field name="name" className="form-control" />
                        <ErrorMessage name="name" component="p" className="text-danger" />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="type_of_pension">Type of Pension</Label>
                        <Field as="select" name="type_of_pension" className="form-control">
                          <option value="">Select</option>
                          <option value="Regular">Regular</option>
                          <option value="Family">Family</option>
                        </Field>
                        <ErrorMessage name="type_of_pension" component="p" className="text-danger" />
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="retired_employee_id">Retired Employee ID</Label>
                        <Field name="retired_employee_id" className="form-control" />
                        <ErrorMessage name="retired_employee_id" component="p" className="text-danger" />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="relation">Relation</Label>
                        <Field as="select" name="relation" className="form-control">
                          <option value="">Select Relation</option>
                          <option value="Self">Self</option>
                          <option value="Spouse">Spouse</option>
                          <option value="Son">Son</option>
                          <option value="Daughter">Daughter</option>
                          <option value="Other">Other</option>
                        </Field>
                        <ErrorMessage name="relation" component="p" className="text-danger" />
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="dob">Date of Birth</Label>
                        <Field name="dob" type="date" className="form-control" />
                        <ErrorMessage name="dob" component="p" className="text-danger" />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="doj">Date of Joining</Label>
                        <Field name="doj" type="date" className="form-control" />
                        <ErrorMessage name="doj" component="p" className="text-danger" />
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="dor">Date of Retirement</Label>
                        <Field name="dor" type="date" className="form-control" />
                        <ErrorMessage name="dor" component="p" className="text-danger" />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="end_date">End Date</Label>
                        <Field name="end_date" type="date" className="form-control" />
                        <ErrorMessage name="end_date" component="p" className="text-danger" />
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="status">Status</Label>
                        <Field as="select" name="status" className="form-control">
                          <option value="">Select Status</option>
                          <option value="Active">Active</option>
                          <option value="Expired">Expired</option>
                          <option value="Suspended">Suspended</option>
                        </Field>
                        <ErrorMessage name="status" component="p" className="text-danger" />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="pan_number">PAN Number</Label>
                        <Field name="pan_number" className="form-control" />
                        <ErrorMessage name="pan_number" component="p" className="text-danger" />
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="pay_level">Pay Level</Label>
                        <Field name="pay_level" className="form-control" />
                        <ErrorMessage name="pay_level" component="p" className="text-danger" />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="pay_commission">Pay Commission</Label>
                        <Field name="pay_commission" className="form-control" />
                        <ErrorMessage name="pay_commission" component="p" className="text-danger" />
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="equivalent_level">Equivalent Level</Label>
                        <Field name="equivalent_level" className="form-control" />
                        <ErrorMessage name="equivalent_level" component="p" className="text-danger" />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={12}>
                      <FormGroup>
                        <Label for="address">Address</Label>
                        <Field name="address" className="form-control" />
                        <ErrorMessage name="address" component="p" className="text-danger" />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={4}>
                      <FormGroup>
                        <Label for="city">City</Label>
                        <Field name="city" className="form-control" />
                        <ErrorMessage name="city" component="p" className="text-danger" />
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label for="state">State</Label>
                        <Field name="state" className="form-control" />
                        <ErrorMessage name="state" component="p" className="text-danger" />
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label for="pin_code">Pin Code</Label>
                        <Field name="pin_code" className="form-control" />
                        <ErrorMessage name="pin_code" component="p" className="text-danger" />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="mobile_no">Mobile No</Label>
                        <Field name="mobile_no" className="form-control" />
                        <ErrorMessage name="mobile_no" component="p" className="text-danger" />
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="email">Email</Label>
                        <Field name="email" className="form-control" />
                        <ErrorMessage name="email" component="p" className="text-danger" />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Button color="primary" type="submit" disabled={isSubmitting}>
                    {id ? "Update" : "Add"}
                  </Button>
                  <Button
                    color="secondary"
                    type="button"
                    className="ms-2"
                    onClick={() => navigate(`/${name.toLowerCase()}/pensioners`)}
                  >
                    Cancel
                  </Button>
                </Form>
              )}
            </Formik>
          </CardBody>
        </Card>
      </div>
    </>
  );
}