import React, { useEffect } from "react";
import {
  Button,
  FormGroup,
  Label,
  Col,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
} from "reactstrap";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import {
  createArrear,
  fetchArrears,
  updateArrear,
} from "../redux/slices/arrearsSlice";
import { toast } from "react-toastify";
import { Autocomplete, TextField } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const initialValues = {
  pensioner_id: "",
  from_month: "",
  to_month: "",
  payment_month: "",
  basic_arrear: "",
  additional_arrear: "",
  dr_percentage: "",
  dr_arrear: "",
  total_arrear: "",
  remarks: "",
  added_by: "",
  edited_by: "",
};

const validationSchema = Yup.object({
  pensioner_id: Yup.string().required("Required"),
  from_month: Yup.date().required("Required"),
  to_month: Yup.date()
    .min(Yup.ref("from_month"), "To Month cannot be before From Month")
    .required("Required"),
  payment_month: Yup.date().required("Required"),
  basic_arrear: Yup.number()
    .typeError("Basic Arrear must be a number")
    .required("Required"),
  additional_arrear: Yup.number()
    .typeError("Additional Arrear must be a number")
    .required("Required"),
  dr_percentage: Yup.number()
    .typeError("DR Percentage must be a number")
    .required("Required"),
  dr_arrear: Yup.number()
    .typeError("DR Arrear must be a number")
    .required("Required"),
  total_arrear: Yup.number()
    .typeError("Total Arrear must be a number")
    .required("Required"),
  remarks: Yup.string(),
  added_by: Yup.string(),
  edited_by: Yup.string(),
});

