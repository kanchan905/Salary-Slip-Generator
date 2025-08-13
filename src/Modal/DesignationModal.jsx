import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Form, FormGroup, Label, Input, FormFeedback } from 'reactstrap';
import { fetchDesignationList } from '../redux/slices/memberStoreSlice';
import { Grid } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

function DesignationModal({ isOpen, toggle, modalType, selectedDesignation, setSelectedDesignation, handleSave }) {
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const designationList = useSelector((state) => state.memeberStore?.designationList) || [];


  useEffect(() => {
    dispatch(fetchDesignationList());
  }, [dispatch])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedDesignation((prev) => ({ ...prev, [name]: value }));
  };

  const defaultDesig = {
    designation: '',
    cadre: '',
    job_group: '',
    effective_from: '',
    effective_till: '',
    promotion_order_no: ''
  };

  const designationData = { ...defaultDesig, ...selectedDesignation };

  // Auto-select group if missing but designation is present (for edit mode)
  useEffect(() => {
    if (
      modalType === 'update' &&
      designationData.designation &&
      !designationData.designation_group &&
      designationList.length > 0
    ) {
      const foundGroup = designationList.find(group =>
        group.options && group.options.includes(designationData.designation)
      );
      if (foundGroup) {
        setSelectedDesignation(prev => ({
          ...prev,
          designation_group: foundGroup.name
        }));
      }
    }
    // eslint-disable-next-line
  }, [modalType, designationData.designation, designationList]);

  const validate = () => {
    const newErrors = {};
    if (!designationData.designation) newErrors.designation = 'Designation is required';
    if (!designationData.cadre) newErrors.cadre = 'Cadre is required';
    if (!designationData.job_group) newErrors.job_group = 'Job Group is required';
    if (!designationData.effective_from) newErrors.effective_from = 'Effective From is required';
    if (designationData.effective_till && designationData.effective_from && designationData.effective_till < designationData.effective_from) newErrors.effective_till = 'Effective Till cannot be before Effective From';
    setErrors(newErrors);
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
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Form>
            <FormGroup>
              <Label for="cadre">Cadre</Label>
              <Input
                type="select"
                name="cadre"
                id="cadre"
                value={designationData.cadre}
                onChange={handleChange}
                invalid={!!errors.cadre}
              >
                <option value="">Select Cadre</option>
                <option value="Scientific">Scientific</option>
                <option value="Technical">Technical</option>
                <option value="Administrative">Administrative</option>
              </Input>
              {errors.cadre && <div className="text-danger">{errors.cadre}</div>}
            </FormGroup>
            <Grid container spacing={2}>
              {/* Parent (for filter) */}
              <Grid item size={{ md: 6 }}>
                <FormGroup>
                  <Label for="designation_group">Designation Group</Label>
                  <Input
                    type="select"
                    name="designation_group"
                    id="designation_group"
                    value={designationData.designation_group || ''}
                    onChange={(e) =>
                      setSelectedDesignation((prev) => ({
                        ...prev,
                        designation_group: e.target.value,
                        designation: '', // clear sub when group changes
                      }))
                    }
                  >
                    <option value="">Select Group</option>
                    {designationList.map((group, i) => (
                      <option key={i} value={group.name}>
                        {group.name}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </Grid>

              {/* Sub Designation to Save */}
              <Grid item size={{ md: 6 }}>
                <FormGroup>
                  <Label for="designation">Designation</Label>
                  <Input
                    type="select"
                    name="designation"
                    id="designation"
                    value={designationData.designation}
                    onChange={handleChange}
                    invalid={!!errors.designation}
                  >
                    <option value="">Select Sub Designation</option>
                    {designationList
                      .find((group) => group.name === designationData.designation_group)
                      ?.options.map((desig, index) => (
                        <option key={index} value={desig}>
                          {desig}
                        </option>
                      ))}
                  </Input>
                  {errors.designation && (
                    <div className="text-danger">{errors.designation}</div>
                  )}
                </FormGroup>
              </Grid>
            </Grid>
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
              </Input>
              {errors.job_group && <div className="text-danger">{errors.job_group}</div>}
            </FormGroup>
            <FormGroup>
              <Label for="effective_from">Effective From</Label>
              <DatePicker
                format="DD-MM-YYYY"
                value={designationData.effective_from ? dayjs(designationData.effective_from) : null}
                onChange={(date) => {
                  setSelectedDesignation((prev) => ({
                    ...prev,
                    effective_from: date ? dayjs(date).format('YYYY-MM-DD') : ''
                  }));
                }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    name: 'effective_from',
                    error: !!errors.effective_from,
                    helperText: errors.effective_from
                  }
                }}
              />
              {errors.effective_from && <div className="text-danger">{errors.effective_from}</div>}
            </FormGroup>
            <FormGroup>
              <Label for="effective_till">Effective Till</Label>
              <DatePicker
                format="DD-MM-YYYY"
                value={designationData.effective_till ? dayjs(designationData.effective_till) : null}
                onChange={(date) => {
                  setSelectedDesignation((prev) => ({
                    ...prev,
                    effective_till: date ? dayjs(date).format('YYYY-MM-DD') : ''
                  }));
                }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    name: 'effective_till',
                    error: !!errors.effective_till,
                    helperText: errors.effective_till
                  }
                }}
              />
              {errors.effective_till && <FormFeedback>{errors.effective_till}</FormFeedback>}
            </FormGroup>
            <FormGroup>
              <Label for="promotion_order_no">Promotion Order No</Label>
              <Input
                type="text"
                name="promotion_order_no"
                id="promotion_order_no"
                value={designationData.promotion_order_no}
                onChange={handleChange}
              />
            </FormGroup>
          </Form>
        </LocalizationProvider>
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
