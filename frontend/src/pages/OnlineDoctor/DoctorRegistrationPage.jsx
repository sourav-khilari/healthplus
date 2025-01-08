import { useState } from "react";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  getIdToken,
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";

import axiosInstance from "../../axios/axios_interceptor.js";
import "../../styles/Register.css";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyDJ9L91dE5EIVqH2QJNZiNsyObiiBmGuHo",
  authDomain: "healthplus-a7bd7.firebaseapp.com",
  projectId: "healthplus-a7bd7",
  storageBucket: "healthplus-a7bd7.firebasestorage.app",
  messagingSenderId: "18341081891",
  appId: "1:18341081891:web:9eedc02c6d5a064ed81296",
  measurementId: "G-6D223N3RLB",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const DoctorRegistrationPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    department: "",
    speciality: "",
    email: "",
    phone: "",
    availability: "",
    slotDuration: "",
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post(
        "/onlineregisterDoctor",
        formData
      );
      alert("Registration successful: " + response.data.message);
      setSuccess(true);
      setError(null);
    } catch (error) {
      console.error("Registration Error:", error.message);
      setError("Registration failed: " + error.message);
      setSuccess(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await getIdToken(result.user);

      const response = await axiosInstance.post("/registerDoctorWithGoogle", {
        idToken,
      });
      alert("Google Login/Registration successful");
      console.log(response.data);

      setSuccess(true);
      setError(null);
    } catch (error) {
      console.error("Google Auth Error:", error.message);
      setError("Google Authentication failed: " + error.message);
      setSuccess(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <h2 className="register-title">Doctor Registration</h2>

        <form onSubmit={handleSubmit} className="register-form">
          {[
            { label: "Name", name: "name", type: "text", placeholder: "Name" },
            {
              label: "Department",
              name: "department",
              type: "text",
              placeholder: "Department",
            },
            {
              label: "Speciality",
              name: "speciality",
              type: "text",
              placeholder: "Speciality",
            },
            {
              label: "Email",
              name: "email",
              type: "email",
              placeholder: "Email",
            },
            {
              label: "Phone",
              name: "phone",
              type: "text",
              placeholder: "Phone",
            },
            {
              label: "Availability",
              name: "availability",
              type: "text",
              placeholder: "Availability",
            },
            {
              label: "Slot Duration (minutes)",
              name: "slotDuration",
              type: "number",
              placeholder: "Slot Duration",
            },
          ].map((field, index) => (
            <div className="form-group" key={index}>
              <label htmlFor={field.name}>{field.label}</label>
              <input
                type={field.type}
                name={field.name}
                id={field.name}
                placeholder={field.placeholder}
                value={formData[field.name]}
                onChange={handleChange}
                required
                className="input-field"
              />
            </div>
          ))}

          <button type="submit" className="submit-btn">
            Register
          </button>
        </form>

        <div className="alternate-actions">
          <button onClick={handleGoogleLogin} className="google-login-btn">
            Google Login
          </button>
        </div>

        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">Registration Successful!</p>}
      </div>
    </div>
  );
};

export default DoctorRegistrationPage;
