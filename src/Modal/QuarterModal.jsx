import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, FormGroup, Label, Input, FormFeedback } from 'reactstrap';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { MenuItem, TextField } from '@mui/material';

// Validation schema using Yup
const validationSchema = Yup.object().shape({
  quarter_no: Yup.string().required('Quarter ID is required'),
  type: Yup.string().required('Type is required'),
  license_fee: Yup.number().required('License fee is required')
});

const QuarterModal = ({ isOpen, toggle, form, onSubmit }) => (
  <Modal isOpen={isOpen} toggle={toggle}>
    <ModalHeader toggle={toggle}>Quarter</ModalHeader>
    <Formik
      initialValues={form}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {({ errors, touched, handleChange, handleBlur, values }) => (
        <Form>
          <ModalBody>
            <FormGroup>
              <Label for="quarter_id">Quarter No.</Label>
              <Input
                tag={Field}
                type="text"
                name="quarter_no"
                id="quarter_no"
                invalid={touched.quarter_no && !!errors.quarter_no}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.quarter_no}
              />
              <ErrorMessage name="quarter_no" component={FormFeedback} />
            </FormGroup>
            <FormGroup>
              <Label for="type">Type</Label>
              <TextField  
                select
                name="type"
                id="type"
                fullWidth
                value={values.type} // ✅ Correct usage
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.type && Boolean(errors.type)}
                helperText={touched.type && errors.type}>
                {['B', 'C'].map((opt) => (
                  <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                ))}
              </TextField>
              <ErrorMessage name="type" component={FormFeedback} />
            </FormGroup>
             <FormGroup>
              <Label for="license_fee">License Fee</Label>
              <Input
                tag={Field}
                type="text"
                name="license_fee"
                id="license_fee"
                invalid={touched.license_fee && !!errors.license_fee}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage name="license_fee" component={FormFeedback} />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={toggle}>Cancel</Button>
            <Button color="primary" type="submit">Save</Button>
          </ModalFooter>
        </Form>
      )}
    </Formik>
  </Modal>
);

export default QuarterModal;