import { Navigate, useLocation } from "react-router-dom";

export function ProtectedRoute({ children }) {
  const location = useLocation();
  const token = localStorage.getItem("auth_token");

  if (!token) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
}
