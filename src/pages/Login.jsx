import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // ✅ navigation
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext"; // comment: import context

const Login = () => {
  // comment: state for form
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate(); // ✅ hook
  const [loading, setLoading] = useState(false);
  const { setUser, setRole, setCandidates } = useContext(AuthContext); // comment: update global auth state

  // comment: handle input change
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // comment: submit login
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate email and password before calling API
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      alert("Please enter a valid email address.");
      return;
    }

    if (!form.password) {
      alert("Please enter your password.");
      return;
    }

    setLoading(true);
    try {
      // comment: call backend (with cookie support)

      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/login`, form, {
        withCredentials: true,
      });

      console.log("Login Success:", res);
      if (res.data?.data?.success) {
        // comment: set role
        setRole(res.data.data.role);

        // comment: handle admin
        if (res.data.data.role === "admin") {
          setUser(res.data.data.admin);
          setCandidates(res.data.data.candidates || []);
        }
        // comment: handle candidate
        else {
          setUser(res.data.data.user);
          setCandidates([]);
        }

        // comment: navigate AFTER setting state
        navigate("/profile");
      }

      alert(`${res.data.data.message}`);
    } catch (err) {
      // Display error message using alert
      alert(
        err.response?.data?.data?.message || "An error occurred. Please try again.",
      );
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="flex flex-col gap-3">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded shadow-md w-96"
        >
          <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full p-2 border mb-3"
            onChange={handleChange}
          />

          {/* Password */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full p-2 border mb-3"
            onChange={handleChange}
          />

          {/* Submit */}
          {!loading && (
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded"
            >
              Login
            </button>
          )}
        </form>
        {!loading && (
          <button
            type="button"
            onClick={() => navigate("/signup")} // ✅ go to signup
            className="w-full mt-3 bg-green-500 text-white p-2 rounded"
          >
            Create Account
          </button>
        )}
        {loading && <loading />}
      </div>
    </div>
  );
};

export default Login;
