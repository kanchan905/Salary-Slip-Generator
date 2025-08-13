import React, { useState } from 'react';
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
} from 'reactstrap';

function BankModal({ isOpen, toggle, modalType, selectedBank, setSelectedBank, handleSave }) {
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSelectedBank((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
        setErrors((prev) => ({ ...prev, [name]: '' }));
    };

    // Ensure selectedBank has default values to avoid undefined
    const defaultBank = {
        bank_name: '',
        branch_name: '',
        account_number: '',
        ifsc_code: '',
        effective_from: null,
        is_active: false,
    };

    const bankData = { ...defaultBank, ...selectedBank };

    const validate = () => {
        const newErrors = {};
        if (!bankData.bank_name.trim()) newErrors.bank_name = 'Bank name is required';
        if (!bankData.branch_name.trim()) newErrors.branch_name = 'Branch name is required';
        if (!bankData.account_number.trim()) newErrors.account_number = 'Account number is required';
        if (!bankData.ifsc_code.trim()) newErrors.ifsc_code = 'IFSC code is required';
        // if (!bankData.effective_from) newErrors.effective_from = 'Effective from date is required';

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
        <Modal isOpen={isOpen} toggle={toggle} centered>
            <ModalHeader toggle={toggle}>
                {modalType === 'create' ? 'Add Bank Details' : 'Edit Bank Details'}
            </ModalHeader>
            <ModalBody>
                <Form>
                    <FormGroup>
                        <Label for="bank_name">Bank Name</Label>
                        <Input
                            type="text"
                            name="bank_name"
                            id="bank_name"
                            value={bankData.bank_name}
                            onChange={handleChange}
                            placeholder="Enter bank name"
                            invalid={!!errors.bank_name}
                        />
                        {errors.bank_name && <div className="text-danger">{errors.bank_name}</div>}
                    </FormGroup>
                    <FormGroup>
                        <Label for="branch_name">Branch Name</Label>
                        <Input
                            type="text"
                            name="branch_name"
                            id="branch_name"
                            value={bankData.branch_name}
                            onChange={handleChange}
                            placeholder="Enter branch name"
                            invalid={!!errors.branch_name}
                        />
                        {errors.branch_name && <div className="text-danger">{errors.branch_name}</div>}
                    </FormGroup>
                    <FormGroup>
                        <Label for="account_number">Account Number</Label>
                        <Input
                            type="text"
                            name="account_number"
                            id="account_number"
                            value={bankData.account_number}
                            onChange={handleChange}
                            placeholder="Enter account number"
                            invalid={!!errors.account_number}
                        />
                        {errors.account_number && <div className="text-danger">{errors.account_number}</div>}
                    </FormGroup>
                    <FormGroup>
                        <Label for="ifsc_code">IFSC Code</Label>
                        <Input
                            type="text"
                            name="ifsc_code"
                            id="ifsc_code"
                            value={bankData.ifsc_code}
                            onChange={handleChange}
                            placeholder="Enter IFSC code"
                            invalid={!!errors.ifsc_code}
                        />
                        {errors.ifsc_code && <div className="text-danger">{errors.ifsc_code}</div>}
                    </FormGroup>
                    {/* <FormGroup>
                        <Label for="effective_from">Effective From</Label>
                        <Input
                            type="date"
                            name="effective_from"
                            id="effective_from"
                            value={bankData.effective_from}
                            onChange={handleChange}
                            placeholder="Enter effective from date"
                            invalid={!!errors.effective_from}
                        />
                        {errors.effective_from && <div className="text-danger">{errors.effective_from}</div>}
                    </FormGroup> */}
                    <FormGroup check>
                        <Label check>
                            <Input
                                type="checkbox"
                                name="is_active"
                                checked={bankData.is_active}
                                onChange={handleChange}
                            />
                            Active
                        </Label>
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

export default BankModal;