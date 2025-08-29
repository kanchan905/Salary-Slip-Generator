import React, { useState, useEffect } from 'react';
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Form,
    FormGroup,
    Label,
    Input,
    FormFeedback
} from 'reactstrap';

function DesignationFormModal({ isOpen, toggle, modalType, designation, onSave }) {
    const [formData, setFormData] = useState({
        name: '',
        options: ['']
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (designation && modalType === 'edit') {
            setFormData({
                name: designation.name || '',
                options: Array.isArray(designation.options) && designation.options.length > 0 ? designation.options : ['']
            });
        } else {
            setFormData({
                name: '',
                options: ['']
            });
        }
        setErrors({});
    }, [designation, modalType, isOpen]);

    const handleNameChange = (e) => {
        const { value } = e.target;
        setFormData(prev => ({ ...prev, name: value }));
        if (errors.name) {
            setErrors(prev => ({ ...prev, name: '' }));
        }
    };

    const handleOptionChange = (index, value) => {
        const updated = [...formData.options];
        updated[index] = value;
        setFormData(prev => ({ ...prev, options: updated }));
        if (errors.options) {
            setErrors(prev => ({ ...prev, options: '' }));
        }
    };

    const addOption = () => {
        setFormData(prev => ({ ...prev, options: [...prev.options, ''] }));
    };

    const validate = () => {
        const newErrors = {};
        const trimmedName = formData.name.trim();
        const cleanedOptions = formData.options.map(opt => (opt || '').trim()).filter(Boolean);

        if (!trimmedName) {
            newErrors.name = 'Designation name is required';
        } else if (trimmedName.length < 2) {
            newErrors.name = 'Designation name must be at least 2 characters';
        }

        if (cleanedOptions.length === 0) {
            newErrors.options = 'Add at least one non-empty option';
        }

        setErrors(newErrors);
        return { isValid: Object.keys(newErrors).length === 0, cleanedOptions, trimmedName };
    };

    const handleSubmit = () => {
        const { isValid, cleanedOptions, trimmedName } = validate();
        if (isValid) {
            onSave({ name: trimmedName, options: cleanedOptions });
        }
    };

    return (
        <Modal isOpen={isOpen} toggle={toggle} size="md">
            <ModalHeader toggle={toggle}>
                {modalType === 'create' ? 'Add New Designation' : 'Edit Designation'}
            </ModalHeader>
            <ModalBody>
                <Form>
                    <FormGroup>
                        <Label for="name">Designation Name *</Label>
                        <Input
                            type="text"
                            name="name"
                            id="name"
                            value={formData.name}
                            onChange={handleNameChange}
                            invalid={!!errors.name}
                            placeholder="Enter designation name"
                        />
                        {errors.name && <FormFeedback>{errors.name}</FormFeedback>}
                    </FormGroup>

                    <FormGroup>
                        <Label>Options *</Label>
                        {formData.options.map((opt, idx) => (
                            <div key={idx} className="d-flex align-items-center mb-2">
                                <Input
                                    type="text"
                                    value={opt}
                                    onChange={(e) => handleOptionChange(idx, e.target.value)}
                                    placeholder={`Option ${idx + 1}`}
                                    invalid={!!errors.options && formData.options.every(o => !o?.trim())}
                                />
                            </div>
                        ))}
                        {errors.options && <div className="text-danger" style={{ fontSize: 12 }}>{errors.options}</div>}
                        <Button color="secondary" type="button" onClick={addOption}>
                            + Add Option
                        </Button>
                    </FormGroup>
                </Form>
            </ModalBody>
            <ModalFooter>
                <Button color="primary" onClick={handleSubmit}>
                    {modalType === 'create' ? 'Create' : 'Update'}
                </Button>
                <Button color="secondary" onClick={toggle}>
                    Cancel
                </Button>
            </ModalFooter>
        </Modal>
    );
}

export default DesignationFormModal; 