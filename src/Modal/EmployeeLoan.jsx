import React, { useState, useMemo } from "react";
import { Modal, Row, Col, Button, FormGroup, Label, Input } from "reactstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Autocomplete, TextField, CircularProgress } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

export default function EmployeeLoanModal({
  employees,
  formOpen,
  toggleModal,
  formData,
  handleSubmit,
  setFormOpen,
  formMode,
  employeeLoading = false
}) {
  const [searchInput, setSearchInput] = useState("");
  
  const initialValues = {
    employee_id: formData.employee_id || "",
    loan_type: formData.loan_type || "",
    loan_amount: formData.loan_amount || 0,
    interest_rate: formData.interest_rate || 0,
    sanctioned_date: formData.sanctioned_date || "",
    total_installments: formData.total_installments || 0,
    current_installment: formData.current_installment || 0,
    remaining_balance: formData.remaining_balance || 0,
    is_active: formData.is_active || "1"
  };

  const validate = (values) => {
    const errors = {};
    if (!values.employee_id) errors.employee_id = "Required";
    if (!values.loan_type) errors.loan_type = "Required";
    // if (!values.loan_amount) errors.loan_amount = "Required";
    // if (!values.interest_rate) errors.interest_rate = "Required";
    if (!values.sanctioned_date) errors.sanctioned_date = "Required";
    // if (!values.total_installments) errors.total_installments = "Required";
    return errors;
  };

  // Memoize filtered employees for better performance
  const filteredEmployees = useMemo(() => {
    if (!employees || !Array.isArray(employees)) return [];
    
    // Filter employees based on search input
    if (searchInput.trim()) {
      const searchLower = searchInput.toLowerCase();
      return employees.filter(emp => {
        const fullName = `${emp.first_name || ''} ${emp.middle_name || ''} ${emp.last_name || ''}`.toLowerCase();
        const employeeCode = (emp.employee_code || '').toLowerCase();
        return fullName.includes(searchLower) || employeeCode.includes(searchLower);
      });
    }
    
    return employees;
  }, [employees, searchInput]);

  // Get employee display name
  const getEmployeeDisplayName = (employee) => {
    if (!employee) return "";
    const firstName = employee.first_name || "";
    const middleName = employee.middle_name || "";
    const lastName = employee.last_name || "";
    const employeeCode = employee.employee_code || "";
    const fullName = `${firstName} ${middleName} ${lastName}`.trim();
    return `${fullName} - ${employeeCode}`; 
  };

    // PASTE THIS ENTIRE BLOCK OF CODE

  const handleFormSubmit = (values, formikHelpers) => {
    // Create a new object with processed values
    const processedValues = {
      ...values,
      // If a value is an empty string (''), it will default to 0.
      loan_amount: values.loan_amount || 0,
      interest_rate: values.interest_rate || 0,
      total_installments: values.total_installments || 0,
      current_installment: values.current_installment || 0,
      remaining_balance: values.remaining_balance || 0,
    };

    // Call the original handleSubmit function with the corrected data
    handleSubmit(processedValues, formikHelpers);
  };


  return (
    <Modal
      className="modal-dialog-centered"
      isOpen={formOpen}
      toggle={() => toggleModal("employeeLoanModal")}
      scrollable={true}
      size="lg"
    >
      <div className="pt-4 pb-4 px-4" style={{ maxHeight: "80vh", overflowY: "auto" }}>
        <Formik
          initialValues={initialValues}
          validate={validate}
          onSubmit={handleFormSubmit}
          enableReinitialize
        >
          {({ isSubmitting, errors, touched, setFieldValue, values, resetForm }) => {
            // Find selected employee based on current form values
            const selectedEmployee = employees.find(emp => String(emp.id) === String(values.employee_id)) || null;

            // Function to handle employee change and clear other fields
            const handleEmployeeChange = (newValue) => {
              const id = newValue ? newValue.id : '';
              setFieldValue('employee_id', id);
              
              // If employee is being changed and there are other filled fields, clear them
              if (id && (values.loan_type || values.loan_amount || values.interest_rate || 
                        values.sanctioned_date || values.total_installments || 
                        values.current_installment || values.remaining_balance)) {
                // Clear all other fields except employee_id and is_active
                setFieldValue('loan_type', '');
                setFieldValue('loan_amount', '');
                setFieldValue('interest_rate', '');
                setFieldValue('sanctioned_date', '');
                setFieldValue('total_installments', '');
                setFieldValue('current_installment', '');
                setFieldValue('remaining_balance', '');
              }
            };

            return (
              <Form>
                <h4 className="mb-4">{formMode === 'edit' ? 'Edit' : 'Add'} Employee Loan</h4>
                <Row>
                  <Col md="6">
                    <FormGroup>
                      <Label for="employee_id">Employee*</Label>
                      <Autocomplete
                        options={filteredEmployees}
                        getOptionLabel={(option) => getEmployeeDisplayName(option)}
                        value={selectedEmployee}
                        onChange={(_, newValue) => {
                          handleEmployeeChange(newValue);
                        }}
                        onInputChange={(_, newInputValue) => {
                          setSearchInput(newInputValue);
                        }}
                        inputValue={searchInput}
                        loading={employeeLoading}
                        disabled={formMode === 'edit'}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            name="employee_id"
                            fullWidth
                            required
                            placeholder={formMode === 'edit' ? "Employee cannot be changed in edit mode" : "Search by name or employee code..."}
                            error={touched.employee_id && Boolean(errors.employee_id)}
                            // helperText={
                            //   touched.employee_id && errors.employee_id 
                            //     ? errors.employee_id 
                            //     : employeeLoading 
                            //       ? "Loading employees..." 
                            //       : formMode === 'edit'
                            //         ? "Employee selection is disabled in edit mode"
                            //         : `Showing ${filteredEmployees.length} of ${employees?.length || 0} employees`
                            // }
                            InputProps={{
                              ...params.InputProps,
                              endAdornment: (
                                <>
                                  {employeeLoading && <CircularProgress color="inherit" size={20} />}
                                  {params.InputProps.endAdornment}
                                </>
                              ),
                            }}
                          />
                        )}
                        isOptionEqualToValue={(option, value) => String(option.id) === String(value.id)}
                        noOptionsText={
                          searchInput.trim() 
                            ? "No employees found matching your search" 
                            : "No employees available"
                        }
                        filterOptions={(x) => x} // Disable built-in filtering since we're doing it manually
                      />
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <Label for="loan_type">Loan Type*</Label>
                      <Field as={Input} type="select" id="loan_type" name="loan_type">
                        <option value="">Select</option>
                        <option value="Computer">Computer</option>
                        <option value="Housing">Housing</option>
                        <option value="Vehicle">Vehicle</option>
                        <option value="Festival">Festival</option>
                        <option value="Other">Other</option>
                      </Field>
                      <ErrorMessage name="loan_type" component="div" className="text-danger" />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md="6">
                    <FormGroup>
                      <Label for="loan_amount">Loan Amount*</Label>
                      <Field as={Input} type="text" id="loan_amount" name="loan_amount" />
                      <ErrorMessage name="loan_amount" component="div" className="text-danger" />
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <Label for="interest_rate">Interest Rate* (%)</Label>
                      <Field as={Input} type="text" id="interest_rate" name="interest_rate" />
                      <ErrorMessage name="interest_rate" component="div" className="text-danger" />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md="6">
                    <FormGroup>                   
                      <Label for="sanctioned_date">Sanctioned Date*</Label>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker                     	
                          format="DD-MM-YYYY"
                          value={values.sanctioned_date ? dayjs(values.sanctioned_date) : null}
                          onChange={(date) => {
                            const formatted = date ? dayjs(date).format('YYYY-MM-DD') : '';
                            setFieldValue('sanctioned_date', formatted);
                          }}
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              name: 'sanctioned_date',
                              error: touched.sanctioned_date && Boolean(errors.sanctioned_date),
                              helperText: touched.sanctioned_date && errors.sanctioned_date,
                            },
                          }}
                        />
                      </LocalizationProvider>
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <Label for="total_installments">Total Installments*</Label>
                      <Field as={Input} type="text" id="total_installments" name="total_installments" />
                      <ErrorMessage name="total_installments" component="div" className="text-danger" />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md="6">
                    <FormGroup>
                      <Label for="current_installment">Current Installment*</Label>
                      <Field as={Input} type="text" id="current_installment" name="current_installment" />
                      <ErrorMessage name="current_installment" component="div" className="text-danger" />
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <Label for="remaining_balance">Remaining Balance*</Label>
                      <Field as={Input} type="text" id="remaining_balance" name="remaining_balance" />
                      <ErrorMessage name="remaining_balance" component="div" className="text-danger" />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md="6">
                    <FormGroup>
                      <Label for="is_active">Status</Label>
                      <Field as={Input} type="select" id="is_active" name="is_active">
                        <option value="1">Active</option>
                        <option value="0">Inactive</option>
                      </Field>
                    </FormGroup>
                  </Col>
                </Row>
                <Button
                  color="primary"
                  type="submit"
                  className="mt-3"
                  disabled={isSubmitting}
                >
                  Save
                </Button>
                <Button
                  color="secondary"
                  className="mt-3 ms-2"
                  onClick={() => setFormOpen(false)}
                >
                  Cancel
                </Button>
              </Form>
            );
          }}
        </Formik>
      </div>
    </Modal>
  );
}
