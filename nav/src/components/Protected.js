import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";

const Protected = ({ children }) => {
  const { userLoggedIn } = useAuth();
  if (!userLoggedIn) {
    return <Navigate to="/" />;
  }

  return children;
};

export default Protected;
