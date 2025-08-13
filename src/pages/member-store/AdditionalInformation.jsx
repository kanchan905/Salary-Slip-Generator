import React, { useState, forwardRef, useImperativeHandle, useRef } from 'react';
import { Grid, TextField, Button } from '@mui/material';
import { Formik, Form } from 'formik';
import { toast } from 'react-toastify';

const AdditionalInformation = forwardRef(({ values, onSubmitAll }, ref) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const formikRef = useRef();

    useImperativeHandle(ref, () => ({
        saveCurrentValues: () => {
            return formikRef.current?.values || values;
        }
    }));

    const handleSubmit = async (stepValues) => {
        setIsSubmitting(true);
        try {
            await onSubmitAll(stepValues);
        } catch (err) {
            const apiErrors = [
                err?.data?.message,
                err?.response?.data?.message,
                err?.errorMsg,
                err?.message,
            ].filter(Boolean);
            if (apiErrors.length > 0) {
                apiErrors.forEach(msg => toast.error(msg));
            } else {
                toast.error("An unexpected error occurred. Please try again.");
            }
           
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Formik innerRef={formikRef} initialValues={values} enableReinitialize onSubmit={handleSubmit}>
            {({ values, errors, touched, handleChange }) => (
                <Form>
                    <Grid container spacing={2}>
                        <Grid item size={{ xs:12 }}>
                            <TextField
                                fullWidth
                                multiline
                                rows={5}
                                name="remarks"
                                label="remarks(if applicable)"
                                value={values.remarks}
                                onChange={handleChange}
                            />
                        </Grid>
                    </Grid>
                    <Grid container justifyContent="flex-end" sx={{ mt: 3 }}>
                        <Button type="submit" variant="contained" disabled={isSubmitting}>
                            {isSubmitting ? 'Submitting...' : 'Finish'}
                        </Button>
                    </Grid>
                </Form>
            )}
        </Formik>
    );
});

export default AdditionalInformation;
