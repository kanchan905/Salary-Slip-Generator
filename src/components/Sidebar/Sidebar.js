import React, { useState } from "react";
import { Link, NavLink as RouterNavLink } from "react-router-dom";
import { Navbar, Nav, NavItem, Container, Collapse } from "reactstrap";
import logo from '../../assets/img/images/nioh_logo_white.png';
import '../../assets/css/custom.css';
import { useDispatch } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";

const NewSidebar = ({ routes }) => {
  const [openDropdowns, setOpenDropdowns] = useState({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const toggleDropdown = (category) => {
    setOpenDropdowns((prevState) => ({
      ...prevState,
      [category]: !prevState[category],
    }));
  };

  const dropdownCategories = ["management", "masters", "processing"];

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <>
      {/* Hamburger button (always visible) */}
      <div className="sidebar-toggle-btn d-md-none d-flex align-items-center p-2">
        <button onClick={toggleSidebar} className="btn btn-sm theme-blue-btn">
          <i className="fas fa-bars" />
        </button>
      </div>

      <Navbar
        className={`navbar-vertical fixed-left sidebar-custom pl-3 pr-3 custom-scrollbar ${
          isSidebarOpen ? "sidebar-open" : "sidebar-closed"
        }`}
        expand="md"
        id="new-sidenav-main"
        style={{ background: "linear-gradient(180deg, #004080, #002a5a)" }}
      >
        {/* Mobile close button (X) */}
        {isSidebarOpen && (
          <div className="d-md-none d-flex justify-content-end align-items-center pt-2 pr-2" style={{ position: 'absolute', top: 0, right: 0, zIndex: 10 }}>
            <button onClick={toggleSidebar} className="btn btn-link text-white p-2" style={{ fontSize: '1.5rem' }} aria-label="Close sidebar">
              <i className="ni ni-fat-remove" />
            </button>
          </div>
        )}
        <Container fluid>
          <Link className="h4 mb-0 text-white text-uppercase d-block w-100 mt-3 mb-3" to="/">
            <img src={logo} alt="not-found" className="sidebar-logo-img" />
          </Link>
          <Nav navbar className="flex-column w-100 m-auto">
            {routes &&
              Object.keys(routes).map((category, index) => {
                const visibleRoutes = routes[category].filter((route) => route.showInSidebar !== false);
                if (visibleRoutes.length === 0) return null;

                const isDropdownCategory = dropdownCategories.includes(category);
                const isOpen = openDropdowns[category];

                if (isDropdownCategory) {
                  return (
                    <NavItem key={index}>
                      <div
                        className="sidebar-dropdown d-flex justify-content-between align-items-center"
                        style={{ cursor: 'pointer' }}
                        onClick={() => toggleDropdown(category)}
                      >
                        <div className="sidebar-section-title text-white text-uppercase small mt-3 mb-2">
                          {category.replace("_", " ")}
                        </div>
                        <i className={`ni ${isOpen ? "ni-bold-down" : "ni-bold-right"} mt-3 mb-2 text-white`} />
                      </div>
                      <Collapse isOpen={isOpen}>
                        {visibleRoutes.map((route, key) => (
                          <RouterNavLink
                            key={key}
                            to={route.path}
                            className={({ isActive }) =>
                              `submenu-link sidebar-link ${isActive ? "active" : ""}`
                            }
                          >
                            <i className={`${route.icon} me-2`} />
                            {route.name}
                          </RouterNavLink>
                        ))}
                      </Collapse>
                    </NavItem>
                  );
                } else {
                  return (
                    <React.Fragment key={index}>
                      <div className="sidebar-section-title text-white text-uppercase small mt-3 mb-2">
                        {category.replace("_", " ")}
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
                    </React.Fragment>
                  );
                }
              })}
          </Nav>
        </Container>
        {/* Mobile-only links: Profile, Forgot Password, Logout */}
        <div className="d-md-none mt-4">
          <div className="sidebar-section-title text-white text-uppercase small mt-3 mb-2">
            Account
          </div>
          <Nav navbar className="flex-column w-100">
            <NavItem>
              <RouterNavLink to="/user-profile" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
                <i className="ni ni-single-02 me-2" />
                Profile
              </RouterNavLink>
            </NavItem>
            <NavItem>
              <RouterNavLink to="/forgot-password" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
                <i className="fa-solid fa-lock me-2" />
                Forgot Password
              </RouterNavLink>
            </NavItem>
            <NavItem>
              <span className="sidebar-link" style={{ cursor: 'pointer' }} onClick={handleLogout}>
                <i className="ni ni-user-run me-2" />
                Logout
              </span>
            </NavItem>
          </Nav>
        </div>
      </Navbar>
    </>
  );
};

export default NewSidebar;
