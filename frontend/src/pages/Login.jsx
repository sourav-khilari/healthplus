import { useState } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  getIdToken,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Login.css";

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

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const axiosInstance = axios.create({
    baseURL: "http://localhost:8000/api/v1/users", // Backend API URL
    withCredentials: true, // Handle cookies
  });

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, provider);
      const idToken = await getIdToken(result.user);

      // Send token to backend
      const response = await axiosInstance.post("/register", { idToken });
      console.log(response.data);

      alert("Login successful!");
      navigate("/profile"); // Redirect to profile page
    } catch (error) {
      console.error("Google Login Error:", error.message);
      alert("Google login failed!");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = async () => {
    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const idToken = await getIdToken(userCredential.user);

      const response = await axiosInstance.post("/login", { idToken });
      console.log(response.data);

      if (response.data.message === "Admin login successful") {
        alert("Login successful! Welcome, Admin.");
        navigate("/medstore/admin/menu"); // Redirect to admin dashboard
      } else if (response.data.message === "User login successful") {
        alert("Login successful! Welcome, User.");
        navigate("/userdashboard"); // Redirect to user dashboard
      } else {
        alert("Unexpected response from server.");
      }
    } catch (error) {
      console.error("Email Login Error:", error.message);
      alert("Login failed! Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const redirectToRegister = () => {
    navigate("/register");
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1 className="login-title">Login to HealthPlus</h1>
        <div className="form-container">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
          />
          <button
            onClick={handleEmailLogin}
            disabled={loading}
            className="email-login-btn"
          >
            {loading ? "Logging in..." : "Login with Email"}
          </button>
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="google-login-btn"
          >
            {loading ? "Logging in..." : "Sign in with Google"}
          </button>
          <p className="or-text">or</p>
          <p className="register-text">Do not have an account?</p>
          <button onClick={redirectToRegister} className="register-btn">
            Register Here
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
