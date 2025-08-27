import React, { useEffect } from 'react';
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
    Input,
} from 'reactstrap';
import { Formik, Field, Form, ErrorMessage, FieldArray, useFormikContext } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import {
    fetchDaData,
    fetchHraData,
    fetchNpaData,
    fetchTransportData,
    fetchUniformData,
} from '../redux/slices/salarySlice';
import { fetchPayStructure } from '../redux/slices/payStructureSlice';



// --- Helper component for Total Pay calculation ---
const TotalPayCalculator = () => {
    // Access formik values and functions
    const { values, setFieldValue } = useFormikContext();

    // Destructure all the fields that contribute to the total pay
    const {
        basic_pay,
        da_amount,
        hra_amount,
        npa_amount,
        uniform_rate_amount,
        transport_amount,
        da_on_ta,
        spacial_pay,
        da_1,
        da_2,
        itc_leave_salary,
        govt_contribution,
        salary_arrears,
    } = values;

    useEffect(() => {
        // Function to safely parse numbers, defaulting to 0 if invalid
        const parseNum = (value) => parseFloat(value) || 0;

        // Calculate the sum of all salary arrears
        const arrearsTotal = salary_arrears.reduce((total, arrear) => {
            return total + parseNum(arrear.amount);
        }, 0);

        // Calculate the total pay by summing all individual components
        const total =
            parseNum(basic_pay) +
            parseNum(da_amount) +
            parseNum(hra_amount) +
            parseNum(npa_amount) +
            parseNum(uniform_rate_amount) +
            parseNum(transport_amount) +
            parseNum(da_on_ta) +
            parseNum(spacial_pay) +
            parseNum(da_1) +
            parseNum(da_2) +
            parseNum(itc_leave_salary) +
            parseNum(govt_contribution) +
            arrearsTotal;

        // Update the total_pay field in the form state
        setFieldValue('total_pay', Math.round(total));

    }, [
        // This effect will re-run whenever any of these values change
        basic_pay,
        da_amount,
        hra_amount,
        npa_amount,
        uniform_rate_amount,
        transport_amount,
        da_on_ta,
        spacial_pay,
        da_1,
        da_2,
        itc_leave_salary,
        // Using JSON.stringify ensures the effect runs if an arrear amount changes
        JSON.stringify(salary_arrears),
        setFieldValue
    ]);

    // This component renders nothing in the UI
    return null;
};


const validationSchema = Yup.object({
    // Validation rules can be expanded as needed
});

