import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Form, FormGroup, Label, Input } from 'reactstrap';

const QuarterAllocateModal = ({ isOpen, toggle, form, onChange, onSubmit }) => (
  <Modal isOpen={isOpen} toggle={toggle}>
    <ModalHeader toggle={toggle}>Allocate Quarter</ModalHeader>
    <Form onSubmit={onSubmit}>
      <ModalBody>
        <FormGroup>
          <Label for="quarter_id">Quarter ID</Label>
          <Input
            type="text"
            name="quarter_id"
            id="quarter_id"
            value={form.quarter_id}
            onChange={onChange}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label for="date_of_allotment">Date of Allotment</Label>
          <Input
            type="date"
            name="date_of_allotment"
            id="date_of_allotment"
            value={form.date_of_allotment}
            onChange={onChange}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label for="date_of_occupation">Date of Occupation</Label>
          <Input
            type="date"
            name="date_of_occupation"
            id="date_of_occupation"
            value={form.date_of_occupation}
            onChange={onChange}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label for="date_of_leaving">Date of Leaving</Label>
          <Input
            type="date"
            name="date_of_leaving"
            id="date_of_leaving"
            value={form.date_of_leaving}
            onChange={onChange}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label for="is_current">Is Current</Label>
          <Input
            type="checkbox"
            name="is_current"
            id="is_current"
            checked={form.is_current}
            onChange={onChange}
          >
          </Input>
        </FormGroup>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggle}>Cancel</Button>
        <Button color="primary" type="submit">Save</Button>
      </ModalFooter>
    </Form>
  </Modal>
);

export default QuarterAllocateModal;