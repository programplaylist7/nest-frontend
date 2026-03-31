import { createContext, useEffect, useState } from "react";
import axios from "axios"; // comment: axios with credentials

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // comment: store logged-in user (admin OR candidate)
  const [user, setUser] = useState(null);

  // comment: store role (admin / candidate)
  const [role, setRole] = useState(null);

  // comment: store all candidates (only for admin)
  const [candidates, setCandidates] = useState([]);

  // comment: loading state while checking auth
  const [loading, setLoading] = useState(true);

  // comment: check login on app start (refresh API)
  const checkAuth = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth/refresh`, {
        withCredentials: true,
      });

      // comment: store role from backend
      setRole(res.data.data.role);

      // comment: handle admin response
      if (res.data.data.role === "admin") {
        setUser(res.data.data.admin); // comment: set admin data
        setCandidates(res.data.data.candidates || []); // comment: set all users
      }
      // comment: handle candidate response
      else if (res.data.data.role === "candidate") {
        setUser(res.data.data.user); // comment: set candidate data
        setCandidates([]); // comment: clear candidates for safety
      }
    } catch (err) {
      // comment: if not logged in
      setUser(null);
      setRole(null);
      setCandidates([]);
    }

    setLoading(false);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        candidates,
        setUser,
        setRole,
        setCandidates,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
