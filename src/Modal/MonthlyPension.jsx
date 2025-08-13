import React, { useEffect } from "react";
import { Modal, Row, Col, Button, FormGroup, Label, Input } from "reactstrap";
import { Formik, Form, Field, ErrorMessage, FieldArray, useFormikContext } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { fetchPensionRelated } from "../redux/slices/pensionRelatedSlice";
import { fetchDearnessRelief } from "../redux/slices/dearnessRelief";


const ARREAR_TYPES = [
    'Pay Arrear',
    'Commutational Arrear',
    'Additional Pension Arrear',
    'Medical Arrear',
    'DA Arrear',
    'Other'
];

// --- Helper component for automatic calculations ---
const CalculationUpdater = () => {
    const { values, setFieldValue } = useFormikContext();
    const { dearness } = useSelector((state) => state.dearnessRelief); // Access dearness rates here

    useEffect(() => {
        // Get current values from the form
        const basic = Number(values.basic_pension) || 0;
        const additional = Number(values.additional_pension) || 0;

        // Find the selected DR rate from the list
        const selectedDR = (dearness || []).find(dr => dr.id == values.dr_id);
        const drPercentage = selectedDR ? Number(selectedDR.dr_percentage) : 0;

        // Calculate the DR amount
        const drAmt = Math.round(((basic + additional) * drPercentage) / 100);

        // Update the dr_amount field in the form state
        // Check to avoid unnecessary re-renders if the value hasn't changed
        if (values.dr_amount !== drAmt) {
            setFieldValue('dr_amount', drAmt);
        }
    }, [values.basic_pension, values.additional_pension, values.dr_id, dearness, setFieldValue, values.dr_amount]);

    return null; // This component doesn't render anything visible
};


const PensionTotalCalculator = () => {
    // Access formik values and functions
    const { values, setFieldValue } = useFormikContext();

    // Destructure all the fields that contribute to the total pension
    const {
        basic_pension,
        additional_pension,
        medical_allowance,
        dr_amount,
        arrears,
    } = values;

    useEffect(() => {
        // Function to safely parse numbers, defaulting to 0 if invalid
        const parseNum = (value) => Number(value) || 0;

        // Calculate the sum of all arrear amounts
        const totalArrears = (arrears || []).reduce((total, arrear) => {
            return total + parseNum(arrear.amount);
        }, 0);

        // Calculate the total pension by summing all individual components
        const total =
            parseNum(basic_pension) +
            parseNum(additional_pension) +
            parseNum(medical_allowance) +
            parseNum(dr_amount) +
            totalArrears;

        // Update the total_pension field in the form state
        // Check to avoid unnecessary re-renders if the value hasn't changed
        if (values.total_pension !== total) {
             setFieldValue('total_pension', total);
        }

    }, [
        // This effect will re-run whenever any of these values change
        basic_pension,
        additional_pension,
        medical_allowance,
        dr_amount,
        // Using JSON.stringify ensures the effect runs if an arrear amount changes
        JSON.stringify(arrears),
        setFieldValue,
        values.total_pension,
    ]);

    // This component renders nothing in the UI
    return null;
};



