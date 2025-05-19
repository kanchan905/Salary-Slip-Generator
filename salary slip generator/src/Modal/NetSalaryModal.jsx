import React from "react";
import { Modal, Row, Col, Button, FormGroup, Label, Input } from "reactstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";

export default function NetSalaryModal({
  formOpen,
  toggleModal,
  formData,
  handleSubmit,
  setFormOpen,
}) {
  const initialValues = {
    employee_id: formData.employee_id || "",
    month: formData.month || "",
    year: formData.year || "",
    processing_date: formData.processing_date || "",
    net_amount: formData.net_amount || "",
    payment_date: formData.payment_date || "",
    employee_bank_id: formData.employee_bank_id || "",
  };

  const validate = (values) => {
    const errors = {};
    if (!values.employee_id) errors.employee_id = "Required";
    if (!values.month) errors.month = "Required";
    if (!values.year) errors.year = "Required";
    if (!values.processing_date) errors.processing_date = "Required";
    if (!values.net_amount) errors.net_amount = "Required";
    if (!values.payment_date) errors.payment_date = "Required";
    if (!values.employee_bank_id) errors.employee_bank_id = "Required";
    return errors;
  };

  return (
    <Modal
      className="modal-dialog-centered"
      isOpen={formOpen}
      toggle={() => toggleModal("netSalaryModal")}
      scrollable={true}
    >
      <div className="pt-4 pb-4 px-4" style={{ maxHeight: "500px", overflowY: "auto" }}>
        <Formik
          initialValues={initialValues}
          validate={validate}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting }) => (
            <Form>
              <h4 className="mb-4">Add Net Salary</h4>
              <Row>
                <Col md="6">
                  <FormGroup>
                    <Label for="employee_id">Employee ID</Label>
                    <Field as={Input} type="number" id="employee_id" name="employee_id" />
                    <ErrorMessage name="employee_id" component="div" className="text-danger" />
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <Label for="employee_bank_id">Employee Bank ID</Label>
                    <Field as={Input} type="number" id="employee_bank_id" name="employee_bank_id" />
                    <ErrorMessage name="employee_bank_id" component="div" className="text-danger" />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md="6">
                  <FormGroup>
                    <Label for="month">Month</Label>
                    <Field as={Input} type="number" id="month" name="month" />
                    <ErrorMessage name="month" component="div" className="text-danger" />
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <Label for="year">Year</Label>
                    <Field as={Input} type="number" id="year" name="year" />
                    <ErrorMessage name="year" component="div" className="text-danger" />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md="6">
                  <FormGroup>
                    <Label for="processing_date">Processing Date</Label>
                    <Field as={Input} type="date" id="processing_date" name="processing_date" />
                    <ErrorMessage name="processing_date" component="div" className="text-danger" />
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <Label for="payment_date">Payment Date</Label>
                    <Field as={Input} type="date" id="payment_date" name="payment_date" />
                    <ErrorMessage name="payment_date" component="div" className="text-danger" />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md="6">
                  <FormGroup>
                    <Label for="net_amount">Net Amount</Label>
                    <Field as={Input} type="number" id="net_amount" name="net_amount" />
                    <ErrorMessage name="net_amount" component="div" className="text-danger" />
                  </FormGroup>
                </Col>
              </Row>
              <Button
                color="primary"
                type="submit"
                className="mt-3"
                disabled={isSubmitting}
              >
                Save
              </Button>
              <Button
                color="secondary"
                className="mt-3 ms-2"
                onClick={() => setFormOpen(false)}
              >
                Cancel
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </Modal>
  );
}
