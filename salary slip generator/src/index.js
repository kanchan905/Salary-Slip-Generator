import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "assets/plugins/nucleo/css/nucleo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/scss/argon-dashboard-react.scss";
import './assets/css/custom.css';
import AdminLayout from "layouts/Admin";
import { Provider,useSelector } from "react-redux";
import store from "./redux/store";
import Login from "views/examples/Login";
import SignUpPage from "views/examples/Register";
import PrivateRoute from "clientLayout";


const App = () => {
  const user = useSelector((state) => state.auth.user) || null; 


  return (
    <BrowserRouter>
      {/* <Routes>
        {!user ? (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        ) : (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/sign-up" element={<SignUpPage />} />
            <Route
              path="/admin/*"
              element={
                <PrivateRoute>
                  <AdminLayout />
                </PrivateRoute>
              }
            />
            {/* <Route
              path="/accounts/*"
              element={
                <PrivateRoute>
                  <AdminLayout />
                </PrivateRoute>
              }
            /> */}
            {/* <Route path="*" element={<Navigate to='/admin/index' replace />} /> */}
          {/* </> */}
        {/* )} */}
      {/* </Routes> */}
      <Routes>
        <Route path="/login" element={<Login/>}></Route>
      <Route
              path="/admin/*"
              element={
                  <AdminLayout />
              }
            />
            <Route path="*" element={<Navigate to='/admin/index' replace />} />
      </Routes>
    </BrowserRouter>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);