import React, { useEffect } from "react";
import { Modal, Row, Col, Button, FormGroup, Label, Input } from "reactstrap";
import { Formik, Form, ErrorMessage } from "formik";
import { fetchPensioners } from "../redux/slices/pensionerSlice";
import { useDispatch, useSelector } from "react-redux";
import { fetchArrears } from "../redux/slices/arrearsSlice";

export default function PensionerInfoModal({
    formOpen,
    toggleModal,
    formMode,
    formData,
    handleSubmit,
    setFormOpen
}) {
    const initialValues = {
        pensioner_id: formData.pensioner_id || "",
        basic_pension: formData.basic_pension || "",
        commutation_amount: formData.commutation_amount || "",
        effective_from: formData.effective_from || "",
        effective_till: formData.effective_till || "",
        additional_pension: formData.additional_pension || "",
        medical_allowance: formData.medical_allowance || "",
        arrear_id: formData.arrear_id || "",
        remarks: formData.remarks || "",
        is_active: formData.is_active ?? 1
    };
    const dispatch = useDispatch();
    const { pensioners } = useSelector((state) => state.pensioner);
    const {arrears} = useSelector((state) => state.arrears);

    useEffect(() => {
        dispatch(fetchPensioners({ page: '1', limit: '1000', id: '' }))
        dispatch(fetchArrears({ page: '1', limit: '1000', id: '' }));
    }, [dispatch])

    const validate = (values) => {
        const errors = {};
        if (!values.pensioner_id) errors.pensioner_id = "Required";
        if (!values.commutation_amount) errors.commutation_amount = 'Required';
        if (!values.basic_pension) errors.basic_pension = "Required";
        if (!values.effective_from) errors.effective_from = "Required";
        if (!values.is_active && values.is_active !== 0) errors.is_active = "Required";
        return errors;
    };

    return (
        <Modal className="modal-dialog-centered" isOpen={formOpen} toggle={toggleModal}>
            <div className="pt-4 pb-4 px-4">
                <Formik
                    initialValues={initialValues}
                    validate={validate}
                    onSubmit={handleSubmit}
                    enableReinitialize
                >
                    {({ isSubmitting, values, setFieldValue }) => (
                        <Form>
                            <h4 className="mb-4">
                                {formMode === "edit" ? "Edit Pensioner Info" : "Add Pensioner Info"}
                            </h4>
                            <Row>
                                <Col md="6">
                                    <FormGroup>
                                        <Label for="pensioner_id">Pensioner*</Label>
                                        <Input
                                            type="select"
                                            name="pensioner_id"
                                            value={values.pensioner_id}
                                            onChange={(e) => setFieldValue("pensioner_id", e.target.value)}
                                            disabled={formMode === 'edit'}
                                        >
                                            <option value="">Select Pensioner</option>
                                            {pensioners.map((pensioner) => (
                                                <option key={pensioner.id} value={pensioner.id}>
                                                    {pensioner.first_name} ({pensioner.ppo_no})
                                                </option>
                                            ))}
                                        </Input>
                                        <ErrorMessage name="pensioner_id" component="div" className="text-danger" />
                                    </FormGroup>

                                </Col>
                                <Col md="6">
                                    <FormGroup>
                                        <Label for="basic_pension">Basic Pension*</Label>
                                        <Input
                                            type="number"
                                            name="basic_pension"
                                            value={values.basic_pension}
                                            onChange={(e) => setFieldValue("basic_pension", e.target.value)}
                                        />
                                        <ErrorMessage name="basic_pension" component="div" className="text-danger" />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col md="6">
                                    <FormGroup>
                                        <Label for="commutation_amount">Commutation Amount*</Label>
                                        <Input
                                            type="number"
                                            name="commutation_amount"
                                            value={values.commutation_amount}
                                            onChange={(e) => setFieldValue("commutation_amount", e.target.value)}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md="6">
                                    <FormGroup>
                                        <Label for="additional_pension">Additional Pension</Label>
                                        <Input
                                            type="number"
                                            name="additional_pension"
                                            value={values.additional_pension}
                                            onChange={(e) => setFieldValue("additional_pension", e.target.value)}
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col md="6">
                                    <FormGroup>
                                        <Label for="medical_allowance">Medical Allowance</Label>
                                        <Input
                                            type="number"
                                            name="medical_allowance"
                                            value={values.medical_allowance}
                                            onChange={(e) => setFieldValue("medical_allowance", e.target.value)}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md="6">
                                <FormGroup>
                                        <Label for="arrear_id">Arrear*</Label>
                                        <Input
                                            type="select"
                                            name="arrear_id"
                                            value={values.arrear_id}
                                            onChange={(e) => setFieldValue("arrear_id", e.target.value)}
                                            disabled={formMode === 'edit'}
                                        >
                                            <option value="">Select Arrear</option>
                                            {arrears.map((arrear) => (
                                                <option key={arrear.id} value={arrear.id}>
                                                    {arrear.total_arrear}
                                                </option>
                                            ))}
                                        </Input>
                                        <ErrorMessage name="pensioner_id" component="div" className="text-danger" />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col md="6">
                                    <FormGroup>
                                        <Label for="effective_from">Effective From*</Label>
                                        <Input
                                            type="date"
                                            name="effective_from"
                                            value={values.effective_from}
                                            onChange={(e) => setFieldValue("effective_from", e.target.value)}
                                        />
                                        <ErrorMessage name="effective_from" component="div" className="text-danger" />
                                    </FormGroup>
                                </Col>
                                <Col md="6">
                                    <FormGroup>
                                        <Label for="effective_till">Effective Till</Label>
                                        <Input
                                            type="date"
                                            name="effective_till"
                                            value={values.effective_till}
                                            onChange={(e) => setFieldValue("effective_till", e.target.value)}
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col md="6">
                                    <FormGroup>
                                        <Label for="remarks">Remarks</Label>
                                        <Input
                                            type="textarea"
                                            name="remarks"
                                            value={values.remarks}
                                            onChange={(e) => setFieldValue("remarks", e.target.value)}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md="6">
                                    <FormGroup>
                                        <Label for="is_active">Status*</Label>
                                        <Input
                                            type="select"
                                            name="is_active"
                                            value={values.is_active}
                                            onChange={(e) => setFieldValue("is_active", e.target.value)}
                                        >
                                            <option value={1}>Active</option>
                                            <option value={0}>Inactive</option>
                                        </Input>
                                        <ErrorMessage name="is_active" component="div" className="text-danger" />
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
