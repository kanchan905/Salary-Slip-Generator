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
                  ? routes[category]
                    .filter(route => route.showInSidebar !== false) // Filter hidden routes
                    .map((route, key) => (
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
                  : null}
              </React.Fragment>
            ))}
        </Nav>
      </Container>
    </Navbar>
  );
};

export default NewSidebar;
