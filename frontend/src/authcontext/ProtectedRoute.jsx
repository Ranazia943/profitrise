import { Navigate } from "react-router-dom";
import { useAuthContext } from "./authcontext/AuthContext";

const ProtectedRoute = ({ children, isAdminRoute = false }) => {
  const { authUser } = useAuthContext();

  if (!authUser) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" />;
  }

  if (isAdminRoute && authUser.role !== "admin") {
    // Redirect to home if trying to access admin route without admin role
    return <Navigate to="/" />;
  }

  // Render the child component if authenticated and authorized
  return children;
};

export default ProtectedRoute;
