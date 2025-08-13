import { useFormik } from 'formik';
import React from 'react';
import { Modal, Button, Col, FormGroup, Input, Row, Label, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { addCellToAPI } from '../redux/slices/levelCellSlice';
import * as Yup from "yup";
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

export default function MatrixCellFormModal({
    formOpen,
    toggleModal,
    commissionLevels,
    onSuccess,
}) {
    const dispatch = useDispatch();

    const formik = useFormik({
        initialValues: {
            matrix_level_id: "", 
            index: '',
            amount: '',
        },
       
        validationSchema: Yup.object({
            matrix_level_id: Yup.string().required('A Level must be selected'),
            index: Yup.number().required('Index is required').positive('Index must be a positive number').integer(),
            amount: Yup.number().required('Amount is required').min(0, 'Amount cannot be negative'),
        }),
        enableReinitialize: true,
        onSubmit: async (values, { resetForm, setSubmitting }) => {
            try {
                const payload = {
                    matrix_level_id: Number(values.matrix_level_id), 
                    index: Number(values.index),
                    amount: Number(values.amount)
                };

                
               
                const response = await dispatch(addCellToAPI(payload)).unwrap();

                toast.success(response.successMsg || "Cell added successfully!");
                resetForm();
                onSuccess();
                toggleModal();
            } catch (error) {
                toast.error(error.message || "Failed to add cell.");
            } finally {
                setSubmitting(false);
            }
        }
    });

    return (
        <Modal
            className="modal-dialog-centered"
            isOpen={formOpen}
            toggle={toggleModal}
        >
            <ModalHeader toggle={toggleModal}>Add New Matrix Cell</ModalHeader>
            <ModalBody>
                <form onSubmit={formik.handleSubmit}>
                    <Row>
                        <Col>
                            <FormGroup>
                                <Label htmlFor="matrix_level_id" style={{ fontWeight: "bold" }}>Pay Level</Label>
                                <Input
                                    id="matrix_level_id"
                                    type="select"                                   
                                    name="matrix_level_id"
                                    value={formik.values.matrix_level_id}                                  
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    invalid={formik.touched.matrix_level_id && !!formik.errors.matrix_level_id}
                                >
                                    <option value="">-- Select a Level --</option>
                                    {commissionLevels.map((commission) => (
                                        <option key={commission.id} value={commission.id}>
                                            {commission.name}
                                        </option>
                                    ))}
                                </Input>                       
                                {formik.touched.matrix_level_id && formik.errors.matrix_level_id && (
                                    <div className="text-danger small mt-1">{formik.errors.matrix_level_id}</div>
                                )}
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <FormGroup>
                                <Label htmlFor="index" style={{ fontWeight: "bold" }}>Index</Label>
                                <Input
                                    id="index"
                                    name="index"
                                    placeholder="e.g., 1, 2, 3..."
                                    type="text"
                                    value={formik.values.index}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    invalid={formik.touched.index && !!formik.errors.index}
                                />
                                {formik.touched.index && formik.errors.index && (
                                    <div className="text-danger small mt-1">{formik.errors.index}</div>
                                )}
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <FormGroup>
                                <Label htmlFor="amount" style={{ fontWeight: "bold" }}>Amount</Label>
                                <Input
                                    id="amount"
                                    type='number'
                                    name="amount"
                                    placeholder="Amount"                                   
                                    value={formik.values.amount}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    invalid={formik.touched.amount && !!formik.errors.amount}
                                />
                                {formik.touched.amount && formik.errors.amount && (
                                    <div className="text-danger small mt-1">{formik.errors.amount}</div>
                                )}
                            </FormGroup>
                        </Col>
                    </Row>
              
                    <ModalFooter>
                        <Button color="secondary" type="button" onClick={toggleModal}>
                            Cancel
                        </Button>
                        <Button style={{ background: "#004080", color: '#fff' }} type="submit" disabled={formik.isSubmitting}>
                            {formik.isSubmitting ? "Adding..." : "Add Cell"}
                        </Button>
                    </ModalFooter>
                </form>
            </ModalBody>
        </Modal>
    );
}