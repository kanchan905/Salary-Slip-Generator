import React, {useEffect} from "react";
import { Modal, Row, Col, Button, FormGroup, Label, Input } from "reactstrap";
import { Formik, Form, Field, ErrorMessage, useFormikContext} from "formik";



const TotalDeductionCalculator = () => {
    // Access formik values and functions
    const { values, setFieldValue } = useFormikContext();

    // Destructure all the fields that contribute to the total deductions
    const {
        commutation_amount,
        income_tax,
        recovery,
        other
    } = values;

    useEffect(() => {
        // Function to safely parse numbers, defaulting to 0 if invalid
        const parseNum = (value) => Number(value) || 0;

        // Calculate the total deductions by summing all individual components
        const total =
            parseNum(commutation_amount) +
            parseNum(income_tax) +
            parseNum(recovery) +
            parseNum(other);

        // Update the total_deduction field in the form state
        if (values.amount !== total) {
            setFieldValue('amount', total);
        }

    }, [
        // This effect will re-run whenever any of these values change
        commutation_amount,
        income_tax,
        recovery,
        other,
        setFieldValue,
        values.amount // Add this to prevent infinite re-renders
    ]);

    // This component renders nothing in the UI
    return null;
};


export default function PensionDeductionModal({
    isOpen,
    toggle,
    data,
    onSave,
}) {

    const initialValues = {
        net_pension_id: data.net_pension_id || "",
        commutation_amount: data.commutation_amount || '',
        income_tax: data.income_tax || 0,
        recovery: data.recovery || 0,
        other: data.other || 0,
        description: data.description || "",
        amount: data.amount || '',
    };

    // No complex validation needed for these fields, but you can add if required
    const validate = (values) => {
        const errors = {};
        if (values.commutation_amount < 0) errors.commutation_amount = "Cannot be negative";
        if (values.income_tax < 0) errors.income_tax = "Cannot be negative";
        if (values.recovery < 0) errors.recovery = "Cannot be negative";
        if (values.other < 0) errors.other = "Cannot be negative";
        return errors;
    };

    return (
        <Modal className="modal-dialog-centered" isOpen={isOpen} toggle={toggle}>
            <div className="pt-4 pb-4 px-4">
                <Formik
                    initialValues={initialValues}
                    validate={validate}
                    onSubmit={onSave} // Directly use the onSave prop
                    enableReinitialize
                >
                    {({ isSubmitting,values }) => (
                        <Form>
                            <TotalDeductionCalculator />
                            <h4 className="mb-4">Edit Pensioner Deduction</h4>
                            <Row>
                                <Col md="6">
                                    <FormGroup>
                                        <Label for="commutation_amount">Commutation Amount (₹)</Label>
                                        <Field as={Input} type="text" id="commutation_amount" name="commutation_amount" />
                                    </FormGroup>
                                </Col>
                                <Col md="6">
                                    <FormGroup>
                                        <Label for="income_tax">Income Tax (₹)</Label>
                                        <Field as={Input} type="text" name="income_tax" id="income_tax" />
                                        <ErrorMessage name="income_tax" component="div" className="text-danger" />
                                    </FormGroup>
                                </Col>
                                <Col md="6">
                                    <FormGroup>
                                        <Label for="recovery">Recovery (₹)</Label>
                                        <Field as={Input} id="recovery" name="recovery" type="text" />
                                        <ErrorMessage name="recovery" component="div" className="text-danger" />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col md="6">
                                    <FormGroup>
                                        <Label for="other">Other (₹)</Label>
                                        <Field as={Input} id="other" name="other" type="text" />
                                        <ErrorMessage name="other" component="div" className="text-danger" />
                                    </FormGroup>
                                </Col>
                                <Col md="6">
                                    <FormGroup>
                                        <Label for="description">Description</Label>
                                        <Field as={Input} id="description" name="description" type="text" />
                                        <ErrorMessage name="description" component="div" className="text-danger" />
                                    </FormGroup>
                                </Col>
                            </Row>

                            <hr />
                            <Row className="mt-4">
                                <Col className="text-end">
                                    <h4 className="mb-0">
                                        Total Pension: ₹{values.amount}
                                    </h4>
                                </Col>
                            </Row>

                            <div className="d-flex justify-content-end mt-4">
                                <Button color="primary" type="submit" className="mt-3" disabled={isSubmitting}>
                                    Update Deductions
                                </Button>
                                <Button color="secondary" className="mt-3 ms-2" onClick={toggle}>
                                    Cancel
                                </Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </Modal>
    );
}