import React, { useState, useEffect } from 'react'
import {
    Button,
    FormGroup,
    Label,
    Col,
    Row,
    Card,
    CardBody,
} from "reactstrap";
import { NavLink, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { UpdateEmployee } from '../../redux/slices/employeeSlice';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchEmployeeById } from '../../redux/slices/employeeSlice';
import { toast } from 'react-toastify';
import { months } from 'utils/helpers';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { increamentMonths } from 'utils/helpers';


function EmployeeEditForm() {

    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const employeeDetail = useSelector((state) => state.employee.EmployeeDetail);
    const error = useSelector((state) => state.employee.error);

    const [initialValues, setInitialValues] = useState({
        first_name: '',
        last_name: '',
        gender: '',
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
        institute: '',
        middle_name: '',
        user_id: '',
        prefix: '',
        employee_code: '',
    });

    useEffect(() => {
        if (id) {
            dispatch(fetchEmployeeById(id));
        }
    }, [id, dispatch]);


    useEffect(() => {
        if (employeeDetail) {
            setInitialValues({
                ...employeeDetail,
                pwd_status: !!employeeDetail.pwd_status,
                gis_eligibility: !!employeeDetail.gis_eligibility,
                credit_society_member: !!employeeDetail.credit_society_member,
                uniform_allowance_eligibility: !!employeeDetail.uniform_allowance_eligibility,
                hra_eligibility: !!employeeDetail.hra_eligibility,
                npa_eligibility: !!employeeDetail.npa_eligibility,
                prefix: employeeDetail.prefix || '',
                first_name: employeeDetail.first_name || '',
                middle_name: employeeDetail.middle_name || '',
                last_name: employeeDetail.last_name || '',
                gender: employeeDetail.gender || '',
                institute: employeeDetail.institute || '',
                employee_code: employeeDetail.employee_code || '',
                email: employeeDetail.email || '',
                pancard: employeeDetail.pancard || '',
                pension_scheme: employeeDetail.pension_scheme || '',
                pension_number: employeeDetail.pension_number || '',
                increment_month: employeeDetail.increment_month || '',
                gis_no: employeeDetail.gis_no || '',
                date_of_birth: employeeDetail.date_of_birth || "",
                date_of_joining: employeeDetail.date_of_joining || "",
                date_of_retirement: employeeDetail.date_of_retirement || "",
                user_id: employeeDetail.user_id || '',
            });
        }
    }, [employeeDetail, dispatch]);


    const validationSchema = Yup.object({
        first_name: Yup.string().required('First Name is required'),
        gender: Yup.string().oneOf(['male', 'female', 'other'], 'Invalid Gender').required('Gender is required'),
        date_of_birth: Yup.date().required('Date of Birth is required').max(new Date(), 'Date of Birth cannot be in the future'),
        date_of_joining: Yup.date().required('Date of Joining is required'),
        date_of_retirement: Yup.date().nullable().transform((value, originalValue) => { return originalValue === '' ? null : value; }),
        pension_scheme: Yup.string().oneOf(['GPF', 'NPS'], 'Invalid Pension Scheme').required('Pension Scheme is required'),
        // email: Yup.string().email('Invalid email format').required('Email is required'),       
        institute: Yup.string().oneOf(['NIOH', 'ROHC', 'BOTH'], 'Invalid Institute').required('Institute is required'),
        // pancard: Yup.string().matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN format').required('PAN Card is required'),
        middle_name: Yup.string().max(50, 'Middle Name too long'),
        // user_id: Yup.string().max(50, 'User ID too long'),
        prefix: Yup.string().oneOf(['Mr.', 'Mrs.', 'Ms.', 'Dr.'], 'Invalid prefix').required('Prefix is required'),
        employee_code: Yup.string().max(50, 'Employee Code too long'),
    });


    const onSubmit = async (values, { setSubmitting }) => {
        try {
            const employeeData = {
                ...values,
                // Convert booleans to 1 or 0 for the API
                pwd_status: values.pwd_status ? 1 : 0,
                gis_eligibility: values.gis_eligibility ? 1 : 0,
                credit_society_member: values.credit_society_member ? 1 : 0,
                uniform_allowance_eligibility: values.uniform_allowance_eligibility ? 1 : 0,
                hra_eligibility: values.hra_eligibility ? 1 : 0,
                npa_eligibility: values.npa_eligibility ? 1 : 0,
            };

            await dispatch(UpdateEmployee({ employeeId: id, employeeData })).unwrap()
                .then((res) => {
                    toast.success(res.successMsg || "Employee updated successfully");
                    navigate(`/employee/edit/${id}`);
                })

        } catch (err) {
            const apiMsg = err?.response?.data?.message || err?.message || err?.errorMsg || 'Failed to update employee.';
            toast.error(apiMsg);
        } finally {
            setSubmitting(false);
        }
    };


    return (
        <div>
            <div className='header bg-gradient-info pb-8 pt-8 pt-md-8 main-head'></div>
            <div className='mt--7 mb-7 container-fluid'>
                <Card className="shadow border-0">
                    <CardBody>
                        <Formik
                            enableReinitialize
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit={onSubmit}
                        >
                            {({ isSubmitting, values, setFieldValue, errors, touched }) => (
                                <Form>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <h4 className="mb-4">{'Edit Employee'}</h4>
                                        <NavLink to={`/employee/${id}`}>
                                            <Button
                                                style={{ background: "#004080", color: '#fff' }}
                                                type="button"
                                            >
                                                Back
                                            </Button>
                                        </NavLink>
                                    </div>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        {/* Personal Details */}
                                        <Row>
                                            <Col md={3}>
                                                <FormGroup>
                                                    <Label for="prefix">Prefix*</Label>
                                                    <Field
                                                        as="select"
                                                        id="prefix"
                                                        name="prefix"
                                                        className="form-control"
                                                    >
                                                        <option value=''>Select Prefix</option>
                                                        <option value="Mr.">Mr.</option>
                                                        <option value="Mrs.">Mrs.</option>
                                                        <option value="Ms.">Ms.</option>
                                                        <option value="Dr.">Dr.</option>
                                                    </Field>
                                                    <ErrorMessage name="prefix" component="p" className="text-red-600 text-sm mt-1" />
                                                </FormGroup>
                                            </Col>
                                            <Col md={3}>
                                                <FormGroup>
                                                    <Label>First Name*</Label>
                                                    <Field disabled name="first_name" className="form-control text-capitalize" />
                                                    <ErrorMessage name="first_name" component="p" className="text-danger text-sm mt-1" />
                                                </FormGroup>
                                            </Col>
                                            <Col md={3}>
                                                <FormGroup>
                                                    <Label>Middle Name</Label>
                                                    <Field disabled name="middle_name" className="form-control text-capitalize" />
                                                </FormGroup>
                                            </Col>
                                            <Col md={3}>
                                                <FormGroup>
                                                    <Label>Last Name*</Label>
                                                    <Field disabled name="last_name" className="form-control text-capitalize" />
                                                </FormGroup>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label>Gender*</Label>
                                                    <Field as="select" name="gender" className="form-control">
                                                        <option value=''>Select Gender</option>
                                                        <option value="male">Male</option>
                                                        <option value="female">Female</option>
                                                        <option value="other">Other</option>
                                                    </Field>
                                                    <ErrorMessage name="gender" component="p" className="text-danger text-sm mt-1" />
                                                </FormGroup>
                                            </Col>

                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label>Date of Birth*</Label>
                                                    <DatePicker
                                                        format="DD-MM-YYYY"
                                                        className='form-control'
                                                        value={values.date_of_birth ? dayjs(values.date_of_birth) : null}
                                                        onChange={(date) => {
                                                            const formatted = date ? dayjs(date).format('YYYY-MM-DD') : '';
                                                            setFieldValue("date_of_birth", formatted);
                                                        }}
                                                        slotProps={{
                                                            textField: {
                                                                fullWidth: true,
                                                                error: touched.date_of_birth && Boolean(errors.date_of_birth),
                                                                helperText: touched.date_of_birth && errors.date_of_birth,
                                                            },
                                                        }}
                                                    />
                                                    {/* <Field type="date" name="date_of_birth" className="form-control" /> */}
                                                </FormGroup>
                                            </Col>
                                        </Row>

                                        {/* Employment Info */}
                                        <Row>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label>Employee Code</Label>
                                                    <Field name="employee_code" disabled className="form-control" />
                                                    <ErrorMessage name="employee_code" component="p" className="text-danger text-sm mt-1" />
                                                </FormGroup>
                                            </Col>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label>Institute*</Label>
                                                    <Field as="select" disabled name="institute" className="form-control">
                                                        <option value=''>Select Institute</option>
                                                        <option value="NIOH">NIOH</option>
                                                        <option value="ROHC">ROHC</option>
                                                        <option value="BOTH">BOTH</option>
                                                    </Field>
                                                    <ErrorMessage name="institute" component="p" className="text-danger text-sm mt-1" />
                                                </FormGroup>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label>Date of Joining*</Label>
                                                    <DatePicker
                                                        format="DD-MM-YYYY"
                                                        value={values.date_of_joining ? dayjs(values.date_of_joining) : null}
                                                        onChange={(date) => {
                                                            const formatted = date ? dayjs(date).format('YYYY-MM-DD') : '';
                                                            setFieldValue("date_of_joining", formatted);
                                                        }}
                                                        slotProps={{
                                                            textField: {
                                                                fullWidth: true,
                                                                error: touched.date_of_joining && Boolean(errors.date_of_joining),
                                                                helperText: touched.date_of_joining && errors.date_of_joining,
                                                            },
                                                        }}
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label>Date of Retirement (if applicable)</Label>
                                                    <DatePicker
                                                        format="DD-MM-YYYY"
                                                        value={values.date_of_retirement ? dayjs(values.date_of_retirement) : null}
                                                        onChange={(date) => {
                                                            const formatted = date ? dayjs(date).format('YYYY-MM-DD') : '';
                                                            setFieldValue("date_of_retirement", formatted);
                                                        }}
                                                        slotProps={{
                                                            textField: {
                                                                fullWidth: true,
                                                                error: touched.date_of_retirement && Boolean(errors.date_of_retirement),
                                                                helperText: touched.date_of_retirement && errors.date_of_retirement,
                                                            },
                                                        }}
                                                    />
                                                    {/* <Field type="date" name="date_of_retirement" className="form-control" /> */}
                                                </FormGroup>
                                            </Col>
                                        </Row>

                                        {/* Contact Info */}
                                        <Row>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label>Email*</Label>
                                                    <Field disabled type="email" name="email" className="form-control" />
                                                </FormGroup>
                                            </Col>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label>PAN Card*</Label>
                                                    <Field name="pancard" className="form-control" />
                                                </FormGroup>

                                            </Col>
                                        </Row>

                                        {/* Pension & Scheme */}
                                        <Row>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label>Pension Scheme*</Label>
                                                    <Field as="select" name="pension_scheme" className="form-control">
                                                        <option value="Select">Select</option>
                                                        <option value="GPF">GPF</option>
                                                        <option value="NPS">NPS</option>
                                                    </Field>
                                                    <ErrorMessage name="pension_scheme" component="p" className="text-danger text-sm mt-1" />
                                                </FormGroup>
                                            </Col>

                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label>Pension Number</Label>
                                                    <Field name="pension_number" className="form-control" />
                                                </FormGroup>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label>GIS Number</Label>
                                                    <Field
                                                        name="gis_no"
                                                        className="form-control"
                                                        disabled={!values.gis_eligibility}
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label>Increment Month</Label>
                                                    <Field
                                                        as="select"
                                                        id="increment_month"
                                                        name="increment_month"
                                                        type="select"
                                                        className="form-control"
                                                    >
                                                        {increamentMonths.map((month) => (
                                                            <option key={month.value} value={String(month.value)}>{month.label}</option>
                                                        ))}
                                                    </Field>
                                                </FormGroup>
                                            </Col>
                                        </Row>

                                        {/* Eligibility Checkboxes */}
                                        <Row>
                                            <Col md={6}>
                                                <FormGroup className="d-flex align-items-center" style={{ gap: '10px' }}>
                                                    <Label for="hra_eligibility">HRA Eligibility</Label>
                                                    <Field type="checkbox" id="hra_eligibility" name="hra_eligibility" className="form-check" />
                                                </FormGroup>
                                            </Col>

                                            <Col md={6}>
                                                <FormGroup className="d-flex align-items-center" style={{ gap: '10px' }}>
                                                    <Label for="npa_eligibility">NPA Eligibility</Label>
                                                    <Field type="checkbox" id="npa_eligibility" name="npa_eligibility" className="form-check" />
                                                </FormGroup>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col md={6}>
                                                <FormGroup className="d-flex align-items-center" style={{ gap: '10px' }}>
                                                    <Label for="gis_eligibility">GIS Eligibility</Label>
                                                    <Field type="checkbox" id="gis_eligibility" name="gis_eligibility" className="form-check" />
                                                </FormGroup>
                                            </Col>

                                            <Col md={6}>
                                                <FormGroup className="d-flex align-items-center" style={{ gap: '10px' }}>
                                                    <Label for="uniform_allowance_eligibility">Uniform Allowance Eligibility</Label>
                                                    <Field type="checkbox" id="uniform_allowance_eligibility" name="uniform_allowance_eligibility" className="form-check" />
                                                </FormGroup>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col md={6}>
                                                <FormGroup className="d-flex align-items-center" style={{ gap: '10px' }}>
                                                    <Label for="pwd_status">PWD Status</Label>
                                                    <Field type="checkbox" id="pwd_status" name="pwd_status" className="form-check" />
                                                </FormGroup>
                                            </Col>

                                            <Col md={6}>
                                                <FormGroup className="d-flex align-items-center" style={{ gap: '10px' }}>
                                                    <Label for="credit_society_member">Credit Society Member</Label>
                                                    <Field type="checkbox" id="credit_society_member" name="credit_society_member" className="form-check" />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                    </LocalizationProvider>

                                    {/* Buttons */}
                                    <Button color="primary" type="submit" disabled={isSubmitting} className="mt-2">
                                        {isSubmitting ? 'Submitting...' : 'Submit'}
                                    </Button>
                                    <NavLink to={`/employee-management`}>
                                        <Button color="secondary" className="mt-2 ml-4">Cancel</Button>
                                    </NavLink>
                                </Form>
                            )}
                        </Formik>
                    </CardBody>
                </Card>
            </div>
        </div>
    )
}

export default EmployeeEditForm