export default function MonthlyPensionModal({
    isOpen,
    toggle,
    data,
    onSave,
}) {
    const dispatch = useDispatch();
    const { pensionRelated } = useSelector((state) => state.info);
    const { dearness } = useSelector((state) => state.dearnessRelief);

    const initialValues = {
        pension_related_info_id: data.pension_rel_info_id || '',
        dr_id: data.dr_id || '',
        net_pension_id: data.net_pension_id || '',
        basic_pension: data.basic_pension || 0,
        additional_pension: data.additional_pension || 0,
        medical_allowance: data.medical_allowance || 0,
        dr_amount: data.dr_amount || 0,
        status: data.status || 'Initiated',
        remarks: data.remarks || '',
        is_active: data.is_active ?? true,
        arrears: data.arrears || [],
        total_pension: data.total_pension || '',
    };

    const validate = (values) => {
        const errors = {};
        if (!values.status) errors.status = "Status is required";
        if (values.basic_pension < 0) errors.basic_pension = "Cannot be negative";
        return errors;
    };

    useEffect(() => {
        if (isOpen) {
            dispatch(fetchPensionRelated({ page: 1, limit: 1000 }));
            dispatch(fetchDearnessRelief({ page: 1, limit: 1000 }));
        }
    }, [dispatch, isOpen]);




    return (
        <Modal
            className="modal-dialog-centered"
            isOpen={isOpen}
            toggle={toggle}
            size="lg"
        >
            <div className="pt-4 pb-4 px-4">
                <Formik
                    initialValues={initialValues}
                    validate={validate}
                    onSubmit={onSave}
                    enableReinitialize
                >
                    {({ isSubmitting, values }) => (
                        <Form>
                            <CalculationUpdater />
                            <PensionTotalCalculator />
                            <h4 className="mb-4">Edit Monthly Pension Details</h4>
                            <Row>
                                <Col md="4">
                                    <FormGroup>
                                        <Label for="pension_related_info_id">Pension Related Info*</Label>
                                        <Field as={Input} type="select" id="pension_related_info_id" name="pension_related_info_id" disabled>
                                            <option value="">Select Related Info</option>
                                            {pensionRelated?.map(p => (
                                                <option key={p.id} value={p.id}>
                                                    {p.pensioner?.name} (PPO: {p.pensioner?.ppo_no})
                                                </option>
                                            ))}
                                        </Field>
                                        <ErrorMessage name="pension_related_info_id" component="div" className="text-danger" />
                                    </FormGroup>
                                </Col>
                                <Col md="4">
                                    <FormGroup>
                                        <Label for="basic_pension">Basic Pension (₹)</Label>
                                        <Field as={Input} type="text" id="basic_pension" name="basic_pension" />
                                        <ErrorMessage name="basic_pension" component="div" className="text-danger" />
                                    </FormGroup>
                                </Col>

                                <Col md="4">
                                    <FormGroup>
                                        <Label for="dr_id">Dearness Relief (DR)*</Label>
                                        <Field as={Input} type="select" id="dr_id" name="dr_id">
                                            <option value="">Select DR Rate</option>
                                            {dearness?.map(p => (
                                                <option key={p.id} value={p.id}>
                                                    {p.dr_percentage}% (w.e.f {p.wef_date})
                                                </option>
                                            ))}
                                        </Field>
                                        <ErrorMessage name="dr_id" component="div" className="text-danger" />
                                    </FormGroup>
                                </Col>
                                <Col md="4">
                                    <FormGroup>
                                        <Label for="dr_amount">Dearness Amount (₹)</Label>
                                        <Field as={Input} type="text" id="dr_amount" name="dr_amount" />
                                    </FormGroup>
                                </Col>
                                <Col md="4">
                                    <FormGroup>
                                        <Label for="additional_pension">Additional Pension (₹)</Label>
                                        <Field as={Input} type="text" id="additional_pension" name="additional_pension" />
                                    </FormGroup>
                                </Col>
                                <Col md="4">
                                    <FormGroup>
                                        <Label for="medical_allowance">Medical Allowance (₹)</Label>
                                        <Field as={Input} type="text" id="medical_allowance" name="medical_allowance" />
                                    </FormGroup>
                                </Col>
                            </Row>

                            <Row>
                                <Col md="6">
                                    <FormGroup>
                                        <Label for="status">Status*</Label>
                                        <Field as={Input} type="select" id="status" name="status">
                                            <option value="">Select Status</option>
                                            <option value="Initiated">Initiated</option>
                                            <option value="Approved">Approved</option>
                                            <option value="Disbursed">Disbursed</option>
                                        </Field>
                                        <ErrorMessage name="status" component="div" className="text-danger" />
                                    </FormGroup>
                                </Col>
                                <Col md="6">
                                    <FormGroup>
                                        <Label for="remarks">Remarks</Label>
                                        <Field as={Input} type="text" id="remarks" name="remarks" />
                                    </FormGroup>
                                </Col>
                            </Row>

                            <hr />
                            <h5 className="mb-3">Pension Arrears</h5>
                            <FieldArray name="arrears">
                                {({ push, remove }) => (
                                    <div>
                                        {values.arrears && values.arrears.map((arrear, index) => (
                                            <Row key={index} className="mb-2 align-items-start">
                                                <Col md={5}>
                                                    <FormGroup>
                                                        <Label for={`arrears.${index}.type`}>Arrear Type</Label>
                                                        <Field
                                                            as={Input}
                                                            type="select"
                                                            name={`arrears.${index}.type`}
                                                        >
                                                            <option value="" disabled>Select a type...</option>
                                                            {ARREAR_TYPES.map(type => (
                                                                <option key={type} value={type}>
                                                                    {type}
                                                                </option>
                                                            ))}
                                                        </Field>
                                                        <ErrorMessage name={`arrears.${index}.type`} component="div" className="text-danger" />
                                                    </FormGroup>
                                                </Col>
                                                <Col md={5}>
                                                    <FormGroup>
                                                        <Label for={`arrears.${index}.amount`}>Amount (₹)</Label>
                                                        <Field
                                                            as={Input}
                                                            type="text"
                                                            name={`arrears.${index}.amount`}
                                                        />
                                                        <ErrorMessage name={`arrears.${index}.amount`} component="div" className="text-danger" />
                                                    </FormGroup>
                                                </Col>
                                                <Col md={2} className="mt-4 pt-2">
                                                    <Button color="danger" type="button" onClick={() => remove(index)}>
                                                        Remove
                                                    </Button>
                                                </Col>
                                            </Row>
                                        ))}
                                        <Button type="button" color="info" className="mt-2" onClick={() => push({ type: '', amount: 0 })}>
                                            Add Arrear
                                        </Button>
                                    </div>
                                )}
                            </FieldArray>

                            <hr />
                            <Row className="mt-4">
                                <Col className="text-end">
                                    <h4 className="mb-0">
                                        Total Pension: ₹{values.total_pension}
                                    </h4>
                                </Col>
                            </Row>
                            
                            {/* Action Buttons */}
                            <div className="d-flex justify-content-end mt-4">
                                <Button color="secondary" className="me-2" onClick={toggle}>Cancel</Button>
                                <Button color="primary" type="submit" disabled={isSubmitting}>Update Pension</Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </Modal>
    );
}