export default function ArrearModal({ isOpen, toggle, id, pensioners, dearness }) {
  const dispatch = useDispatch();
  const arrears = useSelector((state) => state.arrears.arrear);

  useEffect(() => {
    dispatch(fetchArrears());
  }, [dispatch]);

  const arrearToEdit = id
    ? arrears.find((a) => String(a.id) === String(id))
    : null;

  const pickFields = (source, keys) =>
    keys.reduce((obj, key) => {
      obj[key] = source[key] || "";
      return obj;
    }, {});
  const allowedFields = [
    "pensioner_id",
    "from_month",
    "to_month",
    "payment_month",
    "basic_arrear",
    "additional_arrear",
    "dr_percentage",
    "dr_arrear",
    "total_arrear",
    "remarks",
  ];
  const formInitialValues = arrearToEdit
    ? { ...initialValues, ...pickFields(arrearToEdit, allowedFields) }
    : initialValues;

  const onSubmit = (values, { setSubmitting }) => {
    if (id) {
      dispatch(updateArrear({ id, values }))
        .unwrap()
        .then(() => {
          toggle();
          dispatch(fetchArrears({ page: '', limit: '', id: '' }));
          toast.success("Successfully updated arrear");
        })
        .catch((err) => {
          const apiMsg =
            err?.response?.data?.message || err?.message || "Failed to save arrear.";
          toast.error(apiMsg);
        });
    } else {
      dispatch(createArrear(values))
        .unwrap()
        .then(() => {
          toggle();
          dispatch(fetchArrears({ page: '', limit: '', id: '' }));
          toast.success("Successfully added arrear");
        })
        .catch((err) => {
          const apiMsg =
            err?.response?.data?.message || err?.message || "Failed to save arrear.";
          toast.error(apiMsg);
        });
    }
    setSubmitting(false);
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg" backdrop="static" centered>
      <ModalHeader toggle={toggle}>{id ? "Edit Arrear" : "Add Arrear"}</ModalHeader>
      <Formik
        initialValues={formInitialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        enableReinitialize
      >
        {({ isSubmitting, values, errors, touched, setFieldValue }) => (
          <Form>
            <ModalBody>
              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label for="pensioner_id">Pensioner*</Label>
                    <Autocomplete
                      options={pensioners || []}
                      getOptionLabel={(option) =>
                        `${option.name} - ${option.ppo_no}`
                      }
                      value={
                        pensioners?.find(p => p.id === values.pensioner_id) || null
                      }
                      onChange={(_, newValue) => {
                        const id = newValue ? newValue.id : '';
                        setFieldValue('pensioner_id', id);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          name="pensioner_id"
                          fullWidth
                          error={touched.pensioner_id && Boolean(errors.pensioner_id)}
                          helperText={touched.pensioner_id && errors.pensioner_id}
                        />
                      )}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      disabled={arrearToEdit !== id}
                    />
                  </FormGroup>
                </Col>


                <Col md={6}>
                  <FormGroup>
                    <Label for="from_month">From Month*</Label>
                    <Field name="from_month" type="date" className="form-control" />
                    <ErrorMessage
                      name="from_month"
                      component="p"
                      className="text-danger"
                    />
                  </FormGroup>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label for="to_month">To Month*</Label>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker                       
                        format="DD-MM-YYYY"
                        value={values.to_month ? dayjs(values.to_month) : null}
                        onChange={(date) => {
                          const formatted = date ? dayjs(date).format('YYYY-MM-DD') : '';
                          setFieldValue('to_month', formatted);
                        }}
                        disableFuture
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            name: 'to_month',
                          },
                          field: {
                            inputProps: {
                              placeholder: 'DD-MM-YYYY',
                            }
                          }
                        }}
                      />
                    </LocalizationProvider>
                    <ErrorMessage
                      name="to_month"
                      component="p"
                      className="text-danger"
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="payment_month">Payment Month*</Label>
                     <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker                       
                        format="DD-MM-YYYY"
                        value={values.payment_month ? dayjs(values.payment_month) : null}
                        onChange={(date) => {
                          const formatted = date ? dayjs(date).format('YYYY-MM-DD') : '';
                          setFieldValue('payment_month', formatted);
                        }}
                        disableFuture
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            name: 'payment_month',
                          },
                          field: {
                            inputProps: {
                              placeholder: 'DD-MM-YYYY',
                            }
                          }
                        }}

                      />
                    </LocalizationProvider>
                    <ErrorMessage
                      name="payment_month"
                      component="p"
                      className="text-danger"
                    />
                  </FormGroup>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label for="basic_arrear">Basic Arrear*</Label>
                    <Field
                      name="basic_arrear"
                      type="text"
                      className="form-control"
                    />
                    <ErrorMessage
                      name="basic_arrear"
                      component="p"
                      className="text-danger"
                    />
                  </FormGroup>
                </Col>

                <Col md={6}>
                  <FormGroup>
                    <Label for="additional_arrear">Additional Arrear*</Label>
                    <Field
                      name="additional_arrear"
                      type="text"
                      className="form-control"
                    />
                    <ErrorMessage
                      name="additional_arrear"
                      component="p"
                      className="text-danger"
                    />
                  </FormGroup>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label for="dr_percentage">DR Percentage*</Label>
                    <Field as={Input} type="select" id="dr_percentage" name="dr_percentage" >
                      <option value="">Select DR</option>
                      {dearness?.map(p => (
                        <option key={p.id} value={p.dr_percentage}>
                          {p.dr_percentage}%
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="dr_percentage"
                      component="p"
                      className="text-danger"
                    />
                  </FormGroup>
                </Col>

                <Col md={6}>
                  <FormGroup>
                    <Label for="dr_arrear">DR Arrear*</Label>
                    <Field
                      name="dr_arrear"
                      type="text"
                      className="form-control"
                    />
                    <ErrorMessage
                      name="dr_arrear"
                      component="p"
                      className="text-danger"
                    />
                  </FormGroup>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label for="total_arrear">Total Arrear*</Label>
                    <Field
                      name="total_arrear"
                      type="text"
                      className="form-control"
                    />
                    <ErrorMessage
                      name="total_arrear"
                      component="p"
                      className="text-danger"
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="remarks">Remarks (if applicable)</Label>
                    <Field name="remarks" className="form-control" />
                    <ErrorMessage
                      name="remarks"
                      component="p"
                      className="text-danger"
                    />
                  </FormGroup>
                </Col>
              </Row>
            </ModalBody>

            <ModalFooter>
              <Button color="primary" type="submit" disabled={isSubmitting}>
                {id ? "Update" : "Add"}
              </Button>
              <Button color="secondary" type="button" onClick={toggle}>
                Cancel
              </Button>
            </ModalFooter>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}
