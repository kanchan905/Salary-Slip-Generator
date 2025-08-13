import React from "react";
import { Modal, Row, Col, Button, FormGroup, Label, Input } from "reactstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";

export default function CreditSocietyMemberModal({
  formOpen,
  toggleModal,
  formData,
  handleSubmit,
  setFormOpen,
  formMode
}) {
  const initialValues = {
    employee_id: formData.employee_id || '',
    society_name: formData.society_name || '',
    membership_number: formData.membership_number || '',
    joining_date: formData.joining_date || '',
    relieving_date: formData.relieving_date || '',
    monthly_subscription: formData.monthly_subscription || '',
    entrance_fee: formData.entrance_fee || '',
    is_active: formData.is_active ?? 1,
    effective_from: formData.effective_from || '',
    effective_till: formData.effective_till || '',
    remark: formData.remark || ''
  };

  const validate = (values) => {
    const errors = {};
    if (!values.employee_id) errors.employee_id = "Required";
    if (!values.society_name) errors.society_name = "Required";
    if (!values.membership_number) errors.membership_number = "Required";
    if (!values.joining_date) errors.joining_date = "Required";
    if (!values.monthly_subscription) errors.monthly_subscription = "Required";
    if (!values.entrance_fee) errors.entrance_fee = "Required";
    if (!values.effective_from) errors.effective_from = "Required";
    return errors;
  };

  return (
    <Modal
      className="modal-dialog-centered"
      isOpen={formOpen}
      toggle={() => toggleModal("creditSocietyMemberModal")}
      scrollable={true}
    >
      <div className="pt-4 pb-4 px-4 custom-scrollbar" style={{ maxHeight: '500px', overflowY: 'auto' }}>
        <Formik
          initialValues={initialValues}
          validate={validate}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting }) => (
            <Form>
              <h4 className="mb-4">{formMode === 'edit'? 'Edit' : 'Add'} Credit Society Member</h4>
              <Row>
                <Col md="6">
                  <FormGroup>
                    <Label for="employee_id">Employee ID*</Label>
                    <Field as={Input} id="employee_id" name="employee_id" type="text" />
                    <ErrorMessage name="employee_id" component="div" className="text-danger" />
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <Label for="society_name">Society Name*</Label>
                    <Field as={Input} id="society_name" name="society_name" />
                    <ErrorMessage name="society_name" component="div" className="text-danger" />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md="6">
                  <FormGroup>
                    <Label for="membership_number">Membership Number*</Label>
                    <Field as={Input} id="membership_number" name="membership_number" />
                    <ErrorMessage name="membership_number" component="div" className="text-danger" />
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <Label for="joining_date">Joining Date*</Label>
                    <Field as={Input} id="joining_date" name="joining_date" type="date" />
                    <ErrorMessage name="joining_date" component="div" className="text-danger" />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md="6">
                  <FormGroup>
                    <Label for="relieving_date">Relieving Date (if any)</Label>
                    <Field as={Input} id="relieving_date" name="relieving_date" type="date" />
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <Label for="monthly_subscription">Monthly Subscription*</Label>
                    <Field as={Input} id="monthly_subscription" name="monthly_subscription" type="text" />
                    <ErrorMessage name="monthly_subscription" component="div" className="text-danger" />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md="6">
                  <FormGroup>
                    <Label for="entrance_fee">Entrance Fee*</Label>
                    <Field as={Input} id="entrance_fee" name="entrance_fee" type="text" />
                    <ErrorMessage name="entrance_fee" component="div" className="text-danger" />
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <Label for="is_active">Active Status (if applicable)</Label>
                    <Field as={Input} type="select" id="is_active" name="is_active">
                      <option value={1}>Active</option>
                      <option value={0}>Inactive</option>
                    </Field>
                  </FormGroup>
                </Col>
              </Row>
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
                    <Label for="effective_till">Effective Till (if applicable)</Label>
                    <Field as={Input} id="effective_till" name="effective_till" type="date" />
                  </FormGroup>
                </Col>
              </Row>
              <FormGroup>
                <Label for="remark">Remark (if applicable)</Label>
                <Field as={Input} id="remark" name="remark" />
              </FormGroup>
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
