import React from "react";
import { Modal, Row, Col, Button, FormGroup, Label, Input } from "reactstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";

// ...existing code...

export default function UserFormModal({
    formOpen,
    toggleModal,
    formMode,
    formData,
    handleSubmit,
    setFormOpen,
}) {
    const roles = [
        { id: 1, name: 'IT Admin' },
        { id: 2, name: 'Administrative Officer' },
        { id: 3, name: 'Accounts Officer' },
        { id: 4, name: 'Salary Coordinator - NIOH' },
        { id: 5, name: 'Salary Coordinator - ROHC' },
        { id: 6, name: 'Pension Coordinator' },
        { id: 7, name: 'End Users' }
    ];

    const initialValues = {
        first_name: formData.first_name || "",
        middle_name: formData.middle_name || "",
        last_name: formData.last_name || "",
        employee_code: formData.employee_code || "",
        password: formData.password || "",
        email: formData.email || "",
        institute: formData.institute || "",
        role_id: formData.role_id || ""
    };

    const validate = values => {
        const errors = {};
        if (!values.first_name) errors.first_name = "required";
        if (!values.last_name) errors.last_name = "required";
        if (!values.employee_code) errors.employee_code = "required";
        if (formMode === 'create' && !values.password) errors.password = "required";
        if (!values.email) errors.email = "required";
        if (!values.institute) errors.institute = "required";
        if (!values.role_id) errors.role_id = "required";
        return errors;
    };

    return (
        <Modal
            className="modal-dialog-centered"
            isOpen={formOpen}
            toggle={() => toggleModal("defaultModal")}
        // scrollable={true}
        >
            <div className='pt-4 pb-4 px-4'>
                <Formik
                    initialValues={initialValues}
                    validate={validate}
                    onSubmit={handleSubmit}
                    enableReinitialize
                >
                    {({ isSubmitting }) => (
                        <Form>
                            <h4 className="mb-4">{formMode === 'edit' ? "Edit User" : "Create User"}</h4>
                            <Row>
                                <Col md="6">
                                    <FormGroup>
                                        <Label for="first_name">First Name*</Label>
                                        <Field
                                            as={Input}
                                            id="first_name"
                                            name="first_name"
                                            type="text"
                                        />
                                        <ErrorMessage name="first_name" component="div" className="text-danger" />
                                    </FormGroup>
                                </Col>
                                <Col md="6">
                                    <FormGroup>
                                        <Label for="middle_name">Middle Name</Label>
                                        <Field
                                            as={Input}
                                            id="middle_name"
                                            name="middle_name"
                                            type="text"
                                        />
                                        <ErrorMessage name="middle_name" component="div" className="text-danger" />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col md="6">
                                    <FormGroup>
                                        <Label for="last_name">Last Name*</Label>
                                        <Field
                                            as={Input}
                                            id="last_name"
                                            name="last_name"
                                            type="text"
                                        />
                                        <ErrorMessage name="last_name" component="div" className="text-danger" />
                                    </FormGroup>
                                </Col>
                                <Col md="6">
                                    <FormGroup>
                                        <Label for="last_name">Employee Code*</Label>
                                        <Field
                                            as={Input}
                                            id="employee_code"
                                            name="employee_code"
                                            type="text"
                                        />
                                        <ErrorMessage name="employee_code" component="div" className="text-danger" />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col md="6">
                                    <FormGroup>
                                        <Label for="role_id">Role*</Label>
                                        <Field
                                            as={Input}
                                            id="role_id"
                                            name="role_id"
                                            type="select"
                                        >
                                            <option value="">Select Role</option>
                                            {roles.map((role) => (
                                                <option key={role.id} value={role.id}>
                                                    {role.name}
                                                </option>
                                            ))}
                                        </Field>
                                        <ErrorMessage name="role_id" component="div" className="text-danger" />
                                    </FormGroup>
                                </Col>
                                <Col md="6">
                                    <FormGroup>
                                        <Label for="institute">Institute*</Label>
                                        <Field
                                            as={Input}
                                            id="institute"
                                            name="institute"
                                            type="select"
                                        >
                                            <option value="">Select Institute</option>
                                            <option value="NIOH">NIOH</option>
                                            <option value="ROHC">ROHC</option>
                                        </Field>
                                        <ErrorMessage name="institute" component="div" className="text-danger" />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col md="6">
                                    <FormGroup>
                                        <Label for="email">Email*</Label>
                                        <Field
                                            as={Input}
                                            id="email"
                                            name="email"
                                            type="email"
                                        />
                                        <ErrorMessage name="email" component="div" className="text-danger" />
                                    </FormGroup>
                                </Col>
                                {formMode === 'create' && (
                                    <Col md="6">
                                        <FormGroup>
                                            <Label for="password">Password*</Label>
                                            <Field
                                                as={Input}
                                                id="password"
                                                name="password"
                                                type="password"
                                            />
                                            <ErrorMessage name="password" component="div" className="text-danger" />
                                        </FormGroup>
                                    </Col>
                                )}
                            </Row>
                            <Button color="primary" type="submit" className='mt-2' disabled={isSubmitting}>
                                Save
                            </Button>
                            <Button color="secondary" className='mt-2' onClick={() => setFormOpen(false)}>
                                Cancel
                            </Button>
                        </Form>
                    )}
                </Formik>
            </div>
        </Modal>
    );
}