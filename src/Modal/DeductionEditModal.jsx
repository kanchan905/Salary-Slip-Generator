import React, {useEffect} from "react";
import {
    Button,
    FormGroup,
    Label,
    Col,
    Row,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from "reactstrap";
import { Formik, Field, Form, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useFormikContext } from "formik";



// --- Helper component for Total Deduction calculation ---
const TotalDeductionCalculator = () => {
    // Access formik values and functions
    const { values, setFieldValue } = useFormikContext();

    // Destructure all the fields that contribute to the total deductions
    const {
        income_tax,
        professional_tax,
        license_fee,
        nfch_donation,
        gpf,
        computer_advance_installment,
        employee_contribution_10,
        govt_contribution_14_recovery,
        lic,
        gis,
        credit_society_membership,
        deduction_recoveries,
    } = values;

    useEffect(() => {
        // Function to safely parse numbers, defaulting to 0 if invalid
        const parseNum = (value) => parseFloat(value) || 0;

        // Calculate the sum of all dynamic deduction recoveries
        const recoveriesTotal = deduction_recoveries.reduce((total, recovery) => {
            return total + parseNum(recovery.amount);
        }, 0);

        // Calculate the total deductions by summing all individual components
        const total =
            parseNum(income_tax) +
            parseNum(professional_tax) +
            parseNum(license_fee) +
            parseNum(nfch_donation) +
            parseNum(gpf) +
            parseNum(computer_advance_installment) +
            parseNum(employee_contribution_10) +
            parseNum(govt_contribution_14_recovery) +
            parseNum(lic) +
            parseNum(gis)+
            parseNum(credit_society_membership) +
            recoveriesTotal;

        // Update the total_deductions field in the form state
        setFieldValue('total_deductions', Math.round(total));

    }, [
        // This effect will re-run whenever any of these values change
        income_tax,
        professional_tax,
        license_fee,
        nfch_donation,
        gpf,
        computer_advance_installment,
        employee_contribution_10,
        govt_contribution_14_recovery,
        lic,
        gis,
        credit_society_membership,
        // Using JSON.stringify ensures the effect runs if a recovery amount changes
        JSON.stringify(deduction_recoveries),
        setFieldValue
    ]);

    // This component renders nothing in the UI
    return null;
};


const validationSchema = Yup.object({
    net_salary_id: Yup.number().required("Net Salary ID is required"),
    // Add validation for the dynamic deductions array
    deduction_recoveries: Yup.array().of(
        Yup.object().shape({
            type: Yup.string().required("Type is required"),
            amount: Yup.number()
                .typeError("Amount must be a number")
                .required("Amount is required")
                .positive("Amount must be a positive number"),
        })
    ),
});

export default function DeductionEditModal({ isOpen, toggle, data, onSave, netSalaryId, employee }) {

    const getInitialRecoveries = () => {
        const recoveries = data?.deduction_recoveries;

        // Case 1: Data is null or undefined, return empty
        if (!recoveries) {
            return [];
        }

        // Case 2: Data is ALREADY an array of objects (the format we need)
        if (Array.isArray(recoveries)) {
            return recoveries; // Just return it as-is
        }

        // Case 3: Data is an object { "TA Recovery": 500 }, transform it
        if (typeof recoveries === 'object') {
            return Object.entries(recoveries).map(([type, amount]) => ({
                type,
                amount: Number(amount) || "", // Ensure amount is a number
            }));
        }

        // Fallback: If it's some other weird format, return empty
        return [];
    };

    const formInitialValues = {
        net_salary_id: data?.net_salary_id || netSalaryId || "",
        income_tax: data?.income_tax || "",
        professional_tax: data?.professional_tax || "",
        license_fee: data?.license_fee || "",
        nfch_donation: data?.nfch_donation || "",
        gpf: data?.gpf || "",
        gis: data?.gis || "",
        computer_advance_installment: data?.computer_advance_installment || 0,
        employee_contribution_10: data?.employee_contribution_10 || "",
        govt_contribution_14_recovery: data?.govt_contribution_14_recovery || "",
        lic: data?.lic || "",
        credit_society_membership: data?.credit_society || "",
        deduction_recoveries: getInitialRecoveries(),
        total_deductions: data?.total_deductions || '',
    };

    const onSubmit = async (values, { setSubmitting }) => {
        try {
            await onSave(values);
            toggle();
        } catch (error) {
            toast.error("Failed to save deduction data");
        } finally {
            setSubmitting(false);
        }
    };

    const typeDeduction = [
        'NPA Recovery',
        'DA recovery',
        'HRA Recovery',
        'TA Recovery',
        'DA on TA Recovery',
        'NPS-Government contribution(14%) Recovery',
        'Uniform Recovery',
        'LTC Recovery',
        'PAY FIXATION Recovery',
        'Honorarium Recovery',
        'CEA(CHILD EDUCATION ALLOWANCE) Recovery',
        'NPS -Employee contribution(10%) Recovery',
        'GPF Recovery',
        'Income Tax Recovery',
        'Professional Tax Recovery',
        'License Fee Recovery',
        'NFCH Donation Recovery',
        'Credit society Recovery',
        'Dies non recovery',
        'HPL (Half Pay Leave) Recovery',
        'EOL (Extraordinary Leave) Recovery',
        'CCL (Child Care Leave) Recovery',
        'Briefcase Recovery',
    ];

    return (
        <Modal isOpen={isOpen} toggle={toggle} size="lg" backdrop="static" centered className="custom-modal" >
            <ModalHeader toggle={toggle}>Edit Deductions</ModalHeader>
            <div className="pt-4 pb-4 px-4 custom-scrollbar" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                <Formik
                    key={data?.net_salary_id || netSalaryId}
                    initialValues={formInitialValues}
                    validationSchema={validationSchema}
                    onSubmit={onSubmit}
                    enableReinitialize
                >
                    {({ isSubmitting, values }) => (
                        <Form>
                            <TotalDeductionCalculator />
                            <ModalBody>
                                <Row>
                                    {/* Step 1: Map over fields that should ALWAYS be shown */}
                                    {['income_tax', 'professional_tax', 'license_fee', 'nfch_donation', 'lic','gis'].map((key) => (
                                        <Col md={6} sm={6} xs={12} key={key}>
                                            <FormGroup>
                                                <Label for={key}>{key.replace(/_/g, " ").toUpperCase()}</Label>
                                                <Field name={key} className="form-control" type="text" />
                                                <ErrorMessage name={key} component="p" className="text-danger" />
                                            </FormGroup>
                                        </Col>
                                    ))}

                                    {/* {employee?.credit_society_member === 1 && ( */}
                                        <Col md={6} sm={6} xs={12} key="credit_society_membership">
                                            <FormGroup>
                                                <Label for="credit_society_membership">Credit Society Membership</Label>
                                                <Field name="credit_society_membership" className="form-control" type="text" />
                                                <ErrorMessage name="credit_society_membership" component="p" className="text-danger" />
                                            </FormGroup>
                                        </Col>

                                    {/* )} */}

                                    {/* {employee?.computer_advance_installment > 0 && ( */}
                                        <Col md={6} sm={6} xs={12} key="computer_advance_installment">
                                            <FormGroup>
                                                <Label for="computer_advance_installment">Computer Loan Installment</Label>
                                                <Field name="computer_advance_installment" className="form-control" type="text" />
                                                <ErrorMessage name="computer_advance_installment" component="p" className="text-danger" />
                                            </FormGroup>
                                        </Col>

                                     {/* )}  */}
                                    
                                    { employee?.pension_scheme?.toLowerCase() === 'gpf' && (
                                        <Col md={6} sm={6} xs={12} key="gpf">
                                                <FormGroup>
                                                    <Label for="gpf">GPF</Label>
                                                    <Field name="gpf" className="form-control" type="text" />
                                                    <ErrorMessage name="gpf" component="p" className="text-danger" />
                                                </FormGroup>
                                            </Col>
                                    )}

                                    {/* Step 2: Conditionally show NPS-specific fields */}
                                    {employee?.pension_scheme === "NPS" && (
                                        <>
                                            <Col md={6} sm={6} xs={12} key="employee_contribution_10">
                                                <FormGroup>
                                                    <Label for="employee_contribution_10">EMPLOYEE CONTRIBUTION 10%</Label>
                                                    <Field name="employee_contribution_10" className="form-control" type="text" />
                                                    <ErrorMessage name="employee_contribution_10" component="p" className="text-danger" />
                                                </FormGroup>
                                            </Col>

                                            <Col md={6} sm={6} xs={12} key="govt_contribution_14_recovery">
                                                <FormGroup>
                                                    <Label for="govt_contribution_14_recovery">GOVT CONTRIBUTION 14% RECOVERY</Label>
                                                    <Field name="govt_contribution_14_recovery" className="form-control" type="text" />
                                                    <ErrorMessage name="govt_contribution_14_recovery" component="p" className="text-danger" />
                                                </FormGroup>
                                            </Col>
                                        </>
                                    )}

                                </Row>

                                <hr />
                                <h5>Deduction / Recoveries</h5>

                                {/* Use FieldArray for dynamic deduction_recoveries */}
                                <FieldArray name="deduction_recoveries">
                                    {(arrayHelpers) => (
                                        <div>
                                            {values.deduction_recoveries && values.deduction_recoveries.length > 0 && (
                                                values.deduction_recoveries.map((recovery, index) => (
                                                    <Row key={index} className="align-items-center mb-2">
                                                        <Col md={5}>
                                                            <FormGroup>
                                                                <Label for={`deduction_recoveries.${index}.type`}>Type</Label>
                                                                <Field
                                                                    name={`deduction_recoveries.${index}.type`}
                                                                    as="select"
                                                                    className="form-control"
                                                                >
                                                                    <option value="">Select a type</option>
                                                                    {typeDeduction.map(option => (
                                                                        <option key={option} value={option}>{option}</option>
                                                                    ))}
                                                                </Field>
                                                                <ErrorMessage name={`deduction_recoveries.${index}.type`} component="p" className="text-danger small" />
                                                            </FormGroup>
                                                        </Col>
                                                        <Col md={5}>
                                                            <FormGroup>
                                                                <Label for={`deduction_recoveries.${index}.amount`}>Amount</Label>
                                                                <Field
                                                                    name={`deduction_recoveries.${index}.amount`}
                                                                    type="text"
                                                                    className="form-control"
                                                                    placeholder="Amount"
                                                                />
                                                                <ErrorMessage name={`deduction_recoveries.${index}.amount`} component="p" className="text-danger small" />
                                                            </FormGroup>
                                                        </Col>
                                                        <Col md={2}>
                                                            <Button
                                                                color="danger"
                                                                type="button"
                                                                onClick={() => arrayHelpers.remove(index)} // to remove a recovery
                                                                className="mt-4"
                                                                outline
                                                            >
                                                                Remove
                                                            </Button>
                                                        </Col>
                                                    </Row>
                                                ))
                                            )}
                                            <Button
                                                color="secondary"
                                                type="button"
                                                onClick={() => arrayHelpers.push({ type: '', amount: '' })} // to add a new recovery
                                            >
                                                + Add Deduction/Recovery
                                            </Button>
                                        </div>
                                    )}
                                </FieldArray>
                                {/* The <Row> below was part of your original structure, so it must be closed now */}
                            </ModalBody>

                            <ModalFooter>
                                <div className="mr-auto">
                                    <h4>Total Deductions: ₹{values.total_deductions}</h4>
                                </div>
                                <Button color="primary" type="submit" disabled={isSubmitting}>
                                    Save
                                </Button>
                                <Button color="secondary" type="button" onClick={toggle}>
                                    Cancel
                                </Button>
                            </ModalFooter>
                        </Form>
                    )}
                </Formik>
            </div>
        </Modal>
    );
}
