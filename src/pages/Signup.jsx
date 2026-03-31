import { useState } from "react";
import  Step1  from "../components/signup/Step1";
import  Step2  from "../components/signup/Step2";
import { useNavigate } from "react-router-dom"; // ✅ navigation

const Signup = () => {
  // comment: step control
  const [step, setStep] = useState(1);

  // comment: store form data
  const [formData, setFormData] = useState({});
  const navigate = useNavigate(); // ✅ hook


  return (
    <div className="flex items-center justify-center h-auto py-12  bg-gray-400">
      <div className="flex flex-col gap-3">
        <div className="bg-gray-200 p-6 rounded-xl shadow-md w-[500px]">
          {step === 1 && (
            <Step1
              setStep={setStep}
              formData={formData}
              setFormData={setFormData}
            />
          )}

          {step === 2 && (
            <Step2
              setStep={setStep}
              formData={formData}
              setFormData={setFormData}
            />
          )}
        </div>
        <button
          type="button"
          onClick={() => navigate("/")} // ✅ go to signup
          className="w-full mt-3 bg-green-500 text-white p-2 rounded"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Signup;
