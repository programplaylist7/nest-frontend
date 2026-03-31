import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  // comment: wait until auth check completes
  if (loading) return <p>Loading...</p>;

  // comment: if not logged in → go login
  if (!user) return <Navigate to="/" />;

  return children;
};

export default PrivateRoute;
