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
  apiKey: "AIzaSyB2sKWEJUe8lN3KSaC7Z4SvMVJI8AMvT7U",
  authDomain: "mychatt-6cf4e.firebaseapp.com",
  projectId: "mychatt-6cf4e",
  storageBucket: "mychatt-6cf4e.appspot.com",
  messagingSenderId: "282770822965",
  appId: "1:282770822965:web:9875fd3a6c80cd6ed81e7c",
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

const UserRegister = () => {
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
      // const userCredential = await createUserWithEmailAndPassword(
      //   auth,
      //   email,
      //   password
      // );
      // const idToken = await getIdToken(userCredential.user);

      // Send data to backend
      const response = await axiosInstance.post("/register", {
        email,
        password,
        name,
        // idToken,
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
      const response = await axiosInstance.post("/login", { idToken });
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
    <div className="register-container">
      <h1>{isRegistering ? "Register" : "Login"}</h1>

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
          />
        </div>
        <button type="submit" className="register-button">
          {isRegistering ? "Register" : "Login"}
        </button>
      </form>

      <div>
        <button onClick={handleGoogleLogin}>Google Login</button>
        <button onClick={() => setIsRegistering(!isRegistering)}>
          {isRegistering
            ? "Already have an account? Login"
            : "Don't have an account? Register"}
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">Success! Redirecting...</p>}
    </div>
  );
};

export default UserRegister;
