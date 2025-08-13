import React from "react";
import { Modal, Row, Col, Button, FormGroup, Label, Input } from "reactstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";


export default function BankFormModal({
  isOpen,
  toggle,
  modalType,
  selectedBank,
  handleSave,
}) {
  
  const initialValues = {
    pensioner_id: selectedBank.pensioner_id || "",
    bank_name: selectedBank.bank_name || "",
    branch_name: selectedBank.branch_name || "",
    account_no: selectedBank.account_no || "",
    ifsc_code: selectedBank.ifsc_code || "",
    is_active: selectedBank.is_active === 0 ? 0 : 1,
  };

  const validate = (values) => {
    const errors = {};
    if (!values.bank_name) errors.bank_name = "Required";
    if (!values.branch_name) errors.branch_name = "Required";
    if (!values.account_no) errors.account_no = "Required";
    if (!values.ifsc_code) errors.ifsc_code = "Required";
    return errors;
  };

  return (
    <Modal
      className="modal-dialog-centered"
      isOpen={isOpen}
      toggle={toggle}
    >
      <div className="pt-4 pb-4 px-4">
        <Formik
          initialValues={initialValues}
          validate={validate}
          onSubmit={handleSave}
          enableReinitialize 
        >
          {({ isSubmitting, values, setFieldValue }) => (
            <Form>
              <h4 className="mb-4">
                {modalType === "update" ? "Edit Bank Detail" : "Add Bank Detail"}
              </h4>
              <Row>
                <Col md="6">
                  <FormGroup>
                    <Label for="bank_name">Bank Name*</Label>
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
                <Col md="6">
                  <FormGroup>
                    <Label for="branch_name">Branch Name*</Label>
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
              </Row>
              <Row>
                <Col md="6">
                  <FormGroup>
                    <Label for="account_no">Account Number*</Label>
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
                <Col md="6">
                  <FormGroup>
                    <Label for="ifsc_code">IFSC Code*</Label>
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
              </Row>
              <Row>
                 <Col md="6">
                  <FormGroup>
                    <Label for="is_active">Status</Label>
                    <Field
                      as={Input}
                      type="select"
                      name="is_active"
                      id="is_active"
                    >
                      <option value={1}>Active</option>
                      <option value={0}>Inactive</option>
                    </Field>                   
                    <ErrorMessage
                      name="is_active"
                      component="div"
                      className="text-danger"
                    />
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
                onClick={toggle}
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