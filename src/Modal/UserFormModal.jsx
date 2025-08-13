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
        { id: 2, name: "Director" },
        { id: 3, name: "Senior AO" },
        { id: 4, name: 'Administrative Officer' },
        { id: 5, name: 'Drawing and Disbursing Officer (NIOH)' },
        { id: 6, name: 'Drawing and Disbursing Officer (ROHC)' },
        { id: 7, name: 'Section Officer (Accounts)' },
        { id: 8, name: 'Accounts Officer' },
        { id: 9, name: 'Salary Processing Coordinator (NIOH)' },
        { id: 10, name: 'Salary Processing Coordinator (ROHC)' },
        { id: 11, name: "Pensioners Operator" },
        { id: 12, name: 'End Users' },
    ];


    const validate = values => {
        const errors = {};
        if (!values.first_name) errors.first_name = "required";
        if (!values.employee_code) errors.employee_code = "required";
        
        // Email validation based on status
        if (values.status === 'Working' && !values.email) {
            errors.email = "Email is required for working users";
        }
        
        // Password validation based on status and form mode
        if (formMode === 'create') {
            if (values.status === 'Working' && !values.password) {
                errors.password = "Password is required for working users";
            }
        }
        
        if (!values.institute) errors.institute = "required";
        if (values.roles === '') errors.roles = "required";
        if (!values.status) errors.status = "required";
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
                    initialValues={formData}
                    validate={validate}
                    onSubmit={handleSubmit}
                    enableReinitialize={true}
                >
                    {({ isSubmitting, values }) => (
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
                                        <Label for="last_name">Last Name</Label>
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
                                            className="text-uppercase"
                                        />
                                        <ErrorMessage name="employee_code" component="div" className="text-danger" />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col md="6">
                                    <FormGroup>
                                        <Label for="roles">Role*</Label>
                                        <Field
                                            as={Input}
                                            id="roles"
                                            name="roles"
                                            type="select"
                                        >
                                            <option value="">Select Role</option>
                                            {roles.map((role) => (
                                                <option key={role.id} value={role.id}>
                                                    {role.name}
                                                </option>
                                            ))}
                                        </Field>
                                        <ErrorMessage name="roles" component="div" className="text-danger" />
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
                                            <option value="BOTH">BOTH</option>
                                        </Field>
                                        <ErrorMessage name="institute" component="div" className="text-danger" />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col md="6">
                                    <FormGroup>
                                        <Label for="status">Status*</Label>
                                        <Field
                                            as={Input}
                                            id="status"
                                            name="status"
                                            type="select"
                                        >
                                            <option value="Working">Working</option>
                                            <option value="Retired">Retired</option>
                                        </Field>
                                        <ErrorMessage name="status" component="div" className="text-danger" />
                                    </FormGroup>
                                </Col>
                                <Col md="6">
                                    <FormGroup>
                                        <Label for="email">
                                            Email{values.status === 'Working' ? '*' : ' (Optional for Retired)'}
                                        </Label>
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
                                            <Label for="password">
                                                Password{values.status === 'Working' ? '*' : ' (Optional for Retired)'}
                                            </Label>
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
