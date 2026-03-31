import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const PublicRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <p>Loading...</p>;

  // comment: if logged in → go profile
  if (user) return <Navigate to="/profile" />;

  return children;
};

export default PublicRoute;
