import React from 'react';
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
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSelectedBank((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    // Ensure selectedBank has default values to avoid undefined
    const defaultBank = {
        bank_name: '',
        branch_name: '',
        account_number: '',
        ifsc_code: '',
        effective_from: '',
        is_active: false,
    };

    const bankData = { ...defaultBank, ...selectedBank }; 

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
                        />
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
                        />
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
                        />
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
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="effective_from">Effective From</Label>
                        <Input
                            type="date"
                            name="effective_from"
                            id="effective_from"
                            value={bankData.effective_from}
                            onChange={handleChange}
                            placeholder="Enter effective from date"
                        />
                    </FormGroup>
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

export default BankModal;