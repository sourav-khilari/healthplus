import { useState } from "react";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  getIdToken,
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import axios from "axios";
import "../styles/Register.css";

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

// Axios Instance
const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api/v1/users", // Change to your backend URL
  withCredentials: true, // For handling cookies
});

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isRegistering, setIsRegistering] = useState(true); // Switch between Register and Login

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const { email, password, name } = formData;

    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await getIdToken(result.user);

      const response = await axiosInstance.post("/register", {
        email,
        password,
        name,
      });
     
      console.log(response.data);
      alert("Registration successful");

      setSuccess(true);
      setError(null);
    } catch (error) {
      console.error("Registration Error:", error.message);
      setError("Registration failed: " + error.message);
      setSuccess(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const idToken = await getIdToken(userCredential.user);

      // Send data to backend
      const response = await axiosInstance.post("/login", { idToken });
      console.log(response.data);
      alert("Login successful");

      setSuccess(true);
      setError(null);
    } catch (error) {
      console.error("Login Error:", error.message);
      setError("Login failed: " + error.message);
      setSuccess(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await getIdToken(result.user);

      // Send data to backend
      const response = await axiosInstance.post("/register", { idToken });
      console.log(response.data);
      alert("Google Login/Registration successful");

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
        <h2 className="register-title">
          {isRegistering ? "Register" : "Login"}
        </h2>

        <form
          onSubmit={isRegistering ? handleRegister : handleLogin}
          className="register-form"
        >
          {isRegistering && (
            <div className="form-group">
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="input-field"
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="input-field"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="input-field"
            />
          </div>

          <button type="submit" className="submit-btn">
            {isRegistering ? "Register" : "Login"}
          </button>
        </form>

        <div className="alternate-actions">
          <button onClick={handleGoogleLogin} className="google-login-btn">
            Google Login
          </button>
          <button
            onClick={() => setIsRegistering(!isRegistering)}
            className="toggle-btn"
          >
            {isRegistering
              ? "Already have an account? Login"
              : "Don't have an account? Register"}
          </button>
        </div>

        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">Success! Redirecting...</p>}
      </div>
    </div>
  );
};

export default Register;
