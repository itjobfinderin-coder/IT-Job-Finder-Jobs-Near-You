import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { dashboardPathFor } from "../utils/roles";

// Only authenticated users may enter; optionally restricted to specific roles.
export function ProtectedRoute({ allowedRoles }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={dashboardPathFor(user.role)} replace />;
  }
  return <Outlet />;
}

// Login/signup pages: logged-in users are sent to their dashboard instead.
export function GuestRoute() {
  const { user } = useAuth();
  if (user) {
    return <Navigate to={dashboardPathFor(user.role)} replace />;
  }
  return <Outlet />;
}
