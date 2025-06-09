import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "assets/plugins/nucleo/css/nucleo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/scss/argon-dashboard-react.scss";
import './assets/css/custom.css';
import AdminLayout from "layouts/Admin";
import { Provider, useSelector } from "react-redux";
import store from "./redux/store";
import Login from "views/Login";
import SignUpPage from "views/Register";
import PrivateRoute from "clientLayout";


const App = () => {
  const { user } = useSelector((state) => state.auth) || null;
  console.log('user',user)
  const name = user?.role?.name || '';
  console.log('name', name);

  return (
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
            <Route path="/" element={<Navigate to={`/${name.replace(/\s+/g, '-').toLowerCase()}/index`} replace />} />
            <Route path="/*"  element={
              <PrivateRoute>
                <AdminLayout />
              </PrivateRoute>} />
          </>
        )}
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