import React,{useState} from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Input, FormGroup, Label, Button, FormFeedback } from 'reactstrap';

function StatusModal({ isOpen, toggle, modalType, selectedStatus, setSelectedStatus, handleSave }) {
  const [errors, setErrors] = useState({});

  // Validate fields
  const validate = () => {
    const newErrors = {};
    if (!selectedStatus?.status || selectedStatus.status === '') {
      newErrors.status = 'Please select a status';
    }
    if (!selectedStatus?.effective_from) {
      newErrors.effective_from = 'Effective From is required';
    }
    // Optional: Validate effective_till is after effective_from
    if (
      selectedStatus?.effective_till &&
      selectedStatus.effective_from &&
      selectedStatus.effective_till < selectedStatus.effective_from
    ) {
      newErrors.effective_till = 'Effective Till cannot be before Effective From';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Wrap handleSave to include validation
  const onSave = () => {
    if (validate()) {
      handleSave();
      setErrors({});
    }
  };
  
  return (
    <Modal isOpen={isOpen} toggle={toggle} centered>
      <ModalHeader toggle={toggle}>
        {modalType === 'create' ? 'Add New Status' : 'Update Status'}
      </ModalHeader>
      <ModalBody>
        <FormGroup>
          <Label for="status">Status</Label>
          <Input
            type="select"
            id="status"
            invalid={!!errors.status}
            value={selectedStatus?.status || ''}
            onChange={(e) =>
              setSelectedStatus((prev) => ({
                ...prev,
                status: e.target.value,
              }))
            }
          >
            <option value="" disabled>
              Select Status
            </option>
            <option value="Active">Active</option>
            <option value="Suspended">Suspended</option>
            <option value="Resigned">Resigned</option>
            <option value="Retired">Retired</option>
            <option value="On Leave">On Leave</option>
          </Input>
          {errors.status && <FormFeedback>{errors.status}</FormFeedback>}
        </FormGroup>
        <FormGroup>
          <Label for="effectiveFrom">Effective From</Label>
          <Input
            type="date"
            id="effectiveFrom"
            invalid={!!errors.effective_from}
            value={selectedStatus?.effective_from || ''}
            onChange={(e) =>
              setSelectedStatus((prev) => ({
                ...prev,
                effective_from: e.target.value,
              }))
            }
          />
          {errors.effective_from && <FormFeedback>{errors.effective_from}</FormFeedback>}
        </FormGroup>
        <FormGroup>
          <Label for="effectiveTill">Effective Till</Label>
          <Input
            type="date"
            id="effectiveTill"
            invalid={!!errors.effective_till}
            value={selectedStatus?.effective_till || ''}
            onChange={(e) =>
              setSelectedStatus((prev) => ({
                ...prev,
                effective_till: e.target.value,
              }))
            }
          />
          {errors.effective_till && <FormFeedback>{errors.effective_till}</FormFeedback>}
        </FormGroup>
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

export default StatusModal;