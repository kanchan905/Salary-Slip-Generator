import React from 'react';
import { Modal, Button, Col, FormGroup, Input, Row } from 'reactstrap';

export default function LevelFormModal({
  formOpen,
  toggleModal,
  formik,
  editingId,
  selectedCommissionId,
  commissionName
}) {
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
                            <label htmlFor="commission_id" style={{ fontWeight: "bold" }}>Commission</label>
                            <Input
                                type="select"
                                name="pay_commission_id"
                                value={formik.values.pay_commission_id}
                                disabled
                            >
                                <option value={selectedCommissionId}>{commissionName}</option>
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
                                name="levelName"
                                placeholder="Level Name"
                                value={formik.values.levelName}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.levelName && formik.errors.levelName && (
                                <div className="text-danger">{formik.errors.levelName}</div>
                            )}
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <FormGroup>
                            <Input
                                name="description"
                                placeholder="Description"
                                value={formik.values.description}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.description && formik.errors.description && (
                                <div className="text-danger">{formik.errors.description}</div>
                            )}
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <FormGroup>
                            <Button style={{ background: "#004080", color: '#fff' }} type="submit">
                                {editingId ? "Update Level" : "Add Level"}
                            </Button>
                            {editingId && (
                            <Button
                                type="button"
                                color="secondary"
                                onClick={() => {
                                formik.resetForm();
                                // Reset editingId in the parent
                                formik.setValues({ pay_commission_id: selectedCommissionId, levelName: "", description: "" });
                                }}
                            >
                                Cancel
                            </Button>
                            )}
                        </FormGroup>
                    </Col>
                </Row>
            </form>
        </div>
    </Modal>
  );
}
