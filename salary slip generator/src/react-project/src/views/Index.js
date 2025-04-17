import React from 'react';
import Sidebar from '../components/Sidebar/Sidebar';

const Index = () => {
  return (
    <div className="index-container">
      <Sidebar />
      <div className="main-content">
        <h1>Welcome to the Dashboard</h1>
        <p>This is the main view of the application.</p>
      </div>
    </div>
  );
};

export default Index;