import React from 'react';
import '../assets/css/Preloader.css';
import { Typography } from '@mui/material';

const Preloader = ({ audience = 'employees' }) => {
    let message = '';

    if (audience === 'employees') {
        message = 'Sending slips to employees, do not exit';
    } else if (audience === 'pensioners') {
        message = 'Sending slips to pensioners, do not exit';
    } else if (audience === 'salary') { // Assuming 'salary' for bulk salary
        message = 'Bulk Salary Generating, do not exit';
    } else if (audience === 'pension') { // Assuming 'pension' for bulk pension
        message = 'Bulk Pension Generating, do not exit';
    } else {
        // Fallback message for any other unexpected audience value
        message = 'Processing in progress, please do not exit';
    }

    console.log(audience); // Remove this line in production

    return (
        <div className="preloader-wrapper" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <div className="loader-container" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <Typography variant="h2" sx={{ mb: 4, color: '#1976d2', fontWeight: 500, textAlign: 'center' }}>
                    {message}
                </Typography>
                <div className="loader"></div>
            </div>
        </div>
    );
};

export default Preloader;