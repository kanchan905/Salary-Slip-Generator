import {
    Box,
    Button,
    Stepper,
    Step,
    StepLabel,
    Typography,
    TextField,
    Grid,
    MenuItem,
    FormControl,
    Divider,
    Autocomplete,
    capitalize,
} from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { bulkUpdateField, updatePensionField } from '../../../redux/slices/pensionSlice';
import { months } from 'utils/helpers';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

function PensionMode({mode,setmode}) {
    const {bulkForm,formData } = useSelector((state) => state.pension);
    const dispatch = useDispatch();

    useEffect(() => {
        // Prefill current month and year for bulk mode if not already set
        if (mode === 'bulk') {
            if (!bulkForm.month) {
                const currentMonth = (dayjs().month() + 1).toString().padStart(2, '0');
                dispatch(bulkUpdateField({ name: 'month', value: currentMonth }));
            }
            if (!bulkForm.year) {
                const currentYear = dayjs().year().toString();
                dispatch(bulkUpdateField({ name: 'year', value: currentYear }));
            }
        }
    }, [dispatch, mode, bulkForm.month, bulkForm.year]);

    // Prefill processing date with the current date
        useEffect(() => {
            if (!bulkForm.processing_date) {
                const today = dayjs().format('YYYY-MM-DD');
                dispatch(bulkUpdateField({ name: 'processing_date', value: today }))
            }
        }, [bulkForm.processing_date, dispatch]);
    
    

    return (
        <div>
            <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                    <FormControl fullWidth>
                        <TextField select name="mode" label="Mode" fullWidth value={mode} onChange={(e) => setmode(e.target.value)}>
                            <MenuItem value="bulk" >Bulk Pension Processing</MenuItem>
                            <MenuItem value="individual">Individual Pension Processing</MenuItem>
                        </TextField>
                    </FormControl>
                </Grid>

                {
                    mode === 'bulk' ? (
                        <>
                            <Grid size={{ xs: 12 }} >
                                <TextField select required name="month" label="Month" value={bulkForm.month} fullWidth onChange={(e) => dispatch(bulkUpdateField({ name: 'month', value: e.target.value }))} disabled>
                                    {months.map((month) => (
                                        <MenuItem key={month.value} value={month.value}>
                                            {month.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <TextField name="year" label="Year" value={bulkForm.year} fullWidth onChange={(e) => dispatch(bulkUpdateField({ name: 'year', value: e.target.value }))} disabled />
                            </Grid>
                            <Grid item size={{ xs: 6 }}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        label="Processing Date"
                                        format="DD-MM-YYYY"
                                        name="processing_date"
                                        value={bulkForm.processing_date ? dayjs(bulkForm.processing_date) : null}
                                        onChange={(date) => {
                                            const formatted = date ? dayjs(date).format('YYYY-MM-DD') : '';
                                            dispatch(bulkUpdateField({ name: "processing_date", value: formatted }))
                                        }}
                                        minDate={dayjs()}
                                        slotProps={{
                                            textField: {
                                                fullWidth: true,
                                                name: 'processing_date',
                                            },
                                        }}
                                    />
                                </LocalizationProvider>
                            </Grid>
                        </>
                    ) : (
                        null
                    )
                }
            </Grid>
        </div>
    )
}

export default PensionMode
