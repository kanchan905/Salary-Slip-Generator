import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getCookie } from 'cookies-next';

const PrivateRoute = ({ children }) => {
    const { token } = useSelector((state) => state.auth);
    const cookieToken = getCookie("token");
   


    if (!token && !cookieToken) {
        return <Navigate to="/login" />;
    }

    return children;
};

export default PrivateRoute;