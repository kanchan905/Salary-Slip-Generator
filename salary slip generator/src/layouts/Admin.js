import React from "react";
import { useLocation, Route, Routes} from "react-router-dom";
import { Container } from "reactstrap";
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import AdminFooter from "components/Footers/AdminFooter.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import { accountOfficerRoutes } from "routes/accountOfficerRoutes";
import { useSelector } from "react-redux";
import { getCookie } from "cookies-next";
import  getAdminRoutes  from "../routes/adminRoutes";
import { Bounce, ToastContainer } from "react-toastify";



const AdminLayout = (props) => {
  const mainContent = React.useRef(null);
  const location = useLocation();
  const { role } = useSelector((state) => state.auth.user) ||  getCookie('user');
  console.log('role', role);
  let roleRoutes = [];


  React.useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainContent.current.scrollTop = 0;
  }, [location]);

  // Select routes based on the user's role
  switch (role?.name) {
    case "Admin":
      roleRoutes = getAdminRoutes(role?.name.toLowerCase());
      break;
    case "Accounts Officer":
      roleRoutes = accountOfficerRoutes;
      break;
    case "finance":
      roleRoutes = accountOfficerRoutes;
      break;
    default:
      roleRoutes = [];
  }


  const getRoutes = (routes) => {
    const filteredRoutes = Object.values(routes).flat();
    return filteredRoutes.map((prop, key) => {
        return (
          <Route path={prop.layout + prop.path} element={<prop.component />} key={key} />
        );
      }
    );
  };

  const getBrandText = (path) => {
    for (let i = 0; i < roleRoutes.length; i++) {
      if (
        props?.location?.pathname.indexOf(roleRoutes[i].layout + roleRoutes[i].path) !==
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
        routes={roleRoutes}
        logo={{
          innerLink: "/admin/index",
          // imgSrc: require("#"),
          imgAlt: "...",
        }}
      />
      <div className="main-content" style={{height:'100vh'}} ref={mainContent}>
        <AdminNavbar
          {...props}
          brandText={getBrandText(props?.location?.pathname)}
        />
        <Routes>
          {getRoutes(roleRoutes)}
        </Routes>
        <Container style={{padding:'0px'}}>
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
