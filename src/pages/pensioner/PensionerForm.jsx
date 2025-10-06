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
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createPensioner, fetchPensioners, updatePensioner } from "../../redux/slices/pensionerSlice";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";



const initialValues = {
  ppo_no: "",
  first_name: "", 
  middle_name: "",
  last_name: "",
  type_of_pension: "",
  user_id: "",
  relation: "",
  dob: "",
  doj: "",
  dor: "",
  start_date: "", 
  end_date: "",
  status: "",
  pan_number: "",
  address: "",
  city: "",
  state: "",
  pin_code: "",
  mobile_no: "",
  email: "",
  pay_cell: "", 
  pay_commission_at_retirement: "", 
  basic_pay_at_retirement: "", 
  last_drawn_salary: "", 
  NPA: "", 
  HRA: "", 
  special_pay: "", 
};


const validationSchema = Yup.object({
  ppo_no: Yup.string().required("PPO No is required"),
  first_name: Yup.string().required("First name is required"),
  type_of_pension: Yup.string()
    .oneOf(["Regular", "Family"], "Select a valid pension")
    .required("Type of Pension is required"),
  relation: Yup.string()
    .oneOf(["Self", "Spouse", "Son", "Daughter", "Other"], "Select a valid relation")
    .required("Relation is required"),
  start_date: Yup.date().required("Start Date is Required"), 
  status: Yup.string()
    .oneOf(["Active", "Inactive"], 'select a valid status')
    .required("Status is required"),
});

export default function PensionerForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const pensioners = useSelector((state) => state.pensioner.pensioners);

  useEffect(() => {
    dispatch(fetchPensioners())
  }, [dispatch])

  const pensionerToEdit = id
    ? pensioners.find((p) => String(p.id) === String(id))
    : null;

  const pickFields = (source, keys) =>
    keys.reduce((obj, key) => {
      obj[key] = source[key] || ""; 
      return obj;
    }, {});


  const allowedFields = Object.keys(initialValues);

  const formInitialValues = pensionerToEdit
    ? { ...initialValues, ...pickFields(pensionerToEdit, allowedFields) }
    : initialValues;

  const onSubmit = (values, { setSubmitting }) => {
    // This logic should now work correctly
    if (id) {
      dispatch(updatePensioner({ id, values })).unwrap()
        .then(() => {
          toast.success("Successfully updated");
          navigate(`/pensioner/view/${id}`);
        })
        .catch((err) => {
          const apiMsg = err?.message || 'Failed to save pensioner.';
          toast.error(apiMsg);
        })
        .finally(() => {
           setSubmitting(false); 
        });
    } else {
      dispatch(createPensioner(values)).unwrap()
        .then(() => {
          toast.success("Successfully added");
          navigate(`/pensioners`);
        })
        .catch((err) => {
          const apiMsg = err?.message || 'Failed to save pensioner.';
          toast.error(apiMsg);
        })
        .finally(() => {
           setSubmitting(false); 
        });
    }
  };

  return (
    <>
      <div className="header bg-gradient-info pb-8 pt-8 pt-md-8 main-head"></div>
      <div className="container mt-5">
        <Card className="shadow border-0">
          <CardHeader>
            <div className='d-flex justify-content-between align-items-center'>
              <h3>{id ? "Edit Pensioner" : "Add Pensioner"}</h3>
              <NavLink to={`/pensioners`}>
                <Button
                  style={{ background: "#004080", color: '#fff' }}
                  type="button"
                >
                  Back
                </Button>
              </NavLink>
            </div>
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
                    <Col md={4}>
                      <FormGroup>
                        <Label for="ppo_no">PPO No</Label>
                        <Field name="ppo_no" className="form-control" />
                        <ErrorMessage name="ppo_no" component="p" className="text-danger" />
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label for="first_name">First Name</Label>
                        <Field name="first_name" className="form-control" disabled />
                        <ErrorMessage name="first_name" component="p" className="text-danger" />
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label for="last_name">last Name</Label>
                        <Field name="last_name" className="form-control" disabled/>                      
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label for="middle_name">Middle Name</Label>
                        <Field name="middle_name" className="form-control"  disabled />                      
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label for="mobile_no">Mobile No</Label>
                        <Field name="mobile_no" className="form-control" />
                        <ErrorMessage name="mobile_no" component="p" className="text-danger" />
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label for="email">Email</Label>
                        <Field name="email" className="form-control" disabled/>
                        <ErrorMessage name="email" component="p" className="text-danger"/>
                      </FormGroup>
                    </Col>
                     <Col md={4}>
                      <FormGroup>
                        <Label for="pan_number">PAN Number</Label>
                        <Field name="pan_number" className="form-control" />
                        <ErrorMessage name="pan_number" component="p" className="text-danger" />
                      </FormGroup>
                    </Col>  
                    <Col md={4}>
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
                    <Col md={4}>
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
                     <Col md={4}>
                      <FormGroup>
                        <Label for="dob">Date of Birth</Label>
                        <Field name="dob" type="date" className="form-control" />
                        <ErrorMessage name="dob" component="p" className="text-danger" />
                      </FormGroup>
                    </Col> 
                    <Col md={4}>
                      <FormGroup>
                        <Label for="doj">Date of Joining</Label>
                        <Field name="doj" type="date" className="form-control" />
                        <ErrorMessage name="doj" component="p" className="text-danger" />
                      </FormGroup>
                    </Col>  
                    <Col md={4}>
                      <FormGroup>
                        <Label for="dor">Date of Retirement</Label>
                        <Field name="dor" type="date" className="form-control" />
                        <ErrorMessage name="dor" component="p" className="text-danger" />
                      </FormGroup>
                    </Col> 
                    <Col md={4}>
                      <FormGroup>
                        <Label for="start_date">Start Date</Label>
                        <Field name="start_date" type="date" className="form-control" />
                        <ErrorMessage name="start_date" component="p" className="text-danger" />
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label for="end_date">End Date</Label>
                        <Field name="end_date" type="date" className="form-control" />
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label for="status">Status</Label>
                        <Field as="select" name="status" className="form-control">
                          <option value="">Select Status</option>
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>                     
                        </Field>
                        <ErrorMessage name="status" component="p" className="text-danger" />
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                     <FormGroup>
                        <Label for="pay_commission_at_retirement">Pay Commission At Retirement</Label>
                        <Field name="pay_commission_at_retirement" type="text" className="form-control" />
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                     <FormGroup>
                        <Label for="last_drawn_salary">Last Drawn Salary</Label>
                        <Field name="last_drawn_salary" type="text" className="form-control" />
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                     <FormGroup>
                        <Label for="NPA">NPA</Label>
                        <Field name="NPA" type="text" className="form-control" />
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                     <FormGroup>
                        <Label for="HRA">HRA</Label>
                        <Field name="HRA" type="text" className="form-control" />
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                     <FormGroup>
                        <Label for="special_pay">special_pay</Label>
                        <Field name="special_pay" type="text" className="form-control" />
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label for="address">Address</Label>
                        <Field name="address" className="form-control" />
                        <ErrorMessage name="address" component="p" className="text-danger" />
                      </FormGroup>
                    </Col>
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
                  
                  <Button color="primary" type="submit" disabled={isSubmitting}>
                    {id ? "Update" : "Add"}
                  </Button>
                  <Button
                    color="secondary"
                    type="button"
                    className="ms-2"
                    onClick={() => navigate(`/pensioner/view/${id}`)}
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