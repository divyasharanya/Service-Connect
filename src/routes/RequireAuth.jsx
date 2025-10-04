import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

export default function RequireAuth({ children }) {
  const user = useSelector((s) => s.auth.user);
  const location = useLocation();
  if (!user) {
    return <Navigate to="/user-login" state={{ from: location.pathname }} replace />;
  }
  return children;
}