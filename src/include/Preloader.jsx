import React from 'react';
import '../assets/css/Preloader.css';
import { Typography } from '@mui/material';

const Preloader = ({ audience = 'employees' }) => {
    const message = audience === 'pensioners' ? 'Sending slips to pensioners, do not exit' : 'Sending slips to employees, do not exit';
    return (
        <div className="preloader-wrapper" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <div className="loader-container" style={{display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
                <Typography variant="h2" sx={{ mb: 4, color: '#1976d2', fontWeight: 500, textAlign: 'center' }}>
                    {message}
                </Typography>
                <div className="loader"></div>
            </div>
        </div>
    );
};

export default Preloader;