export default function PaySlipEditModal({ isOpen, toggle, data, onSave, employee }) {
    const dispatch = useDispatch();
    const { npaList, hraList, daList, uniformList, transportList } = useSelector((state) => state.salary);
    const { payStructure } = useSelector((state) => state.payStructure);

    const selectedStructure = payStructure.find(ps => ps.id === data?.pay_structure_id);

    useEffect(() => {
        if (isOpen) {
            dispatch(fetchDaData({ page: 1, limit: 1000 }));
            dispatch(fetchHraData({ page: 1, limit: 1000 }));
            dispatch(fetchNpaData({ page: 1, limit: 1000 }));
            dispatch(fetchUniformData({ page: 1, limit: 1000 }));
            dispatch(fetchPayStructure({ page: 1, limit: 1000, search: '' }));
            dispatch(fetchTransportData({ page: 1, limit: 1000 }));
        }
    }, [isOpen, dispatch]);

    const formInitialValues = {
        net_salary_id: data?.net_salary_id || '',
        pay_structure_id: data?.pay_structure_id || '',
        basic_pay: data.basic_pay || '',
        da_rate_id: data?.da_rate_id || '',
        da_amount: data?.da_amount || 0,
        hra_rate_id: data?.hra_rate_id || '',
        hra_amount: data?.hra_amount || 0,
        npa_rate_id: data?.npa_rate_id || '',
        npa_amount: data?.npa_amount || 0,
        uniform_rate_id: data?.uniform_rate_id || '',
        uniform_rate_amount: data?.uniform_rate_amount || 0,
        transport_amount: data?.transport_amount || 0,
        da_on_ta: data?.da_on_ta || 0,
        govt_contribution: data?.govt_contribution || 0,
        spacial_pay: data?.spacial_pay || data?.spacial_pay || '',
        da_1: data?.da_1 || '',
        da_2: data?.da_2 || '',
        itc_leave_salary: data?.itc_leave_salary || '',
        salary_arrears: data?.salary_arrears || [],
        remarks: data.remarks || '',
        total_pay: data?.total_pay || '',
    };


    const onSubmit = async (values, { setSubmitting }) => {
        try {
            console.log("Submitting values:", values.npa_rate_id); // Debugging line
            await onSave(values);
            toggle();
        } catch (error) {
            toast.error('Failed to save pay slip data');
        } finally {
            setSubmitting(false);
        }
    };

    const arrearTypes = [
        'NPA Arrear', 'DA Arrear', 'HRA Arrear', 'TA Arrear', 'DA on TA Arrear',
        'NPS-Government contribution(14%) Arrear', 'Uniform Arrear', 'LTC Arrear',
        'PAY FIXATION  Arrear', 'Honorarium Arrear', 'CEA(CHILD EDUCATION ALLOWANCE)',
        'NPS -Employee contribution(10%) Arrear', 'GPF Arrear', 'Income Tax Arrear',
        'Professional Tax Arrear', 'License fee Arrear', 'NFCH donation Arrear',
        'LIC Arrear', 'Credit society Arrear', 'Employee loan Arrear',
    ];

    return (
        <Modal isOpen={isOpen} toggle={toggle} size="xl" backdrop="static" centered>
            <ModalHeader toggle={toggle}>Edit Pay Slip for {employee?.name}</ModalHeader>
            <Formik
                initialValues={formInitialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
                enableReinitialize
            >
                {({ isSubmitting, values }) => (
                    <Form>
                        {/* Place the updater component here. It has access to Formik's context. */}
                        {/* <CalculationUpdater
                            selectedStructure={selectedStructure}
                            transportList={transportList}
                            daList={daList}
                            hraList={hraList}
                            npaList={npaList}
                            employee={employee}
                        /> */}

                        <TotalPayCalculator />

                        <ModalBody>
                            <Row>
                                <Col md={4}>
                                    <FormGroup>
                                        <Label for="pay_structure_id">Basic Pay</Label>
                                        {/* <Input
                                            type="text"
                                            value={`${selectedStructure?.pay_matrix_cell?.pay_matrix_level?.name || ''} - ${selectedStructure?.pay_matrix_cell?.index} - ₹${selectedStructure?.pay_matrix_cell?.amount}`}

                                        /> */}
                                        <Field name="basic_pay" type="text" className="form-control" />
                                    </FormGroup>
                                </Col>
                                <Col md={4}>
                                    <FormGroup>
                                        <Label for="remarks">Remarks</Label>
                                        <Field name="remarks" type="text" className="form-control" />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <hr />
                            <Row>
                                {/* {data?.da_amount > 0 && (
                                    <> */}
                                <Col md={3}>
                                    <FormGroup>
                                        <Label for="da_rate_id">DA Rate</Label>
                                        <Field as="select" name="da_rate_id" className="form-control">
                                            <option value="">Select DA Rate</option>
                                            {daList.map((da) => (<option key={da.id} value={da.id}>{da.rate_percentage}%</option>))}
                                        </Field>
                                    </FormGroup>
                                </Col>
                                <Col md={3}>
                                    <FormGroup>
                                        <Label for="da_amount">DA Amount</Label>
                                        <Field name="da_amount" type="text" className="form-control" />
                                    </FormGroup>
                                </Col>
                                {/* </>
                                )} */}

                                {/* {data?.hra_amount > 0 && (
                                    <> */}
                                <Col md={3}>
                                    <FormGroup>
                                        <Label for="hra_rate_id">HRA Rate</Label>
                                        <Field as="select" name="hra_rate_id" className="form-control">
                                            <option value="">Select HRA Rate</option>
                                            {hraList.map((hra) => (<option key={hra.id} value={hra.id}>{hra.rate_percentage}%</option>))}
                                        </Field>
                                    </FormGroup>
                                </Col>
                                <Col md={3}>
                                    <FormGroup>
                                        <Label for="hra_amount">HRA Amount</Label>
                                        <Field name="hra_amount" type="text" className="form-control" />
                                    </FormGroup>
                                </Col>
                                {/* </>
                                )} */}

                                {/* {data?.npa_amount > 0 && (
                                    <> */}
                                <Col md={3}>
                                    <FormGroup>
                                        <Label for="npa_rate_id">NPA Rate</Label>
                                        {/* <Field as="select" name="npa_rate_id" className="form-control">                            
                                                    {npaList.map((npa) => (<option key={npa.id} value={npa.id}>{npa.rate_percentage}%</option>))}
                                                </Field> */}
                                        <Field as="select" name="npa_rate_id" className="form-control">
                                            <option value="">Select NPA Rate</option> 
                                            {npaList.map((npa) => (
                                                <option key={npa.id} value={npa.id}>
                                                    {npa.rate_percentage}%
                                                </option>
                                            ))}
                                        </Field>
                                    </FormGroup>
                                </Col>
                                <Col md={3}>
                                    <FormGroup>
                                        <Label for="npa_amount">NPA Amount</Label>
                                        <Field name="npa_amount" type="text" className="form-control" />
                                    </FormGroup>
                                </Col>
                                {/* </>
                                )} */}

                                {/* {data?.transport_amount > 0 && (
                                    <> */}
                                <Col md={3}>
                                    <FormGroup>
                                        <Label for="transport_amount">Transport Amount</Label>
                                        <Field name="transport_amount" type="text" className="form-control" />
                                    </FormGroup>
                                </Col>
                                <Col md={3}>
                                    <FormGroup>
                                        <Label for="da_on_ta">DA on TA</Label>
                                        <Field name="da_on_ta" type="text" className="form-control" />
                                    </FormGroup>
                                </Col>
                                {/* </>
                                )} */}

                                {/* {data?.uniform_rate_amount > 0 && (
                                    <> */}
                                <Col md={3}>
                                    <FormGroup>
                                        <Label for="uniform_rate_id">Uniform Allowance</Label>
                                        <Field as="select" name="uniform_rate_id" className="form-control">
                                            <option value="">Select Uniform Rate</option>
                                            {uniformList.map((uniform) => (
                                                <option key={uniform.id} value={uniform.id}>Post {uniform.applicable_post} - ₹{uniform.amount}</option>
                                            ))}
                                        </Field>
                                    </FormGroup>
                                </Col>
                                <Col md={3}>
                                    <FormGroup>
                                        <Label for="uniform_rate_amount">Uniform Amount</Label>
                                        <Field name="uniform_rate_amount" type="text" className="form-control" />
                                    </FormGroup>
                                </Col>
                                {/* </>
                                )} */}

                                {employee?.pension_scheme === "NPS" && (
                                    <Col md={3}>
                                        <FormGroup>
                                            <Label for="govt_contribution">Govt. Contribution (NPS)</Label>
                                            <Field name="govt_contribution" type="text" className="form-control" />
                                        </FormGroup>
                                    </Col>
                                )}
                            </Row>
                            <hr />
                            <h5 className="mb-3">Other Pay & Allowances</h5>
                            <Row>
                                <Col md={3}>
                                    <FormGroup>
                                        <Label for="spacial_pay">Special Pay</Label>
                                        <Field name="spacial_pay" type="text" className="form-control" />
                                        <ErrorMessage name="spacial_pay" component="p" className="text-danger" />
                                    </FormGroup>
                                </Col>
                                <Col md={3}><FormGroup><Label for="da_1">DA 1</Label><Field name="da_1" type="text" className="form-control" /><ErrorMessage name="da_1" component="p" className="text-danger" /></FormGroup></Col>
                                <Col md={3}><FormGroup><Label for="da_2">DA 2</Label><Field name="da_2" type="text" className="form-control" /><ErrorMessage name="da_2" component="p" className="text-danger" /></FormGroup></Col>
                                <Col md={3}><FormGroup><Label for="itc_leave_salary">ITC Leave Salary</Label><Field name="itc_leave_salary" type="text" className="form-control" /><ErrorMessage name="itc_leave_salary" component="p" className="text-danger" /></FormGroup></Col>
                            </Row>

                            <hr />
                            <h5 className="mb-3">Salary Arrears</h5>
                            <FieldArray name="salary_arrears">
                                {({ push, remove }) => (
                                    <div>
                                        {values.salary_arrears && values.salary_arrears.map((arrear, index) => {
                                            const isCustomType = arrear.type && !arrearTypes.includes(arrear.type);
                                            return (
                                                <Row key={index} className="mb-2 align-items-start">
                                                    <Col md={3}><FormGroup><Label for={`salary_arrears.${index}.type`}>Arrear Type</Label><Field as="select" name={`salary_arrears.${index}.type`} className="form-control"><option value="">Select a type...</option>{arrearTypes.map(type => (<option key={type} value={type}>{type}</option>))}{isCustomType && (<option value={arrear.type}>{arrear.type}</option>)}</Field><ErrorMessage name={`salary_arrears.${index}.type`} component="p" className="text-danger" /></FormGroup></Col>
                                                    <Col md={3}><FormGroup><Label for={`salary_arrears.${index}.amount`}>Amount</Label><Field name={`salary_arrears.${index}.amount`} type="text" className="form-control" /><ErrorMessage name={`salary_arrears.${index}.amount`} component="p" className="text-danger" /></FormGroup></Col>
                                                    <Col md={2} className="mt-4 pt-2"><Button color="danger" type="button" onClick={() => remove(index)}>Remove</Button></Col>
                                                </Row>
                                            );
                                        })}
                                        <Button type="button" color="info" className="mt-2" onClick={() => push({ type: '', amount: 0 })}>Add Arrear</Button>
                                    </div>
                                )}
                            </FieldArray>
                        </ModalBody>

                        <ModalFooter>
                            <div className="mr-auto">
                                <h4>Total Pay: ₹{values.total_pay}</h4>
                            </div>
                            <Button color="primary" type="submit" disabled={isSubmitting}>Save Changes</Button>
                            <Button color="secondary" onClick={toggle}>Cancel</Button>
                        </ModalFooter>
                    </Form>
                )}
            </Formik>
        </Modal>
    );
}