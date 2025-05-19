import React from "react";
import { Modal, Row, Col, Button, FormGroup, Label, Input } from "reactstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";

export default function EmployeeLoanModal({
  formOpen,
  toggleModal,
  formData,
  handleSubmit,
  setFormOpen
}) {
  const initialValues = {
    employee_id: formData.employee_id || "",
    loan_type: formData.loan_type || "",
    loan_amount: formData.loan_amount || "",
    interest_rate: formData.interest_rate || "",
    sanctioned_date: formData.sanctioned_date || "",
    total_installments: formData.total_installments || "",
    current_installment: formData.current_installment || "",
    remaining_balance: formData.remaining_balance || "",
    is_active: formData.is_active ?? 1
  };

  const validate = (values) => {
    const errors = {};
    if (!values.employee_id) errors.employee_id = "Required";
    if (!values.loan_type) errors.loan_type = "Required";
    if (!values.loan_amount) errors.loan_amount = "Required";
    if (!values.interest_rate) errors.interest_rate = "Required";
    if (!values.sanctioned_date) errors.sanctioned_date = "Required";
    if (!values.total_installments) errors.total_installments = "Required";
    if (!values.current_installment) errors.current_installment = "Required";
    if (!values.remaining_balance) errors.remaining_balance = "Required";
    return errors;
  };

  return (
    <Modal
      className="modal-dialog-centered"
      isOpen={formOpen}
      toggle={() => toggleModal("employeeLoanModal")}
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
              <h4 className="mb-4">Add Employee Loan</h4>
              <Row>
                <Col md="6">
                  <FormGroup>
                    <Label for="employee_id">Employee ID</Label>
                    <Field as={Input} id="employee_id" name="employee_id" />
                    <ErrorMessage name="employee_id" component="div" className="text-danger" />
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <Label for="loan_type">Loan Type</Label>
                    <Field as={Input} type="select" id="loan_type" name="loan_type">
                      <option value="">Select</option>
                      <option value="Computer">Computer</option>
                      <option value="Housing">Housing</option>
                      <option value="Vehicle">Vehicle</option>
                      <option value="Festival">Festival</option>
                      <option value="Other">Other</option>
                    </Field>
                    <ErrorMessage name="loan_type" component="div" className="text-danger" />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md="6">
                  <FormGroup>
                    <Label for="loan_amount">Loan Amount</Label>
                    <Field as={Input} type="number" id="loan_amount" name="loan_amount" />
                    <ErrorMessage name="loan_amount" component="div" className="text-danger" />
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <Label for="interest_rate">Interest Rate (%)</Label>
                    <Field as={Input} type="number" id="interest_rate" name="interest_rate" />
                    <ErrorMessage name="interest_rate" component="div" className="text-danger" />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md="6">
                  <FormGroup>
                    <Label for="sanctioned_date">Sanctioned Date</Label>
                    <Field as={Input} type="date" id="sanctioned_date" name="sanctioned_date" />
                    <ErrorMessage name="sanctioned_date" component="div" className="text-danger" />
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <Label for="total_installments">Total Installments</Label>
                    <Field as={Input} type="number" id="total_installments" name="total_installments" />
                    <ErrorMessage name="total_installments" component="div" className="text-danger" />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md="6">
                  <FormGroup>
                    <Label for="current_installment">Current Installment</Label>
                    <Field as={Input} type="number" id="current_installment" name="current_installment" />
                    <ErrorMessage name="current_installment" component="div" className="text-danger" />
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <Label for="remaining_balance">Remaining Balance</Label>
                    <Field as={Input} type="number" id="remaining_balance" name="remaining_balance" />
                    <ErrorMessage name="remaining_balance" component="div" className="text-danger" />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md="6">
                  <FormGroup>
                    <Label for="is_active">Is Active</Label>
                    <Field as={Input} type="select" id="is_active" name="is_active">
                      <option value={1}>Active</option>
                      <option value={0}>Inactive</option>
                    </Field>
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
