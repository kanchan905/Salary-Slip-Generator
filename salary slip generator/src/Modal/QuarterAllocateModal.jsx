import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, FormGroup, Label, Input, FormFeedback } from 'reactstrap';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

// Validation schema using Yup
const validationSchema = Yup.object().shape({
  quarter_id: Yup.string().required('Quarter ID is required'),
  date_of_allotment: Yup.date().required('Date of Allotment is required'),
  date_of_occupation: Yup.date().required('Date of Occupation is required'),
  date_of_leaving: Yup.date().required('Date of Leaving is required'),
  is_current: Yup.boolean(),
});



const QuarterAllocateModal = ({ isOpen, toggle, form, onSubmit, quarterList }) => (
  <Modal isOpen={isOpen} toggle={toggle}>
    <ModalHeader toggle={toggle}>Allocate Quarter</ModalHeader>
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
              <Label for="quarter_id">Quarter ID</Label>
              <Field
                name="quarter_id"
                as="select"
                className={`form-control ${touched.quarter_id && errors.quarter_id ? "is-invalid" : ""}`}
                id="quarter_id"
              >
                <option value="">Select Quarter</option>               
                {quarterList.map((quarter) => (
                  <option key={quarter.id} value={quarter.id}>
                    {quarter.id}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="quarter_id" component={FormFeedback} />
            </FormGroup>

            <FormGroup>
              <Label for="date_of_allotment">Date of Allotment</Label>
              <Input
                tag={Field}
                type="date"
                name="date_of_allotment"
                id="date_of_allotment"
                invalid={touched.date_of_allotment && !!errors.date_of_allotment}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.date_of_allotment}
              />
              <ErrorMessage name="date_of_allotment" component={FormFeedback} />
            </FormGroup>
            <FormGroup>
              <Label for="date_of_occupation">Date of Occupation</Label>
              <Input
                tag={Field}
                type="date"
                name="date_of_occupation"
                id="date_of_occupation"
                invalid={touched.date_of_occupation && !!errors.date_of_occupation}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.date_of_occupation}
              />
              <ErrorMessage name="date_of_occupation" component={FormFeedback} />
            </FormGroup>
            <FormGroup>
              <Label for="date_of_leaving">Date of Leaving</Label>
              <Input
                tag={Field}
                type="date"
                name="date_of_leaving"
                id="date_of_leaving"
                invalid={touched.date_of_leaving && !!errors.date_of_leaving}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.date_of_leaving}
              />
              <ErrorMessage name="date_of_leaving" component={FormFeedback} />
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input
                  tag={Field}
                  type="checkbox"
                  name="is_current"
                  id="is_current"
                  checked={values.is_current}
                  onChange={handleChange}
                />{' '}
                Is Current
              </Label>
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

export default QuarterAllocateModal;