import React, { useEffect } from "react";
import { Modal, Row, Col, Button, FormGroup, Label, Input } from "reactstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { fetchPensioners } from "../redux/slices/pensionerSlice";
import { useDispatch, useSelector } from "react-redux";
import { fetchBankDetails, fetchBankShow } from "../redux/slices/bankSlice";


export default function MonthlyPensionModal({
  formOpen,
  setFormData,
  formData,
  handleSubmit,
  setFormOpen,
  mode
}) {
  const initialValues = {
    pension_related_info_id: formData.pension_related_info_id || '',
    dr_id: formData.dr_id || '',
    remarks: formData.remarks || '',
    status: formData.status || '',
    pensioner_id: formData.pensioner_id || '',
    pensioner_bank_id: formData.pensioner_bank_id || '',
    month: formData.month || '',
    year: formData.year || '',
    processing_date: formData.processing_date || '',
    payment_date: formData.payment_date || '',
    net_pension_id: formData.net_pension_id || '',
  };

  const validate = (values) => {
    const errors = {};
    if (!values.pension_related_info_id) errors.pension_related_info_id = "Required";
    if (!values.dr_id) errors.dr_id = "Required";
    if (!values.status) errors.status = "Required";
    return errors;
  };

  const { pensioners } = useSelector((state) => state.pensioner);
  const { bankShow } = useSelector((state) => state.bankdetail);
  console.log(bankShow)
  const filterBankdetail = bankShow.filter((b)=> b?.pensioner_id === formData?.pensioner_id)
  console.log('bankShow', bankShow)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchPensioners({ page: '', limit: 1000, id: '' }));
    if (formData?.pensioner_id) {
      dispatch(fetchBankDetails({page: '', limit: 1000, id: formData?.pensioner_id }));
    }
  }, [dispatch, formData.pensioner_id]);


  return (
    <Modal
      className="modal-dialog-centered"
      isOpen={formOpen}
      toggle={() => setFormOpen(!formOpen)}
      size="lg"
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
              {mode === 'create' ? (
                <Row >
                  <Col md="6">
                    <FormGroup>
                      <Label for="pensioner_id">Pensioner ID</Label>
                      <Field as={Input} type="select" id="pensioner_id" name="pensioner_id" >
                        <option value="">Select Pensioner</option>
                        {pensioners?.map(p => (
                          <option key={p.id} value={p.id}>
                            {p.name}-({p.ppo_no})
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage name="pensioner_id" component="div" className="text-danger" />
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <Label for="pensioner_bank_id">Pensioner Bank ID</Label>
                      <Field as={Input} type="select" id="pensioner_bank_id" name="pensioner_bank_id" >
                        <option value="">Select Bank</option>
                        {filterBankdetail?.map(p => (
                          <option key={p.id} value={p.id}>
                            {p.name}-({p.ppo_no})
                          </option>
                        ))}
                      </Field>
                    </FormGroup>
                  </Col>
                </Row>
              ) : ""}

              <Row>
                <Col md="6">
                  <FormGroup>
                    <Label for="pension_related_info_id">Pension Related Info ID</Label>
                    <Field as={Input} id="pension_related_info_id" name="pension_related_info_id" />
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


              {mode === 'create' ? (
                <>
                  <Row>
                    <Col md="6">
                      <FormGroup>
                        <Label for="month">Month</Label>
                        <Field as={Input} id="month" name="month" placeholder="e.g., 05" />
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <FormGroup>
                        <Label for="year">Year</Label>
                        <Field as={Input} id="year" name="year" placeholder="e.g., 2025" />
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row>
                    <Col md="6">
                      <FormGroup>
                        <Label for="processing_date">Processing Date</Label>
                        <Field as={Input} id="processing_date" name="processing_date" type="date" />
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <FormGroup>
                        <Label for="payment_date">Payment Date</Label>
                        <Field as={Input} id="payment_date" name="payment_date" type="date" />
                      </FormGroup>
                    </Col>
                  </Row>
                </>
              ) : ''}

              <Row>
                <Col md="6">
                  <FormGroup>
                    <Label for="status">Status</Label>
                    <Field as={Input} type="select" id="status" name="status">
                      <option value="">Select</option>
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
              {mode === 'edit' ? (
                <Row>
                  <Col md="6">
                    <FormGroup>
                      <Label for="net_pension_id">Net Pension Id</Label>
                      <Field as={Input} id="net_pension_id" name="net_pension_id" disabled />
                    </FormGroup>
                  </Col>
                </Row>
              ) : ''}
              <Button
                color="primary"
                type="submit"
                className="mt-3"
                disabled={isSubmitting}
              >
                {mode === 'edit' ? 'Update' : 'Save'}
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
