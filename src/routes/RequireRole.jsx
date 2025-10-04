import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import RequireAuth from "routes/RequireAuth";

export default function RequireRole({ roles = [], children }) {
  return (
    <RequireAuth>
      <RoleGate roles={roles}>{children}</RoleGate>
    </RequireAuth>
  );
}

function RoleGate({ roles, children }) {
  const user = useSelector((s) => s.auth.user);
  if (!user) return null;
  if (roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  return children;
}