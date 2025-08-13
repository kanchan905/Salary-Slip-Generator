import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Switch,
  FormControlLabel,
  Button,
  Box,
  Divider,
  Grid,
} from '@mui/material';


const SystemSettingsPage = () => {
  const [settings, setSettings] = useState({
    appName: 'Salary Slip Portal',
    timezone: 'Asia/Kolkata',
    enableNotifications: true,
    notifyByEmail: false,
    notifyBySMS: false,
    enableAuditLogs: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({ ...settings, [name]: type === 'checkbox' ? checked : value });
  };

  const handleBackup = () => {
    // Logic for backing up system settings
    alert('Backup triggered!');
  };

  const handleRestore = () => {
    // Logic for restoring settings
    alert('Restore triggered!');
  };

  const handleSave = () => {
    // API call to save settings
    alert('Settings saved successfully!');
  };

  return (
    <>
    <div className='header bg-gradient-info pb-8 pt-8 pt-md-8 main-head'></div>
    <Container className="mt-5 mb-5">
      <Box className="p-4 shadow bg-white rounded">
        <Typography variant="h5" gutterBottom>
          System Settings
        </Typography>

        {/* Global Parameters */}
        <Divider className="my-4" />
        <Typography variant="h6" gutterBottom>
          Global Parameters
        </Typography>
        <Grid container spacing={2}>
          <Grid size={{xs:12,md:6}}>
            <TextField
              label="Application Name"
              name="appName"
              value={settings.appName}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid size={{xs:12,md:6}}>
            <TextField
              label="Timezone"
              name="timezone"
              value={settings.timezone}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
        </Grid>

        {/* Notifications */}
        <Divider className="my-4" />
        <Typography variant="h6" gutterBottom>
          Notification Settings
        </Typography>
        <FormControlLabel
          control={
            <Switch
              checked={settings.enableNotifications}
              onChange={(e) => handleChange({ ...e, target: { ...e.target, name: 'enableNotifications' } })}
            />
          }
          label="Enable Notifications"
        />
        {settings.enableNotifications && (
          <Box className="ps-3">
            <FormControlLabel
              control={
                <Switch
                  checked={settings.notifyByEmail}
                  onChange={(e) => handleChange({ ...e, target: { ...e.target, name: 'notifyByEmail' } })}
                />
              }
              label="Notify via Email"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.notifyBySMS}
                  onChange={(e) => handleChange({ ...e, target: { ...e.target, name: 'notifyBySMS' } })}
                />
              }
              label="Notify via SMS"
            />
          </Box>
        )}

        {/* Audit Logs */}
        <Divider className="my-4" />
        <Typography variant="h6" gutterBottom>
          Audit Log Settings
        </Typography>
        <FormControlLabel
          control={
            <Switch
              checked={settings.enableAuditLogs}
              onChange={(e) => handleChange({ ...e, target: { ...e.target, name: 'enableAuditLogs' } })}
            />
          }
          label="Enable Audit Logs"
        />

        {/* Backup / Restore */}
        <Divider className="my-4" />
        <Typography variant="h6" gutterBottom>
          Backup & Restore
        </Typography>
        <Box className="d-flex mb-3" style={{gap:'10px'}}>
          <Button
          style={{border:"1px solid #004080", color:'#004080'}}
          //  variant="outlined" 
          //  color="primary" 
           onClick={handleBackup}>
            Backup Settings
          </Button>
          <Button
            style={{border:"1px solid #004080", color:'#004080'}}
          //  variant="outlined"
          //   color="secondary"
             onClick={handleRestore}>
            Restore Settings
          </Button>
        </Box>

        {/* Save Button */}
        <Divider className="my-4" />
        <Button 
        style={{background:'#004080', color:'#fff'}}
        onClick={handleSave}>
          Save All Settings
        </Button>
      </Box>
    </Container>
    </>
  );
};

export default SystemSettingsPage;
