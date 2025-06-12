import React from "react";
import { Modal, Row, Col, Button, FormGroup, Label, Input } from "reactstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";

export default function DearnessReliefModal({
  formOpen,
  toggleModal,
  formMode,
  formData,
  handleSubmit,
  setFormOpen,
  dearness
}) {
  const initialValues = {
    effective_from: formData.effective_from || "",
    effective_to: formData.effective_to || "",
    dr_percentage: formData.dr_percentage || ""
  };

  const validate = (values) => {
    const errors = {};
    if (!values.effective_from) errors.effective_from = "Required";
    if (!values.effective_to) errors.effective_to = "Required";
    if (!values.dr_percentage) errors.dr_percentage = "Required";
    return errors;
  };

  return (
    <Modal className="modal-dialog-centered" isOpen={formOpen} toggle={() => toggleModal()} >
      <div className="pt-4 pb-4 px-4">
        <Formik initialValues={initialValues} validate={validate} onSubmit={handleSubmit} enableReinitialize>
          {({ isSubmitting }) => (
            <Form>
              <h4 className="mb-4">{formMode === "edit" ? "Edit DR" : "Add DR"}</h4>
              <Row>
                <Col md="6">
                  <FormGroup>
                    <Label for="effective_from">Effective From*</Label>
                    <Field as={Input} id="effective_from" name="effective_from" type="date" />
                    <ErrorMessage name="effective_from" component="div" className="text-danger" />
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <Label for="effective_to">Effective To*</Label>
                    <Field as={Input} id="effective_to" name="effective_to" type="date" />
                    <ErrorMessage name="effective_to" component="div" className="text-danger" />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md="6">
                  <FormGroup>
                    <Label for="dr_percentage">DR Percentage*</Label>
                    <Field as={Input} type="text" id="dr_percentage" name="dr_percentage" >
                    </Field>
                    <ErrorMessage name="dr_percentage" component="div" className="text-danger" />
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
