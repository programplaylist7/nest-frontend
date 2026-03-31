import { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../common/Loader";
import { useNavigate } from "react-router-dom";

const Step2 = ({ setStep, formData }) => {
  const [qualifications, setQualifications] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  console.log("formDATA.user_id: ", formData.user_id);

  // comment: dynamic arrays
  const [education, setEducation] = useState([
    { qualification_id: "", specialization: "" },
  ]);

  const [currentExp, setCurrentExp] = useState({
    organization_name: "",
    designation_id: "",
    from_year: "",
    to_year: "",
    job_profile: "",
  });

  const [pastExp, setPastExp] = useState({
    organization_name: "",
    designation_id: "",
    from_year: "",
    to_year: "",
    job_profile: "",
  });

  const [resume, setResume] = useState(null);

  const fetchDropdowns = async () => {
    try {
      const [qRes, dRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/qualification`),
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/designation`),
      ]);

      setQualifications(qRes.data);
      setDesignations(dRes.data);
    } catch (err) {
      console.log(err);
    }
  };

  // comment: fetch dropdown data
  useEffect(() => {
    fetchDropdowns();
  }, []);

  // comment: handle education change
  const handleEducationChange = (index, field, value) => {
    const updated = [...education];
    updated[index][field] = value;
    setEducation(updated);
  };

  // comment: handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const form = new FormData();

      console.log("formData.userId", formData.user_id);

      // comment: required user_id
      form.append("user_id", Number(formData.user_id));

      // comment: convert to JSON
      form.append("education", JSON.stringify(education));

      form.append(
        "experience",
        JSON.stringify([
          {
            ...currentExp,
            is_current: true, // ✅ current
          },
          {
            ...pastExp,
            is_current: false, // ✅ past
          },
        ]),
      );

      // comment: resume file
      if (resume) {
        form.append("resume", resume);
      }

      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/signup-step2`, form, {
        withCredentials: true,
      });

      // comment: redirect after completion
      alert("Signup Completed 🎉");
      navigate("/");
    } catch (err) {
      console.log(err);
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* EDUCATION */}
      <h2 className="text-lg font-bold">Education Qualification</h2>

      {education.map((edu, index) => (
        <div key={index} className="space-y-2">
          <label>Qualification</label>
          <select
            className="input"
            onChange={(e) =>
              handleEducationChange(index, "qualification_id", e.target.value)
            }
          >
            <option>Select Qualification</option>
            {qualifications.map((q) => (
              <option key={q.id} value={q.id}>
                {q.name}
              </option>
            ))}
          </select>

          <label>Specialization</label>
          <input
            type="text"
            placeholder="Specialization"
            className="input"
            onChange={(e) =>
              handleEducationChange(index, "specialization", e.target.value)
            }
          />
        </div>
      ))}

      {/* CURRENT EXPERIENCE */}
      <h2 className="text-lg font-bold">Current Work Experience</h2>

      <label>Organization</label>
      <input
        type="text"
        placeholder="Organization"
        className="input"
        onChange={(e) =>
          setCurrentExp({ ...currentExp, organization_name: e.target.value })
        }
      />

      <label>Designation</label>
      <select
        className="input"
        onChange={(e) =>
          setCurrentExp({ ...currentExp, designation_id: e.target.value })
        }
      >
        <option>Select Designation</option>
        {designations.map((d) => (
          <option key={d.id} value={d.id}>
            {d.name}
          </option>
        ))}
      </select>

      <label>From Year</label>
      <input
        type="number"
        className="input"
        onChange={(e) =>
          setCurrentExp({ ...currentExp, from_year: e.target.value })
        }
      />

      <label>To Year</label>
      <input
        type="number"
        className="input"
        onChange={(e) =>
          setCurrentExp({ ...currentExp, to_year: e.target.value })
        }
      />

      <label>Job Profile</label>
      <textarea
        className="input"
        onChange={(e) =>
          setCurrentExp({ ...currentExp, job_profile: e.target.value })
        }
      />

      {/* PAST EXPERIENCE */}
      <h2 className="text-lg font-bold">Past Work Experience</h2>

      <label>Organization</label>
      <input
        type="text"
        className="input"
        onChange={(e) =>
          setPastExp({ ...pastExp, organization_name: e.target.value })
        }
      />

      <label>Designation</label>
      <select
        className="input"
        onChange={(e) =>
          setPastExp({ ...pastExp, designation_id: e.target.value })
        }
      >
        <option>Select Designation</option>
        {designations.map((d) => (
          <option key={d.id} value={d.id}>
            {d.name}
          </option>
        ))}
      </select>

      <label>From Year</label>
      <input
        type="number"
        className="input"
        onChange={(e) => setPastExp({ ...pastExp, from_year: e.target.value })}
      />

      <label>To Year</label>
      <input
        type="number"
        className="input"
        onChange={(e) => setPastExp({ ...pastExp, to_year: e.target.value })}
      />

      <label>Job Profile</label>
      <textarea
        className="input"
        onChange={(e) =>
          setPastExp({ ...pastExp, job_profile: e.target.value })
        }
      />

      {/* RESUME */}
      <label>Upload Resume</label>
      <input
        type="file"
        onChange={(e) => setResume(e.target.files[0])}
        className="input"
      />

      {/* BUTTONS */}
      <div className="flex gap-2">
        <button
          type="submit"
          className="w-full bg-green-500 text-white p-2 rounded"
        >
          Submit
        </button>
      </div>

      {loading && <Loader />}
    </form>
  );
};

export default Step2;
