import React, { useState } from 'react'
import {
    Button,
    Form,
    FormGroup,
    Input,
    Label,
    Col,
    Row,
    Card,
    CardBody,
} from "reactstrap";
import { useDispatch, useSelector } from 'react-redux';
import { addEmployee, updateEmployee } from '../../redux/slices/employeeSlice';
import { useParams } from 'react-router-dom';

function EmployeeForm() {

    const initialFormState = {
        name: '',
        email: '',
        designation: '',
        department: '',
        institute: 'NIOH',
        doj: '',
        bankAccount: '',
        ifsc: '',
        quarter: 'No',
        status: 'Active',
        document: null,
    };

    const { id } = useParams();
    const employees = useSelector((state)=> state.employee);
    const editingEmployee = employees.find(emp => emp.id === Number(id));
    const [formData, setFormData] = useState(editingEmployee || initialFormState);
    const dispatch  = useDispatch();


    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData({ ...formData, [name]: files ? files[0] : value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingEmployee) {
            dispatch(updateEmployee({ ...formData, id: editingEmployee.id }));
        } else {
            dispatch(addEmployee({ ...formData, id: Date.now() }));
        }
        setFormData(initialFormState);
    };
    return (
        <div>
            <div className='header bg-gradient-info pb-8 pt-8 pt-md-8 main-head'></div>
            <div className='mt--7 mb-7 container-fluid'>
                <Card className="shadow border-0">
                    <CardBody>
                        <Form onSubmit={handleSubmit}>
                            <h4 className="mb-4">{formData.name ? 'Edit Employee' : 'Create Employee'}</h4>
                            {/* Form Fields */}
                            <Row>
                                <Col md={6}>
                                    <FormGroup>
                                        <Label for="name">Full Name</Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            type="text"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md={6}>
                                    <FormGroup>
                                        <Label for="email">Email</Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={6}>
                                    <FormGroup>
                                        <Label for="designation">Designation</Label>
                                        <Input
                                            id="designation"
                                            name="designation"
                                            type="text"
                                            value={formData.designation}
                                            onChange={handleChange}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md={6}>
                                    <FormGroup>
                                        <Label for="department">Department</Label>
                                        <Input
                                            id="department"
                                            name="department"
                                            type="text"
                                            value={formData.department}
                                            onChange={handleChange}
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={6}>
                                    <FormGroup>
                                        <Label for="institute">Institute</Label>
                                        <Input
                                            id="institute"
                                            name="institute"
                                            type="select"
                                            value={formData.institute}
                                            onChange={handleChange}
                                        >
                                            <option value="NIOH">NIOH</option>
                                            <option value="ROHC">ROHC</option>
                                        </Input>
                                    </FormGroup>
                                </Col>
                                <Col md={6}>
                                    <FormGroup>
                                        <Label for="doj">Date of Joining</Label>
                                        <Input
                                            id="doj"
                                            name="doj"
                                            type="date"
                                            value={formData.doj}
                                            onChange={handleChange}
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={6}>
                                    <FormGroup>
                                        <Label for="bankAccount">Bank Account Number</Label>
                                        <Input
                                            id="bankAccount"
                                            name="bankAccount"
                                            type="text"
                                            value={formData.bankAccount}
                                            onChange={handleChange}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md={6}>
                                    <FormGroup>
                                        <Label for="ifsc">IFSC Code</Label>
                                        <Input
                                            id="ifsc"
                                            name="ifsc"
                                            type="text"
                                            value={formData.ifsc}
                                            onChange={handleChange}
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={6}>
                                    <FormGroup>
                                        <Label for="quarter">Quarter Allotted</Label>
                                        <Input
                                            id="quarter"
                                            name="quarter"
                                            type="select"
                                            value={formData.quarter}
                                            onChange={handleChange}
                                        >
                                            <option value="No">No</option>
                                            <option value="Yes">Yes</option>
                                        </Input>
                                    </FormGroup>
                                </Col>
                                <Col md={6}>
                                    <FormGroup>
                                        <Label for="status">Status</Label>
                                        <Input
                                            id="status"
                                            name="status"
                                            type="select"
                                            value={formData.status}
                                            onChange={handleChange}
                                        >
                                            <option value="Active">Active</option>
                                            <option value="Inactive">Inactive</option>
                                        </Input>
                                    </FormGroup>
                                </Col>
                            </Row>
                            <FormGroup>
                                <Label for="document">Upload Document</Label>
                                <Input
                                    id="document"
                                    name="document"
                                    type="file"
                                    onChange={handleChange}
                                />
                            </FormGroup>
                            <Button color="primary" type="submit" className='mt-2'>
                                Save
                            </Button>
                            <Button color="secondary" className='mt-2'>
                                cancel
                            </Button>
                        </Form>
                    </CardBody>
                </Card>
            </div>
        </div>
    )
}

export default EmployeeForm
