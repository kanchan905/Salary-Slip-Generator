import React, { useEffect, useMemo } from "react";
import { useLocation, Route, Routes, Navigate, useNavigate } from "react-router-dom";
import { Container } from "reactstrap";
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import AdminFooter from "components/Footers/AdminFooter.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import { useSelector } from "react-redux";
import { getCookie } from "cookies-next";
import getAdminRoutes from "../routes/adminRoutes";
import { Bounce, ToastContainer } from "react-toastify";



const ProtectedRoute = ({ userRoles, route, children }) => {
  // TEMPORARY: Always allow access for testing
  return children;
  
  const isAuthorized = !route.roles || route.roles.some(role => userRoles.includes(role));

  if (!isAuthorized) {
    return <Navigate to="/index" replace />;
  }

  return children;
};


const AdminLayout = (props) => {
  const mainContent = React.useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { roles } = useSelector((state) => state.auth.user) || getCookie('user');
  let roleRoutes = [];
  const userData = useSelector((state) => state.auth.user) || getCookie('user');

  const userRoles = useMemo(() => {
    if (userData?.roles && Array.isArray(userData.roles)) {
      return userData.roles.map(role => role.name);
    }
    return [];
  }, [userData]);

  useEffect(() => {
    // Only redirect if end user lands on /index or /
    if (
      userRoles.includes("End Users") && userRoles.length === 1 &&
      (location.pathname === "/index" || location.pathname === "/")
    ) {
      navigate("/user-profile", { replace: true });
    }
  }, [userRoles, location, navigate]);

  // Sidebar responsive state
  const [sidebarOpen, setSidebarOpen] = React.useState(window.innerWidth >= 992);
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 992) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  // Close sidebar on route change for mobile
  React.useEffect(() => {
    if (window.innerWidth < 992) {
      setSidebarOpen(false);
    }
  }, [location]);




  React.useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    if (mainContent.current) mainContent.current.scrollTop = 0;
  }, [location.pathname]);

  // if (roles[0]?.name) {
  //   roleRoutes = getAdminRoutes();
  // }

  const permittedRoutes = useMemo(() => {
    const allRoutes = getAdminRoutes();
    const isRetired = Boolean(userData?.is_retired === 1 || userData?.is_retired === true);
    if (userRoles.length === 0) {
      const publicRoutes = {};
      Object.keys(allRoutes).forEach(category => {
        let routes = allRoutes[category].filter(route =>
          !route.roles || route.roles.some(allowedRole => userRoles.includes(allowedRole))
        );
        // Hide My Pension for non-retired users
        if (category === 'PaySlip') {
          routes = routes.filter(route => {
            if (route.path === '/my-pension') {
              return isRetired;
            }
            return true;
          });
        }
        if (routes.length > 0) {
          publicRoutes[category] = routes;
        }
      });
      return publicRoutes;
    }

    const filteredRoutes = {};
    Object.keys(allRoutes).forEach(category => {
      let routes = allRoutes[category].filter(route => {
        return !route.roles || route.roles.some(allowedRole => userRoles.includes(allowedRole));
      });

      // Hide My Pension for non-retired users
      if (category === 'PaySlip') {
        routes = routes.filter(route => {
          if (route.path === '/my-pension') {
            return isRetired;
          }
          return true;
        });
      }

      if (routes.length > 0) {
        filteredRoutes[category] = routes;
      }
    });

    return filteredRoutes;
  }, [userRoles]);

  
  const getRoutes = (routes) => {
    const allFlattenedRoutes = Object.values(routes).flat();
    return allFlattenedRoutes.map((prop, key) => {
      return (
        <Route
          path={prop.path}
          element={
            <ProtectedRoute userRoles={userRoles} route={prop}>
              <prop.component />
            </ProtectedRoute>
          }
          key={key}
        />
      );
    });
  };


  const getBrandText = (path) => {
    for (let i = 0; i < roleRoutes.length; i++) {
      if (
        props?.location?.pathname.indexOf(roleRoutes[i].path) !==
        -1
      ) {
        return roleRoutes[i].name;
      }
    }
    return "Brand";
  };



  return (
    <>
      <Sidebar
        {...props}
        routes={permittedRoutes}
        logo={{
          innerLink: "/index",
          imgAlt: "...",
        }}
        isOpen={sidebarOpen}
        closeSidebar={() => setSidebarOpen(false)}
      />
      <div className="main-content" ref={mainContent}>
        <AdminNavbar
          {...props}
          brandText={getBrandText(props?.location?.pathname)}
          onSidebarToggle={() => setSidebarOpen((open) => !open)}
        />
        <Routes>
          {getRoutes(permittedRoutes)}
          <Route path="*" element={<Navigate to="/index" replace />} />
        </Routes>
        <Container style={{ padding: '0px' }}>
          <AdminFooter />
        </Container>
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          transition={Bounce}
        />
      </div>
    </>
  );
};

export default AdminLayout;
