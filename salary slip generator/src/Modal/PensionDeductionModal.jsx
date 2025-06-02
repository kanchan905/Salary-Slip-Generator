import React, { useEffect } from "react";
import { Modal, Row, Col, Button, FormGroup, Label, Input } from "reactstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { fetchNetPension } from "../redux/slices/netPensionSlice";

export default function PensionDeductionModal({
  formOpen,
  toggleModal,
  formMode,
  formData,
  handleSubmit,
  setFormOpen
}) {
  const initialValues = {
    net_pension_id: formData.net_pension_id || "",
    income_tax: formData.income_tax || "",
    recovery: formData.recovery || "",
    other: formData.other || "",
    description: formData.description || ""
  };

  const validate = (values) => {
    const errors = {};
    if (!values.net_pension_id) errors.net_pension_id = "Required";
    if (!values.income_tax) errors.income_tax = "Required";
    if (!values.recovery) errors.recovery = "Required";
    if (!values.other) errors.other = "Required";
    if (!values.description) errors.description = "Required"
    return errors;
  };
  const dispatch = useDispatch();
  const { netPension, netPensionData } = useSelector((state) => state.netPension);

  
  useEffect(() => {
    dispatch(fetchNetPension({ page: 1, limit: 40}));
  },[dispatch]);
  

  return (
    <Modal className="modal-dialog-centered" isOpen={formOpen} toggle={() => toggleModal()} >
      <div className="pt-4 pb-4 px-4">
        <Formik initialValues={initialValues} validate={validate} onSubmit={handleSubmit} enableReinitialize>
          {({ isSubmitting }) => (
            <Form>
              <h4 className="mb-4">{formMode === "edit" ? "Edit Pensioner Deduction" : "Add Pensioner Deduction"}</h4>
              <Row>
                <Col md="6">
                  <FormGroup>
                    <Label for="net_pension_id">Net Pension</Label>
                    <Field as={Input} id="net_pension_id" name="net_pension_id" type="select" disabled={ formMode === "edit" ? true : false }>
                      <option value="">Select</option>
                    {
                      netPension?.map((data, idx) => (
                        <option key={`netPension-${idx}`} value={data.id}>{data.net_pension}</option>
                      ))
                    }
                      
                    </Field>
                    <ErrorMessage name="net_pension_id" component="div" className="text-danger" />
                  </FormGroup>
                </Col>
                <Col md="6">
                 <FormGroup>
                    <Label for="income_tax">Income Tax</Label>
                    <Field as={Input} type="number" name="income_tax" id="income_tax"/>
                    <ErrorMessage name="income_tax" component="div" className="text-danger" />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md="6">
                  <FormGroup>
                    <Label for="recovery">Recovery</Label>
                    <Field as={Input} id="recovery" name="recovery" type="number" />
                    <ErrorMessage name="recovery" component="div" className="text-danger" />
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <Label for="other">Other</Label>
                    <Field as={Input} id="other" name="other" type="number" />
                    <ErrorMessage name="other" component="div" className="text-danger" />
                  </FormGroup>
                </Col>
                <Col md="12">
                  <FormGroup>
                    <Label for="description">Description</Label>
                    <Field as={Input} id="description" name="description" type="text"/>
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
