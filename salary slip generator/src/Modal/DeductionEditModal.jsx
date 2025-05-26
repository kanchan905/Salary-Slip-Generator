import React from "react";
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
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

// Fields for Deduction
const initialValues = {
    net_salary_id: "",
    income_tax: "",
    professional_tax: "",
    license_fee: "",
    nfch_donation: "",
    gpf: "",
    transport_allowance_recovery: "",
    hra_recovery: "",
    computer_advance: "",
    computer_advance_installment: "",
    computer_advance_inst_no: "",
    computer_advance_balance: "",
    employee_contribution_10: "",
    govt_contribution_14_recovery: "",
    dies_non_recovery: "",
    computer_advance_interest: "",
    pay_recovery: "",
    nps_recovery: "",
    lic: "",
    credit_society_membership: "",
};

const validationSchema = Yup.object({
    net_salary_id: Yup.number().required("Net Salary ID is required"),
    credit_society_membership: Yup.string().required("Credit Society Membership is required"),
});

export default function DeductionEditModal({ isOpen, toggle, data, onSave,netSalaryId }) {
    const formInitialValues = {
        net_salary_id: data?.net_salary_id || netSalaryId || "",
        income_tax: data?.income_tax || "",
        professional_tax: data?.professional_tax ||"",
        license_fee: data?.license_fee ||"",
        nfch_donation: data?.nfch_donation ||"",
        gpf: data?.gpf ||"",
        transport_allowance_recovery: data?.transport_allowance_recovery || "",
        hra_recovery: data?.hra_recovery || "",
        computer_advance: data?.computer_advance || "",
        computer_advance_installment: data?.computer_advance_installment || "",
        computer_advance_inst_no: data?.computer_advance_inst_no || "",
        computer_advance_balance: data?.computer_advance_balance || "",
        employee_contribution_10: data?.employee_contribution_10 || "",
        govt_contribution_14_recovery: data?.govt_contribution_14_recovery || "",
        dies_non_recovery: data?.dies_non_recovery || "",
        computer_advance_interest: data?.computer_advance_interest || "",
        pay_recovery: data?.pay_recovery || "",
        nps_recovery: data?.nps_recovery || "",
        lic: data?.lic || "",
        credit_society_membership: data?.credit_society || "",
    };

    const onSubmit = async (values, { setSubmitting }) => {
        try {
            console.log("Submitting values:", values);
            await onSave(values);
            toggle();
        } catch (error) {
            toast.error("Failed to save deduction data");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal isOpen={isOpen} toggle={toggle} size="lg" backdrop="static" centered className="custom-modal" >
            <ModalHeader toggle={toggle}>Edit Deductions</ModalHeader>
            <div className="pt-4 pb-4 px-4 custom-scrollbar" style={{ maxHeight: '500px', overflowY: 'auto' }}>
            <Formik
                initialValues={formInitialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
                enableReinitialize
            >
                {({ isSubmitting }) => (
                    <Form>
                        <ModalBody>
                            <Row>
                                {Object.entries(initialValues).map(([key]) => (
                                    <Col md={6} sm={6} xs={12} key={key}>
                                        <FormGroup>
                                            <Label for={key}>{key.replace(/_/g, " ").toUpperCase()}</Label>
                                            <Field
                                                name={key}
                                                className="form-control"
                                                type="text"
                                            />
                                            <ErrorMessage
                                                name={key}
                                                component="p"
                                                className="text-danger"
                                            />
                                        </FormGroup>
                                    </Col>
                                ))}
                            </Row>
                        </ModalBody>
                        <ModalFooter>
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
