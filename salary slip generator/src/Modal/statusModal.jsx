import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Input, FormGroup, Label, Button } from 'reactstrap';

function StatusModal({ isOpen, toggle, modalType, selectedStatus, setSelectedStatus, handleSave }) {
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
            value={selectedStatus?.status || ''}
            onChange={(e) =>
              setSelectedStatus((prev) => ({
                ...prev,
                status: e.target.value,
              }))
            }
          >
            <option value="select" disabled>
              Select Status
            </option>
            <option value="Active">Active</option>
            <option value="Suspended">Suspended</option>
            <option value="Resigned">Resigned</option>
            <option value="Retired">Retired</option>
            <option value="On Leave">On Leave</option>
          </Input>
        </FormGroup>
        <FormGroup>
          <Label for="effectiveFrom">Effective From</Label>
          <Input
            type="date"
            id="effectiveFrom"
            value={selectedStatus?.effective_from || ''}
            onChange={(e) =>
              setSelectedStatus((prev) => ({
                ...prev,
                effective_from: e.target.value,
              }))
            }
          />
        </FormGroup>
        <FormGroup>
          <Label for="effectiveTill">Effective Till</Label>
          <Input
            type="date"
            id="effectiveTill"
            value={selectedStatus?.effective_till || ''}
            onChange={(e) =>
              setSelectedStatus((prev) => ({
                ...prev,
                effective_till: e.target.value,
              }))
            }
          />
        </FormGroup>
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

export default StatusModal;