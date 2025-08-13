import React from 'react';
import { Modal, Row, Col, Button, FormGroup, Label, Input } from 'reactstrap';
import { Formik, Form, ErrorMessage } from 'formik';



export default function PensionerInfoModal({
    isOpen,
    toggle,
    modalType,
    selectedInfo,
    handleSave,
}) {
    const initialValues = {
        basic_pension: selectedInfo.basic_pension || '',
        commutation_amount: selectedInfo.commutation_amount || '',
        additional_pension: selectedInfo.additional_pension || '',
        medical_allowance: selectedInfo.medical_allowance || '',
        effective_from: selectedInfo?.effective_from ,
        effective_till: selectedInfo?.effective_till,
        is_active: selectedInfo?.is_active ? 1 : 0,
    };

    // Form validation
    const validate = (values) => {
        const errors = {};
        if (!values.basic_pension) errors.basic_pension = 'Basic Pension is Required';
        if (!values.effective_from) errors.effective_from = 'Effective From date is Required';

        if (values.effective_from && values.effective_till) {
            if (new Date(values.effective_till) < new Date(values.effective_from)) {
                errors.effective_till = 'Effective Till cannot be before Effective From';
            }
        }
        return errors;
    };

    return (
        <Modal className="modal-dialog-centered modal-md" isOpen={isOpen} toggle={toggle}>
            <div className="pt-4 pb-4 px-4" >
                <Formik
                    initialValues={initialValues}
                    validate={validate}
                    onSubmit={handleSave}
                    enableReinitialize
                >
                    {({ isSubmitting, values, setFieldValue }) => (
                        <Form>
                            <h4 className="mb-4">
                                {modalType === 'update' ? 'Edit Pension Info' : 'Add Pension Info'}
                            </h4>
                            <Row>
                                <Col md="6">
                                    <FormGroup>
                                        <Label for="basic_pension">Basic Pension*</Label>
                                        <Input
                                            type="text"
                                            name="basic_pension"
                                            value={values.basic_pension}
                                            onChange={(e) => setFieldValue('basic_pension', e.target.value)}
                                        />
                                        <ErrorMessage name="basic_pension" component="div" className="text-danger" />
                                    </FormGroup>
                                </Col>
                                <Col md="6">
                                    <FormGroup>
                                        <Label for="commutation_amount">Commutation Amount</Label>
                                        <Input
                                            type="text"
                                            name="commutation_amount"
                                            value={values.commutation_amount}
                                            onChange={(e) => setFieldValue('commutation_amount', e.target.value)}
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col md="6">
                                    <FormGroup>
                                        <Label for="additional_pension">Additional Pension</Label>
                                        <Input
                                            type="text"
                                            name="additional_pension"
                                            value={values.additional_pension}
                                            onChange={(e) => setFieldValue('additional_pension', e.target.value)}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md="6">
                                    <FormGroup>
                                        <Label for="medical_allowance">Medical Allowance</Label>
                                        <Input
                                            type="text"
                                            name="medical_allowance"
                                            value={values.medical_allowance}
                                            onChange={(e) => setFieldValue('medical_allowance', e.target.value)}
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <hr className="my-3" />
                            <Row>
                                <Col md="4">
                                    <FormGroup>
                                        <Label for="is_active">Status*</Label>
                                        <Input
                                            type="select"
                                            name="is_active"
                                            value={values.is_active}
                                            onChange={(e) => setFieldValue('is_active', e.target.value)}
                                        >
                                            <option value={1}>Active</option>
                                            <option value={0}>Inactive</option>
                                        </Input>
                                    </FormGroup>
                                </Col>
                                <Col md="4">
                                    <FormGroup>
                                        <Label for="effective_from">Effective From*</Label>
                                        <Input
                                            type="date"
                                            name="effective_from"
                                            value={values.effective_from}
                                            onChange={(e) => setFieldValue('effective_from', e.target.value)}
                                        />
                                        <ErrorMessage name="effective_from" component="div" className="text-danger" />
                                    </FormGroup>
                                </Col>
                                <Col md="4">
                                    <FormGroup>
                                        <Label for="effective_till">Effective Till</Label>
                                        <Input
                                            type="date"
                                            name="effective_till"
                                            value={values.effective_till}
                                            onChange={(e) => setFieldValue('effective_till', e.target.value)}
                                        />
                                        <ErrorMessage name="effective_till" component="div" className="text-danger" />
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