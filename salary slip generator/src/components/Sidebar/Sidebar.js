import React from "react";
import { NavLink as RouterNavLink } from "react-router-dom";
import { Navbar, Nav, NavItem, NavLink, Container } from "reactstrap";


const NewSidebar = ({ routes }) => {
  return (
    <Navbar
      className="navbar-vertical fixed-left bg-dark sidebar-custom"
      expand="md"
      id="new-sidenav-main"
    >
      <Container fluid>
        <Nav navbar className="flex-column">
          {routes &&
            Object.keys(routes).map((category, index) => (
              <React.Fragment key={index}>
                <div className="sidebar-section-title">{category.toUpperCase()}</div>
                {Array.isArray(routes[category])
                  ? routes[category].map((route, key) => (
                      <NavItem key={key}>
                        <NavLink
                          to={route.layout + route.path}
                          tag={RouterNavLink}
                          className="sidebar-link"
                          activeClassName="active"
                        >
                          <i className={`${route.icon} me-2`} />
                          {route.name}
                        </NavLink>
                      </NavItem>
                    ))
                  : routes[category] && (
                      <NavItem>
                        <NavLink
                          to={routes[category].layout + routes[category].path}
                          tag={RouterNavLink}
                          className="sidebar-link"
                          activeClassName="active"
                        >
                          <i className={`${routes[category].icon} me-2`} />
                          {routes[category].name}
                        </NavLink>
                      </NavItem>
                    )}
              </React.Fragment>
            ))}
        </Nav>
      </Container>
    </Navbar>
  );
};

export default NewSidebar;
