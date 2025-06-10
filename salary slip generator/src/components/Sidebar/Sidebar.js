import React, { useState } from "react";
import { Link, NavLink as RouterNavLink } from "react-router-dom";
import { Navbar, Nav, NavItem, Container, Collapse } from "reactstrap";
import logo from '../../assets/img/images/nioh_logo_white.png';

const NewSidebar = ({ routes }) => {
  const [openDropdowns, setOpenDropdowns] = useState({});

  const toggleDropdown = (category) => {
    setOpenDropdowns((prevState) => ({
      ...prevState,
      [category]: !prevState[category],
    }));
  };

  return (
    <Navbar
      className="navbar-vertical fixed-left sidebar-custom pl-3 pr-3 custom-scrollbar"
      expand="md"
      id="new-sidenav-main"
      style={{ background: "linear-gradient(180deg, #004080, #002a5a)" }}
    >
      <Container fluid>
        <Link
          className="h4 mb-0 text-white text-uppercase d-none d-lg-inline-block w-100 mt-3 mb-3"
          to="/"
        >
          <img src={logo} alt="not-found" className="w-75" />
        </Link>
        <Nav navbar className="flex-column w-100 m-auto">
          {routes &&
            Object.keys(routes).map((category, index) => {
              const visibleRoutes = routes[category].filter(
                (route) => route.showInSidebar !== false
              );
              
              const isDropdownCategory = ["pensioner_Management", "employee_masters", "commission"].includes(category);

              const isOpen = openDropdowns[category];

              return (
                <React.Fragment key={index}>
                  {isDropdownCategory ? (
                    <NavItem>
                      <div
                        className="sidebar-dropdown d-flex justify-content-between align-items-center"
                        style={{cursor:'pointer'}}
                        onClick={() => toggleDropdown(category)}
                      >                   
                        <div className="sidebar-section-title text-white text-uppercase small mt-3 mb-2">
                          {category.replaceAll("_", " ")}
                        </div>
                        <i
                          className={`ni ${isOpen ? "ni-bold-down" : "ni-bold-right"} mt-3 mb-2 text-white`}/>
                      </div>
                      <Collapse isOpen={isOpen}>
                        {visibleRoutes.map((route, key) => (
                          <RouterNavLink
                            key={key}
                            to={route.path}
                            className={({ isActive }) => `submenu-link sidebar-link ${isActive ? "active" : ""}`}
                          >
                            <i className={`${route.icon} me-2`} />
                            {route.name}
                          </RouterNavLink>
                        ))}
                      </Collapse>
                    </NavItem>
                  ) : (
                    <>
                      {/* Optional section title for other categories */}
                      <div className="sidebar-section-title text-white text-uppercase small mt-3 mb-2">
                        {category.replaceAll("_", " ")}
                      </div>
                      {visibleRoutes.map((route, key) => (
                        <NavItem key={key}>
                          <RouterNavLink
                            to={route.path}
                            className={({ isActive }) =>
                              `sidebar-link ${isActive ? "active" : ""}`
                            }
                          >
                            <i className={`${route.icon} me-2`} />
                            {route.name}
                          </RouterNavLink>
                        </NavItem>
                      ))}
                    </>
                  )}
                </React.Fragment>
              );
            })}

        </Nav>
      </Container>
    </Navbar>
  );
};

export default NewSidebar;