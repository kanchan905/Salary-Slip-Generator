import React from 'react';
import '../assets/css/Preloader.css';

const Preloader = () => {
    return (
        <div className="w-100 d-flex justify-content-center align-items-center">
            <div className="loader-container">
                <div className="loader"></div>
            </div>
        </div>
    );
};

export default Preloader;
