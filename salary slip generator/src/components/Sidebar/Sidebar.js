import React from "react";
import { NavLink as RouterNavLink } from "react-router-dom";
import { Navbar, Nav, NavItem, Container } from "reactstrap";

const NewSidebar = ({ routes }) => {
  return (
    <Navbar
      className="navbar-vertical fixed-left sidebar-custom"
      expand="md"
      id="new-sidenav-main"
      style={{background: "linear-gradient(180deg, #004080, #002a5a)"}}
    >
      <Container fluid>
        <Nav navbar className="flex-column">
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
                            <i className={`${route.icon} me-2 `} />
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