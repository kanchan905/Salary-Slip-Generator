import React from 'react'
import {
    Button,
    FormGroup,
    Label,
    Col,
    Row,
    Card,
    CardBody,
} from "reactstrap";
import { NavLink } from 'react-router-dom';
import * as Yup from 'yup';
import { storeEmployee } from '../../redux/slices/employeeSlice';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

function EmployeeForm() {

    const initialValues = {
        first_name: '',
        last_name: '',
        gender: 'Select Gender',
        date_of_birth: '',
        date_of_joining: '',
        date_of_retirement: '',
        pwd_status: false,
        pension_scheme: '',
        pension_number: '',
        gis_eligibility: false,
        gis_no: '',
        credit_society_member: false,
        email: '',
        pancard: '',
        increment_month: '',
        uniform_allowance_eligibility: false,
        hra_eligibility: false,
        npa_eligibility: false,
        status: '',
        effective_from: '',
        effective_till: '',
        remark: '',
        order_reference: '',
    };

    const dispatch = useDispatch();
    const error = useSelector((state) => state.employee.error);

    const validationSchema = Yup.object({
        first_name: Yup.string()
            .required('First Name is required')
            .max(50, 'First Name cannot exceed 50 characters'),
        last_name: Yup.string()
            .required('Last Name is required')
            .max(50, 'Last Name cannot exceed 50 characters'),
        gender: Yup.string().oneOf(['male', 'female', 'other'], 'Gender is required')
            .required('Gender is required'),
        date_of_birth: Yup.date()
            .required('Date of Birth is required')
            .max(new Date(), 'Date of Birth cannot be in the future'),
        date_of_joining: Yup.date()
            .required('Date of Joining is required'),
        date_of_retirement: Yup.date()
            .nullable()
            .min(Yup.ref('date_of_joining'), 'Date of Retirement must be after Date of Joining'),
        pension_scheme: Yup.string().oneOf(['GPF', 'NPS'], 'Pension Scheme is required')
            .required('Pension Scheme is required'),
        email: Yup.string()
            .email('Invalid email format')
            .required('Email is required'),
        pancard: Yup.string()
            .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN Card format')
            .required('PAN Card is required'),
        status: Yup.string()
            .required('Status is required'),
        effective_from: Yup.date()
            .required('Effective From date is required'),
    });

    const onSubmit = async (values, { setSubmitting , resetForm }) => {
        try {
            const processedValues = {
                ...values,
                pwd_status: values.pwd_status ? 1 : 0,
                gis_eligibility: values.gis_eligibility ? 1 : 0,
                credit_society_member: values.credit_society_member ? 1 : 0,
                uniform_allowance_eligibility: values.uniform_allowance_eligibility ? 1 : 0,
                hra_eligibility: values.hra_eligibility ? 1 : 0,
                npa_eligibility: values.npa_eligibility ? 1 : 0,
            };
            await dispatch(storeEmployee(processedValues)).unwrap()
                .then(() => {
                    toast.success("Employee created successfully");
                    resetForm();
                });
        } catch (err) {
            const apiMsg =
                err?.response?.data?.message ||
                err?.message ||
                err?.message ||
                'Failed to update employee.';
            toast.error(apiMsg);
        } finally {
            setSubmitting(false);
        }
    }

    const { name } = useSelector((state) => state.auth.user.role);

    return (
        <div>
            <div className='header bg-gradient-info pb-8 pt-8 pt-md-8 main-head'></div>
            <div className='mt--7 mb-7 container-fluid'>
                <Card className="shadow border-0">
                    <CardBody>
                        <Formik
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit={onSubmit}
                        >
                            {({ isSubmitting, errors }) => {
                                return (
                                    <Form>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <h4 className="mb-4">{'Create Employee'}</h4>
                                            <NavLink to={`/employee-management`}>
                                                <Button
                                                    style={{ background: "#004080", color: '#fff' }}
                                                    type="button"
                                                >
                                                    Back
                                                </Button>
                                            </NavLink>
                                        </div>
                                        <Row>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="first_name">First Name*</Label>
                                                    <Field
                                                        id="first_name"
                                                        name="first_name"
                                                        type="text"
                                                        className="form-control"
                                                    />
                                                    <ErrorMessage name="first_name" component="p" className="text-red-600 text-sm mt-1" />
                                                </FormGroup>
                                            </Col>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="last_name">Last Name*</Label>
                                                    <Field
                                                        id="last_name"
                                                        name="last_name"
                                                        type="text"
                                                        className="form-control"
                                                    />
                                                    <ErrorMessage name="last_name" component="p" className="text-red-600 text-sm mt-1" />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="pension_scheme">Pension Scheme*</Label>
                                                    <Field
                                                        as="select"
                                                        id="pension_scheme"
                                                        name="pension_scheme"
                                                        type="select"
                                                        className="form-control"
                                                    >
                                                        <option value="Select">Select</option>
                                                        <option value="GPF">GPF</option>
                                                        <option value="NPS">NPS</option>
                                                    </Field>
                                                </FormGroup>
                                            </Col>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="gis_no">GIS Number</Label>
                                                    <Field
                                                        id="gis_no"
                                                        name="gis_no"
                                                        type="text"
                                                        className="form-control"
                                                    />
                                                    <ErrorMessage name="gis_no" component="p" className="text-red-600 text-sm mt-1" />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="email">Email*</Label>
                                                    <Field
                                                        id="email"
                                                        name="email"
                                                        type="email"
                                                        className="form-control"
                                                    />
                                                    <ErrorMessage name="email" component="p" className="text-red-600 text-sm mt-1" />
                                                </FormGroup>
                                            </Col>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="pancard">PAN Card*</Label>
                                                    <Field
                                                        id="pancard"
                                                        name="pancard"
                                                        type="text"
                                                        className="form-control"
                                                    />
                                                    <ErrorMessage name="pancard" component="p" className="text-red-600 text-sm mt-1" />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="pension_number">Pension Number</Label>
                                                    <Field
                                                        id="pension_number"
                                                        name="pension_number"
                                                        type="text"
                                                        className="form-control"
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="increment_month">Increment Month</Label>
                                                    <Field
                                                        id="increment_month"
                                                        name="increment_month"
                                                        type="text"
                                                        className="form-control"
                                                    />
                                                    <ErrorMessage name="increment_month" component="p" className="text-red-600 text-sm mt-1" />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="remark">Remark</Label>
                                                    <Field
                                                        id="remark"
                                                        name="remark"
                                                        type="textarea"
                                                        className="form-control"
                                                    />
                                                    <ErrorMessage name="remark" component="p" className="text-red-600 text-sm mt-1" />
                                                </FormGroup>
                                            </Col>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="order_reference">Order Reference</Label>
                                                    <Field
                                                        id="order_reference"
                                                        name="order_reference"
                                                        type="text"
                                                        className="form-control"
                                                    />
                                                    <ErrorMessage name="order_reference" component="p" className="text-red-600 text-sm mt-1" />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="gender">Gender*</Label>
                                                    <Field
                                                        as="select"
                                                        id="gender"
                                                        name="gender"
                                                        type="select"
                                                        className="form-control"
                                                    >
                                                        <option value="Select Gender">Select Gender</option>
                                                        <option value="male">Male</option>
                                                        <option value="female">Female</option>
                                                        <option value="other">Other</option>
                                                    </Field>
                                                </FormGroup>
                                            </Col>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="status">Status*</Label>
                                                    <Field
                                                        as="select"
                                                        id="status"
                                                        name="status"
                                                        type="select"
                                                        className="form-control"
                                                    >
                                                        <option value="">Select Status</option>
                                                        <option value="Active">Active</option>
                                                        <option value="Inactive">Suspended</option>
                                                        <option value="Retired">Retired</option>
                                                        <option value="Resigned">Resigned</option>
                                                        <option value="On Leave">On Leave</option>
                                                    </Field>
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="date_of_joining">Date of Joining*</Label>
                                                    <Field
                                                        id="date_of_joining"
                                                        name="date_of_joining"
                                                        type="date"
                                                        className="form-control"
                                                    />
                                                    <ErrorMessage name="date_of_joining" component="p" className="text-red-600 text-sm mt-1" />
                                                </FormGroup>
                                            </Col>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="date_of_retirement">Date of Retirement*</Label>
                                                    <Field
                                                        id="date_of_retirement"
                                                        name="date_of_retirement"
                                                        type="date"
                                                        className="form-control"
                                                    />
                                                    <ErrorMessage name="date_of_retirement" component="p" className="text-red-600 text-sm mt-1" />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="effective_from">Effective From*</Label>
                                                    <Field
                                                        id="effective_from"
                                                        name="effective_from"
                                                        type="date"
                                                        className="form-control"
                                                    />
                                                    <ErrorMessage name="effective_from" component="p" className="text-red-600 text-sm mt-1" />
                                                </FormGroup>
                                            </Col>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="effective_till">Effective Till</Label>
                                                    <Field
                                                        id="effective_till"
                                                        name="effective_till"
                                                        type="date"
                                                        className="form-control"
                                                    />
                                                    <ErrorMessage name="effective_till" component="p" className="text-red-600 text-sm mt-1" />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="date_of_birth">Date of Birth*</Label>
                                                    <Field
                                                        id="date_of_birth"
                                                        name="date_of_birth"
                                                        type="date"
                                                        className="form-control"
                                                    />
                                                    <ErrorMessage name="date_of_birth" component="p" className="text-red-600 text-sm mt-1" />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={6}>
                                                <FormGroup className='d-flex align-items-center' style={{ gap: '10px' }}>
                                                    <Label for="hra_eligibility">HRA Eligibility</Label>
                                                    <Field
                                                        id="hra_eligibility"
                                                        name="hra_eligibility"
                                                        type="checkbox"
                                                        className="form-check"
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col md={6}>
                                                <FormGroup className='d-flex align-items-center' style={{ gap: '10px' }}>
                                                    <Label for="npa_eligibility">NPA Eligibility</Label>
                                                    <Field
                                                        id="npa_eligibility"
                                                        name="npa_eligibility"
                                                        type="checkbox"
                                                        className="form-check"
                                                    />
                                                    <ErrorMessage name="npa_eligibility" component="p" className="text-red-600 text-sm mt-1" />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={6}>
                                                <FormGroup className='d-flex align-items-center' style={{ gap: '10px' }}>
                                                    <Label for="gis_eligibility">GIS Eligibility</Label>
                                                    <Field
                                                        id="gis_eligibility"
                                                        name="gis_eligibility"
                                                        type="checkbox"
                                                        className="form-check"
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col md={6}>
                                                <FormGroup className='d-flex align-items-center' style={{ gap: '10px' }}>
                                                    <Label for="uniform_allowance_eligibility">Uniform Allowance Eligibility</Label>
                                                    <Field
                                                        id="uniform_allowance_eligibility"
                                                        name="uniform_allowance_eligibility"
                                                        type="checkbox"
                                                        className="form-check"
                                                    />
                                                    <ErrorMessage name="uniform_allowance_eligibility" component="p" className="text-red-600 text-sm mt-1" />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={6}>
                                                <FormGroup className='d-flex align-items-center' style={{ gap: '10px' }}>
                                                    <Label for="pwd_status">PWD Status</Label>
                                                    <Field
                                                        id="pwd_status"
                                                        name="pwd_status"
                                                        type="checkbox"
                                                        className="form-check"
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col md={6}>
                                                <FormGroup className='d-flex align-items-center' style={{ gap: '10px' }}>
                                                    <Label for="credit_society_member">Credit Society Member</Label>
                                                    <Field
                                                        id="credit_society_member"
                                                        name="credit_society_member"
                                                        type="checkbox"
                                                        className="form-check"
                                                    >
                                                    </Field>
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Button color="primary" type="submit" disabled={isSubmitting} className="mt-2">
                                            {isSubmitting ? 'Submitting...' : 'Submit'}
                                        </Button>
                                        <NavLink to={`/employee-management`}>
                                            <Button color="secondary" className="mt-2 ml-4">
                                                Cancel
                                            </Button>
                                        </NavLink>
                                    </Form>
                                )
                            }}
                        </Formik>
                    </CardBody>
                </Card>
            </div>
        </div>
    )
}

export default EmployeeForm
