import React from "react";
import { Row, Col, FormGroup, Label, Input, Button } from "reactstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";

const roles = [
  { id: 1, name: "IT Admin" },
  { id: 2, name: "Administrative Officer" },
  { id: 3, name: "Accounts Officer" },
  { id: 4, name: "Salary Coordinator - NIOH" },
  { id: 5, name: "Salary Coordinator - ROHC" },
  { id: 6, name: "Pension Coordinator" },
  { id: 7, name: "End Users" },
];

const initialValues = {
  name: "",
  email: "",
  password: "",
  institute: "",
  role_id: "",
};

const validate = (values) => {
  const errors = {};
  if (!values.name) errors.name = "Required";
  if (!values.email) errors.email = "Required";
  if (!values.password) errors.password = "Required";
  if (!values.institute) errors.institute = "Required";
  if (!values.role_id) errors.role_id = "Required";
  return errors;
};

const UserCreation = ({ onNext, defaultData = {} }) => {
  const mergedInitials = { ...initialValues, ...defaultData };

  const handleSubmit = (values) => {
    onNext(values); 
  };

  return (
    <Formik
      initialValues={mergedInitials}
      validate={validate}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ isSubmitting }) => (
        <Form>
          <h4 className="mb-4">User Details</h4>
          <Row>
            <Col md="6">
              <FormGroup>
                <Label for="name">Name*</Label>
                <Field as={Input} id="name" name="name" />
                <ErrorMessage name="name" component="div" className="text-danger" />
              </FormGroup>
            </Col>
            <Col md="6">
              <FormGroup>
                <Label for="role_id">Role*</Label>
                <Field as={Input} type="select" id="role_id" name="role_id">
                  <option value="">Select Role</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>{role.name}</option>
                  ))}
                </Field>
                <ErrorMessage name="role_id" component="div" className="text-danger" />
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col md="6">
              <FormGroup>
                <Label for="email">Email*</Label>
                <Field as={Input} id="email" name="email" type="email" />
                <ErrorMessage name="email" component="div" className="text-danger" />
              </FormGroup>
            </Col>
            <Col md="6">
              <FormGroup>
                <Label for="institute">Institute*</Label>
                <Field as={Input} type="select" id="institute" name="institute">
                  <option value="">Select Institute</option>
                  <option value="NIOH">NIOH</option>
                  <option value="ROHC">ROHC</option>
                </Field>
                <ErrorMessage name="institute" component="div" className="text-danger" />
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col md="6">
              <FormGroup>
                <Label for="password">Password*</Label>
                <Field as={Input} id="password" name="password" type="password" />
                <ErrorMessage name="password" component="div" className="text-danger" />
              </FormGroup>
            </Col>
          </Row>

          <div className="d-flex gap-2 mt-3">
            <Button color="primary" type="submit" disabled={isSubmitting}>
              Next
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default UserCreation;
