import React from "react";
import { Modal, Row, Col, Button, FormGroup, Label, Input } from "reactstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";

export default function PensionDeductionModal({
  formOpen,
  toggleModal,
  formMode,
  formData,
  handleSubmit,
  setFormOpen
}) {
  const initialValues = {
    pension_id: formData.pension_id || "",
    deduction_type: formData.deduction_type || "",
    amount: formData.amount || "",
    description: formData.description || ""
  };

  const validate = (values) => {
    const errors = {};
    if (!values.pension_id) errors.pension_id = "Required";
    if (!values.deduction_type) errors.deduction_type = "Required";
    if (!values.amount) errors.amount = "Required";
    if (!values.description) errors.description = "Required"
    return errors;
  };

  return (
    <Modal className="modal-dialog-centered" isOpen={formOpen} toggle={() => toggleModal()} scrollable>
      <div className="pt-4 pb-4 px-4">
        <Formik initialValues={initialValues} validate={validate} onSubmit={handleSubmit} enableReinitialize>
          {({ isSubmitting }) => (
            <Form>
              <h4 className="mb-4">{formMode === "edit" ? "Edit DR" : "Add DR"}</h4>
              <Row>
                <Col md="6">
                  <FormGroup>
                    <Label for="pension_id">Pension Id</Label>
                    <Field as={Input} id="pension_id" name="pension_id" type="text" />
                    <ErrorMessage name="pension_id" component="div" className="text-danger" />
                  </FormGroup>
                </Col>
                <Col md="6">
                 <FormGroup>
                    <Label for="deduction_type">Deduction Type</Label>
                    <Field as={Input} type="select" name="deduction_type" id="deduction_type">
                      <option value="">Select</option>
                      <option value="Income Tax">Income Tax</option>
                      <option value="Recovery">Recovery</option>
                      <option value="Other">Other</option>
                    </Field>
                    <ErrorMessage name="deduction_type" component="div" className="text-danger" />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md="6">
                  <FormGroup>
                    <Label for="amount">amount</Label>
                    <Field as={Input} id="amount" name="amount" type="text" />
                    <ErrorMessage name="amount" component="div" className="text-danger" />
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <Label for="description">Description</Label>
                    <Field as={Input} id="description" name="description" type="text" />
                    <ErrorMessage name="description" component="div" className="text-danger" />
                  </FormGroup>
                </Col>
              </Row>
              <Button color="primary" type="submit" className="mt-3" disabled={isSubmitting}>
                Save
              </Button>
              <Button color="secondary" className="mt-3 ms-2" onClick={() => setFormOpen(false)}>
                Cancel
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </Modal>
  );
}
