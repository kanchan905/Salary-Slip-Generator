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
  console.log("ProtectedRoute - TEMPORARY: Allowing access for testing", { userRoles, route });
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
    console.log("AdminLayout - User Roles:", userRoles);
    console.log("AdminLayout - All Routes:", allRoutes);
    
    // TEMPORARY: Always return all routes for testing
    console.log("AdminLayout - TEMPORARY: Returning all routes for testing");
    return allRoutes;
    
    // Declare filteredRoutes at the beginning
    const filteredRoutes = {};
    
    if (userRoles.length === 0) {
      console.log("AdminLayout - No user roles found");
      Object.keys(allRoutes).forEach(category => {
        const routes = allRoutes[category].filter(route =>
          !route.roles || route.roles.some(allowedRole => userRoles.includes(allowedRole))
        );
        if (routes.length > 0) {
          filteredRoutes[category] = routes;
        }
      });
      console.log("AdminLayout - Public Routes:", filteredRoutes);
      return filteredRoutes;
    }

    Object.keys(allRoutes).forEach(category => {
      const routes = allRoutes[category].filter(route => {
        return !route.roles || route.roles.some(allowedRole => userRoles.includes(allowedRole));
      });

      if (routes.length > 0) {
        filteredRoutes[category] = routes;
      }
    });

    console.log("AdminLayout - Filtered Routes:", filteredRoutes);
    return filteredRoutes;
  }, [userRoles]);

  console.log("AdminLayout - Permitted Routes:", permittedRoutes);
  const getRoutes = (routes) => {
    const allFlattenedRoutes = Object.values(routes).flat();
    console.log("AdminLayout - Routes:", routes);
    console.log("AdminLayout - All Flattened Routes:", allFlattenedRoutes);
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
