import { RootState } from "@/States/store";
import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user } = useSelector((state: RootState) => state.login);
  
  // Retrieve the saved user from sessionStorage, fallback to Redux user if null
  const savedUser = React.useMemo(() => {
    const sessionUser = localStorage.getItem("user");
    return sessionUser ? JSON.parse(sessionUser) : user;
  }, [user]);

  // Debugging logs (optional, remove in production)

  // Redirect logic
  if (!savedUser) {
    return <Navigate to="/login" replace />;
  }

  // if (user.role === "admin") {
  //   return <Navigate to="/admin" replace />;
  // }

  return <>{children}</>;
};

export default ProtectedRoute;
