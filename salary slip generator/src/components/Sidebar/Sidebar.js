import React from "react";
import { Link, NavLink as RouterNavLink } from "react-router-dom";
import { Navbar, Nav, NavItem, Container } from "reactstrap";
import logo from '../../assets/img/images/nioh_logo_white.png'


const NewSidebar = ({ routes }) => {
  return (
    <Navbar
      className="navbar-vertical fixed-left sidebar-custom pl-3 pr-3"
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
            Object.keys(routes).map((category, index) => (
              <React.Fragment key={index}>
                <div className="sidebar-section-title text-white">{category.toUpperCase()}</div>
                {Array.isArray(routes[category])
                  ? routes[category]
                    .filter(route => route.showInSidebar !== false) // Filter hidden routes
                    .map((route, key) => (
                      <NavItem key={key}>
                        <RouterNavLink
                          to={route.layout + route.path}
                          className={({ isActive }) => `sidebar-link ${isActive ? "active-class-name" : ""}`}
                        >
                          <i className={`${route.icon} me-2`} />
                          {route.name}
                        </RouterNavLink>
                      </NavItem>
                    ))
                  : null}
              </React.Fragment>
            ))}
        </Nav>
      </Container>
    </Navbar>
  );
};

export default NewSidebar;