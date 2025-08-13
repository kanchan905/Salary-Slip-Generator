import React from "react";
import { Modal, Row, Col, Button, FormGroup, Label, Input } from "reactstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";

export default function CommissionModal({
  formOpen,
  toggleModal,
  formData,
  handleSubmit,
  setFormOpen,
  formMode
}) {
  const initialValues = {
    name: formData.name || "",
    year: formData.year || "",
    is_active: "Select Status"
  };

  const validate = (values) => {
    const errors = {};
    if (!values.name) errors.name = "Required";
    if (!values.year) errors.year = "Required";
    if (!values.is_active) errors.is_active = "Required";
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
              <h4 className="mb-4">{formMode === 'edit'? 'Edit' : 'Add'} Commission</h4>
              <Row>
                <Col md="12">
                  <FormGroup>
                    <Label for="loan_amount">Name*</Label>
                    <Field as={Input} type="text" id="name" name="name" />
                    <ErrorMessage name="name" component="div" className="text-danger" />
                  </FormGroup>
                </Col>
                <Col md="12">
                  <FormGroup>
                    <Label for="interest_rate">Year</Label>
                    <Field as={Input} type="text" id="year" name="year" />
                    <ErrorMessage name="year" component="div" className="text-danger" />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md="12">
                  <FormGroup>
                    <Label for="is_active">Status</Label>
                    <Field as={Input} type="select" id="is_active" name="is_active">
                      <option value="">Select Status</option>
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
