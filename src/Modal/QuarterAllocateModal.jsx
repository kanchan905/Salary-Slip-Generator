import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, FormGroup, Label, Input, FormFeedback } from 'reactstrap';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

// Validation schema using Yup
const validationSchema = Yup.object().shape({
  quarter_id: Yup.string().required('Quarter ID is required'),
  date_of_allotment: Yup.date().required('Date of Allotment is required'),
  date_of_occupation: Yup.date().required('Date of Occupation is required'),
  // date_of_leaving: Yup.date().required('Date of Leaving is required'),
  is_occupied:Yup.boolean(),
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
      {({ values, errors, touched, handleChange, handleBlur, setFieldValue  }) => (
        <Form>
          <ModalBody>
            <FormGroup>
              <Label for="quarter_id">Quarter</Label>
              <Field
                name="quarter_id"
                as="select"
                className={`form-control ${touched.quarter_id && errors.quarter_id ? "is-invalid" : ""}`}
                id="quarter_id"
              >
                <option value="">Select Quarter</option>               
                {quarterList?.map((quarter) => (
                  <option key={quarter.id} value={quarter.id}>
                    {quarter.quarter_no}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="quarter_id" component={FormFeedback} />
            </FormGroup>
            
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <FormGroup>
                <Label for="date_of_allotment">Date of Allotment*</Label>
                <DatePicker
                  format="DD-MM-YYYY"
                  value={values.date_of_allotment ? dayjs(values.date_of_allotment) : null}
                  onChange={(val) => {
                    const formatted = val ? dayjs(val).format("YYYY-MM-DD") : '';
                    setFieldValue("date_of_allotment", formatted);
                  }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: Boolean(touched.date_of_allotment && errors.date_of_allotment),
                      helperText: touched.date_of_allotment && errors.date_of_allotment,
                    }
                  }}
                />
                <ErrorMessage name="date_of_allotment" component={FormFeedback} />
              </FormGroup>
              <FormGroup>
                <Label for="date_of_occupation">Date of Occupied*</Label>
                <DatePicker
                  format="DD-MM-YYYY"
                  value={values.date_of_occupation ? dayjs(values.date_of_occupation) : null}
                  onChange={(val) => {
                    const formatted = val ? dayjs(val).format("YYYY-MM-DD") : '';
                    setFieldValue("date_of_occupation", formatted);
                  }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: Boolean(touched.date_of_occupation && errors.date_of_occupation),
                      helperText: touched.date_of_occupation && errors.date_of_occupation,
                    }
                  }}
                />
                <ErrorMessage name="date_of_occupation" component={FormFeedback} />
              </FormGroup>
              <FormGroup>
                <Label for="date_of_leaving">Date of Leaving (if applicable)</Label>
                <DatePicker
                  format="DD-MM-YYYY"
                  value={values.date_of_leaving ? dayjs(values.date_of_leaving) : null}
                  onChange={(val) => {
                    const formatted = val ? dayjs(val).format("YYYY-MM-DD") : '';
                    setFieldValue("date_of_leaving", formatted);
                  }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: Boolean(touched.date_of_leaving && errors.date_of_leaving),
                      helperText: touched.date_of_leaving && errors.date_of_leaving,
                    }
                  }}
                />
                <ErrorMessage name="date_of_leaving" component={FormFeedback} />
              </FormGroup>
            </LocalizationProvider>
            <FormGroup check>
              <Label check>
                <Input
                  tag={Field}
                  type="checkbox"
                  name="is_occupied"
                  id="is_occupied"
                  checked={values.is_occupied}
                  onChange={handleChange}
                />{' '}
                Occupied
              </Label>
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
                Allocate
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
