import React, { useEffect } from "react";
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

// Fields for the PaySlip
const initialValues = {
    net_salary_id: "",
    pay_structure_id: "",
    da_rate_id: "",
    hra_rate_id: "",
    npa_rate_id: "",
    uniform_rate_id: "",
    pay_plus_npa: "",
    govt_contribution: "",
    arrears: "",
    spacial_pay: "",
    da_1: "",
    da_2: "",
    itc_leave_salary: "",
    da_on_ta: "",
};

const validationSchema = Yup.object({
    net_salary_id: Yup.number().required("Net Salary ID is required"),
    pay_structure_id: Yup.string().required("Pay Structure ID is required"),
});

export default function PaySlipEditModal({ isOpen, toggle, data, onSave }) {
    const formInitialValues = {
        net_salary_id: data?.net_salary_id || "",
        pay_structure_id: data?.pay_structure_id || "",
        da_rate_id: data?.da_rate_id || "",
        hra_rate_id: data?.hra_rate_id || "",
        npa_rate_id: data?.npa_rate_id ||  "",
        uniform_rate_id: data?.uniform_rate_id ||  "",
        pay_plus_npa: data?.pay_plus_npa ||  "",
        govt_contribution: data?.govt_contribution || "",
        arrears: data?.arrears || "",
        spacial_pay: data?.spacial_pay ||  "",
        da_1: data?.da_1 || "",
        da_2: data?.da_2 ||  "",
        itc_leave_salary: data?.itc_leave_salary ||"",
        da_on_ta: data?.da_on_ta ||"",
    };

    const onSubmit = async (values, { setSubmitting }) => {
        try {
            const formdata =
                await onSave(values);
            toggle();
        } catch (error) {
            toast.error("Failed to save pay slip data");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal isOpen={isOpen} toggle={toggle} size="lg" backdrop="static" centered>
            <ModalHeader toggle={toggle}>Edit Pay Slip</ModalHeader>
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
                                {Object.entries(initialValues).map(([key], index) => (
                                    <Col md={3} key={key}>
                                        <FormGroup>
                                            <Label for={key}>{key.replace(/_/g, " ").toUpperCase()}</Label>
                                            <Field
                                                name={key}
                                                className="form-control"
                                                type="number"
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
        </Modal>
    );
}
