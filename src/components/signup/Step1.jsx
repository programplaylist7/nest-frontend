import { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../common/Loader";

const Step1 = ({ setStep, formData, setFormData }) => {
  const [countries, setCountries] = useState([]);
  const [errors, setErrors] = useState({});
  const [emailStatus, setEmailStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(""); // comment: added for API errors

  // comment: fetch countries on mount
  const fetchCountries = async () => {
    try {
      const res = await axios.get("${import.meta.env.VITE_BACKEND_URL}/country");
      setCountries(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // comment: handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // comment: email validation + check API
  const handleEmailBlur = async () => {
    const email = formData.email;

    if (!email) {
      setErrors((prev) => ({ ...prev, email: "Email is required" }));
      return;
    }

    const emailRegex = /\S+@\S+\.\S+/;

    if (!emailRegex.test(email)) {
      setErrors((prev) => ({ ...prev, email: "Invalid email format" }));
      return;
    }

    try {
      const res = await axios.post("${import.meta.env.VITE_BACKEND_URL}/auth/check-email", {
        email,
      });

      if (res.data.exists) {
        setErrors((prev) => ({ ...prev, email: res.data.message }));
        setEmailStatus("");
      } else {
        setErrors((prev) => ({ ...prev, email: "" }));
        setEmailStatus("Email available");
      }
    } catch (err) {
      console.log(err);
      setApiError("Email validation failed. Try again.");
    }
  };

  // comment: password validation
  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/;
    return regex.test(password);
  };

  const handlePasswordBlur = () => {
    if (!validatePassword(formData.password)) {
      setErrors((prev) => ({
        ...prev,
        password:
          "Password must be 6+ chars with uppercase, lowercase, number & special char",
      }));
    } else {
      setErrors((prev) => ({ ...prev, password: "" }));
    }
  };

  const handleConfirmBlur = () => {
    if (formData.password !== formData.confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match",
      }));
    } else {
      setErrors((prev) => ({ ...prev, confirmPassword: "" }));
    }
  };

  // comment: file validation
  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (file.size > 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        profile_picture: "Image must be less than 1MB",
      }));
      return;
    }

    setFormData({
      ...formData,
      profile_picture: file,
    });

    setErrors((prev) => ({ ...prev, profile_picture: "" }));
  };

  // comment: full form validation
  const validateForm = () => {
    let newErrors = {};

    if (!formData.name) newErrors.name = "User Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (!formData.confirmPassword)
      newErrors.confirmPassword = "Confirm Password is required";
    if (!formData.profile_picture)
      newErrors.profile_picture = "Profile picture is required";
    if (!formData.full_name) newErrors.full_name = "Full Name is required";
    if (!formData.dob) newErrors.dob = "Date of Birth is required";
    if (!formData.country_id) newErrors.country_id = "Country is required";
    if (!formData.state) newErrors.state = "State is required";
    if (!formData.city) newErrors.city = "City is required";
    if (!formData.mobile_number)
      newErrors.mobile_number = "Mobile Number is required";
    if (!formData.total_experience)
      newErrors.total_experience = "Experience is required";
    if (!formData.key_skills) newErrors.key_skills = "Key Skills are required";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // comment: submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    setApiError(""); // comment: clear previous API error
    

    if (!validateForm()) {
      setApiError("Please fix all errors before submitting.");
      return;
    }

    if (emailStatus !== "Email available") {
      setApiError("Email must be available before proceeding.");
      return;
    }

    setLoading(true);

    try {
      const form = new FormData();

      // comment: append all form data
      Object.keys(formData).forEach((key) => {
        form.append(key, formData[key]);
      });

      const res = await axios.post(
        "${import.meta.env.VITE_BACKEND_URL}/auth/signup-step1",
        form,
      );

      console.log("res.data: ", res.data);
      setFormData({
        ...formData,
        user_id: res.data.user_id,
      });


      setStep(2); // comment: move to next step
    } catch (err) {
      console.log(err);

      // comment: handle backend + network errors
      if (err.response) {
        setApiError(err.response.data.message || "Server error occurred");
      } else if (err.request) {
        setApiError("Server not responding. Try again.");
      } else {
        setApiError("Unexpected error occurred.");
      }
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold text-center">User Name & Password</h2>

      {/* API ERROR */}
      {apiError && (
        <div className="bg-red-100 text-red-600 p-2 rounded">{apiError}</div>
      )}

      {/* USERNAME */}
      <label>User Name *</label>
      <input
        type="text"
        name="name"
        className="input"
        onChange={handleChange}
      />
      {errors.name && <p className="text-red-500">{errors.name}</p>}

      {/* EMAIL */}
      <label>Email *</label>
      <input
        type="email"
        name="email"
        className="input"
        onChange={handleChange}
        onBlur={handleEmailBlur}
      />
      {errors.email && <p className="text-red-500">{errors.email}</p>}
      {emailStatus && <p className="text-green-500">{emailStatus}</p>}

      {/* PASSWORD */}
      <label>Password *</label>
      <input
        type="text"
        name="password"
        className="input"
        onChange={handleChange}
        onBlur={handlePasswordBlur}
      />
      {errors.password && <p className="text-red-500">{errors.password}</p>}

      {/* CONFIRM PASSWORD */}
      <label>Confirm Password *</label>
      <input
        type="text"
        name="confirmPassword"
        className="input"
        onChange={handleChange}
        onBlur={handleConfirmBlur}
      />
      {errors.confirmPassword && (
        <p className="text-red-500">{errors.confirmPassword}</p>
      )}

      {/* PROFILE */}
      <label>Profile Picture *</label>
      <input type="file" onChange={handleFileChange} />
      {errors.profile_picture && (
        <p className="text-red-500">{errors.profile_picture}</p>
      )}

      {/* CONTACT */}
      <h2 className="text-lg font-bold text-center">Contact Information</h2>

      <label>Full Name *</label>
      <input
        type="text"
        name="full_name"
        className="input"
        onChange={handleChange}
      />

      <label>Date of Birth *</label>
      <input type="date" name="dob" className="input" onChange={handleChange} />

      <label>Country *</label>
      <select name="country_id" className="input" onChange={handleChange}>
        <option value="">Select Country</option>
        {countries.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      <label>State *</label>
      <input
        type="text"
        name="state"
        className="input"
        onChange={handleChange}
      />

      <label>City *</label>
      <input
        type="text"
        name="city"
        className="input"
        onChange={handleChange}
      />

      <label>Phone Number</label>
      <input
        type="text"
        name="phone_number"
        className="input"
        onChange={handleChange}
      />

      <label>Mobile Number *</label>
      <input
        type="text"
        name="mobile_number"
        className="input"
        onChange={handleChange}
      />

      {/* RESUME */}
      <h2 className="text-lg font-bold text-center">Resume Details</h2>

      <label>Total Experience *</label>
      <input
        type="text"
        name="total_experience"
        className="input"
        onChange={handleChange}
      />

      <label>Key Skills *</label>
      <textarea name="key_skills" className="input" onChange={handleChange} />

      <p className="text-sm text-red-500">
        ⚠️ After clicking Next, you cannot come back.
      </p>

      <button
        type="submit"
        className="w-full bg-blue-500 text-white p-2 rounded disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Processing..." : "Next"}
      </button>

      {loading && <Loader />}
    </form>
  );
};

export default Step1;
