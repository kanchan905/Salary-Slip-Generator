import React from "react";
import { Modal, Row, Col, Button, FormGroup, Label, Input } from "reactstrap";
import { Formik, Form, ErrorMessage } from "formik";

// FIX: Changed props to match how they are passed from PensionerDetail.js
export default function PensionDocumentModal({
  isOpen,
  toggle,
  modalType,
  selectedDocument,
  handleSave,
}) {
  // FIX: Simplified initialValues to use the passed props directly
  const initialValues = {
    document_type: selectedDocument?.document_type || "",
    document_number: selectedDocument?.document_number || "",
    issue_date: selectedDocument?.issue_date || "",
    expiry_date: selectedDocument?.expiry_date || "",
    file: null, // Always start with null; the user will select a new file if needed
  };

  const validate = (values) => {
    const errors = {};
    if (!values.document_type) errors.document_type = "Required";
    if (!values.issue_date) errors.issue_date = "Required";
    if (!values.document_number) errors.document_number = "Required";
    if (modalType === 'create' && !values.file) {
      errors.file = "A file is required for new documents.";
    }
    return errors;
  };

  return (
    // FIX: Using correct prop 'isOpen' and 'toggle'
    <Modal className="modal-dialog-centered" isOpen={isOpen} toggle={toggle}>
      <div className="pt-4 pb-4 px-4">
        {/* FIX: Using correct prop 'handleSave' for onSubmit */}
        <Formik initialValues={initialValues} validate={validate} onSubmit={handleSave} enableReinitialize>
          {({ isSubmitting, values, setFieldValue }) => (
            <Form>
              <h4 className="mb-4">
                {/* FIX: Using correct prop 'modalType' */}
                {modalType === "update" ? "Edit Pension Document" : "Add Pension Document"}
              </h4>
              <Row>
                <Col md="12">
                  <FormGroup>
                    <Label for="document_type">Document Type*</Label>
                    <Input 
                      type="select" 
                      name="document_type" 
                      value={values.document_type} 
                      onChange={(e) => setFieldValue("document_type", e.target.value)}
                    >
                      <option value="">Select a Document Type</option>
                      <option value="PAN Card">PAN Card</option>
                      <option value="Address Proof">Address Proof</option>
                      <option value="Bank Details">Bank Details</option>
                      <option value="Retirement Order">Retirement Order</option>
                      <option value="Life Certificate">Life Certificate</option>
                    </Input>
                    <ErrorMessage name="document_type" component="div" className="text-danger" />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md="6">
                  <FormGroup>
                    <Label for="document_number">Document Number</Label>
                    <Input 
                      name="document_number" 
                      value={values.document_number} 
                      onChange={(e) => setFieldValue("document_number", e.target.value)} 
                    />
                    <ErrorMessage name="document_number" component="div" className="text-danger" />
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <Label for="issue_date">Issue Date*</Label>
                    <Input 
                      type="date" 
                      name="issue_date" 
                      value={values.issue_date} 
                      onChange={(e) => setFieldValue("issue_date", e.target.value)} 
                    />
                    <ErrorMessage name="issue_date" component="div" className="text-danger" />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md="6">
                  <FormGroup>
                    <Label for="expiry_date">Expiry Date</Label>
                    <Input 
                      type="date" 
                      name="expiry_date" 
                      value={values.expiry_date} 
                      onChange={(e) => setFieldValue("expiry_date", e.target.value)} 
                    />
                    <ErrorMessage name="expiry_date" component="div" className="text-danger" />
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <Label for="file">Upload File {modalType === 'create' && '*'}</Label>
                    <Input 
                      type="file" 
                      name="file" 
                      onChange={(event) => setFieldValue("file", event.currentTarget.files[0])} 
                    />
                    <ErrorMessage name="file" component="div" className="text-danger" />
                    {modalType === 'update' && <small className="form-text text-muted">Only select a file if you want to replace the existing one.</small>}
                  </FormGroup>
                </Col>
              </Row>
              <Button color="primary" type="submit" className="mt-3" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save'}
              </Button>
              <Button color="secondary" className="mt-3 ms-2" onClick={toggle}>
                Cancel
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </Modal>
  );
}