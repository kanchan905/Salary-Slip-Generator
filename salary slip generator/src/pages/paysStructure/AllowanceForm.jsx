import * as React from 'react';
import {
    Box,
    Tabs,
    Tab,
    TextField,
    MenuItem,
    Checkbox,
    FormControlLabel,
    Button,
    Grid,
    Paper
} from '@mui/material';
import { Row } from 'reactstrap';

const ALLOWANCE_TYPES = [
    'Dearness',
    'House Rent',
    'Non Practicing',
    'Transport',
    'Uniform'
];

export default function AllowanceForm() {
    const [value, setValue] = React.useState(0);
    const [formData, setFormData] = React.useState({});

    const handleTabChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const renderFields = () => {
        switch (ALLOWANCE_TYPES[value]) {
            case 'Dearness':
                return (
                    <>
                        <Grid item xs={12} sm={6}>
                            <TextField name="rate_percentage" label="Rate %" fullWidth type="number" onChange={handleChange} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField name="pwd_rate_percentage" label="PWD Rate %" fullWidth type="number" onChange={handleChange} />
                        </Grid>
                    </>
                );
            case 'House Rent':
                return (
                    <>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                select
                                name="city_class"
                                label="City Class"
                                onChange={handleChange}
                                defaultValue="Agra"
                            >
                                {['Agra', 'Delhi', 'Noida'].map((opt) => (
                                    <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField name="rate_percentage" label="Rate %" fullWidth type="number" onChange={handleChange} />
                        </Grid>
                    </>
                );
            case 'Non Practicing':
                return (
                    <>
                        <Grid item xs={12} sm={6}>
                            <TextField name="applicable_post" label="Applicable Post" fullWidth onChange={handleChange} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField name="rate_percentage" label="Rate %" fullWidth type="number" onChange={handleChange} />
                        </Grid>
                    </>
                );
            case 'Transport':
                return (
                    <>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                select
                                name="city_class"
                                label="City Class"
                                fullWidth
                                onChange={handleChange}
                                defaultValue="Agra"
                            >
                                {['Agra', 'Delhi', 'Noida'].map((opt) => (
                                    <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                select
                                name="transport_type"
                                label="Transport Type"
                                fullWidth
                                onChange={handleChange}
                                defaultValue="Type1"
                            >
                                {['Type1', 'Type2', 'Type3', 'Type4'].map((opt) => (
                                    <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControlLabel
                                control={<Checkbox name="pwd_applicable" onChange={handleChange} />}
                                label="PWD Applicable"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField name="amount" label="Amount" fullWidth type="number" onChange={handleChange} />
                        </Grid>
                    </>
                );
            case 'Uniform':
                return (
                    <>
                        <Grid item xs={12} sm={6}>
                            <TextField name="applicable_post" label="Applicable Post" fullWidth onChange={handleChange} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField name="amount" label="Amount" fullWidth type="number" onChange={handleChange} />
                        </Grid>
                    </>
                );
            default:
                return null;
        }
    };


    return (
        <>
          <div className='header bg-gradient-info pb-8 pt-8 pt-md-8 main-head'>
          <Box sx={{ maxWidth: { xs: '80%', sm: '90%' }, margin:'auto'}}>
              <Tabs
                value={value}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
                aria-label="scrollable auto tabs"
                TabIndicatorProps={{ sx: { height: 3 } }}
              >
                {ALLOWANCE_TYPES.map((label, index) => (
                  <Tab key={index} label={label} sx={{ flex: '0 0 33.33%', color:'white' }} />
                ))}
              </Tabs>
            </Box>
      
          </div>
          <Box sx={{ width: '100%', bgcolor: 'background.paper', p: 3, pt:8, pb:8, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        
            <Paper sx={{ p: 3, width: '100%', maxWidth:{xs: '80%', sm: '90%'  }}}>
              <Grid container spacing={2}>
                {renderFields()}
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="effective_from"
                    label="Effective From"
                    type="date"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="effective_till"
                    label="Effective Till"
                    type="date"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="notification_ref"
                    label="Notification Ref"
                    fullWidth
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>
              <Row className='m-0 mt-4'>
              <Grid item xs={12}>
                  <Button
                  className='text-white pt-2 pb-2 pl-4 pr-4'
                  style={{background:'#004080'}}
                //    variant="contained"
                //     color="primary"
                     fullWidth>
                    Submit
                  </Button>
                </Grid>
              </Row>
            </Paper>
          </Box>
        </>
      );
}
