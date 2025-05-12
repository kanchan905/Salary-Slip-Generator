import React,{useState} from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Form, FormGroup, Label, Input } from 'reactstrap';

function DesignationModal({ isOpen, toggle, modalType, selectedDesignation, setSelectedDesignation, handleSave }) {
  const [errors, setErrors] = useState({});
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedDesignation((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' })); 
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

  const validate = () => {
    const newErrors = {};
    if (!designationData.designation) newErrors.designation = 'Designation is required';
    if (!designationData.cadre) newErrors.cadre = 'Cadre is required';
    if (!designationData.job_group) newErrors.job_group = 'Job Group is required';
    if (!designationData.effective_from) newErrors.effective_from = 'Effective From is required';
    if (!designationData.effective_till) newErrors.effective_till = 'Effective Till is required';
    return newErrors;
  };

  const onSave = () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    handleSave();
  };

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
              invalid={!!errors.designation}
            />
            {errors.designation && <div className="text-danger">{errors.designation}</div>}
          </FormGroup>
          <FormGroup>
            <Label for="cadre">Cadre</Label>
            <Input
              type="text"
              name="cadre"
              id="cadre"
              value={designationData.cadre}
              onChange={handleChange}
              invalid={!!errors.cadre}
            />
            {errors.cadre && <div className="text-danger">{errors.cadre}</div>}
          </FormGroup>
          <FormGroup>
            <Label for="job_group">Job Group</Label>
            <Input
              type="select"
              name="job_group"
              id="job_group"
              value={designationData.job_group}
              onChange={handleChange}
              invalid={!!errors.job_group}
            >
              <option value="">Select Job Group</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
            </Input>
            {errors.job_group && <div className="text-danger">{errors.job_group}</div>}
          </FormGroup>
          <FormGroup>
            <Label for="effective_from">Effective From</Label>
            <Input
              type="date"
              name="effective_from"
              id="effective_from"
              value={designationData.effective_from}
              onChange={handleChange}
               invalid={!!errors.effective_from}
            />
            {errors.effective_from && <div className="text-danger">{errors.effective_from}</div>}
          </FormGroup>
          <FormGroup>
            <Label for="effective_till">Effective Till</Label>
            <Input
              type="date"
              name="effective_till"
              id="effective_till"
              value={designationData.effective_till}
              onChange={handleChange}
              invalid={!!errors.effective_till}
            />
            {errors.effective_till && <div className="text-danger">{errors.effective_till}</div>}
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={onSave}>
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