import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import MasterPanel from "../components/admin/MasterPanel";

const Profile = () => {
  const { user, role, candidates, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  // comment: logout function
  const handleLogout = async () => {
    try {
      await axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth/logout`, {
        withCredentials: true,
      });

      setUser(null); // comment: clear user
      navigate("/"); // comment: redirect to login
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <h1 className="text-center font-bold mt-5 text-[35px]">Profile Page</h1>

      {/* comment: logout button */}
      <button
        className="px-3 py-1 border-2 ml-5 rounded-2xl cursor-pointer bg-slate-400 mt-5"
        onClick={handleLogout}
      >
        Logout
      </button>

      {/* comment: candidate view */}
      {/* comment: candidate view */}
      {role === "candidate" && user && (
        <div className="max-w-3xl mx-auto bg-white shadow-md rounded p-6 mt-4">
          <h2 className="text-2xl font-bold mb-4">My Profile</h2>

          {/* comment: basic info */}
          <div className="mb-4">
            <p>
              <span className="font-semibold">Name:</span> {user.name}
            </p>
            <p>
              <span className="font-semibold">Email:</span> {user.email}
            </p>
            <p>
              <span className="font-semibold">Role:</span> {user.role}
            </p>
          </div>

          {/* comment: user details */}
          {user.userDetails && (
            <div className="mb-4">
              <h3 className="text-xl font-semibold mb-2">Personal Details</h3>
              <p>
                <span className="font-semibold">Full Name:</span>{" "}
                {user.userDetails.full_name}
              </p>
              <p>
                <span className="font-semibold">DOB:</span>{" "}
                {user.userDetails.dob}
              </p>
              <p>
                <span className="font-semibold">State:</span>{" "}
                {user.userDetails.state}
              </p>
              <p>
                <span className="font-semibold">City:</span>{" "}
                {user.userDetails.city || "N/A"}
              </p>
              <p>
                <span className="font-semibold">Mobile:</span>{" "}
                {user.userDetails.mobile_number}
              </p>
              <p>
                <span className="font-semibold">Skills:</span>{" "}
                {user.userDetails.key_skills}
              </p>
              <p>
                <span className="font-semibold">Experience:</span>{" "}
                {user.userDetails.total_experience} years
              </p>
            </div>
          )}

          {/* comment: education */}
          {user.education?.length > 0 && (
            <div className="mb-4">
              <h3 className="text-xl font-semibold mb-2">Education</h3>
              {user.education.map((edu, index) => (
                <div key={index} className="border p-2 mb-2 rounded">
                  <p>
                    <span className="font-semibold">Specialization:</span>{" "}
                    {edu.specialization}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* comment: work experience */}
          {user.workExperience?.length > 0 && (
            <div className="mb-4">
              <h3 className="text-xl font-semibold mb-2">Work Experience</h3>
              {user.workExperience.map((work, index) => (
                <div key={index} className="border p-2 mb-2 rounded">
                  <p>
                    <span className="font-semibold">Company:</span>{" "}
                    {work.organization_name}
                  </p>
                  <p>
                    <span className="font-semibold">Role:</span>{" "}
                    {work.job_profile}
                  </p>
                  <p>
                    <span className="font-semibold">Duration:</span>{" "}
                    {work.from_year} -{" "}
                    {work.is_current ? "Present" : work.to_year}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {
        role === "admin" && <MasterPanel role="admin" />
      }

      {/* comment: admin view */}
      {/* comment: admin view */}
      {role === "admin" && (
        <div className="max-w-7xl mx-auto mt-6 px-4">
          <h2 className="text-3xl font-bold mb-6 text-center">
            Admin Dashboard
          </h2>

          {/* comment: candidates grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {candidates.map((c, index) => (
              <div
                key={index}
                className="bg-white shadow-lg rounded-xl p-5 border hover:shadow-xl transition"
              >
                {/* comment: profile image */}
                {c.userDetails?.profile_picture && (
                  <div className="flex justify-center mb-4">
                    <img
                      src={`${import.meta.env.VITE_BACKEND_URL}/uploads/profile/${c.userDetails.profile_picture}`}
                      alt="profile"
                      className="w-24 h-24 rounded-full object-cover border"
                    />
                  </div>
                )}

                {/* comment: basic info */}
                <h3 className="text-xl font-semibold text-center">{c.name}</h3>
                <p className="text-sm text-gray-600 text-center mb-2">
                  {c.email}
                </p>

                <div className="text-sm mb-3 text-center">
                  <p>
                    <span className="font-semibold">Verified:</span>{" "}
                    {c.is_verified ? "✅" : "❌"}
                  </p>
                  <p>
                    <span className="font-semibold">Profile:</span>{" "}
                    {c.is_profile_completed ? "Completed" : "Incomplete"}
                  </p>
                </div>

                {/* comment: user details */}
                {c.userDetails && (
                  <div className="border-t pt-3 text-sm space-y-1">
                    <p>
                      <span className="font-semibold">Full Name:</span>{" "}
                      {c.userDetails.full_name}
                    </p>
                    <p>
                      <span className="font-semibold">DOB:</span>{" "}
                      {c.userDetails.dob}
                    </p>
                    <p>
                      <span className="font-semibold">State:</span>{" "}
                      {c.userDetails.state}
                    </p>
                    <p>
                      <span className="font-semibold">City:</span>{" "}
                      {c.userDetails.city || "N/A"}
                    </p>
                    <p>
                      <span className="font-semibold">Mobile:</span>{" "}
                      {c.userDetails.mobile_number}
                    </p>
                    <p>
                      <span className="font-semibold">Experience:</span>{" "}
                      {c.userDetails.total_experience} yrs
                    </p>
                    <p>
                      <span className="font-semibold">Skills:</span>{" "}
                      {c.userDetails.key_skills}
                    </p>
                  </div>
                )}

                {/* comment: education */}
                {c.education?.length > 0 && (
                  <div className="mt-3 text-sm">
                    <p className="font-semibold mb-1">Education:</p>
                    {c.education.map((edu, i) => (
                      <div key={i} className="pl-2">
                        • {edu.specialization}
                      </div>
                    ))}
                  </div>
                )}

                {/* comment: work experience */}
                {c.workExperience?.length > 0 && (
                  <div className="mt-3 text-sm">
                    <p className="font-semibold mb-1">Work Experience:</p>
                    {c.workExperience.map((w, i) => (
                      <div key={i} className="border p-2 rounded mb-2">
                        <p>
                          <span className="font-semibold">Company:</span>{" "}
                          {w.organization_name}
                        </p>
                        <p>
                          <span className="font-semibold">Role:</span>{" "}
                          {w.job_profile}
                        </p>
                        <p>
                          <span className="font-semibold">Duration:</span>{" "}
                          {w.from_year} - {w.is_current ? "Present" : w.to_year}
                        </p>

                        {/* comment: resume link */}
                        {w.resume && (
                          <a
                            href={`${import.meta.env.VITE_BACKEND_URL}/uploads/resume/${w.resume}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-500 underline text-xs"
                          >
                            View Resume
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
