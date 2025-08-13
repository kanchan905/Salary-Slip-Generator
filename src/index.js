import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "assets/plugins/nucleo/css/nucleo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/scss/argon-dashboard-react.scss";
import './assets/css/custom.css';
import './assets/css/responsive-utilities.css';
import AdminLayout from "layouts/Admin";
import { Provider, useSelector } from "react-redux";
import store from "./redux/store";
import Login from "views/Login";
import ForgotPassword from "views/ForgotPassword";
import PrivateRoute from "clientLayout";
import SessionTimeoutManager from "utils/SessionTimeoutManager";
import PensionSlipPage from "./pages/Net-Pension/OwnPension"
import { setStore } from "./global/AxiosSetting";

// Set store reference for Axios interceptor
setStore(store);

const AppContent = () => {
  const { user, token } = useSelector((state) => state.auth) || {};

  return (
    <BrowserRouter>
      <Routes>
        {!user || !token ? (
          <>
            <Route path="/pensioner-slip" element={<PensionSlipPage/>}/>
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        ) : (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/" element={<Navigate to={`/index`} replace />} />
            <Route path="/*" element={
              <PrivateRoute>
                <AdminLayout />
              </PrivateRoute>} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <SessionTimeoutManager>
        <AppContent />
      </SessionTimeoutManager>
    </Provider>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(<App />);