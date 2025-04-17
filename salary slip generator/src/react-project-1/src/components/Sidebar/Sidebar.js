import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const menuItems = [
    { path: '/index', name: 'Dashboard', icon: 'ni ni-tv-2' },
    { path: '/user-management', name: 'User Management', icon: 'ni ni-single-02' },
    { path: '/employee-management', name: 'Employee Management', icon: 'ni ni-single-02' },
    { path: '/pay-structure', name: 'Pay Structure', icon: 'ni ni-money-coins' },
    { path: '/pensioners', name: 'Pensioners', icon: 'ni ni-circle-08' },
    { path: '/salary', name: 'Salary Processing', icon: 'ni ni-settings-gear-65' },
    { path: '/pension', name: 'Pension Processing', icon: 'ni ni-diamond' },
    { path: '/reports', name: 'Reports', icon: 'ni ni-paper-diploma' },
    { path: '/login', name: 'Login', icon: 'ni ni-user-run' },
    { path: '/sign-up', name: 'Sign Up', icon: 'ni ni-user-add' },
  ];

  return (
    <div className="sidebar">
      <h2 className="sidebar-title">Navigation</h2>
      <ul className="sidebar-menu">
        {menuItems.map((item, index) => (
          <li key={index} className="sidebar-item">
            <NavLink to={item.path} className="sidebar-link" activeClassName="active">
              <i className={item.icon}></i>
              {item.name}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;