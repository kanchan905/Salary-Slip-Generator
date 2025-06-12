import { useFormik } from 'formik';
import React, { useState } from 'react';
import { Modal, Button, Col, FormGroup, Input, Row } from 'reactstrap';
import { addCellToAPI } from '../redux/slices/levelCellSlice';
import * as Yup from "yup";
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

export default function MatrixCellFormModal({
  formOpen,
  toggleModal,
  commissionLevels,
}) {
    const dispatch = useDispatch();
    const [selectedLevel, setSelectedLevel] = useState(null);
        const formik = useFormik({
            initialValues: {
                id: selectedLevel || "",
                index: '',
                amount: '',
            },
            validationSchema: Yup.object({
                  id: Yup.string().required('Level ID is required'),
                  index: Yup.string().required('Index is required'),
                  amount: Yup.string().required('Amount is required'),
                }),
            enableReinitialize: true,
            onSubmit: async (values, { resetForm}) => {
                const response = await dispatch(addCellToAPI(values));
                if (response.payload?.successMsg) {
                    toast.success(response.payload.successMsg);
                    resetForm();
                } else {
                    toast.error(response.payload?.message || "Failed to add level.");
                }
            }
        })
    return (
        <Modal
            className="modal-dialog-centered"
            isOpen={formOpen}
            toggle={toggleModal}
            scrollable={true}
        >
            <div className="pt-4 pb-4 px-4 custom-scrollbar" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                <form onSubmit={formik.handleSubmit}>
                    <Row>
                        <Col>
                            <FormGroup>
                                <label htmlFor="commission_id" style={{ fontWeight: "bold" }}>Pay Matrix Cells</label>
                                <Input
                                    type="select"
                                    name="matrix_level_id"
                                    value={formik.values.id}
                                    onChange={(event) => setSelectedLevel(event.target.value)}
                                >   
                                {
                                    commissionLevels.map((commission) => (
                                        <option key={commission.id} value={commission.id}>
                                            {commission.name}
                                        </option>
                                    ))
                                }
                                </Input>
                                {formik.touched.pay_commission_id && formik.errors.pay_commission_id && (
                                    <div className="text-danger">{formik.errors.pay_commission_id}</div>
                                )}
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <FormGroup>
                                <Input
                                    name="index"
                                    placeholder="Index Name"
                                    value={formik.values.index}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.index && formik.errors.index && (
                                    <div className="text-danger">{formik.errors.index}</div>
                                )}
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <FormGroup>
                                <Input
                                    type='number'
                                    name="amount"
                                    placeholder="Amount"
                                    value={formik.values.description}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.amount && formik.errors.amount && (
                                    <div className="text-danger">{formik.errors.amount}</div>
                                )}
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <FormGroup>
                                <Button style={{ background: "#004080", color: '#fff' }} type="submit">
                                    Add Cell
                                </Button>
                               
                            </FormGroup>
                        </Col>
                    </Row>
                </form>
            </div>
        </Modal>
    );
}
