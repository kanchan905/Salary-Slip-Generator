import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "assets/plugins/nucleo/css/nucleo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/scss/argon-dashboard-react.scss";
import './assets/css/custom.css';
import AdminLayout from "layouts/Admin";
import { Provider } from "react-redux";
import store from "./redux/store";
import Login from "views/examples/Login";
import SignUpPage from "views/examples/Register";
import PrivateRoute from "clientLayout";

const root = ReactDOM.createRoot(document.getElementById("root"));
const user = JSON.parse(localStorage.getItem("userData")) || null;

root.render(
  <Provider store={store}>
    <BrowserRouter>
      <Routes>
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
            <Route
              path="/accounts/*"
              element={
                <PrivateRoute>
                  <AdminLayout />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<Navigate to={`/${user.role.toLowerCase()}/index`} replace />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  </Provider>
);