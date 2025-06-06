import React, { useEffect } from "react";
import { Modal, Row, Col, Button, FormGroup, Label, Input } from "reactstrap";
import { Formik, Form, ErrorMessage } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { fetchPensioners } from "../redux/slices/pensionerSlice";

export default function PensionDocumentModal({
  formOpen,
  toggleModal,
  formMode,
  formData,
  handleSubmit,
  setFormOpen
}) {
  const initialValues = {
    pensioner_id: formData.pensioner_id || "",
    document_type: formData.document_type || "",
    document_number: formData.document_number || "",
    issue_date: formData.issue_date || "",
    expiry_date: formData.expiry_date || "",
    file: null,
  };

  const validate = (values) => {
    const errors = {};
    if (!values.pensioner_id) errors.pensioner_id = "Required";
    if (!values.document_type) errors.document_type = "Required";
    if (!values.document_number) errors.document_number = "Required";
    if (!values.issue_date) errors.issue_date = "Required";
    if (!values.expiry_date) errors.expiry_date = "Required";
    if (!formData.id && !values.file) errors.file = "Required"; 
    return errors;
  };

  const pensionersData = useSelector((state) => state.pensionDocument.document)
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchPensioners())
  }, [dispatch])

  return (
    <Modal className="modal-dialog-centered" isOpen={formOpen} toggle={() => toggleModal()} scrollable>
      <div className="pt-4 pb-4 px-4">
        <Formik initialValues={initialValues} validate={validate} onSubmit={handleSubmit} enableReinitialize>
          {({ isSubmitting, values, setFieldValue }) => (
            <Form>
              <h4 className="mb-4">
                {formMode === "edit" ? "Edit Pension Document" : "Add Pension Document"}
              </h4>
              <Row>
                <Col md="6">
                  <FormGroup>
                    <Label for="pensioner_id">Pensioner*</Label>
                    <Input
                      type="select"
                      name="pensioner_id"
                      value={values.pensioner_id}
                      onChange={(e) => setFieldValue('pensioner_id', e.target.value)}
                      disabled={formMode == 'edit'}
                    >
                      <option value="">Select Pensioner</option>
                      {pensionersData.map((p) => (
                        <option key={p.id} value={p.pensioner_id}>
                          {p.pensioner_id}
                        </option>
                      ))}
                    </Input>
                    <ErrorMessage name="pensioner_id" component="div" className="text-danger" />
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <Label for="document_type">Document Type*</Label>
                    <Input type="select" name="document_type" value={values.document_type} onChange={(e) => setFieldValue("document_type", e.target.value)}>
                      <option value="">Select</option>
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
                    <Label for="document_number">Document Number*</Label>
                    <Input name="document_number" value={values.document_number} onChange={(e) => setFieldValue("document_number", e.target.value)} />
                    <ErrorMessage name="document_number" component="div" className="text-danger" />
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <Label for="issue_date">Issue Date*</Label>
                    <Input type="date" name="issue_date" value={values.issue_date} onChange={(e) => setFieldValue("issue_date", e.target.value)} />
                    <ErrorMessage name="issue_date" component="div" className="text-danger" />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md="6">
                  <FormGroup>
                    <Label for="expiry_date">Expiry Date*</Label>
                    <Input type="date" name="expiry_date" value={values.expiry_date} onChange={(e) => setFieldValue("expiry_date", e.target.value)} />
                    <ErrorMessage name="expiry_date" component="div" className="text-danger" />
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <Label for="file">File</Label>
                    <Input type="file" name="file" onChange={(event) => setFieldValue("file", event.currentTarget.files[0])} />
                    <ErrorMessage name="file" component="div" className="text-danger" />
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
