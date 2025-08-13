import React from "react";
import { Modal, Row, Col, Button, FormGroup, Label, Input } from "reactstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { months } from "utils/helpers";

export default function NetPensionModal({
    formOpen,
    toggleModal,
    formData,
    handleSubmit,
    setFormOpen,
    formMode
}) {
    const initialValues = {
        pensioner_id: formData.pensioner_id || "",
        pensioner_bank_id: formData.pensioner_bank_id || "",
        month: formData.month || "",
        year: formData.year || "",
        processing_date: formData.processing_date || "",
        payment_date: formData.payment_date || "",
    };

    const validate = (values) => {
        const errors = {};
        if (!values.pensioner_id) errors.pensioner_id = "Required";
        if (!values.pensioner_bank_id) errors.pensioner_bank_id = "Required";
        if (!values.month) errors.month = "Required";
        if (!values.year) errors.year = "Required";
        if (!values.processing_date) errors.processing_date = "Required";
        if (!values.payment_date) errors.payment_date = "Required";
        return errors;
    };

    return (
        <Modal
            className="modal-dialog-centered"
            isOpen={formOpen}
            toggle={() => toggleModal("NetPensionModal")}
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
                            <h4 className="mb-4">{formMode === 'edit' ? 'Edit' : 'Add'} Net Pension</h4>
                            <Row>
                                <Col md="6">
                                    <FormGroup>
                                        <Label for="month">Month</Label>
                                        <Field as={Input} type="select" id="month" name="month" >
                                            {months.map((month) => (
                                                <option key={month.value} value={month.value}>
                                                    {month.label}
                                                </option>
                                            ))}
                                        </Field>
                                        <ErrorMessage name="month" component="div" className="text-danger" />
                                    </FormGroup>
                                </Col>
                                <Col md="6">
                                    <FormGroup>
                                        <Label for="year">Year</Label>
                                        <Field as={Input} type="text" id="year" name="year" />
                                        <ErrorMessage name="year" component="div" className="text-danger" />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col md="6">
                                    <FormGroup>
                                        <Label for="processing_date">Processing Date</Label>
                                        <Field as={Input} type="date" id="processing_date" name="processing_date" />
                                        <ErrorMessage name="processing_date" component="div" className="text-danger" />
                                    </FormGroup>
                                </Col>
                                <Col md="6">
                                    <FormGroup>
                                        <Label for="payment_date">Payment Date</Label>
                                        <Field as={Input} type="date" id="payment_date" name="payment_date" />
                                        <ErrorMessage name="payment_date" component="div" className="text-danger" />
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
