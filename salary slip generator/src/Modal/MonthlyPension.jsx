import React from "react";
import { Modal, Row, Col, Button, FormGroup, Label, Input } from "reactstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";

export default function MonthlyPensionModal({
  formOpen,
  toggleModal,
  formData,
  handleSubmit,
  setFormOpen
}) {
  const initialValues = {
    pensioner_id: formData.pensioner_id || '',
    month: formData.month || '',
    basic_pension: formData.basic_pension || '',
    commutation_amount: formData.commutation_amount || '',
    additional_pension: formData.additional_pension || '',
    dr_id: formData.dr_id || '',
    dr_amount: formData.dr_amount || '',
    medical_allowance: formData.medical_allowance || '',
    status: formData.status || '',
    remarks: formData.remarks || ''
  };

  const validate = (values) => {
    const errors = {};
    if (!values.pensioner_id) errors.pensioner_id = "Required";
    if (!values.month) errors.month = "Required";
    if (!values.basic_pension) errors.basic_pension = "Required";
    if (!values.dr_id) errors.dr_id = "Required";
    if (!values.status) errors.status = "Required";
    return errors;
  };

  return (
    <Modal
      className="modal-dialog-centered"
      isOpen={formOpen}
      toggle={() => toggleModal("monthlyPensionModal")}
      scrollable={true}
    >
      <div className="pt-4 pb-4 px-4">
        <Formik
          initialValues={initialValues}
          validate={validate}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting }) => (
            <Form>
              <h4 className="mb-4">Add Monthly Pension</h4>
              <Row>
                <Col md="6">
                  <FormGroup>
                    <Label for="pensioner_id">Pensioner ID</Label>
                    <Field as={Input} id="pensioner_id" name="pensioner_id" />
                    <ErrorMessage name="pensioner_id" component="div" className="text-danger" />
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <Label for="month">Month</Label>
                    <Field as={Input} id="month" name="month" type="date" />
                    <ErrorMessage name="month" component="div" className="text-danger" />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md="6">
                  <FormGroup>
                    <Label for="basic_pension">Basic Pension</Label>
                    <Field as={Input} id="basic_pension" name="basic_pension" type="number" />
                    <ErrorMessage name="basic_pension" component="div" className="text-danger" />
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <Label for="commutation_amount">Commutation Amount</Label>
                    <Field as={Input} id="commutation_amount" name="commutation_amount" type="number" />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md="6">
                  <FormGroup>
                    <Label for="additional_pension">Additional Pension</Label>
                    <Field as={Input} id="additional_pension" name="additional_pension" type="number" />
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <Label for="dr_id">DR ID</Label>
                    <Field as={Input} id="dr_id" name="dr_id" />
                    <ErrorMessage name="dr_id" component="div" className="text-danger" />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md="6">
                  <FormGroup>
                    <Label for="dr_amount">DR Amount</Label>
                    <Field as={Input} id="dr_amount" name="dr_amount" type="number" />
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <Label for="medical_allowance">Medical Allowance</Label>
                    <Field as={Input} id="medical_allowance" name="medical_allowance" type="number" />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md="6">
                  <FormGroup>
                    <Label for="status">Status</Label>
                    <Field as={Input} type="select" id="status" name="status">
                      <option value=" ">Select</option>
                      <option value="Pending">Pending</option>
                      <option value="Processed">Processed</option>
                      <option value="Paid">Paid</option>
                    </Field>
                    <ErrorMessage name="status" component="div" className="text-danger" />
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <Label for="remarks">Remarks</Label>
                    <Field as={Input} id="remarks" name="remarks" />
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
