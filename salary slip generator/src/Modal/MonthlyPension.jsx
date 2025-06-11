import React, { useEffect, useState } from "react";
import { Modal, Row, Col, Button, FormGroup, Label, Input } from "reactstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { fetchPensioners } from "../redux/slices/pensionerSlice";
import { useDispatch, useSelector } from "react-redux";
import { fetchBankDetails } from "../redux/slices/bankSlice";
import { fetchPensionRelated } from "../redux/slices/pensionRelatedSlice";
import { fetchDearnessRelief } from "../redux/slices/dearnessRelief";


export default function MonthlyPensionModal({
  formOpen,
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
    if (!values.pensioner_id) errors.pensioner_id = "Required";
    if (!values.pension_related_info_id) errors.pension_related_info_id = "Required";
    if (!values.pensioner_bank_id) errors.pensioner_bank_id = "Required";
    if (!values.dr_id) errors.dr_id = "Required";
    if (!values.status) errors.status = "Required";
    if (!values.month) errors.month = "Required";
    if (!values.year) errors.year = "Required";
    if (!values.processing_date) errors.processing_date = "Required";
    if (!values.payment_date) errors.payment_date = "Required";
    return errors;
  };


  const [selectedPensionerId, setSelectedPensionerId] = useState(formData?.pensioner_id || initialValues.pensioner_id || '');
  const { pensioners } = useSelector((state) => state.pensioner);
  const { bankdetails } = useSelector((state) => state.bankdetail);
  const { pensionRelated } = useSelector((state) => state.info)
  const { dearness } = useSelector((state) => state.dearnessRelief);
  const filterBankdetail = bankdetails.filter((b) => b?.pensioner_id == selectedPensionerId && b.is_active) || []
  const filterPensionRelated = pensionRelated.filter((b) => b?.pensioner_id == selectedPensionerId && b.is_active) || []
  const dispatch = useDispatch()


  useEffect(() => {
    if(initialValues?.pensioner_id){
      setSelectedPensionerId(initialValues.pensioner_id);
    }
    dispatch(fetchPensioners({ page: '1', limit: 1000, id: '' }));
    if (selectedPensionerId) {
      dispatch(fetchBankDetails({ page: '1', limit: 1000, id: selectedPensionerId }));
      dispatch(fetchPensionRelated({ page: '1', limit: 1000 }))
      dispatch(fetchDearnessRelief({ page: '1', limit: 1000 }))
    }
  }, [dispatch, selectedPensionerId]);


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
                      <Label for="pensioner_id">Pensioner*</Label>
                      <Field as={Input} type="select" id="pensioner_id" name="pensioner_id" onClick={(e) => { setSelectedPensionerId(e.target.value) }}>
                        <option value="">Select Pensioner</option>
                        {pensioners?.map(p => (
                          <option key={p.id} value={p.id}>
                            {p.first_name}-({p.ppo_no})
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage name="pensioner_id" component="div" className="text-danger" />
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <Label for="pensioner_bank_id">Pensioner Bank*</Label>
                      <Field as={Input} type="select" id="pensioner_bank_id" name="pensioner_bank_id" >
                        <option value="">Select Bank</option>
                        {filterBankdetail?.map(p => (
                          <option key={p.id} value={p.id}>
                            {p.bank_name} - ({p.branch_name})
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage name="pensioner_bank_id" component="div" className="text-danger" />
                    </FormGroup>
                  </Col>
                </Row>
              ) : ""}

              <Row>
                <Col md="6">
                  <FormGroup>
                    <Label for="pension_related_info_id">Pension Related Info*</Label>
                    <Field as={Input} type="select" id="pension_related_info_id" name="pension_related_info_id" >
                      <option value="">Select Arrears</option>
                      {filterPensionRelated?.map(p => (
                        <option key={p.id} value={p.id}>
                          Basic Pay - {p.basic_pension}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage name="pension_related_info_id" component="div" className="text-danger" />
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup> 
                    <Label for="dr_id">DR*</Label>
                    <Field as={Input} type="select" id="dr_id" name="dr_id" >
                      <option value="">Select Dr</option>
                      {dearness?.map(p => (
                        <option key={p.id} value={p.id}>
                            {p.dr_percentage}%
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage name="dr_id" component="div" className="text-danger" />
                  </FormGroup>
                </Col>
              </Row>


              {mode === 'create' ? (
                <>
                  <Row>
                    <Col md="6">
                      <FormGroup>
                        <Label for="month">Month*</Label>
                        <Field as={Input} id="month" name="month" placeholder="e.g., 05" />
                        <ErrorMessage name="month" component="div" className="text-danger" />
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <FormGroup>
                        <Label for="year">Year*</Label>
                        <Field as={Input} id="year" name="year" placeholder="e.g., 2025" />
                        <ErrorMessage name="year" component="div" className="text-danger" />
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row>
                    <Col md="6">
                      <FormGroup>
                        <Label for="processing_date">Processing Date*</Label>
                        <Field as={Input} id="processing_date" name="processing_date" type="date" />
                        <ErrorMessage name="processing_date" component="div" className="text-danger" />
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <FormGroup>
                        <Label for="payment_date">Payment Date*</Label>
                        <Field as={Input} id="payment_date" name="payment_date" type="date" />
                        <ErrorMessage name="payment_date" component="div" className="text-danger" />
                      </FormGroup>
                    </Col>
                  </Row>
                </>
              ) : ''}

              <Row>
                <Col md="6">
                  <FormGroup>
                    <Label for="status">Status*</Label>
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
                    <Label for="remarks">Remarks (if any)</Label>
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
