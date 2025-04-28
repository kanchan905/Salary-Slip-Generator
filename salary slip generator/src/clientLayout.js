import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ children }) => {
    // Check if user exists in Redux state or localStorage
    const user = useSelector((state) => state.user) || JSON.parse(localStorage.getItem("userData"));


    if (!user) {
        // Redirect to login if the user is not logged in
        return <Navigate to="/login" />;
    }

    return children;
};

export default PrivateRoute;