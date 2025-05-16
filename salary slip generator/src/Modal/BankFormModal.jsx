import React from "react";
import { Modal, Row, Col, Button, FormGroup, Label, Input } from "reactstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";

export default function BankFormModal({
  formOpen,
  toggleModal,
  formMode,
  formData,
  handleSubmit,
  setFormOpen
}) {
  const initialValues = {
    pensioner_id: formData.pensioner_id || "",
    bank_name: formData.bank_name || "",
    branch_name: formData.branch_name || "",
    account_no: formData.account_no || "",
    ifsc_code: formData.ifsc_code || "",
    is_active: formData.is_active ?? true
  };

  const validate = (values) => {
    const errors = {};
    if (!values.pensioner_id) errors.pensioner_id = "required";
    if (!values.bank_name) errors.bank_name = "required";
    if (!values.branch_name) errors.branch_name = "required";
    if (!values.account_no) errors.account_no = "required";
    if (!values.ifsc_code) errors.ifsc_code = "required";
    return errors;
  };

  return (
    <Modal
      className="modal-dialog-centered"
      isOpen={formOpen}
      toggle={() => toggleModal("bankFormModal")}
      scrollable={true}
    >
      <div className="pt-4 pb-4 px-4">
        <Formik
          initialValues={initialValues}
          validate={validate}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting, values, setFieldValue }) => (
            <Form>
              <h4 className="mb-4">
                {formMode === "edit" ? "Edit Bank Detail" : "Add Bank Detail"}
              </h4>
              <Row>
                <Col md="6">
                  <FormGroup>
                    <Label for="pensioner_id">Pensioner ID</Label>
                    <Field
                      as={Input}
                      id="pensioner_id"
                      name="pensioner_id"
                      type="text"
                    />
                    <ErrorMessage
                      name="pensioner_id"
                      component="div"
                      className="text-danger"
                    />
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <Label for="bank_name">Bank Name</Label>
                    <Field
                      as={Input}
                      id="bank_name"
                      name="bank_name"
                      type="text"
                    />
                    <ErrorMessage
                      name="bank_name"
                      component="div"
                      className="text-danger"
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md="6">
                  <FormGroup>
                    <Label for="branch_name">Branch Name</Label>
                    <Field
                      as={Input}
                      id="branch_name"
                      name="branch_name"
                      type="text"
                    />
                    <ErrorMessage
                      name="branch_name"
                      component="div"
                      className="text-danger"
                    />
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <Label for="account_no">Account Number</Label>
                    <Field
                      as={Input}
                      id="account_no"
                      name="account_no"
                      type="text"
                    />
                    <ErrorMessage
                      name="account_no"
                      component="div"
                      className="text-danger"
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md="6">
                  <FormGroup>
                    <Label for="ifsc_code">IFSC Code</Label>
                    <Field
                      as={Input}
                      id="ifsc_code"
                      name="ifsc_code"
                      type="text"
                    />
                    <ErrorMessage
                      name="ifsc_code"
                      component="div"
                      className="text-danger"
                    />
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup check className="mt-4">
                    <Label check>
                      <Input
                        type="checkbox"
                        name="is_active"
                        checked={values.is_active}
                        onChange={() => setFieldValue("is_active", !values.is_active)}
                      />
                      {" "} Status
                    </Label>
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
                className="mt-3"
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
