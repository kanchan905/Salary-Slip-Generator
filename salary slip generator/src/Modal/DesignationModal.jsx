import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Form, FormGroup, Label, Input } from 'reactstrap';

function DesignationModal({ isOpen, toggle, modalType, selectedDesignation, setSelectedDesignation, handleSave }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedDesignation((prev) => ({ ...prev, [name]: value }));
  };

  // Ensure selectedBank has default values to avoid undefined
  const defaultDesig = {
    designation: '',
    cadre: '',
    job_group: '',
    effective_from: '',
    effective_till: '',
    promotion_order_no: ''
  };

  const designationData = { ...defaultDesig, ...selectedDesignation };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>
        {modalType === 'create' ? 'Add Designation' : 'Edit Designation'}
      </ModalHeader>
      <ModalBody>
        <Form>
          <FormGroup>
            <Label for="designation">Designation</Label>
            <Input
              type="text"
              name="designation"
              id="designation"
              value={designationData.designation}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label for="cadre">Cadre</Label>
            <Input
              type="text"
              name="cadre"
              id="cadre"
              value={designationData.cadre}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label for="job_group">Job Group</Label>
            <Input
              type="select"
              name="job_group"
              id="job_group"
              value={designationData.job_group}
              onChange={handleChange}
            >
              <option value="">Select Job Group</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
            </Input>
          </FormGroup>
          <FormGroup>
            <Label for="effective_from">Effective From</Label>
            <Input
              type="date"
              name="effective_from"
              id="effective_from"
              value={designationData.effective_from}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label for="effective_till">Effective Till</Label>
            <Input
              type="date"
              name="effective_till"
              id="effective_till"
              value={designationData.effective_till}
              onChange={handleChange}
            />
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleSave}>
          Save
        </Button>
        <Button color="secondary" onClick={toggle}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
}

export default DesignationModal;