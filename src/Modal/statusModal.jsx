import { TextField } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
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

        <LocalizationProvider dateAdapter={AdapterDayjs}>
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
             <DatePicker
              format='DD-MM-YYYY'
              value={selectedStatus?.effective_from ? dayjs(selectedStatus.effective_from) : null}
              onChange={(date) =>
                setSelectedStatus((prev) => ({
                  ...prev,
                  effective_from: dayjs(date).format('YYYY-MM-DD'),
                }))
              }
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!errors.effective_from,
                  helperText: errors.effective_from,
                },
              }}
            />
            {errors.effective_from && <FormFeedback>{errors.effective_from}</FormFeedback>}
          </FormGroup>
          <FormGroup>
            <Label for="effectiveTill">Effective Till <span style={{ fontWeight: 'normal', fontSize: '0.875rem', color: '#888' }}>(Optional)</span></Label>
              <DatePicker
              format='DD-MM-YYYY'
                value={selectedStatus?.effective_till ? dayjs(selectedStatus.effective_till) : null}
                onChange={(date) =>
                  setSelectedStatus((prev) => ({
                    ...prev,
                    effective_till: date ? dayjs(date).format('YYYY-MM-DD') : '',
                  }))
                }
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!errors.effective_till,
                    helperText: errors.effective_till,
                  },
                }}
              />
            {errors.effective_till && <FormFeedback>{errors.effective_till}</FormFeedback>}
          </FormGroup>
          <FormGroup>
            <Label for="effectiveFrom">Remark (If applicable)</Label>
            <TextField
              fullWidth
              multiline
              rows={3}
              name="remarks"
              value={selectedStatus.remarks}
              onChange={(e) =>
                setSelectedStatus((prev) => ({
                  ...prev,
                  remarks: e.target.value,
                }))
              }
            />
          </FormGroup>
          <FormGroup>
            <Label for="effectiveFrom">Order Reference (If applicable)</Label>
            <TextField
              fullWidth
              multiline
              rows={3}
              name="order_reference"
              value={selectedStatus.order_reference}
              onChange={(e) =>
                setSelectedStatus((prev) => ({
                  ...prev,
                  order_reference: e.target.value,
                }))
              }
            />
          </FormGroup>
        </LocalizationProvider>
        <Button color="primary" onClick={onSave}>
          Save
        </Button>
        <Button color="secondary" onClick={toggle}>
          Cancel
        </Button>
      </ModalBody>
    </Modal>
  );
}

export default StatusModal;
