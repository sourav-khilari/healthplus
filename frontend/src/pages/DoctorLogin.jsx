import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { initializeApp } from "firebase/app";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword, getIdToken } from "firebase/auth";

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

const DoctorLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const axiosInstance = axios.create({
    baseURL: "http://localhost:8000", // Change to your backend URL
    withCredentials: true, // For handling cookies
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const idToken = await getIdToken(userCredential.user); // Get Firebase ID token

      // Send token to backend
      const response = await axiosInstance.post("/api/v1/doctor/login", {
        email,
        password,
        idToken,
      });

      console.log(response.data);

      // On successful login, notify and redirect
      toast.success(response.data.message || "Login successful!");
      navigate("/doctordashboard"); // Redirect to doctor dashboard
    } catch (error) {
      console.error("Login Error:", error);
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Doctor Login</h2>
      <form onSubmit={handleLogin} className="form-container">
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            className="input-field"
          />
        </div>

        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            className="input-field"
          />
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default DoctorLogin;
